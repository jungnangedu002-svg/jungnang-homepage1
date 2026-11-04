// Vercel 배포 시 실행: 공유 미리보기(og:url, og:image) 주소를 절대 주소로 바꿉니다.
// 카카오톡 등은 https:// 로 시작하는 전체 주소만 인식하기 때문입니다.
// 주소 우선순위: SITE_URL 환경변수 → Vercel 대표 도메인(VERCEL_PROJECT_PRODUCTION_URL)
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(file, "utf8");

// 1) 배포마다 CSS·JS·연혁 데이터 주소에 버전을 붙여, 브라우저(카카오톡 인앱 브라우저 포함)가
//    예전 파일을 캐시에서 보여주지 않고 항상 최신 내용을 불러오게 합니다.
const version = (process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString(36)).slice(0, 8);
html = html.replace(/((?:src|href)="(?:assets|data)\/[^"?]+\.(?:js|css))(\?v=[^"]*)?"/g, '$1?v=' + version + '"');
console.log("[set-site-url] 파일 버전: " + version);

// 2) 공유 미리보기 주소를 절대 주소로
const raw = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
if (raw) {
  const site = (/^https?:\/\//.test(raw) ? raw : "https://" + raw).replace(/\/+$/, "");
  html = html.replace(
    /(<meta (?:property|name)="(?:og:url|og:image|twitter:image)" content=")\/([^"]*)"/g,
    (_, head, rest) => head + site + "/" + rest + '"'
  );
  console.log("[set-site-url] " + site + " 로 설정했습니다.");
} else {
  console.log("[set-site-url] 사이트 주소를 찾지 못해 미리보기 주소는 그대로 둡니다.");
}

fs.writeFileSync(file, html);
