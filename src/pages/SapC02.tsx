import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'org-complexity', title: '조직 복잡성 설계 (26%)' },
  { id: 'new-solutions', title: '새 솔루션 설계 (29%)' },
  { id: 'improvement', title: '기존 솔루션 개선 (25%)' },
  { id: 'migration', title: '워크로드 마이그레이션 (20%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: '여러 AWS 계정을 중앙 관리하는 서비스는?', options: ['IAM', 'Organizations', 'Control Tower', 'Directory Service'], answer: 1, explanation: 'AWS Organizations는 다중 계정을 중앙에서 관리하고 SCP로 정책을 적용합니다.' },
  { question: 'Transit Gateway의 핵심 이점은?', options: ['비용 절감', '허브-스포크 네트워킹', 'DDoS 방어', '데이터 암호화'], answer: 1, explanation: 'Transit Gateway는 허브-스포크 모델로 수천 개 VPC를 중앙 연결합니다.' },
  { question: '멀티 리전 액티브-액티브 아키텍처에 적합한 DB는?', options: ['RDS Multi-AZ', 'Aurora Global', 'DynamoDB Global Tables', 'ElastiCache'], answer: 2, explanation: 'DynamoDB Global Tables는 멀티 리전 쓰기가 가능한 액티브-액티브 DB입니다.' },
  { question: 'AWS Control Tower의 주요 목적은?', options: ['비용 관리', '멀티 계정 환경 자동 설정', 'CI/CD 파이프라인', '모니터링'], answer: 1, explanation: 'Control Tower는 랜딩 존을 자동 설정하고 가드레일로 거버넌스를 적용합니다.' },
  { question: '온프레미스에서 AWS로 대규모 데이터 전송에 적합한 것은?', options: ['Direct Connect', 'VPN', 'Snow Family', 'DataSync'], answer: 2, explanation: 'Snow Family(Snowball, Snowmobile)는 페타바이트 이상 오프라인 전송에 적합합니다.' },
  { question: 'SCP(Service Control Policy)의 적용 범위는?', options: ['단일 사용자', '단일 계정', 'OU/계정 전체', '리전별'], answer: 2, explanation: 'SCP는 Organizations의 OU 또는 계정 전체에 권한 경계를 적용합니다.' },
  { question: 'Lambda@Edge의 용도는?', options: ['DB 쿼리', 'CloudFront 엣지에서 코드 실행', 'VPC 내 함수 실행', '배치 처리'], answer: 1, explanation: 'Lambda@Edge는 CloudFront 엣지 로케이션에서 요청/응답을 변환합니다.' },
  { question: 'Aurora Global Database의 복제 지연 시간은?', options: ['밀리초', '1초 미만', '5초', '분 단위'], answer: 1, explanation: 'Aurora Global Database는 보통 1초 미만의 크로스 리전 복제를 제공합니다.' },
  { question: 'AWS Migration Hub의 역할은?', options: ['데이터 전송', '마이그레이션 진행 추적', '비용 계산', '네트워크 설정'], answer: 1, explanation: 'Migration Hub는 여러 도구의 마이그레이션 진행 상황을 중앙에서 추적합니다.' },
  { question: '하이브리드 DNS 해석에 사용하는 서비스는?', options: ['Route 53 Resolver', 'CloudFront', 'Global Accelerator', 'API Gateway'], answer: 0, explanation: 'Route 53 Resolver Endpoints는 온프레미스↔AWS 간 DNS 쿼리를 전달합니다.' },
]

export default function SapC02() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('sap-c02') }, [markStudied])

  return (
    <GuideLayout title="Solutions Architect Professional" description="복잡한 멀티 계정, 하이브리드, 마이그레이션 아키텍처 설계 능력을 검증합니다." icon="🏛️" badges={[{ label: 'Professional', type: 'primary' }, { label: '75문제 / 180분', type: 'info' }]} sections={sections} categoryId="sap-c02">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>SAP-C02</td></tr>
          <tr><td><strong>문항 수</strong></td><td>75문제</td></tr>
          <tr><td><strong>시간 / 합격</strong></td><td>180분 / 750점</td></tr>
          <tr><td><strong>비용</strong></td><td>$300 USD</td></tr>
          <tr><td><strong>권장 경험</strong></td><td>2년 이상 AWS 설계 경험</td></tr>
        </tbody></table>
        <TipBox type="important"><p>AWS 최고 난이도 자격증 중 하나. 복잡한 시나리오 기반 문제가 출제됩니다.</p></TipBox>
      </section>

      <section id="org-complexity">
        <h2>조직 복잡성 설계 (26%)</h2>
        <h3>멀티 계정 전략</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>역할</th></tr></thead><tbody>
          <tr><td><strong>Organizations</strong></td><td>계정 관리, SCP, 통합 결제</td></tr>
          <tr><td><strong>Control Tower</strong></td><td>랜딩 존 자동 설정, 가드레일</td></tr>
          <tr><td><strong>RAM</strong></td><td>크로스 계정 리소스 공유</td></tr>
          <tr><td><strong>SSO (IAM Identity Center)</strong></td><td>중앙 집중 인증</td></tr>
        </tbody></table>

        <h3>네트워크 연결</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>용도</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>VPC Peering</strong></td><td>1:1 VPC 연결</td><td>전이적 라우팅 불가</td></tr>
          <tr><td><strong>Transit Gateway</strong></td><td>허브-스포크 연결</td><td>수천 VPC, VPN, DX 연결</td></tr>
          <tr><td><strong>Direct Connect</strong></td><td>전용 회선</td><td>1/10/100 Gbps</td></tr>
          <tr><td><strong>Site-to-Site VPN</strong></td><td>암호화 터널</td><td>인터넷 경유, 빠른 설정</td></tr>
        </tbody></table>
        <TipBox type="warning"><p>Transit Gateway vs VPC Peering 선택 기준: VPC 수가 많으면 TGW, 소수면 Peering.</p></TipBox>
      </section>

      <section id="new-solutions">
        <h2>새 솔루션 설계 (29%)</h2>
        <h3>멀티 리전 데이터베이스</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>복제 방식</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>Aurora Global</strong></td><td>읽기 전용 복제</td><td>1초 미만 복제, 재해 복구</td></tr>
          <tr><td><strong>DynamoDB Global Tables</strong></td><td>액티브-액티브</td><td>멀티 리전 쓰기 가능</td></tr>
          <tr><td><strong>ElastiCache Global</strong></td><td>읽기 복제</td><td>크로스 리전 캐시</td></tr>
        </tbody></table>

        <h3>이벤트 기반 아키텍처</h3>
        <ul>
          <li><strong>EventBridge:</strong> 이벤트 버스 (크로스 계정/리전)</li>
          <li><strong>SNS + SQS 팬아웃:</strong> 다중 소비자 비동기 처리</li>
          <li><strong>Step Functions:</strong> 복잡한 워크플로 오케스트레이션</li>
          <li><strong>Kinesis:</strong> 실시간 스트리밍 대량 데이터</li>
        </ul>

        <ToggleSection title="서버리스 아키텍처 패턴">
          <table className="info-table"><thead><tr><th>패턴</th><th>구성</th></tr></thead><tbody>
            <tr><td><strong>API 백엔드</strong></td><td>API Gateway + Lambda + DynamoDB</td></tr>
            <tr><td><strong>파일 처리</strong></td><td>S3 이벤트 + Lambda + SQS</td></tr>
            <tr><td><strong>실시간 분석</strong></td><td>Kinesis + Lambda + OpenSearch</td></tr>
            <tr><td><strong>웹 앱</strong></td><td>CloudFront + S3 + API Gateway</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="improvement">
        <h2>기존 솔루션 개선 (25%)</h2>
        <h3>성능 최적화</h3>
        <table className="info-table"><thead><tr><th>계층</th><th>서비스</th><th>전략</th></tr></thead><tbody>
          <tr><td><strong>네트워크</strong></td><td>CloudFront, Global Accelerator</td><td>엣지 캐싱, 경로 최적화</td></tr>
          <tr><td><strong>컴퓨팅</strong></td><td>Auto Scaling, Lambda</td><td>수평 확장, 서버리스</td></tr>
          <tr><td><strong>데이터베이스</strong></td><td>DAX, ElastiCache, Read Replica</td><td>캐싱, 읽기 분산</td></tr>
          <tr><td><strong>스토리지</strong></td><td>S3 Transfer Acceleration</td><td>엣지를 통한 빠른 업로드</td></tr>
        </tbody></table>

        <h3>비용 최적화 전략</h3>
        <ul>
          <li><strong>Compute Savings Plans:</strong> EC2, Lambda, Fargate 통합 할인</li>
          <li><strong>S3 Intelligent-Tiering:</strong> 접근 패턴 자동 분석 후 이동</li>
          <li><strong>스팟 인스턴스 + 온디맨드 혼합:</strong> ASG Mixed Instances Policy</li>
        </ul>
        <TipBox type="important"><p>Professional은 "최적의 솔루션"을 묻는 복합 시나리오가 핵심입니다.</p></TipBox>
      </section>

      <section id="migration">
        <h2>워크로드 마이그레이션 및 현대화 (20%)</h2>
        <h3>마이그레이션 전략 (7R)</h3>
        <table className="info-table"><thead><tr><th>전략</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>Rehost</strong></td><td>리프트 앤 시프트 (그대로 이전)</td></tr>
          <tr><td><strong>Replatform</strong></td><td>일부 최적화 후 이전</td></tr>
          <tr><td><strong>Refactor</strong></td><td>클라우드 네이티브로 재설계</td></tr>
          <tr><td><strong>Repurchase</strong></td><td>SaaS로 전환</td></tr>
          <tr><td><strong>Retire</strong></td><td>폐기</td></tr>
          <tr><td><strong>Retain</strong></td><td>유지 (이전 안 함)</td></tr>
          <tr><td><strong>Relocate</strong></td><td>VMware Cloud on AWS 등</td></tr>
        </tbody></table>

        <h3>마이그레이션 도구</h3>
        <table className="info-table"><thead><tr><th>도구</th><th>대상</th></tr></thead><tbody>
          <tr><td><strong>Application Migration Service</strong></td><td>서버 리호스팅 (리프트 앤 시프트)</td></tr>
          <tr><td><strong>DMS</strong></td><td>데이터베이스 마이그레이션</td></tr>
          <tr><td><strong>Snow Family</strong></td><td>대용량 오프라인 데이터 전송</td></tr>
          <tr><td><strong>DataSync</strong></td><td>온라인 데이터 전송</td></tr>
          <tr><td><strong>Migration Hub</strong></td><td>마이그레이션 진행 추적</td></tr>
        </tbody></table>

        <ToggleSection title="컨테이너 현대화 경로">
          <ul>
            <li><strong>ECS + Fargate:</strong> AWS 네이티브 서버리스 컨테이너</li>
            <li><strong>EKS:</strong> 쿠버네티스 기반 (기존 K8s 경험 활용)</li>
            <li><strong>App Runner:</strong> 소스 코드/이미지에서 자동 배포</li>
            <li><strong>App2Container:</strong> .NET/Java → 컨테이너 자동 변환</li>
          </ul>
        </ToggleSection>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="sap-c02" categoryTitle="Solutions Architect Professional" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
