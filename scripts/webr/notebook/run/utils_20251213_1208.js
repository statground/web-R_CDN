/** 
 * WebR 로딩을 기다리는 헬퍼 함수
 */
function waitForWebR(timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      if (window.WebR) {
        resolve(window.WebR);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error("WebR load timeout."));
        return;
      }
      requestAnimationFrame(check);
    }
    check();
  });
}

/**
 * Cookie 읽기
 */
function getCookie(name) {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  } catch (e) {}
  return "";
}

/**
 * CSRF Token
 */
function csrfToken() {
  return getCookie("csrftoken") || "";
}

/**
 * Markdown 렌더링
 * - marked + katex auto-render
 */
function renderMarkdown(mdText) {
  try {
    const html = marked.parse(mdText || "");
    return html;
  } catch (e) {
    return "<pre>" + String(e) + "</pre>";
  }
}

/**
 * Notebook API 경로
 * ✅ urls.py에서 유지하는 /webr/ajax_* 엔드포인트를 그대로 사용
 */
const NOTEBOOK_API = {
  userinfo: "/account/ajax_get_userinfo/",
  login: "/account/ajax_signin_email/",
  logout: "/account/ajax_logout/",
  load: "/webr/ajax_get_notebook_data/",
  save: "/webr/ajax_save_notebook_data/",
};

/**
 * 로그인 유저 정보
 */
async function apiGetUserInfo() {
  const res = await fetch(NOTEBOOK_API.userinfo, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error("userinfo_error_" + res.status);
  if (!data || !data.email) return null;
  return data;
}

/**
 * 로그인
 */
async function apiLogin(email, password) {
  const fd = new FormData();
  fd.append("txt_email", email);
  fd.append("txt_password", password);

  const res = await fetch(NOTEBOOK_API.login, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "same-origin",
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("login_error_" + res.status);
  return data;
}

/**
 * 로그아웃
 */
async function apiLogout() {
  const res = await fetch(NOTEBOOK_API.logout, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("logout_error_" + res.status);
  return data;
}

/**
 * ✅ Notebook 불러오기 (DB)
 * - notebook_id: uuid 또는 uuid_share
 */
async function apiLoadNotebook(notebook_id) {
  const fd = new FormData();
  fd.append("notebook_id", notebook_id);

  const res = await fetch(NOTEBOOK_API.load, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "same-origin",
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("load_error_" + res.status);
  return data;
}

/**
 * ✅ Notebook 저장 (DB)
 * - notebook_uuid: uuid(작성자 소유 노트만 저장 가능)
 * - title: 제목
 * - data: JSON string
 */
async function apiSaveNotebook(notebook_uuid, title, dataStr) {
  const fd = new FormData();
  fd.append("notebook_uuid", notebook_uuid);
  fd.append("title", title || "");
  fd.append("data", dataStr || "");

  const res = await fetch(NOTEBOOK_API.save, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "same-origin",
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("save_error_" + res.status);
  return data;
}

/**
 * HTML 이스케이프
 */
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
