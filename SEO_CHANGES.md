# Google 검색 최적화 변경 사항

기존 사이트 기능과 카드 데이터는 삭제하지 않고 구조만 최적화했습니다.

- 전체 카드: **8,982장**
- LIVE: **2,791장**
- LIVE 올스타: **272장**
- 임팩트: **3,678장**
- 시그니처: **1,287장**
- 국가대표: **601장**
- 골든글러브: **353장**

## 변경
1. `index.html` 내부의 선수 데이터 8,982장을 `data/players.json`으로 분리했습니다.
2. 기존 앱 로직을 `app.js`로 분리하고 `bootstrap.js`에서 선수 데이터를 먼저 읽은 뒤 앱을 실행합니다.
3. `baseball-field.png`는 파일명이 PNG였지만 실제 내용이 JPEG였던 것을 확인해, **실제 PNG 형식으로 변환**했습니다.
4. `sitemap.xml`을 추가했습니다.
5. 기존 canonical, Open Graph 이미지 주소와 GitHub Pages 주소는 유지했습니다.

## 배포 후 Search Console
- URL 검사: `https://lbhbase-web.github.io/kbo-squademaker/`
- 사이트맵 제출: `https://lbhbase-web.github.io/kbo-squademaker/sitemap.xml`
