import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'network-design', title: '네트워크 설계 (30%)' },
  { id: 'implementation', title: '네트워크 구현 (26%)' },
  { id: 'management', title: '네트워크 관리 및 운영 (20%)' },
  { id: 'security', title: '네트워크 보안 및 규정 준수 (24%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'Direct Connect의 기본 암호화 여부는?', options: ['자동 암호화', '암호화 안 됨', 'TLS 기본 적용', 'IPSec 기본'], answer: 1, explanation: 'Direct Connect는 기본 암호화를 제공하지 않습니다. VPN over DX로 암호화합니다.' },
  { question: 'Transit Gateway가 지원하지 않는 것은?', options: ['VPC 연결', 'VPN 연결', 'Direct Connect Gateway', '전이적 VPC Peering'], answer: 3, explanation: 'VPC Peering은 전이적 라우팅을 지원하지 않으며, TGW는 Peering과 별개입니다.' },
  { question: 'PrivateLink의 주요 용도는?', options: ['인터넷 접근', 'VPC 간 서비스 노출', 'DNS 해석', 'DDoS 방어'], answer: 1, explanation: 'PrivateLink는 프라이빗 네트워크를 통해 서비스를 안전하게 노출합니다.' },
  { question: 'Route 53 DNSSEC의 역할은?', options: ['DNS 암호화', 'DNS 응답 무결성 검증', 'DNS 캐싱', 'DNS 로드밸런싱'], answer: 1, explanation: 'DNSSEC는 DNS 응답이 변조되지 않았음을 검증합니다.' },
  { question: 'Global Accelerator vs CloudFront의 차이는?', options: ['같은 서비스', 'GA는 TCP/UDP, CF는 HTTP', 'CF가 더 빠름', 'GA만 캐싱 지원'], answer: 1, explanation: 'Global Accelerator는 L4(TCP/UDP), CloudFront는 L7(HTTP/HTTPS)에서 동작합니다.' },
  { question: 'VPC 서브넷이 인터넷 접근 불가 시 확인할 것은?', options: ['보안 그룹만', '라우팅 테이블 + IGW/NAT', 'NACL만', 'DNS 설정'], answer: 1, explanation: '라우팅 테이블에 IGW(퍼블릭) 또는 NAT(프라이빗) 경로를 확인합니다.' },
  { question: 'Direct Connect LAG의 목적은?', options: ['암호화', '다중 연결 대역폭 집약', '비용 절감', '지연 감소'], answer: 1, explanation: 'LAG(Link Aggregation Group)는 여러 DX 연결을 하나로 묶어 대역폭을 증가시킵니다.' },
  { question: 'Network Firewall의 배포 위치는?', options: ['CloudFront', 'VPC 서브넷', 'Direct Connect', 'Transit Gateway'], answer: 1, explanation: 'Network Firewall은 VPC 내 전용 서브넷에 엔드포인트로 배포합니다.' },
  { question: 'IPv6 전용 서브넷에서 IPv4 서비스 접근 방법은?', options: ['NAT Gateway', 'NAT64', 'IGW', 'Direct Connect'], answer: 1, explanation: 'NAT64는 IPv6 전용 리소스가 IPv4 서비스에 접근하도록 변환합니다.' },
  { question: 'Reachability Analyzer의 기능은?', options: ['성능 측정', '네트워크 경로 연결성 분석', '트래픽 미러링', '로그 수집'], answer: 1, explanation: 'Reachability Analyzer는 두 리소스 간 네트워크 경로를 분석하여 연결 문제를 진단합니다.' },
]

export default function AnsC01() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('ans-c01') }, [markStudied])

  return (
    <GuideLayout title="Advanced Networking Specialty" description="AWS 네트워크 설계, 구현, 보안, 운영 전문 능력을 검증합니다." icon="🌐" badges={[{ label: 'Specialty', type: 'primary' }, { label: '65문제 / 170분', type: 'info' }]} sections={sections} categoryId="ans-c01">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>ANS-C01</td></tr>
          <tr><td><strong>문항 수</strong></td><td>65문제</td></tr>
          <tr><td><strong>시간 / 합격</strong></td><td>170분 / 750점</td></tr>
          <tr><td><strong>비용</strong></td><td>$300 USD</td></tr>
          <tr><td><strong>권장 경험</strong></td><td>5년 이상 네트워킹 + AWS 경험</td></tr>
        </tbody></table>
        <TipBox type="important"><p>AWS 네트워크 전문 자격증. VPC, Direct Connect, Transit Gateway, DNS가 핵심입니다.</p></TipBox>
      </section>

      <section id="network-design">
        <h2>네트워크 설계 (30%)</h2>
        <h3>하이브리드 연결</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>대역폭</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>Site-to-Site VPN</strong></td><td>~1.25 Gbps</td><td>암호화, 빠른 설정, 인터넷 경유</td></tr>
          <tr><td><strong>Direct Connect</strong></td><td>1/10/100 Gbps</td><td>전용 회선, 일관된 지연</td></tr>
          <tr><td><strong>DX + VPN</strong></td><td>DX 대역폭</td><td>DX 위에 IPSec 암호화</td></tr>
        </tbody></table>

        <h3>VPC 설계 원칙</h3>
        <table className="info-table"><thead><tr><th>원칙</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>CIDR 계획</strong></td><td>중복 방지, 확장 고려 (/16 권장)</td></tr>
          <tr><td><strong>서브넷 분리</strong></td><td>퍼블릭/프라이빗/보호 계층</td></tr>
          <tr><td><strong>Multi-AZ</strong></td><td>최소 2개 AZ에 서브넷 배치</td></tr>
          <tr><td><strong>Secondary CIDR</strong></td><td>IP 부족 시 추가 CIDR 연결</td></tr>
        </tbody></table>

        <ToggleSection title="Transit Gateway 라우팅">
          <table className="info-table"><thead><tr><th>기능</th><th>설명</th></tr></thead><tbody>
            <tr><td><strong>라우팅 테이블</strong></td><td>연결별 다른 라우팅 테이블 적용</td></tr>
            <tr><td><strong>블랙홀 라우트</strong></td><td>특정 CIDR 트래픽 차단</td></tr>
            <tr><td><strong>멀티캐스트</strong></td><td>멀티캐스트 도메인 지원</td></tr>
            <tr><td><strong>피어링</strong></td><td>크로스 리전 TGW 연결</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="implementation">
        <h2>네트워크 구현 (26%)</h2>
        <h3>Direct Connect 구성</h3>
        <table className="info-table"><thead><tr><th>구성요소</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>Connection</strong></td><td>물리적 DX 연결 (전용/호스팅)</td></tr>
          <tr><td><strong>VIF (Virtual Interface)</strong></td><td>Private/Public/Transit VIF</td></tr>
          <tr><td><strong>DX Gateway</strong></td><td>여러 리전의 VPC에 연결</td></tr>
          <tr><td><strong>LAG</strong></td><td>다중 연결 번들링 (대역폭 증가)</td></tr>
        </tbody></table>

        <h3>VIF 유형</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>대상</th><th>용도</th></tr></thead><tbody>
          <tr><td><strong>Private VIF</strong></td><td>VPC (VGW)</td><td>프라이빗 리소스 접근</td></tr>
          <tr><td><strong>Public VIF</strong></td><td>AWS 퍼블릭 서비스</td><td>S3, DynamoDB 등</td></tr>
          <tr><td><strong>Transit VIF</strong></td><td>Transit Gateway</td><td>다수 VPC 접근</td></tr>
        </tbody></table>

        <h3>DNS 아키텍처</h3>
        <ul>
          <li><strong>Route 53 Private Hosted Zone:</strong> VPC 내부 DNS</li>
          <li><strong>Resolver Inbound Endpoint:</strong> 온프레미스 → AWS DNS 쿼리</li>
          <li><strong>Resolver Outbound Endpoint:</strong> AWS → 온프레미스 DNS 쿼리</li>
          <li><strong>Resolver Rules:</strong> 도메인별 DNS 쿼리 전달 규칙</li>
        </ul>
        <TipBox type="warning"><p>DX의 Private VIF vs Transit VIF 차이와 DX Gateway 활용을 이해하세요.</p></TipBox>
      </section>

      <section id="management">
        <h2>네트워크 관리 및 운영 (20%)</h2>
        <h3>네트워크 모니터링 도구</h3>
        <table className="info-table"><thead><tr><th>도구</th><th>기능</th></tr></thead><tbody>
          <tr><td><strong>VPC Flow Logs</strong></td><td>ENI/서브넷/VPC 트래픽 로그</td></tr>
          <tr><td><strong>Traffic Mirroring</strong></td><td>패킷 캡처 (IDS/IPS)</td></tr>
          <tr><td><strong>Reachability Analyzer</strong></td><td>네트워크 경로 연결성 분석</td></tr>
          <tr><td><strong>Network Manager</strong></td><td>글로벌 네트워크 시각화</td></tr>
        </tbody></table>

        <h3>성능 최적화</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>최적화 대상</th></tr></thead><tbody>
          <tr><td><strong>Global Accelerator</strong></td><td>TCP/UDP L4 글로벌 가속 (Anycast IP)</td></tr>
          <tr><td><strong>CloudFront</strong></td><td>HTTP/HTTPS L7 콘텐츠 가속</td></tr>
          <tr><td><strong>Enhanced Networking</strong></td><td>EC2 네트워크 성능 (ENA, 100 Gbps)</td></tr>
          <tr><td><strong>Placement Groups</strong></td><td>클러스터 배치 (저지연)</td></tr>
        </tbody></table>

        <ToggleSection title="VPC Flow Logs 분석">
          <ul>
            <li><strong>필드:</strong> srcaddr, dstaddr, srcport, dstport, protocol, action</li>
            <li><strong>저장:</strong> CloudWatch Logs 또는 S3</li>
            <li><strong>분석:</strong> Athena SQL 쿼리, CloudWatch Logs Insights</li>
            <li><strong>제한:</strong> 패킷 내용은 캡처하지 않음 (메타데이터만)</li>
          </ul>
        </ToggleSection>
      </section>

      <section id="security">
        <h2>네트워크 보안, 규정 준수 및 거버넌스 (24%)</h2>
        <h3>네트워크 보안 계층</h3>
        <table className="info-table"><thead><tr><th>계층</th><th>서비스</th><th>레벨</th></tr></thead><tbody>
          <tr><td><strong>엣지</strong></td><td>WAF + Shield + CloudFront</td><td>L7 / L3-4</td></tr>
          <tr><td><strong>VPC</strong></td><td>Network Firewall</td><td>L3-7 (IDS/IPS)</td></tr>
          <tr><td><strong>서브넷</strong></td><td>NACL</td><td>L4 (상태 비저장)</td></tr>
          <tr><td><strong>인스턴스</strong></td><td>보안 그룹</td><td>L4 (상태 저장)</td></tr>
        </tbody></table>

        <h3>프라이빗 서비스 접근</h3>
        <table className="info-table"><thead><tr><th>방법</th><th>대상</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>Gateway Endpoint</strong></td><td>S3, DynamoDB</td><td>무료, 라우팅 테이블 기반</td></tr>
          <tr><td><strong>Interface Endpoint</strong></td><td>대부분 AWS 서비스</td><td>ENI 기반, 프라이빗 IP</td></tr>
          <tr><td><strong>PrivateLink</strong></td><td>커스텀 서비스</td><td>NLB 뒤에 서비스 노출</td></tr>
        </tbody></table>

        <h3>Network Firewall</h3>
        <ul>
          <li><strong>상태 비저장 규칙:</strong> 패킷 단위 검사 (ACL과 유사)</li>
          <li><strong>상태 저장 규칙:</strong> 연결 추적, IPS, 도메인 필터링</li>
          <li><strong>Suricata 호환:</strong> 오픈소스 IPS 규칙 사용 가능</li>
        </ul>
        <TipBox type="important"><p>Gateway Endpoint(S3/DynamoDB, 무료) vs Interface Endpoint(그 외, 유료) 구분이 핵심입니다.</p></TipBox>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="ans-c01" categoryTitle="Advanced Networking Specialty" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
