import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'threat-detection', title: '위협 탐지 및 대응 (14%)' },
  { id: 'logging', title: '로깅 및 모니터링 (18%)' },
  { id: 'infra-security', title: '인프라 보안 (20%)' },
  { id: 'iam', title: 'IAM (16%)' },
  { id: 'data-protection', title: '데이터 보호 (18%)' },
  { id: 'governance', title: '관리 및 보안 거버넌스 (14%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'ML 기반으로 AWS 계정 위협을 탐지하는 서비스는?', options: ['Inspector', 'GuardDuty', 'Macie', 'Detective'], answer: 1, explanation: 'GuardDuty는 VPC Flow, CloudTrail, DNS 로그를 ML로 분석하여 위협을 탐지합니다.' },
  { question: 'KMS CMK 삭제 시 최소 대기 기간은?', options: ['즉시', '7일', '14일', '30일'], answer: 1, explanation: 'KMS 키 삭제는 최소 7일(기본 30일)의 대기 기간이 필요합니다.' },
  { question: 'VPC에서 트래픽 미러링의 주요 용도는?', options: ['로드밸런싱', '패킷 캡처 분석', '암호화', 'DNS 해석'], answer: 1, explanation: 'Traffic Mirroring은 ENI 트래픽을 복사하여 보안 분석에 사용합니다.' },
  { question: 'CloudTrail 로그 무결성 검증에 사용하는 기능은?', options: ['암호화', '로그 파일 검증', 'MFA Delete', '버전 관리'], answer: 1, explanation: 'CloudTrail 로그 파일 무결성 검증은 SHA-256 해시로 변조를 탐지합니다.' },
  { question: 'AWS WAF에서 SQL 인젝션을 방어하는 규칙은?', options: ['Rate-based', 'Managed Rules', 'Geo Match', 'IP Set'], answer: 1, explanation: 'AWS Managed Rules에 SQL 인젝션, XSS 등 OWASP 규칙이 포함됩니다.' },
  { question: 'S3 버킷의 퍼블릭 접근을 조직 전체에서 차단하는 방법은?', options: ['버킷 정책', 'S3 Block Public Access (계정)', 'SCP', 'NACL'], answer: 1, explanation: 'S3 Block Public Access를 계정/조직 수준에서 설정하여 일괄 차단합니다.' },
  { question: 'IAM Access Analyzer의 기능은?', options: ['MFA 관리', '외부 공유 리소스 식별', '비밀번호 정책', '역할 생성'], answer: 1, explanation: 'Access Analyzer는 외부 엔티티에 공유된 리소스를 자동으로 식별합니다.' },
  { question: 'ACM(Certificate Manager) 인증서 자동 갱신 조건은?', options: ['수동만 가능', 'DNS 검증 사용 시', '이메일 검증만', 'Route 53 필수'], answer: 1, explanation: 'DNS 검증을 사용한 ACM 인증서는 자동으로 갱신됩니다.' },
  { question: 'CloudHSM과 KMS의 차이는?', options: ['KMS가 더 비쌈', 'CloudHSM은 전용 하드웨어', 'KMS는 비대칭 키 미지원', 'CloudHSM이 더 간단'], answer: 1, explanation: 'CloudHSM은 전용 HSM 하드웨어로 FIPS 140-2 Level 3 인증을 제공합니다.' },
  { question: '보안 이벤트의 근본 원인을 시각적으로 분석하는 서비스는?', options: ['GuardDuty', 'Security Hub', 'Detective', 'Inspector'], answer: 2, explanation: 'Detective는 그래프 모델로 보안 이벤트 관계를 시각화하고 근본 원인을 분석합니다.' },
]

export default function ScsC02() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('scs-c02') }, [markStudied])

  return (
    <GuideLayout title="Security Specialty" description="AWS 환경의 보안 설계, 구현, 운영 전문 능력을 검증합니다." icon="🔐" badges={[{ label: 'Specialty', type: 'primary' }, { label: '65문제 / 170분', type: 'info' }]} sections={sections} categoryId="scs-c02">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>SCS-C02</td></tr>
          <tr><td><strong>문항 수</strong></td><td>65문제</td></tr>
          <tr><td><strong>시간 / 합격</strong></td><td>170분 / 750점</td></tr>
          <tr><td><strong>비용</strong></td><td>$300 USD</td></tr>
          <tr><td><strong>권장 경험</strong></td><td>5년 이상 보안 경험</td></tr>
        </tbody></table>
        <TipBox type="important"><p>AWS 보안 전문 자격증. 암호화, IAM, 네트워크 보안, 인시던트 대응이 핵심입니다.</p></TipBox>
      </section>

      <section id="threat-detection">
        <h2>위협 탐지 및 인시던트 대응 (14%)</h2>
        <h3>보안 탐지 서비스</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th><th>탐지 유형</th></tr></thead><tbody>
          <tr><td><strong>GuardDuty</strong></td><td>계정/네트워크/S3</td><td>ML 기반 위협 (포트 스캔, 암호화폐 채굴 등)</td></tr>
          <tr><td><strong>Inspector</strong></td><td>EC2/ECR/Lambda</td><td>소프트웨어 취약점, CVE</td></tr>
          <tr><td><strong>Macie</strong></td><td>S3</td><td>PII 등 민감 데이터 발견</td></tr>
          <tr><td><strong>Detective</strong></td><td>보안 이벤트</td><td>근본 원인 그래프 분석</td></tr>
        </tbody></table>

        <h3>인시던트 대응 자동화</h3>
        <ul>
          <li><strong>GuardDuty → EventBridge → Lambda:</strong> 침해 EC2 자동 격리</li>
          <li><strong>Config → SSM Automation:</strong> 규정 위반 자동 수정</li>
          <li><strong>Security Hub → EventBridge:</strong> 보안 결과 통합 대응</li>
        </ul>
        <TipBox type="warning"><p>GuardDuty 결과를 EventBridge로 자동 대응하는 패턴이 자주 출제됩니다.</p></TipBox>
      </section>

      <section id="logging">
        <h2>보안 로깅 및 모니터링 (18%)</h2>
        <h3>로깅 서비스</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th><th>보안 용도</th></tr></thead><tbody>
          <tr><td><strong>CloudTrail</strong></td><td>API 호출</td><td>감사, 포렌식</td></tr>
          <tr><td><strong>VPC Flow Logs</strong></td><td>네트워크 트래픽</td><td>비정상 트래픽 탐지</td></tr>
          <tr><td><strong>CloudWatch Logs</strong></td><td>애플리케이션/OS</td><td>오류 패턴, 접근 로그</td></tr>
          <tr><td><strong>S3 Access Logs</strong></td><td>S3 버킷 접근</td><td>데이터 접근 감사</td></tr>
          <tr><td><strong>WAF Logs</strong></td><td>HTTP 요청</td><td>공격 패턴 분석</td></tr>
        </tbody></table>

        <ToggleSection title="CloudTrail 로그 보호">
          <ul>
            <li><strong>로그 파일 검증:</strong> SHA-256 다이제스트로 무결성 확인</li>
            <li><strong>SSE-KMS 암호화:</strong> KMS로 로그 암호화</li>
            <li><strong>MFA Delete:</strong> S3 버킷에서 로그 삭제 방지</li>
            <li><strong>S3 Object Lock:</strong> WORM(Write Once Read Many) 보호</li>
          </ul>
        </ToggleSection>
      </section>

      <section id="infra-security">
        <h2>인프라 보안 (20%)</h2>
        <h3>네트워크 보안 계층</h3>
        <table className="info-table"><thead><tr><th>계층</th><th>서비스</th><th>기능</th></tr></thead><tbody>
          <tr><td><strong>엣지</strong></td><td>CloudFront + WAF + Shield</td><td>DDoS 방어, 웹 방화벽</td></tr>
          <tr><td><strong>VPC</strong></td><td>NACL + 보안 그룹</td><td>서브넷/인스턴스 방화벽</td></tr>
          <tr><td><strong>네트워크</strong></td><td>Network Firewall</td><td>VPC 레벨 IDS/IPS</td></tr>
          <tr><td><strong>호스트</strong></td><td>Inspector + SSM</td><td>취약점 스캔, 패치</td></tr>
        </tbody></table>

        <h3>AWS Shield</h3>
        <table className="info-table"><thead><tr><th>티어</th><th>보호</th><th>비용</th></tr></thead><tbody>
          <tr><td><strong>Standard</strong></td><td>L3/L4 DDoS 자동 방어</td><td>무료</td></tr>
          <tr><td><strong>Advanced</strong></td><td>고급 DDoS + DRT팀 + 비용 보호</td><td>$3,000/월</td></tr>
        </tbody></table>
      </section>

      <section id="iam">
        <h2>자격 증명 및 액세스 관리 (16%)</h2>
        <h3>IAM 정책 평가 로직</h3>
        <table className="info-table"><thead><tr><th>단계</th><th>평가</th></tr></thead><tbody>
          <tr><td><strong>1. 명시적 거부</strong></td><td>Deny가 있으면 즉시 거부</td></tr>
          <tr><td><strong>2. SCP</strong></td><td>Organizations SCP 확인</td></tr>
          <tr><td><strong>3. 리소스 정책</strong></td><td>크로스 계정 시 리소스 정책 확인</td></tr>
          <tr><td><strong>4. Permission Boundary</strong></td><td>최대 권한 경계 확인</td></tr>
          <tr><td><strong>5. 세션 정책</strong></td><td>STS 세션 범위 확인</td></tr>
          <tr><td><strong>6. 자격 증명 정책</strong></td><td>Allow가 있으면 허용</td></tr>
        </tbody></table>

        <h3>크로스 계정 접근</h3>
        <ul>
          <li><strong>IAM 역할 + AssumeRole:</strong> 가장 일반적인 패턴</li>
          <li><strong>리소스 기반 정책:</strong> S3, SQS, KMS 등</li>
          <li><strong>RAM (Resource Access Manager):</strong> 리소스 직접 공유</li>
        </ul>
        <TipBox type="important"><p>IAM 정책 평가 순서 (명시적 거부 → SCP → ... → Allow)를 반드시 이해하세요.</p></TipBox>
      </section>

      <section id="data-protection">
        <h2>데이터 보호 (18%)</h2>
        <h3>KMS 키 유형</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>관리</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>AWS 관리형</strong></td><td>AWS</td><td>자동 교체, 무료</td></tr>
          <tr><td><strong>고객 관리형 (CMK)</strong></td><td>고객</td><td>정책 제어, 교체 설정</td></tr>
          <tr><td><strong>가져온 키</strong></td><td>고객</td><td>수동 교체, 삭제 가능</td></tr>
        </tbody></table>

        <h3>KMS vs CloudHSM</h3>
        <table className="info-table"><thead><tr><th>항목</th><th>KMS</th><th>CloudHSM</th></tr></thead><tbody>
          <tr><td><strong>관리</strong></td><td>AWS 관리형</td><td>전용 하드웨어</td></tr>
          <tr><td><strong>인증</strong></td><td>FIPS 140-2 Level 2</td><td>FIPS 140-2 Level 3</td></tr>
          <tr><td><strong>멀티 테넌트</strong></td><td>예</td><td>아니오 (싱글 테넌트)</td></tr>
          <tr><td><strong>비용</strong></td><td>키당 $1/월</td><td>HSM당 ~$1.60/시간</td></tr>
        </tbody></table>

        <ToggleSection title="S3 암호화 옵션">
          <table className="info-table"><thead><tr><th>방식</th><th>키 관리</th><th>사용 사례</th></tr></thead><tbody>
            <tr><td><strong>SSE-S3</strong></td><td>AWS 자동</td><td>기본 암호화</td></tr>
            <tr><td><strong>SSE-KMS</strong></td><td>KMS CMK</td><td>감사, 세밀한 제어</td></tr>
            <tr><td><strong>SSE-C</strong></td><td>고객 제공</td><td>자체 키 관리</td></tr>
            <tr><td><strong>CSE</strong></td><td>클라이언트</td><td>업로드 전 암호화</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="governance">
        <h2>관리 및 보안 거버넌스 (14%)</h2>
        <h3>거버넌스 서비스</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>역할</th></tr></thead><tbody>
          <tr><td><strong>Organizations + SCP</strong></td><td>계정 수준 권한 경계</td></tr>
          <tr><td><strong>Control Tower</strong></td><td>멀티 계정 자동 설정 + 가드레일</td></tr>
          <tr><td><strong>Config</strong></td><td>리소스 구성 규정 준수 평가</td></tr>
          <tr><td><strong>Security Hub</strong></td><td>보안 결과 통합 (CIS, PCI DSS 벤치마크)</td></tr>
          <tr><td><strong>Audit Manager</strong></td><td>규정 준수 감사 자동화</td></tr>
        </tbody></table>
        <TipBox type="info"><p>Security Hub는 GuardDuty, Inspector, Macie 등의 결과를 통합하는 보안 대시보드입니다.</p></TipBox>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="scs-c02" categoryTitle="Security Specialty" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
