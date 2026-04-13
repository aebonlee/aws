# 개발일지 - Phase 15: 학습 콘텐츠 드롭다운 제거 (전체 펼침)

**날짜**: 2026-04-14
**Phase**: 15

---

## 1. 개요

학습 페이지의 `ToggleSection` 컴포넌트가 기본적으로 접혀 있어서
사용자가 매번 클릭하여 펼쳐야 하는 불편함을 해소.
모든 학습 콘텐츠를 드롭다운 없이 항상 나열된 상태로 표시하도록 변경.

### 작업 목표
1. ToggleSection 컴포넌트에서 토글 로직 제거
2. 콘텐츠 항상 펼쳐진 상태로 렌더링
3. 모든 학습 페이지(18개)에 자동 적용

---

## 2. 수정 파일 (1개)

| 파일 | 변경 내용 |
|------|----------|
| `src/components/ToggleSection.tsx` | `useState` 토글 로직 제거, 콘텐츠 항상 표시 |

---

## 3. 핵심 변경 사항

### Before (토글 방식)
```tsx
import { ReactNode, useState } from 'react'

export default function ToggleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="toggle-section">
      <div className="toggle-header" onClick={() => setOpen(!open)}>
        <span className={`toggle-arrow ${open ? 'open' : ''}`}>▶</span>
        {title}
      </div>
      {open && <div className="toggle-body">{children}</div>}
    </div>
  )
}
```

### After (항상 펼침)
```tsx
import { ReactNode } from 'react'

export default function ToggleSection({ title, children }) {
  return (
    <div className="toggle-section">
      <div className="toggle-header">
        <span className="toggle-arrow open">▶</span>
        {title}
      </div>
      <div className="toggle-body">{children}</div>
    </div>
  )
}
```

### 변경 포인트
- `useState` import 제거 (React state 불필요)
- `defaultOpen` prop 무시 (항상 펼침이므로)
- `onClick` 핸들러 제거 (토글 동작 없음)
- 화살표(▶) 항상 `open` 클래스 적용
- `{open && ...}` 조건부 렌더링 → 무조건 렌더링

---

## 4. 영향 범위

### AIF-C01 학습 페이지 (8개) — 136회 사용
| 페이지 | ToggleSection 사용 수 |
|--------|---------------------|
| ResponsibleAi.tsx | 23 |
| GenAiBasics.tsx | 21 |
| FmEvaluation.tsx | 19 |
| MlDevelopment.tsx | 19 |
| SageMaker.tsx | 17 |
| SecurityGovernance.tsx | 13 |
| AiMlBasics.tsx | 13 |
| PromptEngineering.tsx | 11 |

### AWS 자격증 페이지 (10개) — 48회 사용
| 페이지 | ToggleSection 사용 수 |
|--------|---------------------|
| ClfC02, SaaC03, DvaC02, SoaC02, DeaC01 | 각 3~5 |
| MlaC01, SapC02, DopC02, ScsC02, AnsC01 | 각 3~5 |

---

## 5. 빌드 확인

- `npx tsc --noEmit` 통과
- `npm run build` 성공 (148 modules, 4.35s)
