import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { isAdmin, PAGE_SIZE, type Post } from '../../lib/community'
import PostList from '../../components/community/PostList'
import WriteForm from '../../components/community/WriteForm'

export default function Inquiry() {
  const { user } = useAuth()
  const admin = isAdmin(user)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [showWrite, setShowWrite] = useState(false)

  const load = useCallback(async (pageNum: number, append = false) => {
    setLoading(true)
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('posts_with_author')
      .select('*')
      .eq('type', 'inquiry')
      .order('created_at', { ascending: false })
      .range(from, to)

    // 일반 사용자는 본인 문의만 조회, 관리자는 전체 조회
    if (!admin && user) {
      query = query.eq('author_id', user.id)
    }

    const { data } = await query
    if (data) {
      setPosts((prev) => append ? [...prev, ...data] : data)
      setHasMore(data.length === PAGE_SIZE)
    }
    setLoading(false)
  }, [admin, user])

  useEffect(() => { load(0) }, [load])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    load(next, true)
  }

  if (showWrite) {
    return (
      <section className="community-page">
        <div className="container">
          <WriteForm
            type="inquiry"
            onCancel={() => setShowWrite(false)}
            backPath="/community/inquiry"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-hero">
          <h1>문의하기</h1>
          <p>{admin ? '회원들의 문의 내역을 확인하고 답변하세요.' : '궁금한 점이나 건의사항을 남겨주세요.'}</p>
        </div>

        <div className="community-toolbar">
          <div />
          {user && (
            <button className="btn btn-primary" onClick={() => setShowWrite(true)}>
              문의 작성
            </button>
          )}
        </div>

        {loading && posts.length === 0 ? (
          <div className="loading-spinner">로딩 중...</div>
        ) : (
          <PostList
            posts={posts}
            basePath="/community/inquiry"
            emptyIcon="💬"
            emptyText={admin ? '접수된 문의가 없습니다.' : '작성한 문의가 없습니다.'}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </section>
  )
}
