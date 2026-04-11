import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'cloud-concepts', title: '클라우드 개념 (24%)' },
  { id: 'security-compliance', title: '보안 및 규정 준수 (30%)' },
  { id: 'technology-services', title: '클라우드 기술 및 서비스 (34%)' },
  { id: 'billing-support', title: '요금, 결제 및 지원 (12%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'AWS 공동 책임 모델에서 고객의 책임은?', options: ['물리적 서버 보안', '네트워크 인프라 관리', '데이터 암호화 및 IAM 관리', '하이퍼바이저 패치'], answer: 2, explanation: '고객은 데이터 보호, IAM, 애플리케이션 보안 등 "클라우드 안의 보안"을 책임집니다.' },
  { question: '서버 없이 코드를 실행하는 AWS 서비스는?', options: ['EC2', 'Lambda', 'ECS', 'Lightsail'], answer: 1, explanation: 'Lambda는 서버리스 컴퓨팅 서비스로, 코드 실행 시에만 과금됩니다.' },
  { question: 'S3의 스토리지 유형은?', options: ['블록 스토리지', '파일 스토리지', '객체 스토리지', '인메모리 스토리지'], answer: 2, explanation: 'S3는 객체 스토리지로 파일을 버킷에 객체로 저장합니다.' },
  { question: 'AWS에서 DDoS 공격을 방어하는 서비스는?', options: ['GuardDuty', 'Shield', 'Inspector', 'Macie'], answer: 1, explanation: 'AWS Shield는 DDoS 보호 서비스입니다. Standard는 무료, Advanced는 유료입니다.' },
  { question: 'AWS 리전 선택 시 가장 중요하지 않은 요소는?', options: ['데이터 규정 준수', '지연 시간', '서비스 가용성', '리전 이름'], answer: 3, explanation: '리전 이름은 기술적 선택 기준이 아닙니다. 규정 준수, 지연 시간, 비용, 서비스 가용성이 중요합니다.' },
  { question: '가장 높은 할인율을 제공하지만 중단될 수 있는 인스턴스 유형은?', options: ['온디맨드', '예약 인스턴스', '스팟 인스턴스', 'Dedicated Host'], answer: 2, explanation: '스팟 인스턴스는 최대 90%까지 할인되지만 AWS가 필요시 2분 경고 후 중단할 수 있습니다.' },
  { question: 'NoSQL 데이터베이스 서비스는?', options: ['RDS', 'Aurora', 'DynamoDB', 'Redshift'], answer: 2, explanation: 'DynamoDB는 AWS의 완전관리형 NoSQL 데이터베이스로 밀리초 지연 시간을 제공합니다.' },
  { question: 'AWS 비용을 시각적으로 분석하고 예측하는 도구는?', options: ['AWS Budgets', 'Cost Explorer', 'Pricing Calculator', 'Trusted Advisor'], answer: 1, explanation: 'Cost Explorer는 비용을 시각화하고 최대 12개월까지 예측합니다.' },
  { question: 'Well-Architected Framework의 기둥이 아닌 것은?', options: ['보안', '확장성', '비용 최적화', '지속 가능성'], answer: 1, explanation: '6개 기둥은 운영 우수성, 보안, 안정성, 성능 효율성, 비용 최적화, 지속 가능성입니다. "확장성"은 기둥이 아닙니다.' },
  { question: 'TAM(Technical Account Manager)이 제공되는 지원 플랜은?', options: ['Basic', 'Developer', 'Business', 'Enterprise'], answer: 3, explanation: 'TAM은 Enterprise 지원 플랜에서만 제공됩니다.' },
]

export default function ClfC02() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('clf-c02') }, [markStudied])

  return (
    <GuideLayout title="AWS Cloud Practitioner" description="AWS 클라우드의 기본 개념, 서비스, 보안, 요금에 대한 전반적 이해를 검증합니다." icon="☁️" badges={[{ label: '기초 레벨', type: 'primary' }, { label: '65문제 / 90분', type: 'info' }]} sections={sections} categoryId="clf-c02">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>CLF-C02</td></tr>
          <tr><td><strong>문항 수</strong></td><td>65문제 (채점 50 + 비채점 15)</td></tr>
          <tr><td><strong>시험 시간</strong></td><td>90분</td></tr>
          <tr><td><strong>합격 점수</strong></td><td>700 / 1000</td></tr>
          <tr><td><strong>시험 비용</strong></td><td>$100 USD</td></tr>
          <tr><td><strong>유효 기간</strong></td><td>3년</td></tr>
          <tr><td><strong>문제 형식</strong></td><td>객관식 + 복수 선택</td></tr>
        </tbody></table>
        <TipBox type="important" title="입문자 환영"><p>AWS 클라우드 경험이 없어도 도전 가능한 입문 자격증입니다.</p></TipBox>
      </section>

      <section id="cloud-concepts">
        <h2>클라우드 개념 (24%)</h2>
        <h3>기존 IT vs 클라우드</h3>
        <table className="info-table"><thead><tr><th>구분</th><th>온프레미스</th><th>클라우드</th></tr></thead><tbody>
          <tr><td><strong>초기 투자</strong></td><td>대규모 CAPEX</td><td>OPEX, 사용한 만큼 지불</td></tr>
          <tr><td><strong>확장 시간</strong></td><td>수주~수개월</td><td>수분 이내</td></tr>
          <tr><td><strong>가용성</strong></td><td>단일 데이터센터</td><td>멀티 AZ/리전</td></tr>
          <tr><td><strong>용량 관리</strong></td><td>수요 예측 필요</td><td>Auto Scaling</td></tr>
        </tbody></table>

        <h3>클라우드 컴퓨팅 6가지 장점</h3>
        <table className="info-table"><thead><tr><th>#</th><th>장점</th><th>설명</th></tr></thead><tbody>
          <tr><td>1</td><td><strong>자본→변동 비용</strong></td><td>사용한 만큼만 지불</td></tr>
          <tr><td>2</td><td><strong>규모의 경제</strong></td><td>수십만 고객 사용량 집계로 낮은 단가</td></tr>
          <tr><td>3</td><td><strong>용량 추측 불필요</strong></td><td>자동 확장/축소</td></tr>
          <tr><td>4</td><td><strong>속도와 민첩성</strong></td><td>몇 분 만에 배포</td></tr>
          <tr><td>5</td><td><strong>데이터센터 비용 제거</strong></td><td>인프라 관리 대신 비즈니스 집중</td></tr>
          <tr><td>6</td><td><strong>글로벌 배포</strong></td><td>몇 번의 클릭으로 전 세계 배포</td></tr>
        </tbody></table>

        <h3>Well-Architected Framework 6개 기둥</h3>
        <table className="info-table"><thead><tr><th>기둥</th><th>핵심</th></tr></thead><tbody>
          <tr><td><strong>운영 우수성</strong></td><td>자동화, 변경 관리, 장애 대응</td></tr>
          <tr><td><strong>보안</strong></td><td>데이터 보호, 권한 관리</td></tr>
          <tr><td><strong>안정성</strong></td><td>장애 복구, 자동 확장</td></tr>
          <tr><td><strong>성능 효율성</strong></td><td>적절한 리소스 선택, 최적화</td></tr>
          <tr><td><strong>비용 최적화</strong></td><td>불필요한 지출 제거</td></tr>
          <tr><td><strong>지속 가능성</strong></td><td>환경 영향 최소화</td></tr>
        </tbody></table>
        <TipBox type="warning"><p><strong>IaaS/PaaS/SaaS</strong> 서비스 모델 구분이 시험에 자주 출제됩니다. IaaS(EC2), PaaS(Elastic Beanstalk), SaaS(Gmail).</p></TipBox>
      </section>

      <section id="security-compliance">
        <h2>보안 및 규정 준수 (30%)</h2>
        <h3>공동 책임 모델</h3>
        <table className="info-table"><thead><tr><th>구분</th><th>AWS 책임 (OF the Cloud)</th><th>고객 책임 (IN the Cloud)</th></tr></thead><tbody>
          <tr><td><strong>인프라</strong></td><td>물리적 데이터센터, 하드웨어</td><td>OS 패치, 애플리케이션</td></tr>
          <tr><td><strong>네트워크</strong></td><td>글로벌 네트워크 인프라</td><td>보안 그룹, NACL 구성</td></tr>
          <tr><td><strong>데이터</strong></td><td>스토리지 디바이스 폐기</td><td>데이터 암호화, 백업</td></tr>
          <tr><td><strong>접근</strong></td><td>AWS 직원 접근 통제</td><td>IAM 사용자/역할/정책</td></tr>
        </tbody></table>

        <h3>IAM 핵심 개념</h3>
        <table className="info-table"><thead><tr><th>구성 요소</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>사용자 (User)</strong></td><td>개별 계정, 장기 자격 증명</td></tr>
          <tr><td><strong>그룹 (Group)</strong></td><td>사용자 모음, 권한 일괄 관리</td></tr>
          <tr><td><strong>역할 (Role)</strong></td><td>임시 자격 증명, 서비스 간 위임</td></tr>
          <tr><td><strong>정책 (Policy)</strong></td><td>JSON 형식 권한 정의</td></tr>
        </tbody></table>

        <h3>AWS 보안 서비스</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>기능</th></tr></thead><tbody>
          <tr><td><strong>Shield</strong></td><td>DDoS 방어 (Standard 무료, Advanced 유료)</td></tr>
          <tr><td><strong>WAF</strong></td><td>웹 방화벽 (SQL Injection, XSS 방어)</td></tr>
          <tr><td><strong>GuardDuty</strong></td><td>ML 기반 위협 탐지</td></tr>
          <tr><td><strong>Inspector</strong></td><td>취약점 자동 스캔</td></tr>
          <tr><td><strong>Macie</strong></td><td>S3 민감 데이터(PII) 발견</td></tr>
          <tr><td><strong>KMS</strong></td><td>암호화 키 관리</td></tr>
        </tbody></table>
        <TipBox type="important"><p>공동 책임 모델은 <strong>반드시 출제</strong>됩니다. "Security OF the Cloud" vs "Security IN the Cloud"를 명확히 구분하세요.</p></TipBox>
      </section>

      <section id="technology-services">
        <h2>클라우드 기술 및 서비스 (34%)</h2>
        <h3>AWS 글로벌 인프라</h3>
        <table className="info-table"><thead><tr><th>구성</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>리전</strong></td><td>지리적으로 분리된 데이터센터 클러스터</td></tr>
          <tr><td><strong>가용 영역 (AZ)</strong></td><td>리전 내 독립 데이터센터 (최소 3개)</td></tr>
          <tr><td><strong>엣지 로케이션</strong></td><td>CloudFront CDN 캐싱 지점 (400+개)</td></tr>
        </tbody></table>

        <h3>컴퓨팅 서비스</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>유형</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>EC2</strong></td><td>IaaS</td><td>가상 서버</td></tr>
          <tr><td><strong>Lambda</strong></td><td>서버리스</td><td>코드 실행 시 과금, 최대 15분</td></tr>
          <tr><td><strong>ECS/EKS</strong></td><td>컨테이너</td><td>Docker/Kubernetes 오케스트레이션</td></tr>
          <tr><td><strong>Elastic Beanstalk</strong></td><td>PaaS</td><td>코드 업로드만으로 자동 배포</td></tr>
          <tr><td><strong>Lightsail</strong></td><td>간편 서버</td><td>소규모 웹사이트용</td></tr>
        </tbody></table>

        <h3>스토리지 / 데이터베이스</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>유형</th><th>용도</th></tr></thead><tbody>
          <tr><td><strong>S3</strong></td><td>객체 스토리지</td><td>무제한 용량, 11 9s 내구성</td></tr>
          <tr><td><strong>EBS</strong></td><td>블록 스토리지</td><td>EC2 가상 디스크</td></tr>
          <tr><td><strong>EFS</strong></td><td>파일 스토리지</td><td>다중 EC2 공유 NFS</td></tr>
          <tr><td><strong>RDS</strong></td><td>관계형 DB</td><td>MySQL, PostgreSQL 등</td></tr>
          <tr><td><strong>DynamoDB</strong></td><td>NoSQL</td><td>밀리초 응답 키-값 DB</td></tr>
          <tr><td><strong>Aurora</strong></td><td>고성능 관계형</td><td>MySQL/PostgreSQL 5배 성능</td></tr>
          <tr><td><strong>Redshift</strong></td><td>데이터 웨어하우스</td><td>페타바이트 분석</td></tr>
        </tbody></table>

        <ToggleSection title="S3 스토리지 클래스 비교">
          <table className="info-table"><thead><tr><th>클래스</th><th>용도</th><th>특징</th></tr></thead><tbody>
            <tr><td><strong>Standard</strong></td><td>자주 액세스</td><td>기본, 높은 처리량</td></tr>
            <tr><td><strong>Standard-IA</strong></td><td>드문 액세스</td><td>검색 비용, 저장 저렴</td></tr>
            <tr><td><strong>One Zone-IA</strong></td><td>단일 AZ</td><td>가장 저렴한 IA</td></tr>
            <tr><td><strong>Glacier Flexible</strong></td><td>아카이브</td><td>분~시간 검색</td></tr>
            <tr><td><strong>Glacier Deep Archive</strong></td><td>장기 아카이브</td><td>가장 저렴, 12시간 검색</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="billing-support">
        <h2>요금, 결제 및 지원 (12%)</h2>
        <h3>EC2 요금 모델</h3>
        <table className="info-table"><thead><tr><th>모델</th><th>할인율</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>온디맨드</strong></td><td>없음</td><td>약정 없음, 예측 불가 워크로드</td></tr>
          <tr><td><strong>예약 인스턴스</strong></td><td>최대 72%</td><td>1~3년 약정</td></tr>
          <tr><td><strong>Savings Plans</strong></td><td>최대 72%</td><td>시간당 사용량 약정</td></tr>
          <tr><td><strong>스팟 인스턴스</strong></td><td>최대 90%</td><td>중단 가능, 배치 작업</td></tr>
        </tbody></table>

        <h3>AWS 지원 플랜</h3>
        <table className="info-table"><thead><tr><th>플랜</th><th>비용</th><th>긴급 응답</th><th>TAM</th></tr></thead><tbody>
          <tr><td><strong>Basic</strong></td><td>무료</td><td>-</td><td>없음</td></tr>
          <tr><td><strong>Developer</strong></td><td>$29~/월</td><td>12~24시간</td><td>없음</td></tr>
          <tr><td><strong>Business</strong></td><td>$100~/월</td><td>1시간</td><td>없음</td></tr>
          <tr><td><strong>Enterprise</strong></td><td>$15,000~/월</td><td>15분</td><td><strong>있음</strong></td></tr>
        </tbody></table>

        <ToggleSection title="AWS Organizations와 통합 결제">
          <ul>
            <li><strong>통합 결제:</strong> 모든 계정 비용을 합산하여 볼륨 할인</li>
            <li><strong>SCP:</strong> 하위 계정 서비스 제한</li>
            <li><strong>OU:</strong> 계정 그룹화, 정책 계층 적용</li>
          </ul>
        </ToggleSection>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="clf-c02" categoryTitle="AWS Cloud Practitioner" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
