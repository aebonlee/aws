import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'dev-services', title: 'AWS 서비스 개발 (32%)' },
  { id: 'security', title: '보안 (26%)' },
  { id: 'deployment', title: '배포 (24%)' },
  { id: 'troubleshooting', title: '문제 해결 및 최적화 (18%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'Lambda 함수의 최대 실행 시간은?', options: ['1분', '5분', '15분', '60분'], answer: 2, explanation: 'Lambda 최대 타임아웃은 15분(900초)입니다.' },
  { question: 'DynamoDB에서 강력한 읽기 일관성을 지원하는 것은?', options: ['GSI 쿼리', 'LSI 쿼리', '스캔', 'Eventual만'], answer: 1, explanation: 'LSI는 강력한 읽기 일관성을 지원합니다. GSI는 최종 일관성만 지원합니다.' },
  { question: 'Cognito에서 사용자 인증을 담당하는 것은?', options: ['Identity Pool', 'User Pool', 'IAM', 'STS'], answer: 1, explanation: 'User Pool은 인증, Identity Pool은 AWS 리소스 권한을 담당합니다.' },
  { question: '다운타임 없는 가장 안전한 Beanstalk 배포는?', options: ['All at once', 'Rolling', 'Immutable', 'In-place'], answer: 2, explanation: 'Immutable은 새 인스턴스 그룹 생성으로 롤백이 빠릅니다.' },
  { question: 'API Gateway 429 상태 코드 의미는?', options: ['인증 실패', '미발견', '스로틀링', '서버 오류'], answer: 2, explanation: '429 Too Many Requests는 스로틀링 한도 초과입니다.' },
  { question: '분산 애플리케이션 요청 추적 서비스는?', options: ['CloudWatch', 'CloudTrail', 'X-Ray', 'Config'], answer: 2, explanation: 'X-Ray는 분산 추적 서비스로 서비스 맵을 제공합니다.' },
  { question: 'SQS Dead Letter Queue의 목적은?', options: ['메시지 암호화', '실패 메시지 격리', '순서 보장', '중복 제거'], answer: 1, explanation: 'DLQ는 처리 실패 메시지를 격리하여 분석합니다.' },
  { question: 'CloudFormation 변경 사항 미리 확인하는 기능은?', options: ['드리프트 감지', '변경 세트', '스택 정책', '롤백 트리거'], answer: 1, explanation: '변경 세트는 스택 업데이트 전 변경될 리소스를 미리 확인합니다.' },
  { question: 'Lambda 콜드 스타트를 완화하는 방법은?', options: ['메모리 감소', '프로비저닝된 동시성', 'VPC 제거', '타임아웃 증가'], answer: 1, explanation: '프로비저닝된 동시성은 미리 초기화된 환경을 유지합니다.' },
  { question: '자동 교체와 함께 민감 정보를 저장하는 서비스는?', options: ['Parameter Store', 'Secrets Manager', 'KMS', 'Config'], answer: 1, explanation: 'Secrets Manager는 DB 비밀번호 등을 자동 교체합니다.' },
]

export default function DvaC02() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('dva-c02') }, [markStudied])

  return (
    <GuideLayout title="Developer Associate" description="AWS 기반 애플리케이션의 개발, 배포, 디버깅 능력을 검증합니다." icon="💻" badges={[{ label: 'Associate', type: 'primary' }, { label: '65문제 / 130분', type: 'info' }]} sections={sections} categoryId="dva-c02">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>DVA-C02</td></tr>
          <tr><td><strong>문항 수</strong></td><td>65문제</td></tr>
          <tr><td><strong>시험 시간</strong></td><td>130분</td></tr>
          <tr><td><strong>합격 점수</strong></td><td>720 / 1000</td></tr>
          <tr><td><strong>비용</strong></td><td>$150 USD</td></tr>
        </tbody></table>
        <TipBox type="important"><p>개발자 관점의 AWS 활용 능력 평가. SDK, CLI, CI/CD 비중이 높습니다.</p></TipBox>
      </section>

      <section id="dev-services">
        <h2>AWS 서비스 개발 (32%)</h2>
        <h3>Lambda 핵심</h3>
        <table className="info-table"><thead><tr><th>항목</th><th>제한/특징</th></tr></thead><tbody>
          <tr><td><strong>최대 실행 시간</strong></td><td>15분 (900초)</td></tr>
          <tr><td><strong>메모리</strong></td><td>128MB ~ 10GB</td></tr>
          <tr><td><strong>패키지 크기</strong></td><td>50MB(압축) / 250MB(비압축)</td></tr>
          <tr><td><strong>동시성</strong></td><td>예약/프로비저닝 동시성</td></tr>
          <tr><td><strong>레이어</strong></td><td>공용 라이브러리 공유 (최대 5개)</td></tr>
        </tbody></table>

        <h3>DynamoDB 개발</h3>
        <table className="info-table"><thead><tr><th>개념</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>파티션 키</strong></td><td>데이터 분산 기준, 균등 분포 중요</td></tr>
          <tr><td><strong>GSI</strong></td><td>대체 파티션/정렬 키, 최종 일관성만</td></tr>
          <tr><td><strong>LSI</strong></td><td>테이블 생성 시만, 강력한 일관성</td></tr>
          <tr><td><strong>용량 모드</strong></td><td>온디맨드 / 프로비저닝</td></tr>
        </tbody></table>

        <h3>SQS / SNS / EventBridge</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>패턴</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>SQS</strong></td><td>큐 (1:1)</td><td>Standard/FIFO, DLQ, 가시성 타임아웃</td></tr>
          <tr><td><strong>SNS</strong></td><td>Pub/Sub (1:N)</td><td>팬아웃, 다중 구독자</td></tr>
          <tr><td><strong>EventBridge</strong></td><td>이벤트 버스</td><td>스케줄, 규칙 기반 라우팅</td></tr>
        </tbody></table>
      </section>

      <section id="security">
        <h2>보안 (26%)</h2>
        <h3>Cognito User Pool vs Identity Pool</h3>
        <table className="info-table"><thead><tr><th>구분</th><th>User Pool</th><th>Identity Pool</th></tr></thead><tbody>
          <tr><td><strong>역할</strong></td><td>인증 (로그인/회원가입)</td><td>권한 부여 (AWS 리소스 접근)</td></tr>
          <tr><td><strong>토큰</strong></td><td>JWT (ID/Access/Refresh)</td><td>임시 AWS 자격 증명</td></tr>
          <tr><td><strong>연동</strong></td><td>Social, SAML, OIDC</td><td>User Pool, Social, SAML</td></tr>
        </tbody></table>

        <h3>Secrets Manager vs Parameter Store</h3>
        <table className="info-table"><thead><tr><th>기능</th><th>Secrets Manager</th><th>Parameter Store</th></tr></thead><tbody>
          <tr><td><strong>자동 교체</strong></td><td>지원 (Lambda)</td><td>미지원</td></tr>
          <tr><td><strong>비용</strong></td><td>유료 ($0.40/비밀/월)</td><td>Standard 무료</td></tr>
          <tr><td><strong>용도</strong></td><td>DB 비밀번호, API 키</td><td>설정값, 비밀번호</td></tr>
        </tbody></table>
        <TipBox type="warning"><p>Cognito User Pool(인증)과 Identity Pool(권한)의 차이를 반드시 숙지하세요.</p></TipBox>
      </section>

      <section id="deployment">
        <h2>배포 (24%)</h2>
        <h3>Elastic Beanstalk 배포 정책</h3>
        <table className="info-table"><thead><tr><th>정책</th><th>다운타임</th><th>롤백</th></tr></thead><tbody>
          <tr><td><strong>All at once</strong></td><td>있음</td><td>재배포</td></tr>
          <tr><td><strong>Rolling</strong></td><td>부분</td><td>재배포</td></tr>
          <tr><td><strong>Rolling with batch</strong></td><td>없음</td><td>재배포</td></tr>
          <tr><td><strong>Immutable</strong></td><td>없음</td><td>빠름 (새 그룹 삭제)</td></tr>
          <tr><td><strong>Blue/Green</strong></td><td>없음</td><td>URL 스왑</td></tr>
        </tbody></table>

        <h3>CI/CD 파이프라인</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>역할</th><th>설정 파일</th></tr></thead><tbody>
          <tr><td><strong>CodeCommit</strong></td><td>소스 관리 (Git)</td><td>-</td></tr>
          <tr><td><strong>CodeBuild</strong></td><td>빌드/테스트</td><td>buildspec.yml</td></tr>
          <tr><td><strong>CodeDeploy</strong></td><td>배포</td><td>appspec.yml</td></tr>
          <tr><td><strong>CodePipeline</strong></td><td>파이프라인 오케스트레이션</td><td>-</td></tr>
        </tbody></table>

        <ToggleSection title="CodeDeploy Lambda 배포 전략">
          <ul>
            <li><strong>Canary:</strong> 소량 트래픽 → 전체 (예: 10%씩)</li>
            <li><strong>Linear:</strong> 일정 비율로 점진 증가</li>
            <li><strong>AllAtOnce:</strong> 즉시 전체 전환</li>
          </ul>
        </ToggleSection>
      </section>

      <section id="troubleshooting">
        <h2>문제 해결 및 최적화 (18%)</h2>
        <h3>CloudWatch vs X-Ray vs CloudTrail</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th><th>용도</th></tr></thead><tbody>
          <tr><td><strong>CloudWatch</strong></td><td>메트릭, 로그, 알람</td><td>리소스 모니터링</td></tr>
          <tr><td><strong>X-Ray</strong></td><td>분산 추적</td><td>요청 경로 분석</td></tr>
          <tr><td><strong>CloudTrail</strong></td><td>API 호출 기록</td><td>감사, 규정 준수</td></tr>
        </tbody></table>

        <h3>API Gateway 오류 코드</h3>
        <table className="info-table"><thead><tr><th>코드</th><th>의미</th><th>원인</th></tr></thead><tbody>
          <tr><td><strong>403</strong></td><td>Forbidden</td><td>WAF 차단, 리소스 정책</td></tr>
          <tr><td><strong>429</strong></td><td>Too Many Requests</td><td>스로틀링 한도 초과</td></tr>
          <tr><td><strong>502</strong></td><td>Bad Gateway</td><td>Lambda 응답 형식 오류</td></tr>
          <tr><td><strong>504</strong></td><td>Gateway Timeout</td><td>Lambda 29초 초과</td></tr>
        </tbody></table>
        <TipBox type="important"><p>X-Ray SDK 계측, 데몬 설치, 샘플링 규칙을 이해해야 합니다.</p></TipBox>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="dva-c02" categoryTitle="Developer Associate" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
