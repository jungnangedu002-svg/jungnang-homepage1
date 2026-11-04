// Vercel 배포 시 실행: 공유 미리보기(og:url, og:image) 주소를 절대 주소로 바꿉니다.
// 카카오톡 등은 https:// 로 시작하는 전체 주소만 인식하기 때문입니다.
// 주소 우선순위: SITE_URL 환경변수 → Vercel 대표 도메인(VERCEL_PROJECT_PRODUCTION_URL)
const fs = require("fs");
const path = require("path");

const raw = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
if (!raw) {
  console.log("[set-site-url] 사이트 주소를 찾지 못해 그대로 둡니다.");
  process.exit(0);
}
const site = (/^https?:\/\//.test(raw) ? raw : "https://" + raw).replace(/\/+$/, "");

const file = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(file, "utf8").replace(
  /(<meta (?:property|name)="(?:og:url|og:image|twitter:image)" content=")\/([^"]*)"/g,
  (_, head, rest) => head + site + "/" + rest + '"'
);
fs.writeFileSync(file, html);
console.log("[set-site-url] " + site + " 로 설정했습니다.");
