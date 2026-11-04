# 중랑구발달장애인평생교육센터 홈페이지

빌드 과정이 없는 정적 사이트입니다. Vercel에 그대로 배포됩니다.

## 구성
- `index.html` — 연혁 페이지
- `data/history.js` — **연혁 데이터** (여기만 수정하면 됩니다)
- `images/history/` — 연혁 사진 (`연도-월일.jpg`)
- `assets/style.css`, `assets/app.js` — 디자인/동작

## 연혁 추가·수정
`data/history.js`에서 해당 연도의 `items`에 한 줄 추가합니다.

```js
{ "date": "11.04", "text": "「새 사업명」 진행", "image": "images/history/2026-1104.jpg" }
```

사진은 `images/history/`에 넣고 `image`에 경로를 적습니다. 사진이 없으면 `image` 줄은 빼면 됩니다.
사진을 누르면 크게 볼 수 있습니다.

새 연도는 `{ "year": 2027, "items": [ ... ] }` 블록을 추가하면 탭이 자동으로 생깁니다.
업무협약 / 선정·입상 / 발간·보도 / 그 외(사업·행사) 분류는 내용의 키워드로 자동 지정됩니다.

## Vercel 연결
1. https://vercel.com/new 접속 → GitHub 계정으로 로그인
2. `jungnang-homepage1` 저장소 **Import**
3. Framework Preset: **Other**, Build Command·Output Directory는 비워둔 채 **Deploy**

이후 GitHub에 push할 때마다 자동으로 재배포됩니다.

## 링크 공유 미리보기 (카카오톡 등)
- 미리보기 이미지: `assets/og-image.jpg` (1200×630)
- 제목·설명: `index.html`의 `og:title`, `og:description`
- 배포 시 `scripts/set-site-url.js`가 미리보기 주소를 Vercel 대표 도메인으로 자동 설정합니다.
  다른 도메인(예: 기관 도메인)을 쓰면 Vercel 프로젝트 Settings → Environment Variables에 `SITE_URL`을 추가하세요.
- 카카오톡은 미리보기를 캐시하므로, 바뀐 내용이 안 보이면 https://developers.kakao.com/tool/debugger/sharing 에서 주소를 넣고 **캐시 초기화**를 누르세요.
배포
