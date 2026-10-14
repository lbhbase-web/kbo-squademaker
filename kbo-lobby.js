(() => {
  const lobby = document.getElementById('kboFeatureLobby');
  if (!lobby) return;
  const enterSquad = () => {
    lobby.hidden = true;
    document.body.classList.add('kbo-lobby-dismissed');
  };
  document.getElementById('kboLobbySquad')?.addEventListener('click', enterSquad);
  document.getElementById('kboLobbyLogin')?.addEventListener('click', () => {
    const existing = document.getElementById('cloudLoginBtn');
    if (existing) {
      existing.click();
    } else {
      alert('기존 Google 로그인 버튼을 찾을 수 없습니다. 앱이 완전히 로드된 뒤 다시 시도해 주세요.');
    }
  });
  // CPBV LAB's public home currently exposes the skill-score calculator and simulator menu.
  // Keep this link external rather than pretending its private/internal calculation code is embedded.
  document.querySelectorAll('[data-cpbv-link]').forEach((el) => {
    el.addEventListener('click', () => {
      const url = 'https://www.cpbv-lab.com/';
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
})();