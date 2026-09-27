import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const $=id=>document.getElementById(id);
const configured=()=>Object.values(firebaseConfig||{}).every(v=>typeof v==="string"&&v&& !v.includes("YOUR_"));
const state={auth:null,db:null,user:null,lineups:[],ready:false,configured:configured()};

function waitBridge(){
 if(window.KBOCloudBridge)return Promise.resolve(window.KBOCloudBridge);
 return new Promise(resolve=>window.addEventListener("kbo-cloud-bridge-ready",()=>resolve(window.KBOCloudBridge),{once:true}));
}
function setStatus(msg){const el=$("cloudLineupStatus");if(el)el.textContent=msg||"";}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function fmtTime(v){
 const d=v?.toDate?.()|| (v?.seconds?new Date(v.seconds*1000):v?new Date(v):null);
 if(!d||Number.isNaN(d.getTime()))return "방금 저장";
 return new Intl.DateTimeFormat("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(d);
}
function encodeSnapshot(snapshot){
 try{return JSON.stringify(snapshot);}catch(e){throw new Error("라인업 데이터를 저장 가능한 형식으로 변환하지 못했어.");}
}
function decodeSnapshot(row){
 if(!row)return null;
 if(typeof row.snapshotJson==="string"){
  try{return JSON.parse(row.snapshotJson);}catch(e){throw new Error("저장된 라인업 데이터(JSON)를 읽지 못했어.");}
 }
 // v11.4 이전에 저장된 문서가 있다면 호환해서 불러온다.
 if(row.snapshot&&typeof row.snapshot==="object")return row.snapshot;
 return null;
}
function modal(open){
 const m=$("cloudAccountModal");if(!m)return;
 m.classList.toggle("open",!!open);m.style.display=open?"flex":"none";m.setAttribute("aria-hidden",open?"false":"true");
}
function updateAuthUI(){
 const u=state.user,login=$("cloudLoginBtn"),account=$("cloudAccountBtn"),logout=$("cloudLogoutBtn"),save=$("cloudSaveNewBtn"),plus=$("cloudPlusTile"),notice=$("cloudSetupNotice");
 if(notice)notice.hidden=state.configured;
 if(login){login.hidden=!!u;login.textContent=state.configured?"Google 로그인":"Google 로그인 설정";}
 if(account){account.hidden=!u;}
 if(logout)logout.hidden=!u;
 if(save)save.disabled=!u;
 if(plus)plus.disabled=!u;
 if(u){
  if($("cloudAccountName"))$("cloudAccountName").textContent=u.displayName||"내 라인업";
  if($("cloudAccountAvatar")){const img=$("cloudAccountAvatar");img.src=u.photoURL||"";img.hidden=!u.photoURL;}
  if($("cloudAccountIdentity"))$("cloudAccountIdentity").textContent=`${u.displayName||"Google 사용자"} · ${u.email||""}`;
 }else{
  if($("cloudAccountIdentity"))$("cloudAccountIdentity").textContent=state.configured?"Google 계정에 로그인하면 저장한 라인업을 여러 기기에서 불러올 수 있어.":"Firebase 설정을 연결한 뒤 Google 로그인을 사용할 수 있어.";
 }
}
function renderLineups(){
 const grid=$("cloudLineupGrid");if(!grid)return;
 const plus=`<button id="cloudPlusTile" type="button" class="cloud-plus-tile" ${state.user?"":"disabled"}><span>＋</span><b>새 라인업</b><small>현재 라인업을 계정에 저장</small></button>`;
 const cards=state.lineups.map(row=>{
  let legacy=null;try{legacy=decodeSnapshot(row);}catch{}
  const names=(row.playerNames||legacy?.playerNames||[]).slice(0,4).join(" · ");
  const count=row.playerCount??legacy?.playerCount??0;
  const mode=row.modeName||legacy?.modeName||"라인업";
  return `<article class="cloud-lineup-card" data-id="${esc(row.id)}">
   <div class="cloud-lineup-card-title"><b>${esc(row.name||"이름 없는 라인업")}</b><span class="cloud-mode">${esc(mode)}</span></div>
   <div class="cloud-lineup-players">${esc(names||"저장된 선수 없음")}${count>4?` 외 ${count-4}명`:""}</div>
   <div class="cloud-lineup-meta">선수 ${count}명<br>최근 저장 ${esc(fmtTime(row.updatedAt||row.createdAt))}</div>
   <div class="cloud-lineup-card-actions">
    <button class="primary" data-cloud-action="load" data-id="${esc(row.id)}">불러오기</button>
    <button data-cloud-action="overwrite" data-id="${esc(row.id)}">현재로 덮어쓰기</button>
    <button data-cloud-action="rename" data-id="${esc(row.id)}">이름 변경</button>
    <button data-cloud-action="copy" data-id="${esc(row.id)}">복사</button>
    <button class="danger" data-cloud-action="delete" data-id="${esc(row.id)}">삭제</button>
   </div>
  </article>`;
 }).join("");
 grid.innerHTML=cards+plus;
 $("cloudPlusTile")?.addEventListener("click",saveNew);
}
async function refresh(){
 if(!state.user||!state.db){state.lineups=[];renderLineups();return;}
 setStatus("라인업 목록 불러오는 중…");
 try{
  const ref=collection(state.db,"users",state.user.uid,"lineups");
  const snap=await getDocs(query(ref,orderBy("updatedAt","desc")));
  state.lineups=snap.docs.map(d=>({id:d.id,...d.data()}));
  renderLineups();setStatus(`${state.lineups.length.toLocaleString()}개 라인업 저장됨 · 사이트에서는 저장 개수 제한 없음`);
 }catch(e){console.error(e);setStatus("목록을 불러오지 못했어. Firestore 설정과 보안 규칙을 확인해 줘.");}
}
async function signIn(){
 if(!state.configured){modal(true);updateAuthUI();setStatus("firebase-config.js에 Firebase 설정값을 먼저 넣어 줘.");return;}
 try{
  const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:"select_account"});
  await signInWithPopup(state.auth,provider);
 }catch(e){
  if(["auth/popup-blocked","auth/cancelled-popup-request"].includes(e?.code)){await signInWithRedirect(state.auth,new GoogleAuthProvider());return;}
  if(e?.code!=="auth/popup-closed-by-user")alert("Google 로그인 실패: "+(e?.message||e));
 }
}
async function saveNew(){
 if(!state.user)return signIn();
 const bridge=await waitBridge();
 const snapshot=bridge.getSnapshot();
 const suggested=`${snapshot.modeName||"라인업"} ${new Date().toLocaleDateString("ko-KR")}`;
 const name=(prompt("저장할 라인업 이름을 입력해 줘.",suggested)||"").trim();
 if(!name)return;
 setStatus("라인업 저장 중…");
 try{
  const ref=collection(state.db,"users",state.user.uid,"lineups");
  const snapshotJson=encodeSnapshot(snapshot);
  await addDoc(ref,{name,snapshotJson,snapshotSchema:snapshot.schema||"kbo-cloud-lineup-v1",mode:snapshot.mode,modeName:snapshot.modeName,playerCount:snapshot.playerCount,playerNames:snapshot.playerNames,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
  await refresh();
 }catch(e){console.error(e);alert("라인업 저장 실패: "+(e?.message||e));}
}
function findRow(id){return state.lineups.find(x=>x.id===id);}
async function loadRow(id){
 const row=findRow(id);if(!row)return;
 if(!confirm(`“${row.name}” 라인업을 현재 화면으로 불러올까?\n현재 저장하지 않은 변경사항은 사라질 수 있어.`))return;
 try{const bridge=await waitBridge(),snapshot=decodeSnapshot(row);if(!snapshot)throw new Error("저장된 라인업 데이터가 없어.");bridge.loadSnapshot(snapshot);modal(false);}catch(e){alert("라인업 불러오기 실패: "+(e?.message||e));}
}
async function overwriteRow(id){
 const row=findRow(id);if(!row||!confirm(`“${row.name}”을 현재 라인업 상태로 덮어쓸까?`))return;
 try{
  const bridge=await waitBridge(),snapshot=bridge.getSnapshot(),snapshotJson=encodeSnapshot(snapshot);
  await setDoc(doc(state.db,"users",state.user.uid,"lineups",id),{name:row.name,snapshotJson,snapshotSchema:snapshot.schema||"kbo-cloud-lineup-v1",mode:snapshot.mode,modeName:snapshot.modeName,playerCount:snapshot.playerCount,playerNames:snapshot.playerNames,createdAt:row.createdAt||serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
  await refresh();
 }catch(e){alert("덮어쓰기 실패: "+(e?.message||e));}
}
async function renameRow(id){
 const row=findRow(id);if(!row)return;const name=(prompt("새 라인업 이름",row.name)||"").trim();if(!name||name===row.name)return;
 try{await updateDoc(doc(state.db,"users",state.user.uid,"lineups",id),{name,updatedAt:serverTimestamp()});await refresh();}catch(e){alert("이름 변경 실패: "+(e?.message||e));}
}
async function copyRow(id){
 const row=findRow(id);if(!row)return;const name=(prompt("복사본 이름",`${row.name} 복사본`)||"").trim();if(!name)return;
 try{
  const ref=collection(state.db,"users",state.user.uid,"lineups");
  const snapshot=decodeSnapshot(row);if(!snapshot)throw new Error("복사할 라인업 데이터가 없어.");
  const snapshotJson=typeof row.snapshotJson==="string"?row.snapshotJson:encodeSnapshot(snapshot);
  const copy={name,snapshotJson,snapshotSchema:row.snapshotSchema||snapshot.schema||"kbo-cloud-lineup-v1",mode:row.mode||snapshot.mode||"",modeName:row.modeName||snapshot.modeName||"라인업",playerCount:row.playerCount??snapshot.playerCount??0,playerNames:row.playerNames||snapshot.playerNames||[],createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
  await addDoc(ref,copy);await refresh();
 }catch(e){alert("복사 실패: "+(e?.message||e));}
}
async function deleteRow(id){
 const row=findRow(id);if(!row||!confirm(`“${row.name}”을 삭제할까?`))return;
 try{await deleteDoc(doc(state.db,"users",state.user.uid,"lineups",id));await refresh();}catch(e){alert("삭제 실패: "+(e?.message||e));}
}
async function handleGridClick(e){
 const b=e.target.closest("[data-cloud-action]");if(!b)return;const {cloudAction,id}=b.dataset;
 if(cloudAction==="load")return loadRow(id);if(cloudAction==="overwrite")return overwriteRow(id);if(cloudAction==="rename")return renameRow(id);if(cloudAction==="copy")return copyRow(id);if(cloudAction==="delete")return deleteRow(id);
}
async function initCloud(){
 await waitBridge();
 $("cloudLoginBtn")?.addEventListener("click",signIn);
 $("cloudAccountBtn")?.addEventListener("click",()=>{modal(true);refresh();});
 $("cloudAccountCloseBtn")?.addEventListener("click",()=>modal(false));
 $("cloudAccountModal")?.addEventListener("click",e=>{if(e.target===$("cloudAccountModal"))modal(false);});
 $("cloudSaveNewBtn")?.addEventListener("click",saveNew);
 $("cloudRefreshBtn")?.addEventListener("click",refresh);
 $("cloudLogoutBtn")?.addEventListener("click",async()=>{if(state.auth)await signOut(state.auth);modal(false);});
 $("cloudLineupGrid")?.addEventListener("click",handleGridClick);
 if(!state.configured){updateAuthUI();renderLineups();return;}
 try{
  const app=initializeApp(firebaseConfig);state.auth=getAuth(app);state.db=getFirestore(app);await setPersistence(state.auth,browserLocalPersistence);
  onAuthStateChanged(state.auth,async user=>{state.user=user||null;updateAuthUI();if(user)await refresh();else{state.lineups=[];renderLineups();}});
  state.ready=true;
 }catch(e){console.error(e);state.configured=false;updateAuthUI();setStatus("Firebase 초기화에 실패했어. firebase-config.js 값을 확인해 줘.");}
}
initCloud();
