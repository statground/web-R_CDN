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

  if (data && data.err) console.error("[fetchJson err]", data.err, data);
  if (data && data.msg && data.msg !== "ok") console.warn("[fetchJson msg]", data.msg, data);

  if (!res.ok) {
    const msg = (data && (data.err || data.msg)) ? (data.err || data.msg) : ("HTTP_" + res.status);
    throw new Error(msg);
  }
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

/* ------------------------------------------------------------------
 * ✅ Notebook Load/Save 전역 함수 복구 (필수)
 * - app_*.js(Notebook 컴포넌트)가 전역 함수로 호출
 * - fetchJson(url, options) 시그니처에 맞게 RequestInit 전달
 * ------------------------------------------------------------------ */

/** URL에서 UUID(36) 추출 */
function guessNotebookUUIDFromLocation() {
  try {
    const m = (location.pathname || "").match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return m ? m[0] : "";
  } catch (e) {
    return "";
  }
}

/** payload에서 uuid 후보를 최대한 찾아서 반환 */
function getNotebookUUIDFromPayload(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;

  return (
    payload.notebook_uuid ||
    payload.notebookUUID ||
    payload.notebookUuid ||
    payload.uuid ||
    payload.notebook_id ||
    payload.notebookId ||
    window.NOTEBOOK_UUID ||
    window.notebook_uuid ||
    guessNotebookUUIDFromLocation()
  );
}

/**
 * Notebook Load (DB)
 * backend expects: notebook_id
 */
window.apiLoadNotebook = async function apiLoadNotebook(notebook_id_like) {
  const notebook_id =
    getNotebookUUIDFromPayload({ notebook_id: notebook_id_like }) ||
    notebook_id_like ||
    guessNotebookUUIDFromLocation();

  const fd = new FormData();
  fd.append("notebook_id", notebook_id);

  return await fetchJson(NOTEBOOK_API.load, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "same-origin",
    cache: "no-store",
  });
};

/**
 * Notebook Save (DB)
 * backend expects: notebook_uuid, title, data(JSON string)
 */
window.apiSaveNotebook = async function apiSaveNotebook(payload) {
  const notebook_uuid = getNotebookUUIDFromPayload(payload);
  let title = (payload && (payload.title || payload.notebook_title || payload.notebookTitle || (payload.meta && payload.meta.title))) || "";
  if (!title || !String(title).trim().length) title = guessNotebookTitleFromDOM();

  // ✅ data는 반드시 "JSON 문자열"이어야 함
  // - payload.data가 object/array인 경우: FormData에 들어가면 "[object Object]"가 되어 invalid_json_data 발생
  // - payload.data가 빈 문자열/undefined인 경우: 백엔드에서 json.loads 실패하므로 기본값 "[]"
  let dataRaw = (payload && (payload.data || payload.notebook_data || payload.json)) ?? "";
  let dataJson = "";

  // ✅ payload에 data가 없더라도, payload 자체가 저장할 내용(cells/source 등)을 들고 오는 경우가 있음.
  // 이때 dataRaw를 payload로 대체해서 저장이 []로 떨어지지 않게 한다.
  if ((dataRaw === "" || dataRaw === null || typeof dataRaw === "undefined") && payload && typeof payload === "object") {
    // cells/source/mode 같은 키가 있으면 notebook 상태로 간주
    const hasNotebookShape =
      Array.isArray(payload.cells) ||
      typeof payload.darkMode !== "undefined" ||
      typeof payload.timestamp !== "undefined" ||
      typeof payload.version !== "undefined" ||
      typeof payload.mode !== "undefined" ||
      typeof payload.source !== "undefined";

    if (hasNotebookShape) dataRaw = payload;
  }

  try {
    if (typeof dataRaw === "string") {
      const t = dataRaw.trim();
      dataJson = t.length ? t : "[]";
      // 문자열이지만 JSON이 아닐 수도 있으니 한 번 검증
      JSON.parse(dataJson);
    } else {
      // object / array / number / boolean / null
      dataJson = JSON.stringify(dataRaw ?? []);
    }
  } catch (e) {
    // 최후의 안전장치: 최소 저장 형식 확보
    dataJson = "[]";
  }

  const fd = new FormData();
  fd.append("notebook_uuid", notebook_uuid);
  fd.append("title", title);
  fd.append("data", dataJson);
return await fetchJson(NOTEBOOK_API.save, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "same-origin",
    cache: "no-store",
  });
};


/** 화면에서 노트북 제목을 최대한 찾아오기 (payload에 title이 없을 때) */
function guessNotebookTitleFromDOM() {
  try {
    // ✅ 1순위: 상단 제목 입력창 (placeholder 없음 + 비교적 넓은 input)
    const titleInputCandidates = Array.from(document.querySelectorAll('input[type="text"]'))
      .filter((el) => el)
      .filter((el) => !(el.getAttribute("placeholder") || "").trim().length)
      .filter((el) => (el.offsetParent !== null)); // 화면에 보이는 것만

    // 넓은 input(제목창) 우선
    const wide = titleInputCandidates
      .map((el) => ({ el, w: el.getBoundingClientRect().width }))
      .sort((a, b) => b.w - a.w)[0];

    if (wide && wide.el) {
      const v = (wide.el.value || "").trim();
      if (v.length) return v;
      const dv = (wide.el.defaultValue || "").trim();
      if (dv.length) return dv;
    }

    // ✅ 2순위: id/name에 title 포함
    const byName = titleInputCandidates.find((el) => /title/i.test(el.name || "")) ||
                   titleInputCandidates.find((el) => /title/i.test(el.id || ""));
    if (byName) {
      const v = (byName.value || "").trim();
      if (v.length) return v;
    }

    // ✅ 3순위: 헤더 텍스트(h1/h2)
    const header = document.querySelector("h1, h2");
    if (header && (header.textContent || "").trim()) return header.textContent.trim();

    // ✅ 4순위: 문서 title
    if ((document.title || "").trim()) return document.title.trim();
  } catch (e) {}
  return "";
}
