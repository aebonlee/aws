import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'secure-architecture', title: '안전한 아키텍처 (30%)' },
  { id: 'resilient-architecture', title: '탄력적 아키텍처 (26%)' },
  { id: 'high-performance', title: '고성능 아키텍처 (24%)' },
  { id: 'cost-optimized', title: '비용 최적화 (20%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: '상태 비저장 방화벽으로 서브넷 레벨에서 트래픽을 제어하는 것은?', options: ['보안 그룹', 'NACL', 'WAF', 'Shield'], answer: 1, explanation: 'NACL은 서브넷 레벨의 상태 비저장 방화벽입니다.' },
  { question: 'RDS 읽기 성능을 향상시키는 방법은?', options: ['Multi-AZ', 'Read Replica', '인스턴스 크기 증가', '스토리지 변경'], answer: 1, explanation: 'Read Replica는 읽기 트래픽을 분산시켜 성능을 향상시킵니다.' },
  { question: '서버리스 아키텍처에 해당하지 않는 서비스는?', options: ['Lambda', 'Fargate', 'EC2', 'DynamoDB'], answer: 2, explanation: 'EC2는 서버 기반 서비스입니다.' },
  { question: 'S3 객체를 90일 후 Glacier로 자동 이동하려면?', options: ['버전 관리', '수명 주기 정책', '복제 규칙', '버킷 정책'], answer: 1, explanation: 'S3 수명 주기 정책으로 스토리지 클래스를 자동 전환합니다.' },
  { question: 'DynamoDB 전용 인메모리 캐시는?', options: ['ElastiCache', 'CloudFront', 'DAX', 'Lambda@Edge'], answer: 2, explanation: 'DAX는 DynamoDB 전용 인메모리 캐시로 마이크로초 응답을 제공합니다.' },
  { question: 'RPO가 0에 가까운 재해 복구 전략은?', options: ['Backup & Restore', 'Pilot Light', 'Warm Standby', 'Multi-Site Active'], answer: 3, explanation: 'Multi-Site Active-Active는 RPO/RTO가 가장 낮습니다.' },
  { question: 'EC2에서 최대 90% 할인, 중단 가능한 인스턴스는?', options: ['Reserved', 'On-Demand', 'Spot', 'Dedicated'], answer: 2, explanation: '스팟 인스턴스는 2분 경고 후 회수될 수 있습니다.' },
  { question: 'VPC에서 S3에 프라이빗 접근하는 방법은?', options: ['NAT Gateway', 'Internet Gateway', 'VPC Gateway Endpoint', 'Direct Connect'], answer: 2, explanation: 'Gateway Endpoint는 인터넷 없이 S3에 접근합니다.' },
  { question: 'HTTP 경로 기반 라우팅을 지원하는 로드밸런서는?', options: ['CLB', 'ALB', 'NLB', 'GLB'], answer: 1, explanation: 'ALB는 L7에서 경로/호스트 기반 라우팅을 지원합니다.' },
  { question: '전송 중 데이터를 암호화하는 프로토콜은?', options: ['SSE-S3', 'SSE-KMS', 'TLS/SSL', 'AES-256'], answer: 2, explanation: 'TLS/SSL은 전송 중 암호화 프로토콜입니다.' },
]

export default function SaaC03() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('saa-c03') }, [markStudied])

  return (
    <GuideLayout title="Solutions Architect Associate" description="AWS에서 안전하고 강력한 애플리케이션을 설계하는 능력을 검증합니다." icon="🏗️" badges={[{ label: 'Associate', type: 'primary' }, { label: '65문제 / 130분', type: 'info' }]} sections={sections} categoryId="saa-c03">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>SAA-C03</td></tr>
          <tr><td><strong>문항 수</strong></td><td>65문제</td></tr>
          <tr><td><strong>시험 시간</strong></td><td>130분</td></tr>
          <tr><td><strong>합격 점수</strong></td><td>720 / 1000</td></tr>
          <tr><td><strong>비용</strong></td><td>$150 USD</td></tr>
          <tr><td><strong>권장 경력</strong></td><td>1년 이상</td></tr>
        </tbody></table>
        <TipBox type="important"><p>AWS에서 가장 인기 있는 자격증. 클라우드 아키텍트 커리어의 첫 단계입니다.</p></TipBox>
      </section>

      <section id="secure-architecture">
        <h2>안전한 아키텍처 설계 (30%)</h2>
        <h3>보안 그룹 vs NACL</h3>
        <table className="info-table"><thead><tr><th>구분</th><th>보안 그룹</th><th>NACL</th></tr></thead><tbody>
          <tr><td><strong>상태</strong></td><td>상태 저장 (Stateful)</td><td>상태 비저장 (Stateless)</td></tr>
          <tr><td><strong>레벨</strong></td><td>인스턴스</td><td>서브넷</td></tr>
          <tr><td><strong>규칙</strong></td><td>허용만</td><td>허용 + 거부</td></tr>
          <tr><td><strong>기본</strong></td><td>모든 인바운드 차단</td><td>모든 트래픽 허용</td></tr>
        </tbody></table>

        <h3>데이터 암호화</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>방법</th><th>서비스</th></tr></thead><tbody>
          <tr><td><strong>전송 중</strong></td><td>TLS/SSL</td><td>ALB, CloudFront, API Gateway</td></tr>
          <tr><td><strong>저장 시</strong></td><td>SSE-S3, SSE-KMS, CSE</td><td>S3, EBS, RDS</td></tr>
        </tbody></table>

        <ToggleSection title="VPC 엔드포인트 - Gateway vs Interface">
          <table className="info-table"><thead><tr><th>유형</th><th>대상</th><th>비용</th></tr></thead><tbody>
            <tr><td><strong>Gateway</strong></td><td>S3, DynamoDB</td><td>무료</td></tr>
            <tr><td><strong>Interface</strong></td><td>대부분의 AWS 서비스</td><td>시간당 과금</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="resilient-architecture">
        <h2>탄력적 아키텍처 설계 (26%)</h2>
        <h3>ELB 유형</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>계층</th><th>프로토콜</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>ALB</strong></td><td>L7</td><td>HTTP/HTTPS</td><td>경로/호스트 기반 라우팅</td></tr>
          <tr><td><strong>NLB</strong></td><td>L4</td><td>TCP/UDP</td><td>초저지연, 고성능</td></tr>
          <tr><td><strong>GLB</strong></td><td>L3</td><td>IP</td><td>서드파티 방화벽 연동</td></tr>
        </tbody></table>

        <h3>재해 복구 전략</h3>
        <table className="info-table"><thead><tr><th>전략</th><th>RTO/RPO</th><th>비용</th></tr></thead><tbody>
          <tr><td><strong>Backup & Restore</strong></td><td>높음</td><td>최저</td></tr>
          <tr><td><strong>Pilot Light</strong></td><td>중간</td><td>저</td></tr>
          <tr><td><strong>Warm Standby</strong></td><td>낮음</td><td>중</td></tr>
          <tr><td><strong>Multi-Site</strong></td><td>최저</td><td>최고</td></tr>
        </tbody></table>
        <TipBox type="warning"><p>RTO(복구 시간 목표)와 RPO(복구 시점 목표) 개념을 반드시 이해하세요.</p></TipBox>
      </section>

      <section id="high-performance">
        <h2>고성능 아키텍처 설계 (24%)</h2>
        <h3>EC2 인스턴스 유형</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>패밀리</th><th>용도</th></tr></thead><tbody>
          <tr><td><strong>범용</strong></td><td>T, M</td><td>웹서버, 소규모 DB</td></tr>
          <tr><td><strong>컴퓨팅</strong></td><td>C</td><td>배치 처리, 과학 모델링</td></tr>
          <tr><td><strong>메모리</strong></td><td>R, X</td><td>인메모리 DB, 캐시</td></tr>
          <tr><td><strong>스토리지</strong></td><td>I, D</td><td>데이터 웨어하우스</td></tr>
          <tr><td><strong>가속</strong></td><td>P, G</td><td>ML, 그래픽</td></tr>
        </tbody></table>

        <h3>캐싱 전략</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>CloudFront</strong></td><td>정적/동적 콘텐츠</td><td>엣지 캐싱</td></tr>
          <tr><td><strong>ElastiCache</strong></td><td>DB 쿼리 결과</td><td>Redis/Memcached</td></tr>
          <tr><td><strong>DAX</strong></td><td>DynamoDB</td><td>마이크로초 응답</td></tr>
        </tbody></table>

        <ToggleSection title="ElastiCache - Redis vs Memcached">
          <table className="info-table"><thead><tr><th>기능</th><th>Redis</th><th>Memcached</th></tr></thead><tbody>
            <tr><td>데이터 구조</td><td>String, List, Set, Hash 등</td><td>String만</td></tr>
            <tr><td>복제</td><td>지원 (Multi-AZ)</td><td>미지원</td></tr>
            <tr><td>지속성</td><td>지원 (AOF, RDB)</td><td>미지원</td></tr>
            <tr><td>멀티스레드</td><td>단일 스레드</td><td>멀티스레드</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="cost-optimized">
        <h2>비용 최적화 아키텍처 설계 (20%)</h2>
        <h3>EC2 구매 옵션</h3>
        <table className="info-table"><thead><tr><th>옵션</th><th>할인</th><th>약정</th><th>적합</th></tr></thead><tbody>
          <tr><td><strong>온디맨드</strong></td><td>없음</td><td>없음</td><td>예측 불가 워크로드</td></tr>
          <tr><td><strong>Reserved</strong></td><td>최대 72%</td><td>1~3년</td><td>안정적 워크로드</td></tr>
          <tr><td><strong>Savings Plans</strong></td><td>최대 72%</td><td>사용량 약정</td><td>유연한 선택</td></tr>
          <tr><td><strong>Spot</strong></td><td>최대 90%</td><td>없음</td><td>배치, CI/CD</td></tr>
        </tbody></table>

        <h3>비용 관리 도구</h3>
        <table className="info-table"><thead><tr><th>도구</th><th>기능</th></tr></thead><tbody>
          <tr><td><strong>Cost Explorer</strong></td><td>비용 시각화, 12개월 예측</td></tr>
          <tr><td><strong>Budgets</strong></td><td>예산 설정, 초과 알림</td></tr>
          <tr><td><strong>Compute Optimizer</strong></td><td>ML 기반 인스턴스 적정 규모 추천</td></tr>
          <tr><td><strong>Trusted Advisor</strong></td><td>비용/성능/보안 최적화 권고</td></tr>
        </tbody></table>
        <TipBox type="important"><p>"가장 비용 효율적인" 솔루션을 묻는 문제가 자주 출제됩니다.</p></TipBox>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="saa-c03" categoryTitle="Solutions Architect Associate" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
