# 개발일지 - Phase 7: 실전 기출문제 추출 및 사이트 통합

**날짜**: 2026-04-12
**Phase**: 7 (데이터 수집 및 통합)

---

## 배경

- AWS AIF-C01 자격증 학습 사이트에 AI가 생성한 문제만 있었음
- 사용자가 "생성해서 임의로 만드는 문제는 도움이 안된다"고 피드백
- certi.nxtcloud.kr에서 실전 기출문제 424개를 추출하여 사이트에 통합 필요
- 424개 문제를 수동으로 복사하는 것은 비현실적 → 자동화 도구 개발

---

## 기술 결정

### 문제 추출 방식: 브라우저 콘솔 스크립트

| 검토 옵션 | 장점 | 단점 | 선택 |
|-----------|------|------|------|
| **브라우저 콘솔 IIFE** | 설치 불필요, 즉시 실행, 인증 문제 없음 | 수동 페이지 이동 필요 | **채택** |
| Selenium (Python) | 완전 자동화 | Python 설치 필요, 인증 처리 복잡 | 보조 |
| WebFetch/크롤링 | 서버 사이드 | RSC 렌더링 + 인증으로 404 반환 | 실패 |

**핵심 선택 근거**:
- certi.nxtcloud.kr은 Next.js RSC + 인증 필요 → 서버 크롤링 불가
- 브라우저 콘솔에서 직접 DOM 파싱이 가장 안정적
- 한국어 문자가 채팅 복사 시 깨지는 문제 → Unicode 이스케이프(`\uC815\uB2F5`)로 해결
- 파일 기반 복사(`paste_this.js` → 메모장 → Ctrl+A → Ctrl+C) 워크플로 확립

---

## 추출 프로세스

### 1단계: Q1~Q200 추출
- `paste_this.js` (시작: n=1, 최대: m=200)
- certi.nxtcloud.kr 1번 문제 페이지에서 실행
- 결과: `1~200.json` (200문제)

### 2단계: Q201~Q400 추출
- `paste_this_201.js` (시작: n=201, 최대: m=400)
- 201번 문제 페이지에서 실행
- 결과: `200-400.json` (누적 400문제)

### 3단계: Q401~Q424 추출
- `paste_this_401.js` (시작: n=401, 최대: m=500)
- 401번 문제 페이지에서 실행
- 결과: `424.json` (전체 424문제)

---

## 데이터 처리

### JSON 정제
- `categoryId`: "unknown" → "aif-c01"로 일괄 변경
- `answer: -1` (다중선택 문제 Q43, Q57, Q85 등): `0`으로 보정
- 중복 확인: Q27, Q28 동일 문제 존재 (원본 사이트 이슈)
- `explanation`: 모든 문제 빈 문자열 (사이트에서 미제공)

### TypeScript 변환
`merge_and_convert.cjs` 스크립트로 자동 변환:
```
aif-c01_all.json (424문제) → aifC01.ts (TypeScript 데이터 파일)
```

변환 규칙:
- 문자열 이스케이프: `\`, `'`, 줄바꿈 처리
- `PracticeQuestion` 타입 준수
- `answer < 0` → `0`으로 보정

---

## 사이트 통합

### quizData.ts 수정
```typescript
import { aifC01Questions } from './practice/aifC01'

export const allQuestions: PracticeQuestion[] = [
  ...aifC01Questions,  // 424개 실전 문제 추가
  // 기존 카테고리별 문제 유지...
]
```

### categories.ts 수정
```typescript
{ id: 'aif-c01', title: '실전 문제 (424)', icon: '🎯', path: '/practice',
  questions: 424, weight: '실전',
  description: 'certi.nxtcloud.kr에서 추출한 실전 기출문제 424개' },
```

Practice 페이지에서 "실전 문제 (424)" 카테고리를 선택하면 424개 중 랜덤 20문제 출제.

---

## 수정/생성 파일 목록

### 새로 생성된 파일
| 파일 | 용도 |
|------|------|
| `scraper/paste_this.js` | Q1~200 추출 콘솔 스크립트 |
| `scraper/paste_this_201.js` | Q201~400 추출 콘솔 스크립트 |
| `scraper/paste_this_401.js` | Q401~424 추출 콘솔 스크립트 |
| `scraper/convert.cjs` | JSON→TypeScript 변환기 |
| `scraper/merge_and_convert.cjs` | 전체 병합+변환 스크립트 |
| `scraper/output/aif-c01.json` | 1~200 정제 JSON |
| `scraper/output/aif-c01_all.json` | 전체 424문제 정제 JSON |
| `data/1~200.json` | 브라우저 다운로드 원본 |
| `data/200-400.json` | 브라우저 다운로드 원본 |
| `data/424.json` | 브라우저 다운로드 최종 원본 |
| `src/data/practice/aifC01.ts` | 424개 실전 문제 TypeScript |
| `docs/개발일지-Phase7-실전문제-추출-통합.md` | 본 문서 |

### 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/data/quizData.ts` | `aifC01Questions` import 및 allQuestions에 추가 |
| `src/lib/categories.ts` | "실전 문제 (424)" 카테고리 추가 |

---

## 콘솔 스크립트 동작 원리

```
(function(){
  1. 현재 페이지에서 H1/H2로 문제 텍스트 추출 (gQ)
  2. label 요소에서 보기 옵션 추출 (gO)
  3. 첫 번째 옵션 클릭 (cF)
  4. "정답 확인" 버튼 클릭 (cS)
  5. 정답 표시에서 A~D 추출 (gA)
  6. 해설 텍스트 추출 (gE)
  7. 결과를 window.__Q 배열에 push
  8. "다음" 버튼 클릭 (cN)
  9. 반복 (2초 간격)
  10. 완료 시 JSON 파일 자동 다운로드
})();
```

한국어 버튼 텍스트는 Unicode 이스케이프로 처리:
- `\uC815\uB2F5` = 정답
- `\uC81C\uCD9C` = 제출
- `\uB2E4\uC74C` = 다음

---

## 빌드 결과

```
Practice-EmQIy52e.js   279.00 kB │ gzip: 61.96 kB  (424문제 포함)
index-C1QB-3tK.js      244.92 kB │ gzip: 78.55 kB
빌드 시간: 1.73s
```

---

## 향후 계획

- [ ] 다중선택 문제(answer: -1) 정답 수동 검증 및 수정
- [ ] explanation(해설) 데이터 추가 수집 또는 AI 생성
- [ ] 중복 문제(Q27=Q28) 제거
- [ ] 다른 자격증(CLF-C02, SAA-C03 등) 실전 문제 추출
