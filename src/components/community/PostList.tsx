import PostCard from './PostCard'

interface PostItem {
  id: string
  title: string
  content: string
  author_name?: string
  author_avatar?: string
  created_at: string
  view_count: number
  like_count: number
  comment_count: number
  is_pinned?: boolean
  category?: string
  tags?: string[]
}

interface PostListProps {
  posts: PostItem[]
  basePath: string
  emptyIcon?: string
  emptyText?: string
  hasMore?: boolean
  loading?: boolean
  onLoadMore?: () => void
  badgeField?: 'category' | 'tags'
}

export default function PostList({
  posts, basePath, emptyIcon = '📝', emptyText = '아직 작성된 글이 없습니다.',
  hasMore, loading, onLoadMore, badgeField,
}: PostListProps) {
  if (posts.length === 0 && !loading) {
    return (
      <div className="community-empty">
        <span className="community-empty-icon">{emptyIcon}</span>
        <p>{emptyText}</p>
      </div>
    )
  }

  return (
    <>
      <div className="community-list">
        {posts.map((post) => {
          let badge: string | undefined
          if (badgeField === 'category' && post.category) badge = post.category
          if (badgeField === 'tags' && post.tags?.length) badge = post.tags[0]

          return (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              authorName={post.author_name}
              authorAvatar={post.author_avatar}
              createdAt={post.created_at}
              viewCount={post.view_count}
              likeCount={post.like_count}
              commentCount={post.comment_count}
              isPinned={post.is_pinned}
              badge={badge}
              linkTo={`${basePath}/${post.id}`}
            />
          )
        })}
      </div>
      {hasMore && (
        <div className="community-load-more">
          <button onClick={onLoadMore} disabled={loading}>
            {loading ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}
    </>
  )
}
