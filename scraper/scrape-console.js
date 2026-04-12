/**
 * AWS 드릴존 문제 추출기 v6 (전자동, 실제 마우스 이벤트)
 *
 * ★★★ 사용법 ★★★
 * 1. 아래 SET_NAME과 TOTAL을 수정
 * 2. 해당 시험의 첫 번째 문제 페이지 열기
 * 3. F12 → Console → 전체 붙여넣기 → Enter
 *
 * ★★★ 세트 목록 (SET_NAME / TOTAL 수정) ★★★
 *  SET_NAME                    카테고리                                 TOTAL
 *  'ai-ml-fundamentals'        Fundamentals of AI & ML                  58
 *  'ml-development'            ML Development                           48
 *  'sagemaker'                 Amazon SageMaker                         42
 *  'genai-fundamentals'        Fundamentals of Generative AI            55
 *  'fm-utilization'            FM Utilization                           82
 *  'fm-evaluation'             FM Evaluation and Improvement            62
 *  'responsible-ai'            Guidelines for Responsible AI            32
 *  'security-governance'       Security, Compliance and Governance      45
 */

(async () => {
  // ============ 여기만 수정 ============
  const SET_NAME = 'genai-fundamentals';
  const TOTAL = 55;
  // =====================================

  const results = [];
  const KEY = `__quiz_${SET_NAME}`; // localStorage 백업 키
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // alert/confirm 자동 처리
  const _alert = window.alert;
  const _confirm = window.confirm;
  window.alert = msg => console.log('[alert]', msg);
  window.confirm = msg => { console.log('[confirm]', msg); return true; };

  // ========== 실제 마우스 클릭 시뮬레이션 ==========
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

    // React 내부 핸들러 트리거 시도
    const reactKey = Object.keys(el).find(k => k.startsWith('__reactInternalInstance') || k.startsWith('__reactFiber'));
    if (reactKey) {
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: el });
      el.dispatchEvent(event);
    }

    return true;
  }

  // ========== 버튼 찾기 ==========
  function findButton(text) {
    // button 태그 우선
    for (const el of document.querySelectorAll('button')) {
      if (el.offsetParent !== null && el.textContent.trim() === text) return el;
    }
    for (const el of document.querySelectorAll('button')) {
      if (el.offsetParent !== null && el.textContent.trim().includes(text) && el.textContent.trim().length < text.length + 10) return el;
    }
    // a 태그
    for (const el of document.querySelectorAll('a')) {
      if (el.offsetParent !== null && el.textContent.trim() === text) return el;
    }
    // 기타
    for (const el of document.querySelectorAll('[role="button"], span, div')) {
      if (el.offsetParent !== null && el.textContent.trim() === text) return el;
    }
    return null;
  }

  // ========== 옵션 클릭 (다양한 방법) ==========
  function clickOption(optIdx) {
    const letter = String.fromCharCode(65 + optIdx);

    // 방법 1: "A. " 텍스트를 가진 가장 작은(leaf) 요소 클릭
    const all = [...document.querySelectorAll('*')].filter(el => {
      if (!el.offsetParent) return false;
      const t = el.textContent.trim();
      if (!new RegExp(`^${letter}\\.\\s`).test(t)) return false;
      if (t.length > 500) return false;
      return true;
    });
    // children이 적은(leaf에 가까운) 요소 우선
    all.sort((a, b) => a.children.length - b.children.length);
    if (all.length > 0) {
      realClick(all[0]);
      // 부모도 시도 (이벤트 위임 패턴)
      if (all[0].parentElement && all[0].parentElement !== document.body) {
        realClick(all[0].parentElement);
      }
      console.log(`    옵션 ${letter} 클릭 (텍스트): <${all[0].tagName}>`);
      return true;
    }

    // 방법 2: input radio/checkbox
    const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    if (inputs.length > optIdx) {
      inputs[optIdx].checked = true;
      realClick(inputs[optIdx]);
      inputs[optIdx].dispatchEvent(new Event('change', { bubbles: true }));
      inputs[optIdx].dispatchEvent(new Event('input', { bubbles: true }));
      // label도 클릭
      const label = inputs[optIdx].closest('label') || document.querySelector(`label[for="${inputs[optIdx].id}"]`);
      if (label) realClick(label);
      console.log(`    옵션 ${letter} 클릭 (input)`);
      return true;
    }

    // 방법 3: label 태그
    const labels = [...document.querySelectorAll('label')].filter(el => el.offsetParent !== null);
    if (labels.length > optIdx) {
      realClick(labels[optIdx]);
      console.log(`    옵션 ${letter} 클릭 (label)`);
      return true;
    }

    // 방법 4: class 기반
    const opts = document.querySelectorAll('[class*="option"], [class*="choice"], [class*="answer-item"], [class*="Option"]');
    if (opts.length > optIdx) {
      realClick(opts[optIdx]);
      console.log(`    옵션 ${letter} 클릭 (class)`);
      return true;
    }

    console.warn(`    옵션 ${letter} 클릭 실패!`);
    return false;
  }

  // ========== 정답 제출 감지 (해설이 나타났는지) ==========
  function isExplanationVisible() {
    const body = document.body.innerText;
    return /정답\s*[:：]\s*[A-E]/.test(body) || /(?:Answer|Correct)\s*[:：]\s*[A-E]/i.test(body);
  }

  // ========== 팝업 ==========
  function findPopup() {
    for (const sel of ['[role="dialog"]', '[role="alertdialog"]', '[class*="modal"]', '[class*="Modal"]', '[class*="popup"]', '[class*="Popup"]', '[class*="dialog"]', '[class*="Dialog"]']) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null && el.textContent.trim().length > 5) return el;
    }
    for (const el of document.querySelectorAll('div')) {
      const s = getComputedStyle(el);
      if ((s.position === 'fixed' || s.position === 'absolute') && parseInt(s.zIndex) > 100 && el.offsetWidth > 200 && el.offsetHeight > 100) return el;
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

  // ========== 정답 추출 ==========
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

  // ========== 해설 추출 ==========
  function cleanExplanation(text) {
    const i = text.indexOf('정답:') !== -1 ? text.indexOf('정답:') : text.indexOf('정답：');
    if (i === -1) return '';
    let r = text.substring(i);
    [/\n이전\n/g, /\n다음\n/g, /\n종료\n/g, /\n홈\n/g, /\n드릴 존\n/g, /\n과제\n/g, /\n마이\n/g, /\n마이\s*$/g, /\n정답 제출\n/g, /\n확인\s*$/, /(?:이전)?(?:다음|종료)?홈드릴\s*존과제마이\s*$/, /이전\s*다음\s*종료\s*홈\s*드릴\s*존\s*과제\s*마이\s*$/, /이전\s*정답 제출\s*다음\s*홈\s*드릴 존\s*과제\s*마이\s*$/].forEach(p => { r = r.replace(p, '\n'); });
    r = r.replace(/^(정답\s*[:：]\s*[A-E](?:\s*[,、]\s*[A-E])*)/, '$1\n\n');
    r = r.replace(/오답 분석/g, '\n\n오답 분석\n');
    r = r.replace(/([A-E]: )/g, '\n$1');
    r = r.replace(/\n{3,}/g, '\n\n').trim();
    // 끝에 남은 네비 잔여물 제거
    r = r.replace(/\n*마이\s*$/, '').trim();
    return r;
  }

  function extractExplanation() {
    const p = findPopup();
    if (p) { const e = cleanExplanation(p.innerText); if (e) return e; }
    return cleanExplanation(document.body.innerText);
  }

  // ========== 문제/선지 추출 ==========
  function extractQA() {
    const body = document.body.innerText;
    const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
    const numMatch = body.match(/(\d+)\s*\/\s*(\d+)/);
    const number = numMatch ? parseInt(numMatch[1]) : results.length + 1;
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

  // ========== 문제 지문 핑거프린트 ==========
  function getFingerprint() {
    const lines = document.body.innerText.split('\n').map(l => l.trim()).filter(Boolean);
    const idx = lines.findIndex(l => /^A\.\s/.test(l));
    if (idx >= 2) return lines.slice(idx - 2, idx + 1).join('');
    return document.body.innerText.substring(0, 200);
  }

  // ========== 메인 루프 ==========
  console.log(`%c▶ [${SET_NAME}] 추출 시작: ${TOTAL}문제`, 'font-size:16px; color:#FF9900;');

  for (let i = 0; i < TOTAL; i++) {
    try {
      document.title = `[${i + 1}/${TOTAL}] 추출 중`;
      console.log(`%c━━━ [${i + 1}/${TOTAL}] ━━━`, 'color:#ff9900; font-weight:bold;');

      // === 1. 한국어 문제/선지 추출 ===
      const qa = extractQA();
      console.log(`  문제: ${qa.question.substring(0, 50)}...`);
      console.log(`  선지: ${qa.options.length}개`);

      // === 2. 옵션 A 클릭 ===
      clickOption(0);
      await sleep(800);

      // === 3. "정답 제출" 클릭 ===
      const submitBtn = findButton('정답 제출');
      if (submitBtn) {
        realClick(submitBtn);
        console.log('  정답 제출 클릭');
      } else {
        console.warn('  ⚠ "정답 제출" 버튼 없음!');
      }

      // 해설 나타날 때까지 대기 (최대 5초)
      let revealed = false;
      for (let w = 0; w < 10; w++) {
        await sleep(500);
        if (isExplanationVisible()) { revealed = true; break; }
      }

      if (!revealed) {
        console.warn('  ⚠ 해설 미표시 — 재시도: 옵션A → 제출');
        // 재시도: 다시 클릭
        clickOption(0);
        await sleep(500);
        const retryBtn = findButton('정답 제출');
        if (retryBtn) realClick(retryBtn);
        await sleep(2000);
        revealed = isExplanationVisible();
        if (!revealed) console.warn('  ✘ 재시도 실패');
      }

      // === 4. 정답 + 해설 추출 ===
      const answer = extractAnswer();
      const explanation = extractExplanation();
      console.log(`  정답: ${answer === -1 ? '✘' : answer}, 해설: ${explanation ? explanation.substring(0, 40) + '...' : '✘'}`);

      // 팝업 닫기
      dismissPopup(); await sleep(300); dismissPopup(); await sleep(300);

      // === 5. 영어 전환 → 추출 (재제출 안 함!) ===
      let questionEn = '', optionsEn = [], answerEn = -1, explanationEn = '';
      const engBtn = findButton('English');
      if (engBtn) {
        realClick(engBtn);
        await sleep(1500);

        const qaEn = extractQA();
        questionEn = qaEn.question;
        optionsEn = qaEn.options;
        answerEn = extractAnswer();
        explanationEn = extractExplanation();

        console.log(`  EN: ${questionEn ? questionEn.substring(0, 40) + '...' : '✘'}`);
        console.log(`  EN 정답: ${answerEn === -1 ? '✘' : answerEn}, EN 해설: ${explanationEn ? 'O' : '✘'}`);

        // 해설 안 보이면 영어에서도 제출 시도
        if (answerEn === -1 && !explanationEn) {
          console.log('  EN 해설 없음 → 영어에서 제출 시도');
          clickOption(0);
          await sleep(500);
          const enSubmit = findButton('Submit') || findButton('정답 제출') || findButton('Check');
          if (enSubmit) realClick(enSubmit);
          await sleep(2000);
          answerEn = extractAnswer();
          explanationEn = extractExplanation();
          dismissPopup(); await sleep(200);
          console.log(`  EN 재시도 → 정답: ${answerEn === -1 ? '✘' : answerEn}`);
        }

        dismissPopup(); await sleep(200);

        // 한국어 복귀
        const korBtn = findButton('한국어') || findButton('Korean');
        if (korBtn) { realClick(korBtn); await sleep(1000); }
      }

      // === 6. 결과 저장 ===
      let finalAnswer = answer;
      if (finalAnswer === -1 && answerEn !== -1) finalAnswer = answerEn;

      const item = {
        categoryId: SET_NAME,
        number: qa.number || (i + 1),
        question: qa.question,
        questionEn,
        options: qa.options,
        optionsEn,
        answer: finalAnswer,
        explanation,
        explanationEn,
      };

      results.push(item);
      localStorage.setItem(KEY, JSON.stringify(results));

      const ansStr = Array.isArray(item.answer)
        ? item.answer.map(a => String.fromCharCode(65 + a)).join(',')
        : item.answer >= 0 ? String.fromCharCode(65 + item.answer) : '?';

      console.log(
        `%c  ✓ Q${item.number} 정답:${ansStr} 해설:${explanation ? 'O' : 'X'} EN:${explanationEn ? 'O' : 'X'}`,
        item.answer === -1 ? 'color:red; font-size:13px;' : 'color:#10b981; font-size:13px;'
      );

      // === 7. "다음" 이동 ===
      if (i < TOTAL - 1) {
        const fp = getFingerprint();

        // button 태그 우선으로 "다음" 찾기
        const allBtns = [...document.querySelectorAll('button')].filter(el => el.offsetParent !== null);
        let nextBtn = allBtns.find(el => /^다음$|^다음 문제$|^Next$/.test(el.textContent.trim()));
        if (!nextBtn) nextBtn = allBtns.find(el => el.textContent.trim().includes('다음') && el.textContent.trim().length < 10);
        if (!nextBtn) nextBtn = findButton('다음') || findButton('Next');

        if (nextBtn) {
          realClick(nextBtn);
          console.log(`  → 다음 클릭: <${nextBtn.tagName}> "${nextBtn.textContent.trim()}"`);
        } else {
          console.error('  ✘ 다음 버튼 없음!');
          console.log('  모든 버튼:', allBtns.map(b => `"${b.textContent.trim().substring(0, 20)}"`).join(', '));
          break;
        }

        // 페이지 변경 대기
        let changed = false;
        for (let w = 0; w < 20; w++) {
          await sleep(500);
          if (getFingerprint() !== fp) { changed = true; break; }
        }
        if (changed) {
          console.log('  → 로딩 완료');
          await sleep(500);
        } else {
          console.warn('  → 변경 감지 실패. 계속...');
          await sleep(1000);
        }
      }

    } catch (err) {
      console.error(`Q${i + 1} 에러:`, err);
      results.push({ number: i + 1, error: err.message });
      dismissPopup(); await sleep(300);
      const nb = findButton('다음');
      if (nb) realClick(nb);
      await sleep(2000);
    }
  }

  // ========== 결과 ==========
  window.alert = _alert;
  window.confirm = _confirm;

  const ok = results.filter(r => r.answer !== -1 && !r.error);
  const unique = new Set(results.map(r => r.question)).size;

  document.title = `완료! ${ok.length}/${results.length}`;
  console.log(`%c▶ 완료!`, 'font-size:16px; color:#10b981;');
  console.table({
    '전체': results.length,
    '고유': unique,
    '정답OK': ok.length,
    '정답실패': results.length - ok.length,
    '해설(한)': results.filter(r => r.explanation).length,
    '해설(영)': results.filter(r => r.explanationEn).length,
  });

  if (results.length > 0) {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${SET_NAME}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.__quizData = results;
    console.log(`window.__quizData / localStorage.${KEY}`);
  }
})();
