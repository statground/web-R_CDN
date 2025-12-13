/**
 * utils_20251213_1301.js
 * ✅ 핵심 수정:
 * - fetchJson signature는 (url, options=RequestInit) 2-인자
 * - apiLoadNotebook/apiSaveNotebook를 window 전역으로 등록
 * - notebook_uuid 누락 문제 해결: payload 다양한 키/URL에서 UUID 추출
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

const NOTEBOOK_API = {
  userinfo: "/account/ajax_get_userinfo/",
  login: "/account/ajax_signin_email/",
  logout: "/account/ajax_logout/",
  load: "/webr/ajax_get_notebook_data/",
  save: "/webr/ajax_save_notebook_data/",
};

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

/** URL에서 UUID(36) 추출 */
function guessNotebookUUIDFromLocation() {
  try {
    const m = (location.pathname || "").match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return m ? m[0] : "";
  } catch (e) {
    return "";
  }
}

/** 다양한 형태의 payload에서 notebook uuid 확보 */
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
 * ✅ Notebook Load
 * backend expects: notebook_id
 */
window.apiLoadNotebook = async function apiLoadNotebook(notebook_id_like) {
  const notebook_id = getNotebookUUIDFromPayload({ notebook_id: notebook_id_like }) || notebook_id_like || guessNotebookUUIDFromLocation();

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
 * ✅ Notebook Save
 * backend expects: notebook_uuid, title, data(JSON string)
 */
window.apiSaveNotebook = async function apiSaveNotebook(payload) {
  const notebook_uuid = getNotebookUUIDFromPayload(payload);
  const title = (payload && (payload.title || payload.notebook_title)) || "";
  const data = (payload && (payload.data || payload.notebook_data || payload.json)) || "";

  const fd = new FormData();
  fd.append("notebook_uuid", notebook_uuid);
  fd.append("title", title);
  fd.append("data", data);

  return await fetchJson(NOTEBOOK_API.save, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "same-origin",
    cache: "no-store",
  });
};
