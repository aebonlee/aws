export interface CategoryInfo {
  id: string
  title: string
  icon: string
  path: string
  questions: number
  weight: string
  description: string
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'aif-c01', title: '실전 문제 (424)', icon: '🎯', path: '/practice', questions: 424, weight: '실전', description: 'certi.nxtcloud.kr에서 추출한 실전 기출문제 424개' },
  { id: 'ai-ml-basics', title: 'AI와 ML의 기초', icon: '🤖', path: '/ai-ml-basics', questions: 60, weight: '17.6%', description: 'AI, ML, DL의 개념과 유형, AWS AI 서비스' },
  { id: 'ml-development', title: 'ML 개발', icon: '⚙️', path: '/ml-development', questions: 46, weight: '14.1%', description: 'ML 개발 프로세스, EC2 패밀리, 모델 평가' },
  { id: 'sagemaker', title: 'Amazon SageMaker', icon: '🔧', path: '/sagemaker', questions: 38, weight: '11.9%', description: 'SageMaker 라이프사이클, Ground Truth, JumpStart' },
  { id: 'gen-ai-basics', title: '생성형 AI 기초', icon: '✨', path: '/gen-ai-basics', questions: 66, weight: '22.7%', description: 'Foundation Model, LLM, 파라미터 개념' },
  { id: 'prompt-engineering', title: 'FM 활용과 프롬프트 엔지니어링', icon: '💬', path: '/prompt-engineering', questions: 72, weight: '24.2%', description: 'Bedrock, Amazon Q, 프롬프트 기법' },
  { id: 'fm-evaluation', title: 'FM 성능 평가 방법', icon: '📊', path: '/fm-evaluation', questions: 61, weight: '21.3%', description: 'RAG, Fine-tuning, 평가 메트릭' },
  { id: 'responsible-ai', title: 'Responsible AI', icon: '🛡️', path: '/responsible-ai', questions: 37, weight: '8.7%', description: '공정성, 투명성, PDP, SHAP' },
  { id: 'security-governance', title: '보안, 규정 준수, 거버넌스', icon: '🔒', path: '/security-governance', questions: 44, weight: '10.4%', description: 'AWS 보안 서비스, 거버넌스, 규정 준수' },
]
