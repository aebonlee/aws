"""
certi.nxtcloud.kr 문제 자동 추출 스크립트

사용법:
  1. pip install -r requirements.txt
  2. python crawl_certi.py
  3. 브라우저가 열리면 수동으로 로그인
  4. 로그인 후 터미널에서 Enter 키 누르기
  5. 자동으로 문제 추출 시작

출력:
  - output/questions_all.json  (전체 JSON)
  - output/questions_all.tsv   (탭 구분 텍스트)
  - output/{category}.json     (카테고리별 JSON)
"""

import json
import os
import sys
import time
import traceback
from datetime import datetime
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException,
    NoSuchElementException,
    StaleElementReferenceException,
    ElementClickInterceptedException,
)

try:
    from webdriver_manager.chrome import ChromeDriverManager
    USE_WDM = True
except ImportError:
    USE_WDM = False

# ──────────────────────────────────────────────
# 설정
# ──────────────────────────────────────────────
BASE_URL = "https://www.certi.nxtcloud.kr"
DRILL_ZONE_URL = f"{BASE_URL}/ko/drill-zone"
OUTPUT_DIR = Path(__file__).parent / "output"
WAIT_TIMEOUT = 15  # 요소 대기 시간(초)
PAGE_LOAD_DELAY = 2  # 페이지 로드 후 대기(초)
BETWEEN_QUESTIONS_DELAY = 1.5  # 문제 간 대기(초)

# 추출할 카테고리 (drill-zone에서 보이는 것들)
# 필요한 카테고리만 남기거나 추가하세요
CATEGORIES = [
    "aif-c01",    # AI Practitioner
    "clf-c02",    # Cloud Practitioner
    "saa-c03",    # Solutions Architect Associate
    "dva-c02",    # Developer Associate
    "soa-c02",    # SysOps Administrator
    "dea-c01",    # Data Engineer Associate
    "mla-c01",    # ML Engineer Associate
    "sap-c02",    # Solutions Architect Professional
    "dop-c02",    # DevOps Engineer Professional
    "scs-c02",    # Security Specialty
    "ans-c01",    # Advanced Networking
    "dbs-c01",    # Database Specialty
]


def create_driver():
    """Chrome WebDriver 생성"""
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    # user-data-dir을 사용하면 기존 Chrome 프로필의 로그인 세션을 유지할 수 있음
    # options.add_argument(r"--user-data-dir=C:\Users\ASUS\AppData\Local\Google\Chrome\User Data")
    # options.add_argument("--profile-directory=Default")

    if USE_WDM:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
    else:
        driver = webdriver.Chrome(options=options)

    # Selenium 탐지 우회
    driver.execute_cdp_cmd(
        "Page.addScriptToEvaluateOnNewDocument",
        {
            "source": """
                Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            """
        },
    )
    return driver


def wait_for_element(driver, by, value, timeout=WAIT_TIMEOUT):
    """요소가 나타날 때까지 대기"""
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((by, value))
    )


def wait_for_clickable(driver, by, value, timeout=WAIT_TIMEOUT):
    """클릭 가능한 요소 대기"""
    return WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((by, value))
    )


def safe_click(driver, element):
    """안전한 클릭 (JavaScript fallback)"""
    try:
        element.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", element)


def get_category_urls(driver):
    """drill-zone 페이지에서 카테고리별 URL 수집"""
    driver.get(DRILL_ZONE_URL)
    time.sleep(PAGE_LOAD_DELAY)

    categories = {}
    links = driver.find_elements(By.TAG_NAME, "a")
    for link in links:
        href = link.get_attribute("href") or ""
        for cat_id in CATEGORIES:
            if cat_id in href and "drill-zone" in href:
                categories[cat_id] = href
                print(f"  발견: {cat_id} → {href}")
                break

    return categories


def extract_question_from_page(driver, category_id, q_num):
    """현재 페이지에서 문제 데이터 추출"""
    time.sleep(BETWEEN_QUESTIONS_DELAY)
    question_data = {
        "categoryId": category_id,
        "number": q_num,
        "question": "",
        "options": [],
        "answer": -1,
        "explanation": "",
    }

    # ── 1) 문제 텍스트 추출 ──
    # 여러 셀렉터 시도 (사이트 구조에 따라 조정)
    question_selectors = [
        "h1",
        "h2",
        "[class*='question']",
        "[class*='Question']",
        ".text-lg.font-semibold",
        "[data-testid*='question']",
    ]

    for sel in question_selectors:
        try:
            elements = driver.find_elements(By.CSS_SELECTOR, sel)
            for el in elements:
                text = el.text.strip()
                # 문제 번호가 포함된 텍스트 또는 물음표로 끝나는 긴 텍스트
                if text and (len(text) > 20 or "?" in text or "는?" in text or "것은?" in text):
                    question_data["question"] = text
                    break
            if question_data["question"]:
                break
        except Exception:
            continue

    if not question_data["question"]:
        # 페이지 전체 텍스트에서 문제 찾기 시도
        print(f"    ⚠ 문제 텍스트를 찾지 못했습니다 (Q{q_num})")
        # 디버깅용 스크린샷
        screenshot_path = OUTPUT_DIR / f"debug_q{q_num}_{category_id}.png"
        driver.save_screenshot(str(screenshot_path))
        print(f"    스크린샷 저장: {screenshot_path}")
        return None

    # ── 2) 선택지 추출 ──
    option_selectors = [
        "label",
        "[class*='option']",
        "[class*='choice']",
        "[class*='answer']",
        "[role='radio']",
        "li",
    ]

    for sel in option_selectors:
        try:
            elements = driver.find_elements(By.CSS_SELECTOR, sel)
            options_text = []
            for el in elements:
                text = el.text.strip()
                # A, B, C, D 또는 1, 2, 3, 4로 시작하는 선택지
                if text and len(text) > 1:
                    # 선택지 접두사 제거 (A. B. C. D. 또는 1) 2) 등)
                    cleaned = text
                    for prefix in ["A.", "B.", "C.", "D.", "A)", "B)", "C)", "D)",
                                   "1.", "2.", "3.", "4.", "1)", "2)", "3)", "4)",
                                   "A ", "B ", "C ", "D "]:
                        if cleaned.startswith(prefix):
                            cleaned = cleaned[len(prefix):].strip()
                            break
                    if cleaned:
                        options_text.append(cleaned)

            # 보통 4개 선택지
            if len(options_text) >= 2:
                question_data["options"] = options_text[:6]  # 최대 6개
                break
        except Exception:
            continue

    if not question_data["options"]:
        print(f"    ⚠ 선택지를 찾지 못했습니다 (Q{q_num})")
        screenshot_path = OUTPUT_DIR / f"debug_options_q{q_num}_{category_id}.png"
        driver.save_screenshot(str(screenshot_path))
        return None

    # ── 3) 정답 선택 및 제출 ──
    # 각 옵션을 클릭하여 정답 제출
    try:
        # 첫 번째 옵션 클릭 (정답을 모르므로 아무거나 선택)
        option_elements = driver.find_elements(By.CSS_SELECTOR, "label, [role='radio'], [class*='option']")
        clickable_options = [el for el in option_elements if el.text.strip() and len(el.text.strip()) > 1]

        if clickable_options:
            safe_click(driver, clickable_options[0])
            time.sleep(0.5)

        # "정답 제출" 또는 "Submit" 버튼 클릭
        submit_selectors = [
            "//button[contains(text(), '정답')]",
            "//button[contains(text(), '제출')]",
            "//button[contains(text(), 'Submit')]",
            "//button[contains(text(), 'Check')]",
            "//button[contains(text(), '확인')]",
        ]

        submitted = False
        for sel in submit_selectors:
            try:
                btn = driver.find_element(By.XPATH, sel)
                if btn.is_displayed() and btn.is_enabled():
                    safe_click(driver, btn)
                    submitted = True
                    time.sleep(1.5)
                    break
            except NoSuchElementException:
                continue

        if not submitted:
            # 일반 button 요소에서 찾기
            buttons = driver.find_elements(By.TAG_NAME, "button")
            for btn in buttons:
                btn_text = btn.text.strip()
                if any(kw in btn_text for kw in ["정답", "제출", "Submit", "Check"]):
                    safe_click(driver, btn)
                    submitted = True
                    time.sleep(1.5)
                    break

    except Exception as e:
        print(f"    ⚠ 정답 제출 실패: {e}")

    # ── 4) 정답 및 해설 추출 ──
    time.sleep(1)

    # 정답 추출 - 다양한 패턴
    try:
        page_text = driver.find_element(By.TAG_NAME, "body").text

        # "정답: A" 또는 "정답: 1" 패턴
        import re
        answer_patterns = [
            r"정답[:\s]*([A-D])",
            r"정답[:\s]*(\d)",
            r"Answer[:\s]*([A-D])",
            r"Correct[:\s]*([A-D])",
        ]

        for pattern in answer_patterns:
            match = re.search(pattern, page_text)
            if match:
                ans = match.group(1)
                if ans in "ABCD":
                    question_data["answer"] = ord(ans) - ord("A")
                elif ans.isdigit():
                    question_data["answer"] = int(ans) - 1
                break

        # 정답 표시된 옵션 찾기 (색상, 클래스 등으로 구분)
        if question_data["answer"] == -1:
            correct_selectors = [
                "[class*='correct']",
                "[class*='Correct']",
                "[class*='right']",
                "[class*='success']",
                "[data-correct='true']",
                ".text-green",
                "[class*='green']",
                "[aria-checked='true'][class*='correct']",
            ]
            for sel in correct_selectors:
                try:
                    correct_el = driver.find_element(By.CSS_SELECTOR, sel)
                    correct_text = correct_el.text.strip()
                    for i, opt in enumerate(question_data["options"]):
                        if opt in correct_text or correct_text in opt:
                            question_data["answer"] = i
                            break
                    if question_data["answer"] != -1:
                        break
                except NoSuchElementException:
                    continue

    except Exception as e:
        print(f"    ⚠ 정답 추출 실패: {e}")

    # 해설 추출
    explanation_selectors = [
        "[class*='explanation']",
        "[class*='Explanation']",
        "[class*='解説']",
        "[class*='해설']",
        "[class*='rationale']",
        "[class*='feedback']",
        "[class*='solution']",
        "details",
        "[class*='prose']",
    ]

    for sel in explanation_selectors:
        try:
            el = driver.find_element(By.CSS_SELECTOR, sel)
            text = el.text.strip()
            if text and len(text) > 10:
                question_data["explanation"] = text
                break
        except NoSuchElementException:
            continue

    # 해설을 못 찾은 경우 페이지 텍스트에서 추출 시도
    if not question_data["explanation"]:
        try:
            # 정답 제출 후 나타나는 영역의 텍스트
            divs = driver.find_elements(By.TAG_NAME, "div")
            for div in divs:
                try:
                    classes = div.get_attribute("class") or ""
                    text = div.text.strip()
                    if (("해설" in text or "설명" in text or "Explanation" in text)
                            and len(text) > 20):
                        question_data["explanation"] = text
                        break
                except StaleElementReferenceException:
                    continue
        except Exception:
            pass

    return question_data


def go_to_next_question(driver):
    """다음 문제로 이동"""
    next_selectors = [
        "//button[contains(text(), '다음')]",
        "//button[contains(text(), 'Next')]",
        "//a[contains(text(), '다음')]",
        "//button[contains(text(), '→')]",
        "//button[contains(@class, 'next')]",
    ]

    for sel in next_selectors:
        try:
            btn = driver.find_element(By.XPATH, sel)
            if btn.is_displayed() and btn.is_enabled():
                safe_click(driver, btn)
                time.sleep(PAGE_LOAD_DELAY)
                return True
        except NoSuchElementException:
            continue

    # 일반 button에서 찾기
    buttons = driver.find_elements(By.TAG_NAME, "button")
    for btn in buttons:
        btn_text = btn.text.strip()
        if any(kw in btn_text for kw in ["다음", "Next", "→"]):
            safe_click(driver, btn)
            time.sleep(PAGE_LOAD_DELAY)
            return True

    return False


def crawl_category(driver, category_id, category_url, max_questions=100):
    """하나의 카테고리에서 모든 문제 추출"""
    print(f"\n{'='*60}")
    print(f"카테고리: {category_id}")
    print(f"URL: {category_url}")
    print(f"{'='*60}")

    driver.get(category_url)
    time.sleep(PAGE_LOAD_DELAY + 1)

    # "시작" 또는 "Start" 버튼이 있으면 클릭
    start_selectors = [
        "//button[contains(text(), '시작')]",
        "//button[contains(text(), 'Start')]",
        "//button[contains(text(), '풀기')]",
        "//a[contains(text(), '시작')]",
        "//a[contains(text(), 'Start')]",
    ]

    for sel in start_selectors:
        try:
            btn = driver.find_element(By.XPATH, sel)
            if btn.is_displayed():
                safe_click(driver, btn)
                time.sleep(PAGE_LOAD_DELAY)
                break
        except NoSuchElementException:
            continue

    questions = []
    prev_question_text = ""
    stuck_count = 0

    for q_num in range(1, max_questions + 1):
        print(f"  [{q_num}] 문제 추출 중...", end=" ")

        try:
            q_data = extract_question_from_page(driver, category_id, q_num)

            if q_data is None:
                print("✗ 추출 실패")
                stuck_count += 1
                if stuck_count >= 3:
                    print("  → 3회 연속 실패, 카테고리 종료")
                    break
                # 다음 문제로 시도
                if not go_to_next_question(driver):
                    print("  → '다음' 버튼 없음, 카테고리 종료")
                    break
                continue

            # 같은 문제가 반복되면 종료
            if q_data["question"] == prev_question_text:
                stuck_count += 1
                if stuck_count >= 2:
                    print("같은 문제 반복, 카테고리 종료")
                    break
            else:
                stuck_count = 0

            prev_question_text = q_data["question"]
            questions.append(q_data)

            answer_str = (
                chr(65 + q_data["answer"]) if q_data["answer"] >= 0 else "?"
            )
            print(
                f"✓ 정답:{answer_str} | "
                f"선택지:{len(q_data['options'])}개 | "
                f"해설:{'O' if q_data['explanation'] else 'X'} | "
                f"{q_data['question'][:40]}..."
            )

            # 다음 문제로 이동
            if not go_to_next_question(driver):
                print(f"  → 총 {len(questions)}문제 추출 완료 (마지막 문제)")
                break

        except Exception as e:
            print(f"✗ 에러: {e}")
            traceback.print_exc()
            stuck_count += 1
            if stuck_count >= 3:
                break
            try:
                go_to_next_question(driver)
            except Exception:
                break

    return questions


def save_results(all_questions, category_questions):
    """결과를 파일로 저장"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 전체 JSON 저장
    json_path = OUTPUT_DIR / "questions_all.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)
    print(f"\n전체 JSON 저장: {json_path} ({len(all_questions)}문제)")

    # 전체 TSV 저장
    tsv_path = OUTPUT_DIR / "questions_all.tsv"
    with open(tsv_path, "w", encoding="utf-8") as f:
        f.write("카테고리\t번호\t문제\t선택지A\t선택지B\t선택지C\t선택지D\t정답\t해설\n")
        for q in all_questions:
            opts = q["options"]
            while len(opts) < 4:
                opts.append("")
            answer_letter = chr(65 + q["answer"]) if q["answer"] >= 0 else "?"
            f.write(
                f"{q['categoryId']}\t{q['number']}\t{q['question']}\t"
                f"{opts[0]}\t{opts[1]}\t{opts[2]}\t{opts[3]}\t"
                f"{answer_letter}\t{q['explanation']}\n"
            )
    print(f"전체 TSV 저장: {tsv_path}")

    # 카테고리별 JSON 저장
    for cat_id, questions in category_questions.items():
        cat_path = OUTPUT_DIR / f"{cat_id}.json"
        with open(cat_path, "w", encoding="utf-8") as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)
        print(f"카테고리 JSON 저장: {cat_path} ({len(questions)}문제)")


def generate_typescript(category_questions):
    """TypeScript 데이터 파일 생성"""
    ts_dir = OUTPUT_DIR / "ts"
    ts_dir.mkdir(parents=True, exist_ok=True)

    for cat_id, questions in category_questions.items():
        # 카테고리 ID를 camelCase 변수명으로 변환
        var_name = cat_id.replace("-", "").title().replace(" ", "")
        var_name = var_name[0].lower() + var_name[1:] + "Questions"

        lines = [
            "import type { PracticeQuestion } from '../quizData'",
            "",
            f"export const {var_name}: PracticeQuestion[] = [",
        ]

        for q in questions:
            opts_str = ", ".join(f"'{opt}'" for opt in q["options"])
            answer = q["answer"] if q["answer"] >= 0 else 0
            explanation = q["explanation"].replace("'", "\\'").replace("\n", " ")
            question_text = q["question"].replace("'", "\\'").replace("\n", " ")

            lines.append(
                f"  {{ categoryId: '{cat_id}', "
                f"question: '{question_text}', "
                f"options: [{opts_str}], "
                f"answer: {answer}, "
                f"explanation: '{explanation}' }},"
            )

        lines.append("]")
        lines.append("")

        # 파일명: aifC01.ts, clfC02.ts 등
        filename = cat_id.replace("-", "")
        # aif-c01 → aifC01
        parts = cat_id.split("-")
        filename = parts[0] + parts[1][0].upper() + parts[1][1:]

        ts_path = ts_dir / f"{filename}.ts"
        with open(ts_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        print(f"TypeScript 저장: {ts_path} ({len(questions)}문제)")


def main():
    """메인 실행"""
    print("=" * 60)
    print("certi.nxtcloud.kr 문제 자동 추출기")
    print("=" * 60)

    # 특정 카테고리만 추출하려면 인자로 전달
    # python crawl_certi.py aif-c01 clf-c02
    target_categories = sys.argv[1:] if len(sys.argv) > 1 else CATEGORIES

    print(f"\n대상 카테고리: {', '.join(target_categories)}")
    print(f"출력 디렉토리: {OUTPUT_DIR}")

    # 브라우저 시작
    print("\n브라우저를 시작합니다...")
    driver = create_driver()

    try:
        # 로그인 페이지로 이동
        driver.get(BASE_URL)
        time.sleep(2)

        print("\n" + "=" * 60)
        print("※ 브라우저에서 로그인해주세요!")
        print("※ 로그인 완료 후 여기서 Enter를 눌러주세요.")
        print("=" * 60)
        input("\n>> Enter를 눌러 계속...")

        # drill-zone 페이지에서 카테고리 URL 수집
        print("\n카테고리 URL을 수집합니다...")
        category_urls = get_category_urls(driver)

        if not category_urls:
            print("\n카테고리 URL을 자동으로 찾지 못했습니다.")
            print("기본 URL 패턴을 사용합니다.")
            for cat_id in target_categories:
                category_urls[cat_id] = f"{DRILL_ZONE_URL}/{cat_id}"

        # 카테고리별 문제 추출
        all_questions = []
        category_questions = {}

        for cat_id in target_categories:
            if cat_id not in category_urls:
                print(f"\n⚠ {cat_id} URL을 찾지 못했습니다. 기본 URL 사용.")
                category_urls[cat_id] = f"{DRILL_ZONE_URL}/{cat_id}"

            questions = crawl_category(driver, cat_id, category_urls[cat_id])

            if questions:
                category_questions[cat_id] = questions
                all_questions.extend(questions)
                print(f"\n✓ {cat_id}: {len(questions)}문제 추출 완료")

                # 중간 저장 (크래시 대비)
                save_results(all_questions, category_questions)
            else:
                print(f"\n✗ {cat_id}: 문제를 추출하지 못했습니다")

            # 카테고리 간 잠시 대기
            time.sleep(2)

        # 최종 저장
        if all_questions:
            save_results(all_questions, category_questions)
            generate_typescript(category_questions)

            print("\n" + "=" * 60)
            print(f"총 {len(all_questions)}문제 추출 완료!")
            print(f"카테고리: {len(category_questions)}개")
            for cat_id, qs in category_questions.items():
                print(f"  - {cat_id}: {len(qs)}문제")
            print(f"\n결과: {OUTPUT_DIR}")
            print("=" * 60)
        else:
            print("\n추출된 문제가 없습니다.")
            print("사이트 구조가 변경되었을 수 있습니다.")
            print("debug_*.png 스크린샷을 확인해주세요.")

    except KeyboardInterrupt:
        print("\n\n사용자가 중단했습니다.")
        if all_questions:
            save_results(all_questions, category_questions)
            generate_typescript(category_questions)
            print(f"현재까지 {len(all_questions)}문제 저장됨")

    except Exception as e:
        print(f"\n에러 발생: {e}")
        traceback.print_exc()

    finally:
        print("\n브라우저를 닫으시겠습니까? (Enter=닫기, n=유지)")
        close = input(">> ").strip().lower()
        if close != "n":
            driver.quit()


if __name__ == "__main__":
    main()
