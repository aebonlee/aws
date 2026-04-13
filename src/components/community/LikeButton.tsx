import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface LikeButtonProps {
  targetType: 'post' | 'comment'
  targetId: string
  initialCount: number
}

export default function LikeButton({ targetType, targetId, initialCount }: LikeButtonProps) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setLiked(true)
      })
  }, [user, targetType, targetId])

  const toggle = async () => {
    if (!user || loading) return
    setLoading(true)

    if (liked) {
      setLiked(false)
      setCount((c) => Math.max(0, c - 1))
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
    } else {
      setLiked(true)
      setCount((c) => c + 1)
      await supabase
        .from('likes')
        .insert({ user_id: user.id, target_type: targetType, target_id: targetId })
    }

    setLoading(false)
  }

  return (
    <button
      className={`community-like-btn${liked ? ' liked' : ''}`}
      onClick={toggle}
      disabled={!user || loading}
      title={user ? '' : '로그인이 필요합니다'}
    >
      {liked ? '❤️' : '🤍'} {count}
    </button>
  )
}
