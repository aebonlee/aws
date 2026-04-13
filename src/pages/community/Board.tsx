import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { BOARD_CATEGORIES, PAGE_SIZE, type Post } from '../../lib/community'
import FilterTabs from '../../components/community/FilterTabs'
import PostList from '../../components/community/PostList'
import WriteForm from '../../components/community/WriteForm'

export default function Board() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [category, setCategory] = useState('')
  const [showWrite, setShowWrite] = useState(false)

  const load = useCallback(async (pageNum: number, cat: string, append = false) => {
    setLoading(true)
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('posts_with_author')
      .select('*')
      .eq('type', 'board')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (cat) query = query.eq('category', cat)

    const { data } = await query
    if (data) {
      setPosts((prev) => append ? [...prev, ...data] : data)
      setHasMore(data.length === PAGE_SIZE)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    setPage(0)
    load(0, category)
  }, [category, load])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    load(next, category, true)
  }

  if (showWrite) {
    return (
      <section className="community-page">
        <div className="container">
          <WriteForm
            type="board"
            onCancel={() => setShowWrite(false)}
            backPath="/community/board"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-hero">
          <h1>게시판</h1>
          <p>자유롭게 의견을 나누고 질문해보세요.</p>
        </div>

        <div className="community-toolbar">
          <FilterTabs
            tabs={BOARD_CATEGORIES}
            active={category}
            onChange={setCategory}
          />
          {user && (
            <button className="btn btn-primary" onClick={() => setShowWrite(true)}>
              글쓰기
            </button>
          )}
        </div>

        {loading && posts.length === 0 ? (
          <div className="loading-spinner">로딩 중...</div>
        ) : (
          <PostList
            posts={posts}
            basePath="/community/board"
            emptyIcon="📋"
            emptyText="아직 작성된 게시글이 없습니다."
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
            badgeField="category"
          />
        )}
      </div>
    </section>
  )
}
