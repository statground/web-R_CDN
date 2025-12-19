// scripts/community/init_variables.js (patched: default tab to 'all' on /community/)
if (typeof url === "undefined" || url === null) {
  url = "all";
}

// 루트(/community/)에서는 기본 탭을 '전체보기'로
try {
  const p = window.location && window.location.pathname ? window.location.pathname : "";
  if (p === "/community" || p === "/community/") {
    url = "all";
  }
} catch (e) {}

let header_title = "";
if (url == "all") { header_title = "커뮤니티"; }
else if (url == "free") { header_title = "자유 게시판 / 묻고 답하기"; }
else if (url == "rblogger") { header_title = "R-Blogger"; }
else if (url == "notebook") { header_title = "Web-R Notebook"; }
else if (url == "visitor") { header_title = "가입 인사 / 방명록"; }
let header_subtitle = "커뮤니티";

let toggle_click_submit = false;
let editor = null;