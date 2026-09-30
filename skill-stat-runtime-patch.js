(()=>{
  // v14.1 — 게임 방식: 모든 스킬 효과는 경기 중 참고값으로만 유지하고
  // 카드의 표시 능력치와 OVR에는 절대 합산하지 않는다.
  const originalEffectiveStats = window.effectiveStats;
  const originalEffectiveCardOvr = window.effectiveCardOvr;
  const originalSkillControls = window.skillControls;

  if(typeof originalEffectiveStats !== 'function' || typeof originalEffectiveCardOvr !== 'function'){
    console.warn('v14.1 스킬 능력치 패치: 필요한 함수가 없습니다.');
    return;
  }

  window.effectiveStats = function(p, slot=null, mode=window.currentMode, includeSkills=true){
    // 원래 함수의 "스킬 제외" 경로를 그대로 사용한다.
    const result = originalEffectiveStats(p, slot, mode, false);

    // skillBonuses 내부에서 baseline 계산을 위해 includeSkills=false로 호출할 때는
    // 부가 스킬 계산도 하지 않아 재귀를 막는다.
    if(includeSkills === false) return result;

    // 스킬 정보 자체는 유지한다. 단, result.stats에는 합산하지 않는다.
    try{
      if(typeof window.skillBonuses === 'function'){
        const info = window.skillBonuses(p, slot, mode);
        result.skillBonus = info?.total || {};
        result.skillEffects = info || {total:{}};
      }
    }catch(err){
      console.warn('스킬 참고 효과 계산 실패:', err);
    }
    return result;
  };

  window.effectiveCardOvr = function(p, g, slot=null, mode=window.currentMode){
    const base = Number(p?.ovr);
    if(!Number.isFinite(base)) return originalEffectiveCardOvr(p, g, slot, mode);

    // 스킬을 제외한 실제 카드 최종 능력치만으로 기존 OVR 규칙을 재현한다.
    const result = originalEffectiveStats(p, slot, mode, false);
    const stats = result?.stats || {};
    const pitcher = ['SP','RP','CP'].includes(String(p?.pos||''));
    const keys = pitcher
      ? ['velocity','break','stuff','control','stamina','fielding']
      : ['power','contact','eye','patience','baserun','fielding'];

    let delta = 0;
    for(const k of keys){
      const before = Number(p?.stats?.[k]);
      const after = Number(stats?.[k]);
      if(Number.isFinite(before) && Number.isFinite(after)) delta += after - before;
    }
    return base + Math.floor(delta / 6);
  };

  if(typeof originalSkillControls === 'function'){
    window.skillControls = function(...args){
      let html = originalSkillControls.apply(this, args);
      html = html.replace(
        '기본 증가·타순·포지션·모드 효과를 계산합니다. 상대 감소 및 8회·주자 등 경기 중 조건은 제외합니다.',
        '모든 스킬 효과는 실제 경기 중 적용되는 참고 정보로만 표시하며, 상시 효과를 포함해 카드 최종 능력치와 OVR에는 합산하지 않습니다.'
      );
      html = html.replaceAll('본인 스킬:', '경기 중 본인 스킬 참고값:');
      html = html.replaceAll('동료 효과:', '경기 중 동료 효과 참고값:');
      html = html.replaceAll('스킬 합계:', '경기 중 스킬 참고 합계:');
      return html;
    };
  }

  // 이미 그려진 카드와 육성 화면을 새 규칙으로 즉시 다시 계산한다.
  try{ if(typeof window.renderAll === 'function') window.renderAll(); }catch(e){}
  try{ if(typeof window.renderGrow === 'function') window.renderGrow(); }catch(e){}
})();
