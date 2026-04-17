import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

let nextId = 0

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => setExiting(true), 3000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  useEffect(() => {
    if (exiting) {
      const t = setTimeout(() => onRemove(toast.id), 300)
      return () => clearTimeout(t)
    }
  }, [exiting, toast.id, onRemove])

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setExiting(true)
  }

  const bgColor = toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6'
  const icon = toast.type === 'success' ? '\u2705' : toast.type === 'error' ? '\u274c' : '\u2139\ufe0f'

  return (
    <div
      role="alert"
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: bgColor, color: '#fff',
        padding: '12px 16px', borderRadius: '8px', marginBottom: '8px',
        fontSize: '14px', fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,.15)',
        animation: exiting ? 'toastFadeOut .3s ease forwards' : 'toastSlideIn .3s ease',
      }}
    >
      <span>{icon}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={handleClose}
        aria-label="닫기"
        style={{
          background: 'none', border: 'none', color: '#fff',
          cursor: 'pointer', fontSize: '16px', padding: '0 4px',
        }}
      >
        &times;
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <>
          <style>{`
            @keyframes toastSlideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
            @keyframes toastFadeOut{from{opacity:1}to{opacity:0}}
          `}</style>
          <div
            aria-live="polite"
            style={{
              position: 'fixed', top: '16px', right: '16px', zIndex: 99998,
              display: 'flex', flexDirection: 'column', maxWidth: '360px',
            }}
          >
            {toasts.map(toast => (
              <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
          </div>
        </>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
