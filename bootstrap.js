(()=>{
  const APP_URL='./app.js';
  const DATA_URLS=['./players.json','./data/players.json'];

  const showError=(msg)=>{
    const el=document.getElementById('app-loading');
    if(el){
      el.textContent=msg;
      el.style.background='#4a1520';
    }
    console.error(msg);
  };

  async function loadPlayers(){
    let lastError=null;
    for(const url of DATA_URLS){
      try{
        const r=await fetch(url,{cache:'no-cache'});
        if(!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
        const data=await r.json();
        if(!Array.isArray(data)) throw new Error(`${url}: 선수 데이터 형식 오류`);
        return data;
      }catch(err){
        lastError=err;
        console.warn('선수 데이터 로드 실패:',err);
      }
    }
    throw lastError || new Error('선수 데이터 로드 실패');
  }

  loadPlayers()
    .then(data=>{
      window.__KBO_PLAYERS__=data;
      const script=document.createElement('script');
      script.src=APP_URL;
      script.onerror=()=>showError('앱 스크립트를 불러오지 못했습니다. app.js가 저장소 최상위에 있는지 확인해 주세요.');
      document.body.appendChild(script);
    })
    .catch(err=>showError('선수 데이터를 불러오지 못했습니다. players.json 또는 data/players.json 파일을 확인해 주세요. ('+err.message+')'));
})();
