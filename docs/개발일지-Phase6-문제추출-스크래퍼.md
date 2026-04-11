# Phase 6 개발일지: certi.nxtcloud.kr 문제 자동 추출 스크래퍼 개발

**날짜**: 2026-04-12
**프로젝트**: AWS 자격증 스터디 사이트 (aws.dreamitbiz.com)
**Phase**: 6 - 실전 문제 자동 추출 도구 개발

---

## 배경

### 프로젝트 개요

부트캠프에서 AWS 자격증 시험을 준비하면서, 반복 학습에 최적화된 개인 스터디 사이트를 구축하고 있다. 기존에 Phase 5까지 AIF-C01 문제 384개를 포함한 퀴즈 시스템과 10개의 학습 페이지를 완성했다.

### 문제 인식

- **AI 생성 문제의 한계**: AI가 만든 문제는 실제 시험과 괴리가 크고, 반복 학습용으로 적합하지 않다. 실전 감각을 기르려면 실제 기출 문제가 필수적이다.
- **certi.nxtcloud.kr의 가치**: 12개 AWS 자격증 카테고리에 걸쳐 약 424개의 실전 문제가 수록되어 있다. 이 문제들은 실제 시험과 유사도가 높아 학습 효과가 뛰어나다.
- **기존 사이트의 불편함**: certi.nxtcloud.kr은 가독성이 떨어지고, 반복 학습에 최적화되어 있지 않다. 우리 사이트에 통합하면 훨씬 효율적인 학습이 가능하다.
- **기술적 장벽**: certi.nxtcloud.kr은 Next.js RSC(React Server Components)와 react-query를 사용하며, 인증이 필요하다. 단순한 HTTP 요청으로는 데이터를 추출할 수 없다.

### 대상 자격증 카테고리 (12개)

| 코드 | 자격증명 | 난이도 |
|------|---------|--------|
| aif-c01 | AI Practitioner | Foundational |
| clf-c02 | Cloud Practitioner | Foundational |
| saa-c03 | Solutions Architect Associate | Associate |
| dva-c02 | Developer Associate | Associate |
| soa-c02 | SysOps Administrator Associate | Associate |
| dea-c01 | Data Engineer Associate | Associate |
| mla-c01 | Machine Learning Engineer Associate | Associate |
| sap-c02 | Solutions Architect Professional | Professional |
| dop-c02 | DevOps Engineer Professional | Professional |
| scs-c02 | Security Specialty | Specialty |
| ans-c01 | Advanced Networking Specialty | Specialty |
| dbs-c01 | Database Specialty | Specialty |

---

## 개발 내용

### 1. Selenium 기반 자동 스크래퍼 (`crawl_certi.py`)

certi.nxtcloud.kr의 모든 12개 카테고리에서 문제를 자동으로 추출하는 메인 도구를 개발했다.

**핵심 기능**:
- 브라우저 자동 실행 후 수동 로그인 대기 (인증 우회)
- 로그인 완료 후 12개 카테고리 순차 탐색
- 각 카테고리의 문제, 선택지, 정답, 해설 자동 추출
- JSON / TSV / TypeScript 3가지 형식으로 출력

**동작 흐름**:
```
1. Chrome 브라우저 자동 실행
2. certi.nxtcloud.kr 접속
3. 사용자가 수동으로 로그인 (Enter 키로 계속 진행)
4. 12개 카테고리 페이지 순차 접근
5. DOM에서 문제 데이터 추출
6. JSON/TSV/TypeScript 파일로 저장
```

**Next.js RSC 대응 전략**:
- SSR로 렌더링된 페이지는 일반 DOM 셀렉터로 접근 가능
- react-query로 클라이언트 측에서 로딩되는 데이터는 WebDriverWait으로 대기
- 인증 토큰은 수동 로그인을 통해 브라우저 세션에 유지

### 2. DOM 구조 분석 도구 (`inspect_page.py`)

스크래퍼 개발 과정에서 CSS 셀렉터를 디버깅하고 페이지 구조를 파악하기 위한 보조 도구를 만들었다.

**용도**:
- 페이지 DOM 구조 덤프
- 셀렉터 유효성 검증
- 동적 로딩 요소 확인

### 3. 브라우저 콘솔 수집기 (`console_collector.js`)

Python/Selenium 설치 없이 브라우저 개발자 도구(F12)에서 직접 실행할 수 있는 JavaScript 버전 추출 도구를 만들었다.

**장점**:
- 별도 설치 불필요 (브라우저만 있으면 됨)
- F12 콘솔에 붙여넣기만 하면 실행
- 이미 로그인된 세션 활용 가능
- 추출 결과를 클립보드로 복사 가능

**사용 시나리오**:
- Python 환경이 없는 컴퓨터에서 빠르게 추출할 때
- 특정 카테고리만 선택적으로 추출할 때
- Selenium 셀렉터가 동작하지 않을 때 대안으로 활용

### 4. JSON to TypeScript 변환기 (`json_to_ts.py`)

추출된 JSON 데이터를 스터디 사이트의 TypeScript 형식으로 변환하는 도구를 개발했다.

**변환 규격**:
```typescript
// PracticeQuestion 인터페이스에 맞춘 출력
export const questions: PracticeQuestion[] = [
  {
    categoryId: "clf-c02",
    question: "문제 텍스트...",
    options: ["A. 선택지1", "B. 선택지2", "C. 선택지3", "D. 선택지4"],
    answer: 0,  // 0-indexed 정답
    explanation: "해설 텍스트..."
  },
  // ...
];
```

### 5. 연습 문제 데이터 구조 구축

`src/data/practice/` 디렉토리에 카테고리별 TypeScript 파일 구조를 확립했다.

**생성된 파일**:
- `clfC02.ts`: CLF-C02 Cloud Practitioner 연습 문제 (placeholder)
- `saaC03.ts`: SAA-C03 Solutions Architect Associate 연습 문제 (placeholder)
- `dvaC02.ts`: DVA-C02 Developer Associate 연습 문제 (placeholder)

이 파일들은 스크래퍼로 추출한 데이터를 `json_to_ts.py`로 변환한 후 채워 넣을 예정이다.

---

## 파일 구조

```
aws/
├── scraper/                          # 문제 추출 도구 모음
│   ├── crawl_certi.py               # 메인 스크래퍼 (Selenium 기반)
│   ├── inspect_page.py              # DOM 구조 분석 도구
│   ├── console_collector.js         # 브라우저 콘솔 버전 추출기
│   ├── json_to_ts.py                # JSON → TypeScript 변환기
│   ├── requirements.txt             # Python 의존성 (selenium, webdriver-manager)
│   └── README.md                    # 사용 설명서
│
├── src/
│   ├── data/
│   │   ├── practice/                # 카테고리별 연습 문제 데이터
│   │   │   ├── clfC02.ts           # CLF-C02 문제 (placeholder)
│   │   │   ├── saaC03.ts           # SAA-C03 문제 (placeholder)
│   │   │   └── dvaC02.ts           # DVA-C02 문제 (placeholder)
│   │   └── quizData.ts             # 기존 AIF-C01 문제 384개
│   │
│   └── pages/
│       └── Practice.tsx             # 퀴즈 연습 페이지
│
└── docs/
    └── 개발일지-Phase6-문제추출-스크래퍼.md  # 본 문서
```

---

## 사용 방법

### 방법 1: Selenium 스크래퍼 (전체 자동 추출)

전체 12개 카테고리를 한 번에 추출할 때 사용한다.

```bash
# 1. 의존성 설치
cd scraper/
pip install -r requirements.txt

# 2. 스크래퍼 실행
python crawl_certi.py

# 3. 브라우저가 열리면 수동으로 로그인
# 4. 로그인 완료 후 터미널에서 Enter 키 입력
# 5. 자동으로 12개 카테고리 순회하며 추출
# 6. 결과 파일: output/ 디렉토리에 JSON/TSV/TypeScript 생성
```

### 방법 2: 브라우저 콘솔 (설치 불필요)

Python 없이 빠르게 추출할 때 사용한다.

```
1. certi.nxtcloud.kr에 로그인
2. 원하는 카테고리 페이지로 이동
3. F12 → Console 탭 열기
4. console_collector.js 내용을 붙여넣고 Enter
5. 추출 완료 후 결과가 콘솔에 출력됨
6. 결과를 복사하여 JSON 파일로 저장
```

### 방법 3: JSON → TypeScript 변환

추출된 JSON을 사이트에 통합할 때 사용한다.

```bash
# JSON 파일을 TypeScript로 변환
python json_to_ts.py input.json output.ts --category clf-c02

# 변환된 파일을 src/data/practice/에 복사
cp output.ts ../src/data/practice/clfC02.ts
```

---

## 기술 노트

### certi.nxtcloud.kr 사이트 분석

**기술 스택**:
- Next.js (App Router, React Server Components)
- react-query (TanStack Query) 기반 데이터 페칭
- 인증 필수 (로그인 없이 문제 열람 불가)

**스크래핑 시 고려사항**:
- RSC로 서버 사이드 렌더링되는 부분과 클라이언트 사이드 하이드레이션 부분이 혼재
- react-query 캐시를 통해 데이터가 로딩되므로, 페이지 전환 후 충분한 대기 시간 필요
- 인증 토큰이 쿠키/localStorage에 저장되므로 Selenium의 브라우저 세션을 활용

**DOM 셀렉터 전략**:
- 클래스명이 난독화(hashed)되어 있어 CSS 클래스 기반 셀렉터는 불안정
- 데이터 속성이나 구조적 위치 기반 셀렉터 활용
- `inspect_page.py`로 사전 분석 후 안정적인 셀렉터 확보

### PracticeQuestion 인터페이스

```typescript
interface PracticeQuestion {
  categoryId: string;    // 자격증 코드 (예: "clf-c02")
  question: string;      // 문제 텍스트
  options: string[];     // 선택지 배열 (보통 4개)
  answer: number;        // 정답 인덱스 (0-indexed)
  explanation: string;   // 해설
}
```

**주의사항**:
- `answer` 필드는 0-indexed이다. A=0, B=1, C=2, D=3
- certi.nxtcloud.kr에서 추출 시 정답이 "A", "B" 등 문자열로 되어 있으므로 변환 필요
- `json_to_ts.py`에서 이 변환을 자동으로 처리

### 기존 데이터와의 관계

- `quizData.ts`: AIF-C01 문제 384개 (Phase 5에서 구축, 기존 형식)
- `practice/*.ts`: Phase 6에서 새로 구축하는 카테고리별 문제 파일 (PracticeQuestion 형식)
- `Practice.tsx`: 두 데이터 소스를 모두 활용하는 퀴즈 UI

### 3가지 추출 방법 비교

| 항목 | Selenium 스크래퍼 | 브라우저 콘솔 | 수동 추출 |
|------|-------------------|--------------|----------|
| 설치 필요 | Python + Selenium | 없음 | 없음 |
| 자동화 수준 | 전체 자동 | 카테고리별 수동 실행 | 완전 수동 |
| 안정성 | DOM 변경에 민감 | 비교적 안정 | 가장 안정 |
| 속도 | 전체 추출 시 가장 빠름 | 중간 | 느림 |
| 추천 상황 | 전체 데이터 일괄 추출 | 특정 카테고리만 추출 | 소수 문제 확인 |

---

## 다음 단계: 문제 추출 후 TypeScript 변환 및 사이트 통합

### Phase 7 예정 작업

1. **전체 카테고리 문제 추출 실행**
   - Selenium 스크래퍼 또는 콘솔 수집기로 12개 카테고리 문제 추출
   - 추출된 JSON 데이터 검증 (문제 수, 정답 매칭, 해설 유무 확인)

2. **TypeScript 변환 및 데이터 파일 완성**
   - `json_to_ts.py`로 전체 JSON → TypeScript 변환
   - `src/data/practice/` 디렉토리의 placeholder 파일을 실제 데이터로 교체
   - 나머지 9개 카테고리 TypeScript 파일 추가 생성

3. **Practice.tsx 연동 확장**
   - 현재 AIF-C01 전용인 퀴즈 시스템을 12개 카테고리 지원으로 확장
   - 카테고리 선택 UI 추가
   - 카테고리별 진행률 추적 기능

4. **학습 기능 고도화**
   - 오답 노트 기능: 틀린 문제만 모아서 반복 학습
   - 북마크 기능: 중요 문제 표시
   - 학습 통계: 카테고리별 정답률, 학습 시간 추적
   - 시험 모드: 실제 시험과 동일한 시간 제한 및 문제 수

5. **데이터 유지보수 체계**
   - certi.nxtcloud.kr 문제 업데이트 시 재추출 프로세스 정립
   - 문제 데이터 버전 관리 방안

---

## 회고

- AI가 생성한 문제로는 실전 감각을 기르기 어렵다는 것을 확인했다. 실제 기출 문제 기반 학습이 핵심이다.
- Next.js RSC + 인증이 결합된 사이트는 단순 HTTP 요청으로 스크래핑할 수 없어, Selenium과 브라우저 콘솔이라는 두 가지 접근법을 모두 준비했다.
- 브라우저 콘솔 버전(`console_collector.js`)은 설치가 필요 없어 환경에 구애받지 않는 장점이 있다. Selenium이 안 될 때의 유용한 대안이다.
- 12개 카테고리 약 424개 문제를 확보하면, 부트캠프 기간 중 AWS 자격증 준비에 충분한 문제 은행이 구축될 것이다.
