v13.3 선수사진 임베디드 패치

1. BASE 패치의 index.html / bootstrap.js / VERSION.txt / player-photo-loader.js / player-photo-runtime-patch.js 를 저장소 루트에 덮어쓰기/추가합니다.
2. 구단별 ZIP에서 player-photo-*.js를 꺼내 저장소 루트에 추가합니다.
3. 사진은 Base64로 각 JS 안에 들어 있으므로 별도 player-photos 폴더는 필요 없습니다.
4. 구단 사진 JS는 필요할 때만 지연 로드되어 태블릿에서 처음부터 60MB 이상을 한꺼번에 읽지 않습니다.
