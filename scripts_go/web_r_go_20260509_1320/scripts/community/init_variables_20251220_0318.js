if (typeof url === "undefined" || url === null) {
  url = "all";
}
try {
  const p = window.location && window.location.pathname ? window.location.pathname : "";
  if (p === "/community" || p === "/community/") {
    url = "all";
  }
} catch (e) {
}
let header_title = "";
if (url == "all") {
  header_title = "\uCEE4\uBBA4\uB2C8\uD2F0";
} else if (url == "free") {
  header_title = "\uC790\uC720 \uAC8C\uC2DC\uD310 / \uBB3B\uACE0 \uB2F5\uD558\uAE30";
} else if (url == "rblogger") {
  header_title = "R-Blogger";
} else if (url == "notebook") {
  header_title = "Web-R Notebook";
} else if (url == "visitor") {
  header_title = "\uAC00\uC785 \uC778\uC0AC / \uBC29\uBA85\uB85D";
}
let header_subtitle = "\uCEE4\uBBA4\uB2C8\uD2F0";
let toggle_click_submit = false;
let editor = null;
