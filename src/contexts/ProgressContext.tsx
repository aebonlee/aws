import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export interface CategoryProgress {
  studied: boolean
  quizScore: number | null
  quizTotal: number
  completedAt: string | null
}

interface ProgressState {
  [categoryId: string]: CategoryProgress
}

interface ProgressContextType {
  progress: ProgressState
  markStudied: (categoryId: string) => void
  saveQuizResult: (categoryId: string, score: number, total: number) => void
  resetProgress: () => void
  getCompletionRate: () => number
  isCleared: (categoryId: string) => boolean
}

const STORAGE_KEY = 'aws-aif-c01-progress'

const defaultProgress: ProgressState = {}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultProgress
    } catch {
      return defaultProgress
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const markStudied = useCallback((categoryId: string) => {
    setProgress(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        studied: true,
        quizScore: prev[categoryId]?.quizScore ?? null,
        quizTotal: prev[categoryId]?.quizTotal ?? 0,
        completedAt: prev[categoryId]?.completedAt ?? null,
      }
    }))
  }, [])

  const saveQuizResult = useCallback((categoryId: string, score: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        studied: prev[categoryId]?.studied ?? true,
        quizScore: score,
        quizTotal: total,
        completedAt: score / total >= 0.7 ? new Date().toISOString() : null,
      }
    }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress)
  }, [])

  const getCompletionRate = useCallback(() => {
    const categories = Object.values(progress)
    if (categories.length === 0) return 0
    const cleared = categories.filter(c => c.completedAt !== null).length
    return Math.round((cleared / 8) * 100)
  }, [progress])

  const isCleared = useCallback((categoryId: string) => {
    return progress[categoryId]?.completedAt !== null && progress[categoryId]?.completedAt !== undefined
  }, [progress])

  return (
    <ProgressContext.Provider value={{ progress, markStudied, saveQuizResult, resetProgress, getCompletionRate, isCleared }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress must be used within ProgressProvider')
  return context
}
