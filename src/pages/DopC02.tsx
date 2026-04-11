import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'sdlc', title: 'SDLC 자동화 (22%)' },
  { id: 'config-iac', title: '구성 관리 및 IaC (17%)' },
  { id: 'resilient', title: '탄력적 솔루션 (15%)' },
  { id: 'monitoring', title: '모니터링 및 로깅 (15%)' },
  { id: 'incident', title: '인시던트 및 이벤트 대응 (14%)' },
  { id: 'security', title: '보안 및 규정 준수 (17%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'CodePipeline에서 수동 승인을 추가하는 액션은?', options: ['Deploy', 'Invoke', 'Manual Approval', 'Test'], answer: 2, explanation: 'Manual Approval 액션으로 배포 전 수동 승인 단계를 추가합니다.' },
  { question: 'CloudFormation 드리프트 감지의 목적은?', options: ['코드 오류 탐지', '수동 변경 사항 감지', '비용 초과 경고', '보안 취약점 스캔'], answer: 1, explanation: '드리프트 감지는 콘솔/CLI로 수동 변경된 리소스를 식별합니다.' },
  { question: 'Blue/Green 배포에 적합한 서비스 조합은?', options: ['CodeDeploy + ECS', 'CodeBuild + S3', 'CodeCommit + SNS', 'CloudWatch + Lambda'], answer: 0, explanation: 'CodeDeploy는 ECS/Lambda/EC2에서 Blue/Green 배포를 지원합니다.' },
  { question: 'CloudWatch Logs Insights의 용도는?', options: ['메트릭 수집', '로그 데이터 쿼리 분석', '알람 설정', '대시보드 생성'], answer: 1, explanation: 'Logs Insights는 전용 쿼리 언어로 로그를 대화형 분석합니다.' },
  { question: 'EventBridge 규칙에서 크론 표현식의 용도는?', options: ['실시간 이벤트 필터링', '정기적 스케줄 실행', '메트릭 수집', '로그 전송'], answer: 1, explanation: '크론 표현식으로 Lambda 등을 정기적으로 실행합니다.' },
  { question: 'Systems Manager Automation의 핵심 기능은?', options: ['패치 설치', '반복 운영 작업 자동화', 'SSH 접속', '인벤토리 수집'], answer: 1, explanation: 'Automation은 Runbook으로 EC2 재시작, AMI 생성 등을 자동화합니다.' },
  { question: 'GuardDuty가 분석하는 데이터 소스가 아닌 것은?', options: ['VPC Flow Logs', 'CloudTrail 로그', 'DNS 로그', 'CloudWatch 메트릭'], answer: 3, explanation: 'GuardDuty는 VPC Flow, CloudTrail, DNS, S3 로그를 분석합니다.' },
  { question: 'Elastic Beanstalk .ebextensions의 용도는?', options: ['소스 코드 관리', '환경 구성 커스터마이징', '도메인 설정', '인증 관리'], answer: 1, explanation: '.ebextensions YAML로 패키지 설치, 환경 변수, 리소스를 설정합니다.' },
  { question: 'AWS Config 자동 수정에 사용하는 것은?', options: ['Lambda만', 'SSM Automation', 'Step Functions', 'CodePipeline'], answer: 1, explanation: 'Config 규칙 위반 시 SSM Automation Runbook으로 자동 수정합니다.' },
  { question: 'CodeBuild buildspec.yml의 phases 순서는?', options: ['build→install→post_build', 'install→pre_build→build→post_build', 'pre_build→build→install', 'build→test→deploy'], answer: 1, explanation: 'install → pre_build → build → post_build 순서로 실행됩니다.' },
]

export default function DopC02() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('dop-c02') }, [markStudied])

  return (
    <GuideLayout title="DevOps Engineer Professional" description="AWS에서 CI/CD, 자동화, 모니터링, 보안을 포함한 DevOps 능력을 검증합니다." icon="🔄" badges={[{ label: 'Professional', type: 'primary' }, { label: '75문제 / 180분', type: 'info' }]} sections={sections} categoryId="dop-c02">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>DOP-C02</td></tr>
          <tr><td><strong>문항 수</strong></td><td>75문제</td></tr>
          <tr><td><strong>시간 / 합격</strong></td><td>180분 / 750점</td></tr>
          <tr><td><strong>비용</strong></td><td>$300 USD</td></tr>
          <tr><td><strong>권장 경험</strong></td><td>2년 이상 AWS 환경 프로비저닝/운영</td></tr>
        </tbody></table>
        <TipBox type="important"><p>CI/CD, IaC, 모니터링, 자동화를 종합적으로 평가하는 Professional 레벨 시험입니다.</p></TipBox>
      </section>

      <section id="sdlc">
        <h2>SDLC 자동화 (22%)</h2>
        <h3>CI/CD 파이프라인</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>역할</th><th>핵심 설정</th></tr></thead><tbody>
          <tr><td><strong>CodeCommit</strong></td><td>소스 관리</td><td>브랜치 정책, 트리거</td></tr>
          <tr><td><strong>CodeBuild</strong></td><td>빌드/테스트</td><td>buildspec.yml</td></tr>
          <tr><td><strong>CodeDeploy</strong></td><td>배포</td><td>appspec.yml</td></tr>
          <tr><td><strong>CodePipeline</strong></td><td>오케스트레이션</td><td>스테이지, 승인, 액션</td></tr>
        </tbody></table>

        <h3>배포 전략</h3>
        <table className="info-table"><thead><tr><th>전략</th><th>설명</th><th>롤백</th></tr></thead><tbody>
          <tr><td><strong>In-Place</strong></td><td>기존 인스턴스에 배포</td><td>재배포 필요</td></tr>
          <tr><td><strong>Blue/Green</strong></td><td>새 환경 생성 후 전환</td><td>빠름 (이전 환경 유지)</td></tr>
          <tr><td><strong>Canary</strong></td><td>소량 트래픽으로 검증</td><td>자동 롤백 가능</td></tr>
          <tr><td><strong>Linear</strong></td><td>점진적 트래픽 이동</td><td>자동 롤백 가능</td></tr>
        </tbody></table>
        <TipBox type="warning"><p>CodeDeploy의 EC2/ECS/Lambda별 배포 전략 차이를 숙지하세요.</p></TipBox>
      </section>

      <section id="config-iac">
        <h2>구성 관리 및 IaC (17%)</h2>
        <h3>CloudFormation 고급</h3>
        <table className="info-table"><thead><tr><th>기능</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>StackSets</strong></td><td>멀티 계정/리전 배포</td></tr>
          <tr><td><strong>중첩 스택</strong></td><td>재사용 가능한 템플릿 조합</td></tr>
          <tr><td><strong>Change Set</strong></td><td>업데이트 전 변경 미리보기</td></tr>
          <tr><td><strong>드리프트 감지</strong></td><td>수동 변경 감지</td></tr>
          <tr><td><strong>Custom Resource</strong></td><td>Lambda로 커스텀 프로비저닝</td></tr>
        </tbody></table>

        <h3>Systems Manager 운영</h3>
        <ul>
          <li><strong>Parameter Store:</strong> 설정값/비밀 중앙 관리</li>
          <li><strong>Automation:</strong> Runbook 기반 운영 자동화</li>
          <li><strong>Patch Manager:</strong> 패치 베이스라인 + 유지 관리 기간</li>
          <li><strong>State Manager:</strong> 인스턴스 상태 일관성 유지</li>
        </ul>

        <ToggleSection title="CloudFormation 헬퍼 스크립트">
          <table className="info-table"><thead><tr><th>스크립트</th><th>용도</th></tr></thead><tbody>
            <tr><td><strong>cfn-init</strong></td><td>메타데이터 기반 초기 설정</td></tr>
            <tr><td><strong>cfn-signal</strong></td><td>리소스 생성 완료 신호</td></tr>
            <tr><td><strong>cfn-hup</strong></td><td>메타데이터 변경 감지/적용</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="resilient">
        <h2>탄력적 클라우드 솔루션 (15%)</h2>
        <h3>Auto Scaling 전략</h3>
        <table className="info-table"><thead><tr><th>정책</th><th>트리거</th><th>적합</th></tr></thead><tbody>
          <tr><td><strong>Target Tracking</strong></td><td>목표 메트릭 유지</td><td>CPU 70% 유지 등</td></tr>
          <tr><td><strong>Step Scaling</strong></td><td>경보 단계별</td><td>세밀한 제어</td></tr>
          <tr><td><strong>Scheduled</strong></td><td>예약</td><td>예측 가능한 패턴</td></tr>
          <tr><td><strong>Predictive</strong></td><td>ML 예측</td><td>주기적 패턴</td></tr>
        </tbody></table>

        <h3>멀티 AZ / 리전 패턴</h3>
        <ul>
          <li><strong>Multi-AZ:</strong> RDS, ElastiCache, EFS 자동 장애 조치</li>
          <li><strong>크로스 리전:</strong> S3 복제, Aurora Global, DynamoDB Global Tables</li>
          <li><strong>Route 53 Failover:</strong> 헬스 체크 기반 리전 전환</li>
        </ul>
      </section>

      <section id="monitoring">
        <h2>모니터링 및 로깅 (15%)</h2>
        <h3>CloudWatch 심화</h3>
        <table className="info-table"><thead><tr><th>기능</th><th>용도</th></tr></thead><tbody>
          <tr><td><strong>Composite Alarms</strong></td><td>여러 알람 조합 (AND/OR)</td></tr>
          <tr><td><strong>Metric Math</strong></td><td>메트릭 수식 계산</td></tr>
          <tr><td><strong>Logs Insights</strong></td><td>로그 쿼리 분석</td></tr>
          <tr><td><strong>Contributor Insights</strong></td><td>상위 기여자 분석</td></tr>
          <tr><td><strong>Anomaly Detection</strong></td><td>ML 기반 이상 탐지</td></tr>
        </tbody></table>
        <TipBox type="info"><p>CloudWatch Agent는 메모리, 디스크 사용량 등 OS 레벨 메트릭 수집에 필수입니다.</p></TipBox>
      </section>

      <section id="incident">
        <h2>인시던트 및 이벤트 대응 (14%)</h2>
        <h3>자동 대응 패턴</h3>
        <table className="info-table"><thead><tr><th>이벤트</th><th>감지</th><th>대응</th></tr></thead><tbody>
          <tr><td><strong>보안 위협</strong></td><td>GuardDuty</td><td>EventBridge → Lambda (격리)</td></tr>
          <tr><td><strong>규정 위반</strong></td><td>Config Rules</td><td>SSM Automation (자동 수정)</td></tr>
          <tr><td><strong>인스턴스 장애</strong></td><td>CloudWatch Alarm</td><td>EC2 Auto Recovery</td></tr>
          <tr><td><strong>API 이상</strong></td><td>CloudTrail + EventBridge</td><td>SNS 알림 + Lambda</td></tr>
        </tbody></table>

        <ToggleSection title="EventBridge 이벤트 패턴">
          <ul>
            <li><strong>AWS 서비스 이벤트:</strong> EC2 상태 변경, ECS 작업 중지 등</li>
            <li><strong>스케줄:</strong> rate() 또는 cron() 표현식</li>
            <li><strong>커스텀 이벤트:</strong> PutEvents API로 전송</li>
            <li><strong>크로스 계정:</strong> 이벤트 버스 간 전달</li>
          </ul>
        </ToggleSection>
      </section>

      <section id="security">
        <h2>보안 및 규정 준수 (17%)</h2>
        <h3>보안 자동화</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>역할</th></tr></thead><tbody>
          <tr><td><strong>Config Rules</strong></td><td>리소스 규정 준수 평가</td></tr>
          <tr><td><strong>Security Hub</strong></td><td>보안 결과 통합 (CIS, PCI DSS)</td></tr>
          <tr><td><strong>Inspector</strong></td><td>취약점 자동 스캔</td></tr>
          <tr><td><strong>Secrets Manager</strong></td><td>비밀 자동 교체</td></tr>
        </tbody></table>

        <h3>IAM 고급</h3>
        <ul>
          <li><strong>Permission Boundary:</strong> IAM 엔티티의 최대 권한 제한</li>
          <li><strong>크로스 계정 역할:</strong> AssumeRole로 계정 간 접근</li>
          <li><strong>조건 키:</strong> aws:SourceIp, aws:PrincipalOrgID 등</li>
        </ul>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="dop-c02" categoryTitle="DevOps Engineer Professional" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
