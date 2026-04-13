import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

// --- Types ---

export interface SectionProgress {
  completedAt: string | null
  reviewStatus: 'none' | 'completed' | 'needs-review'
}

export interface QuizAttempt {
  score: number
  total: number
  percentage: number
  timestamp: string
  passed: boolean
}

export type StampTier = 'none' | 'bronze' | 'silver' | 'gold'

export interface CategoryProgress {
  // v1 backward compat
  studied: boolean
  quizScore: number | null
  quizTotal: number
  completedAt: string | null
  // v2 additions
  sections: Record<string, SectionProgress>
  quizHistory: QuizAttempt[]
  stampTier: StampTier
  lastStudiedAt: string | null
  totalStudyVisits: number
}

interface ProgressState {
  [categoryId: string]: CategoryProgress
}

interface StoredData {
  _schemaVersion?: number
  [key: string]: any
}

export interface OverallStats {
  totalCategories: number
  studiedCount: number
  clearedCount: number
  goldCount: number
  silverCount: number
  bronzeCount: number
  completionRate: number
  totalQuizAttempts: number
  averageScore: number
  totalSectionsCompleted: number
  totalSections: number
}

interface ProgressContextType {
  progress: ProgressState
  markStudied: (categoryId: string) => void
  saveQuizResult: (categoryId: string, score: number, total: number) => void
  resetProgress: () => void
  getCompletionRate: () => number
  isCleared: (categoryId: string) => boolean
  markSectionComplete: (categoryId: string, sectionId: string) => void
  markSectionNeedsReview: (categoryId: string, sectionId: string) => void
  getSectionProgress: (categoryId: string, sectionId: string) => SectionProgress
  getStampTier: (categoryId: string) => StampTier
  getQuizHistory: (categoryId: string) => QuizAttempt[]
  getOverallStats: () => OverallStats
  recordStudyVisit: (categoryId: string) => void
}

const STORAGE_KEY = 'aws-aif-c01-progress'
const SCHEMA_VERSION = 2
const MAX_QUIZ_HISTORY = 20

const defaultSectionProgress: SectionProgress = {
  completedAt: null,
  reviewStatus: 'none',
}

function ensureCategoryV2(cat: any): CategoryProgress {
  return {
    studied: cat?.studied ?? false,
    quizScore: cat?.quizScore ?? null,
    quizTotal: cat?.quizTotal ?? 0,
    completedAt: cat?.completedAt ?? null,
    sections: cat?.sections ?? {},
    quizHistory: cat?.quizHistory ?? [],
    stampTier: cat?.stampTier ?? 'none',
    lastStudiedAt: cat?.lastStudiedAt ?? null,
    totalStudyVisits: cat?.totalStudyVisits ?? 0,
  }
}

function computeStampTier(history: QuizAttempt[]): StampTier {
  if (history.length === 0) return 'none'
  const best = Math.max(...history.map(h => h.percentage))
  // Gold: 100% or 90%+ 3 consecutive times
  if (best >= 100) return 'gold'
  if (history.length >= 3) {
    const last3 = history.slice(-3)
    if (last3.every(h => h.percentage >= 90)) return 'gold'
  }
  // Silver: 85%+
  if (best >= 85) return 'silver'
  // Bronze: 70%+
  if (best >= 70) return 'bronze'
  return 'none'
}

function migrateV1toV2(raw: StoredData): { state: ProgressState; version: number } {
  if (raw._schemaVersion === SCHEMA_VERSION) {
    const { _schemaVersion, ...rest } = raw
    return { state: rest as ProgressState, version: SCHEMA_VERSION }
  }

  // v1 migration
  const { _schemaVersion, ...categories } = raw
  const migrated: ProgressState = {}

  for (const [key, val] of Object.entries(categories)) {
    const v1 = val as any
    const cat = ensureCategoryV2(v1)

    // If had a quiz score, add to history
    if (v1?.quizScore != null && cat.quizHistory.length === 0) {
      const percentage = Math.round((v1.quizScore / v1.quizTotal) * 100)
      cat.quizHistory.push({
        score: v1.quizScore,
        total: v1.quizTotal,
        percentage,
        timestamp: v1.completedAt || new Date().toISOString(),
        passed: percentage >= 70,
      })
    }

    // If had completedAt, set bronze at minimum
    if (v1?.completedAt && cat.stampTier === 'none') {
      cat.stampTier = computeStampTier(cat.quizHistory)
      if (cat.stampTier === 'none') cat.stampTier = 'bronze'
    }

    migrated[key] = cat
  }

  return { state: migrated, version: SCHEMA_VERSION }
}

function loadProgress(): ProgressState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return {}
    const raw = JSON.parse(saved) as StoredData
    const { state } = migrateV1toV2(raw)
    return state
  } catch {
    return {}
  }
}

function saveProgress(state: ProgressState) {
  const toStore: StoredData = { _schemaVersion: SCHEMA_VERSION, ...state }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const getOrCreate = (prev: ProgressState, categoryId: string): CategoryProgress => {
    return ensureCategoryV2(prev[categoryId])
  }

  const markStudied = useCallback((categoryId: string) => {
    setProgress(prev => {
      const cat = getOrCreate(prev, categoryId)
      return { ...prev, [categoryId]: { ...cat, studied: true } }
    })
  }, [])

  const saveQuizResult = useCallback((categoryId: string, score: number, total: number) => {
    setProgress(prev => {
      const cat = getOrCreate(prev, categoryId)
      const percentage = Math.round((score / total) * 100)
      const passed = percentage >= 70
      const attempt: QuizAttempt = {
        score,
        total,
        percentage,
        timestamp: new Date().toISOString(),
        passed,
      }
      const newHistory = [...cat.quizHistory, attempt].slice(-MAX_QUIZ_HISTORY)
      const newTier = computeStampTier(newHistory)

      return {
        ...prev,
        [categoryId]: {
          ...cat,
          studied: cat.studied || true,
          quizScore: score,
          quizTotal: total,
          completedAt: passed ? new Date().toISOString() : cat.completedAt,
          quizHistory: newHistory,
          stampTier: newTier,
        },
      }
    })
  }, [])

  const resetProgress = useCallback(() => {
    setProgress({})
  }, [])

  const getCompletionRate = useCallback(() => {
    const categories = Object.values(progress)
    if (categories.length === 0) return 0
    const cleared = categories.filter(c => c.completedAt !== null).length
    return Math.round((cleared / 8) * 100)
  }, [progress])

  const isCleared = useCallback((categoryId: string) => {
    return progress[categoryId]?.completedAt != null
  }, [progress])

  const markSectionComplete = useCallback((categoryId: string, sectionId: string) => {
    setProgress(prev => {
      const cat = getOrCreate(prev, categoryId)
      return {
        ...prev,
        [categoryId]: {
          ...cat,
          sections: {
            ...cat.sections,
            [sectionId]: {
              completedAt: new Date().toISOString(),
              reviewStatus: 'completed',
            },
          },
        },
      }
    })
  }, [])

  const markSectionNeedsReview = useCallback((categoryId: string, sectionId: string) => {
    setProgress(prev => {
      const cat = getOrCreate(prev, categoryId)
      return {
        ...prev,
        [categoryId]: {
          ...cat,
          sections: {
            ...cat.sections,
            [sectionId]: {
              ...cat.sections[sectionId],
              reviewStatus: 'needs-review',
            },
          },
        },
      }
    })
  }, [])

  const getSectionProgress = useCallback((categoryId: string, sectionId: string): SectionProgress => {
    return progress[categoryId]?.sections?.[sectionId] ?? defaultSectionProgress
  }, [progress])

  const getStampTier = useCallback((categoryId: string): StampTier => {
    return progress[categoryId]?.stampTier ?? 'none'
  }, [progress])

  const getQuizHistory = useCallback((categoryId: string): QuizAttempt[] => {
    return progress[categoryId]?.quizHistory ?? []
  }, [progress])

  const getOverallStats = useCallback((): OverallStats => {
    const cats = Object.values(progress)
    const totalCategories = 8
    const studiedCount = cats.filter(c => c.studied).length
    const clearedCount = cats.filter(c => c.completedAt != null).length
    const goldCount = cats.filter(c => c.stampTier === 'gold').length
    const silverCount = cats.filter(c => c.stampTier === 'silver').length
    const bronzeCount = cats.filter(c => c.stampTier === 'bronze').length

    const allAttempts = cats.flatMap(c => c.quizHistory ?? [])
    const totalQuizAttempts = allAttempts.length
    const averageScore = totalQuizAttempts > 0
      ? Math.round(allAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizAttempts)
      : 0

    let totalSectionsCompleted = 0
    let totalSections = 0
    for (const cat of cats) {
      if (cat.sections) {
        for (const sec of Object.values(cat.sections)) {
          totalSections++
          if (sec.reviewStatus === 'completed') totalSectionsCompleted++
        }
      }
    }

    return {
      totalCategories,
      studiedCount,
      clearedCount,
      goldCount,
      silverCount,
      bronzeCount,
      completionRate: Math.round((clearedCount / totalCategories) * 100),
      totalQuizAttempts,
      averageScore,
      totalSectionsCompleted,
      totalSections,
    }
  }, [progress])

  const recordStudyVisit = useCallback((categoryId: string) => {
    setProgress(prev => {
      const cat = getOrCreate(prev, categoryId)
      return {
        ...prev,
        [categoryId]: {
          ...cat,
          lastStudiedAt: new Date().toISOString(),
          totalStudyVisits: (cat.totalStudyVisits || 0) + 1,
        },
      }
    })
  }, [])

  return (
    <ProgressContext.Provider value={{
      progress, markStudied, saveQuizResult, resetProgress, getCompletionRate, isCleared,
      markSectionComplete, markSectionNeedsReview, getSectionProgress,
      getStampTier, getQuizHistory, getOverallStats, recordStudyVisit,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress must be used within ProgressProvider')
  return context
}
