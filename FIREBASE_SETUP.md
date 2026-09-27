# Google 로그인 + 내 라인업 보관함 설정

이 버전은 Firebase Authentication(Google) + Cloud Firestore를 사용합니다.

## 1. Firebase 프로젝트 만들기
1. Firebase Console에서 프로젝트 생성
2. 웹 앱(</>) 추가
3. 표시되는 `firebaseConfig` 값을 이 프로젝트의 `firebase-config.js`에 복사

## 2. Google 로그인 켜기
Firebase Console → Authentication → Sign-in method → Google 활성화.
Authentication 설정의 Authorized domains에 실제 서비스 호스트를 등록하세요.
- `lbhbase-web.github.io`
- `kbo-squadmaker.vercel.app`
- 사용하는 다른 커스텀 도메인이 있다면 그 호스트도 추가

## 3. Firestore 만들기
Firebase Console → Firestore Database → 데이터베이스 생성.

## 4. 보안 규칙 적용
`firestore.rules`의 내용을 Firestore → Rules에 붙여넣고 게시하세요.
이 규칙은 로그인한 사용자가 자신의 `users/{uid}/lineups/*` 문서만 읽고/쓰게 합니다.

## 5. 배포
`firebase-config.js`, `cloud-lineups.js`를 포함해 ZIP 안의 파일 전체를 기존 GitHub Pages/Vercel 프로젝트에 덮어씁니다.

## 동작
- Google 로그인
- 계정 버튼 → 내 라인업 보관함
- 사이트 자체 저장 개수 제한 없음
- 새 라인업 저장 / 불러오기 / 현재 상태로 덮어쓰기 / 이름 변경 / 복사 / 삭제
- 저장 데이터는 카드 ID와 라인업·육성 상태 중심이라, 사이트에 새 카드가 추가되어도 기존 저장 라인업을 열고 새 카드를 검색해 교체·추가할 수 있음

> 참고: 실제 사용 가능량은 Firebase/Firestore 요금제·쿼터의 영향을 받습니다.
