(()=>{
  const DATA_URL='./data/players.json';
  const APP_URL='./app.js';
  const showError=(msg)=>{
    const el=document.getElementById('app-loading');
    if(el){el.textContent=msg;el.style.background='#4a1520';}
    console.error(msg);
  };
  fetch(DATA_URL,{cache:'default'})
    .then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();})
    .then(data=>{
      if(!Array.isArray(data))throw new Error('선수 데이터 형식 오류');
      window.__KBO_PLAYERS__=data;
      const script=document.createElement('script');
      script.src=APP_URL;
      script.onerror=()=>showError('앱 스크립트를 불러오지 못했습니다. 새로고침해 주세요.');
      document.body.appendChild(script);
    })
    .catch(err=>showError('선수 데이터를 불러오지 못했습니다. 인터넷 연결 또는 data/players.json 경로를 확인해 주세요. ('+err.message+')'));
})();
