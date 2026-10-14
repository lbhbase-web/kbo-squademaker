(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const view = $('kboSkillSimView');
  if (!view) return;

  const roleSelect = $('kboSimRole');
  const cardTypeSelect = $('kboSimCardType');
  const lockFirst = $('kboSimLockFirst');
  const status = $('kboSimStatus');
  const probabilityNote = $('kboSimProbabilities');
  const slots = [1, 2, 3].map((n) => ({
    select: $(`kboSimSkill${n}`),
    tier: $(`kboSimTier${n}`),
    label: $(`kboSimSlotLabel${n}`)
  }));

  const TIER_NAMES = {
    national: '국가대표', major: '메이저', minor: '마이너', rookie: '루키', amateur: '아마추어'
  };
  const TIER_COLORS = {
    national: '#e5484d', major: '#a855f7', minor: '#3b82f6', rookie: '#22a06b', amateur: '#9ca3af'
  };
  const GENERAL_WEIGHTS = [
    { tier: 'amateur', weight: 30 },
    { tier: 'rookie', weight: 40 },
    { tier: 'minor', weight: 23 },
    { tier: 'major', weight: 7 }
  ];
  const ADVANCED_WEIGHTS = [
    { tier: 'amateur', weight: 25 },
    { tier: 'rookie', weight: 28 },
    { tier: 'minor', weight: 30 },
    { tier: 'major', weight: 17 }
  ];
  const ADVANCED_NATIONAL_WEIGHTS = [
    { tier: 'amateur', weight: 25 },
    { tier: 'rookie', weight: 28 },
    { tier: 'minor', weight: 30 },
    { tier: 'major', weight: 7 },
    { tier: 'national', weight: 10 }
  ];

  const NATIONAL_SKILLS = [
    { id: 'national_order', name: '타순 공략', role: 'P', tier: 'national' },
    { id: 'national_escape', name: '위기 탈출', role: 'P', tier: 'national' },
    { id: 'national_line', name: '빈틈없는 타선', role: 'B', tier: 'national' },
    { id: 'national_table', name: '국대 테이블세터', role: 'B', tier: 'national' },
    { id: 'national_relief', name: '국민 계투', role: 'R', tier: 'national' },
    ...[
      ['solve', '해결사'], ['win', '전승 우승'], ['golden', '황금세대'],
      ['fight', '투쟁심'], ['eighth', '약속의 8회'], ['ace', '국대 에이스']
    ].flatMap(([id, name]) => ['B', 'P'].map((role) => ({
      id: `national_${id}_${role}`, name, role, tier: 'national'
    })))
  ];

  let simulatorMode = 'general';
  let allSkills = [];
  let currentSkills = [null, null, null];
  let loaded = false;
  let loadPromise = null;
  let scoreRows = [];
  let scoreRowsPromise = null;

  function normalizeScoreName(value) {
    return String(value || '').replace(/\([^)]*\)/g, '').replace(/[☆★]/g, '').replace(/\s+/g, '').replace(/[·ㆍ]/g, '').toLocaleLowerCase('ko-KR');
  }
  function parseScoreCSV(text) {
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim());
    if (!lines.length) return [];
    const parseLine = line => { const cells=[]; let cell='', quoted=false; for(let i=0;i<line.length;i++){const ch=line[i]; if(ch==='"'){if(quoted&&line[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(ch===','&&!quoted){cells.push(cell);cell='';}else cell+=ch;}cells.push(cell);return cells;};
    const headers=parseLine(lines[0]).map(x=>x.trim());
    return lines.slice(1).map(line=>{const vals=parseLine(line), row={};headers.forEach((key,i)=>row[key]=(vals[i]||'').trim());return {target:row['대상'],name:row['스킬명'],normalized:normalizeScoreName(row['스킬명']),points:Object.fromEntries([5,6,7,8,9,10].map(level=>[level,row[`Lv${level}`]===''||!Number.isFinite(Number(row[`Lv${level}`]))?null:Number(row[`Lv${level}`])]))};}).filter(r=>r.name&&r.target);
  }
  function loadScoreRows() {
    if (scoreRows.length) return Promise.resolve(scoreRows);
    if (!scoreRowsPromise) scoreRowsPromise=fetch('./skill-score-photo-rows.csv').then(r=>{if(!r.ok)throw new Error('스킬 점수표 CSV를 불러오지 못했어.');return r.text();}).then(text=>{scoreRows=parseScoreCSV(text);return scoreRows;}).catch(err=>{scoreRowsPromise=null;throw err;});
    return scoreRowsPromise;
  }
  function scoreTarget() { return roleSelect.value === 'hitter' ? '타자' : '투수'; }
  function findScoreRow(skill) {
    if (!skill) return null;
    const key=normalizeScoreName(skill.name), target=scoreTarget();
    const matches=scoreRows.filter(row=>row.target===target && row.normalized===key);
    if (!matches.length) {
      // CSV labels may append role/card conditions in parentheses; use a conservative prefix match only if unique.
      const loose=scoreRows.filter(row=>row.target===target && (row.normalized.startsWith(key)||key.startsWith(row.normalized)));
      return loose.length===1?loose[0]:null;
    }
    if(matches.length===1)return matches[0];
    const roleWord={starter:'선발',middle:'중계',closer:'마무리',hitter:''}[roleSelect.value]||'';
    return matches.find(row=>roleWord && row.name.includes(roleWord))||matches[0];
  }
  function renderScoreSummary() {
    const totalEl=$('kboSimTotalScore'), helpEl=$('kboSimScoreHelp');
    let total=0, counted=0, missing=[];
    currentSkills.forEach((skill,index)=>{
      const scoreEl=$(`kboSimScore${index+1}`), level=Number($(`kboSimLevel${index+1}`).value);
      const row=findScoreRow(skill), value=row?.points[level];
      if (skill && Number.isFinite(value)) { scoreEl.textContent=`Lv.${level} 점수: ${value.toFixed(2)}`; total+=value; counted++; }
      else { scoreEl.textContent=skill?'점수표 없음':'점수: —'; if(skill) missing.push(skill.name); }
    });
    totalEl.textContent=counted===3?`총점: ${total.toFixed(2)}`:(counted?`부분 합계: ${total.toFixed(2)}`:'총점: —');
    helpEl.textContent=counted===3?'세 스킬의 선택 레벨 점수를 합산했어. 등급은 카드 유형·조합 분포에 따라 달라질 수 있어.':(missing.length?`점수표에서 찾지 못한 스킬: ${missing.join(', ')}. 해당 스킬의 점수 자료가 필요해.`:'스킬과 레벨을 선택하면 점수를 계산해.');
  }

  function roleAllowed(skill, role) {
    if (skill.role === 'B') return role === 'hitter';
    if (skill.role === 'P') return role !== 'hitter';
    if (skill.role === 'R') return role === 'middle' || role === 'closer';
    if (skill.role === 'SR') return role === 'starter' || role === 'middle';
    if (skill.role === 'SP') return role === 'starter';
    if (skill.role === 'CP') return role === 'closer';
    return false;
  }

  function isNationalCard() {
    return simulatorMode === 'advanced' && cardTypeSelect.value === 'national';
  }
  function canLockFirst() {
    return simulatorMode === 'general' && ['impact', 'allstar'].includes(cardTypeSelect.value);
  }

  // In-game level limits: Live All-Star can reach Lv.10; ordinary, Impact, Signature, and Gold Glove cards cap at Lv.8.
  // National Team cards and National Team skills cap at Lv.6.
  function maxAllowedLevel(skill) {
    if (cardTypeSelect.value === 'national' || skill?.tier === 'national') return 6;
    if (cardTypeSelect.value === 'allstar') return 10;
    return 8;
  }

  function configureLevelSelectors() {
    [1, 2, 3].forEach(index => {
      const select = $(`kboSimLevel${index}`);
      if (!select) return;
      const skill = currentSkills[index - 1];
      const max = maxAllowedLevel(skill);
      const old = Number(select.value) || 6;
      select.innerHTML = Array.from({length: max - 4}, (_, i) => i + 5)
        .map(level => `<option value="${level}">Lv.${level}</option>`).join('');
      select.value = String(Math.min(old, max));
    });
  }

  function visiblePool() {
    return allSkills.filter((skill) => roleAllowed(skill, roleSelect.value) &&
      (skill.tier !== 'national' || isNationalCard()));
  }

  function skillKey(skill) {
    return String(skill?.name || '').replace(/\s+/g, '').toLocaleLowerCase('ko-KR');
  }

  function findSkill(id) {
    return allSkills.find((skill) => skill.id === id) || null;
  }

  function loadCatalog() {
    if (loaded) return Promise.resolve();
    if (loadPromise) return loadPromise;
    loadPromise = Promise.all([
      fetch('./major-skills.json').then((r) => {
        if (!r.ok) throw new Error('major-skills.json을 불러오지 못했어.');
        return r.json();
      }),
      fetch('./lower-skills.json').then((r) => {
        if (!r.ok) throw new Error('lower-skills.json을 불러오지 못했어.');
        return r.json();
      })
    ]).then(([major, lower]) => {
      const ordinary = [...major, ...lower].map((skill) => ({ ...skill }));
      const deduped = new Map();
      [...ordinary, ...NATIONAL_SKILLS].forEach((skill) => {
        if (skill.id && !deduped.has(skill.id)) deduped.set(skill.id, skill);
      });
      allSkills = [...deduped.values()];
      loaded = true;
    }).catch((error) => {
      loadPromise = null;
      throw error;
    });
    return loadPromise;
  }

  function selectTier(weights) {
    const roll = Math.random() * weights.reduce((sum, item) => sum + item.weight, 0);
    let walked = 0;
    for (const item of weights) {
      walked += item.weight;
      if (roll < walked) return item.tier;
    }
    return weights[weights.length - 1].tier;
  }

  function candidatePool(tier, usedNames, usedIds) {
    return visiblePool().filter((skill) => skill.tier === tier &&
      !usedIds.has(skill.id) && !usedNames.has(skillKey(skill)));
  }

  function rollSkill(tierWeights, usedNames, usedIds) {
    // A duplicate skill is not allowed. If a tier has no unused candidate, draw the tier again.
    for (let attempt = 0; attempt < 250; attempt++) {
      const tier = selectTier(tierWeights);
      const candidates = candidatePool(tier, usedNames, usedIds);
      if (candidates.length) return candidates[Math.floor(Math.random() * candidates.length)];
    }
    // Defensive fallback for a very constrained role: preserve uniqueness and choose any remaining skill.
    const remaining = visiblePool().filter((skill) => !usedIds.has(skill.id) && !usedNames.has(skillKey(skill)));
    if (!remaining.length) return null;
    return remaining[Math.floor(Math.random() * remaining.length)];
  }

  function allUsed(skills) {
    return {
      names: new Set(skills.filter(Boolean).map(skillKey)),
      ids: new Set(skills.filter(Boolean).map((skill) => skill.id))
    };
  }

  function makeInitialRoll() {
    const used = { names: new Set(), ids: new Set() };
    const result = [];
    const highWeights = isNationalCard() ? ADVANCED_NATIONAL_WEIGHTS : ADVANCED_WEIGHTS;
    for (let index = 0; index < 3; index++) {
      let skill;
      if (simulatorMode === 'advanced' && index === 0) {
        skill = rollSkill([{ tier: 'major', weight: 100 }], used.names, used.ids);
      } else {
        skill = rollSkill(simulatorMode === 'general' ? GENERAL_WEIGHTS : highWeights, used.names, used.ids);
      }
      result.push(skill);
      if (skill) { used.names.add(skillKey(skill)); used.ids.add(skill.id); }
    }
    currentSkills = result;
  }

  function reroll() {
    const previous = currentSkills.slice();
    const locked = canLockFirst() && lockFirst.checked && previous[0];
    const next = [null, null, null];
    const used = { names: new Set(), ids: new Set() };
    if (locked) {
      next[0] = previous[0];
      used.names.add(skillKey(previous[0]));
      used.ids.add(previous[0].id);
    }
    const weights = simulatorMode === 'general'
      ? GENERAL_WEIGHTS
      : (isNationalCard() ? ADVANCED_NATIONAL_WEIGHTS : ADVANCED_WEIGHTS);

    for (let index = 0; index < 3; index++) {
      if (index === 0 && locked) continue;
      let skill;
      if (simulatorMode === 'advanced' && index === 0) {
        skill = rollSkill([{ tier: 'major', weight: 100 }], used.names, used.ids);
      } else {
        skill = rollSkill(weights, used.names, used.ids);
      }
      next[index] = skill;
      if (skill) { used.names.add(skillKey(skill)); used.ids.add(skill.id); }
    }
    currentSkills = next;
    renderSlots();
    renderScoreSummary();
    const tiers = currentSkills.map((skill) => skill ? `${skill.name} (${TIER_NAMES[skill.tier]})` : '미선택');
    status.textContent = `변경 결과: ${tiers.join(' · ')}`;
  }

  function configureCardTypes() {
    const prior = cardTypeSelect.value;
    const options = simulatorMode === 'general'
      ? [
          ['normal', '일반 카드'], ['impact', '임팩트'], ['signature', '시그니처'], ['goldglove', '골든글러브'], ['allstar', '라이브 올스타']
        ]
      : [
          ['normal', '일반 카드'], ['signature', '시그니처'], ['goldglove', '골든글러브'], ['national', '국가대표 카드']
        ];
    cardTypeSelect.innerHTML = options.map(([value, label]) =>
      `<option value="${value}">${label}</option>`).join('');
    cardTypeSelect.value = options.some(([value]) => value === prior) ? prior : options[0][0];
    lockFirst.disabled = !canLockFirst();
    if (!canLockFirst()) lockFirst.checked = false;
    $('kboSimLockWrap').classList.toggle('is-disabled', !canLockFirst());
  }

  function updateProbabilityNote() {
    if (simulatorMode === 'general') {
      probabilityNote.innerHTML = '<b>일스변 확률</b><span>아마추어 30%</span><span>루키 40%</span><span>마이너 23%</span><span>메이저 7%</span><p>임팩트·라이브 올스타만 1옵 잠금을 사용할 수 있어. 잠금 중에는 2옵과 3옵만 새로 뽑아.</p>';
    } else if (isNationalCard()) {
      probabilityNote.innerHTML = '<b>고스변 · 국가대표 카드</b><span>아마추어 25%</span><span>루키 28%</span><span>마이너 30%</span><span>메이저 7%</span><span>국가대표 10%</span><p>1옵은 메이저 확정. 2옵·3옵은 각각 위 확률로 독립 추첨하며, 세 옵션에 같은 스킬이 중복되지 않아.</p>';
    } else {
      probabilityNote.innerHTML = '<b>고스변 확률</b><span>아마추어 25%</span><span>루키 28%</span><span>마이너 30%</span><span>메이저 17%</span><p>1옵은 메이저 확정. 2옵·3옵은 각각 위 확률로 독립 추첨하며, 세 옵션에 같은 스킬이 중복되지 않아.</p>';
    }
  }

  function renderSlots() {
    const pool = visiblePool();
    slots.forEach((slot, index) => {
      const selected = currentSkills[index];
      const options = ['<option value="">스킬 선택</option>'];
      pool.forEach((skill) => {
        const usedElsewhere = currentSkills.some((other, otherIndex) => otherIndex !== index &&
          other && (other.id === skill.id || skillKey(other) === skillKey(skill)));
        const disabled = usedElsewhere && selected?.id !== skill.id ? ' disabled' : '';
        const selectedAttr = selected?.id === skill.id ? ' selected' : '';
        options.push(`<option value="${skill.id}"${selectedAttr}${disabled}>[${TIER_NAMES[skill.tier]}] ${skill.name}</option>`);
      });
      slot.select.innerHTML = options.join('');
      slot.select.value = selected && pool.some((skill) => skill.id === selected.id) ? selected.id : '';
      const actual = currentSkills[index];
      slot.tier.textContent = actual ? TIER_NAMES[actual.tier] : '미선택';
      slot.tier.style.background = actual ? `${TIER_COLORS[actual.tier]}20` : '#f1f5f9';
      slot.tier.style.color = actual ? TIER_COLORS[actual.tier] : '#64748b';
      slot.label.textContent = `${index + 1}옵`;
      if (simulatorMode === 'advanced' && index === 0) {
        slot.tier.textContent = actual ? `${TIER_NAMES[actual.tier]} · 확정` : '메이저 확정';
      }
    });
    configureLevelSelectors();
  }

  function resetForRoleOrCard() {
    if (!loaded) return;
    configureCardTypes();
    makeInitialRoll();
    renderSlots();
    renderScoreSummary();
    updateProbabilityNote();
    status.textContent = '새 조합을 만들었어. 각 스킬 칸에서 현재 보유 스킬을 직접 선택한 뒤 변경을 실행해도 돼.';
  }

  async function activate(mode) {
    simulatorMode = mode === 'advanced' ? 'advanced' : 'general';
    $('kboSimTitle').textContent = simulatorMode === 'advanced' ? '고스변 시뮬' : '일스변 시뮬';
    $('kboSimSubtitle').textContent = simulatorMode === 'advanced'
      ? '1옵 메이저 확정 · 2옵/3옵 확률 추첨 · 중복 스킬 방지'
      : '등급 확률에 따른 스킬 변경 · 임팩트/라이브 올스타 1옵 잠금';
    $('kboSimLockHelp').textContent = '임팩트·라이브 올스타 전용';
    try {
      await loadCatalog();
      configureCardTypes();
      makeInitialRoll();
      renderSlots();
      updateProbabilityNote();
      await loadScoreRows();
      renderScoreSummary();
      status.textContent = '확률 규칙과 스킬 점수 계산을 적용했어. 스킬을 직접 선택하거나 변경 실행을 눌러줘.';
    } catch (error) {
      status.textContent = `스킬 목록을 불러오지 못했어: ${error.message} 사이트 루트에 major-skills.json과 lower-skills.json이 있는지 확인해줘.`;
    }
  }

  slots.forEach((slot, index) => {
    slot.select.addEventListener('change', () => {
      const id = slot.select.value;
      currentSkills[index] = findSkill(id);
      // Manual picks cannot duplicate another displayed skill; revert if an identical name was chosen.
      const sameName = currentSkills.some((skill, otherIndex) => otherIndex !== index && skill &&
        currentSkills[index] && skillKey(skill) === skillKey(currentSkills[index]));
      if (sameName) {
        currentSkills[index] = null;
        status.textContent = '같은 스킬은 중복 선택할 수 없어.';
      }
      renderSlots();
      configureLevelSelectors();
      renderScoreSummary();
    });
  });

  cardTypeSelect.addEventListener('change', () => {
    if (!loaded) return;
    if (!canLockFirst()) lockFirst.checked = false;
    resetForRoleOrCard();
  });
  roleSelect.addEventListener('change', resetForRoleOrCard);
  lockFirst.addEventListener('change', () => {
    if (lockFirst.checked && currentSkills[0]) status.textContent = `1옵 ${currentSkills[0].name}을 잠갔어. 다음 변경에서 2옵·3옵만 바뀌어.`;
    else status.textContent = '1옵 잠금이 해제됐어.';
  });
  [1,2,3].forEach(index => $(`kboSimLevel${index}`)?.addEventListener('change', renderScoreSummary));
  $('kboSimRoll')?.addEventListener('click', reroll);
  $('kboSimFresh')?.addEventListener('click', () => {
    if (!loaded) return;
    makeInitialRoll();
    renderSlots();
    renderScoreSummary();
    status.textContent = '새로운 초기 조합을 뽑았어.';
  });

  window.KBOSkillSimulator = { activate };
})();
