import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'data-ingestion', title: '데이터 수집 및 변환 (34%)' },
  { id: 'data-store', title: '데이터 저장소 관리 (26%)' },
  { id: 'data-operations', title: '데이터 운영 및 지원 (22%)' },
  { id: 'data-security', title: '데이터 보안 및 거버넌스 (18%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: '실시간 스트리밍 데이터를 수집하는 서비스는?', options: ['Kinesis Data Streams', 'Kinesis Data Firehose', 'SQS', 'EventBridge'], answer: 0, explanation: 'Kinesis Data Streams는 실시간 수집, Firehose는 준실시간 전송입니다.' },
  { question: 'S3 데이터를 SQL로 쿼리하는 서버리스 서비스는?', options: ['Redshift', 'EMR', 'Athena', 'QuickSight'], answer: 2, explanation: 'Athena는 S3 데이터를 서버리스로 SQL 쿼리합니다.' },
  { question: 'AWS Glue 크롤러의 역할은?', options: ['데이터 변환', '스키마 자동 감지', '시각화', '암호화'], answer: 1, explanation: '크롤러는 데이터 소스를 스캔하여 스키마를 자동 감지합니다.' },
  { question: 'Redshift에서 S3 데이터를 직접 쿼리하는 기능은?', options: ['Federated Query', 'Spectrum', 'Data Sharing', 'COPY'], answer: 1, explanation: 'Redshift Spectrum은 S3의 엑사바이트 데이터를 직접 쿼리합니다.' },
  { question: '데이터 레이크 행/열 수준 접근 제어 서비스는?', options: ['IAM', 'S3 버킷 정책', 'Lake Formation', 'Macie'], answer: 2, explanation: 'Lake Formation은 세밀한 접근 제어를 제공합니다.' },
  { question: 'Glue ETL 중복 처리 방지 기능은?', options: ['크롤러', '카탈로그', 'Job Bookmarks', '스키마 레지스트리'], answer: 2, explanation: 'Job Bookmarks는 이전 처리 위치를 추적합니다.' },
  { question: '대용량 분석에 적합한 열 기반 데이터 형식은?', options: ['CSV', 'JSON', 'Parquet', 'XML'], answer: 2, explanation: 'Parquet은 열 기반으로 압축률이 높고 분석에 최적화됩니다.' },
  { question: 'DMS CDC(Change Data Capture)의 역할은?', options: ['풀 로드', '지속적 변경 복제', '스키마 변환', '데이터 검증'], answer: 1, explanation: 'CDC는 원본 DB 변경을 지속적으로 대상에 복제합니다.' },
  { question: 'S3에서 PII를 자동 감지하는 서비스는?', options: ['GuardDuty', 'Inspector', 'Macie', 'Config'], answer: 2, explanation: 'Macie는 ML로 S3에서 민감 데이터를 자동 발견합니다.' },
  { question: 'QuickSight 인메모리 가속 엔진은?', options: ['DAX', 'ElastiCache', 'SPICE', 'Presto'], answer: 2, explanation: 'SPICE는 QuickSight의 인메모리 계산 엔진입니다.' },
]

export default function DeaC01() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('dea-c01') }, [markStudied])

  return (
    <GuideLayout title="Data Engineer Associate" description="데이터 파이프라인 구축, 수집/변환/저장 자동화 능력을 검증합니다." icon="📊" badges={[{ label: 'Associate', type: 'primary' }, { label: '65문제 / 130분', type: 'info' }]} sections={sections} categoryId="dea-c01">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>DEA-C01</td></tr>
          <tr><td><strong>문항 수</strong></td><td>65문제</td></tr>
          <tr><td><strong>시간 / 합격</strong></td><td>130분 / 720점</td></tr>
          <tr><td><strong>비용</strong></td><td>$150 USD</td></tr>
        </tbody></table>
        <TipBox type="info"><p>2024년 신설. 데이터 파이프라인, ETL, 데이터 레이크 중심 자격증입니다.</p></TipBox>
      </section>

      <section id="data-ingestion">
        <h2>데이터 수집 및 변환 (34%)</h2>
        <h3>Kinesis 제품군</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>유형</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>Data Streams</strong></td><td>실시간</td><td>샤드 기반, 커스텀 컨슈머</td></tr>
          <tr><td><strong>Data Firehose</strong></td><td>준실시간</td><td>S3/Redshift/OpenSearch 자동 전송</td></tr>
          <tr><td><strong>Data Analytics</strong></td><td>실시간 분석</td><td>SQL/Flink로 스트림 분석</td></tr>
        </tbody></table>

        <h3>AWS Glue</h3>
        <ul>
          <li><strong>ETL 작업:</strong> PySpark/Python 기반 데이터 변환</li>
          <li><strong>크롤러:</strong> 스키마 자동 감지 → 데이터 카탈로그 등록</li>
          <li><strong>Job Bookmarks:</strong> 중복 처리 방지</li>
          <li><strong>스키마 레지스트리:</strong> 스트리밍 스키마 버전 관리</li>
        </ul>

        <h3>데이터 형식 비교</h3>
        <table className="info-table"><thead><tr><th>형식</th><th>유형</th><th>용도</th></tr></thead><tbody>
          <tr><td><strong>Parquet</strong></td><td>열 기반</td><td>분석 쿼리 최적화</td></tr>
          <tr><td><strong>ORC</strong></td><td>열 기반</td><td>Hive 최적화</td></tr>
          <tr><td><strong>Avro</strong></td><td>행 기반</td><td>스트리밍, 스키마 진화</td></tr>
          <tr><td><strong>JSON/CSV</strong></td><td>행 기반</td><td>범용, API 데이터</td></tr>
        </tbody></table>

        <ToggleSection title="Glue ETL vs EMR 선택 기준">
          <ul>
            <li><strong>Glue:</strong> 서버리스, 간단~중간 ETL, 카탈로그 연동</li>
            <li><strong>EMR:</strong> 복잡한 Spark/Hadoop, 세밀한 클러스터 제어, 대규모 ML</li>
          </ul>
        </ToggleSection>
      </section>

      <section id="data-store">
        <h2>데이터 저장소 관리 (26%)</h2>
        <h3>Redshift 분산 스타일</h3>
        <table className="info-table"><thead><tr><th>스타일</th><th>설명</th><th>적합</th></tr></thead><tbody>
          <tr><td><strong>KEY</strong></td><td>열 값 기준 분산</td><td>조인 빈번한 대형 테이블</td></tr>
          <tr><td><strong>EVEN</strong></td><td>라운드로빈 균등</td><td>조인 없는 테이블</td></tr>
          <tr><td><strong>ALL</strong></td><td>모든 노드 복사</td><td>소규모 차원 테이블</td></tr>
        </tbody></table>

        <h3>S3 데이터 레이크 패턴</h3>
        <ul>
          <li><strong>계층:</strong> Raw → Processed → Curated</li>
          <li><strong>파티셔닝:</strong> year/month/day로 쿼리 성능 최적화</li>
        </ul>
        <TipBox type="important"><p><strong>S3 + Glue + Athena</strong>는 서버리스 데이터 레이크의 핵심 패턴입니다.</p></TipBox>
      </section>

      <section id="data-operations">
        <h2>데이터 운영 및 지원 (22%)</h2>
        <h3>분석 서비스 비교</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>유형</th><th>과금</th></tr></thead><tbody>
          <tr><td><strong>Athena</strong></td><td>서버리스 SQL</td><td>스캔 데이터량</td></tr>
          <tr><td><strong>Redshift</strong></td><td>데이터 웨어하우스</td><td>노드 시간</td></tr>
          <tr><td><strong>EMR</strong></td><td>빅데이터 클러스터</td><td>인스턴스 시간</td></tr>
          <tr><td><strong>QuickSight</strong></td><td>BI 대시보드</td><td>사용자/세션</td></tr>
        </tbody></table>

        <ToggleSection title="Athena 성능 최적화">
          <ul>
            <li>Parquet/ORC 열 기반 형식 사용</li>
            <li>날짜 기반 파티셔닝으로 스캔량 감소</li>
            <li>파일 크기 128~512MB 최적화</li>
            <li>워크그룹으로 비용 제한 설정</li>
          </ul>
        </ToggleSection>
      </section>

      <section id="data-security">
        <h2>데이터 보안 및 거버넌스 (18%)</h2>
        <h3>암호화 방법</h3>
        <table className="info-table"><thead><tr><th>방법</th><th>키 관리</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>SSE-S3</strong></td><td>AWS 관리</td><td>기본 암호화</td></tr>
          <tr><td><strong>SSE-KMS</strong></td><td>KMS</td><td>감사 로그, 세밀한 제어</td></tr>
          <tr><td><strong>CSE</strong></td><td>클라이언트</td><td>업로드 전 암호화</td></tr>
        </tbody></table>

        <h3>Lake Formation 권한</h3>
        <ul>
          <li><strong>열 수준:</strong> 특정 열만 접근 허용</li>
          <li><strong>행 수준:</strong> 필터 표현식으로 행 제한</li>
          <li><strong>태그 기반:</strong> LF-Tag ABAC 접근 제어</li>
        </ul>
        <TipBox type="warning"><p>Lake Formation은 기존 IAM + S3 정책을 대체하는 통합 권한 모델입니다.</p></TipBox>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="dea-c01" categoryTitle="Data Engineer Associate" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
