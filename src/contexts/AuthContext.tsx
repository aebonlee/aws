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
    // 프로필 존재 확인
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', authUser.id)
      .maybeSingle()

    // 트리거 미작동 시 수동 생성 (upsert로 안전하게)
    if (!existing) {
      const meta = authUser.user_metadata || {}
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: authUser.id,
          email: authUser.email || '',
          display_name: meta.full_name || meta.name || meta.preferred_username || '',
          avatar_url: meta.avatar_url || meta.picture || '',
          provider: meta.provider || authUser.app_metadata?.provider || 'email',
          role: 'member',
          signup_domain: window.location.hostname,
          visited_sites: [window.location.hostname],
        }, { onConflict: 'id' })
      if (error) {
        console.error('ensureProfile upsert error:', error)
      }
    } else {
      // 기존 프로필: visited_sites 업데이트
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('visited_sites')
        .eq('id', authUser.id)
        .maybeSingle()

      const sites = Array.isArray(profileData?.visited_sites) ? profileData.visited_sites as string[] : []
      const hostname = window.location.hostname
      if (!sites.includes(hostname)) {
        supabase.from('user_profiles')
          .update({
            visited_sites: [...sites, hostname],
            last_sign_in_at: new Date().toISOString(),
          })
          .eq('id', authUser.id)
          .then(() => {})
      }
    }

    // 계정 상태 체크
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
    let mounted = true

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted) return
      setSession(s)
      if (s?.user) {
        if (s.refresh_token) setSharedSession(s.refresh_token)
        await ensureProfile(s.user)
      } else {
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
      if (mounted) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      setSession(session)
      if (session?.refresh_token) setSharedSession(session.refresh_token)
      if (_event === 'SIGNED_OUT') clearSharedSession()
      if (session?.user) {
        await ensureProfile(session.user)
      }
      if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [ensureProfile])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  const signInWithKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut({ scope: 'local' })
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
