/**
 * certi.nxtcloud.kr 문제 자동 수집기 (브라우저 콘솔용)
 *
 * 사용법:
 *   1. certi.nxtcloud.kr에 로그인
 *   2. drill-zone에서 원하는 카테고리의 첫 번째 문제로 이동
 *   3. F12 → Console 탭 열기
 *   4. 이 스크립트 전체를 복사하여 콘솔에 붙여넣기 후 Enter
 *   5. 자동으로 문제를 수집하며 진행
 *   6. 완료 시 자동으로 JSON 파일 다운로드
 *
 * 중단: window.__STOP_COLLECTOR = true
 * 현재 수집 결과 확인: window.__COLLECTED_QUESTIONS
 * 수동 다운로드: window.__DOWNLOAD_RESULTS()
 */

(function() {
  'use strict';

  // ── 설정 ──
  const CONFIG = {
    categoryId: '', // 빈 값이면 URL에서 자동 추출
    delayBetweenSteps: 2000, // 각 단계 사이 대기 ms
    maxQuestions: 200,        // 최대 문제 수
  };

  // ── 전역 상태 ──
  window.__COLLECTED_QUESTIONS = window.__COLLECTED_QUESTIONS || [];
  window.__STOP_COLLECTOR = false;

  const questions = window.__COLLECTED_QUESTIONS;
  let questionNum = questions.length + 1;

  // URL에서 카테고리 추출
  function getCategoryId() {
    if (CONFIG.categoryId) return CONFIG.categoryId;
    const url = window.location.pathname;
    const match = url.match(/([a-z]{2,3}-c\d{2})/i);
    return match ? match[1].toLowerCase() : 'unknown';
  }

  // 대기 함수
  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // 텍스트 정리
  function clean(text) {
    return (text || '').trim().replace(/\s+/g, ' ');
  }

  // 문제 텍스트 추출
  function getQuestionText() {
    // h1 태그에서 찾기
    const h1s = document.querySelectorAll('h1');
    for (const h1 of h1s) {
      const text = clean(h1.textContent);
      if (text.length > 15) return text;
    }
    // h2 태그에서 찾기
    const h2s = document.querySelectorAll('h2');
    for (const h2 of h2s) {
      const text = clean(h2.textContent);
      if (text.length > 15 && (text.includes('?') || text.includes('는?') || text.includes('것은'))) {
        return text;
      }
    }
    // class에 question 포함
    const qEls = document.querySelectorAll('[class*="question"], [class*="Question"]');
    for (const el of qEls) {
      const text = clean(el.textContent);
      if (text.length > 15) return text;
    }
    return null;
  }

  // 선택지 추출
  function getOptions() {
    const options = [];

    // label 태그
    const labels = document.querySelectorAll('label');
    for (const label of labels) {
      const text = clean(label.textContent);
      if (text && text.length > 1) {
        // A. B. C. D. 접두사 제거
        let cleaned = text.replace(/^[A-D][.)]\s*/, '').replace(/^\d[.)]\s*/, '');
        if (cleaned) options.push(cleaned);
      }
    }
    if (options.length >= 2) return options;

    // radio input의 label
    const radios = document.querySelectorAll('input[type="radio"]');
    for (const radio of radios) {
      const label = document.querySelector(`label[for="${radio.id}"]`);
      if (label) {
        const text = clean(label.textContent);
        if (text) options.push(text);
      }
    }
    if (options.length >= 2) return options;

    // class에 option/choice 포함
    const optEls = document.querySelectorAll('[class*="option"], [class*="choice"], [role="radio"]');
    for (const el of optEls) {
      const text = clean(el.textContent);
      if (text && text.length > 1) {
        let cleaned = text.replace(/^[A-D][.)]\s*/, '');
        if (cleaned) options.push(cleaned);
      }
    }

    return options;
  }

  // 첫 번째 옵션 클릭 (정답 제출을 위해)
  function clickFirstOption() {
    const labels = document.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent.trim().length > 1) {
        label.click();
        return true;
      }
    }
    const radios = document.querySelectorAll('input[type="radio"]');
    if (radios.length > 0) {
      radios[0].click();
      return true;
    }
    return false;
  }

  // 정답 제출 버튼 클릭
  function clickSubmit() {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const text = btn.textContent.trim();
      if ((text.includes('정답') || text.includes('제출') || text.includes('Submit') || text.includes('Check'))
          && !btn.disabled) {
        btn.click();
        return true;
      }
    }
    return false;
  }

  // 정답 추출
  function getAnswer() {
    const bodyText = document.body.textContent;

    // "정답: A" 패턴
    const patterns = [/정답[:\s]*([A-D])/i, /Answer[:\s]*([A-D])/i, /Correct[:\s]*([A-D])/i];
    for (const pattern of patterns) {
      const match = bodyText.match(pattern);
      if (match) {
        return match[1].toUpperCase().charCodeAt(0) - 65; // A=0, B=1, ...
      }
    }

    // 정답 표시된 요소 (green, correct 클래스)
    const correctEls = document.querySelectorAll(
      '[class*="correct"], [class*="Correct"], [class*="green"], [class*="success"]'
    );
    for (const el of correctEls) {
      const text = clean(el.textContent);
      if (text.length > 1) {
        // A, B, C, D로 시작하면 해당 인덱스
        const m = text.match(/^([A-D])/);
        if (m) return m[1].charCodeAt(0) - 65;
      }
    }

    return -1;
  }

  // 해설 추출
  function getExplanation() {
    const selectors = [
      '[class*="explanation"]', '[class*="Explanation"]',
      '[class*="해설"]', '[class*="rationale"]',
      '[class*="feedback"]', '[class*="solution"]',
      '[class*="prose"]', 'details',
    ];

    for (const sel of selectors) {
      const els = document.querySelectorAll(sel);
      for (const el of els) {
        const text = clean(el.textContent);
        if (text.length > 10) return text;
      }
    }

    return '';
  }

  // 다음 문제 버튼 클릭
  function clickNext() {
    const buttons = document.querySelectorAll('button, a');
    for (const btn of buttons) {
      const text = btn.textContent.trim();
      if ((text.includes('다음') || text.includes('Next') || text === '→')
          && !btn.disabled) {
        btn.click();
        return true;
      }
    }
    return false;
  }

  // 결과 다운로드
  window.__DOWNLOAD_RESULTS = function() {
    const catId = getCategoryId();
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${catId}_questions.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log(`%c✓ ${questions.length}문제 다운로드 완료`, 'color: green; font-weight: bold');
  };

  // ── 메인 루프 ──
  async function collectAll() {
    const catId = getCategoryId();
    console.log(`%c문제 수집 시작: ${catId}`, 'color: blue; font-weight: bold; font-size: 14px');
    console.log(`중단하려면: window.__STOP_COLLECTOR = true`);
    console.log(`수동 다운로드: window.__DOWNLOAD_RESULTS()`);

    let prevQuestion = '';
    let stuckCount = 0;

    while (questionNum <= CONFIG.maxQuestions && !window.__STOP_COLLECTOR) {
      console.log(`\n── Q${questionNum} ──`);

      // 1) 문제 텍스트 추출
      await sleep(CONFIG.delayBetweenSteps);
      const questionText = getQuestionText();

      if (!questionText) {
        console.warn(`Q${questionNum}: 문제 텍스트를 찾지 못했습니다`);
        stuckCount++;
        if (stuckCount >= 3) {
          console.log('%c3회 연속 실패, 수집 종료', 'color: red');
          break;
        }
        if (!clickNext()) break;
        await sleep(CONFIG.delayBetweenSteps);
        continue;
      }

      // 같은 문제 반복 체크
      if (questionText === prevQuestion) {
        stuckCount++;
        if (stuckCount >= 2) {
          console.log('%c같은 문제 반복, 수집 종료', 'color: red');
          break;
        }
      } else {
        stuckCount = 0;
      }
      prevQuestion = questionText;

      // 2) 선택지 추출
      const options = getOptions();
      console.log(`  문제: ${questionText.substring(0, 50)}...`);
      console.log(`  선택지: ${options.length}개`);

      // 3) 아무 옵션 선택 → 정답 제출
      clickFirstOption();
      await sleep(500);
      clickSubmit();
      await sleep(CONFIG.delayBetweenSteps);

      // 4) 정답 & 해설 추출
      const answer = getAnswer();
      const explanation = getExplanation();

      const qData = {
        categoryId: catId,
        number: questionNum,
        question: questionText,
        options: options,
        answer: answer,
        explanation: explanation,
      };

      questions.push(qData);
      const ansLetter = answer >= 0 ? String.fromCharCode(65 + answer) : '?';
      console.log(`  %c✓ 정답: ${ansLetter} | 해설: ${explanation ? 'O' : 'X'}`, 'color: green');

      questionNum++;

      // 5) 다음 문제로 이동
      if (!clickNext()) {
        console.log('%c다음 버튼 없음, 수집 종료', 'color: orange');
        break;
      }
      await sleep(CONFIG.delayBetweenSteps);
    }

    // 완료
    console.log(`\n%c수집 완료: ${questions.length}문제`, 'color: blue; font-weight: bold; font-size: 16px');

    if (questions.length > 0) {
      window.__DOWNLOAD_RESULTS();
    }
  }

  // 실행
  collectAll();

})();
