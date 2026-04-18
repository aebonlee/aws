import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase, setSharedSession, getSharedSession, clearSharedSession } from '../lib/supabase'
import { ADMIN_EMAILS } from '../config/admin'
import { useToast } from './ToastContext'
import { useIdleTimeout } from '../hooks/useIdleTimeout'
import ProfileCompleteModal from '../components/ProfileCompleteModal';

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
  const { showToast } = useToast()

  
  // ─── 프로필 완성 체크용 user_profiles 로드 ───
  const [_userProfile, _setUserProfile] = useState<any>(null);
  const _loadUserProfile = useCallback(async (uid: string) => {
    try {
      const { data } = await supabase!.from('user_profiles').select('name,phone').eq('id', uid).maybeSingle();
      _setUserProfile(data);
    } catch { _setUserProfile(null); }
  }, []);

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
    await _loadUserProfile(authUser.id);
  }, [])

  useEffect(() => {
    let mounted = true

    const safeEnsureProfile = async (authUser: User) => {
      try {
        await Promise.race([
          ensureProfile(authUser),
          new Promise((_, reject) => setTimeout(() => reject(new Error('profile timeout')), 5000)),
        ])
      } catch (e) {
        console.warn('ensureProfile timeout/error, continuing:', e)
      }
    }

    // 글로벌 안전장치: 7초 후에도 loading이면 강제 해제
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        setLoading(prev => {
          if (prev) console.warn('Auth: 7s safety timeout, forcing loading=false')
          return false
        })
      }
    }, 7000)

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted) return
      setSession(s)
      if (s?.user) {
        if (s.refresh_token) setSharedSession(s.refresh_token)
        await safeEnsureProfile(s.user)
      } else {
        // SSO 쿠키로 세션 복원 시도
        const rt = getSharedSession()
        if (rt) {
          try {
            const { data } = await supabase.auth.refreshSession({ refresh_token: rt })
            if (data.session) {
              setSession(data.session)
              await safeEnsureProfile(data.session.user)
            } else {
              clearSharedSession()
            }
          } catch {
            clearSharedSession()
          }
        }
      }
      if (mounted) setLoading(false)
    }).catch(() => {
      // 네트워크 오류 등에서도 안전하게 로딩 해제
      if (mounted) {
        setSession(null)
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setSession(session)
      if (session?.refresh_token) setSharedSession(session.refresh_token)
      if (_event === 'SIGNED_OUT') clearSharedSession()
      if (session?.user) {
        // fire-and-forget (await 제거하여 hang 방지)
        safeEnsureProfile(session.user)
      }
      if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, [ensureProfile])

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
      if (error) {
        console.error('Google login error:', error.message)
        showToast('Google 로그인에 실패했습니다.', 'error')
      }
    } catch (err) {
      console.error('Google login error:', err)
      showToast('Google 로그인에 실패했습니다.', 'error')
    }
  }

  const signInWithKakao = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: { redirectTo: window.location.origin },
      })
      if (error) {
        console.error('Kakao login error:', error.message)
        showToast('카카오 로그인에 실패했습니다.', 'error')
      }
    } catch (err) {
      console.error('Kakao login error:', err)
      showToast('카카오 로그인에 실패했습니다.', 'error')
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'local' })
      clearSharedSession()
    } catch (err) {
      console.error('Logout error:', err)
      clearSharedSession()
    }
  }

  const user = session?.user ?? null

  // 10분 무동작 세션 타임아웃
  useIdleTimeout({
    enabled: !!user,
    onTimeout: () => {
      supabase.auth.signOut({ scope: 'local' })
      clearSharedSession()
    },
  })

  const allEmails = [
    user?.email,
    user?.user_metadata?.email as string | undefined,
    (user?.identities?.[0]?.identity_data as Record<string, unknown> | undefined)?.email as string | undefined,
  ].filter((e): e is string => Boolean(e)).map((e) => e.toLowerCase())
  const isAdmin = allEmails.some((e) => ADMIN_EMAILS.includes(e))
  const refreshProfile = useCallback(async () => { if (user) await _loadUserProfile(user.id); }, [user, _loadUserProfile]);
  const needsProfileCompletion = !!user && !!_userProfile && (!_userProfile.name || !_userProfile.phone);


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
      {needsProfileCompletion && user && (
        <ProfileCompleteModal user={user} onComplete={refreshProfile} />
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
