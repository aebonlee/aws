import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { TIP_TAGS, PAGE_SIZE, type Post } from '../../lib/community'
import FilterTabs from '../../components/community/FilterTabs'
import PostList from '../../components/community/PostList'
import WriteForm from '../../components/community/WriteForm'

export default function Tips() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [tag, setTag] = useState('')
  const [showWrite, setShowWrite] = useState(false)

  const load = useCallback(async (pageNum: number, tagFilter: string, append = false) => {
    setLoading(true)
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('posts_with_author')
      .select('*')
      .eq('type', 'tip')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (tagFilter) query = query.contains('tags', [tagFilter])

    const { data } = await query
    if (data) {
      setPosts((prev) => append ? [...prev, ...data] : data)
      setHasMore(data.length === PAGE_SIZE)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    setPage(0)
    load(0, tag)
  }, [tag, load])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    load(next, tag, true)
  }

  if (showWrite) {
    return (
      <section className="community-page">
        <div className="container">
          <WriteForm
            type="tip"
            onCancel={() => setShowWrite(false)}
            backPath="/community/tips"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-hero">
          <h1>시험팁공유</h1>
          <p>유용한 학습 팁과 시험 전략을 공유해보세요.</p>
        </div>

        <div className="community-toolbar">
          <FilterTabs
            tabs={TIP_TAGS}
            active={tag}
            onChange={setTag}
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
            basePath="/community/tips"
            emptyIcon="💡"
            emptyText="아직 작성된 팁이 없습니다."
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
            badgeField="tags"
          />
        )}
      </div>
    </section>
  )
}
