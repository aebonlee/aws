import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { requestPayment } from '../lib/portone'
import '../styles/pricing.css'

const PLANS = [
  {
    id: 'monthly',
    name: '1개월 요금제',
    price: 9900,
    priceLabel: '9,900원',
    period: '/ 월',
    perMonth: '9,900원/월',
    features: [
      '모든 학습 콘텐츠 접근',
      '도장깨기 퀴즈 무제한',
      '개인 대시보드',
      '학습 진행 추적',
      '커뮤니티 접근',
    ],
    highlight: false,
  },
  {
    id: 'quarterly',
    name: '3개월 요금제',
    price: 19900,
    priceLabel: '19,900원',
    period: '/ 3개월',
    perMonth: '월 6,633원',
    features: [
      '모든 학습 콘텐츠 접근',
      '도장깨기 퀴즈 무제한',
      '개인 대시보드',
      '학습 진행 추적',
      '커뮤니티 접근',
      '33% 할인 혜택',
    ],
    highlight: true,
  },
]

export default function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromTrial = (location.state as { fromTrial?: boolean })?.fromTrial === true
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async (plan: typeof PLANS[0]) => {
    if (!user) {
      navigate('/login')
      return
    }

    setProcessing(plan.id)
    setError(null)

    try {
      const result = await requestPayment({
        planName: `AWS Certification - ${plan.name}`,
        amount: plan.price,
        buyerEmail: user.email || '',
        buyerName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      })
      alert(`결제가 완료되었습니다! (거래번호: ${result.imp_uid})`)
    } catch (err) {
      setError(typeof err === 'string' ? err : '결제에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="pricing-page">
      <div className="container">
        {fromTrial && (
          <div className="pricing-trial-banner">
            <strong>무료 체험이 종료되었습니다</strong>
            <p>5개 페이지를 무료로 체험하셨습니다. 요금제를 선택하시면 모든 학습 콘텐츠를 무제한으로 이용할 수 있습니다.</p>
          </div>
        )}

        <div className="pricing-hero">
          <h1>요금제</h1>
          <p>AWS 자격증 학습을 위한 합리적인 요금제를 선택하세요.</p>
        </div>

        <div className="pricing-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`pricing-card ${plan.highlight ? 'highlight' : ''}`}>
              {plan.highlight && <span className="pricing-badge">추천</span>}
              <h3 className="pricing-plan-name">{plan.name}</h3>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.priceLabel}</span>
                <span className="pricing-period">{plan.period}</span>
              </div>
              <p className="pricing-per-month">{plan.perMonth}</p>

              <ul className="pricing-features">
                {plan.features.map((f, i) => (
                  <li key={i}><span className="pricing-check">✓</span> {f}</li>
                ))}
              </ul>

              <button
                className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'} pricing-btn`}
                onClick={() => handlePayment(plan)}
                disabled={processing === plan.id}
              >
                {processing === plan.id ? '처리 중...' : '결제하기'}
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="pricing-error">
            <p>{error}</p>
          </div>
        )}

        <div className="pricing-info">
          <h3>자주 묻는 질문</h3>
          <div className="pricing-faq">
            <div className="pricing-faq-item">
              <strong>결제 수단은 무엇인가요?</strong>
              <p>신용카드/체크카드로 결제할 수 있습니다.</p>
            </div>
            <div className="pricing-faq-item">
              <strong>환불은 가능한가요?</strong>
              <p>환불은 개인 대시보드에 학습 내역이 없을 때 가능합니다.</p>
            </div>
            <div className="pricing-faq-item">
              <strong>요금제 기간이 지나면?</strong>
              <p>학습 진행 데이터는 유지되며, 재결제 시 이어서 학습할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
