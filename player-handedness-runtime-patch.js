(()=>{
  // 정대현B는 잠수함 우투수.
  // 기존 PLAYER_HANDEDNESS의 잘못된 좌투 값을 우투로 교정한다.
  const apply=()=>{
    try{
      if(typeof PLAYER_HANDEDNESS !== 'undefined' && PLAYER_HANDEDNESS){
        PLAYER_HANDEDNESS["정대현B"]={b:"",t:"우"};
      }
    }catch(e){}

    try{
      if(typeof players !== 'undefined' && Array.isArray(players)){
        for(const p of players){
          if(String(p?.name||'').trim()!=="정대현B") continue;
          p.throws="우";
          if(typeof getGrowth === 'function'){
            const g=getGrowth(p);
            if(g) g.pitchingHand="우";
          }
        }
      }
    }catch(e){}

    try{
      if(typeof currentGrowId !== 'undefined' && typeof players !== 'undefined' && typeof getGrowth === 'function'){
        const p=players.find(x=>x.id===currentGrowId);
        if(p && String(p.name||'').trim()==="정대현B") getGrowth(p).pitchingHand="우";
      }
    }catch(e){}

    try{
      if(typeof renderAll === 'function') renderAll();
      if(typeof renderGrow === 'function') renderGrow();
    }catch(e){}
  };

  apply();
  window.__JEONGDAEHYUNB_HAND_FIXED__=true;
})();
