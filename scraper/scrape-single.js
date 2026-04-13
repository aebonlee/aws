/**
 * AWS 드릴존 개별 문제 추출기 (1문제씩)
 *
 * ★★★ 사용법 ★★★
 * 1. 아래 SET_NAME, TARGET_Q 수정
 * 2. 해당 카테고리의 **첫 번째 문제** 페이지 열기
 * 3. F12 → Console → 전체 붙여넣기 → Enter
 * 4. 자동으로 TARGET_Q까지 이동 후 추출 & 다운로드
 *
 * ★★★ 누락 목록 ★★★
 *  SET_NAME                TARGET_Q
 *  'ai-ml-fundamentals'    41, 55
 *  'fm-utilization'        30
 *  'fm-evaluation'         15
 *  'responsible-ai'        28, 35
 *  'security-governance'   16, 19, 21, 27, 34
 */

(async () => {
  // ============ 여기만 수정 ============
  const SET_NAME = 'security-governance';
  const TARGET_Q = 21;
  // =====================================

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const _alert = window.alert;
  const _confirm = window.confirm;
  let requiredCount = 1; // 필요한 선택 수
  window.alert = msg => {
    console.log('[alert]', msg);
    const m = msg.match(/(\d+)개의 정답/);
    if (m) requiredCount = parseInt(m[1]);
  };
  window.confirm = msg => { console.log('[confirm]', msg); return true; };

  function realClick(el) {
    if (!el) return false;
    el.scrollIntoView({ block: 'center' });
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    el.dispatchEvent(new PointerEvent('pointerdown', opts));
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new PointerEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
    el.focus && el.focus();
    const reactKey = Object.keys(el).find(k => k.startsWith('__reactInternalInstance') || k.startsWith('__reactFiber'));
    if (reactKey) {
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: el });
      el.dispatchEvent(event);
    }
    return true;
  }

  function findButton(text) {
    for (const el of document.querySelectorAll('button')) {
      if (el.offsetParent !== null && el.textContent.trim() === text) return el;
    }
    for (const el of document.querySelectorAll('button')) {
      if (el.offsetParent !== null && el.textContent.trim().includes(text) && el.textContent.trim().length < text.length + 10) return el;
    }
    for (const el of document.querySelectorAll('a')) {
      if (el.offsetParent !== null && el.textContent.trim() === text) return el;
    }
    for (const el of document.querySelectorAll('[role="button"], span, div')) {
      if (el.offsetParent !== null && el.textContent.trim() === text) return el;
    }
    return null;
  }

  function clickOption(optIdx) {
    const letter = String.fromCharCode(65 + optIdx);
    const all = [...document.querySelectorAll('*')].filter(el => {
      if (!el.offsetParent) return false;
      const t = el.textContent.trim();
      if (!new RegExp(`^${letter}\\.\\s`).test(t)) return false;
      if (t.length > 500) return false;
      return true;
    });
    all.sort((a, b) => a.children.length - b.children.length);
    if (all.length > 0) {
      realClick(all[0]);
      if (all[0].parentElement && all[0].parentElement !== document.body) {
        realClick(all[0].parentElement);
      }
      return true;
    }
    const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    if (inputs.length > optIdx) {
      inputs[optIdx].checked = true;
      realClick(inputs[optIdx]);
      inputs[optIdx].dispatchEvent(new Event('change', { bubbles: true }));
      const label = inputs[optIdx].closest('label') || document.querySelector(`label[for="${inputs[optIdx].id}"]`);
      if (label) realClick(label);
      return true;
    }
    return false;
  }

  function isExplanationVisible() {
    const body = document.body.innerText;
    return /정답\s*[:：]\s*[A-E]/.test(body) || /(?:Answer|Correct)\s*[:：]\s*[A-E]/i.test(body);
  }

  function findPopup() {
    for (const sel of ['[role="dialog"]', '[role="alertdialog"]', '[class*="modal"]', '[class*="Modal"]', '[class*="popup"]', '[class*="Popup"]', '[class*="dialog"]', '[class*="Dialog"]']) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null && el.textContent.trim().length > 5) return el;
    }
    return null;
  }

  function dismissPopup() {
    const p = findPopup();
    if (!p) return false;
    const btn = findButton('확인') || findButton('닫기') || findButton('OK');
    if (btn) { realClick(btn); return true; }
    return false;
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
    const p = findPopup();
    if (p) { const a = extractAnswerFrom(p.innerText); if (a !== -1) return a; }
    return extractAnswerFrom(document.body.innerText);
  }

  function cleanExplanation(text) {
    const i = text.indexOf('정답:') !== -1 ? text.indexOf('정답:') : text.indexOf('정답：');
    if (i === -1) return '';
    let r = text.substring(i);
    [/\n이전\n/g, /\n다음\n/g, /\n종료\n/g, /\n홈\n/g, /\n드릴 존\n/g, /\n과제\n/g, /\n마이\n/g, /\n마이\s*$/g, /\n정답 제출\n/g, /\n확인\s*$/, /이전\s*다음\s*종료\s*홈\s*드릴\s*존\s*과제\s*마이\s*$/, /이전\s*정답 제출\s*다음\s*홈\s*드릴 존\s*과제\s*마이\s*$/].forEach(p => { r = r.replace(p, '\n'); });
    r = r.replace(/^(정답\s*[:：]\s*[A-E](?:\s*[,、]\s*[A-E])*)/, '$1\n\n');
    r = r.replace(/오답 분석/g, '\n\n오답 분석\n');
    r = r.replace(/([A-E]: )/g, '\n$1');
    r = r.replace(/\n{3,}/g, '\n\n').trim();
    r = r.replace(/\n*마이\s*$/, '').trim();
    return r;
  }

  function extractExplanation() {
    const p = findPopup();
    if (p) { const e = cleanExplanation(p.innerText); if (e) return e; }
    return cleanExplanation(document.body.innerText);
  }

  function extractQA() {
    const body = document.body.innerText;
    const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
    const numMatch = body.match(/(\d+)\s*\/\s*(\d+)/);
    const number = numMatch ? parseInt(numMatch[1]) : 0;
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

  function getFingerprint() {
    const lines = document.body.innerText.split('\n').map(l => l.trim()).filter(Boolean);
    const idx = lines.findIndex(l => /^A\.\s/.test(l));
    if (idx >= 2) return lines.slice(idx - 2, idx + 1).join('');
    return document.body.innerText.substring(0, 200);
  }

  // ========== 1단계: TARGET_Q까지 이동 ==========
  const currentMatch = document.body.innerText.match(/(\d+)\s*\/\s*(\d+)/);
  const currentQ = currentMatch ? parseInt(currentMatch[1]) : 1;
  const stepsNeeded = TARGET_Q - currentQ;

  console.log(`%c▶ [${SET_NAME}] Q${TARGET_Q} 추출 시작 (현재: Q${currentQ}, ${stepsNeeded}번 이동)`, 'font-size:16px; color:#FF9900;');

  if (stepsNeeded > 0) {
    for (let s = 0; s < stepsNeeded; s++) {
      document.title = `Q${TARGET_Q}로 이동 중... (${s + 1}/${stepsNeeded})`;
      const fp = getFingerprint();
      const nextBtn = findButton('다음') || findButton('Next');
      if (!nextBtn) { console.error('다음 버튼 없음!'); break; }
      realClick(nextBtn);
      // 페이지 변경 대기
      for (let w = 0; w < 20; w++) {
        await sleep(300);
        if (getFingerprint() !== fp) break;
      }
      await sleep(200);
      if ((s + 1) % 10 === 0) console.log(`  이동 ${s + 1}/${stepsNeeded}...`);
    }
    console.log(`%c→ Q${TARGET_Q} 도착`, 'color:#10b981;');
    await sleep(500);
  }

  // ========== 2단계: 추출 ==========
  const qa = extractQA();
  console.log(`  문제: ${qa.question.substring(0, 60)}...`);
  console.log(`  선지: ${qa.options.length}개`);

  // 먼저 필요한 선택 수 감지: 옵션 A만 클릭 후 제출 시도
  requiredCount = 1;
  clickOption(0);
  await sleep(500);
  const detectBtn = findButton('정답 제출');
  if (detectBtn) { realClick(detectBtn); await sleep(800); }

  // requiredCount가 갱신되었으면 다중 선택 문제
  if (requiredCount > 1) {
    console.log(`  다중 선택 문제 감지: ${requiredCount}개 필요`);
    // 필요한 만큼 옵션 클릭 (A, B, C...)
    for (let oi = 1; oi < requiredCount; oi++) {
      clickOption(oi);
      await sleep(300);
    }
    await sleep(300);
    const submitBtn2 = findButton('정답 제출');
    if (submitBtn2) { realClick(submitBtn2); console.log('  정답 제출 (다중)'); }
  } else {
    console.log('  정답 제출 클릭');
  }

  let revealed = false;
  for (let w = 0; w < 10; w++) {
    await sleep(500);
    if (isExplanationVisible()) { revealed = true; break; }
  }
  if (!revealed) {
    // 재시도: requiredCount만큼 옵션 클릭
    for (let oi = 0; oi < requiredCount; oi++) {
      clickOption(oi); await sleep(300);
    }
    const retry = findButton('정답 제출');
    if (retry) realClick(retry);
    await sleep(2000);
  }

  const answer = extractAnswer();
  const explanation = extractExplanation();
  dismissPopup(); await sleep(300); dismissPopup(); await sleep(300);

  // 영어 전환
  let questionEn = '', optionsEn = [], answerEn = -1, explanationEn = '';
  const engBtn = findButton('English');
  if (engBtn) {
    realClick(engBtn); await sleep(1500);
    const qaEn = extractQA();
    questionEn = qaEn.question;
    optionsEn = qaEn.options;
    answerEn = extractAnswer();
    explanationEn = extractExplanation();
    if (answerEn === -1 && !explanationEn) {
      for (let oi = 0; oi < requiredCount; oi++) {
        clickOption(oi); await sleep(300);
      }
      const enSubmit = findButton('Submit') || findButton('정답 제출');
      if (enSubmit) realClick(enSubmit);
      await sleep(2000);
      answerEn = extractAnswer();
      explanationEn = extractExplanation();
      dismissPopup(); await sleep(200);
    }
    dismissPopup(); await sleep(200);
    const korBtn = findButton('한국어') || findButton('Korean');
    if (korBtn) { realClick(korBtn); await sleep(500); }
  }

  let finalAnswer = answer;
  if (finalAnswer === -1 && answerEn !== -1) finalAnswer = answerEn;

  const item = {
    categoryId: SET_NAME,
    number: TARGET_Q,
    question: qa.question,
    questionEn,
    options: qa.options,
    optionsEn,
    answer: finalAnswer,
    explanation,
    explanationEn,
  };

  // ========== 결과 ==========
  window.alert = _alert;
  window.confirm = _confirm;

  const ansStr = Array.isArray(item.answer)
    ? item.answer.map(a => String.fromCharCode(65 + a)).join(',')
    : item.answer >= 0 ? String.fromCharCode(65 + item.answer) : '?';

  document.title = `Q${TARGET_Q} 완료! 정답:${ansStr}`;
  console.log(`%c✓ Q${TARGET_Q} 정답:${ansStr} 해설:${explanation ? 'O' : 'X'} EN:${explanationEn ? 'O' : 'X'}`,
    item.answer === -1 ? 'color:red; font-size:14px;' : 'color:#10b981; font-size:14px;');

  const blob = new Blob([JSON.stringify([item], null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${SET_NAME}-Q${TARGET_Q}.json`;
  a.click();

  window.__singleQ = item;
  console.log('window.__singleQ 에 저장됨');
})();
