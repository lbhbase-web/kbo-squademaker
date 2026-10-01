(()=>{
  const css=`
    body.kbo-home-open{background:#f5f7fb!important;overflow:auto!important}
    body.kbo-home-open>.wrap,
    body.kbo-home-open>#viewToggle,
    body.kbo-home-open>#app-loading{display:none!important}
    #kboHomeDashboard{display:none}
    body.kbo-home-open #kboHomeDashboard{display:block}
    #kboHomeDashboard{min-height:100vh;background:linear-gradient(180deg,#f7f9fc 0%,#eef3f8 100%);color:#1f2937;font-family:system-ui,-apple-system,"Noto Sans KR","Malgun Gothic",sans-serif}
    .khome-nav{position:sticky;top:0;z-index:30000;height:64px;background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-bottom:1px solid #e7ebf1;display:flex;align-items:center;justify-content:space-between;padding:0 max(20px,calc((100vw - 1240px)/2));box-shadow:0 2px 14px rgba(37,53,76,.06)}
    .khome-brand{display:flex;align-items:center;gap:10px;font-weight:1000;font-size:24px;letter-spacing:-1px;color:#172033;white-space:nowrap}
    .khome-logo{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;color:#fff;font-size:13px;font-weight:1000;background:linear-gradient(135deg,#348cff,#7257e8);box-shadow:0 8px 22px rgba(65,111,232,.28)}
    .khome-menu{display:flex;align-items:center;gap:8px}
    .khome-menu button{border:0;background:transparent;color:#667085;font-size:13px;font-weight:800;padding:10px 12px;border-radius:10px;cursor:pointer}
    .khome-menu button:hover{background:#f0f5ff;color:#3478e5}
    .khome-start-small{background:#3f5f91!important;color:#fff!important;padding:10px 17px!important}
    .khome-main{max-width:1240px;margin:0 auto;padding:30px 20px 54px}
    .khome-hero{position:relative;overflow:hidden;min-height:250px;border-radius:24px;padding:38px 40px;display:flex;align-items:center;background:linear-gradient(125deg,#eef7ff 0%,#f8fbff 48%,#eef0ff 100%);border:1px solid #e3eaf4;box-shadow:0 15px 40px rgba(56,80,118,.08)}
    .khome-hero:before,.khome-hero:after{content:"";position:absolute;border-radius:999px;filter:blur(2px)}
    .khome-hero:before{width:280px;height:280px;right:-50px;top:-90px;background:rgba(63,139,255,.13)}
    .khome-hero:after{width:190px;height:190px;right:170px;bottom:-120px;background:rgba(125,89,232,.11)}
    .khome-hero-copy{position:relative;z-index:2;max-width:650px}
    .khome-eyebrow{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:#e8f2ff;color:#3678d6;font-size:11px;font-weight:900;margin-bottom:13px}
    .khome-hero h1{font-size:36px;line-height:1.14;letter-spacing:-1.6px;margin:0 0 13px;color:#172033}
    .khome-hero p{font-size:15px;line-height:1.7;color:#687386;margin:0 0 22px}
    .khome-primary{border:0;border-radius:12px;background:linear-gradient(135deg,#368cf5,#6657e8);color:#fff;font-size:14px;font-weight:900;padding:13px 22px;cursor:pointer;box-shadow:0 9px 20px rgba(74,104,224,.23)}
    .khome-primary:hover{transform:translateY(-1px)}
    .khome-section-title{display:flex;align-items:end;justify-content:space-between;margin:30px 2px 14px}
    .khome-section-title h2{margin:0;font-size:20px;letter-spacing:-.5px}.khome-section-title span{font-size:12px;color:#8a94a5}
    .khome-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
    .khome-card{position:relative;min-height:210px;background:rgba(255,255,255,.93);border:1px solid #e5eaf1;border-radius:20px;padding:25px 23px;cursor:pointer;text-align:left;box-shadow:0 10px 28px rgba(49,65,91,.06);transition:.16s transform,.16s box-shadow,.16s border-color}
    .khome-card:hover{transform:translateY(-3px);border-color:#cddbf0;box-shadow:0 15px 34px rgba(49,65,91,.11)}
    .khome-icon{width:58px;height:58px;border-radius:16px;display:grid;place-items:center;font-size:26px;margin-bottom:20px;background:linear-gradient(145deg,#eef5ff,#edf0f7);border:1px solid #dbe5f1;box-shadow:inset 0 0 18px rgba(65,126,211,.08)}
    .khome-card h3{margin:0 0 8px;font-size:18px;letter-spacing:-.45px;color:#242d3c}.khome-card p{margin:0;color:#7b8492;font-size:12px;line-height:1.65}
    .khome-arrow{position:absolute;right:20px;bottom:18px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#f1f5fa;color:#4483da;font-weight:1000;font-size:17px}
    .khome-note{margin-top:18px;padding:14px 16px;border-radius:14px;background:#fff;border:1px solid #e7ebf1;color:#7c8797;font-size:11px;line-height:1.6}
    #kboHomeButton{order:-10}
    @media(max-width:900px){
      .khome-nav{padding:0 16px}.khome-menu button:not(.khome-start-small){display:none}.khome-brand{font-size:21px}
      .khome-main{padding:18px 14px 38px}.khome-hero{min-height:220px;padding:28px 24px;border-radius:18px}.khome-hero h1{font-size:29px}
      .khome-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.khome-card{min-height:185px;padding:21px 18px}.khome-icon{width:52px;height:52px;margin-bottom:15px}
    }
    @media(max-width:520px){
      .khome-nav{height:58px}.khome-logo{width:32px;height:32px}.khome-brand{font-size:18px}.khome-start-small{padding:8px 12px!important;font-size:12px!important}
      .khome-hero{padding:23px 19px;min-height:210px}.khome-hero h1{font-size:25px}.khome-hero p{font-size:13px}.khome-grid{grid-template-columns:1fr 1fr;gap:10px}
      .khome-card{min-height:170px;border-radius:16px;padding:18px 15px}.khome-card h3{font-size:15px}.khome-card p{font-size:11px}.khome-icon{width:46px;height:46px;font-size:22px}.khome-arrow{width:29px;height:29px}
    }
  `;

  const style=document.createElement('style');
  style.id='kbo-home-dashboard-style-v142';
  style.textContent=css;
  document.head.appendChild(style);

  document.body.classList.add('kbo-home-open');

  const home=document.createElement('div');
  home.id='kboHomeDashboard';
  home.innerHTML=`
    <header class="khome-nav">
      <div class="khome-brand"><span class="khome-logo">V26</span><span>KBO SquadMaker</span></div>
      <nav class="khome-menu" aria-label="홈 메뉴">
        <button type="button" data-home-action="squad">스쿼드 메이커</button>
        <button type="button" data-home-action="skills">스킬·육성</button>
        <button type="button" data-home-action="lineups">내 라인업</button>
        <button type="button" data-home-action="patch">패치 노트</button>
        <button class="khome-start-small" type="button" data-home-action="squad">시작하기</button>
      </nav>
    </header>
    <main class="khome-main">
      <section class="khome-hero">
        <div class="khome-hero-copy">
          <span class="khome-eyebrow">⚾ 컴프야V26 팬메이드 도구</span>
          <h1>원하는 선수로<br>나만의 KBO 스쿼드를 만들어보세요.</h1>
          <p>선수 카드 선택부터 세트덱·육성·스킬·특훈·불펜 전술까지 한 화면에서 구성할 수 있어요.</p>
          <button class="khome-primary" type="button" data-home-action="squad">스쿼드 만들기 →</button>
        </div>
      </section>

      <div class="khome-section-title"><h2>바로가기</h2><span>원하는 기능을 선택하세요</span></div>
      <section class="khome-grid">
        <button class="khome-card" type="button" data-home-action="squad">
          <span class="khome-icon">⚾</span><h3>스쿼드 메이커</h3><p>타자·투수를 배치하고 세트덱과 최종 능력치를 확인합니다.</p><span class="khome-arrow">→</span>
        </button>
        <button class="khome-card" type="button" data-home-action="skills">
          <span class="khome-icon">🎯</span><h3>스킬·육성</h3><p>선수별 스킬, 훈련, 각성, 포지션 특훈을 설정합니다.</p><span class="khome-arrow">→</span>
        </button>
        <button class="khome-card" type="button" data-home-action="lineups">
          <span class="khome-icon">☁️</span><h3>내 라인업</h3><p>Google 계정으로 저장한 라인업을 불러오고 관리합니다.</p><span class="khome-arrow">→</span>
        </button>
        <button class="khome-card" type="button" data-home-action="patch">
          <span class="khome-icon">📝</span><h3>패치 노트</h3><p>새로 추가된 선수와 기능, 변경사항을 확인합니다.</p><span class="khome-arrow">→</span>
        </button>
      </section>
      <div class="khome-note">이 홈 화면은 사이트에 들어올 때마다 먼저 표시됩니다. 스쿼드 화면 오른쪽 위의 <b>홈</b> 버튼으로 언제든 돌아올 수 있어요.</div>
    </main>`;
  document.body.prepend(home);

  function enterApp(){
    document.body.classList.remove('kbo-home-open');
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }
  function showHome(){
    document.body.classList.add('kbo-home-open');
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }
  window.openKboHome=showHome;
  window.enterKboSquadMaker=enterApp;

  function action(name){
    enterApp();
    if(name==='lineups'){
      setTimeout(()=>{
        const account=document.getElementById('cloudAccountBtn');
        const login=document.getElementById('cloudLoginBtn');
        if(account && !account.hidden) account.click(); else if(login) login.click();
      },250);
    }else if(name==='patch'){
      setTimeout(()=>{
        try{window.toggleRefPanel?.('refPatchPanel')}catch(e){}
        document.getElementById('refPatchPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
      },250);
    }else if(name==='skills'){
      setTimeout(()=>{
        document.querySelector('.ref-actionbar')?.scrollIntoView({behavior:'smooth',block:'center'});
      },180);
    }
  }
  home.addEventListener('click',e=>{
    const btn=e.target.closest('[data-home-action]');
    if(btn) action(btn.dataset.homeAction);
  });

  const addHomeButton=()=>{
    const bar=document.querySelector('.toolbar');
    if(!bar || document.getElementById('kboHomeButton')) return;
    const b=document.createElement('button');
    b.id='kboHomeButton'; b.className='btn'; b.type='button'; b.textContent='홈'; b.onclick=showHome;
    bar.prepend(b);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addHomeButton,{once:true}); else addHomeButton();
})();
