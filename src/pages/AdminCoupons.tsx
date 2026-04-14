import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../lib/community'
import {
  createCoupon,
  listCoupons,
  toggleCouponActive,
  generateCouponCode,
  getRedemptionsForAdmin,
  getCouponStats,
  type Coupon,
  type CouponRedemptionWithUser,
  type CouponStats,
} from '../lib/coupon'
import '../styles/coupon.css'

type DashboardTab = 'coupons' | 'history'

export default function AdminCoupons() {
  const { user } = useAuth()
  const admin = isAdmin(user)

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [redemptions, setRedemptions] = useState<CouponRedemptionWithUser[]>([])
  const [stats, setStats] = useState<CouponStats>({ total: 0, active: 0, totalRedemptions: 0, usageRate: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<DashboardTab>('coupons')
  const [expandedCouponId, setExpandedCouponId] = useState<string | null>(null)

  // Form state
  const [type, setType] = useState<'discount' | 'period'>('discount')
  const [value, setValue] = useState(30)
  const [code, setCode] = useState('')
  const [maxUses, setMaxUses] = useState(1)
  const [expiresAt, setExpiresAt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadData = async () => {
    try {
      const [couponData, redemptionData] = await Promise.all([
        listCoupons(),
        getRedemptionsForAdmin().catch(() => [] as CouponRedemptionWithUser[]),
      ])
      setCoupons(couponData)
      setRedemptions(redemptionData)
      setStats(getCouponStats(couponData))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (admin) loadData()
    else setLoading(false)
  }, [admin])

  const handleGenerate = () => {
    setCode(generateCouponCode())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !code.trim()) return

    setSubmitting(true)
    setMessage(null)
    try {
      await createCoupon({
        code: code.trim(),
        type,
        value,
        max_uses: maxUses,
        expires_at: expiresAt || null,
        created_by: user.id,
      })
      setMessage({ type: 'success', text: `쿠폰 "${code.trim()}" 생성 완료!` })
      setCode('')
      setValue(type === 'discount' ? 30 : 1)
      setMaxUses(1)
      setExpiresAt('')
      await loadData()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '쿠폰 생성에 실패했습니다.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (coupon: Coupon) => {
    try {
      await toggleCouponActive(coupon.id, !coupon.is_active)
      await loadData()
    } catch {
      alert('상태 변경에 실패했습니다.')
    }
  }

  const getRedemptionsForCoupon = (couponId: string) =>
    redemptions.filter(r => r.coupon_id === couponId)

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })

  if (!admin) {
    return <div className="admin-no-access">권한이 없습니다.</div>
  }

  return (
    <div className="admin-coupons-page">
      <div className="container">
        <h1>쿠폰 관리</h1>

        {/* Stats Cards */}
        {!loading && (
          <div className="coupon-stats-grid">
            <div className="coupon-stat-card">
              <span className="coupon-stat-value">{stats.total}</span>
              <span className="coupon-stat-label">총 쿠폰 수</span>
            </div>
            <div className="coupon-stat-card">
              <span className="coupon-stat-value">{stats.active}</span>
              <span className="coupon-stat-label">활성 쿠폰</span>
            </div>
            <div className="coupon-stat-card">
              <span className="coupon-stat-value">{stats.totalRedemptions}</span>
              <span className="coupon-stat-label">총 사용 횟수</span>
            </div>
            <div className="coupon-stat-card">
              <span className="coupon-stat-value">{stats.usageRate}%</span>
              <span className="coupon-stat-label">사용률</span>
            </div>
          </div>
        )}

        {/* Create form */}
        <form className="admin-coupon-form" onSubmit={handleSubmit}>
          <h2>새 쿠폰 생성</h2>

          <div className="admin-coupon-row">
            <div className="admin-coupon-field">
              <label>타입</label>
              <select value={type} onChange={e => {
                const t = e.target.value as 'discount' | 'period'
                setType(t)
                setValue(t === 'discount' ? 30 : 1)
              }}>
                <option value="discount">할인 쿠폰</option>
                <option value="period">기간 이용권</option>
              </select>
            </div>
            <div className="admin-coupon-field">
              <label>{type === 'discount' ? '할인율' : '기간'}</label>
              <select value={value} onChange={e => setValue(Number(e.target.value))}>
                {type === 'discount' ? (
                  <>
                    <option value={30}>30%</option>
                    <option value={50}>50%</option>
                  </>
                ) : (
                  <>
                    <option value={1}>1일</option>
                    <option value={3}>3일</option>
                    <option value={7}>7일</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="admin-coupon-code-row">
            <div className="admin-coupon-field">
              <label>쿠폰 코드</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="AWS-XXXX-XXXX"
                required
                maxLength={20}
              />
            </div>
            <button type="button" className="admin-coupon-gen-btn" onClick={handleGenerate}>
              자동 생성
            </button>
          </div>

          <div className="admin-coupon-row">
            <div className="admin-coupon-field">
              <label>사용 횟수 제한</label>
              <input
                type="number"
                min={1}
                max={9999}
                value={maxUses}
                onChange={e => setMaxUses(Number(e.target.value))}
              />
            </div>
            <div className="admin-coupon-field">
              <label>만료일 (선택)</label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <p className={`coupon-message coupon-message-${message.type}`}>{message.text}</p>
          )}

          <button type="submit" className="admin-coupon-submit" disabled={submitting || !code.trim()}>
            {submitting ? '생성 중...' : '쿠폰 생성'}
          </button>
        </form>

        {/* Tab Navigation */}
        <div className="coupon-dashboard-tabs">
          <button
            className={`coupon-dashboard-tab ${activeTab === 'coupons' ? 'active' : ''}`}
            onClick={() => setActiveTab('coupons')}
          >
            쿠폰 목록
          </button>
          <button
            className={`coupon-dashboard-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            전체 사용 내역
          </button>
        </div>

        {/* Tab: Coupon list with accordion */}
        {activeTab === 'coupons' && (
          <>
            {loading ? (
              <p>로딩 중...</p>
            ) : coupons.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>생성된 쿠폰이 없습니다.</p>
            ) : (
              <div className="dashboard-table-wrap">
                <table className="admin-coupon-table">
                  <thead>
                    <tr>
                      <th>코드</th>
                      <th>타입</th>
                      <th>값</th>
                      <th>사용/한도</th>
                      <th>만료일</th>
                      <th>생성일</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => {
                      const couponRedemptions = getRedemptionsForCoupon(c.id)
                      const isExpanded = expandedCouponId === c.id
                      return (
                        <tr key={c.id} className="coupon-row-group">
                          <td colSpan={7} style={{ padding: 0, border: 'none' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <tbody>
                                <tr
                                  className={`coupon-row-clickable ${isExpanded ? 'expanded' : ''}`}
                                  onClick={() => setExpandedCouponId(isExpanded ? null : c.id)}
                                  title="클릭하여 사용자 목록 보기"
                                >
                                  <td><code>{c.code}</code></td>
                                  <td>{c.type === 'discount' ? '할인' : '기간'}</td>
                                  <td>{c.type === 'discount' ? `${c.value}%` : `${c.value}일`}</td>
                                  <td>
                                    {c.used_count}/{c.max_uses}
                                    {couponRedemptions.length > 0 && (
                                      <span className="coupon-expand-icon">{isExpanded ? '▲' : '▼'}</span>
                                    )}
                                  </td>
                                  <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('ko-KR') : '-'}</td>
                                  <td>{new Date(c.created_at).toLocaleDateString('ko-KR')}</td>
                                  <td>
                                    <button
                                      className={`admin-coupon-toggle ${c.is_active ? 'active' : 'inactive'}`}
                                      onClick={(e) => { e.stopPropagation(); handleToggle(c) }}
                                    >
                                      {c.is_active ? '활성' : '비활성'}
                                    </button>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className="coupon-accordion-row">
                                    <td colSpan={7}>
                                      <div className="coupon-accordion-content">
                                        {couponRedemptions.length === 0 ? (
                                          <p className="coupon-no-users">아직 사용한 회원이 없습니다.</p>
                                        ) : (
                                          <table className="coupon-users-table">
                                            <thead>
                                              <tr>
                                                <th>이메일</th>
                                                <th>이름</th>
                                                <th>사용일시</th>
                                                <th>{c.type === 'period' ? '이용권 만료일' : '적용 할인율'}</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {couponRedemptions.map(r => (
                                                <tr key={r.redemption_id}>
                                                  <td>{r.user_email}</td>
                                                  <td>{r.user_name || '-'}</td>
                                                  <td>{formatDateTime(r.redeemed_at)}</td>
                                                  <td>
                                                    {c.type === 'period'
                                                      ? (r.period_expires_at ? formatDateTime(r.period_expires_at) : '-')
                                                      : (r.applied_discount_percent ? `${r.applied_discount_percent}%` : '-')
                                                    }
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Tab: Full redemption history */}
        {activeTab === 'history' && (
          <div className="dashboard-table-wrap">
            {redemptions.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>사용 내역이 없습니다.</p>
            ) : (
              <table className="coupon-history-table">
                <thead>
                  <tr>
                    <th>쿠폰코드</th>
                    <th>타입</th>
                    <th>회원이메일</th>
                    <th>회원이름</th>
                    <th>사용일시</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map(r => (
                    <tr key={r.redemption_id}>
                      <td><code>{r.coupon_code}</code></td>
                      <td>{r.coupon_type === 'discount' ? `할인 ${r.coupon_value}%` : `기간 ${r.coupon_value}일`}</td>
                      <td>{r.user_email}</td>
                      <td>{r.user_name || '-'}</td>
                      <td>{formatDateTime(r.redeemed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
