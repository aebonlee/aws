import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import '../../styles/admin.css'

interface MemberRow {
  id: string
  email: string
  display_name: string
  role: string
  created_at: string
  last_sign_in_at: string | null
  signup_domain: string | null
}

type Tab = 'members' | 'stats'
type RoleFilter = 'all' | 'admin' | 'member'

const PER_PAGE = 20

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('members')

  /* ---------- member state ---------- */
  const [members, setMembers] = useState<MemberRow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [loading, setLoading] = useState(false)

  /* ---------- stats state ---------- */
  const [todayCount, setTodayCount] = useState(0)
  const [weekCount, setWeekCount] = useState(0)

  /* ---------- fetch members ---------- */
  const fetchMembers = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    try {
      let query = supabase
        .from('user_profiles')
        .select('id,email,display_name,role,created_at,last_sign_in_at,signup_domain', { count: 'exact' })

      if (search) {
        query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`)
      }
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter)
      }

      const from = (page - 1) * PER_PAGE
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, from + PER_PAGE - 1)

      if (error) throw error
      setMembers((data as MemberRow[]) || [])
      setTotalCount(count ?? 0)
    } catch (err) {
      console.error('Failed to fetch members:', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  /* ---------- fetch stats ---------- */
  useEffect(() => {
    if (!supabase) return
    ;(async () => {
      try {
        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString()

        const { count: tc } = await supabase
          .from('user_profiles')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', todayStart)
        setTodayCount(tc ?? 0)

        const { count: wc } = await supabase
          .from('user_profiles')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', weekStart)
        setWeekCount(wc ?? 0)
      } catch {
        // ignore
      }
    })()
  }, [])

  /* ---------- delete ---------- */
  const handleDelete = async (id: string, email: string) => {
    if (!supabase) return
    if (!window.confirm(`${email} 회원을 삭제하시겠습니까?`)) return
    try {
      const { error } = await supabase.from('user_profiles').delete().eq('id', id)
      if (error) throw error
      fetchMembers()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const totalPages = Math.ceil(totalCount / PER_PAGE)
  const adminCount = useMemo(() => members.filter((m) => m.role === 'admin').length, [members])

  /* ---------- render ---------- */
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h3>Admin</h3>
        <nav className="admin-nav">
          <button className={`admin-nav-item ${tab === 'members' ? 'active' : ''}`} onClick={() => setTab('members')}>
            Members
          </button>
          <button className={`admin-nav-item ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>
            Stats
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {tab === 'members' && (
          <>
            <div className="admin-header">
              <h1>Members ({totalCount})</h1>
            </div>

            <div className="admin-dashboard-stats">
              <div className="admin-stat-card-v2">
                <div className="stat-label">Total Members</div>
                <div className="stat-value">{totalCount}</div>
              </div>
              <div className="admin-stat-card-v2">
                <div className="stat-label">Admins</div>
                <div className="stat-value">{adminCount}</div>
              </div>
              <div className="admin-stat-card-v2">
                <div className="stat-label">Today</div>
                <div className="stat-value">{todayCount}</div>
              </div>
              <div className="admin-stat-card-v2">
                <div className="stat-label">This Week</div>
                <div className="stat-value">{weekCount}</div>
              </div>
            </div>

            <div className="admin-toolbar-v2">
              <input
                type="text"
                placeholder="Search email or name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
              <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value as RoleFilter); setPage(1) }}>
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>

            {loading ? (
              <div className="admin-empty">Loading...</div>
            ) : members.length === 0 ? (
              <div className="admin-empty">No members found.</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Signup Domain</th>
                      <th>Joined</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.email}</td>
                        <td>{m.display_name || '-'}</td>
                        <td>
                          <span className={`badge ${m.role === 'admin' ? 'badge-admin' : 'badge-member'}`}>
                            {m.role}
                          </span>
                        </td>
                        <td>{m.signup_domain || '-'}</td>
                        <td>{m.created_at ? new Date(m.created_at).toLocaleDateString() : '-'}</td>
                        <td>{m.last_sign_in_at ? new Date(m.last_sign_in_at).toLocaleDateString() : '-'}</td>
                        <td>
                          <button className="admin-btn-delete" onClick={() => handleDelete(m.id, m.email)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
                <span>{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}

        {tab === 'stats' && (
          <>
            <div className="admin-header">
              <h1>Statistics</h1>
            </div>
            <div className="admin-dashboard-stats">
              <div className="admin-stat-card-v2">
                <div className="stat-label">Total Members</div>
                <div className="stat-value">{totalCount}</div>
              </div>
              <div className="admin-stat-card-v2">
                <div className="stat-label">Admins</div>
                <div className="stat-value">{adminCount}</div>
              </div>
              <div className="admin-stat-card-v2">
                <div className="stat-label">Today Signups</div>
                <div className="stat-value">{todayCount}</div>
              </div>
              <div className="admin-stat-card-v2">
                <div className="stat-label">Week Signups</div>
                <div className="stat-value">{weekCount}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
