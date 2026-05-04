function waitForWebR(timeoutMs = 6e4) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    function check() {
      if (window.WebR)
        return resolve(window.WebR);
      if (performance.now() - start > timeoutMs)
        return reject(new Error("WebR failed to load (timeout)."));
      requestAnimationFrame(check);
    }
    check();
  });
}
let __cell_id_seq = 2;
function nextCellId() {
  __cell_id_seq += 1;
  return __cell_id_seq;
}
function syncCellIdSeqFromCells(cells) {
  try {
    if (!Array.isArray(cells) || cells.length === 0)
      return;
    const maxId = cells.reduce((m, c) => {
      const id = c && typeof c.id === "number" ? c.id : parseInt(c && c.id, 10);
      return Number.isFinite(id) ? Math.max(m, id) : m;
    }, 1);
    if (Number.isFinite(maxId) && maxId >= __cell_id_seq) {
      __cell_id_seq = maxId + 1;
    }
  } catch (e) {
  }
}
function renderMarkdown(md) {
  try {
    const html = marked.parse(md || "");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(wrapper, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
      }
    }
    return wrapper.innerHTML;
  } catch (e) {
    return `<pre style="white-space: pre-wrap;">${String(e)}</pre>`;
  }
}
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data && (data.err || data.msg) ? data.err || data.msg : "HTTP_" + res.status;
    throw new Error(msg);
  }
  return data;
}
function getCookie(name) {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return parts.pop().split(";").shift();
  } catch (e) {
  }
  return "";
}
function csrfToken() {
  return getCookie("csrftoken") || "";
}
const NOTEBOOK_API = {
  userinfo: "/account/ajax_get_userinfo/",
  login: "/account/ajax_signin_email/",
  logout: "/account/ajax_logout/",
  signup: "/account/ajax_signup/",
  send_auth_email: "/account/ajax_send_auth_email/",
  check_auth_code: "/account/ajax_check_auth_code/",
  password_change: "/account/ajax_password_change/",
  load: "/webr/ajax_get_notebook_data/",
  save: "/webr/ajax_save_notebook_data/",
  toggle_share: "/webr/ajax_toggle_notebook_share/"
};
async function apiGetUserInfo() {
  const res = await fetch(NOTEBOOK_API.userinfo, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    credentials: "include",
    cache: "no-store"
  });
  const data = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error("userinfo_error_" + res.status);
  if (!data || !data.email)
    return null;
  return data;
}
async function apiLogin(email, password) {
  const fd = new FormData();
  fd.append("txt_email", email);
  fd.append("txt_password", password);
  const res = await fetch(NOTEBOOK_API.login, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "include",
    cache: "no-store"
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    return { result: "fail", err: "login_error_" + res.status, raw: data };
  if (data && (data.checker === "DONE" || data.checker === "SUCCESS"))
    return { result: "ok", raw: data };
  if (data && data.checker === "WRONGPASSWORD")
    return { result: "fail", err: "\uBE44\uBC00\uBC88\uD638\uAC00 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.", raw: data };
  if (data && data.checker === "NOTEXIST")
    return { result: "fail", err: "\uACC4\uC815\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", raw: data };
  return { result: "fail", err: data && (data.err || data.msg) ? data.err || data.msg : "\uB85C\uADF8\uC778\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.", raw: data };
}
async function apiLogout() {
  const res = await fetch(NOTEBOOK_API.logout, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    credentials: "include",
    cache: "no-store"
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error("logout_error_" + res.status);
  return data;
}
async function apiSignup(payload) {
  const fd = new FormData();
  fd.append("txt_email", payload.email || "");
  fd.append("txt_password", payload.password || "");
  fd.append("txt_name", payload.nickname || "");
  fd.append("txt_realname", payload.realname || "");
  fd.append("sel_gender", payload.gender || "");
  const res = await fetch(NOTEBOOK_API.signup, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "include",
    cache: "no-store"
  });
  const text = await res.text().catch(() => "");
  if (!res.ok)
    return { result: "fail", err: "signup_error_" + res.status, raw: text };
  try {
    const data = JSON.parse(text);
    if (data && (data.checker === "SUCCESS" || data.result === "ok"))
      return { result: "ok", raw: data };
    return { result: "fail", err: data && (data.err || data.msg) ? data.err || data.msg : "\uD68C\uC6D0\uAC00\uC785\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.", raw: data };
  } catch (e) {
    if ((text || "").toUpperCase().indexOf("SUCCESS") >= 0)
      return { result: "ok", raw: text };
    return { result: "fail", err: "\uD68C\uC6D0\uAC00\uC785\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.", raw: text };
  }
}
async function apiSendAuthEmail(email) {
  const url = NOTEBOOK_API.send_auth_email + "?email=" + encodeURIComponent(email);
  const res = await fetch(url, { method: "GET", credentials: "include", cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    return { result: "fail", err: "mail_error_" + res.status, raw: data };
  if (data && data.exist === "NOTEXIST")
    return { result: "fail", err: "\uAC00\uC785\uD55C \uC774\uBA54\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4.", raw: data };
  if (data && data.code)
    return { result: "ok", raw: data };
  return { result: "ok", raw: data };
}
async function apiCheckAuthCode(authCode) {
  const fd = new FormData();
  fd.append("auth_code", authCode || "");
  return await fetchJson(NOTEBOOK_API.check_auth_code, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "include"
  });
}
async function apiPasswordChange(email, password) {
  const fd = new FormData();
  fd.append("email", email || "");
  fd.append("password", password || "");
  return await fetchJson(NOTEBOOK_API.password_change, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "include"
  });
}
function guessNotebookUUIDFromLocation() {
  try {
    const m = (location.pathname || "").match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return m ? m[0] : "";
  } catch (e) {
    return "";
  }
}
function getNotebookUUIDFromPayload(payload) {
  if (!payload)
    return "";
  if (typeof payload === "string")
    return payload;
  return payload.notebook_uuid || payload.notebookUUID || payload.notebookUuid || payload.uuid || payload.notebook_id || payload.notebookId || window.NOTEBOOK_UUID || window.notebook_uuid || guessNotebookUUIDFromLocation();
}
window.apiLoadNotebook = async function apiLoadNotebook(notebook_id_like) {
  const notebook_id = getNotebookUUIDFromPayload({ notebook_id: notebook_id_like }) || notebook_id_like || guessNotebookUUIDFromLocation();
  const fd = new FormData();
  fd.append("notebook_id", notebook_id);
  return await fetchJson(NOTEBOOK_API.load, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "include",
    cache: "no-store"
  });
};
window.apiSaveNotebook = async function apiSaveNotebook(arg1, arg2, arg3) {
  let payload = null;
  if (typeof arg1 === "object" && arg1 !== null && typeof arg2 === "undefined") {
    payload = arg1;
  } else {
    payload = { notebook_uuid: arg1, title: arg2 };
    if (typeof arg3 === "object" && arg3 !== null && !Array.isArray(arg3)) {
      Object.assign(payload, arg3);
    } else if (typeof arg3 !== "undefined") {
      payload.data_meta = arg3;
    }
  }
  if (!(payload && payload._skip_confirm === true)) {
    const ok = window.confirm("\uD604\uC7AC \uB178\uD2B8\uBD81\uC744 \uC800\uC7A5\uD560\uAE4C\uC694?");
    if (!ok)
      return { ok: false, auth: true, msg: "cancelled" };
  }
  const notebook_uuid = getNotebookUUIDFromPayload(payload);
  let title = payload && payload.title || "";
  if (!title || !String(title).trim().length)
    title = guessNotebookTitleFromDOM();
  function toJsonStringSafe(v, fallbackJson) {
    try {
      if (v === null || typeof v === "undefined")
        return fallbackJson;
      if (typeof v === "string") {
        const t = v.trim();
        const s = t.length ? t : fallbackJson;
        JSON.parse(s);
        return s;
      }
      return JSON.stringify(v);
    } catch (e) {
      return fallbackJson;
    }
  }
  const data_markdown = toJsonStringSafe(payload.data_markdown, "[]");
  const data_rcode = toJsonStringSafe(payload.data_rcode, "[]");
  const data_rcode_result = toJsonStringSafe(payload.data_rcode_result, "[]");
  const data_data = toJsonStringSafe(payload.data_data, "[]");
  const data_rpackage = toJsonStringSafe(payload.data_rpackage, "[]");
  const data_meta = toJsonStringSafe(payload.data_meta, "{}");
  const fd = new FormData();
  fd.append("notebook_uuid", notebook_uuid);
  fd.append("title", title);
  fd.append("data_markdown", data_markdown);
  fd.append("data_rcode", data_rcode);
  fd.append("data_rcode_result", data_rcode_result);
  fd.append("data_data", data_data);
  fd.append("data_rpackage", data_rpackage);
  fd.append("data_meta", data_meta);
  const shareValue = payload.share === 2 || payload.share === "2" ? 2 : payload.share === 1 || payload.share === "1" || payload.share === true ? 1 : payload.share === 0 || payload.share === "0" || payload.share === false ? 0 : null;
  if (shareValue !== null) {
    fd.append("share", String(shareValue));
  }
  const autosaveValue = payload.autosave === 1 || payload.autosave === "1" || payload.autosave === true ? 1 : 0;
  if (autosaveValue === 1) {
    fd.append("autosave", "1");
  }
  return await fetchJson(NOTEBOOK_API.save, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "include",
    cache: "no-store"
  });
};
function guessNotebookTitleFromDOM() {
  try {
    const titleInputCandidates = Array.from(document.querySelectorAll('input[type="text"]')).filter((el) => el).filter((el) => !(el.getAttribute("placeholder") || "").trim().length).filter((el) => el.offsetParent !== null);
    const wide = titleInputCandidates.map((el) => ({ el, w: el.getBoundingClientRect().width })).sort((a, b) => b.w - a.w)[0];
    if (wide && wide.el) {
      const v = (wide.el.value || "").trim();
      if (v.length)
        return v;
      const dv = (wide.el.defaultValue || "").trim();
      if (dv.length)
        return dv;
    }
    const byName = titleInputCandidates.find((el) => /title/i.test(el.name || "")) || titleInputCandidates.find((el) => /title/i.test(el.id || ""));
    if (byName) {
      const v = (byName.value || "").trim();
      if (v.length)
        return v;
    }
    const header = document.querySelector("h1, h2");
    if (header && (header.textContent || "").trim())
      return header.textContent.trim();
    if ((document.title || "").trim())
      return document.title.trim();
  } catch (e) {
  }
  return "";
}
function uint8ToBase64(uint8) {
  let binary = "";
  const chunkSize = 32768;
  for (let i = 0; i < uint8.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, uint8.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}
function base64ToUint8(b64) {
  const binary = atob(b64 || "");
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++)
    bytes[i] = binary.charCodeAt(i);
  return bytes;
}
function toSafeRVarBase(filename) {
  const base = (filename || "data").replace(/^.*[\\/]/, "").replace(/\.[^.]+$/, "");
  const safe = base.replace(/[^A-Za-z0-9_]/g, "_").replace(/^([0-9])/, "_$1");
  return safe || "data";
}
function makeUniqueFilename(name, existingNames) {
  const names = new Set(existingNames || []);
  if (!names.has(name))
    return name;
  const m = name.match(/^(.*?)(\.[^.]+)?$/);
  const stem = m && m[1] ? m[1] : name;
  const ext = m && m[2] ? m[2] : "";
  let n = 2;
  while (true) {
    const candidate = `${stem} (${n})${ext}`;
    if (!names.has(candidate))
      return candidate;
    n += 1;
  }
}
function makeUniqueRVar(base, existingVars) {
  const vars = new Set(existingVars || []);
  if (!vars.has(base))
    return base;
  let n = 2;
  while (true) {
    const candidate = `${base}_${n}`;
    if (!vars.has(candidate))
      return candidate;
    n += 1;
  }
}
async function apiToggleNotebookShare(notebook_uuid, share) {
  const shareValue = share === 2 || share === "2" ? 2 : share === 1 || share === "1" || share === true ? 1 : 0;
  const body = new URLSearchParams();
  body.append("notebook_uuid", notebook_uuid);
  body.append("notebook_id", notebook_uuid);
  body.append("share", String(shareValue));
  console.log("[Share] POST toggle_share", { notebook_uuid, shareValue });
  return await fetchJson(NOTEBOOK_API.toggle_share, {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken(), "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    credentials: "include",
    cache: "no-store",
    body: body.toString()
  });
}
window.apiToggleNotebookShare = apiToggleNotebookShare;
