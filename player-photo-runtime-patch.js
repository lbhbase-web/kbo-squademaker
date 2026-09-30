(()=>{
  const photoMap=()=>window.__PLAYER_PHOTO_URLS__||(window.__PLAYER_PHOTO_URLS__={});
  const aliasNames=new Set(["오전익","임총오","호스틴","데니스","테런스"]);
  const e=s=>typeof window.esc==='function'?window.esc(String(s??'')):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pitcherPos=pos=>/^(SP|RP|CP|P)$/i.test(String(pos||'').trim())||/(투수|선발|계투|마무리)/.test(String(pos||''));
  const svgUri=kind=>{
    const pitcher=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300"><g fill="#031833" stroke="#031833" stroke-linecap="round" stroke-linejoin="round"><circle cx="132" cy="48" r="28"/><path d="M92 92c10-21 31-32 53-28 31 5 50 27 53 62l8 88c3 35-20 58-58 58H92c-32 0-55-19-56-48l-2-54c-1-27 8-52 28-70 9-8 18-12 30-8Z"/><path d="M126 92c-8-18-6-34 6-45 10-9 23-13 35-9 12 5 17 17 13 29-4 11-14 18-28 22" stroke-width="23" fill="none"/><path d="M171 105c17 7 27 18 32 33" stroke-width="24" fill="none"/><ellipse cx="207" cy="144" rx="22" ry="28"/><path d="M72 204 52 289M151 212l24 77" stroke-width="30" fill="none"/></g></svg>`;
    const batter=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300"><g fill="#08346d" stroke="#08346d" stroke-linecap="round" stroke-linejoin="round"><circle cx="132" cy="52" r="29"/><path d="M88 97c12-21 32-32 55-31 33 2 54 27 55 64l2 79c1 39-22 63-61 63H86c-33 0-55-20-55-51l2-61c1-33 14-54 38-67 6-3 11-4 17 4Z"/><path d="M96 112 37 134" stroke-width="29" fill="none"/><path d="M171 110 224 88" stroke-width="27" fill="none"/><path d="M32 132 8 128" stroke-width="13" fill="none"/><path d="M222 86 238 80" stroke-width="11" fill="none"/><path d="M81 211 54 289M151 211l31 78" stroke-width="30" fill="none"/></g></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(kind==='pitcher'?pitcher:batter);
  };
  const fallbackUrl=pos=>svgUri(pitcherPos(pos)?'pitcher':'batter');
  const inferPos=wrap=>wrap.dataset.playerPos||wrap.closest('.game-player-card,.lineup-card-shell,.batting-card-shell')?.querySelector('.game-card-pos,.lc-pos,.lineup-pos')?.textContent||'';
  const showFallback=(wrap,img,label)=>{
    if(!img)return;
    img.onload=()=>{img.classList.add('loaded');if(label)label.style.display='none'};
    img.onerror=null;
    img.src=fallbackUrl(inferPos(wrap));
  };

  window.fetchWikipediaPlayerPhoto=async function(name,team=''){
    name=String(name||'').trim();team=String(team||'').trim();
    if(aliasNames.has(name))return null;
    const key=`${name}-${team}`;
    if(!photoMap()[key]&&typeof window.__loadPlayerPhotoTeam==='function'){
      try{await window.__loadPlayerPhotoTeam(team)}catch(err){console.warn('선수사진 팀 파일 로드 실패:',team,err)}
    }
    return photoMap()[key]||null;
  };

  window.playerPhotoHTML=function(p,cls='player-photo'){
    const custom=typeof window.customPlayerPhotoUrl==='function'?window.customPlayerPhotoUrl(p):'';
    if(custom)return `<div class="picker-photo-wrap"><img class="${cls} loaded" src="${e(custom)}" alt="${e(p?.name||'선수')} 사진"></div>`;
    return `<div class="picker-photo-wrap" data-player-photo-wrap="1" data-player-name="${e(p?.name||'')}" data-player-team="${e(p?.team||'')}" data-player-pos="${e(p?.pos||'')}"><img class="${cls}" alt="${e(p?.name||'선수')} 사진"><span class="photo-fallback">${e(p?.name||'선수')}</span></div>`;
  };

  window.gamePhotoHTML=function(p,compact=false){
    const custom=typeof window.customPlayerPhotoUrl==='function'?window.customPlayerPhotoUrl(p):'';
    const cls=compact?'lc-photo':'game-card-photo';
    if(custom)return `<div class="${cls}"><img class="loaded" src="${e(custom)}" alt="${e(p?.name||'선수')} 사진"></div>`;
    return `<div class="${cls}" data-player-photo-wrap="1" data-player-name="${e(p?.name||'')}" data-player-team="${e(p?.team||'')}" data-player-pos="${e(p?.pos||'')}"><img alt="${e(p?.name||'선수')} 사진"><span class="photo-fallback">${e(p?.name||'선수')}</span></div>`;
  };

  let observer=null;
  window.hydratePlayerPhotos=async function(root=document){
    const wraps=[...root.querySelectorAll('[data-player-photo-wrap]')];
    const load=async wrap=>{
      if(wrap.dataset.photoReady)return;
      wrap.dataset.photoReady='1';
      const img=wrap.querySelector('img'),label=wrap.querySelector('.photo-fallback');
      if(!img)return;
      const url=await window.fetchWikipediaPlayerPhoto(wrap.dataset.playerName||'',wrap.dataset.playerTeam||'');
      if(!wrap.isConnected)return;
      if(!url){showFallback(wrap,img,label);return;}
      img.onload=()=>{img.classList.add('loaded');if(label)label.style.display='none'};
      img.onerror=()=>showFallback(wrap,img,label);
      img.src=url;
    };
    if('IntersectionObserver' in window){
      if(!observer)observer=new IntersectionObserver(entries=>entries.filter(x=>x.isIntersecting).forEach(x=>{observer.unobserve(x.target);load(x.target)}),{rootMargin:'280px 0px'});
      wraps.forEach(w=>{if(!w.dataset.photoReady)observer.observe(w)});
    }else await Promise.all(wraps.map(load));
  };

  const style=document.createElement('style');
  style.id='player-photo-fallback-v134';
  style.textContent=`
    [data-player-photo-wrap] img.loaded{object-fit:contain!important;object-position:center bottom!important;background:transparent!important}
    .game-card-photo img.loaded,.lc-photo img.loaded{filter:none!important}
  `;
  document.head.appendChild(style);
  try{if(typeof window.renderAll==='function')window.renderAll();setTimeout(()=>{try{window.hydratePlayerPhotos&&window.hydratePlayerPhotos(document)}catch(e){}},0);}catch(err){console.warn('선수사진 실루엣 패치 재렌더 실패',err)}
})();
