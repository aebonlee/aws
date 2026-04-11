import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'monitoring', title: '모니터링 및 로깅 (20%)' },
  { id: 'reliability', title: '안정성 및 연속성 (16%)' },
  { id: 'deployment', title: '배포 및 자동화 (18%)' },
  { id: 'security', title: '보안 및 규정 준수 (16%)' },
  { id: 'networking', title: '네트워킹 (18%)' },
  { id: 'cost', title: '비용 및 성능 최적화 (12%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'EC2 기본 CloudWatch 메트릭에 포함되지 않는 것은?', options: ['CPU 사용률', '네트워크 입출력', '메모리 사용률', '디스크 읽기/쓰기'], answer: 2, explanation: '메모리는 CloudWatch Agent로 수집해야 합니다.' },
  { question: 'SSH 없이 EC2에 접속하는 Systems Manager 기능은?', options: ['Run Command', 'Session Manager', 'Patch Manager', 'State Manager'], answer: 1, explanation: 'Session Manager는 포트 22 없이 EC2에 접속합니다.' },
  { question: 'CloudFormation 멀티 계정/리전 배포 기능은?', options: ['Nested Stack', 'Change Set', 'StackSets', '드리프트 감지'], answer: 2, explanation: 'StackSets로 여러 계정/리전에 배포합니다.' },
  { question: 'VPC Peering의 제한 사항은?', options: ['같은 리전만', 'CIDR 중복 불가', '전이적 라우팅 가능', '보안 그룹 참조 불가'], answer: 1, explanation: 'VPC Peering은 CIDR 중복 불가, 전이적 라우팅 미지원입니다.' },
  { question: '높은 IOPS 워크로드에 적합한 EBS 볼륨은?', options: ['gp3', 'io2', 'st1', 'sc1'], answer: 1, explanation: 'io2는 최대 64,000 IOPS로 고성능 DB에 적합합니다.' },
  { question: '장애 시 대체 리소스로 전환하는 Route 53 정책은?', options: ['Simple', 'Weighted', 'Latency', 'Failover'], answer: 3, explanation: 'Failover는 헬스 체크 기반 Primary→Secondary 전환입니다.' },
  { question: 'AWS Config의 주요 기능은?', options: ['위협 탐지', '리소스 구성 변경 추적', '비용 분석', '로그 수집'], answer: 1, explanation: 'Config는 리소스 구성 변경을 추적하고 규정 준수를 평가합니다.' },
  { question: 'CloudTrail S3 객체 수준 작업 기록은?', options: ['관리 이벤트', '데이터 이벤트', 'Insights 이벤트', '기본 설정'], answer: 1, explanation: 'S3 객체 수준 작업은 데이터 이벤트로 별도 활성화합니다.' },
  { question: 'Trusted Advisor 무료로 확인 불가한 것은?', options: ['보안 그룹 접근', 'S3 권한', '비용 최적화 전체', 'MFA 확인'], answer: 2, explanation: '비용 최적화 전체 분석은 Business 이상 필요합니다.' },
  { question: 'NAT Gateway vs NAT Instance 차이는?', options: ['Instance가 더 높은 대역폭', 'Gateway는 보안 그룹 연결', 'Gateway는 AWS 관리형 고가용', 'Instance가 자동 확장'], answer: 2, explanation: 'NAT Gateway는 AWS 관리형으로 자동 확장, 고가용성입니다.' },
]

export default function SoaC02() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('soa-c02') }, [markStudied])

  return (
    <GuideLayout title="SysOps Administrator Associate" description="AWS 환경의 배포, 관리, 운영 능력을 검증합니다." icon="🔧" badges={[{ label: 'Associate', type: 'primary' }, { label: '65문제 / 130분', type: 'info' }]} sections={sections} categoryId="soa-c02">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>SOA-C02</td></tr>
          <tr><td><strong>문항 수</strong></td><td>65문제</td></tr>
          <tr><td><strong>시험 시간</strong></td><td>130분</td></tr>
          <tr><td><strong>합격 점수</strong></td><td>720 / 1000</td></tr>
          <tr><td><strong>비용</strong></td><td>$150 USD</td></tr>
        </tbody></table>
        <TipBox type="important"><p>운영 관점의 자격증. 모니터링, 자동화, 보안, 네트워킹에 중점을 둡니다.</p></TipBox>
      </section>

      <section id="monitoring">
        <h2>모니터링, 로깅 및 문제 해결 (20%)</h2>
        <h3>CloudWatch 메트릭</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>간격</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>기본 모니터링</strong></td><td>5분</td><td>CPU, 네트워크, 디스크 I/O</td></tr>
          <tr><td><strong>상세 모니터링</strong></td><td>1분</td><td>기본과 동일 (유료)</td></tr>
          <tr><td><strong>사용자 지정</strong></td><td>1초~</td><td>메모리, 디스크 사용량</td></tr>
        </tbody></table>
        <TipBox type="warning"><p>EC2 기본 메트릭에 <strong>메모리/디스크 사용량은 미포함</strong> — CloudWatch Agent로 수집해야 합니다.</p></TipBox>

        <h3>모니터링 서비스 비교</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th></tr></thead><tbody>
          <tr><td><strong>CloudWatch</strong></td><td>메트릭, 로그, 알람</td></tr>
          <tr><td><strong>CloudTrail</strong></td><td>API 호출 기록 (감사)</td></tr>
          <tr><td><strong>Config</strong></td><td>리소스 구성 변경 추적</td></tr>
          <tr><td><strong>X-Ray</strong></td><td>분산 추적</td></tr>
        </tbody></table>
      </section>

      <section id="reliability">
        <h2>안정성 및 비즈니스 연속성 (16%)</h2>
        <h3>EBS 볼륨 유형</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>IOPS</th><th>용도</th></tr></thead><tbody>
          <tr><td><strong>gp3</strong></td><td>3,000~16,000</td><td>범용 SSD</td></tr>
          <tr><td><strong>io2</strong></td><td>최대 64,000</td><td>고성능 DB</td></tr>
          <tr><td><strong>st1</strong></td><td>처리량 최적화</td><td>빅데이터, 로그</td></tr>
          <tr><td><strong>sc1</strong></td><td>콜드 HDD</td><td>아카이브</td></tr>
        </tbody></table>

        <ToggleSection title="Route 53 라우팅 정책">
          <table className="info-table"><thead><tr><th>정책</th><th>설명</th></tr></thead><tbody>
            <tr><td><strong>Simple</strong></td><td>단순 매핑 (하나의 레코드)</td></tr>
            <tr><td><strong>Weighted</strong></td><td>가중치 기반 트래픽 분배</td></tr>
            <tr><td><strong>Latency</strong></td><td>최저 지연 시간 리전으로 라우팅</td></tr>
            <tr><td><strong>Failover</strong></td><td>헬스 체크 기반 장애 조치</td></tr>
            <tr><td><strong>Geolocation</strong></td><td>사용자 위치 기반 라우팅</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="deployment">
        <h2>배포, 프로비저닝 및 자동화 (18%)</h2>
        <h3>CloudFormation</h3>
        <table className="info-table"><thead><tr><th>기능</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>StackSets</strong></td><td>멀티 계정/리전 동시 배포</td></tr>
          <tr><td><strong>드리프트 감지</strong></td><td>수동 변경 사항 탐지</td></tr>
          <tr><td><strong>Change Set</strong></td><td>업데이트 전 변경 미리 확인</td></tr>
          <tr><td><strong>중첩 스택</strong></td><td>재사용 가능한 템플릿 조합</td></tr>
        </tbody></table>

        <h3>Systems Manager</h3>
        <table className="info-table"><thead><tr><th>기능</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>Session Manager</strong></td><td>SSH 없이 EC2 접속</td></tr>
          <tr><td><strong>Patch Manager</strong></td><td>OS/SW 패치 자동화</td></tr>
          <tr><td><strong>Run Command</strong></td><td>원격 명령 실행</td></tr>
          <tr><td><strong>State Manager</strong></td><td>인스턴스 상태 유지</td></tr>
        </tbody></table>
        <TipBox type="important"><p>Systems Manager는 운영 관리의 핵심입니다. Session Manager, Patch Manager를 집중 학습하세요.</p></TipBox>
      </section>

      <section id="security">
        <h2>보안 및 규정 준수 (16%)</h2>
        <h3>보안 서비스</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>기능</th></tr></thead><tbody>
          <tr><td><strong>GuardDuty</strong></td><td>ML 기반 위협 탐지</td></tr>
          <tr><td><strong>Inspector</strong></td><td>EC2/ECR/Lambda 취약점 스캔</td></tr>
          <tr><td><strong>Macie</strong></td><td>S3 민감 데이터 발견</td></tr>
          <tr><td><strong>Security Hub</strong></td><td>보안 결과 통합 대시보드</td></tr>
          <tr><td><strong>Detective</strong></td><td>보안 이벤트 근본 원인 분석</td></tr>
        </tbody></table>
      </section>

      <section id="networking">
        <h2>네트워킹 및 콘텐츠 전송 (18%)</h2>
        <h3>NAT Gateway vs NAT Instance</h3>
        <table className="info-table"><thead><tr><th>항목</th><th>NAT Gateway</th><th>NAT Instance</th></tr></thead><tbody>
          <tr><td><strong>관리</strong></td><td>AWS 관리형</td><td>직접 관리</td></tr>
          <tr><td><strong>가용성</strong></td><td>AZ 내 고가용</td><td>수동 설정 필요</td></tr>
          <tr><td><strong>확장</strong></td><td>자동 (최대 100Gbps)</td><td>인스턴스 유형 제한</td></tr>
          <tr><td><strong>보안 그룹</strong></td><td>미지원</td><td>지원</td></tr>
        </tbody></table>
        <TipBox type="warning"><p>VPC Peering은 전이적 라우팅 불가 — 허브-스포크는 Transit Gateway를 사용합니다.</p></TipBox>
      </section>

      <section id="cost">
        <h2>비용 및 성능 최적화 (12%)</h2>
        <h3>Trusted Advisor 5개 카테고리</h3>
        <table className="info-table"><thead><tr><th>카테고리</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>비용 최적화</strong></td><td>유휴 EC2, 미사용 EBS</td></tr>
          <tr><td><strong>성능</strong></td><td>과부하 인스턴스</td></tr>
          <tr><td><strong>보안</strong></td><td>개방된 보안 그룹, MFA</td></tr>
          <tr><td><strong>장애 내구성</strong></td><td>Multi-AZ 미설정</td></tr>
          <tr><td><strong>서비스 한도</strong></td><td>한도 도달 경고</td></tr>
        </tbody></table>

        <ToggleSection title="EC2 배치 그룹">
          <table className="info-table"><thead><tr><th>유형</th><th>특징</th><th>용도</th></tr></thead><tbody>
            <tr><td><strong>클러스터</strong></td><td>같은 AZ, 저지연</td><td>HPC, 빅데이터</td></tr>
            <tr><td><strong>분산</strong></td><td>다른 하드웨어</td><td>고가용성</td></tr>
            <tr><td><strong>파티션</strong></td><td>논리적 파티션</td><td>Hadoop, Cassandra</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="soa-c02" categoryTitle="SysOps Administrator Associate" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
