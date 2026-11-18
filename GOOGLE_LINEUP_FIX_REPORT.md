# v15.4.12 Google 라인업 호환 보완

## v15.4.11에서 실제로 남아 있던 문제
`index.html`이 `bootstrap.js?v=15.4.8-...`를 계속 참조하고 있어, 브라우저가 이전 bootstrap.js를 캐시에서 재사용할 수 있었습니다. 이 경우 v15.4.11의 `legacy-player-id-map.js` 로딩 단계가 실행되지 않아, 구버전 ID `site-01009`가 새 ID로 변환되지 않습니다.

## 수정
- `index.html`의 bootstrap 쿼리 버전을 v15.4.12로 변경
- `bootstrap.js`의 map/app 스크립트 캐시 키를 v15.4.12로 변경
- 앱 시작 전 구버전 ID 연결표 로드 여부 및 `site-01009` 대표 매핑 존재 여부를 확인하도록 보완
- 선수 데이터와 기존 Firebase 라인업 저장본은 변경하지 않음

## 확인
- `site-01009` → `excel-20365` 매핑 존재 확인
- `players.json`에 `excel-20365` / `이진영B` 존재 확인
- importLineupData가 ID가 현재 데이터에 없을 때 legacy map을 통해 새 ID를 조회하는 코드 경로 확인
- 브라우저 캐시 갱신 대상인 index.html, bootstrap.js, app.js, legacy-player-id-map.js를 패치에 포함

실제 사용자의 Google 계정에 접속한 실서비스 테스트는 수행하지 않았습니다.
