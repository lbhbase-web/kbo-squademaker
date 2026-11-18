(()=>{
  const photoMap=()=>window.__PLAYER_PHOTO_URLS__||(window.__PLAYER_PHOTO_URLS__={});
  // 옛 구단 선수도 현재 프랜차이즈 사진 모듈에서 같은 이름의 사진을 찾는다.
  const photoTeamParent={"해태":"KIA","MBC":"LG","MBC청룡":"LG","빙그레":"한화","SK":"SSG","쌍방울":"SSG","OB":"두산","현대":"키움","태평양":"키움","청보":"키움","삼미":"키움"};
  const photoTeam=team=>photoTeamParent[String(team||'').trim()]||String(team||'').trim();
  const aliasNames=new Set(["오전익","임총오","호스틴","데니스","테런스"]);
  // 2026 LIVE(year=01) roster: only unique exact internal names with an existing current-team photo.
  // Names appearing on multiple current teams are deliberately excluded to avoid homonym mix-ups.
  const activePhotoTeamByName={"강민호":"삼성","강백호":"한화","강승호":"두산","강재민":"한화","고명준":"SSG","고승민":"롯데","고영표":"KT","고우석":"LG","고종욱":"KIA","곽도규":"KIA","곽빈":"두산","구본혁":"LG","구자욱":"삼성","구창모":"NC","권동진":"KT","권혁빈":"키움","권희동":"NC","김강률":"LG","김건우":"SSG","김건희":"키움","김광현":"SSG","김규성":"KIA","김대한":"두산","김도영":"KIA","김도현":"KIA","김도환":"삼성","김동주":"두산","김동헌":"키움","김동혁":"롯데","김동현":"롯데","김민":"SSG","김민석":"두산","김민성":"롯데","김민수":"KT","김민식":"SSG","김서준":"키움","김서현":"한화","김선기":"키움","김선빈":"KIA","김성민":"키움","김성욱":"SSG","김성윤":"삼성","김성진":"키움","김성현":"SSG","김영규":"NC","김영우":"LG","김영웅":"삼성","김웅빈":"키움","김원중":"롯데","김윤식":"LG","김윤하":"키움","김재성":"삼성","김재열":"NC","김재웅":"키움","김재윤":"삼성","김재환":"SSG","김정우":"두산","김종수":"한화","김주원":"NC","김지찬":"삼성","김진성":"LG","김진욱":"롯데","김진호":"NC","김태군":"KIA","김태연":"한화","김태진":"키움","김태형":"KIA","김택연":"두산","김택형":"SSG","김한별":"NC","김헌곤":"삼성","김현준":"삼성","김형준":"NC","김호령":"KIA","김휘집":"NC","나균안":"롯데","나성범":"KIA","나승엽":"롯데","네일":"KIA","노경은":"SSG","노시환":"한화","노진혁":"롯데","대니엘":"KT","데일":"KIA","디아즈":"삼성","라일리":"NC","레이예스":"롯데","로건":"KT","로드리게스":"롯데","류지혁":"삼성","류진욱":"NC","류현인":"KT","류현진":"한화","문동주":"한화","문보경":"LG","문상철":"KT","문성주":"LG","문승원":"SSG","문정빈":"LG","문현빈":"한화","미야지":"삼성","박기호":"SSG","박동원":"LG","박명근":"LG","박민":"KIA","박민우":"NC","박상원":"한화","박상준":"KIA","박성한":"SSG","박세웅":"롯데","박세혁":"삼성","박수종":"키움","박승규":"삼성","박승욱":"롯데","박영현":"KT","박재현":"KIA","박정민":"롯데","박정우":"KIA","박정훈":"키움","박종훈":"SSG","박준순":"두산","박준우":"롯데","박준현":"키움","박지성":"키움","박지환":"SSG","박찬혁":"키움","박치국":"두산","박해민":"LG","배재환":"NC","배정대":"KT","배제성":"KT","배찬승":"삼성","백승건":"SSG","백정현":"삼성","베니지아노":"SSG","변우혁":"KIA","비슬리":"롯데","사우어":"KT","사토시":"삼성","서건창":"키움","서진용":"SSG","서호철":"NC","성영탁":"KIA","소형준":"KT","손동현":"KT","손성빈":"롯데","손주영":"LG","손주환":"NC","손호영":"롯데","송승기":"LG","송영진":"SSG","송찬의":"LG","스기모토":"KT","시라카와":"KIA","신민재":"LG","신민혁":"NC","심우준":"한화","안상현":"SSG","안우진":"키움","안재석":"두산","안중열":"NC","안치홍":"키움","안현민":"KT","알칸타라":"키움","양석환":"두산","양우현":"삼성","양의지":"두산","양창섭":"삼성","엄상백":"한화","에레디아":"SSG","에르난데스":"한화","오명진":"두산","오석주":"키움","오선우":"KIA","오선진":"키움","오스틴":"LG","오원석":"KT","오윤석":"KT","오장한":"NC","오재원":"한화","오지환":"LG","오태곤":"SSG","올러":"KIA","왕옌청":"한화","우강훈":"LG","우규민":"KT","원상현":"KT","원종현":"키움","원태인":"삼성","웰스":"LG","유강남":"롯데","유영찬":"LG","유토":"키움","육선엽":"삼성","윤도현":"KIA","윤동희":"롯데","윤산흠":"한화","윤성빈":"롯데","윤영철":"KIA","윤정빈":"삼성","이강민":"KT","이강준":"키움","이건욱":"SSG","이도윤":"한화","이로운":"SSG","이민우":"한화","이상규":"한화","이상동":"KT","이성규":"삼성","이승민":"삼성","이영하":"두산","이용규":"키움","이용찬":"두산","이우성":"NC","이원석":"한화","이의리":"KIA","이이무라":"롯데","이재학":"NC","이재현":"삼성","이정용":"LG","이주헌":"LG","이주형":"키움","이준영":"KIA","이지영":"SSG","이창진":"KIA","이형종":"키움","이호성":"삼성","임기영":"삼성","임병욱":"키움","임지열":"키움","임찬규":"LG","장두성":"롯데","장성우":"KT","장찬희":"삼성","장현식":"LG","잭로그":"두산","전민재":"롯데","전병우":"삼성","전사민":"NC","전상현":"KIA","전영준":"SSG","전용주":"KT","전의산":"SSG","전준우":"롯데","전준표":"키움","정수빈":"두산","정우주":"한화","정은원":"한화","정준재":"SSG","정철원":"롯데","정해영":"KIA","정현수":"롯데","조동욱":"한화","조병현":"SSG","조상우":"KIA","조수행":"두산","조형우":"SSG","주권":"KT","주현상":"한화","채은성":"한화","채현우":"SSG","천성호":"LG","천재환":"NC","최민석":"두산","최민준":"SSG","최성영":"NC","최승용":"두산","최원영":"LG","최원태":"삼성","최이준":"롯데","최인호":"한화","최재훈":"한화","최정":"SSG","최정원":"NC","최주환":"키움","최준용":"롯데","최준우":"SSG","최지광":"삼성","최지민":"KIA","최지훈":"SSG","최형우":"삼성","치리노스":"LG","카라스코":"LG","카스트로":"KIA","케네디":"LG","쿄야마":"롯데","타케다":"SSG","테일러":"NC","토다":"NC","톨허스트":"LG","페덱":"삼성","페라자":"한화","하영민":"키움","하재훈":"SSG","하준영":"NC","한동희":"롯데","한두솔":"SSG","한석현":"NC","한승택":"KT","한유섬":"SSG","한재승":"KIA","한준수":"KIA","한태양":"롯데","함덕주":"LG","해치":"SSG","허경민":"KT","허인서":"한화","홍건희":"KIA","홍대인":"SSG","홍민기":"롯데","홍창기":"LG","황대인":"KIA","황동하":"KIA","황성빈":"롯데","황영묵":"한화","황준서":"한화","후라도":"삼성","히우라":"키움","힐리어드":"KT"};
  const e=s=>typeof window.esc==='function'?window.esc(String(s??'')):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pitcherPos=pos=>/^(SP|RP|CP|P)$/i.test(String(pos||'').trim())||/(투수|선발|계투|마무리)/.test(String(pos||''));
  const nineAwakenable=p=>{
    try{if(typeof window.maxAwakening==='function')return Number(window.maxAwakening(p))===9}catch(e){}
    const t=String(p?.type||p?.cardType||'').replace(/\s+/g,'');
    return ['임팩트','시그니처','국가대표','골든글러브'].some(k=>t.includes(k));
  };
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
    const originalTeam=photoTeam(team);
    const currentTeam=activePhotoTeamByName[name]||'';
    const lookupTeam=currentTeam||originalTeam;
    const key=`${name}-${lookupTeam}`;
    if(!photoMap()[key]&&typeof window.__loadPlayerPhotoTeam==='function'){
      try{await window.__loadPlayerPhotoTeam(lookupTeam)}catch(err){console.warn('선수사진 팀 파일 로드 실패:',lookupTeam,err)}
    }
    if(photoMap()[key])return photoMap()[key];
    // Current-team image unavailable at runtime: preserve the original franchise photo.
    if(currentTeam&&originalTeam!==currentTeam){
      const oldKey=`${name}-${originalTeam}`;
      if(!photoMap()[oldKey]&&typeof window.__loadPlayerPhotoTeam==='function'){
        try{await window.__loadPlayerPhotoTeam(originalTeam)}catch(err){console.warn('기존 구단 선수사진 로드 실패:',originalTeam,err)}
      }
      return photoMap()[oldKey]||photoMap()[`${name}-${team}`]||null;
    }
    return photoMap()[`${name}-${team}`]||null;
  };

  window.playerPhotoHTML=function(p,cls='player-photo'){
    const custom=typeof window.customPlayerPhotoUrl==='function'?window.customPlayerPhotoUrl(p):'';
    if(custom)return `<div class="picker-photo-wrap ${nineAwakenable(p)?'awakening9-photo':''}"><img class="${cls} loaded" src="${e(custom)}" alt="${e(p?.name||'선수')} 사진"></div>`;
    return `<div class="picker-photo-wrap ${nineAwakenable(p)?'awakening9-photo':''}" data-player-photo-wrap="1" data-player-name="${e(p?.name||'')}" data-player-team="${e(p?.team||'')}" data-player-pos="${e(p?.pos||'')}" data-player-id="${e(p?.id||'')}"><img class="${cls}" alt="${e(p?.name||'선수')} 사진"><span class="photo-fallback">${e(p?.name||'선수')}</span></div>`;
  };

  window.gamePhotoHTML=function(p,compact=false){
    const custom=typeof window.customPlayerPhotoUrl==='function'?window.customPlayerPhotoUrl(p):'';
    const cls=compact?'lc-photo':'game-card-photo';
    const glow=nineAwakenable(p)?' awakening9-photo':'';
    if(custom)return `<div class="${cls}${glow}"><img class="loaded" src="${e(custom)}" alt="${e(p?.name||'선수')} 사진"></div>`;
    return `<div class="${cls}${glow}" data-player-photo-wrap="1" data-player-name="${e(p?.name||'')}" data-player-team="${e(p?.team||'')}" data-player-pos="${e(p?.pos||'')}" data-player-id="${e(p?.id||'')}"><img alt="${e(p?.name||'선수')} 사진"><span class="photo-fallback">${e(p?.name||'선수')}</span></div>`;
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


  /* v13.8: 선수사진을 조금 더 크게, 투명 컷아웃이 카드에 자연스럽게 보이도록 */
  const photoVisualStyle=document.createElement('style');
  photoVisualStyle.id='player-photo-visual-v138';
  photoVisualStyle.textContent=`
    /* 전체 카드 */
    .game-card-photo{
      left:7%!important;
      right:5%!important;
      top:42px!important;
      bottom:39px!important;
      background:transparent!important;
    }
    .game-card-photo img.loaded{
      width:100%!important;
      height:100%!important;
      object-fit:contain!important;
      object-position:center bottom!important;
      transform:scale(1.08)!important;
      transform-origin:center bottom!important;
      background:transparent!important;
      filter:none!important;
    }

    /* 라인업/벤치/투수 카드 */
    .lineup-card-shell .lc-photo{
      left:12%!important;
      right:7%!important;
      top:14px!important;
      bottom:22px!important;
      background:transparent!important;
    }
    .lineup-card-shell .lc-photo img.loaded{
      width:100%!important;
      height:100%!important;
      object-fit:contain!important;
      object-position:center bottom!important;
      transform:scale(1.10)!important;
      transform-origin:center bottom!important;
      background:transparent!important;
      filter:none!important;
    }

    /* 선수 선택창 */
    .picker-photo-wrap{
      width:78px!important;
      min-width:78px!important;
      height:96px!important;
    }
    .picker-photo-wrap:has(img.loaded){background:transparent!important}
    .picker-photo-wrap .player-photo.loaded{
      width:100%!important;
      height:100%!important;
      object-fit:contain!important;
      object-position:center bottom!important;
      transform:scale(1.05)!important;
      transform-origin:center bottom!important;
      background:transparent!important;
    }

    /* 이미지 뒤에 별도 흰/회색 박스가 생기지 않도록 */
    .game-card-photo,.lc-photo,.player-photo-wrap,
    .game-card-photo img,.lc-photo img,.player-photo{
      box-shadow:none!important;
    }

    @media (max-width:900px){
      .picker-photo-wrap{width:64px!important;min-width:64px!important;height:82px!important}
      .game-card-photo img.loaded{transform:scale(1.06)!important}
      .lineup-card-shell .lc-photo img.loaded{transform:scale(1.08)!important}
    }
  `;
  document.head.appendChild(photoVisualStyle);



  /* v13.9: 9각성 가능 카드 선수사진 흰색 아우라 */
  const awakeningGlowStyle=document.createElement('style');
  awakeningGlowStyle.id='awakening9-player-photo-glow-v139';
  awakeningGlowStyle.textContent=`
    .awakening9-photo{
      overflow:visible!important;
      isolation:isolate;
    }
    .awakening9-photo::before{
      content:"";
      position:absolute;
      left:12%;right:8%;top:12%;bottom:8%;
      border-radius:46%;
      background:radial-gradient(ellipse at 50% 54%,rgba(255,255,255,.88) 0%,rgba(255,255,255,.48) 34%,rgba(255,255,255,.18) 56%,rgba(255,255,255,0) 76%);
      filter:blur(5px);
      opacity:.88;
      z-index:0;
      pointer-events:none;
    }
    .awakening9-photo img.loaded{
      position:relative!important;
      z-index:1!important;
      filter:
        drop-shadow(0 0 1px rgba(255,255,255,1))
        drop-shadow(0 0 4px rgba(255,255,255,.98))
        drop-shadow(0 0 8px rgba(255,255,255,.82))!important;
    }
    .lineup-card-shell .awakening9-photo::before{
      left:8%;right:4%;top:8%;bottom:4%;
      filter:blur(3px);
      opacity:.92;
    }
    .lineup-card-shell .awakening9-photo img.loaded{
      filter:
        drop-shadow(0 0 1px #fff)
        drop-shadow(0 0 3px rgba(255,255,255,.98))
        drop-shadow(0 0 6px rgba(255,255,255,.88))!important;
    }
    .picker-photo-wrap.awakening9-photo::before{
      left:8%;right:8%;top:8%;bottom:5%;
      filter:blur(4px);
    }
    @media (max-width:900px){
      .awakening9-photo img.loaded{
        filter:
          drop-shadow(0 0 1px #fff)
          drop-shadow(0 0 3px rgba(255,255,255,.96))
          drop-shadow(0 0 6px rgba(255,255,255,.82))!important;
      }
    }
  `;
  document.head.appendChild(awakeningGlowStyle);

})();
