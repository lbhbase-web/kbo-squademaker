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
    let lo = 0, hi = values.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (values[mid] >= total - 1e-9) hi = mid;
      else lo = mid + 1;
    }
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
    const isImpact = cardTypeEl.value === 'impact';
    const neededSlots = isImpact ? [2, 3] : [1, 2, 3];
    const scored = neededSlots.every(slot => getSlotScore(slot) !== null);
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
        roleEl.addEventListener('change', () => { distributionCache.clear(); populateSkillSelects(); });
        cardTypeEl.addEventListener('change', () => {
          distributionCache.clear();
          setDefaultLevels();
          populateSkillSelects();
        });
        for (let slot = 1; slot <= 3; slot++) {
          skillSelectFor(slot).addEventListener('change', () => {
            updateLevelOptions(slot);
            updateResult();
          });
          levelSelectFor(slot).addEventListener('change', updateResult);
        }
        wired = true;
      }
      populateSkillSelects();
      statusEl.textContent = '';
    } catch (error) {
      statusEl.textContent = `${error.message || '점수표를 불러오지 못했습니다.'} GitHub에 skill-score-photo-rows.csv 파일이 있는지 확인해 주세요.`;
    }
  }

  window.KBOSkillScore = { activate };
})();