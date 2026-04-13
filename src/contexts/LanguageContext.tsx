import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'ko' | 'en'

interface LanguageContextType {
  lang: Lang
  toggleLang: () => void
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('aws-lang')
      if (saved === 'en' || saved === 'ko') return saved
      return 'ko'
    } catch {
      return 'ko'
    }
  })

  useEffect(() => {
    localStorage.setItem('aws-lang', lang)
  }, [lang])

  const toggleLang = () => setLang(prev => prev === 'ko' ? 'en' : 'ko')

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLang must be used within LanguageProvider')
  return context
}
