(()=>{
window.__PLAYER_PHOTO_URLS__=window.__PLAYER_PHOTO_URLS__||{};
const files={"KIA":"player-photo-kia.js","삼성":"player-photo-samsung.js","LG":"player-photo-lg.js","한화":"player-photo-hanwha.js","SSG":"player-photo-ssg.js","KT":"player-photo-kt.js","NC":"player-photo-nc.js","두산":"player-photo-doosan.js","롯데":"player-photo-lotte.js","키움":"player-photo-kiwoom.js"};
const pending={};
window.__loadPlayerPhotoTeam=function(team){
  if(!files[team])return Promise.resolve();
  if(pending[team])return pending[team];
  pending[team]=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='./'+files[team]+'?v=13.3';
    s.async=true;
    s.onload=()=>resolve();
    s.onerror=()=>reject(new Error('load failed: '+team));
    document.head.appendChild(s);
  });
  return pending[team];
};
})();
