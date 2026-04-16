import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase, setSharedSession, getSharedSession, clearSharedSession } from '../lib/supabase'
import { ADMIN_EMAILS } from '../config/admin'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  isAdmin: boolean
  signInWithGoogle: () => Promise<void>
  signInWithKakao: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const ensureProfile = useCallback(async (authUser: User) => {
    try {
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', authUser.id)
        .single()

      if (!existing) {
        const meta = authUser.user_metadata || {}
        await supabase
          .from('user_profiles')
          .insert({
            id: authUser.id,
            name: meta.full_name || meta.name || '',
            email: authUser.email || '',
            gender: '',
            phone: '',
            usertype: 0
          })
      }
    } catch {
      // user_profiles 테이블 없거나 RLS 이슈 시 무시
    }

    // 도메인 추적
    try {
      await supabase.rpc('check_user_status', {
        target_user_id: authUser.id,
        current_domain: window.location.hostname,
      })
    } catch {
      // check_user_status 미존재 시 무시
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        await ensureProfile(session.user)
      }
      if (!session) {
        // SSO 쿠키로 세션 복원 시도
        const rt = getSharedSession()
        if (rt) {
          try {
            const { data } = await supabase.auth.refreshSession({ refresh_token: rt })
            if (data.session) {
              setSession(data.session)
              await ensureProfile(data.session.user)
            } else {
              clearSharedSession()
            }
          } catch {
            clearSharedSession()
          }
        }
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.refresh_token) setSharedSession(session.refresh_token)
      if (_event === 'SIGNED_OUT') clearSharedSession()
      if (session?.user) {
        await ensureProfile(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [ensureProfile])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signInWithKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    clearSharedSession()
  }

  const user = session?.user ?? null
  const allEmails = [
    user?.email,
    user?.user_metadata?.email as string | undefined,
    (user?.identities?.[0]?.identity_data as Record<string, unknown> | undefined)?.email as string | undefined,
  ].filter((e): e is string => Boolean(e)).map((e) => e.toLowerCase())
  const isAdmin = allEmails.some((e) => ADMIN_EMAILS.includes(e))

  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading,
      isAdmin,
      signInWithGoogle,
      signInWithKakao,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
