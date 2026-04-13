export interface SectionInfo {
  id: string
  title: string
}

export interface CategoryInfo {
  id: string
  title: string
  icon: string
  path: string
  questions: number
  weight: string
  description: string
  sections: SectionInfo[]
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'ai-ml-basics', title: 'AI와 ML의 기초', icon: '🤖', path: '/ai-ml-basics',
    questions: 60, weight: '17.6%', description: 'AI, ML, DL의 개념과 유형, AWS AI 서비스',
    sections: [
      { id: 'ai-ml-dl', title: 'AI / ML / DL 개념' },
      { id: 'ml-types', title: 'ML 유형' },
      { id: 'classification-regression', title: '분류 vs 회귀' },
      { id: 'aws-ai-services', title: 'AWS AI 서비스' },
    ],
  },
  {
    id: 'ml-development', title: 'ML 개발', icon: '⚙️', path: '/ml-development',
    questions: 46, weight: '14.1%', description: 'ML 개발 프로세스, EC2 패밀리, 모델 평가',
    sections: [
      { id: 'ec2-families', title: 'EC2 인스턴스 패밀리' },
      { id: 'ml-process', title: 'ML 개발 프로세스' },
      { id: 'data-preprocessing', title: '데이터 전처리' },
      { id: 'model-evaluation', title: '모델 평가 지표' },
      { id: 'overfitting', title: '과적합 / 과소적합' },
    ],
  },
  {
    id: 'sagemaker', title: 'Amazon SageMaker', icon: '🔧', path: '/sagemaker',
    questions: 38, weight: '11.9%', description: 'SageMaker 라이프사이클, Ground Truth, JumpStart',
    sections: [
      { id: 'overview', title: 'SageMaker 개요' },
      { id: 'build', title: '빌드 단계 서비스' },
      { id: 'train', title: '학습 단계 서비스' },
      { id: 'deploy', title: '배포 및 모니터링' },
      { id: 'no-code', title: 'No-Code/Low-Code' },
    ],
  },
  {
    id: 'gen-ai-basics', title: '생성형 AI 기초', icon: '✨', path: '/gen-ai-basics',
    questions: 66, weight: '22.7%', description: 'Foundation Model, LLM, 파라미터 개념',
    sections: [
      { id: 'foundation-model', title: 'Foundation Model (FM)' },
      { id: 'llm', title: 'LLM과 Transformer' },
      { id: 'parameters', title: '추론 파라미터' },
      { id: 'gen-ai-types', title: '생성형 AI 유형' },
      { id: 'tokens-embeddings', title: '토큰과 임베딩' },
    ],
  },
  {
    id: 'prompt-engineering', title: 'FM 활용과 프롬프트 엔지니어링', icon: '💬', path: '/prompt-engineering',
    questions: 72, weight: '24.2%', description: 'Bedrock, Amazon Q, 프롬프트 기법',
    sections: [
      { id: 'prompt-basics', title: '프롬프트 엔지니어링 기초' },
      { id: 'techniques', title: '프롬프트 기법' },
      { id: 'bedrock', title: 'Amazon Bedrock' },
      { id: 'amazon-q', title: 'Amazon Q' },
    ],
  },
  {
    id: 'fm-evaluation', title: 'FM 성능 평가 방법', icon: '📊', path: '/fm-evaluation',
    questions: 61, weight: '21.3%', description: 'RAG, Fine-tuning, 평가 메트릭',
    sections: [
      { id: 'improvement', title: 'FM 성능 개선 방법' },
      { id: 'rag', title: 'RAG (검색 증강 생성)' },
      { id: 'fine-tuning', title: 'Fine-tuning' },
      { id: 'evaluation', title: '평가 메트릭' },
    ],
  },
  {
    id: 'responsible-ai', title: 'Responsible AI', icon: '🛡️', path: '/responsible-ai',
    questions: 37, weight: '8.7%', description: '공정성, 투명성, PDP, SHAP',
    sections: [
      { id: 'principles', title: '책임감 있는 AI 원칙' },
      { id: 'bias', title: '편향 유형' },
      { id: 'explainability', title: '모델 해석 방법' },
      { id: 'aws-responsible', title: 'AWS 책임감 있는 AI' },
    ],
  },
  {
    id: 'security-governance', title: '보안, 규정 준수, 거버넌스', icon: '🔒', path: '/security-governance',
    questions: 44, weight: '10.4%', description: 'AWS 보안 서비스, 거버넌스, 규정 준수',
    sections: [
      { id: 'threats', title: 'AI 보안 위협' },
      { id: 'aws-security', title: 'AWS 보안 서비스' },
      { id: 'data-privacy', title: '데이터 프라이버시' },
      { id: 'governance', title: 'AI 거버넌스' },
    ],
  },
]
