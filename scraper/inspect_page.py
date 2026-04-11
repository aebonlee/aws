"""
certi.nxtcloud.kr 페이지 구조 분석 스크립트

사이트의 실제 DOM 구조를 파악하여 crawl_certi.py의 셀렉터를 조정합니다.
문제 페이지에서 실행하면 사용 가능한 셀렉터 정보를 출력합니다.

사용법:
  1. python inspect_page.py
  2. 브라우저에서 로그인
  3. 문제 풀이 페이지로 이동
  4. Enter 누르면 분석 시작
"""

import json
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

try:
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.webdriver.chrome.service import Service
    USE_WDM = True
except ImportError:
    USE_WDM = False

OUTPUT_DIR = Path(__file__).parent / "output"


def create_driver():
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])

    if USE_WDM:
        service = Service(ChromeDriverManager().install())
        return webdriver.Chrome(service=service, options=options)
    return webdriver.Chrome(options=options)


def analyze_page(driver):
    """페이지의 주요 요소 분석"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("\n" + "=" * 60)
    print("페이지 분석 결과")
    print("=" * 60)

    # 현재 URL
    print(f"\nURL: {driver.current_url}")

    # 스크린샷
    ss_path = OUTPUT_DIR / "page_screenshot.png"
    driver.save_screenshot(str(ss_path))
    print(f"스크린샷: {ss_path}")

    # HTML 저장
    html_path = OUTPUT_DIR / "page_source.html"
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(driver.page_source)
    print(f"HTML: {html_path}")

    # 주요 요소 분석
    print("\n── h1 태그 ──")
    for el in driver.find_elements(By.TAG_NAME, "h1"):
        print(f"  text: {el.text[:80]}")
        print(f"  class: {el.get_attribute('class')}")

    print("\n── h2 태그 ──")
    for el in driver.find_elements(By.TAG_NAME, "h2"):
        print(f"  text: {el.text[:80]}")
        print(f"  class: {el.get_attribute('class')}")

    print("\n── label 태그 ──")
    for el in driver.find_elements(By.TAG_NAME, "label"):
        text = el.text.strip()
        if text:
            print(f"  text: {text[:60]}")
            print(f"  class: {el.get_attribute('class')}")
            print(f"  for: {el.get_attribute('for')}")

    print("\n── button 태그 ──")
    for el in driver.find_elements(By.TAG_NAME, "button"):
        text = el.text.strip()
        if text:
            print(f"  text: {text[:40]}")
            print(f"  class: {el.get_attribute('class')}")
            print(f"  disabled: {el.get_attribute('disabled')}")

    print("\n── input[type=radio] ──")
    for el in driver.find_elements(By.CSS_SELECTOR, "input[type='radio']"):
        print(f"  name: {el.get_attribute('name')}")
        print(f"  value: {el.get_attribute('value')}")
        print(f"  id: {el.get_attribute('id')}")

    print("\n── [role='radio'] / [role='radiogroup'] ──")
    for el in driver.find_elements(By.CSS_SELECTOR, "[role='radio'], [role='radiogroup']"):
        print(f"  text: {el.text[:60]}")
        print(f"  role: {el.get_attribute('role')}")
        print(f"  class: {el.get_attribute('class')}")

    # class에 'question', 'option', 'answer', 'explanation' 포함하는 요소
    keywords = ['question', 'option', 'choice', 'answer', 'correct',
                'explanation', 'feedback', 'solution', 'prose']
    print("\n── 키워드 매칭 클래스 ──")
    all_elements = driver.find_elements(By.XPATH, "//*[@class]")
    seen = set()
    for el in all_elements:
        cls = el.get_attribute("class") or ""
        for kw in keywords:
            if kw.lower() in cls.lower() and cls not in seen:
                seen.add(cls)
                text = el.text[:50].replace("\n", " ")
                print(f"  class='{cls}' → '{text}'")

    # 모든 링크(a 태그) 중 drill-zone 관련
    print("\n── drill-zone 관련 링크 ──")
    for el in driver.find_elements(By.TAG_NAME, "a"):
        href = el.get_attribute("href") or ""
        if "drill" in href:
            print(f"  {el.text.strip()[:40]} → {href}")

    # 페이지의 JSON-LD 또는 __NEXT_DATA__ 확인
    print("\n── __NEXT_DATA__ ──")
    try:
        next_data = driver.execute_script(
            "return document.getElementById('__NEXT_DATA__')?.textContent"
        )
        if next_data:
            data = json.loads(next_data)
            nd_path = OUTPUT_DIR / "next_data.json"
            with open(nd_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"  __NEXT_DATA__ 저장: {nd_path}")
            # props 키만 출력
            if "props" in data:
                print(f"  props keys: {list(data['props'].keys())}")
                if "pageProps" in data["props"]:
                    print(f"  pageProps keys: {list(data['props']['pageProps'].keys())}")
        else:
            print("  __NEXT_DATA__ 없음")
    except Exception as e:
        print(f"  에러: {e}")

    # react-query 캐시 확인
    print("\n── React Query 캐시 ──")
    try:
        rq_data = driver.execute_script("""
            const queryClient = window.__REACT_QUERY_STATE__ ||
                                window.__REACT_QUERY_DEVTOOLS_STATE__;
            if (queryClient) return JSON.stringify(queryClient);

            // React internals에서 queryClient 찾기
            const root = document.getElementById('__next');
            if (!root) return null;

            // 모든 script 태그에서 dehydrated state 찾기
            const scripts = document.querySelectorAll('script');
            for (const s of scripts) {
                if (s.textContent.includes('dehydratedState') ||
                    s.textContent.includes('queries')) {
                    return s.textContent.substring(0, 2000);
                }
            }
            return null;
        """)
        if rq_data:
            print(f"  React Query 데이터 발견: {str(rq_data)[:200]}")
        else:
            print("  React Query 캐시 직접 접근 불가")
    except Exception as e:
        print(f"  에러: {e}")

    # 네트워크 요청 중 API 호출 확인 (Performance API)
    print("\n── API 호출 기록 (Performance) ──")
    try:
        entries = driver.execute_script("""
            return performance.getEntriesByType('resource')
                .filter(e => e.name.includes('api') || e.name.includes('graphql')
                        || e.name.includes('question') || e.name.includes('quiz')
                        || e.name.includes('drill'))
                .map(e => e.name);
        """)
        if entries:
            for entry in entries[:20]:
                print(f"  {entry}")
        else:
            print("  관련 API 호출 없음")
    except Exception as e:
        print(f"  에러: {e}")


def main():
    print("=" * 60)
    print("certi.nxtcloud.kr 페이지 구조 분석기")
    print("=" * 60)

    driver = create_driver()

    try:
        driver.get("https://www.certi.nxtcloud.kr")
        time.sleep(2)

        print("\n브라우저에서 로그인 후, 문제 풀이 페이지로 이동하세요.")
        input("\n>> 분석할 페이지에 도착하면 Enter...")

        analyze_page(driver)

        while True:
            action = input("\n다른 페이지 분석? (Enter=분석, q=종료): ").strip()
            if action == "q":
                break
            analyze_page(driver)

    finally:
        driver.quit()


if __name__ == "__main__":
    main()
