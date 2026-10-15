(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const DATA_URL = './skill-score-photo-rows.csv?v=20261014-slowstart-closer';
  const roleEl = $('kboScoreRole');
  const cardTypeEl = $('kboScoreCardType');
  if (!roleEl || !cardTypeEl) return;

  let allRows = [];
  let activeRows = [];
  let loaded = false;
  let loadPromise = null;
  const distributionCache = new Map();

  function parseCSV(text) {
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim());
    if (!lines.length) return [];
    const parseLine = (line) => {
      const cells = [];
      let cell = '', quoted = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (quoted && line[i + 1] === '"') { cell += '"'; i++; }
          else quoted = !quoted;
        } else if (ch === ',' && !quoted) {
          cells.push(cell); cell = '';
        } else cell += ch;
      }
      cells.push(cell);
      return cells;
    };
    const header = parseLine(lines[0]).map(x => x.trim());
    return lines.slice(1).map((line, index) => {
      const values = parseLine(line);
      const raw = {};
      header.forEach((key, i) => raw[key] = (values[i] || '').trim());
      const points = {};
      for (let level = 5; level <= 10; level++) {
        const value = raw[`Lv${level}`];
        points[level] = value === '' || !Number.isFinite(Number(value)) ? null : Number(value);
      }
      return {
        id: index,
        target: raw['대상'],
        name: raw['스킬명'],
        points,
        family: familyKey(raw['스킬명'])
      };
    }).filter(row => row.target && row.name);
  }

  function familyKey(name) {
    return String(name || '').replace(/\([^)]*\)/g, '').replace(/[☆★]/g, '').replace(/\s+/g, '').toLocaleLowerCase('ko-KR');
  }

  function cardTypeMatch(name, type) {
    const flags = {
      impact: /임팩/i.test(name),
      signature: /시그/i.test(name),
      gold: /골글|골든글러브/i.test(name),
      national: /국대|국가대표/i.test(name)
    };
    const marked = Object.keys(flags).filter(key => flags[key]);
    if (!marked.length) return true;
    return marked.includes(type);
  }

  function roleMatch(name, role) {
    const lower = String(name || '');
    if (role === 'hitter') return true;
    if (role === 'starter') {
      return !/(불펜|중계|마무리|셋업|추격조|필승조)/.test(lower);
    }
    if (/(선발)/.test(lower)) return false;
    if (role === 'middle') {
      if (/(마무리)/.test(lower) && !/(셋업\/마무리|필승조\/마무리|불펜\/마무리)/.test(lower)) return false;
      if (/(셋업\/마무리|필승조\/마무리|불펜\/마무리)/.test(lower)) return true;
      return !/(마무리)/.test(lower) || /(불펜)/.test(lower);
    }
    if (role === 'closer') {
      if (/(중계)/.test(lower) && !/(셋업\/마무리)/.test(lower)) return false;
      if (/(추격조)/.test(lower)) return false;
      return true;
    }
    return true;
  }

  function getCandidates() {
    const role = roleEl.value;
    const type = cardTypeEl.value;
    const target = role === 'hitter' ? '타자' : '투수';
    return allRows.filter(row =>
      row.target === target &&
      roleMatch(row.name, role) &&
      cardTypeMatch(row.name, type)
    );
  }

  function formatScore(value) {
    if (!Number.isFinite(value)) return '—';
    return value.toFixed(2);
  }

  function gradeForRate(rate) {
    if (rate <= 0.001) return ['SR+', 'grade-srp'];
    if (rate <= 0.005) return ['SS', 'grade-ss'];
    if (rate <= 0.015) return ['S', 'grade-s'];
    if (rate <= 0.05) return ['A', 'grade-a'];
    if (rate <= 0.12) return ['B', 'grade-b'];
    return ['C', 'grade-c'];
  }

  // Fixed thresholds transcribed from the user-provided workbook's
  // "카드별 점수 컷" sheet. Values are reference cutoffs for the 고스변 assumptions.
  const EXCEL_SCORE_CUTOFFS = {
    hitter: {
      fielder: {
        signature: [51.36, 45.96, 41.36, 35.47, 30.82],
        gold:      [56.25, 49.96, 45.04, 38.72, 33.19],
        national:  [53.42, 47.74, 43.44, 37.54, 32.53],
        impact:    [35.10, 28.78, 24.96, 21.15, 15.32]
      },
      catcher: {
        signature: [51.10, 45.69, 41.13, 35.23, 30.62],
        gold:      [56.02, 49.68, 44.86, 38.38, 32.99],
        national:  [53.16, 47.59, 43.24, 37.29, 32.31],
        impact:    [34.86, 28.36, 24.93, 20.97, 15.18]
      }
    },
    starter: {
      signature: [49.92, 44.71, 39.97, 34.63, 29.80],
      gold:      [55.42, 49.34, 44.05, 37.61, 32.21],
      national:  [53.06, 47.32, 42.83, 36.96, 32.14],
      impact:    [33.28, 28.35, 24.12, 19.52, 15.69]
    },
    middle: {
      signature: [52.46, 46.98, 41.80, 36.06, 30.83],
      gold:      [57.67, 51.15, 45.52, 38.80, 32.94],
      national:  [54.84, 48.89, 44.16, 38.05, 32.92],
      impact:    [35.81, 29.87, 25.63, 20.23, 15.99]
    },
    closer: {
      signature: [51.52, 46.19, 41.22, 35.45, 30.44],
      gold:      [56.65, 50.54, 44.83, 38.22, 32.54],
      national:  [54.17, 48.26, 43.66, 37.51, 32.62],
      impact:    [33.95, 29.42, 25.48, 19.73, 15.77]
    }
  };
  const EXCEL_GRADE_ROWS = [
    { label: 'SR+', rate: '상위 0.1% 기준', cls: 'grade-srp' },
    { label: 'SS', rate: '상위 0.5% 기준', cls: 'grade-ss' },
    { label: 'S', rate: '상위 1.5% 기준', cls: 'grade-s' },
    { label: 'A', rate: '상위 5% 기준', cls: 'grade-a' },
    { label: 'B', rate: '상위 12% 기준', cls: 'grade-b' }
  ];
  const ROLE_LABELS = { hitter: '타자', starter: '선발', middle: '중계', closer: '마무리' };
  const CARD_LABELS = { normal: '기타·라이브·올스타', signature: '시그니처', gold: '골든글러브', national: '국가대표', impact: '임팩트' };
  const hitterPositionEl = $('kboScoreHitterPosition');
  const hitterPositionWrap = $('kboScoreHitterPositionWrap');

  function getExcelCutoffs() {
    const role = roleEl.value;
    const type = cardTypeEl.value;
    const position = hitterPositionEl ? hitterPositionEl.value : 'fielder';
    const cutsByRole = EXCEL_SCORE_CUTOFFS[role];
    if (!cutsByRole || type === 'normal') return null;
    return role === 'hitter' ? (cutsByRole[position] && cutsByRole[position][type]) || null : cutsByRole[type] || null;
  }

  function gradeForExcelCutoff(total) {
    const cuts = getExcelCutoffs();
    if (!cuts || !Number.isFinite(total)) return null;
    const labels = [['SR+', 'grade-srp'], ['SS', 'grade-ss'], ['S', 'grade-s'], ['A', 'grade-a'], ['B', 'grade-b']];
    for (let i = 0; i < cuts.length; i++) {
      if (total + 1e-9 >= cuts[i]) return labels[i];
    }
    return ['C', 'grade-c'];
  }

  function updateExcelCutoffTable(total = null, scored = false) {
    const body = $('kboScoreExcelCutoffRows');
    const context = $('kboScoreExcelCutoffContext');
    const gradeEl = $('kboScoreExcelGrade');
    if (!body || !context || !gradeEl) return;

    const role = roleEl.value;
    const type = cardTypeEl.value;
    const position = hitterPositionEl ? hitterPositionEl.value : 'fielder';
    const roleLabel = role === 'hitter' ? `타자(${position === 'catcher' ? '포수' : '야수'})` : `투수·${ROLE_LABELS[role] || role}`;
    context.textContent = `${roleLabel} / ${CARD_LABELS[type] || type}`;
    body.innerHTML = '';
    const cuts = getExcelCutoffs();
    if (!cuts) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 3;
      td.textContent = '이 카드 조건의 고정 점수 컷은 엑셀에 제공되지 않았습니다.';
      tr.appendChild(td); body.appendChild(tr);
      gradeEl.textContent = '기준 미제공';
      gradeEl.className = 'kbo-score-grade';
      return;
    }

    EXCEL_GRADE_ROWS.forEach((item, i) => {
      const tr = document.createElement('tr');
      const grade = document.createElement('th');
      grade.scope = 'row'; grade.textContent = item.label; grade.className = item.cls;
      const rate = document.createElement('td'); rate.textContent = item.rate;
      const score = document.createElement('td'); score.className = 'kbo-score-cutoff';
      score.textContent = `≥ ${cuts[i].toFixed(2)}`;
      tr.append(grade, rate, score); body.appendChild(tr);
    });
    const cTr = document.createElement('tr');
    const cGrade = document.createElement('th'); cGrade.scope = 'row'; cGrade.textContent = 'C'; cGrade.className = 'grade-c';
    const cRate = document.createElement('td'); cRate.textContent = 'B 컷 미만';
    const cScore = document.createElement('td'); cScore.className = 'kbo-score-cutoff'; cScore.textContent = `< ${cuts[4].toFixed(2)}`;
    cTr.append(cGrade, cRate, cScore); body.appendChild(cTr);

    if (!scored) {
      gradeEl.textContent = '—';
      gradeEl.className = 'kbo-score-grade';
      return;
    }
    const gradeInfo = gradeForExcelCutoff(total);
    gradeEl.textContent = gradeInfo ? gradeInfo[0] : '기준 미제공';
    gradeEl.className = `kbo-score-grade${gradeInfo ? ` ${gradeInfo[1]}` : ''}`;
  }

  function updateHitterPositionVisibility() {
    if (hitterPositionWrap) hitterPositionWrap.hidden = roleEl.value !== 'hitter';
  }

  function levelSelectFor(slot) {
    return $(`kboScoreLevel${slot}`);
  }
  function skillSelectFor(slot) {
    return $(`kboScoreSkill${slot}`);
  }

  function rowForSlot(slot) {
    const select = skillSelectFor(slot);
    const id = Number(select.value);
    return activeRows.find(row => row.id === id) || null;
  }

  function updateLevelOptions(slot) {
    const row = rowForSlot(slot);
    const select = levelSelectFor(slot);
    let firstAvailable = null;
    Array.from(select.options).forEach(option => {
      const level = Number(option.value);
      const available = !!row && row.points[level] !== null && Number.isFinite(row.points[level]);
      option.disabled = !available;
      if (available && firstAvailable === null) firstAvailable = String(level);
    });
    if (row && (row.points[Number(select.value)] === null || row.points[Number(select.value)] === undefined)) {
      if (firstAvailable !== null) select.value = firstAvailable;
    }
    if (!row) {
      select.querySelectorAll('option').forEach(option => option.disabled = false);
    }
  }

  function getSlotScore(slot) {
    const row = rowForSlot(slot);
    const level = Number(levelSelectFor(slot).value);
    if (!row) return null;
    const score = row.points[level];
    return Number.isFinite(score) ? score : null;
  }

  function lowerBound(values, target) {
    let lo = 0, hi = values.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (values[mid] >= target - 1e-9) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }

  function cutoffForRate(values, maxRate) {
    if (!values.length) return null;
    // Find the lowest attainable total whose empirical upper-tail rate is at
    // or below the requested percentile. Duplicate totals are treated as ties.
    const unique = [];
    for (const value of values) {
      if (!unique.length || Math.abs(value - unique[unique.length - 1]) > 1e-9) unique.push(value);
    }
    let lo = 0, hi = unique.length - 1, answer = null;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const rate = (values.length - lowerBound(values, unique[mid])) / values.length;
      if (rate <= maxRate + 1e-12) {
        answer = unique[mid];
        hi = mid - 1;
      } else lo = mid + 1;
    }
    return answer;
  }

  function updateDistributionTable() {
    const body = $('kboScoreDistributionRows');
    const countEl = $('kboScoreDistributionCount');
    if (!body || !countEl) return;
    const values = distributionForCurrentCondition();
    body.innerHTML = '';
    countEl.textContent = values.length ? `${values.length.toLocaleString('ko-KR')}개 조합 기준` : '비교 가능한 조합 없음';
    const rows = [
      { label: 'SR+', rate: 0.001, text: '상위 0.1% 이내', cls: 'grade-srp' },
      { label: 'SS', rate: 0.005, text: '상위 0.5% 이내', cls: 'grade-ss' },
      { label: 'S', rate: 0.015, text: '상위 1.5% 이내', cls: 'grade-s' },
      { label: 'A', rate: 0.05, text: '상위 5% 이내', cls: 'grade-a' },
      { label: 'B', rate: 0.12, text: '상위 12% 이내', cls: 'grade-b' },
      { label: 'C', rate: null, text: '상위 12% 초과', cls: 'grade-c' }
    ];
    rows.forEach(item => {
      const tr = document.createElement('tr');
      const grade = document.createElement('th');
      grade.scope = 'row'; grade.textContent = item.label; grade.className = item.cls;
      const condition = document.createElement('td'); condition.textContent = item.text;
      const score = document.createElement('td'); score.className = 'kbo-score-cutoff';
      if (item.rate === null) {
        const bCutoff = cutoffForRate(values, 0.12);
        score.textContent = bCutoff === null ? '—' : `${formatScore(bCutoff)} 미만`;
      } else {
        const cutoff = cutoffForRate(values, item.rate);
        score.textContent = cutoff === null ? '표본상 기준 없음' : `${formatScore(cutoff)} 이상`;
      }
      tr.append(grade, condition, score); body.appendChild(tr);
    });
  }

  function distributionForCurrentCondition() {
    const role = roleEl.value;
    const type = cardTypeEl.value;
    const key = `${role}|${type}`;
    if (distributionCache.has(key)) return distributionCache.get(key);

    const candidates = getCandidates();
    const isImpact = type === 'impact';
    const levels = type === 'gold' ? [6, 6, 6] : [6, 5, 5];
    const sourceSlots = isImpact ? [
      candidates.filter(row => row.points[5] !== null).map(row => ({family: row.family, score: row.points[5]})),
      candidates.filter(row => row.points[5] !== null).map(row => ({family: row.family, score: row.points[5]}))
    ] : levels.map(level => candidates
      .filter(row => row.points[level] !== null)
      .map(row => ({family: row.family, score: row.points[level]})));

    const totals = [];
    if (isImpact) {
      const first = sourceSlots[0], second = sourceSlots[1];
      for (let i = 0; i < first.length; i++) {
        for (let j = 0; j < second.length; j++) {
          if (first[i].family === second[j].family) continue;
          totals.push(first[i].score + second[j].score);
        }
      }
    } else {
      const [first, second, third] = sourceSlots;
      for (let i = 0; i < first.length; i++) {
        const a = first[i];
        for (let j = 0; j < second.length; j++) {
          const b = second[j];
          if (a.family === b.family) continue;
          for (let k = 0; k < third.length; k++) {
            const c = third[k];
            if (c.family === a.family || c.family === b.family) continue;
            totals.push(a.score + b.score + c.score);
          }
        }
      }
    }
    totals.sort((a, b) => a - b);
    const result = totals;
    distributionCache.set(key, result);
    if (distributionCache.size > 4) {
      distributionCache.delete(distributionCache.keys().next().value);
    }
    return result;
  }

  function upperProbability(total) {
    const values = distributionForCurrentCondition();
    if (!values.length || !Number.isFinite(total)) return null;
    const lo = lowerBound(values, total);
    // A finite sample with no equal-or-higher baseline combination is reported
    // as the minimum observable probability rather than a false zero chance.
    const count = Math.max(1, values.length - lo);
    return count / values.length;
  }

  function updateResult() {
    let sum = 0, complete = true;
    for (let slot = 1; slot <= 3; slot++) {
      const score = getSlotScore(slot);
      const valueEl = $(`kboScoreValue${slot}`);
      const pillEl = $(`kboScorePill${slot}`);
      valueEl.textContent = formatScore(score);
      pillEl.textContent = score === null ? '점수 —' : `점수 ${formatScore(score)}`;
      if (score === null) complete = false;
      else if (!(cardTypeEl.value === 'impact' && slot === 1)) sum += score;
    }

    const totalEl = $('kboScoreTotal');
    const gradeEl = $('kboScoreGrade');
    const rateEl = $('kboScoreRate');
    const attemptsEl = $('kboScoreAttempts');
    const statusEl = $('kboScoreStatus');
    updateDistributionTable();
    const isImpact = cardTypeEl.value === 'impact';
    const neededSlots = isImpact ? [2, 3] : [1, 2, 3];
    const scored = neededSlots.every(slot => getSlotScore(slot) !== null);
    updateExcelCutoffTable(sum, scored);
    if (!scored) {
      totalEl.textContent = '—';
      gradeEl.textContent = '—';
      gradeEl.className = 'kbo-score-grade';
      rateEl.textContent = '—';
      attemptsEl.textContent = '—';
      statusEl.textContent = '스킬 3개와 각 레벨을 선택하면 점수가 계산됩니다. 임팩트는 2·3번 스킬 점수만 합산합니다.';
      return;
    }

    totalEl.textContent = formatScore(sum);
    const rate = upperProbability(sum);
    if (rate === null) {
      gradeEl.textContent = '—';
      gradeEl.className = 'kbo-score-grade';
      rateEl.textContent = '—';
      attemptsEl.textContent = '—';
      statusEl.textContent = '현재 조건에서 비교 가능한 조합을 찾지 못했습니다.';
      return;
    }
    const [grade, gradeClass] = gradeForRate(rate);
    gradeEl.textContent = grade;
    gradeEl.className = `kbo-score-grade ${gradeClass}`;
    rateEl.textContent = `${(rate * 100).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}%`;
    attemptsEl.textContent = `${Math.ceil(1 / rate).toLocaleString('ko-KR')}회`;
    statusEl.textContent = `점수표 기준 ${activeRows.length}개 스킬 항목으로 비교했습니다.`;
  }

  function populateSkillSelects() {
    activeRows = getCandidates().slice().sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    for (let slot = 1; slot <= 3; slot++) {
      const select = skillSelectFor(slot);
      const oldName = rowForSlot(slot)?.name || '';
      select.innerHTML = '<option value="">스킬 선택</option>';
      activeRows.forEach(row => {
        const option = document.createElement('option');
        option.value = String(row.id);
        option.textContent = row.name;
        select.appendChild(option);
      });
      const matching = activeRows.find(row => row.name === oldName);
      select.value = matching ? String(matching.id) : '';
      updateLevelOptions(slot);
    }
    updateResult();
  }

  function setDefaultLevels() {
    const base = cardTypeEl.value === 'gold' ? [6, 6, 6] : [6, 5, 5];
    for (let slot = 1; slot <= 3; slot++) {
      const select = levelSelectFor(slot);
      select.value = String(base[slot - 1]);
    }
  }

  async function ensureData() {
    if (loaded) return;
    if (loadPromise) return loadPromise;
    loadPromise = fetch(DATA_URL, {cache: 'no-store'})
      .then(response => {
        if (!response.ok) throw new Error(`점수표 파일을 불러오지 못했습니다. HTTP ${response.status}`);
        return response.text();
      })
      .then(text => {
        allRows = parseCSV(text);
        loaded = true;
      })
      .finally(() => { loadPromise = null; });
    return loadPromise;
  }

  let wired = false;
  async function activate() {
    const statusEl = $('kboScoreStatus');
    try {
      await ensureData();
      if (!wired) {
        roleEl.addEventListener('change', () => {
          distributionCache.clear();
          updateHitterPositionVisibility();
          populateSkillSelects();
        });
        cardTypeEl.addEventListener('change', () => {
          distributionCache.clear();
          setDefaultLevels();
          populateSkillSelects();
        });
        hitterPositionEl?.addEventListener('change', updateResult);
        for (let slot = 1; slot <= 3; slot++) {
          skillSelectFor(slot).addEventListener('change', () => {
            updateLevelOptions(slot);
            updateResult();
          });
          levelSelectFor(slot).addEventListener('change', updateResult);
        }
        wired = true;
      }
      updateHitterPositionVisibility();
      populateSkillSelects();
      statusEl.textContent = '';
    } catch (error) {
      statusEl.textContent = `${error.message || '점수표를 불러오지 못했습니다.'} GitHub에 skill-score-photo-rows.csv 파일이 있는지 확인해 주세요.`;
    }
  }

  window.KBOSkillScore = { activate };
})();