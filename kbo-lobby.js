(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const lobby = $('kboFeatureLobby');
  const cpbvView = $('kboCpbvView');
  const frame = $('kboCpbvFrame');
  if (!lobby || !cpbvView || !frame) return;

  const CPBV_URL = 'https://www.cpbv-lab.com/';
  const TOOLS = {
    'skill-score': {
      title: '스킬 점수 계산기',
      subtitle: '점수 · 등급 · 상위 확률 · 기대 시도 횟수를 포함한 원본 계산기를 이용해.'
    },
    'impact-roll': {
      title: '일스변 시뮬',
      subtitle: '일반 스킬 변경 시뮬레이터를 원본 사이트에서 이용해.'
    },
    'advanced-roll': {
      title: '고스변 시뮬',
      subtitle: '고급 스킬 변경 시뮬레이터와 목표 등급 자동 롤을 원본 사이트에서 이용해.'
    }
  };

  const cleanURL = () => `${window.location.pathname}${window.location.search}`;
  let currentMode = 'home';
  let currentTool = 'skill-score';

  function modeFromLocation() {
    const state = history.state;
    if (state && state.kboLobbyView === 'squad') return { mode: 'squad' };
    if (state && state.kboLobbyView === 'cpbv') {
      return { mode: 'cpbv', tool: state.kboLobbyTool || 'skill-score' };
    }
    const hash = (location.hash || '').replace(/^#/, '');
    if (hash === 'squadmaker') return { mode: 'squad' };
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
    document.body.classList.remove('kbo-lobby-dismissed', 'kbo-cpbv-open');
    document.title = 'KBO LAB · 컴투스프로야구 V26 도구 모음';
    syncLoginLabel();
  }

  function enterSquad() {
    currentMode = 'squad';
    lobby.hidden = true;
    cpbvView.hidden = true;
    document.body.classList.add('kbo-lobby-dismissed');
    document.body.classList.remove('kbo-cpbv-open');
    if (!(history.state && history.state.kboLobbyView === 'squad')) {
      setHistory('squad', null, true);
    }
  }

  function openCpbv(tool) {
    currentTool = Object.prototype.hasOwnProperty.call(TOOLS, tool) ? tool : 'skill-score';
    const item = TOOLS[currentTool];
    currentMode = 'cpbv';
    lobby.hidden = true;
    cpbvView.hidden = false;
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
    if (history.state && ['squad', 'cpbv'].includes(history.state.kboLobbyView)) {
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
    } else if (target.mode === 'cpbv') {
      // Avoid writing another history entry while handling popstate.
      currentTool = target.tool;
      currentMode = 'cpbv';
      lobby.hidden = true;
      cpbvView.hidden = false;
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
  $('kboCpbvOpenExternal')?.addEventListener('click', () => {
    window.open(CPBV_URL, '_blank', 'noopener,noreferrer');
  });

  document.querySelectorAll('[data-cpbv-open]').forEach((button) => {
    button.addEventListener('click', () => openCpbv(button.getAttribute('data-cpbv-open')));
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
  // Always start on the lobby on a fresh page load. This prevents a stale
  // #squadmaker fragment from trapping users directly inside SquadMaker.
  // Navigation within the page still records states, so Back returns to the lobby.
  history.replaceState({ kboLobbyView: 'home' }, '', cleanURL());
  showHome();
})();
