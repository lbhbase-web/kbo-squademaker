(()=>{
  // v15.2
  // 포지션 특훈 Lv.5 / Lv.15 타자 보너스를
  // "파워 +3 / 정확 +3" 고정에서
  // 각 레벨마다 "파워 +3 / 정확 +3" 중 하나를 직접 선택하도록 수정한다.
  //
  // 투수는 기존 선택 규칙을 유지한다.
  const WAIT_MAX=120;
  let tries=0;

  const isPitcherSlot=(slot)=>{
    const s=String(slot||'').toUpperCase();
    return s==='CP' || /^SP\d*$/.test(s) || /^RP\d*$/.test(s);
  };

  const choiceKeys=(role)=>{
    if(role==='pitcher'){
      // 투수는 기존 앱의 선택 범위를 유지한다.
      try{
        if(typeof window.__KBO_ORIGINAL_ALLOWED_POSITION_KEYS__==='function'){
          return window.__KBO_ORIGINAL_ALLOWED_POSITION_KEYS__(role);
        }
      }catch(e){}
      return ['velocity','break','stuff','control','stamina','fielding'];
    }
    return ['power','contact'];
  };

  const makeRoll=(key)=>({
    key,
    stats:{[key]:3},
    amount:3
  });

  const apply=()=>{
    if(typeof window.ensureLineupState!=='function'){
      if(tries++<WAIT_MAX)return setTimeout(apply,100);
      console.warn('포지션 특훈 패치: ensureLineupState를 찾지 못했습니다.');
      return;
    }

    if(!window.__KBO_ORIGINAL_ALLOWED_POSITION_KEYS__ &&
       typeof window.allowedPositionBonusKeys==='function'){
      window.__KBO_ORIGINAL_ALLOWED_POSITION_KEYS__=window.allowedPositionBonusKeys;
    }

    if(!window.__KBO_ORIGINAL_NORMALIZE_POSITION_BONUS__ &&
       typeof window.normalizePositionBonusRoll==='function'){
      window.__KBO_ORIGINAL_NORMALIZE_POSITION_BONUS__=window.normalizePositionBonusRoll;
    }

    if(!window.__KBO_ORIGINAL_RANDOM_POSITION_BONUS__ &&
       typeof window.randomPositionBonusRoll==='function'){
      window.__KBO_ORIGINAL_RANDOM_POSITION_BONUS__=window.randomPositionBonusRoll;
    }

    if(!window.__KBO_ORIGINAL_ENSURE_LINEUP_STATE__){
      window.__KBO_ORIGINAL_ENSURE_LINEUP_STATE__=window.ensureLineupState;
    }

    if(!window.__KBO_ORIGINAL_GET_POSITION_BONUS_ROLL__ &&
       typeof window.getPositionBonusRoll==='function'){
      window.__KBO_ORIGINAL_GET_POSITION_BONUS_ROLL__=window.getPositionBonusRoll;
    }

    window.allowedPositionBonusKeys=(role)=>{
      if(role==='pitcher'){
        return choiceKeys('pitcher');
      }
      return ['power','contact'];
    };

    window.randomPositionBonusRoll=(role,milestone=5)=>{
      if(role==='pitcher'){
        const original=window.__KBO_ORIGINAL_RANDOM_POSITION_BONUS__;
        if(typeof original==='function'){
          try{
            return original(role,milestone);
          }catch(e){}
        }
        return makeRoll(Number(milestone)===15?'stuff':'break');
      }
      const key=Math.random()<0.5?'power':'contact';
      return makeRoll(key);
    };

    window.normalizePositionBonusRoll=(raw,role,milestone=5)=>{
      const allowed=window.allowedPositionBonusKeys(role);
      if(raw && typeof raw==='object' && allowed.includes(raw.key)){
        return makeRoll(raw.key);
      }
      if(typeof raw==='string' && allowed.includes(raw)){
        return makeRoll(raw);
      }
      // 새 슬롯/기존 잘못 저장된 값은 타자 Lv.5/Lv.15 모두 파워 +3으로 시작.
      if(role!=='pitcher')return makeRoll('power');

      const original=window.__KBO_ORIGINAL_NORMALIZE_POSITION_BONUS__;
      if(typeof original==='function'){
        try{return original(raw,role,milestone);}
        catch(e){}
      }
      return makeRoll(Number(milestone)===15?'stuff':'break');
    };

    window.ensureLineupState=(mode)=>{
      const L=window.__KBO_ORIGINAL_ENSURE_LINEUP_STATE__(mode);
      try{
        const choices=L.positionTrainingChoices||(L.positionTrainingChoices={});
        for(const slot of Object.keys(choices)){
          if(isPitcherSlot(slot))continue;
          if(!choices[slot])choices[slot]={};
          for(const milestone of ['5','15']){
            const raw=choices[slot][milestone];
            choices[slot][milestone]=window.normalizePositionBonusRoll(raw,'batter',Number(milestone));
          }
        }
      }catch(e){}
      return L;
    };

    window.getPositionBonusRoll=(slot,milestone,mode)=>{
      const L=window.ensureLineupState(mode);
      const role=isPitcherSlot(slot)?'pitcher':'batter';
      if(!L.positionTrainingChoices)L.positionTrainingChoices={};
      if(!L.positionTrainingChoices[slot])L.positionTrainingChoices[slot]={};
      const key=String(milestone);
      const current=L.positionTrainingChoices[slot][key];
      const roll=window.normalizePositionBonusRoll(current,role,Number(milestone));
      L.positionTrainingChoices[slot][key]=roll;
      return roll;
    };

    // 직접 선택 함수도 타자에서는 파워/정확만 허용하도록 보정한다.
    if(typeof window.setPositionBonusManual==='function'){
      const originalSet=window.setPositionBonusManual;
      if(!window.__KBO_ORIGINAL_SET_POSITION_BONUS_MANUAL__){
        window.__KBO_ORIGINAL_SET_POSITION_BONUS_MANUAL__=originalSet;
      }
      window.setPositionBonusManual=(slot,milestone,key,amount)=>{
        const role=isPitcherSlot(slot)?'pitcher':'batter';
        if(role==='batter' && !['power','contact'].includes(key))key='power';
        return originalSet(slot,milestone,key,3);
      };
    }

    try{
      const L=window.ensureLineupState();
      const choices=L.positionTrainingChoices||{};
      for(const slot of Object.keys(choices)){
        if(isPitcherSlot(slot))continue;
        for(const milestone of ['5','15']){
          const r=choices[slot]?.[milestone];
          if(!r || !['power','contact'].includes(r.key)){
            choices[slot]??={};
            choices[slot][milestone]=makeRoll('power');
          }
        }
      }
    }catch(e){}

    try{
      if(typeof window.renderSetdeckPosition==='function'){
        window.renderSetdeckPosition();
      }
    }catch(e){}

    window.__POSITION_TRAINING_POWER_CONTACT_V152__=true;
  };

  apply();
})();
