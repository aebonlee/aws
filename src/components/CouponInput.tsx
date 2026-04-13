import { useState } from 'react'
import { useCoupon } from '../contexts/CouponContext'
import '../styles/coupon.css'

interface CouponInputProps {
  className?: string
}

export default function CouponInput({ className = '' }: CouponInputProps) {
  const { applyCoupon } = useCoupon()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || loading) return

    setLoading(true)
    setMessage(null)

    const result = await applyCoupon(code.trim())
    if (result.ok) {
      setMessage({ type: 'success', text: result.message })
      setCode('')
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setLoading(false)
  }

  return (
    <div className={`coupon-input-wrapper ${className}`}>
      <form className="coupon-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="coupon-input-field"
          placeholder="쿠폰 코드 입력 (예: AWS-XXXX-XXXX)"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          disabled={loading}
          maxLength={20}
        />
        <button type="submit" className="coupon-input-btn" disabled={loading || !code.trim()}>
          {loading ? '확인 중...' : '적용'}
        </button>
      </form>
      {message && (
        <p className={`coupon-message coupon-message-${message.type}`}>{message.text}</p>
      )}
    </div>
  )
}
