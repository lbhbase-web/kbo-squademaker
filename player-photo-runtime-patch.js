(()=>{
  const photoMap=()=>window.__PLAYER_PHOTO_URLS__||(window.__PLAYER_PHOTO_URLS__={});
  const aliases={"오전익":"오재원","임총오":"임창용","호스틴":"호세","데니스":"데이비스","테런스":"테임즈"};
  const e=s=>typeof window.esc==='function'?window.esc(String(s??'')):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.fetchWikipediaPlayerPhoto=async function(name,team=''){
    name=String(name||'').trim();team=String(team||'').trim();
    const key=`${name}-${team}`;
    if(!photoMap()[key]&&typeof window.__loadPlayerPhotoTeam==='function'){
      try{await window.__loadPlayerPhotoTeam(team)}catch(err){console.warn('선수사진 팀 파일 로드 실패:',team,err)}
    }
    if(photoMap()[key])return photoMap()[key];
    const real=aliases[name];
    return real?photoMap()[`${real}-${team}`]||null:null;
  };
  window.playerPhotoHTML=function(p,cls='player-photo'){
    const custom=typeof window.customPlayerPhotoUrl==='function'?window.customPlayerPhotoUrl(p):'';
    if(custom)return `<div class="picker-photo-wrap"><img class="${cls} loaded" src="${e(custom)}" alt="${e(p?.name||'선수')} 사진"></div>`;
    return `<div class="picker-photo-wrap" data-player-photo-wrap="1" data-player-name="${e(p?.name||'')}" data-player-team="${e(p?.team||'')}"><img class="${cls}" alt="${e(p?.name||'선수')} 사진"><span class="photo-fallback">${e(p?.name||'선수')}</span></div>`;
  };
  window.gamePhotoHTML=function(p,compact=false){
    const custom=typeof window.customPlayerPhotoUrl==='function'?window.customPlayerPhotoUrl(p):'';
    const cls=compact?'lc-photo':'game-card-photo';
    if(custom)return `<div class="${cls}"><img class="loaded" src="${e(custom)}" alt="${e(p?.name||'선수')} 사진"></div>`;
    return `<div class="${cls}" data-player-photo-wrap="1" data-player-name="${e(p?.name||'')}" data-player-team="${e(p?.team||'')}"><img alt="${e(p?.name||'선수')} 사진"><span class="photo-fallback">${e(p?.name||'선수')}</span></div>`;
  };
  try{if(typeof window.renderAll==='function')window.renderAll();}catch(err){console.warn('선수사진 패치 재렌더 실패',err)}
})();
