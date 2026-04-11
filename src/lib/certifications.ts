export interface CertInfo {
  code: string
  title: string
  titleKo: string
  level: 'foundational' | 'associate' | 'professional' | 'specialty'
  path: string
  available: boolean
  description: string
}

export interface CertLevel {
  id: string
  title: string
  titleKo: string
  certs: CertInfo[]
}

export const CERT_LEVELS: CertLevel[] = [
  {
    id: 'foundational',
    title: 'Foundational',
    titleKo: '기초',
    certs: [
      {
        code: 'CLF-C02',
        title: 'Cloud Practitioner',
        titleKo: '클라우드 실무자',
        level: 'foundational',
        path: '/clf-c02',
        available: true,
        description: 'AWS 클라우드의 기본 개념, 서비스, 보안, 아키텍처, 요금 및 지원에 대한 전반적 이해',
      },
      {
        code: 'AIF-C01',
        title: 'AI Practitioner',
        titleKo: 'AI 실무자',
        level: 'foundational',
        path: '/',
        available: true,
        description: 'AI/ML 기초, 생성형 AI, 프롬프트 엔지니어링, Responsible AI, AWS AI 서비스',
      },
    ],
  },
  {
    id: 'associate',
    title: 'Associate',
    titleKo: '어소시에이트',
    certs: [
      {
        code: 'SAA-C03',
        title: 'Solutions Architect',
        titleKo: '솔루션즈 아키텍트',
        level: 'associate',
        path: '/saa-c03',
        available: true,
        description: 'AWS에서 안전하고 강력한 애플리케이션을 설계하는 능력 검증',
      },
      {
        code: 'DVA-C02',
        title: 'Developer',
        titleKo: '개발자',
        level: 'associate',
        path: '/dva-c02',
        available: true,
        description: 'AWS 기반 애플리케이션 개발, 배포, 디버깅 능력 검증',
      },
      {
        code: 'SOA-C02',
        title: 'SysOps Administrator',
        titleKo: '시스템 운영 관리자',
        level: 'associate',
        path: '/soa-c02',
        available: true,
        description: 'AWS 환경의 배포, 관리, 운영 능력 검증',
      },
      {
        code: 'DEA-C01',
        title: 'Data Engineer',
        titleKo: '데이터 엔지니어',
        level: 'associate',
        path: '/dea-c01',
        available: true,
        description: '데이터 파이프라인 구축, 데이터 수집/변환/저장 자동화 능력 검증',
      },
      {
        code: 'MLA-C01',
        title: 'Machine Learning Engineer',
        titleKo: '머신러닝 엔지니어',
        level: 'associate',
        path: '/mla-c01',
        available: true,
        description: 'ML 워크로드 구현, 배포, 유지 관리 능력 검증',
      },
    ],
  },
  {
    id: 'professional',
    title: 'Professional',
    titleKo: '프로페셔널',
    certs: [
      {
        code: 'SAP-C02',
        title: 'Solutions Architect',
        titleKo: '솔루션즈 아키텍트',
        level: 'professional',
        path: '/sap-c02',
        available: true,
        description: '복잡한 AWS 환경에서 분산 시스템 설계 및 배포 전문 능력 검증',
      },
      {
        code: 'DOP-C02',
        title: 'DevOps Engineer',
        titleKo: 'DevOps 엔지니어',
        level: 'professional',
        path: '/dop-c02',
        available: true,
        description: 'AWS 플랫폼에서 CI/CD 파이프라인 및 자동화 운영 전문 능력 검증',
      },
    ],
  },
  {
    id: 'specialty',
    title: 'Specialty',
    titleKo: '전문 분야',
    certs: [
      {
        code: 'SCS-C02',
        title: 'Security',
        titleKo: '보안',
        level: 'specialty',
        path: '/scs-c02',
        available: true,
        description: 'AWS 워크로드 보안, 데이터 보호, 인시던트 대응 전문 능력 검증',
      },
      {
        code: 'ANS-C01',
        title: 'Advanced Networking',
        titleKo: '고급 네트워킹',
        level: 'specialty',
        path: '/ans-c01',
        available: true,
        description: 'AWS 네트워크 아키텍처 설계 및 구현 전문 능력 검증',
      },
    ],
  },
]
