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
    .khome-google-auth{display:flex!important;align-items:center;gap:7px!important;border:1px solid #d9e0ea!important;background:#fff!important;color:#344256!important;padding:9px 12px!important}
    .khome-google-auth:hover{background:#f6f9fc!important;color:#2367b1!important}
    .khome-google-auth.signed-in{background:#f4f8ff!important;border-color:#c8d9f1!important}
    .khome-google-auth img{width:22px;height:22px;border-radius:50%;object-fit:cover}
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

    .khome-tool-badge{position:absolute;right:18px;top:18px;padding:4px 8px;border-radius:999px;background:#fff1bf;color:#a36a00;font-size:9px;font-weight:1000;letter-spacing:.3px}
    .khome-icon.blue{background:linear-gradient(145deg,#e9f3ff,#e7efff);color:#367fe8}
    .khome-icon.purple{background:linear-gradient(145deg,#f0eaff,#ece5ff);color:#7a4ee8}
    .khome-icon.green{background:linear-gradient(145deg,#e5fbf2,#e2f7f4);color:#159f83}
    .khome-icon.orange{background:linear-gradient(145deg,#fff1e8,#ffecdd);color:#ed7a25}
    .khome-modal-backdrop{position:fixed;inset:0;z-index:40000;background:rgba(20,28,40,.46);display:none;align-items:center;justify-content:center;padding:18px}
    .khome-modal-backdrop.open{display:flex}
    .khome-modal{width:min(860px,100%);max-height:min(760px,90vh);overflow:auto;background:#fff;border-radius:22px;border:1px solid #e2e8f0;box-shadow:0 28px 80px rgba(17,32,57,.28);padding:22px}
    .khome-modal-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:17px}
    .khome-modal-head h3{font-size:21px;margin:0;color:#202938}
    .khome-close{border:0;width:36px;height:36px;border-radius:50%;background:#f2f5f9;color:#516173;font-size:18px;font-weight:1000;cursor:pointer}
    .khome-field{margin:13px 0}.khome-field label{display:block;font-size:11px;font-weight:900;color:#657386;margin-bottom:6px}
    .khome-field select,.khome-field input{width:100%;border:1px solid #d7dfe9;border-radius:11px;background:#fff;color:#253244;padding:11px 12px;font-size:13px}
    .khome-check{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:11px;background:#f6f8fb;border:1px solid #e5eaf0;font-size:12px;color:#526174}
    .khome-check input{width:auto}
    .khome-roll{width:100%;border:0;border-radius:12px;background:linear-gradient(135deg,#3d8ef0,#6e59e5);color:#fff;font-weight:1000;padding:12px 14px;cursor:pointer;margin-top:7px}
    .khome-result{margin-top:15px;border:1px solid #e3e8ef;background:#f9fbfd;border-radius:15px;padding:14px}
    .khome-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .khome-slot{padding:13px 8px;border-radius:12px;text-align:center;background:#fff;border:1px solid #dfe6ef}
    .khome-slot small{display:block;color:#8a96a7;font-size:9px;margin-bottom:5px}.khome-slot b{font-size:14px}
    .grade-major{color:#8b45e8}.grade-minor{color:#2476d7}.grade-rookie{color:#168f70}.grade-amateur{color:#7a8798}.grade-fixed{color:#4f5968}
    .khome-prob-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:12px}
    .khome-prob{padding:10px 6px;border-radius:10px;background:#f5f7fa;text-align:center;font-size:10px;color:#6c7888}.khome-prob b{display:block;font-size:14px;margin-bottom:2px;color:#26364a}
    .khome-calc-value{font-size:28px;font-weight:1000;color:#397fe6;margin:3px 0}
    .khome-table{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px}.khome-table th,.khome-table td{border-bottom:1px solid #e8ecf2;padding:10px 8px;text-align:center}.khome-table th{background:#f6f8fb;color:#667487;font-weight:900}.khome-table td:first-child{text-align:left;font-weight:800;color:#354255}
    .khome-tip{font-size:10px;line-height:1.6;color:#7b8796;margin-top:11px}


    .sim-config{display:grid;gap:12px}
    .sim-panel{border:1px solid #e3e8ef;background:#f8fafc;border-radius:16px;padding:15px}
    .sim-panel-title{font-size:13px;font-weight:1000;color:#344256;margin-bottom:5px}
    .sim-panel-help{font-size:10px;color:#8b96a6;margin-bottom:11px}
    .sim-pills{display:flex;flex-wrap:wrap;gap:8px}
    .sim-pill{
      min-width:92px;border:1px solid #d8e0e9;background:#fff;color:#344256;
      border-radius:999px;padding:11px 16px;font-size:12px;font-weight:900;
      cursor:pointer;box-shadow:0 2px 8px rgba(34,52,77,.04)
    }
    .sim-pill:hover{border-color:#aebed1;background:#f7f9fc}
    .sim-pill.selected{
      background:linear-gradient(135deg,#26364d,#3b4d69);
      border-color:#26364d;color:#fff;box-shadow:0 7px 16px rgba(38,54,77,.18)
    }
    .sim-pill[disabled]{opacity:.4;cursor:not-allowed}
    .sim-summary{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
    .sim-summary span{padding:5px 8px;border-radius:999px;background:#eef3f8;color:#58677b;font-size:9px;font-weight:900}
    .sim-action-row{display:flex;justify-content:flex-end;margin-top:4px}
    .sim-action-row .khome-roll{width:auto;min-width:160px;padding:12px 22px}
    .sim-hidden{display:none!important}
    .sim-lock-box{margin-top:10px;padding:12px;border-radius:12px;border:1px dashed #ccd6e2;background:#fff}
    @media(max-width:650px){
      .sim-pill{min-width:calc(50% - 5px);padding:10px 9px}
      .sim-action-row .khome-roll{width:100%}
      .khome-modal{padding:16px}
    }


    .sim-skill-result{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
    .sim-skill-card{min-height:112px;border:1px solid #e0e7ef;background:#fff;border-radius:14px;padding:12px;text-align:center}
    .sim-skill-card small{display:block;color:#8b96a6;font-size:9px;margin-bottom:6px}
    .sim-skill-tier{display:inline-block;font-size:9px;font-weight:1000;padding:3px 7px;border-radius:999px;margin-bottom:7px;background:#f1f4f8}
    .sim-skill-name{font-size:13px;font-weight:1000;color:#26364a;line-height:1.35;min-height:36px;display:flex;align-items:center;justify-content:center}
    .sim-skill-lv{font-size:15px;font-weight:1000;margin-top:6px;color:#44556c}
    .sim-fixed-select{display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:8px}
    .sim-fixed-select select{width:100%;border:1px solid #d7dfe9;border-radius:10px;background:#fff;color:#253244;padding:10px;font-size:11px}
    .sim-level-note{font-size:9px;color:#8995a5;line-height:1.5;margin-top:7px}
    @media(max-width:650px){
      .sim-skill-result{grid-template-columns:1fr}
      .sim-skill-card{min-height:88px}
      .sim-fixed-select{grid-template-columns:1fr}
    }

    .skill-grade-box{
      margin-top:12px;padding:14px;border-radius:15px;background:#f8fafc;
      border:1px solid #dfe6ef
    }
    .skill-grade-input-row{display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:9px;align-items:end}
    .skill-grade-input-row label{font-size:10px;font-weight:900;color:#647286}
    .skill-grade-input-row input{
      width:100%;box-sizing:border-box;margin-top:6px;border:1px solid #ccd6e2;
      border-radius:11px;background:#fff;color:#26364a;padding:11px 12px;font-size:14px;font-weight:900
    }
    .skill-grade-badge{
      min-height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;
      font-size:23px;font-weight:1000;letter-spacing:-.5px;border:1px solid #dce3ec;background:#fff
    }
    .grade-srp{color:#7b2cbf;background:#f4e9ff;border-color:#d8b7f4}
    .grade-ss{color:#d62828;background:#fff0f0;border-color:#f2b8b8}
    .grade-s{color:#e67700;background:#fff5e6;border-color:#ffd49a}
    .grade-a{color:#16803a;background:#edf9f0;border-color:#bce5c7}
    .grade-b{color:#1769aa;background:#edf6ff;border-color:#bad8ef}
    .grade-c{color:#667085;background:#f3f4f6;border-color:#d7dbe0}
    .skill-grade-cuts{
      margin-top:10px;display:grid;grid-template-columns:repeat(5,1fr);gap:6px
    }
    .skill-grade-cut{
      padding:8px 5px;border-radius:9px;background:#fff;border:1px solid #e2e8f0;
      text-align:center;font-size:9px;color:#7a8798
    }
    .skill-grade-cut b{display:block;margin-bottom:2px;color:#314158;font-size:12px}
    .skill-grade-note{margin-top:8px;color:#8490a0;font-size:9px;line-height:1.55}
    @media(max-width:650px){
      .skill-grade-input-row{grid-template-columns:1fr}
      .skill-grade-cuts{grid-template-columns:repeat(3,1fr)}
    }


    .sim-skill-score{
      margin-top:5px;font-size:10px;font-weight:900;color:#66778c
    }
    .sim-roll-grade{
      margin-top:12px;border:1px solid #dce4ee;border-radius:16px;background:#f8fafc;
      padding:14px;display:grid;grid-template-columns:minmax(0,1fr) 135px;gap:12px;align-items:center
    }
    .sim-roll-grade-main small{display:block;color:#8491a2;font-size:9px;margin-bottom:4px}
    .sim-roll-grade-score{font-size:24px;font-weight:1000;color:#26364a;letter-spacing:-.6px}
    .sim-roll-grade-score em{font-style:normal;font-size:10px;color:#8894a4;margin-left:5px;font-weight:800}
    .sim-roll-grade-badge{
      min-height:60px;border-radius:14px;display:flex;flex-direction:column;align-items:center;
      justify-content:center;border:1px solid #d9e1ea;background:#fff;font-size:26px;font-weight:1000
    }
    .sim-roll-grade-badge small{font-size:9px;margin-bottom:3px;opacity:.72}
    .sim-grade-cuts-mini{margin-top:9px;display:flex;flex-wrap:wrap;gap:5px}
    .sim-grade-cuts-mini span{font-size:8px;padding:4px 6px;border-radius:999px;background:#fff;border:1px solid #e1e7ef;color:#718096}
    .sim-score-warning{margin-top:7px;font-size:9px;line-height:1.5;color:#8793a3}
    @media(max-width:650px){
      .sim-roll-grade{grid-template-columns:1fr 105px}
      .sim-roll-grade-score{font-size:21px}
    }

    #kboHomeButton{order:-10}
    @media(max-width:900px){
      .khome-nav{padding:0 16px}.khome-menu button:not(.khome-start-small):not(.khome-google-auth){display:none}.khome-brand{font-size:21px}
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
  style.id='kbo-home-dashboard-style-v150';
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
        <button id="khomeGoogleLoginBtn" class="khome-google-auth" type="button" data-home-action="googleAuth">Google 로그인</button>
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
      <div class="khome-section-title"><h2>스킬 도구</h2><span>원하는 기능을 바로 선택하세요</span></div>
      <section class="khome-grid">
        <button class="khome-card" type="button" data-home-action="normalRoll">
          <span class="khome-tool-badge">NEW</span><span class="khome-icon blue">🎲</span><h3>일스변 시뮬레이터</h3><p>일반 스킬 변경권의 등급 확률로 3옵션을 시뮬레이션합니다.</p><span class="khome-arrow">→</span>
        </button>
        <button class="khome-card" type="button" data-home-action="advancedRoll">
          <span class="khome-tool-badge">NEW</span><span class="khome-icon purple">✨</span><h3>고스변 시뮬레이터</h3><p>1옵 메이저 확정과 고급 스킬 변경권 확률을 그대로 적용합니다.</p><span class="khome-arrow">→</span>
        </button>
        <button class="khome-card" type="button" data-home-action="majorCalc">
          <span class="khome-icon green">📊</span><h3>메이저 확률 계산기</h3><p>여러 번 변경했을 때 2·3옵에서 메이저가 등장할 누적 확률을 계산합니다.</p><span class="khome-arrow">→</span>
        </button>
        <button class="khome-card" type="button" data-home-action="oddsTable">
          <span class="khome-icon orange">%</span><h3>스킬 변경 확률표</h3><p>일스변과 고스변의 등급별 등장 확률과 1옵 규칙을 한눈에 확인합니다.</p><span class="khome-arrow">→</span>
        </button>
      </section>

      <div id="khomeToolModal" class="khome-modal-backdrop" aria-hidden="true">
        <div class="khome-modal" role="dialog" aria-modal="true">
          <div class="khome-modal-head"><h3 id="khomeModalTitle">도구</h3><button class="khome-close" type="button" data-modal-close>×</button></div>
          <div id="khomeModalBody"></div>
        </div>
      </div>

      <div class="khome-note">홈에서 일스변·고스변 등 스킬 도구를 바로 사용할 수 있어요. 스쿼드 화면의 <b>홈</b> 버튼이나 뒤로가기로 언제든 돌아올 수 있습니다.</div>
    </main>`;
  document.body.prepend(home);

  const HOME_STATE='home';
  const APP_STATE='app';

  const baseUrl=()=>location.pathname+location.search;

  function enterApp(pushHistory=true){
    if(pushHistory && history.state?.kboView!==APP_STATE){
      history.pushState({...(history.state||{}),kboView:APP_STATE},'',baseUrl()+'#squad');
    }
    document.body.classList.remove('kbo-home-open');
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }

  function showHome(fromHistory=false){
    // 스쿼드 화면에서 '홈' 버튼을 누른 경우에도 브라우저 뒤로가기와
    // 동일한 히스토리 흐름을 사용해 중복 홈 기록이 쌓이지 않게 한다.
    if(!fromHistory && history.state?.kboView===APP_STATE){
      history.back();
      return;
    }
    document.body.classList.add('kbo-home-open');
    window.scrollTo({top:0,left:0,behavior:'instant'});
    if(!fromHistory && history.state?.kboView!==HOME_STATE){
      history.replaceState({...(history.state||{}),kboView:HOME_STATE},'',baseUrl());
    }
  }

  // 사이트 최초 진입은 홈 상태로 고정한다.
  history.replaceState({...(history.state||{}),kboView:HOME_STATE},'',baseUrl());

  // Android/Chrome/브라우저 뒤로가기:
  // 스쿼드 화면 -> 홈 화면, 다시 뒤로가기 -> 이전 사이트/탭 기록.
  window.addEventListener('popstate',e=>{
    if(e.state?.kboView===APP_STATE){
      enterApp(false);
    }else{
      showHome(true);
    }
  });

  window.openKboHome=()=>showHome(false);
  window.enterKboSquadMaker=()=>enterApp(true);

  const normalOdds={메이저:7,마이너:23,루키:40,아마추어:30};
  const advancedOdds={메이저:17,마이너:30,루키:28,아마추어:25};
  const gradeClass=g=>g==='메이저'?'grade-major':g==='마이너'?'grade-minor':g==='루키'?'grade-rookie':g==='아마추어'?'grade-amateur':'grade-fixed';
  const drawGrade=odds=>{
    const n=Math.random()*100; let acc=0;
    for(const [grade,p] of Object.entries(odds)){acc+=p;if(n<acc)return grade}
    return '아마추어';
  };
  const modal=document.getElementById('khomeToolModal');
  const modalTitle=document.getElementById('khomeModalTitle');
  const modalBody=document.getElementById('khomeModalBody');
  const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};
  modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-modal-close]'))closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
  const openModal=(title,html)=>{modalTitle.textContent=title;modalBody.innerHTML=html;modal.classList.add('open');modal.setAttribute('aria-hidden','false')};
  const oddsBoxes=odds=>`<div class="khome-prob-grid">${Object.entries(odds).map(([g,p])=>`<div class="khome-prob"><b>${p}%</b>${g}</div>`).join('')}</div>`;
  const slotsHtml=grades=>`<div class="khome-slots">${grades.map((g,i)=>`<div class="khome-slot"><small>${i+1}옵션</small><b class="${gradeClass(g)}">${g}</b></div>`).join('')}</div>`;

  const pillGroup=(id,items,selected)=>`<div class="sim-pills" id="${id}">${items.map(x=>`<button type="button" class="sim-pill ${x.value===selected?'selected':''}" data-value="${x.value}">${x.label}</button>`).join('')}</div>`;
  const bindPills=(id,onChange)=>{
    const group=modalBody.querySelector('#'+id);
    if(!group)return;
    group.addEventListener('click',e=>{
      const btn=e.target.closest('.sim-pill'); if(!btn||btn.disabled)return;
      group.querySelectorAll('.sim-pill').forEach(b=>b.classList.toggle('selected',b===btn));
      onChange?.(btn.dataset.value,btn);
    });
  };
  const selectedPill=id=>modalBody.querySelector(`#${id} .sim-pill.selected`)?.dataset.value||'';

  // v14.8: 카드/보직별 고스변 스킬점수 등급 컷.
  // SR+ 상위 0.1%, SS 0.5%, S 1.5%, A 5%, B 12%, B 미만 C.
  const SKILL_GRADE_CUTS={
    batter_fielder:{
      signature:{srp:51.36,ss:45.96,s:41.36,a:35.47,b:30.82,scope:'3스킬 총합'},
      gold:{srp:56.25,ss:49.96,s:45.04,a:38.72,b:33.19,scope:'3스킬 총합'},
      national:{srp:53.42,ss:47.74,s:43.44,a:37.54,b:32.53,scope:'3스킬 총합'},
      impact:{srp:35.10,ss:28.78,s:24.96,a:21.15,b:15.32,scope:'2·3옵 합계'}
    },
    batter_catcher:{
      signature:{srp:51.10,ss:45.69,s:41.13,a:35.23,b:30.62,scope:'3스킬 총합'},
      gold:{srp:56.02,ss:49.68,s:44.86,a:38.38,b:32.99,scope:'3스킬 총합'},
      national:{srp:53.16,ss:47.59,s:43.24,a:37.29,b:32.31,scope:'3스킬 총합'},
      impact:{srp:34.86,ss:28.36,s:24.93,a:20.97,b:15.18,scope:'2·3옵 합계'}
    },
    sp:{
      signature:{srp:49.92,ss:44.71,s:39.97,a:34.63,b:29.80,scope:'3스킬 총합'},
      gold:{srp:55.42,ss:49.34,s:44.05,a:37.61,b:32.21,scope:'3스킬 총합'},
      national:{srp:53.06,ss:47.32,s:42.83,a:36.96,b:32.14,scope:'3스킬 총합'},
      impact:{srp:33.28,ss:28.35,s:24.12,a:19.52,b:15.69,scope:'2·3옵 합계'}
    },
    rp:{
      signature:{srp:52.46,ss:46.98,s:41.80,a:36.06,b:30.83,scope:'3스킬 총합'},
      gold:{srp:57.67,ss:51.15,s:45.52,a:38.80,b:32.94,scope:'3스킬 총합'},
      national:{srp:54.84,ss:48.89,s:44.16,a:38.05,b:32.92,scope:'3스킬 총합'},
      impact:{srp:35.81,ss:29.87,s:25.63,a:20.23,b:15.99,scope:'2·3옵 합계'}
    },
    cp:{
      signature:{srp:51.52,ss:46.19,s:41.22,a:35.45,b:30.44,scope:'3스킬 총합'},
      gold:{srp:56.65,ss:50.54,s:44.83,a:38.22,b:32.54,scope:'3스킬 총합'},
      national:{srp:54.17,ss:48.26,s:43.66,a:37.51,b:32.62,scope:'3스킬 총합'},
      impact:{srp:33.95,ss:29.42,s:25.48,a:19.73,b:15.77,scope:'2·3옵 합계'}
    }
  };
  const gradeTargetKey=(target,batterType)=>target==='batter'
    ? `batter_${batterType==='catcher'?'catcher':'fielder'}`
    : target;
  const gradeCutFor=(target,batterType,cardType)=>{
    const key=gradeTargetKey(target,batterType);
    return SKILL_GRADE_CUTS[key]?.[cardType]||null;
  };
  const skillGradeFor=(score,cut)=>{
    const n=Number(score);
    if(!cut||!Number.isFinite(n))return '';
    if(n>=cut.srp)return 'SR+';
    if(n>=cut.ss)return 'SS';
    if(n>=cut.s)return 'S';
    if(n>=cut.a)return 'A';
    if(n>=cut.b)return 'B';
    return 'C';
  };
  const gradeCss=g=>g==='SR+'?'grade-srp':g==='SS'?'grade-ss':g==='S'?'grade-s':g==='A'?'grade-a':g==='B'?'grade-b':'grade-c';
  const gradeCutHtml=cut=>cut?`
    <div class="skill-grade-cuts">
      <div class="skill-grade-cut"><b>SR+ ${cut.srp.toFixed(2)}</b>상위 0.1%</div>
      <div class="skill-grade-cut"><b>SS ${cut.ss.toFixed(2)}</b>상위 0.5%</div>
      <div class="skill-grade-cut"><b>S ${cut.s.toFixed(2)}</b>상위 1.5%</div>
      <div class="skill-grade-cut"><b>A ${cut.a.toFixed(2)}</b>상위 5%</div>
      <div class="skill-grade-cut"><b>B ${cut.b.toFixed(2)}</b>상위 12%</div>
    </div>`:'';
  const gradeBoxHtml=(id,cut)=>`
    <div class="skill-grade-box" id="${id}Box">
      <div class="skill-grade-input-row">
        <label>총 스킬점수
          <input id="${id}Score" type="number" min="0" step="0.01" inputmode="decimal" placeholder="${cut?.scope||'점수'} 입력">
        </label>
        <div class="skill-grade-badge grade-c" id="${id}Badge">—</div>
      </div>
      <div id="${id}Cuts">${gradeCutHtml(cut)}</div>
      <div class="skill-grade-note" id="${id}Note">${cut?`판정 점수: ${cut.scope}. B컷보다 낮으면 전부 C등급.`:'이 카드/보직은 현재 등급컷 계산 대상이 아닙니다.'}</div>
    </div>`;
  const bindGradeBox=(id,getCut)=>{
    const input=modalBody.querySelector('#'+id+'Score');
    const badge=modalBody.querySelector('#'+id+'Badge');
    const cuts=modalBody.querySelector('#'+id+'Cuts');
    const note=modalBody.querySelector('#'+id+'Note');
    const box=modalBody.querySelector('#'+id+'Box');
    if(!input||!badge||!cuts||!note||!box)return ()=>{};
    const refresh=()=>{
      const cut=getCut();
      box.style.display=cut?'block':'none';
      if(!cut)return;
      cuts.innerHTML=gradeCutHtml(cut);
      note.textContent=`판정 점수: ${cut.scope}. B컷보다 낮으면 전부 C등급.`;
      const g=skillGradeFor(input.value,cut);
      badge.textContent=g||'—';
      badge.className='skill-grade-badge '+(g?gradeCss(g):'grade-c');
    };
    input.addEventListener('input',refresh);
    refresh();
    return refresh;
  };


  // v15.0: 사용자 제공 CPBV-LAB 스킬점수표의 Lv5~8 전체 데이터 사용.
  const SKILL_SCORE_CARD_OVERRIDES={
    impact:{
      batter:{m_challenge_B:[13.85,16.25,null,null],m_spirit_B:[10.08,11.52,null,null]},
      sp:{m_challenge_P:[13.80,16.20,null,null],m_spirit_P:[15.96,18.24,null,null]},
      rp:{m_challenge_P:[13.80,16.20,null,null],m_spirit_P:[16.80,19.20,null,null]},
      cp:{m_challenge_P:[13.80,16.20,null,null],m_spirit_P:[16.80,19.20,null,null]}
    },
    gold:{
      batter:{m_spirit_B:[1.68,1.92,null,null]},
      sp:{m_spirit_P:[8.06,9.22,null,null]},
      rp:{m_spirit_P:[8.06,9.22,null,null]},
      cp:{m_spirit_P:[8.06,9.22,null,null]}
    },
    national:{
      batter:{m_spirit_B:[4.20,4.80,5.40,6.00]},
      sp:{m_spirit_P:[4.20,4.80,5.40,6.00]},
      rp:{m_spirit_P:[4.20,4.80,5.40,6.00]},
      cp:{m_spirit_P:[4.20,4.80,5.40,6.00]}
    },
    signature:{
      batter:{m_spirit_B:[3.36,3.84,null,null]},
      sp:{m_spirit_P:[10.75,12.29,null,null]},
      rp:{m_spirit_P:[13.61,15.55,null,null]},
      cp:{m_spirit_P:[13.61,15.55,null,null]}
    }
  };

  const scoreForSkill=(x,target,card)=>{
    if(!x)return null;
    const level=Number(x.level);
    const idx=level-5;
    if(idx<0||idx>3)return null;
    const override=SKILL_SCORE_CARD_OVERRIDES?.[card]?.[target]?.[x.id];
    const base=window.__KBO_SKILL_SCORE_DB__?.[target]?.[x.id];
    const values=override||base;
    if(!values)return null;
    const v=values[idx];
    return v==null?null:Number(v);
  };

  const gradeResultHtml=(rows,target,batterType,card)=>{
    const cut=gradeCutFor(target,batterType,card);
    if(!cut) return `<div class="sim-score-warning">LIVE / LIVE 올스타는 현재 자동 등급 판정 대상에서 제외돼요.</div>`;

    const scores=rows.map(x=>scoreForSkill(x,target,card));
    const useIndexes=card==='impact'?[1,2]:[0,1,2];
    const missing=useIndexes.some(i=>scores[i]==null);
    if(missing){
      return `<div class="sim-score-warning">이 조합에는 아직 점수표에 없는 조건이 포함되어 있어 자동 등급을 계산하지 못했어요.</div>`;
    }

    const total=useIndexes.reduce((a,i)=>a+Number(scores[i]||0),0);
    const grade=skillGradeFor(total,cut);
    const scope=card==='impact'?'2·3옵 판정 점수':'총 스킬 점수';
    return `
      <div class="sim-roll-grade">
        <div class="sim-roll-grade-main">
          <small>${scope}</small>
          <div class="sim-roll-grade-score">${total.toFixed(2)}<em>점</em></div>
          <div class="sim-grade-cuts-mini">
            <span>SR+ ${cut.srp.toFixed(2)}</span><span>SS ${cut.ss.toFixed(2)}</span>
            <span>S ${cut.s.toFixed(2)}</span><span>A ${cut.a.toFixed(2)}</span><span>B ${cut.b.toFixed(2)}</span>
          </div>
        </div>
        <div class="sim-roll-grade-badge ${gradeCss(grade)}"><small>등급</small>${grade}</div>
      </div>`;
  };

  const skillCatalog=()=>window.__KBO_SKILL_SIM_CATALOG__||[];
  const targetPos=(target,batterType)=>{
    if(target==='sp')return 'SP';
    if(target==='rp')return 'RP';
    if(target==='cp')return 'CP';
    return batterType==='catcher'?'C':'CF';
  };
  const roleAllowed=(d,pos)=>{
    if(d.role==='B')return !['SP','RP','CP'].includes(pos);
    if(d.role==='P')return ['SP','RP','CP'].includes(pos);
    if(d.role==='R')return ['RP','CP'].includes(pos);
    if(d.role==='SR')return ['SP','RP'].includes(pos);
    return pos===d.role;
  };
  const skillPool=(target,batterType,cardType,tier)=>{
    const pos=targetPos(target,batterType);
    return skillCatalog().filter(d=>{
      if(d.tier==='national'&&cardType!=='national')return false;
      if(tier&&d.tier!==tier)return false;
      return roleAllowed(d,pos);
    });
  };
  const cardCaps=(cardType,allstarYear='26')=>{
    if(cardType==='live')return [7,7,7];
    if(cardType==='allstar')return allstarYear==='26'?[8,7,7]:[7,6,6];
    if(cardType==='gold')return [6,6,6];
    return [6,5,5];
  };
  const tierLabel={national:'국가대표',major:'메이저',minor:'마이너',rookie:'루키',amateur:'아마추어'};
  const tierColor={national:'#c62828',major:'#8e24aa',minor:'#1565c0',rookie:'#238636',amateur:'#6b7280'};
  const randomSkill=(target,batterType,cardType,tier,used)=>{
    const pool=skillPool(target,batterType,cardType,tier).filter(d=>!used.has(d.id));
    if(!pool.length)return null;
    return pool[Math.floor(Math.random()*pool.length)];
  };
  const randomHighGradeSkill=(target,batterType,cardType,used)=>{
    const tiers=cardType==='national'?['major','national']:['major'];
    const pool=tiers.flatMap(t=>skillPool(target,batterType,cardType,t)).filter(d=>!used.has(d.id));
    if(!pool.length)return null;
    return pool[Math.floor(Math.random()*pool.length)];
  };
  const skillResultHtml=(rows,target='',card='')=>`<div class="sim-skill-result">${rows.map((x,i)=>{const sc=x?scoreForSkill(x,target,card):null;return `<div class="sim-skill-card"><small>${i+1}옵션</small>${x?`<span class="sim-skill-tier" style="color:${tierColor[x.tier]||'#667'}">[${tierLabel[x.tier]||x.tier}]</span><div class="sim-skill-name">${x.name}</div><div class="sim-skill-lv">Lv ${x.level}</div>${sc!=null?`<div class="sim-skill-score">${sc.toFixed(2)}점</div>`:''}`:`<div class="sim-skill-name">-</div>`}</div>`}).join('')}</div>`;
  const fixedSkillOptions=(target,batterType,cardType)=>{
    const order=['national','major','minor','rookie','amateur'];
    return order.map(t=>{
      const list=skillPool(target,batterType,cardType,t);
      if(!list.length)return '';
      return `<optgroup label="${tierLabel[t]}">${list.map(d=>`<option value="${d.id}" data-tier="${d.tier}">${d.name}</option>`).join('')}</optgroup>`;
    }).join('');
  };

  function showNormalRoll(){
    const targetItems=[
      {value:'batter',label:'타자'},{value:'sp',label:'선발'},{value:'rp',label:'중계'},{value:'cp',label:'마무리'}
    ];
    const batterItems=[{value:'fielder',label:'야수'},{value:'catcher',label:'포수'}];
    const cardItems=[
      {value:'live',label:'LIVE'},{value:'allstar',label:'LIVE 올스타'},{value:'impact',label:'임팩트'},
      {value:'signature',label:'시그니처'},{value:'gold',label:'골든글러브'},{value:'national',label:'국가대표'}
    ];
    openModal('일스변 시뮬 설정',`
      <div class="sim-config">
        <div class="sim-panel">
          <div class="sim-panel-title">계산 대상</div><div class="sim-panel-help">스킬 풀을 구분할 포지션을 선택하세요.</div>
          ${pillGroup('normalTarget',targetItems,'batter')}
        </div>
        <div class="sim-panel" id="normalBatterPanel">
          <div class="sim-panel-title">타자 구분</div><div class="sim-panel-help">포수 전용 스킬 포함 여부를 결정합니다.</div>
          ${pillGroup('normalBatterType',batterItems,'fielder')}
        </div>
        <div class="sim-panel">
          <div class="sim-panel-title">카드 타입</div><div class="sim-panel-help">카드별 기본 스킬 레벨 상한을 적용합니다.</div>
          ${pillGroup('normalCardTypePills',cardItems,'live')}
          <div id="allstarYearPanel" class="sim-lock-box sim-hidden">
            <div class="sim-panel-title">LIVE 올스타 연도</div>
            ${pillGroup('normalAllstarYear',[{value:'26',label:'2026'},{value:'old',label:'2025 이하'}],'26')}
          </div>
          <div id="normalFixedPanel" class="sim-lock-box sim-hidden">
            <div class="sim-panel-title">고정된 1옵 스킬</div>
            <div class="sim-panel-help">임팩트·LIVE 올스타는 일스변에서 1옵이 바뀌지 않습니다.</div>
            <div class="sim-fixed-select">
              <select id="normalFixedSkill"></select>
              <select id="normalFixedLevel"></select>
            </div>
          </div>
        </div>
        ${oddsBoxes(normalOdds)}
        <div class="sim-summary" id="normalSummary"></div>
        <div class="sim-action-row"><button class="khome-roll" id="normalRollBtn" type="button">시뮬 시작 →</button></div>
        <div class="khome-result" id="normalRollResult">${skillResultHtml([null,null,null])}</div>
        <div id="normalAutoGrade"></div>
        <div class="sim-level-note">스킬 레벨은 현재 스쿼드메이커의 카드 타입별 기본 최대 레벨 규칙을 사용합니다.</div>
      </div>`);
    const batterPanel=modalBody.querySelector('#normalBatterPanel');
    const fixedPanel=modalBody.querySelector('#normalFixedPanel');
    const yearPanel=modalBody.querySelector('#allstarYearPanel');
    const fixedSkill=modalBody.querySelector('#normalFixedSkill');
    const fixedLevel=modalBody.querySelector('#normalFixedLevel');

    const refreshFixed=()=>{
      const target=selectedPill('normalTarget');
      const bt=selectedPill('normalBatterType');
      const card=selectedPill('normalCardTypePills');
      const year=selectedPill('normalAllstarYear')||'26';
      fixedSkill.innerHTML=fixedSkillOptions(target,bt,card);
      const cap=cardCaps(card,year)[0];
      fixedLevel.innerHTML=Array.from({length:cap},(_,i)=>`<option value="${i+1}" ${i+1===cap?'selected':''}>Lv ${i+1}</option>`).join('');
    };
    const updateSummary=()=>{
      const target=selectedPill('normalTarget'),card=selectedPill('normalCardTypePills'),bt=selectedPill('normalBatterType');
      const year=selectedPill('normalAllstarYear')||'26';
      const targetLabel={batter:'타자',sp:'선발',rp:'중계',cp:'마무리'}[target];
      const cardLabel={live:'LIVE',allstar:'LIVE 올스타',impact:'임팩트',signature:'시그니처',gold:'골든글러브',national:'국가대표'}[card];
      modalBody.querySelector('#normalSummary').innerHTML=`<span>${targetLabel}</span>${target==='batter'?`<span>${bt==='catcher'?'포수':'야수'}</span>`:''}<span>${cardLabel}</span><span>Lv ${cardCaps(card,year).join('/')}</span>`;
      const fixed=card==='impact'||card==='allstar';
      fixedPanel.classList.toggle('sim-hidden',!fixed);
      yearPanel.classList.toggle('sim-hidden',card!=='allstar');
      if(fixed)refreshFixed();
      const g=modalBody.querySelector('#normalAutoGrade'); if(g)g.innerHTML='';
    };

    bindPills('normalTarget',v=>{batterPanel.classList.toggle('sim-hidden',v!=='batter');updateSummary()});
    bindPills('normalBatterType',updateSummary);
    bindPills('normalCardTypePills',updateSummary);
    bindPills('normalAllstarYear',updateSummary);
    updateSummary();

    modalBody.querySelector('#normalRollBtn').onclick=()=>{
      const target=selectedPill('normalTarget'),bt=selectedPill('normalBatterType'),card=selectedPill('normalCardTypePills');
      const year=selectedPill('normalAllstarYear')||'26',caps=cardCaps(card,year),used=new Set(),rows=[];
      const fixed=card==='impact'||card==='allstar';
      if(fixed){
        const id=fixedSkill.value;
        const d=skillCatalog().find(x=>x.id===id);
        if(d){rows.push({...d,level:Number(fixedLevel.value)||caps[0]});used.add(d.id)}
        else rows.push(null);
      }else{
        const tier=drawGrade(normalOdds);
        const d=randomSkill(target,bt,card,{메이저:'major',마이너:'minor',루키:'rookie',아마추어:'amateur'}[tier],used);
        if(d){used.add(d.id);rows.push({...d,level:caps[0]})}else rows.push(null);
      }
      for(let i=1;i<3;i++){
        const tier=drawGrade(normalOdds);
        const key={메이저:'major',마이너:'minor',루키:'rookie',아마추어:'amateur'}[tier];
        const d=randomSkill(target,bt,card,key,used);
        if(d){used.add(d.id);rows.push({...d,level:caps[i]})}else rows.push(null);
      }
      modalBody.querySelector('#normalRollResult').innerHTML=skillResultHtml(rows,target,card);
      modalBody.querySelector('#normalAutoGrade').innerHTML=gradeResultHtml(rows,target,bt,card);
    };
  }

  function showAdvancedRoll(){
    const targetItems=[
      {value:'batter',label:'타자'},{value:'sp',label:'선발'},{value:'rp',label:'중계'},{value:'cp',label:'마무리'}
    ];
    const batterItems=[{value:'fielder',label:'야수'},{value:'catcher',label:'포수'}];
    const cardItems=[
      {value:'impact',label:'임팩트'},{value:'signature',label:'시그니처'},
      {value:'gold',label:'골든글러브'},{value:'national',label:'국가대표'}
    ];
    openModal('고스변 시뮬 설정',`
      <div class="sim-config">
        <div class="sim-panel">
          <div class="sim-panel-title">계산 대상</div><div class="sim-panel-help">실제 사이트의 포지션별 스킬 풀을 사용합니다.</div>
          ${pillGroup('advTarget',targetItems,'batter')}
        </div>
        <div class="sim-panel" id="advBatterPanel">
          <div class="sim-panel-title">타자 구분</div><div class="sim-panel-help">포수 전용 스킬 포함 여부를 결정합니다.</div>
          ${pillGroup('advBatterType',batterItems,'fielder')}
        </div>
        <div class="sim-panel">
          <div class="sim-panel-title">카드 타입</div><div class="sim-panel-help">카드별 기본 스킬 레벨 상한을 적용합니다.</div>
          ${pillGroup('advCardTypePills',cardItems,'impact')}
          <div id="impactLockArea" class="sim-lock-box">
            <label class="khome-check"><input type="checkbox" id="impactKeepLock"> 임팩트 1옵 잠금 유지</label>
            <div id="impactFixedSkillField" class="sim-hidden" style="margin-top:10px">
              <div class="sim-panel-help">현재 1옵 스킬과 레벨을 선택하세요.</div>
              <div class="sim-fixed-select">
                <select id="impactFixedSkill"></select>
                <select id="impactFixedLevel"></select>
              </div>
            </div>
          </div>
        </div>
        ${oddsBoxes(advancedOdds)}
        <div class="sim-summary" id="advSummary"></div>
        <div class="sim-action-row"><button class="khome-roll" id="advRollBtn" type="button">시뮬 시작 →</button></div>
        <div class="khome-result" id="advRollResult">${skillResultHtml([null,null,null])}</div>
        <div id="advAutoGrade"></div>
        <div class="sim-level-note">스킬 이름은 실제 등록 스킬 목록에서 중복 없이 추첨합니다. 국가대표 카드는 1~3옵 모두 메이저급 판정 슬롯에서 국가대표 스킬이 함께 등장할 수 있습니다.</div>
      </div>`);
    const batterPanel=modalBody.querySelector('#advBatterPanel');
    const lockArea=modalBody.querySelector('#impactLockArea');
    const keep=modalBody.querySelector('#impactKeepLock');
    const fixedField=modalBody.querySelector('#impactFixedSkillField');
    const fixedSkill=modalBody.querySelector('#impactFixedSkill');
    const fixedLevel=modalBody.querySelector('#impactFixedLevel');

    const refreshFixed=()=>{
      const target=selectedPill('advTarget'),bt=selectedPill('advBatterType'),card=selectedPill('advCardTypePills');
      fixedSkill.innerHTML=fixedSkillOptions(target,bt,card);
      const cap=cardCaps(card)[0];
      fixedLevel.innerHTML=Array.from({length:cap},(_,i)=>`<option value="${i+1}" ${i+1===cap?'selected':''}>Lv ${i+1}</option>`).join('');
    };
    const updateSummary=()=>{
      const target=selectedPill('advTarget'),card=selectedPill('advCardTypePills'),bt=selectedPill('advBatterType');
      const targetLabel={batter:'타자',sp:'선발',rp:'중계',cp:'마무리'}[target];
      const cardLabel={impact:'임팩트',signature:'시그니처',gold:'골든글러브',national:'국가대표'}[card];
      modalBody.querySelector('#advSummary').innerHTML=`<span>${targetLabel}</span>${target==='batter'?`<span>${bt==='catcher'?'포수':'야수'}</span>`:''}<span>${cardLabel}</span><span>Lv ${cardCaps(card).join('/')}</span>`;
      lockArea.classList.toggle('sim-hidden',card!=='impact');
      if(card!=='impact'){keep.checked=false;fixedField.classList.add('sim-hidden')}
      refreshFixed();
      const g=modalBody.querySelector('#advAutoGrade'); if(g)g.innerHTML='';
    };
    bindPills('advTarget',v=>{batterPanel.classList.toggle('sim-hidden',v!=='batter');updateSummary()});
    bindPills('advBatterType',updateSummary);
    bindPills('advCardTypePills',updateSummary);
    keep.onchange=()=>{fixedField.classList.toggle('sim-hidden',!keep.checked);if(keep.checked)refreshFixed()};
    updateSummary();

    modalBody.querySelector('#advRollBtn').onclick=()=>{
      const target=selectedPill('advTarget'),bt=selectedPill('advBatterType'),card=selectedPill('advCardTypePills');
      const caps=cardCaps(card),used=new Set(),rows=[];
      if(card==='impact'&&keep.checked){
        const d=skillCatalog().find(x=>x.id===fixedSkill.value);
        if(d){used.add(d.id);rows.push({...d,level:Number(fixedLevel.value)||caps[0]})}else rows.push(null);
      }else{
        const d=randomHighGradeSkill(target,bt,card,used);
        if(d){used.add(d.id);rows.push({...d,level:caps[0]})}else rows.push(null);
      }
      for(let i=1;i<3;i++){
        const grade=drawGrade(advancedOdds);
        const tier={메이저:'major',마이너:'minor',루키:'rookie',아마추어:'amateur'}[grade];
        const d=(grade==='메이저')
          ? randomHighGradeSkill(target,bt,card,used)
          : randomSkill(target,bt,card,tier,used);
        if(d){used.add(d.id);rows.push({...d,level:caps[i]})}else rows.push(null);
      }
      modalBody.querySelector('#advRollResult').innerHTML=skillResultHtml(rows,target,card);
      modalBody.querySelector('#advAutoGrade').innerHTML=gradeResultHtml(rows,target,bt,card);
    };
  }

  function showMajorCalc(){
    openModal('메이저 확률 계산기',`
      <div class="khome-field"><label>변경권</label><select id="calcType"><option value="normal">일스변 (2·3옵 각 7%)</option><option value="advanced">고스변 (2·3옵 각 17%)</option></select></div>
      <div class="khome-field"><label>시도 횟수</label><input id="calcCount" type="number" min="1" max="10000" value="10"></div>
      <button class="khome-roll" id="calcBtn" type="button">확률 계산</button>
      <div class="khome-result" id="calcResult"></div>`);
    const calculate=()=>{
      const p=modalBody.querySelector('#calcType').value==='advanced'?.17:.07;
      const n=Math.max(1,Number(modalBody.querySelector('#calcCount').value)||1);
      const one=1-(1-p)**2;
      const both=p*p;
      const cumulative=1-(1-one)**n;
      modalBody.querySelector('#calcResult').innerHTML=`
        <div class="khome-tip">1회에서 2·3옵 중 메이저가 하나 이상 나올 확률</div><div class="khome-calc-value">${(one*100).toFixed(2)}%</div>
        <div class="khome-tip">1회에서 2·3옵이 둘 다 메이저일 확률: <b>${(both*100).toFixed(2)}%</b></div>
        <div class="khome-tip">${n}회 안에 2·3옵 중 메이저가 한 번 이상 나올 확률</div><div class="khome-calc-value">${(cumulative*100).toFixed(2)}%</div>`;
    };
    modalBody.querySelector('#calcBtn').onclick=calculate; calculate();
  }


  function showOddsTable(){
    openModal('스킬 변경 확률표',`
      <table class="khome-table">
        <thead><tr><th>구분</th><th>메이저</th><th>마이너</th><th>루키</th><th>아마추어</th></tr></thead>
        <tbody>
          <tr><td>일스변</td><td>7%</td><td>23%</td><td>40%</td><td>30%</td></tr>
          <tr><td>고스변 2·3옵</td><td>17%</td><td>30%</td><td>28%</td><td>25%</td></tr>
        </tbody>
      </table>
      <div class="khome-result">
        <b>1옵 규칙</b>
        <div class="khome-tip">• 일스변: 임팩트·LIVE 올스타는 1옵 고정<br>• 고스변: 1옵 메이저 확정<br>• 임팩트 고스변: 1옵 잠금 유지 또는 잠금 해제 가능<br>• 2옵과 3옵은 각각 독립 추첨이라 같은 등급이 연속으로 나올 수 있음</div>
      </div>`);
  }

  function action(name){
    if(name==='googleAuth'){
      const account=document.getElementById('cloudAccountBtn');
      const login=document.getElementById('cloudLoginBtn');
      if(account && !account.hidden){
        enterApp();
        setTimeout(()=>account.click(),120);
      }else if(login){
        login.click();
      }
      return;
    }
    if(name==='normalRoll') return showNormalRoll();
    if(name==='advancedRoll') return showAdvancedRoll();
    if(name==='majorCalc') return showMajorCalc();
    if(name==='oddsTable') return showOddsTable();
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
      setTimeout(()=>document.querySelector('.ref-actionbar')?.scrollIntoView({behavior:'smooth',block:'center'}),180);
    }
  }
  home.addEventListener('click',e=>{
    const btn=e.target.closest('[data-home-action]');
    if(btn) action(btn.dataset.homeAction);
  });

  const syncHomeGoogleAuth=()=>{
    const b=document.getElementById('khomeGoogleLoginBtn');
    if(!b)return;
    const account=document.getElementById('cloudAccountBtn');
    const login=document.getElementById('cloudLoginBtn');
    const avatar=document.getElementById('cloudAccountAvatar');
    const name=document.getElementById('cloudAccountName');
    const signedIn=!!(account && !account.hidden);
    b.classList.toggle('signed-in',signedIn);
    if(signedIn){
      const label=(name?.textContent||'Google 계정').trim();
      const src=avatar?.getAttribute('src')||'';
      b.innerHTML=(src?`<img src="${src}" alt="">`:'')+`<span>${label||'Google 계정'}</span>`;
    }else{
      b.textContent='Google 로그인';
    }
  };

  const watchGoogleAuth=()=>{
    syncHomeGoogleAuth();
    const observer=new MutationObserver(syncHomeGoogleAuth);
    ['cloudLoginBtn','cloudAccountBtn','cloudAccountName','cloudAccountAvatar'].forEach(id=>{
      const el=document.getElementById(id);
      if(el)observer.observe(el,{attributes:true,childList:true,subtree:true});
    });
    setTimeout(syncHomeGoogleAuth,500);
    setTimeout(syncHomeGoogleAuth,1500);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watchGoogleAuth,{once:true});
  else watchGoogleAuth();

  const addHomeButton=()=>{
    const bar=document.querySelector('.toolbar');
    if(!bar || document.getElementById('kboHomeButton')) return;
    const b=document.createElement('button');
    b.id='kboHomeButton'; b.className='btn'; b.type='button'; b.textContent='홈'; b.onclick=showHome;
    bar.prepend(b);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addHomeButton,{once:true}); else addHomeButton();
})();
