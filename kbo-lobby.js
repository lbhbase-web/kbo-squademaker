(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const lobby = $('kboFeatureLobby');
  const cpbvView = $('kboCpbvView');
  const scoreView = $('kboScoreView');
  const simView = $('kboSkillSimView');
  const frame = $('kboCpbvFrame');
  if (!lobby || !cpbvView || !scoreView || !simView || !frame) return;

  const CPBV_URL = 'https://www.cpbv-lab.com/';
  const TOOLS = {
    'skill-score': {
      title: '스킬 점수 계산기',
      subtitle: '점수 · 등급 · 상위 확률 · 기대 시도 횟수를 포함한 원본 계산기를 이용해.'
    },
    'impact-roll': {
      title: '일스변 시뮬',
      subtitle: '아마추어 30% · 루키 40% · 마이너 23% · 메이저 7% 확률을 적용해.'
    },
    'advanced-roll': {
      title: '고스변 시뮬',
      subtitle: '1옵 메이저 확정 · 2옵/3옵 확률 추첨 · 중복 스킬 방지.'
    }
  };

  const cleanURL = () => `${window.location.pathname}${window.location.search}`;
  let currentMode = 'home';
  let currentTool = 'skill-score';

  function modeFromLocation() {
    const state = history.state;
    if (state && state.kboLobbyView === 'squad') return { mode: 'squad' };
    if (state && state.kboLobbyView === 'score') return { mode: 'score' };
    if (state && state.kboLobbyView === 'sim') return { mode: 'sim', tool: state.kboLobbyTool || 'impact-roll' };
    if (state && state.kboLobbyView === 'cpbv') {
      return { mode: 'cpbv', tool: state.kboLobbyTool || 'skill-score' };
    }
    const hash = (location.hash || '').replace(/^#/, '');
    if (hash === 'squadmaker') return { mode: 'squad' };
    if (hash === 'skill-score') return { mode: 'score' };
    if (hash.startsWith('sim-')) return { mode: 'sim', tool: hash.slice(4) || 'impact-roll' };
    if (hash.startsWith('cpbv-')) return { mode: 'cpbv', tool: hash.slice(5) || 'skill-score' };
    return { mode: 'home' };
  }

  function setHistory(mode, tool, push = true) {
    const url = cleanURL();
    const state = { kboLobbyView: mode };
    if (mode === 'squad') {
      state.kboLobbyView = 'squad';
      if (push) history.pushState(state, '', `${url}#squadmaker`);
      else history.replaceState(state, '', `${url}#squadmaker`);
    } else if (mode === 'score') {
      state.kboLobbyView = 'score';
      if (push) history.pushState(state, '', `${url}#skill-score`);
      else history.replaceState(state, '', `${url}#skill-score`);
    } else if (mode === 'sim') {
      state.kboLobbyTool = tool || 'impact-roll';
      if (push) history.pushState(state, '', `${url}#sim-${encodeURIComponent(state.kboLobbyTool)}`);
      else history.replaceState(state, '', `${url}#sim-${encodeURIComponent(state.kboLobbyTool)}`);
    } else if (mode === 'cpbv') {
      state.kboLobbyTool = tool || 'skill-score';
      if (push) history.pushState(state, '', `${url}#cpbv-${encodeURIComponent(state.kboLobbyTool)}`);
      else history.replaceState(state, '', `${url}#cpbv-${encodeURIComponent(state.kboLobbyTool)}`);
    } else {
      if (push) history.pushState(state, '', url);
      else history.replaceState(state, '', url);
    }
  }

  function showHome() {
    currentMode = 'home';
    lobby.hidden = false;
    cpbvView.hidden = true;
    scoreView.hidden = true;
    simView.hidden = true;
    document.body.classList.remove('kbo-lobby-dismissed', 'kbo-cpbv-open');
    document.title = 'KBO LAB · 컴투스프로야구 V26 도구 모음';
    syncLoginLabel();
  }

  function enterSquad() {
    currentMode = 'squad';
    lobby.hidden = true;
    cpbvView.hidden = true;
    scoreView.hidden = true;
    simView.hidden = true;
    document.body.classList.add('kbo-lobby-dismissed');
    document.body.classList.remove('kbo-cpbv-open');
    if (!(history.state && history.state.kboLobbyView === 'squad')) {
      setHistory('squad', null, true);
    }
  }

  function openScoreCalculator(push = true) {
    currentMode = 'score';
    lobby.hidden = true;
    cpbvView.hidden = true;
    scoreView.hidden = false;
    simView.hidden = true;
    document.body.classList.remove('kbo-lobby-dismissed', 'kbo-cpbv-open');
    document.title = '스킬 점수 계산기 · KBO LAB';
    if (push && !(history.state && history.state.kboLobbyView === 'score')) {
      setHistory('score', null, true);
    }
    if (window.KBOSkillScore && typeof window.KBOSkillScore.activate === 'function') {
      window.KBOSkillScore.activate();
    }
  }

  function openSimulator(tool, push = true) {
    const advanced = tool === 'advanced' || tool === 'advanced-roll';
    const canonicalTool = advanced ? 'advanced-roll' : 'impact-roll';
    currentMode = 'sim';
    currentTool = canonicalTool;
    lobby.hidden = true;
    cpbvView.hidden = true;
    scoreView.hidden = true;
    simView.hidden = false;
    document.body.classList.remove('kbo-lobby-dismissed', 'kbo-cpbv-open');
    document.title = `${advanced ? '고스변' : '일스변'} 시뮬 · KBO LAB`;
    if (push && !(history.state && history.state.kboLobbyView === 'sim' && history.state.kboLobbyTool === canonicalTool)) {
      setHistory('sim', canonicalTool, true);
    }
    if (window.KBOSkillSimulator && typeof window.KBOSkillSimulator.activate === 'function') {
      window.KBOSkillSimulator.activate(advanced ? 'advanced' : 'general');
    }
  }

  function openCpbv(tool) {
    if (tool === 'impact-roll') { openSimulator('general', true); return; }
    if (tool === 'advanced-roll') { openSimulator('advanced', true); return; }
    if (tool === 'skill-score') {
      openScoreCalculator(true);
      return;
    }
    currentTool = Object.prototype.hasOwnProperty.call(TOOLS, tool) ? tool : 'skill-score';
    const item = TOOLS[currentTool];
    currentMode = 'cpbv';
    lobby.hidden = true;
    cpbvView.hidden = false;
    scoreView.hidden = true;
    simView.hidden = true;
    document.body.classList.add('kbo-cpbv-open');
    document.body.classList.remove('kbo-lobby-dismissed');
    $('kboCpbvTitle').textContent = item.title;
    $('kboCpbvSubtitle').textContent = item.subtitle;
    $('kboCpbvOpenExternal').setAttribute('aria-label', `${item.title} 새 탭에서 열기`);
    // Each selected lobby tile starts at the original site's landing menu.
    // The original site's own controls then open the exact live calculator or simulator.
    frame.setAttribute('src', CPBV_URL);
    if (!(history.state && history.state.kboLobbyView === 'cpbv' &&
          history.state.kboLobbyTool === currentTool)) {
      setHistory('cpbv', currentTool, true);
    }
  }

  function returnHome() {
    // Returning from an app/tool state restores the previous in-page lobby entry.
    if (history.state && ['squad', 'cpbv', 'score', 'sim'].includes(history.state.kboLobbyView)) {
      history.back();
      return;
    }
    showHome();
    setHistory('home', null, false);
  }

  function routeFromHistory() {
    const target = modeFromLocation();
    if (target.mode === 'squad') {
      enterSquad();
    } else if (target.mode === 'score') {
      openScoreCalculator(false);
    } else if (target.mode === 'sim') {
      openSimulator(target.tool, false);
    } else if (target.mode === 'cpbv') {
      if (target.tool === 'impact-roll' || target.tool === 'advanced-roll') {
        openSimulator(target.tool, false);
        return;
      }
      // Avoid writing another history entry while handling popstate.
      currentTool = target.tool;
      currentMode = 'cpbv';
      lobby.hidden = true;
      cpbvView.hidden = false;
      scoreView.hidden = true;
      simView.hidden = true;
      document.body.classList.add('kbo-cpbv-open');
      document.body.classList.remove('kbo-lobby-dismissed');
      const item = TOOLS[currentTool] || TOOLS['skill-score'];
      $('kboCpbvTitle').textContent = item.title;
      $('kboCpbvSubtitle').textContent = item.subtitle;
      if (frame.getAttribute('src') === 'about:blank') frame.setAttribute('src', CPBV_URL);
    } else {
      showHome();
    }
  }

  $('kboLobbySquad')?.addEventListener('click', enterSquad);
  $('kboHomeButton')?.addEventListener('click', returnHome);
  $('kboCpbvHome')?.addEventListener('click', returnHome);
  $('kboScoreHome')?.addEventListener('click', returnHome);
  $('kboSimHome')?.addEventListener('click', returnHome);
  $('kboCpbvOpenExternal')?.addEventListener('click', () => {
    window.open(CPBV_URL, '_blank', 'noopener,noreferrer');
  });

  document.querySelectorAll('[data-cpbv-open]').forEach((button) => {
    button.addEventListener('click', () => openCpbv(button.getAttribute('data-cpbv-open')));
  });
  document.querySelectorAll('[data-sim-open]').forEach((button) => {
    button.addEventListener('click', () => openSimulator(button.getAttribute('data-sim-open'), true));
  });

  function syncLoginLabel() {
    const loginButton = $('cloudLoginBtn');
    const accountButton = $('cloudAccountBtn');
    const label = $('kboLobbyLoginLabel');
    if (!label) return;
    const isSignedIn = !!(accountButton && !accountButton.hidden) ||
      !!(loginButton && loginButton.hidden);
    label.textContent = isSignedIn ? 'Google 계정' : 'Google 로그인';
    const lobbyLogin = $('kboLobbyLogin');
    if (lobbyLogin) lobbyLogin.setAttribute('aria-label', isSignedIn ? 'Google 계정 열기' : 'Google 로그인');
  }

  $('kboLobbyLogin')?.addEventListener('click', () => {
    const accountButton = $('cloudAccountBtn');
    const loginButton = $('cloudLoginBtn');
    // Reuse the site's existing Firebase sign-in/account UI; do not create a second auth system.
    if (accountButton && !accountButton.hidden) {
      // The account dialog belongs to the existing app layer, so show that layer first.
      enterSquad();
      accountButton.click();
    } else if (loginButton && !loginButton.hidden) {
      loginButton.click();
    } else if (!accountButton && !loginButton) {
      alert('Google 로그인 기능을 불러오는 중이야. 잠시 뒤 다시 눌러줘.');
    } else {
      syncLoginLabel();
    }
  });

  const loginObserver = new MutationObserver(syncLoginLabel);
  ['cloudLoginBtn', 'cloudAccountBtn'].forEach((id) => {
    const el = $(id);
    if (el) loginObserver.observe(el, { attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
  });
  window.addEventListener('kbo-cloud-auth-updated', syncLoginLabel);
  window.addEventListener('popstate', routeFromHistory);

  // Establish a home history entry so the device/browser Back button returns to the lobby.
  const initialHash = (location.hash || '').replace(/^#/, '');
  const initialMode = modeFromLocation();
  if (!history.state || !history.state.kboLobbyView) {
    history.replaceState({ kboLobbyView: 'home' }, '', cleanURL());
  }
  if (initialHash === 'squadmaker') {
    setHistory('squad', null, true);
    enterSquad();
  } else if (initialHash === 'skill-score') {
    openScoreCalculator(false);
  } else if (initialHash.startsWith('sim-')) {
    const tool = decodeURIComponent(initialHash.slice(4));
    setHistory('sim', tool, true);
    openSimulator(tool, false);
  } else if (initialHash.startsWith('cpbv-')) {
    const tool = decodeURIComponent(initialHash.slice(5));
    if (tool === 'impact-roll' || tool === 'advanced-roll') {
      setHistory('sim', tool, true);
      openSimulator(tool, false);
    } else {
      setHistory('cpbv', tool, true);
      openCpbv(tool);
    }
  } else if (initialMode.mode === 'squad') {
    enterSquad();
  } else if (initialMode.mode === 'cpbv') {
    openCpbv(initialMode.tool);
  } else {
    showHome();
  }
})();
