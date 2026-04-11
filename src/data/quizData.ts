import type { QuizQuestion } from '../components/Quiz'

export interface PracticeQuestion extends QuizQuestion {
  categoryId: string
}

export const allQuestions: PracticeQuestion[] = [
  // ai-ml-basics
  { categoryId: 'ai-ml-basics', question: 'AI, ML, DL의 관계를 올바르게 설명한 것은?', options: ['ML은 AI와 DL을 모두 포함한다', 'AI ⊃ ML ⊃ DL 관계이다', 'DL이 가장 넓은 개념이다', '모두 동일한 개념이다'], answer: 1, explanation: 'AI가 가장 넓은 개념이며, ML은 AI의 하위, DL은 ML의 하위 분야입니다.' },
  { categoryId: 'ai-ml-basics', question: '레이블이 있는 데이터를 사용하는 ML 유형은?', options: ['비지도 학습', '강화 학습', '지도 학습', '전이 학습'], answer: 2, explanation: '지도 학습(Supervised Learning)은 입력-정답 쌍으로 모델을 학습시킵니다.' },
  { categoryId: 'ai-ml-basics', question: '고객을 구매 패턴별 그룹으로 나눌 때 적합한 ML 유형은?', options: ['지도 학습 - 분류', '비지도 학습 - 클러스터링', '강화 학습', '지도 학습 - 회귀'], answer: 1, explanation: '클러스터링은 레이블 없는 데이터를 유사한 그룹으로 나누는 비지도 학습 기법입니다.' },
  { categoryId: 'ai-ml-basics', question: 'Amazon Rekognition의 주요 기능이 아닌 것은?', options: ['이미지 객체 감지', '얼굴 인식', '자연어 감성 분석', '비디오 콘텐츠 감지'], answer: 2, explanation: '감성 분석은 Amazon Comprehend의 기능입니다. Rekognition은 이미지/비디오 분석 서비스입니다.' },
  { categoryId: 'ai-ml-basics', question: '문서에서 텍스트, 표, 양식을 추출하는 서비스는?', options: ['Comprehend', 'Rekognition', 'Textract', 'Translate'], answer: 2, explanation: 'Amazon Textract는 문서에서 텍스트, 표, 양식(key-value) 데이터를 자동 추출합니다.' },
  { categoryId: 'ai-ml-basics', question: '분류와 회귀의 차이는?', options: ['분류는 연속값, 회귀는 범주형', '분류는 비지도, 회귀는 지도', '분류는 범주형, 회귀는 연속 수치', '차이 없음'], answer: 2, explanation: '분류는 카테고리(스팸/정상), 회귀는 연속 수치(가격, 온도)를 예측합니다.' },
  { categoryId: 'ai-ml-basics', question: 'Amazon Lex의 주요 용도는?', options: ['텍스트→음성', '음성→텍스트', '챗봇/음성봇 구축', '문서 텍스트 추출'], answer: 2, explanation: 'Lex는 대화형 챗봇 구축 서비스로 Alexa와 동일한 기술을 사용합니다.' },
  { categoryId: 'ai-ml-basics', question: '개인화 추천 시스템 구축 서비스는?', options: ['Forecast', 'Personalize', 'Kendra', 'Comprehend'], answer: 1, explanation: 'Amazon Personalize는 실시간 개인화 추천을 제공하는 ML 서비스입니다.' },
  { categoryId: 'ai-ml-basics', question: '강화 학습에서 에이전트가 최대화하려는 것은?', options: ['데이터 양', '보상(Reward)', '레이블 수', '클러스터 수'], answer: 1, explanation: '강화 학습은 에이전트가 환경과 상호작용하며 보상을 최대화하도록 학습합니다.' },
  { categoryId: 'ai-ml-basics', question: 'ML 기반 지능형 엔터프라이즈 검색 서비스는?', options: ['Forecast', 'Rekognition', 'Kendra', 'Polly'], answer: 2, explanation: 'Amazon Kendra는 자연어 질문으로 문서에서 정확한 답변을 찾는 검색 서비스입니다.' },

  // ml-development
  { categoryId: 'ml-development', question: 'GPU 기반 ML 학습에 적합한 EC2 인스턴스 패밀리는?', options: ['C 패밀리 (컴퓨팅 최적화)', 'P/G 패밀리 (가속 컴퓨팅)', 'R 패밀리 (메모리 최적화)', 'T 패밀리 (범용)'], answer: 1, explanation: 'P 패밀리(NVIDIA GPU)와 G 패밀리는 ML/DL 학습 및 추론에 최적화된 가속 컴퓨팅 인스턴스입니다.' },
  { categoryId: 'ml-development', question: 'ML 개발 프로세스의 올바른 순서는?', options: ['모델 학습 → 데이터 수집 → 배포 → 평가', '데이터 수집 → 전처리 → 모델 학습 → 평가 → 배포', '평가 → 모델 학습 → 데이터 수집 → 배포', '배포 → 데이터 수집 → 모델 학습 → 평가'], answer: 1, explanation: 'ML 파이프라인: 데이터 수집 → 전처리/피처 엔지니어링 → 모델 학습 → 평가 → 배포/모니터링' },
  { categoryId: 'ml-development', question: '정밀도(Precision)의 정의는?', options: ['전체 중 맞춘 비율', 'TP / (TP + FP)', 'TP / (TP + FN)', '(TP + TN) / 전체'], answer: 1, explanation: '정밀도 = TP/(TP+FP). 모델이 양성으로 예측한 것 중 실제 양성인 비율입니다.' },
  { categoryId: 'ml-development', question: '재현율(Recall)이 중요한 상황은?', options: ['스팸 메일 필터링', '질병 진단 (놓치면 위험)', '제품 추천', '이미지 분류'], answer: 1, explanation: '재현율은 실제 양성을 놓치지 않는 것이 중요한 경우(의료 진단, 사기 탐지) 핵심 지표입니다.' },
  { categoryId: 'ml-development', question: '과적합(Overfitting)의 증상은?', options: ['학습/검증 모두 성능이 낮음', '학습 성능 높고 검증 성능 낮음', '학습 성능 낮고 검증 성능 높음', '학습/검증 모두 성능이 높음'], answer: 1, explanation: '과적합은 학습 데이터에 지나치게 맞춰져 새로운 데이터에 대한 일반화 성능이 떨어지는 현상입니다.' },
  { categoryId: 'ml-development', question: '과적합 해결 방법이 아닌 것은?', options: ['더 많은 학습 데이터 확보', '드롭아웃(Dropout) 적용', '모델 복잡도 증가', '정규화(Regularization)'], answer: 2, explanation: '모델 복잡도를 증가시키면 과적합이 더 심해집니다. 데이터 증가, 드롭아웃, 정규화가 해결 방법입니다.' },
  { categoryId: 'ml-development', question: '결측치(Missing Values) 처리 방법이 아닌 것은?', options: ['평균/중앙값으로 대체', '해당 행 제거', '과적합 적용', 'KNN 기반 대체'], answer: 2, explanation: '과적합은 결측치 처리와 무관합니다. 평균/중앙값 대체, 행 삭제, KNN/모델 기반 대체가 일반적 방법입니다.' },
  { categoryId: 'ml-development', question: 'F1 Score는 어떤 지표의 조화 평균인가?', options: ['정확도와 AUC', '정밀도와 재현율', 'MSE와 RMSE', '편향과 분산'], answer: 1, explanation: 'F1 = 2 × (Precision × Recall) / (Precision + Recall). 정밀도와 재현율의 조화 평균입니다.' },
  { categoryId: 'ml-development', question: 'Inf 패밀리 인스턴스의 용도는?', options: ['범용 워크로드', 'ML 모델 추론(Inference)', '스토리지 최적화', '네트워크 최적화'], answer: 1, explanation: 'Inf 패밀리(AWS Inferentia 칩)는 ML 추론에 특화된 인스턴스로 비용 효율적입니다.' },
  { categoryId: 'ml-development', question: '데이터를 학습/검증/테스트로 나누는 일반적 비율은?', options: ['50/25/25', '70/15/15 또는 80/10/10', '90/5/5', '60/30/10'], answer: 1, explanation: '일반적으로 학습 70-80%, 검증 10-15%, 테스트 10-15%로 분할합니다.' },

  // sagemaker
  { categoryId: 'sagemaker', question: 'SageMaker Ground Truth의 주요 기능은?', options: ['모델 학습', '데이터 라벨링', '모델 배포', '비용 분석'], answer: 1, explanation: 'Ground Truth는 ML 학습 데이터에 라벨(정답)을 붙이는 서비스입니다. 사람 라벨러 + 자동 라벨링을 결합합니다.' },
  { categoryId: 'sagemaker', question: 'SageMaker Data Wrangler의 역할은?', options: ['모델 편향 감지', '데이터 전처리 및 변환', '모델 배포 자동화', '코드 없는 ML'], answer: 1, explanation: 'Data Wrangler는 시각적 인터페이스로 데이터를 탐색, 정제, 변환하는 전처리 도구입니다.' },
  { categoryId: 'sagemaker', question: 'SageMaker Feature Store의 용도는?', options: ['모델 버전 관리', 'ML 피처 저장 및 공유', '학습 데이터 라벨링', '모델 성능 모니터링'], answer: 1, explanation: 'Feature Store는 ML 피처를 중앙에서 저장, 검색, 공유하는 저장소입니다.' },
  { categoryId: 'sagemaker', question: 'SageMaker Clarify의 기능이 아닌 것은?', options: ['모델 편향 감지', '모델 설명 가능성', '피처 중요도 분석', '자동 하이퍼파라미터 튜닝'], answer: 3, explanation: '자동 하이퍼파라미터 튜닝은 SageMaker Automatic Model Tuning의 기능입니다. Clarify는 편향 감지와 설명 가능성을 제공합니다.' },
  { categoryId: 'sagemaker', question: 'SageMaker JumpStart의 역할은?', options: ['사전 학습된 모델 및 솔루션 템플릿 제공', '실시간 추론 엔드포인트', '데이터 라벨링', '피처 저장소'], answer: 0, explanation: 'JumpStart는 사전 학습된 FM/ML 모델, 솔루션 템플릿, 예제 노트북을 제공하여 빠른 시작을 돕습니다.' },
  { categoryId: 'sagemaker', question: 'SageMaker Model Monitor의 기능은?', options: ['모델 학습 자동화', '프로덕션 모델 품질 모니터링', '데이터 라벨링', '코드 없는 ML'], answer: 1, explanation: 'Model Monitor는 배포된 모델의 데이터 드리프트, 모델 품질, 편향, 피처 중요도를 지속 모니터링합니다.' },
  { categoryId: 'sagemaker', question: 'SageMaker Canvas의 특징은?', options: ['Python 코딩 필요', '코드 없이 시각적으로 ML 모델 구축', '대규모 분산 학습 전용', '실시간 스트리밍 처리'], answer: 1, explanation: 'Canvas는 비즈니스 분석가를 위한 No-Code ML 도구로, 코딩 없이 포인트앤클릭으로 모델을 구축합니다.' },
  { categoryId: 'sagemaker', question: 'SageMaker Autopilot의 기능은?', options: ['데이터 라벨링 자동화', 'AutoML - 자동으로 최적 ML 모델 생성', '모델 배포만 자동화', '데이터 시각화'], answer: 1, explanation: 'Autopilot은 AutoML 서비스로, 데이터를 분석하고 자동으로 여러 모델을 학습/비교하여 최적 모델을 추천합니다.' },
  { categoryId: 'sagemaker', question: 'SageMaker 실시간 추론에 사용되는 것은?', options: ['배치 변환 작업', '실시간 엔드포인트', 'Processing Job', 'Ground Truth'], answer: 1, explanation: '실시간 엔드포인트는 밀리초 단위의 지연 시간으로 실시간 추론을 제공합니다.' },
  { categoryId: 'sagemaker', question: 'SageMaker Studio의 역할은?', options: ['데이터 웨어하우스', 'ML 개발용 통합 IDE', '서버리스 컴퓨팅', '네트워크 관리'], answer: 1, explanation: 'SageMaker Studio는 ML 개발의 모든 단계를 하나의 웹 기반 IDE에서 수행할 수 있는 통합 환경입니다.' },

  // gen-ai-basics
  { categoryId: 'gen-ai-basics', question: 'Foundation Model(FM)의 특징으로 올바른 것은?', options: ['소량의 특정 데이터로만 학습', '대규모 데이터로 사전 학습된 범용 모델', '하나의 작업만 수행 가능', '규칙 기반으로 동작'], answer: 1, explanation: 'FM은 대규모 데이터로 사전 학습된 범용 모델로, 파인 튜닝이나 프롬프트로 다양한 작업에 적용할 수 있습니다.' },
  { categoryId: 'gen-ai-basics', question: 'Temperature 값이 높을수록 생성 결과는?', options: ['더 결정적이고 일관됨', '더 다양하고 창의적', '더 짧아짐', '변화 없음'], answer: 1, explanation: 'Temperature가 높으면 확률 분포가 평탄해져 다양한 토큰이 선택될 수 있어 창의적인 결과가 나옵니다.' },
  { categoryId: 'gen-ai-basics', question: 'Top-P (Nucleus Sampling)의 역할은?', options: ['최대 토큰 수 제한', '누적 확률 P까지의 토큰만 후보로 선택', '학습률 조정', '배치 크기 설정'], answer: 1, explanation: 'Top-P는 누적 확률이 P에 도달할 때까지의 토큰만 후보로 포함합니다. P=0.9면 상위 90% 확률의 토큰만 선택됩니다.' },
  { categoryId: 'gen-ai-basics', question: 'Transformer 아키텍처의 핵심 메커니즘은?', options: ['CNN (합성곱)', 'RNN (순환)', 'Self-Attention (자기 주의)', 'Decision Tree'], answer: 2, explanation: 'Transformer는 Self-Attention 메커니즘으로 입력 시퀀스의 모든 토큰 간 관계를 병렬로 처리합니다.' },
  { categoryId: 'gen-ai-basics', question: '토큰(Token)에 대한 설명으로 올바른 것은?', options: ['항상 하나의 단어와 일치', 'LLM이 처리하는 텍스트의 기본 단위', '이미지 처리에만 사용', '문장 단위로 분할'], answer: 1, explanation: '토큰은 LLM이 텍스트를 처리하는 기본 단위입니다. 단어, 서브워드, 문자 등 다양한 크기가 될 수 있습니다.' },
  { categoryId: 'gen-ai-basics', question: '임베딩(Embedding)의 역할은?', options: ['텍스트를 이미지로 변환', '단어/문장을 고차원 벡터로 표현', '모델 압축', '데이터 암호화'], answer: 1, explanation: '임베딩은 텍스트를 수치 벡터로 변환합니다. 의미적으로 유사한 텍스트는 벡터 공간에서 가까이 위치합니다.' },
  { categoryId: 'gen-ai-basics', question: 'Diffusion Model의 이미지 생성 원리는?', options: ['GAN처럼 생성자/판별자 경쟁', '노이즈에서 점진적으로 이미지 복원', 'VAE의 잠재 공간 샘플링', '규칙 기반 이미지 합성'], answer: 1, explanation: 'Diffusion Model은 노이즈를 점진적으로 제거(denoising)하여 이미지를 생성합니다. Stable Diffusion이 대표적입니다.' },
  { categoryId: 'gen-ai-basics', question: 'GAN의 구성 요소는?', options: ['인코더와 디코더', '생성자(Generator)와 판별자(Discriminator)', 'Attention과 FFN', 'Agent와 Environment'], answer: 1, explanation: 'GAN은 생성자가 가짜 데이터를 만들고, 판별자가 진짜/가짜를 구분하며 서로 경쟁하며 학습합니다.' },
  { categoryId: 'gen-ai-basics', question: 'Hallucination(환각)이란?', options: ['모델이 학습을 중단하는 현상', '모델이 사실이 아닌 정보를 생성하는 현상', '과적합의 다른 이름', '모델 추론 속도 저하'], answer: 1, explanation: '환각은 LLM이 그럴듯하지만 사실이 아닌 정보를 자신 있게 생성하는 현상입니다.' },
  { categoryId: 'gen-ai-basics', question: 'Temperature=0으로 설정하면?', options: ['가장 창의적인 결과', '항상 가장 확률 높은 토큰 선택 (결정적)', '출력이 없음', '최대 길이 출력'], answer: 1, explanation: 'Temperature=0이면 항상 가장 높은 확률의 토큰만 선택하여 동일 입력에 동일 출력(결정적)이 됩니다.' },

  // prompt-engineering
  { categoryId: 'prompt-engineering', question: 'Zero-shot 프롬프팅이란?', options: ['예시 없이 직접 질문', '1~2개 예시 제공', '단계적 사고 과정 요청', '여러 답변 후 다수결'], answer: 0, explanation: 'Zero-shot은 예시 없이 직접 작업을 지시합니다. "이 문장의 감성을 분석해주세요."' },
  { categoryId: 'prompt-engineering', question: 'Few-shot 프롬프팅의 특징은?', options: ['예시를 전혀 제공하지 않음', '소수의 입력-출력 예시를 제공하여 패턴 학습 유도', '모델을 재학습시킴', '파인 튜닝과 동일'], answer: 1, explanation: 'Few-shot은 2~5개의 입력-출력 예시를 프롬프트에 포함하여 모델이 패턴을 파악하도록 합니다.' },
  { categoryId: 'prompt-engineering', question: 'Chain-of-Thought(CoT) 프롬프팅의 목적은?', options: ['응답 길이 제한', '단계적 추론 과정을 유도하여 정확도 향상', '이미지 생성', '다국어 번역'], answer: 1, explanation: 'CoT는 "단계별로 생각해보세요"와 같은 지시로 중간 추론 과정을 거쳐 더 정확한 답을 도출합니다.' },
  { categoryId: 'prompt-engineering', question: 'Amazon Bedrock의 핵심 특징은?', options: ['자체 모델만 제공', '다양한 FM을 API로 제공하는 완전 관리형 서비스', '온프레미스 전용', '무료 서비스'], answer: 1, explanation: 'Bedrock은 Claude, Titan, Llama 등 다양한 FM을 API로 제공하며, 인프라 관리 없이 사용할 수 있습니다.' },
  { categoryId: 'prompt-engineering', question: 'Bedrock Knowledge Bases의 용도는?', options: ['모델 학습', 'RAG 구현을 위한 지식 베이스', '데이터 라벨링', '비용 관리'], answer: 1, explanation: 'Knowledge Bases는 문서를 벡터화하여 저장하고, 질문 시 관련 문서를 검색하여 RAG를 구현합니다.' },
  { categoryId: 'prompt-engineering', question: '시스템 프롬프트의 역할은?', options: ['사용자 입력 대체', '모델의 역할, 규칙, 응답 스타일 정의', '모델 파라미터 조정', '토큰 수 제한'], answer: 1, explanation: '시스템 프롬프트는 모델의 역할("당신은 AWS 전문가입니다"), 응답 규칙, 형식 등을 정의합니다.' },
  { categoryId: 'prompt-engineering', question: 'Amazon Q Business의 주요 기능은?', options: ['코드 자동 생성', '기업 데이터 기반 AI 어시스턴트', '이미지 생성', '서버 관리'], answer: 1, explanation: 'Amazon Q Business는 기업 내부 데이터(S3, SharePoint 등)에 연결하여 질문에 답변하는 AI 어시스턴트입니다.' },
  { categoryId: 'prompt-engineering', question: 'Bedrock Guardrails의 기능은?', options: ['네트워크 보안', 'FM 응답의 안전성과 적절성 보장', '비용 관리', '데이터 백업'], answer: 1, explanation: 'Guardrails는 FM의 입출력을 필터링하여 유해 콘텐츠, 할루시네이션, PII 노출 등을 방지합니다.' },
  { categoryId: 'prompt-engineering', question: 'Bedrock Agents의 역할은?', options: ['모델 학습 자동화', '멀티스텝 작업을 FM이 자동으로 수행', '서버 프로비저닝', '데이터 전처리'], answer: 1, explanation: 'Agents는 FM이 API 호출, 데이터 조회 등 여러 단계를 자동으로 수행하여 복잡한 작업을 처리합니다.' },
  { categoryId: 'prompt-engineering', question: 'PartyRock의 용도는?', options: ['대규모 모델 학습', '코드 없이 생성형 AI 앱 프로토타이핑', '데이터 분석', '보안 감사'], answer: 1, explanation: 'PartyRock은 코드 없이 생성형 AI 앱을 빠르게 만들어볼 수 있는 Bedrock 기반 플레이그라운드입니다.' },

  // fm-evaluation
  { categoryId: 'fm-evaluation', question: 'RAG의 핵심 목적은?', options: ['모델 파라미터 수정', '외부 지식으로 FM 응답 품질 향상', '모델 크기 축소', '학습 속도 향상'], answer: 1, explanation: 'RAG는 질문과 관련된 외부 문서를 검색하여 FM에 컨텍스트로 제공, 더 정확한 응답을 생성합니다.' },
  { categoryId: 'fm-evaluation', question: 'Fine-tuning과 RAG의 차이는?', options: ['동일한 기법이다', 'Fine-tuning은 모델 가중치 수정, RAG는 외부 지식 참조', 'RAG가 항상 더 좋다', 'Fine-tuning은 프롬프트만 수정'], answer: 1, explanation: 'Fine-tuning은 모델 가중치를 직접 업데이트하고, RAG는 모델을 수정하지 않고 외부 지식을 활용합니다.' },
  { categoryId: 'fm-evaluation', question: 'BLEU 스코어가 측정하는 것은?', options: ['생성 텍스트의 감성', '생성 텍스트와 참조 텍스트의 n-gram 유사도', '모델 학습 속도', '토큰 수'], answer: 1, explanation: 'BLEU는 기계 번역 품질을 평가하며, 생성 텍스트와 참조 텍스트 간 n-gram 일치 비율을 측정합니다.' },
  { categoryId: 'fm-evaluation', question: 'ROUGE가 주로 평가하는 작업은?', options: ['이미지 분류', '텍스트 요약', '음성 인식', '객체 감지'], answer: 1, explanation: 'ROUGE는 텍스트 요약 품질을 평가하며, 참조 요약과 생성 요약 간 n-gram 재현율을 측정합니다.' },
  { categoryId: 'fm-evaluation', question: 'RLHF의 의미는?', options: ['규칙 기반 강화 학습', '인간 피드백 기반 강화 학습', '자동 하이퍼파라미터 튜닝', '데이터 증강 기법'], answer: 1, explanation: 'RLHF(Reinforcement Learning from Human Feedback)는 인간의 선호도 피드백으로 FM을 정렬(align)합니다.' },
  { categoryId: 'fm-evaluation', question: 'RAG 파이프라인의 올바른 순서는?', options: ['질문→검색→생성', '생성→검색→질문', '학습→검색→배포', '검색→학습→생성'], answer: 0, explanation: 'RAG: 질문 입력 → 벡터 DB에서 관련 문서 검색 → 검색된 문서와 질문을 FM에 전달 → 응답 생성.' },
  { categoryId: 'fm-evaluation', question: 'BERTScore의 특징은?', options: ['단어 빈도 기반 비교', 'BERT 임베딩으로 의미적 유사성 평가', 'n-gram 일치만 측정', '문법 오류 감지'], answer: 1, explanation: 'BERTScore는 BERT 임베딩을 활용하여 생성/참조 텍스트의 의미적 유사성을 측정합니다.' },
  { categoryId: 'fm-evaluation', question: 'FM 성능 개선 시 모델 수정 없이 가장 빠른 방법은?', options: ['Fine-tuning', '프롬프트 엔지니어링', 'RLHF', '사전 학습'], answer: 1, explanation: '프롬프트 엔지니어링은 모델을 수정하지 않고 입력만 최적화하여 빠르게 성능을 개선할 수 있습니다.' },
  { categoryId: 'fm-evaluation', question: 'Perplexity가 낮을수록 의미하는 것은?', options: ['모델이 더 혼란스러움', '모델의 예측 성능이 더 좋음', '학습 데이터가 부족', '과적합 발생'], answer: 1, explanation: 'Perplexity가 낮을수록 모델이 다음 토큰을 잘 예측한다는 의미로, 언어 모델 성능이 좋습니다.' },
  { categoryId: 'fm-evaluation', question: '인간 평가(Human Evaluation)가 필요한 이유는?', options: ['자동 메트릭이 존재하지 않아서', '유창성, 유용성 등 주관적 품질은 자동 메트릭으로 완전히 측정 불가', '비용이 저렴해서', '항상 자동 메트릭보다 빠르므로'], answer: 1, explanation: '자동 메트릭은 표면적 유사도만 측정하며, 응답의 유용성, 정확성, 안전성 등은 인간 평가가 필요합니다.' },

  // responsible-ai
  { categoryId: 'responsible-ai', question: '책임감 있는 AI의 핵심 원칙이 아닌 것은?', options: ['공정성 (Fairness)', '투명성 (Transparency)', '수익 극대화 (Profit Max)', '개인정보 보호 (Privacy)'], answer: 2, explanation: '책임감 있는 AI 원칙: 공정성, 설명 가능성, 개인정보 보호, 안전성, 투명성. 수익 극대화는 원칙이 아닙니다.' },
  { categoryId: 'responsible-ai', question: '샘플링 편향(Sampling Bias)이란?', options: ['알고리즘의 구조적 결함', '학습 데이터가 실제 모집단을 대표하지 못하는 편향', '측정 도구의 오류', '확인하고 싶은 것만 보는 편향'], answer: 1, explanation: '샘플링 편향은 학습 데이터가 전체 모집단을 대표하지 못할 때 발생합니다. 예: 특정 연령대만 포함된 데이터.' },
  { categoryId: 'responsible-ai', question: 'SHAP의 역할은?', options: ['모델 학습 속도 향상', '각 피처의 예측 기여도를 설명', '데이터 암호화', '모델 압축'], answer: 1, explanation: 'SHAP(SHapley Additive exPlanations)은 게임 이론 기반으로 각 피처가 예측에 얼마나 기여했는지 설명합니다.' },
  { categoryId: 'responsible-ai', question: 'PDP(Partial Dependence Plot)의 용도는?', options: ['모델 학습 과정 시각화', '특정 피처와 예측값의 관계를 시각화', '데이터 분포 시각화', '네트워크 구조 시각화'], answer: 1, explanation: 'PDP는 다른 피처를 평균화하고, 특정 피처가 변할 때 예측값이 어떻게 변하는지 보여줍니다.' },
  { categoryId: 'responsible-ai', question: 'SageMaker Clarify의 기능은?', options: ['모델 배포 자동화', '편향 감지 및 모델 설명 가능성', '데이터 라벨링', '코드 생성'], answer: 1, explanation: 'Clarify는 학습 전/후 데이터 편향 감지와 SHAP 기반 모델 설명 가능성을 제공합니다.' },
  { categoryId: 'responsible-ai', question: 'Bedrock Guardrails의 역할은?', options: ['모델 학습 가속', 'FM 입출력의 안전성과 적절성 보장', '비용 절감', '데이터 백업'], answer: 1, explanation: 'Guardrails는 유해 콘텐츠, PII 노출, 주제 이탈 등을 필터링하여 안전한 AI 사용을 보장합니다.' },
  { categoryId: 'responsible-ai', question: '확인 편향(Confirmation Bias)이란?', options: ['데이터 수집 오류', '기존 가설을 확인하는 방향으로 데이터를 해석하는 편향', '알고리즘 결함', '라벨링 오류'], answer: 1, explanation: '확인 편향은 사람이 기존 믿음에 부합하는 데이터만 선택하거나 해석하는 경향입니다.' },
  { categoryId: 'responsible-ai', question: 'LIME의 특징은?', options: ['글로벌 설명 방법', '개별 예측에 대한 로컬 설명 제공', '모델 학습 방법', '데이터 전처리 도구'], answer: 1, explanation: 'LIME(Local Interpretable Model-agnostic Explanations)은 개별 예측을 간단한 모델로 근사하여 설명합니다.' },
  { categoryId: 'responsible-ai', question: 'Model Cards의 용도는?', options: ['모델 학습 코드 저장', '모델의 성능, 한계, 편향을 문서화', '모델 배포 자동화', '비용 관리'], answer: 1, explanation: 'Model Cards는 모델의 목적, 성능 메트릭, 한계, 편향, 윤리적 고려사항을 표준화된 형식으로 문서화합니다.' },
  { categoryId: 'responsible-ai', question: '알고리즘 편향의 원인은?', options: ['데이터 수집 오류만', '모델의 설계나 학습 과정에서 특정 그룹에 불공정한 결과', '하드웨어 오류', '네트워크 문제'], answer: 1, explanation: '알고리즘 편향은 모델 구조, 최적화 방법, 또는 학습 과정에서 특정 그룹에 불리한 결과가 나오는 것입니다.' },

  // security-governance
  { categoryId: 'security-governance', question: '프롬프트 인젝션(Prompt Injection)이란?', options: ['모델 파라미터 변조', '악의적 프롬프트로 FM의 의도된 동작을 우회', 'SQL 인젝션과 동일', 'DDoS 공격'], answer: 1, explanation: '프롬프트 인젝션은 악의적 입력으로 FM의 가드레일을 우회하여 의도치 않은 응답을 유도하는 공격입니다.' },
  { categoryId: 'security-governance', question: '학습 데이터 오염(Data Poisoning)의 위험은?', options: ['모델 속도 저하', '악의적 데이터로 모델이 잘못된 패턴을 학습', '하드웨어 손상', '네트워크 차단'], answer: 1, explanation: '데이터 오염은 학습 데이터에 악의적 데이터를 주입하여 모델이 편향되거나 잘못된 예측을 하도록 합니다.' },
  { categoryId: 'security-governance', question: 'AWS IAM의 역할은?', options: ['데이터 암호화', 'ID 및 접근 권한 관리', '네트워크 방화벽', '로그 분석'], answer: 1, explanation: 'IAM은 AWS 리소스에 대한 접근을 제어합니다. 사용자, 역할, 정책으로 최소 권한 원칙을 적용합니다.' },
  { categoryId: 'security-governance', question: 'AWS KMS의 주요 기능은?', options: ['로그 수집', '암호화 키 생성 및 관리', '위협 탐지', '비용 관리'], answer: 1, explanation: 'KMS(Key Management Service)는 암호화 키를 생성, 저장, 관리하여 데이터 암호화를 지원합니다.' },
  { categoryId: 'security-governance', question: 'Amazon Macie의 기능은?', options: ['DDoS 방어', 'S3에서 민감 데이터(PII) 자동 탐지', '코드 보안 분석', '인증서 관리'], answer: 1, explanation: 'Macie는 ML을 사용하여 S3에서 PII(개인식별정보)를 자동으로 탐지하고 보호합니다.' },
  { categoryId: 'security-governance', question: 'AWS CloudTrail의 역할은?', options: ['실시간 위협 탐지', 'AWS API 호출 로깅 및 감사 추적', '데이터 암호화', 'DDoS 방어'], answer: 1, explanation: 'CloudTrail은 AWS 계정의 모든 API 호출을 기록하여 감사, 규정 준수, 보안 분석에 사용됩니다.' },
  { categoryId: 'security-governance', question: '최소 권한 원칙(Least Privilege)이란?', options: ['모든 사용자에게 관리자 권한 부여', '작업에 필요한 최소한의 권한만 부여', '읽기 권한만 부여', '권한을 부여하지 않음'], answer: 1, explanation: '최소 권한 원칙은 사용자/서비스에게 업무 수행에 필요한 최소한의 권한만 부여하는 보안 원칙입니다.' },
  { categoryId: 'security-governance', question: 'Amazon GuardDuty의 기능은?', options: ['데이터 암호화', '지능형 위협 탐지 서비스', 'ID 관리', '비용 분석'], answer: 1, explanation: 'GuardDuty는 ML 기반으로 AWS 환경의 악의적 활동과 비정상 동작을 지속적으로 모니터링합니다.' },
  { categoryId: 'security-governance', question: 'VPC의 보안 역할은?', options: ['데이터 암호화', '논리적으로 격리된 네트워크 환경 제공', '사용자 인증', '로그 분석'], answer: 1, explanation: 'VPC는 AWS 리소스를 논리적으로 격리된 가상 네트워크에서 운영하여 네트워크 수준 보안을 제공합니다.' },
  { categoryId: 'security-governance', question: 'AI 거버넌스의 핵심 요소가 아닌 것은?', options: ['모델 버전 관리', '규정 준수 감사', '책임 소재 명확화', '마케팅 예산 관리'], answer: 3, explanation: 'AI 거버넌스는 모델 관리, 규정 준수, 책임 소재, 윤리적 사용 등을 다룹니다. 마케팅은 관련 없습니다.' },
]
