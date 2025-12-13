/**
 * WebR 로딩을 기다리는 헬퍼 함수
 */
function waitForWebR(timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    function check() {
      if (window.WebR) return resolve(window.WebR);
      if (performance.now() - start > timeoutMs) {
        return reject(new Error("WebR failed to load (timeout)."));
      }
      requestAnimationFrame(check);
    }
    check();
  });
}

/**
 * 셀 ID 생성기 (전역 증가)
 */
let __cell_id_seq = 2;
function nextCellId() {
  __cell_id_seq += 1;
  return __cell_id_seq;
}

/**
 * Markdown 렌더링 + KaTeX 자동 렌더
 * - marked로 HTML 변환
 * - KaTeX auto-render로 수식 렌더
 */
function renderMarkdown(md) {
  try {
    const html = marked.parse(md || "");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    // KaTeX 렌더링(스크립트 로드되어 있는 경우)
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(wrapper, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
          throwOnError: false,
        });
      } catch (e) {
        // KaTeX 실패해도 마크다운 자체는 표시
      }
    }

    return wrapper.innerHTML;
  } catch (e) {
    return `<pre style="white-space: pre-wrap;">${String(e)}</pre>`;
  }
}

/**
 * (옵션) fetch JSON helper
 */
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return data;
}

/**
 * CSRF helper (Django)
 */
function getCookie(name) {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  } catch (e) {}
  return "";
}
function csrfToken() {
  return getCookie("csrftoken") || "";
}

/**
 * Notebook Ajax Endpoint (Django)
 * - 원본 run.html에 있던 경로 유지
 */
const NOTEBOOK_API = {
  userinfo: "/account/ajax_get_userinfo/",
  login: "/account/ajax_signin_email/",
  logout: "/account/ajax_logout/",
  load: "/webr/ajax_get_notebook_data/",
  save: "/webr/ajax_save_notebook_data/",
};

/**
 * (옵션) 로그인 사용자 정보 가져오기
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
 * (옵션) 로그인
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
 * (옵션) 로그아웃
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