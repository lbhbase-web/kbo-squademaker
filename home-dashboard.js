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

    .khome-tool-badge{position:absolute;right:18px;top:18px;padding:4px 8px;border-radius:999px;background:#fff1bf;color:#a36a00;font-size:9px;font-weight:1000;letter-spacing:.3px}
    .khome-icon.blue{background:linear-gradient(145deg,#e9f3ff,#e7efff);color:#367fe8}
    .khome-icon.purple{background:linear-gradient(145deg,#f0eaff,#ece5ff);color:#7a4ee8}
    .khome-icon.green{background:linear-gradient(145deg,#e5fbf2,#e2f7f4);color:#159f83}
    .khome-icon.orange{background:linear-gradient(145deg,#fff1e8,#ffecdd);color:#ed7a25}
    .khome-modal-backdrop{position:fixed;inset:0;z-index:40000;background:rgba(20,28,40,.46);display:none;align-items:center;justify-content:center;padding:18px}
    .khome-modal-backdrop.open{display:flex}
    .khome-modal{width:min(620px,100%);max-height:min(760px,90vh);overflow:auto;background:#fff;border-radius:22px;border:1px solid #e2e8f0;box-shadow:0 28px 80px rgba(17,32,57,.28);padding:22px}
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
  style.id='kbo-home-dashboard-style-v143';
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

      <div class="khome-section-title"><h2>스킬 도구</h2><span>실제 확률 규칙으로 바로 돌려볼 수 있어요</span></div>
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

  function showNormalRoll(){
    openModal('일스변 시뮬레이터',`
      <div class="khome-field"><label>카드 종류</label><select id="normalCardType"><option value="normal">일반 카드</option><option value="impact">임팩트</option><option value="allstar">LIVE 올스타</option></select></div>
      <div class="khome-field" id="normalFixedField" style="display:none"><label>고정된 1옵 등급</label><select id="normalFixedGrade"><option>메이저</option><option>마이너</option><option>루키</option><option>아마추어</option></select></div>
      ${oddsBoxes(normalOdds)}
      <button class="khome-roll" id="normalRollBtn" type="button">일스변 돌리기</button>
      <div class="khome-result" id="normalRollResult">${slotsHtml(['-','-','-'])}</div>
      <div class="khome-tip">임팩트와 LIVE 올스타는 일스변에서 1옵이 잠겨 있고, 2·3옵만 새로 추첨됩니다.</div>`);
    const type=modalBody.querySelector('#normalCardType'), fixed=modalBody.querySelector('#normalFixedField');
    type.onchange=()=>fixed.style.display=type.value==='normal'?'none':'block';
    modalBody.querySelector('#normalRollBtn').onclick=()=>{
      const grades=type.value==='normal'
        ? [drawGrade(normalOdds),drawGrade(normalOdds),drawGrade(normalOdds)]
        : [modalBody.querySelector('#normalFixedGrade').value,drawGrade(normalOdds),drawGrade(normalOdds)];
      modalBody.querySelector('#normalRollResult').innerHTML=slotsHtml(grades);
    };
  }

  function showAdvancedRoll(){
    openModal('고스변 시뮬레이터',`
      <div class="khome-field"><label>카드 종류</label><select id="advCardType"><option value="normal">일반 카드</option><option value="impact">임팩트</option></select></div>
      <div id="impactLockArea" style="display:none">
        <label class="khome-check"><input type="checkbox" id="impactKeepLock"> 임팩트 1옵 잠금 유지</label>
        <div class="khome-field" id="impactFixedGradeField" style="display:none"><label>유지할 1옵 등급</label><select id="impactFixedGrade"><option>메이저</option><option>마이너</option><option>루키</option><option>아마추어</option></select></div>
      </div>
      ${oddsBoxes(advancedOdds)}
      <button class="khome-roll" id="advRollBtn" type="button">고스변 돌리기</button>
      <div class="khome-result" id="advRollResult">${slotsHtml(['메이저','-','-'])}</div>
      <div class="khome-tip">고스변은 기본적으로 1옵이 메이저 확정입니다. 임팩트는 원하면 1옵 잠금을 유지할 수 있고, 잠금을 풀면 1옵도 메이저로 다시 뽑습니다.</div>`);
    const type=modalBody.querySelector('#advCardType'), lockArea=modalBody.querySelector('#impactLockArea'), keep=modalBody.querySelector('#impactKeepLock'), fixedField=modalBody.querySelector('#impactFixedGradeField');
    type.onchange=()=>{lockArea.style.display=type.value==='impact'?'block':'none';fixedField.style.display='none';keep.checked=false};
    keep.onchange=()=>fixedField.style.display=keep.checked?'block':'none';
    modalBody.querySelector('#advRollBtn').onclick=()=>{
      const first=(type.value==='impact'&&keep.checked)?modalBody.querySelector('#impactFixedGrade').value:'메이저';
      modalBody.querySelector('#advRollResult').innerHTML=slotsHtml([first,drawGrade(advancedOdds),drawGrade(advancedOdds)]);
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

  const addHomeButton=()=>{
    const bar=document.querySelector('.toolbar');
    if(!bar || document.getElementById('kboHomeButton')) return;
    const b=document.createElement('button');
    b.id='kboHomeButton'; b.className='btn'; b.type='button'; b.textContent='홈'; b.onclick=showHome;
    bar.prepend(b);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addHomeButton,{once:true}); else addHomeButton();
})();
