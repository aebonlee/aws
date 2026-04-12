// ==UserScript==
// @name         AWS 드릴존 문제 추출기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  드릴존 문제/정답/해설 자동 추출 (한국어+영어)
// @match        *://www.certi.nxtcloud.kr/*
// @match        *://certi.nxtcloud.kr/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const TOTAL = 60;
  const KEY = '__quiz_scraper';
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ========== 상태 확인 ==========
  let state = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (!state || !state.running) return; // running이 아니면 아무것도 안 함

  if (state.done) return;

  // 페이지 로드 후 약간 대기
  setTimeout(() => runScraper(state), 2000);

  async function runScraper(state) {
    const idx = state.results.length;

    if (idx >= TOTAL) {
      state.done = true;
      state.running = false;
      localStorage.setItem(KEY, JSON.stringify(state));
      downloadResults(state.results);
      return;
    }

    // native alert/confirm 자동 처리
    const _alert = window.alert;
    const _confirm = window.confirm;
    window.alert = (msg) => console.log('[alert]', msg);
    window.confirm = (msg) => { console.log('[confirm]', msg); return true; };

    console.log(`%c [${idx + 1}/${TOTAL}] 추출 중...`, 'color:#ff9900; font-weight:bold; font-size:14px;');
    document.title = `[${idx + 1}/${TOTAL}] 추출 중...`;

    try {
      // 1) 문제/선지 추출
      const qa = extractQA(idx);

      // 2) 옵션 A → 정답 제출
      clickOption(0);
      await sleep(500);
      clickSubmit();
      await sleep(2000);

      // 3) 정답/해설 추출
      const answer = extractAnswer();
      const explanation = extractExplanation();

      // 4) 팝업 닫기
      dismissPopup();
      await sleep(300);
      dismissPopup();
      await sleep(300);

      // 5) 영어 전환
      console.log(`  영어 전환 중...`);
      const en = await extractInEnglish();

      let finalAnswer = answer;
      if (finalAnswer === -1 && en.answerEn !== undefined && en.answerEn !== -1) {
        finalAnswer = en.answerEn;
      }

      const item = {
        number: qa.number || (idx + 1),
        question: qa.question,
        questionEn: en.questionEn || '',
        options: qa.options,
        optionsEn: en.optionsEn || [],
        answer: finalAnswer,
        explanation,
        explanationEn: en.explanationEn || '',
      };

      // 중복 체크
      const lastQ = state.results.length > 0 ? state.results[state.results.length - 1].question : '';
      if (item.question && item.question === lastQ) {
        console.warn('%c ⚠ 이전 문제와 동일! 중단합니다.', 'color:red; font-size:14px;');
        state.running = false;
        localStorage.setItem(KEY, JSON.stringify(state));
        window.alert = _alert;
        window.confirm = _confirm;
        return;
      }

      // 저장
      state.results.push(item);
      localStorage.setItem(KEY, JSON.stringify(state));

      const ansStr = Array.isArray(item.answer)
        ? item.answer.map(a => String.fromCharCode(65 + a)).join(',')
        : item.answer >= 0 ? String.fromCharCode(65 + item.answer) : '?';

      console.log(
        `%c ✓ [${idx + 1}/${TOTAL}] Q${item.number} 정답:${ansStr} 해설:${explanation ? 'O' : 'X'} EN:${en.explanationEn ? 'O' : 'X'}`,
        item.answer === -1 ? 'color:red; font-size:13px;' : 'color:#10b981; font-size:13px;'
      );

      // 완료 체크
      if (state.results.length >= TOTAL) {
        state.done = true;
        state.running = false;
        localStorage.setItem(KEY, JSON.stringify(state));
        console.log('%c 60문제 완료!', 'font-size:16px; color:#10b981;');
        downloadResults(state.results);
        window.alert = _alert;
        window.confirm = _confirm;
        return;
      }

      // 다음 문제로 이동
      document.title = `[${idx + 1}/${TOTAL}] ✓ → 다음`;
      window.alert = _alert;
      window.confirm = _confirm;
      await sleep(500);
      goNext();
      // 페이지 전환 → Tampermonkey가 자동으로 다시 실행

    } catch (err) {
      console.error(`Q${idx + 1} 실패:`, err.message);
      state.results.push({ number: idx + 1, error: err.message });
      localStorage.setItem(KEY, JSON.stringify(state));
      window.alert = _alert;
      window.confirm = _confirm;
      await sleep(500);
      goNext();
    }
  }

  // ========== 유틸 함수들 ==========

  function findBtn(text, scope) {
    scope = scope || document;
    const els = [...scope.querySelectorAll('button, a, [role="button"], span, div')];
    return els.find(el => el.offsetParent !== null && el.textContent.trim() === text)
      || els.find(el => el.offsetParent !== null && el.textContent.trim().includes(text) && el.textContent.trim().length < text.length + 15);
  }

  function clickOption(optIdx) {
    const letter = String.fromCharCode(65 + optIdx);
    const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    if (inputs.length > optIdx) {
      inputs[optIdx].checked = true;
      inputs[optIdx].click();
      inputs[optIdx].dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    const labels = [...document.querySelectorAll('label')].filter(el => el.offsetParent !== null);
    if (labels.length > optIdx) { labels[optIdx].click(); return true; }
    const els = [...document.querySelectorAll('button, label, li, div, span, p')];
    const optEl = els.find(el => el.offsetParent !== null && new RegExp(`^${letter}\\.\\s`).test(el.textContent.trim()) && el.textContent.trim().length < 300);
    if (optEl) { optEl.click(); return true; }
    const allOpts = document.querySelectorAll('[class*="option"], [class*="choice"], [class*="answer"]');
    if (allOpts.length > optIdx) { allOpts[optIdx].click(); return true; }
    return false;
  }

  function clickSubmit() {
    const btn = findBtn('정답 제출') || findBtn('제출') || findBtn('Submit') || findBtn('Check');
    if (btn) { btn.click(); return true; }
    return false;
  }

  function findPopup() {
    for (const sel of ['[role="dialog"]', '[role="alertdialog"]', '[class*="modal"]', '[class*="Modal"]', '[class*="popup"]', '[class*="Popup"]', '[class*="dialog"]', '[class*="Dialog"]']) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null && el.textContent.trim().length > 5) return el;
    }
    for (const el of document.querySelectorAll('div, section')) {
      const s = getComputedStyle(el);
      if ((s.position === 'fixed' || s.position === 'absolute') && parseInt(s.zIndex) > 100 && el.offsetWidth > 200 && el.offsetHeight > 100) return el;
    }
    return null;
  }

  function dismissPopup() {
    const popup = findPopup();
    if (!popup) return;
    const btn = findBtn('확인', popup) || findBtn('닫기', popup) || findBtn('OK', popup);
    if (btn) { btn.click(); return; }
    const btn2 = findBtn('확인') || findBtn('닫기') || findBtn('OK');
    if (btn2) btn2.click();
  }

  function extractAnswerFrom(text) {
    const m = text.match(/정답\s*[:：]\s*([A-E](?:\s*[,、]\s*[A-E])*)/);
    if (m) {
      const letters = m[1].split(/\s*[,、]\s*/);
      return letters.length === 1 ? letters[0].charCodeAt(0) - 65 : letters.map(l => l.charCodeAt(0) - 65);
    }
    const mEn = text.match(/(?:Answer|Correct)\s*[:：]\s*([A-E](?:\s*[,、]\s*[A-E])*)/i);
    if (mEn) {
      const letters = mEn[1].split(/\s*[,、]\s*/);
      return letters.length === 1 ? letters[0].charCodeAt(0) - 65 : letters.map(l => l.charCodeAt(0) - 65);
    }
    return -1;
  }

  function extractAnswer() {
    const popup = findPopup();
    if (popup) { const a = extractAnswerFrom(popup.innerText); if (a !== -1) return a; }
    return extractAnswerFrom(document.body.innerText);
  }

  function extractExplanationFrom(text) {
    const i = text.indexOf('정답:') !== -1 ? text.indexOf('정답:') : text.indexOf('정답：');
    if (i === -1) return '';
    let r = text.substring(i);
    [/\n이전\n/g, /\n다음\n/g, /\n종료\n/g, /\n홈\n/g, /\n드릴 존\n/g, /\n과제\n/g, /\n마이\n/g, /\n정답 제출\n/g, /\n확인\s*$/, /(?:이전)?(?:다음|종료)?홈드릴\s*존과제마이\s*$/].forEach(p => { r = r.replace(p, '\n'); });
    r = r.replace(/^(정답\s*[:：]\s*[A-E](?:\s*[,、]\s*[A-E])*)/, '$1\n\n');
    r = r.replace(/오답 분석/g, '\n\n오답 분석\n');
    r = r.replace(/([A-E]: )/g, '\n$1');
    r = r.replace(/\n{3,}/g, '\n\n').trim();
    return r;
  }

  function extractExplanation() {
    const popup = findPopup();
    if (popup) { const e = extractExplanationFrom(popup.innerText); if (e) return e; }
    return extractExplanationFrom(document.body.innerText);
  }

  function extractQA(idx) {
    const body = document.body.innerText;
    const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
    const numMatch = body.match(/(\d+)\s*\/\s*(\d+)/);
    const number = numMatch ? parseInt(numMatch[1]) : idx + 1;
    let startIdx = lines.findIndex(l => /\d+\s*\/\s*\d+/.test(l));
    const langIdx = lines.findIndex((l, i) => i > startIdx && /^(English|한국어)$/.test(l));
    if (langIdx !== -1) startIdx = langIdx;
    const optAIdx = lines.findIndex((l, i) => i > startIdx && /^A\.\s/.test(l));
    let question = '', options = [];
    if (startIdx !== -1 && optAIdx !== -1) {
      question = lines.slice(startIdx + 1, optAIdx).join(' ').trim();
      let endIdx = lines.findIndex((l, i) => i > optAIdx && /^(정답|이전|다음|정답 제출|홈|드릴)/.test(l));
      if (endIdx === -1) endIdx = lines.length;
      options = lines.slice(optAIdx, endIdx).filter(l => /^[A-E]\.\s/.test(l)).map(l => l.replace(/^[A-E]\.\s*/, '').trim());
    }
    return { number, question, options };
  }

  async function extractInEnglish() {
    const engBtn = findBtn('English');
    if (!engBtn) return {};
    engBtn.click();
    await sleep(1000);
    const qa = extractQA(0);
    clickOption(0);
    await sleep(300);
    clickSubmit();
    await sleep(1500);
    const answer = extractAnswer();
    const explanation = extractExplanation();
    dismissPopup();
    await sleep(300);
    dismissPopup();
    await sleep(200);
    const korBtn = findBtn('한국어') || findBtn('Korean');
    if (korBtn) { korBtn.click(); await sleep(500); }
    return { questionEn: qa.question, optionsEn: qa.options, answerEn: answer, explanationEn: explanation };
  }

  function goNext() {
    let btn = findBtn('다음') || findBtn('Next');
    if (btn) { btn.click(); return true; }
    for (const sel of ['[class*="next"]', '[class*="Next"]', '[aria-label="다음"]']) {
      btn = document.querySelector(sel);
      if (btn && btn.offsetParent !== null) { btn.click(); return true; }
    }
    const all = [...document.querySelectorAll('button, a')];
    const next = all.find(el => el.offsetParent !== null && (el.textContent.trim().includes('다음') || el.textContent.trim() === '→'));
    if (next) { next.click(); return true; }
    return false;
  }

  function downloadResults(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `quiz-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.__quizData = data;
    console.log(`%c JSON 다운로드! ${data.length}문제, 고유: ${new Set(data.map(r => r.question)).size}`, 'color:#10b981; font-size:14px;');
  }
})();
