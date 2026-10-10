(()=>{
  const waitForImporter=(tries=0)=>{
    if(typeof window.importLineupFile!=='function'){
      if(tries<120)return setTimeout(()=>waitForImporter(tries+1),100);
      console.warn('라인업 가져오기 보정 패치: importLineupFile을 찾지 못했습니다.');return;
    }
    if(window.__KBO_LINEUP_IMPORT_GUARD_V153__)return;
    const original=window.importLineupFile;
    window.importLineupFile=async function(input){
      try{
        const file=input&&input.files&&input.files[0];
        if(file){
          const h=new Uint8Array(await file.slice(0,16).arrayBuffer());
          const jpeg=h.length>=3&&h[0]===0xFF&&h[1]===0xD8&&h[2]===0xFF;
          const png=h.length>=8&&h[0]===0x89&&h[1]===0x50&&h[2]===0x4E&&h[3]===0x47;
          const zip=h.length>=4&&h[0]===0x50&&h[1]===0x4B&&h[2]===0x03&&h[3]===0x04;
          if(jpeg||png){
            alert('가져오기에 실패했어요. 선택한 파일은 라인업 JSON이 아니라 사진(JPEG/PNG)입니다.\\n\\n라인업 내보내기로 생성된 원본 .json 파일을 선택해 주세요. 사진 파일에서는 라인업 데이터를 복구할 수 없습니다.');
            if(input)input.value='';return;
          }
          if(zip){
            alert('ZIP 파일은 바로 가져올 수 없어요. 압축을 풀고 안에 있는 라인업 .json 파일을 선택해 주세요.');
            if(input)input.value='';return;
          }
        }
      }catch(e){console.warn('라인업 파일 형식 확인을 건너뜁니다.',e);}
      return original.apply(this,arguments);
    };
    window.__KBO_LINEUP_IMPORT_GUARD_V153__=true;
  };
  waitForImporter();
})();
