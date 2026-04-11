# certi.nxtcloud.kr 문제 추출기

## 방법 1: 브라우저 콘솔 (추천 - 설치 불필요)

1. `certi.nxtcloud.kr` 로그인
2. drill-zone에서 원하는 카테고리의 **첫 번째 문제 페이지**로 이동
3. `F12` → Console 탭
4. `console_collector.js` 내용 전체 복사 → 콘솔에 붙여넣기 → Enter
5. 자동으로 문제 수집 후 JSON 파일 다운로드

### 조작법
- 중단: `window.__STOP_COLLECTOR = true`
- 수동 다운로드: `window.__DOWNLOAD_RESULTS()`
- 현재 결과: `window.__COLLECTED_QUESTIONS`

## 방법 2: Selenium (Python)

```bash
cd scraper
pip install -r requirements.txt
python crawl_certi.py              # 전체 카테고리
python crawl_certi.py aif-c01      # 특정 카테고리만
```

## 방법 3: 페이지 분석 (셀렉터 디버깅)

```bash
python inspect_page.py
```

## 출력 파일

```
output/
  questions_all.json     전체 JSON
  questions_all.tsv      전체 TSV (엑셀 호환)
  aif-c01.json           카테고리별 JSON
  clf-c02.json
  ...
  ts/
    aifC01.ts            TypeScript 데이터 파일 (프로젝트에 바로 사용)
    clfC02.ts
    ...
```

## JSON → TypeScript 변환

추출된 JSON을 수동으로 변환하려면 `json_to_ts.py` 사용:
```bash
python json_to_ts.py output/aif-c01.json
```
