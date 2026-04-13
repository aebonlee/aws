import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../lib/community'
import {
  createCoupon,
  listCoupons,
  toggleCouponActive,
  generateCouponCode,
  type Coupon,
} from '../lib/coupon'
import '../styles/coupon.css'

export default function AdminCoupons() {
  const { user } = useAuth()
  const admin = isAdmin(user)

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [type, setType] = useState<'discount' | 'period'>('discount')
  const [value, setValue] = useState(30)
  const [code, setCode] = useState('')
  const [maxUses, setMaxUses] = useState(1)
  const [expiresAt, setExpiresAt] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadCoupons = async () => {
    try {
      const data = await listCoupons()
      setCoupons(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (admin) loadCoupons()
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
      await loadCoupons()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '쿠폰 생성에 실패했습니다.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (coupon: Coupon) => {
    try {
      await toggleCouponActive(coupon.id, !coupon.is_active)
      await loadCoupons()
    } catch {
      alert('상태 변경에 실패했습니다.')
    }
  }

  if (!admin) {
    return <div className="admin-no-access">권한이 없습니다.</div>
  }

  return (
    <div className="admin-coupons-page">
      <div className="container">
        <h1>쿠폰 관리</h1>

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

        {/* Coupon list */}
        <h2>쿠폰 목록</h2>
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
                {coupons.map(c => (
                  <tr key={c.id}>
                    <td><code>{c.code}</code></td>
                    <td>{c.type === 'discount' ? '할인' : '기간'}</td>
                    <td>{c.type === 'discount' ? `${c.value}%` : `${c.value}일`}</td>
                    <td>{c.used_count}/{c.max_uses}</td>
                    <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('ko-KR') : '-'}</td>
                    <td>{new Date(c.created_at).toLocaleDateString('ko-KR')}</td>
                    <td>
                      <button
                        className={`admin-coupon-toggle ${c.is_active ? 'active' : 'inactive'}`}
                        onClick={() => handleToggle(c)}
                      >
                        {c.is_active ? '활성' : '비활성'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
