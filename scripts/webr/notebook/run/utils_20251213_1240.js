/**
 * (일부만 발췌/수정) - 기존 파일 덮어쓰기용
 * ✅ 목적:
 * 1) Save/Load 응답에 err가 있을 때 콘솔에 출력
 * 2) Save/Load 실패 시 msg/err를 최대한 노출
 *
 * ⚠️ NOTEBOOK_API 경로는 유지: /webr/ajax_get_notebook_data/, /webr/ajax_save_notebook_data/
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
  if (data && data.err) console.error("[Notebook Load err]", data.err, data);
  if (!res.ok) throw new Error((data && (data.err || data.msg)) ? (data.err || data.msg) : ("load_error_" + res.status));
  return data;
}

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
  if (data && data.err) console.error("[Notebook Save err]", data.err, data);
  if (!res.ok) throw new Error((data && (data.err || data.msg)) ? (data.err || data.msg) : ("save_error_" + res.status));
  return data;
}
