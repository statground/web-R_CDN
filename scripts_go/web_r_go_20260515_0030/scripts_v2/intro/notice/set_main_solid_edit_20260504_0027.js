let init_url = "/intro/notice/";
function refresh_article_rblogger() {
  return null;
}
function getNoticeMode() {
  if (typeof mode === "undefined" || mode == null || mode === "None") {
    return "";
  }
  return String(mode).trim().toLowerCase();
}
function normalizeNoticeRoute() {
  if (typeof sub === "undefined") {
    sub = null;
  }
  if (typeof url === "undefined" || url == null || url === "" || url === "None") {
    url = "notice";
  }
  if (url !== "notice") {
    url = "notice";
  }
  if (typeof orderID !== "undefined" && (orderID === "None" || orderID === "")) {
    orderID = null;
  }
  init_url = "/intro/notice/";
}
function createNoticeEditorFallback(textarea) {
  return {
    getHTML: () => textarea ? textarea.value : "",
    setHTML: (html) => {
      if (textarea) {
        textarea.value = html || "";
      }
    }
  };
}
function createNoticeEditorFallbackInHost(host, initialHTML = "") {
  if (!host) {
    return null;
  }
  host.innerHTML = "";
  const textarea = document.createElement("textarea");
  textarea.id = "txt_content";
  textarea.name = "txt_content";
  textarea.className = "w-full min-h-[500px] rounded-lg border border-gray-300 p-4 text-sm";
  textarea.setAttribute("rows", "18");
  textarea.setAttribute("placeholder", "\uACF5\uC9C0 \uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
  textarea.value = initialHTML || "";
  host.appendChild(textarea);
  return createNoticeEditorFallback(textarea);
}
function getNoticeStorageKey() {
  const currentMode = getNoticeMode() || "write";
  const articleID = typeof orderID === "undefined" || orderID == null || orderID === "" || orderID === "None" ? "new" : orderID;
  return ["web-r", "intro", "notice", currentMode, articleID].join(":");
}
async function mountSolidNoticeEditor(initialHTML = null) {
  const host = document.getElementById("div_editor");
  if (!host) {
    return null;
  }
  const editorOptions = {
    placeholder: "\uACF5\uC9C0 \uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
    storageKey: getNoticeStorageKey(),
    textareaID: "txt_content",
    textareaName: "txt_content",
    restoreDraft: getNoticeMode() !== "edit",
    ribbonExpanded: false
  };
  if (typeof initialHTML === "string") {
    editorOptions.html = initialHTML;
  }
  if (window.WebRSolidEditor && typeof window.WebRSolidEditor.mountHost === "function") {
    return await window.WebRSolidEditor.mountHost(host, editorOptions);
  }
  return createNoticeEditorFallbackInHost(host, typeof initialHTML === "string" ? initialHTML : "");
}
function getNoticeEditorHTML(editorInstance) {
  if (window.WebRSolidEditor && typeof window.WebRSolidEditor.getHTML === "function") {
    return window.WebRSolidEditor.getHTML(editorInstance);
  }
  if (editorInstance && typeof editorInstance.__hostMirrorNow === "function") {
    return editorInstance.__hostMirrorNow(true);
  }
  if (editorInstance && typeof editorInstance.getHTML === "function") {
    return editorInstance.getHTML();
  }
  const textarea = document.getElementById("txt_content");
  return textarea ? textarea.value : "";
}
function setNoticeEditorHTML(editorInstance, html) {
  if (window.WebRSolidEditor && typeof window.WebRSolidEditor.setHTML === "function") {
    if (window.WebRSolidEditor.setHTML(editorInstance, html)) {
      return;
    }
  }
  if (editorInstance && typeof editorInstance.setHTML === "function") {
    editorInstance.setHTML(html || "");
    if (typeof editorInstance.__hostMirrorNow === "function") {
      editorInstance.__hostMirrorNow(true);
    }
    return;
  }
  const textarea = document.getElementById("txt_content");
  if (textarea) {
    textarea.value = html || "";
  }
}
function isNoticeContentEmpty(html) {
  if (window.WebRSolidEditor && typeof window.WebRSolidEditor.isEmpty === "function") {
    return window.WebRSolidEditor.isEmpty(html);
  }
  const raw = String(html || "").trim();
  if (!raw) {
    return true;
  }
  if (/<(img|video|audio|iframe|table|pre|code|figure|hr|math|svg)\b/i.test(raw)) {
    return false;
  }
  return raw.replace(/<br\s*\/?>/gi, "").replace(/&nbsp;/gi, " ").replace(/<[^>]*>/g, "").trim() === "";
}
const noticeAttachmentState = {
  articleFiles: [],
  commentFiles: {}
};
function noticeFileHref(raw) {
  raw = String(raw || "").trim();
  if (!raw)
    return "";
  if (raw.startsWith("http://") || raw.startsWith("https://"))
    return raw;
  const normalizedPath = raw.startsWith("/") ? raw : "/" + raw;
  return window.location.protocol + "//" + window.location.host + normalizedPath;
}
function normalizeNoticeAttachments(data) {
  const fromArray = Array.isArray(data && data.attachments) ? data.attachments : [];
  const attachments = fromArray.map((item) => {
    const fileURL = item.file_url || item.url_file || "";
    const fileName = item.file_name || item.origin_file_name || fileURL;
    return { uuid: item.uuid || "", file_url: fileURL, url_file: fileURL, file_name: fileName, origin_file_name: fileName };
  }).filter((item) => item.file_url || item.file_name);
  if (attachments.length === 0 && data && data.file_url) {
    attachments.push({ uuid: data.uuid_file || "", file_url: data.file_url, url_file: data.file_url, file_name: data.file_name || data.file_url, origin_file_name: data.file_name || data.file_url });
  }
  return attachments;
}
function noticeQueuedArticleFiles() {
  return noticeAttachmentState.articleFiles || [];
}
function noticeQueuedCommentFiles(commentId) {
  const key = commentId == null ? "new" : String(commentId);
  return noticeAttachmentState.commentFiles && noticeAttachmentState.commentFiles[key] || [];
}
function noticeAppendQueuedFiles(currentFiles, fileList) {
  const files = Array.from(fileList || []).filter(Boolean);
  const next = currentFiles ? currentFiles.slice() : [];
  files.forEach((file) => {
    const duplicate = next.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified);
    if (!duplicate)
      next.push(file);
  });
  return next;
}
function queueNoticeArticleFiles(fileList) {
  noticeAttachmentState.articleFiles = noticeAppendQueuedFiles(noticeQueuedArticleFiles(), fileList);
  renderNoticeArticleAttachmentControl();
}
function queueNoticeCommentFiles(commentId, fileList) {
  const key = commentId == null ? "new" : String(commentId);
  noticeAttachmentState.commentFiles[key] = noticeAppendQueuedFiles(noticeQueuedCommentFiles(key), fileList);
  renderNoticeCommentAttachmentControl(key);
}
function removeNoticeArticleFile(index) {
  noticeAttachmentState.articleFiles = noticeQueuedArticleFiles().filter((_, i) => i !== index);
  renderNoticeArticleAttachmentControl();
}
function removeNoticeCommentFile(commentId, index) {
  const key = commentId == null ? "new" : String(commentId);
  noticeAttachmentState.commentFiles[key] = noticeQueuedCommentFiles(key).filter((_, i) => i !== index);
  renderNoticeCommentAttachmentControl(key);
}
function clearNoticeArticleFiles() {
  noticeAttachmentState.articleFiles = [];
  renderNoticeArticleAttachmentControl();
}
function clearNoticeCommentFiles(commentId) {
  const key = commentId == null ? "new" : String(commentId);
  noticeAttachmentState.commentFiles[key] = [];
  renderNoticeCommentAttachmentControl(key);
}
function NoticeAttachmentDropZone(props) {
  const target = props.target || "article";
  const commentId = props.commentId == null ? "new" : String(props.commentId);
  const inputId = target === "article" ? "id_file_upload" : "id_file_upload_" + commentId;
  const files = target === "article" ? noticeQueuedArticleFiles() : noticeQueuedCommentFiles(commentId);
  const existing = props.existing || [];
  const onFiles = (fileList) => target === "article" ? queueNoticeArticleFiles(fileList) : queueNoticeCommentFiles(commentId, fileList);
  const onDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onFiles(event.dataTransfer ? event.dataTransfer.files : []);
  };
  const onDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return /* @__PURE__ */ React.createElement("div", { class: "p-4 w-full rounded-lg border border-dashed border-blue-300 bg-blue-50", onDrop, onDragOver }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      name: inputId,
      id: inputId,
      accept: "*",
      class: "hidden",
      multiple: true,
      onChange: (event) => {
        onFiles(event.target.files);
        event.target.value = "";
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between" }, /* @__PURE__ */ React.createElement("div", { class: "text-sm text-gray-700" }, /* @__PURE__ */ React.createElement("p", { class: "font-semibold" }, "\uD30C\uC77C\uC744 \uB04C\uC5B4\uB2E4 \uB193\uAC70\uB098 \uC120\uD0DD\uD574\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("p", { class: "text-xs text-gray-500" }, "\uC5EC\uB7EC \uD30C\uC77C\uC744 \uD55C \uBC88\uC5D0 \uCCA8\uBD80\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      class: "flex flex-row justify-center items-center py-1.5 px-4 text-white bg-blue-700 font-medium rounded-lg text-center text-sm w-fit hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
      onClick: () => {
        const input = document.getElementById(inputId);
        if (input)
          input.click();
      }
    },
    /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/file_upload.svg", class: "w-4 h-4 mr-2" }),
    "\uD30C\uC77C \uC120\uD0DD"
  )), existing.length > 0 && /* @__PURE__ */ React.createElement("div", { class: "mt-3 space-y-1" }, existing.map((file, index) => /* @__PURE__ */ React.createElement("a", { key: "existing_notice_" + index, href: noticeFileHref(file.file_url || file.url_file), target: "_blank", class: "block w-fit text-xs text-gray-600 hover:underline" }, "\uAE30\uC874 \uCCA8\uBD80: ", file.file_name || file.origin_file_name || file.file_url))), files.length > 0 && /* @__PURE__ */ React.createElement("div", { class: "mt-3 flex flex-col gap-2" }, files.map((file, index) => /* @__PURE__ */ React.createElement("div", { key: file.name + "_" + index, class: "flex flex-row justify-between items-center gap-2 rounded-md bg-white border border-blue-100 px-3 py-2 text-sm" }, /* @__PURE__ */ React.createElement("span", { class: "truncate" }, file.name), /* @__PURE__ */ React.createElement("button", { type: "button", class: "text-xs text-red-600 hover:underline", onClick: () => target === "article" ? removeNoticeArticleFile(index) : removeNoticeCommentFile(commentId, index) }, "\uC0AD\uC81C")))));
}
function renderNoticeArticleAttachmentControl(existingData) {
  const host = document.getElementById("div_article_file_control");
  if (!host)
    return;
  const existing = existingData ? normalizeNoticeAttachments(existingData) : [];
  ReactDOM.render(/* @__PURE__ */ React.createElement(NoticeAttachmentDropZone, { target: "article", existing }), host);
}
function renderNoticeCommentAttachmentControl(commentId) {
  const key = commentId == null ? "new" : String(commentId);
  ["div_comment_file_control_" + key, "div_comment_edit_file_control_" + key].forEach((hostID) => {
    const host = document.getElementById(hostID);
    if (!host)
      return;
    ReactDOM.render(/* @__PURE__ */ React.createElement(NoticeAttachmentDropZone, { target: "comment", commentId: key }), host);
  });
}
async function uploadNoticeQueuedFiles(files, options = {}) {
  const uploadFiles = Array.from(files || []).filter(Boolean);
  for (let index = 0; index < uploadFiles.length; index += 1) {
    const formData = new FormData();
    formData.append("file_input", uploadFiles[index]);
    formData.append("host", window.location.href.toString());
    formData.append("note", options.note || "Article");
    formData.append("active", 1);
    formData.append("attachment_scope", options.scope || "");
    formData.append("attachment_order", index);
    if (options.articleUUID)
      formData.append("uuid_article", options.articleUUID);
    if (options.commentUUID)
      formData.append("uuid_comment", options.commentUUID);
    const result = await fetch("/blank/ajax_file_upload/", {
      method: "POST",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: formData
    }).then((res) => res.json());
    if (result && result.error)
      throw new Error(result.error);
  }
}
function getNoticeCommentStorageKey(commentId) {
  const articleID = typeof orderID === "undefined" || orderID == null || orderID === "" || orderID === "None" ? "new" : orderID;
  return ["web-r", "intro", "notice", "comment", articleID, commentId || "new"].join(":");
}
function createNoticeCommentFallbackInHost(host, commentId, initialHTML = "") {
  if (!host)
    return null;
  host.innerHTML = "";
  const textarea = document.createElement("textarea");
  textarea.id = "txt_content_comment_" + commentId;
  textarea.name = "txt_content_comment_" + commentId;
  textarea.className = "w-full min-h-[220px] rounded-lg border border-gray-300 p-3 text-sm";
  textarea.setAttribute("rows", "8");
  textarea.setAttribute("placeholder", "\uB313\uAE00\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
  textarea.value = initialHTML || "";
  host.appendChild(textarea);
  return createNoticeEditorFallback(textarea);
}
async function mountSolidNoticeCommentEditor(commentId, initialHTML = "", hostID = null) {
  const key = commentId == null ? "new" : String(commentId);
  const defaultHostID = key === "new" ? "div_community_read_comment_new_form" : "div_community_read_comment_new_" + key + "_form";
  const host = document.getElementById(hostID || defaultHostID);
  if (!host)
    return null;
  const textareaID = "txt_content_comment_" + key;
  const options = {
    placeholder: "\uB313\uAE00\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
    storageKey: getNoticeCommentStorageKey(key),
    textareaID,
    textareaName: textareaID,
    restoreDraft: !hostID,
    ribbonExpanded: false
  };
  if (typeof initialHTML === "string")
    options.html = initialHTML;
  if (window.WebRSolidEditor && typeof window.WebRSolidEditor.mountHost === "function") {
    return await window.WebRSolidEditor.mountHost(host, options);
  }
  return createNoticeCommentFallbackInHost(host, key, initialHTML || "");
}
function Div_box_header(props) {
  return /* @__PURE__ */ React.createElement("p", { class: "flex flex-row text-start w-full font-extrabold underline" }, props.title);
}
let class_span_btn_default = "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl";
function Span_btn_user(props) {
  const roles = {
    "\uAD00\uB9AC\uC790": "yellow",
    "\uAE30\uC5C5\uD68C\uC6D0": "red",
    "VIP\uD68C\uC6D0": "blue",
    "\uC815\uD68C\uC6D0": "green",
    "\uC900\uD68C\uC6D0": "gray"
  };
  const role = roles[props.role] || "gray";
  return /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-${role}-100 text-${role}-800` }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/board_user.svg", class: "w-3 h-3 mr-1" }), props.user_nickname);
}
function Span_btn_date(props) {
  return /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-blue-100 text-blue-800` }, /* @__PURE__ */ React.createElement("img", { src: `https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/calendar_${Number(props.date.split("-")[2].substr(0, 2))}.svg`, class: "w-3 h-3 mr-1" }), props.date);
}
function Span_btn_article_read(props) {
  return props.cnt_read > 0 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-gray-100 text-blue-800` }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/eye.svg", class: "w-3 h-3 mr-1" }), props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
}
function Span_btn_article_comment(props) {
  return props.cnt_comment > 0 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-purple-100 text-blue-800` }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment.svg", class: "w-3 h-3 mr-1" }), props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
}
function Span_btn_article_new(props) {
  return props.toggle === 1 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-red-500 text-white animate-pulse` }, "NEW");
}
function Span_btn_article_secret(props) {
  return props.toggle === 1 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse` }, "SECRET");
}
function Span_btn_comment_secret(props) {
  return props.toggle === 1 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse` }, "SECRET");
}
function Span_btn_my_article(props) {
  return props.toggle === "writer" && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse` }, "MY");
}
function Span_btn_my_comment(props) {
  return props.toggle === "writer" && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse` }, "MY");
}
function noticeSafeText(value, fallback = "") {
  if (value === void 0 || value === null)
    return fallback;
  return String(value);
}
function noticeIsBlank(value) {
  const v = noticeSafeText(value).trim();
  return v === "" || v === "None" || v === "null" || v === "undefined";
}
function getSidebarTag() {
  return "notice";
}
function getCurrentUsername() {
  if (typeof gv_username === "undefined" || gv_username === null)
    return "";
  return String(gv_username).trim();
}
function getArticleHrefFromData(data) {
  const item = data || {};
  const uuid = item.uuid || item.uuid_article || "";
  const categoryUrl = item.category_url || item.article_category_url || "notice";
  const categoryUrlSub = item.category_url_sub || item.article_category_url_sub || "";
  const explicitUrl = item.url || item.article_url || "";
  if (categoryUrl === "notice")
    return "/intro/notice/read/" + uuid + "/";
  if (explicitUrl && explicitUrl.indexOf("/webr/notebook/view/") === 0)
    return explicitUrl;
  if (categoryUrl === "notebook")
    return "/webr/notebook/view/" + uuid + "/";
  if (categoryUrl === "visitor")
    return "/community/visitor/read/" + uuid + "/";
  if (categoryUrl === "rblogger" || categoryUrl === "free")
    return "/community/read/" + uuid + "/";
  if (categoryUrl === "youtube")
    return "/workshop/youtube/read/" + uuid + "/";
  if (categoryUrl === "workshop")
    return "/workshop/read/" + uuid + "/";
  if (explicitUrl)
    return explicitUrl;
  if (categoryUrl && categoryUrlSub)
    return "/community/" + categoryUrl + "/" + categoryUrlSub + "/read/" + uuid + "/";
  if (categoryUrl)
    return "/community/" + categoryUrl + "/read/" + uuid + "/";
  return init_url + "read/" + uuid + "/";
}
function Div_sidelist_skeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { id: props.id, class: "w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: props.title }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-2 animate-pulse" }, /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-200 rounded-full w-full" }), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-200 rounded-full w-full" }), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-200 rounded-full w-full" }))));
}
function Div_new_article_list(props) {
  const item = props.data || {};
  const href = getArticleHrefFromData(item);
  const cu = item.category_url || "notice";
  let categoryTitle = "\uACF5\uC9C0\uC0AC\uD56D";
  let categoryClass = " bg-amber-100 text-amber-700 border-amber-300";
  if (cu === "free") {
    categoryTitle = "\uC790\uC720\uAC8C\uC2DC\uD310";
    categoryClass = " bg-blue-100 text-blue-700 border-blue-300";
  } else if (cu === "rblogger") {
    categoryTitle = "R-Blogger";
    categoryClass = " bg-purple-100 text-purple-700 border-purple-300";
  } else if (cu === "notebook") {
    categoryTitle = "Web-R Notebook";
    categoryClass = " bg-emerald-100 text-emerald-700 border-emerald-300";
  } else if (cu === "visitor") {
    categoryTitle = "\uBC29\uBA85\uB85D";
    categoryClass = " bg-orange-100 text-orange-700 border-orange-300";
  }
  return /* @__PURE__ */ React.createElement("div", { class: "bg-white w-full" }, /* @__PURE__ */ React.createElement("a", { href, class: "flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-50 rounded-lg mx-3 my-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { class: "flex-shrink-0 whitespace-nowrap px-2 py-0.5 border rounded-full text-xs font-semibold" + categoryClass }, categoryTitle), /* @__PURE__ */ React.createElement("span", { class: "min-w-0 flex-1 font-bold text-sm truncate" }, item.title), /* @__PURE__ */ React.createElement("div", { class: "flex-shrink-0 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Span_btn_article_new, { toggle: item.is_new }), /* @__PURE__ */ React.createElement(Span_btn_article_secret, { toggle: item.is_secret }), /* @__PURE__ */ React.createElement(Span_btn_my_article, { toggle: item.check_reader }))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap items-center space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_user, { user_nickname: item.user_nickname, role: item.user_role }), /* @__PURE__ */ React.createElement(Span_btn_date, { date: item.created_at || "" }), /* @__PURE__ */ React.createElement(Span_btn_article_read, { cnt_read: item.cnt_read || 0 }), /* @__PURE__ */ React.createElement(Span_btn_article_comment, { cnt_comment: item.cnt_comment || 0 }))));
}
function Div_new_comment(props) {
  const item = props.data || {};
  const content = noticeSafeText(item.content).replace(/<[^>]*>?/g, "");
  return /* @__PURE__ */ React.createElement("div", { class: "bg-white border-b w-full" }, /* @__PURE__ */ React.createElement("a", { href: getArticleHrefFromData(item), class: "flex flex-col px-6 py-4 space-y-2 cursor-pointer hover:bg-gray-100 w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center" }, /* @__PURE__ */ React.createElement("span", { class: "font-normal text-sm w-fit max-w-full truncate ..." }, content)), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center border border-gray-300 rounded-lg" }, /* @__PURE__ */ React.createElement("span", { class: "font-normal text-xs text-gray-500 w-full mr-2 truncate ..." }, /* @__PURE__ */ React.createElement("span", { class: "bg-gray-300 px-2 py-1 mr-1" }, "\uC6D0\uAE00:"), item.article_title)), /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_user, { user_nickname: item.user_nickname, role: item.user_role }), /* @__PURE__ */ React.createElement(Span_btn_date, { date: item.created_at || "" }))));
}
function Div_sidebar_notice(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: props.title }), /* @__PURE__ */ React.createElement("span", { class: "text-sm text-gray-500" }, props.message));
}
function noticeRenderSidebar(targetId, element) {
  const target = document.getElementById(targetId);
  if (target)
    ReactDOM.render(element, target);
}
async function noticeFetchSidebar(path, title, renderItem, targetId, loginRequired = false) {
  if (loginRequired && !getCurrentUsername()) {
    noticeRenderSidebar(targetId, /* @__PURE__ */ React.createElement(Div_sidebar_notice, { title, message: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4." }));
    return;
  }
  function SidebarList(props) {
    const rows = Object.values(props.data || {});
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start w-full space-y-2" }, rows.length > 0 ? rows.map((row, idx) => renderItem(row, idx)) : /* @__PURE__ */ React.createElement("span", { class: "text-sm text-gray-500" }, "\uD45C\uC2DC\uD560 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")));
  }
  try {
    const request_data = new FormData();
    request_data.append("tag", getSidebarTag());
    const data = await fetch(path, {
      method: "POST",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data
    }).then((res) => res.json());
    noticeRenderSidebar(targetId, /* @__PURE__ */ React.createElement(SidebarList, { data }));
  } catch (e) {
    console.error("[notice sidebar] load failed:", path, e);
    noticeRenderSidebar(targetId, /* @__PURE__ */ React.createElement(Div_sidebar_notice, { title, message: "\uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4." }));
  }
}
async function get_article_famous_list() {
  return noticeFetchSidebar(
    "/blank/ajax_board/get_article_famous_list/",
    "\uCD5C\uADFC \uC778\uAE30 \uAE00",
    (article, idx) => /* @__PURE__ */ React.createElement(Div_new_article_list, { key: article.uuid || idx, data: article }),
    "div_article_famous_list"
  );
}
async function get_my_article_list() {
  return noticeFetchSidebar(
    "/blank/ajax_board/get_my_article_list/",
    "\uB0B4\uAC00 \uC4F4 \uAE00",
    (article, idx) => /* @__PURE__ */ React.createElement(Div_new_article_list, { key: article.uuid || idx, data: article }),
    "div_my_article_list",
    true
  );
}
async function get_my_comment_list() {
  return noticeFetchSidebar(
    "/blank/ajax_board/get_my_comment_list/",
    "\uB0B4\uAC00 \uC4F4 \uB313\uAE00",
    (comment, idx) => /* @__PURE__ */ React.createElement(Div_new_comment, { key: comment.uuid || idx, data: comment }),
    "div_my_comment_list",
    true
  );
}
async function get_new_comment_list() {
  return noticeFetchSidebar(
    "/blank/ajax_board/get_new_comment_list/",
    "\uCD5C\uADFC \uB313\uAE00",
    (comment, idx) => /* @__PURE__ */ React.createElement(Div_new_comment, { key: comment.uuid || idx, data: comment }),
    "div_new_comment_list"
  );
}
const IntroNoticeList = /* @__PURE__ */ (() => {
  let header_title = "\uACF5\uC9C0\uC0AC\uD56D";
  let header_subtitle = "Web-R \uC18C\uAC1C";
  let toggle_click_submit = false;
  let editor = null;
  function Div_article_list_skeleton() {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-2 animate-pulse" }, /* @__PURE__ */ React.createElement("div", { class: "h-5 bg-gray-200 rounded-full w-full" }), /* @__PURE__ */ React.createElement("div", { class: "h-5 bg-gray-200 rounded-full w-full" }), /* @__PURE__ */ React.createElement("div", { class: "h-5 bg-gray-200 rounded-full w-full" }), /* @__PURE__ */ React.createElement("div", { class: "h-5 bg-gray-200 rounded-full w-full" }), /* @__PURE__ */ React.createElement("div", { class: "h-5 bg-gray-200 rounded-full w-full" }));
  }
  let page_num = 1;
  let article_counter = 0;
  let toggle_page = false;
  async function click_btn_search() {
    let search_text = document.getElementById("txt_search").value.trim();
    if (search_text == null || search_text == "") {
      alert("\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD558\uC138\uC694.");
    } else {
      get_article_list("search");
    }
  }
  async function get_article_list(mode2) {
    const ArticleList = ({ data: data2, isMain = false }) => {
      const article_list = Object.keys(data2).map(
        (key) => /* @__PURE__ */ React.createElement(Div_new_article_list, { key, data: data2[key] })
      );
      const listContent = /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start w-full space-y-2" }, article_list, /* @__PURE__ */ React.createElement("div", { id: `div_article_list_${page_num + 1}`, class: "w-full" }));
      if (!isMain)
        return listContent;
      return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uCD5C\uC2E0 \uAE00" }), listContent);
    };
    toggle_page = true;
    const request_data = new FormData();
    request_data.append("tag", url);
    request_data.append("tag_sub", sub);
    if (mode2 === "init" || mode2 === "search") {
      page_num = 1;
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_list_skeleton, null), document.getElementById("div_article_list"));
      if (mode2 === "search") {
        request_data.append("txt_search", document.getElementById("txt_search").value.trim());
      }
    } else {
      page_num += 1;
      ReactDOM.render(
        /* @__PURE__ */ React.createElement(Div_article_list_skeleton, null),
        document.getElementById(`div_article_list_${page_num}`)
      );
    }
    request_data.append("page", page_num);
    const data = await fetch("/blank/ajax_board/get_article_list/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data
    }).then((res) => res.json());
    article_counter = data["count"].cnt;
    const targetId = mode2 === "init" || mode2 === "search" ? "div_article_list" : `div_article_list_${page_num}`;
    ReactDOM.render(
      /* @__PURE__ */ React.createElement(
        ArticleList,
        {
          data: data.list,
          isMain: mode2 === "init" || mode2 === "search"
        }
      ),
      document.getElementById(targetId)
    );
    toggle_page = false;
  }
  function notice_list_set_main() {
    function Div_main() {
      return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center py-8 px-6 w-full max-w-6xl mx-auto md:px-20" }, /* @__PURE__ */ React.createElement(Div_page_header, { title: header_title, subtitle: header_subtitle }), /* @__PURE__ */ React.createElement("div", { id: "div_community_list", class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-1 justify-center items-start w-full gap-4 md:grid-cols-3" }, /* @__PURE__ */ React.createElement("div", { id: "div_article_list", class: "md:col-span-2 w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uCD5C\uC2E0 \uAE00" }))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start w-full space-y-4" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: () => gv_username == "" ? alert("\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.") : location.href = init_url + "write/",
          class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full\n											hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
        },
        "\uAE00\uC4F0\uAE30"
      ), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl" }, /* @__PURE__ */ React.createElement("p", { class: "flex flex-row text-start w-full" }, "\uAC80\uC0C9"), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          id: "txt_search",
          class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5\n											  focus:ring-blue-500 focus:border-blue-500"
        }
      ), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center w-full" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: () => click_btn_search(),
          class: "text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center me-2 mb-2\n												   hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300"
        },
        "\uAC80\uC0C9"
      ))), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_article_famous_list", title: "\uCD5C\uADFC \uC778\uAE30 \uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_new_comment_list", title: "\uCD5C\uADFC \uB313\uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_my_article_list", title: "\uB0B4\uAC00 \uC4F4 \uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_my_comment_list", title: "\uB0B4\uAC00 \uC4F4 \uB313\uAE00" })))));
    }
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
    get_article_list("init");
    get_article_famous_list();
    get_new_comment_list();
    get_my_article_list();
    get_my_comment_list();
    window.addEventListener("scroll", () => {
      const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
      if (isScrollEnded && !toggle_page && page_num * 20 < article_counter) {
        get_article_list("next");
      }
    });
  }
  return {
    set_main: notice_list_set_main
  };
})();
const IntroNoticeRead = /* @__PURE__ */ (() => {
  let header_title = "\uACF5\uC9C0\uC0AC\uD56D";
  let header_subtitle = "Web-R \uC18C\uAC1C";
  let data_article = null;
  let data_comment = null;
  let data_comment_upper = null;
  let class_txt_file_delete = "size-4 min-size-4 max-size-4 rounded-lg hover:bg-red-100 cursor-pointer";
  let editor = {};
  let data_file = [];
  function Div_article_read_buttons(props) {
    const btnClass = "font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full";
    const writeBtn = `text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 ${btnClass}
					  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300`;
    const listBtn = `text-gray-900 bg-white border border-gray-900 ${btnClass}
					 focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100`;
    const editBtn = `text-green-700 border border-green-700 ${btnClass} py-1
					 hover:text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300`;
    const deleteBtn = `text-red-700 border border-red-700 ${btnClass} py-1
					   hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300`;
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center space-y-2 w-full" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => gv_username ? location.href = init_url + "write/" : alert("\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4."),
        class: writeBtn
      },
      "\uC0C8 \uAE00 \uC4F0\uAE30"
    ), /* @__PURE__ */ React.createElement("a", { href: init_url, class: listBtn }, "\uBAA9\uB85D\uC73C\uB85C")), props.data.check_reader != "user" && /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 justify-center items-center gap-2 w-full" }, /* @__PURE__ */ React.createElement("button", { onClick: () => location.href = init_url + "edit/" + orderID + "/", class: editBtn }, "\uC218\uC815"), /* @__PURE__ */ React.createElement("button", { onClick: click_btn_delete, class: deleteBtn }, "\uC0AD\uC81C")));
  }
  async function get_read_article(mode2) {
    const request_data = new FormData();
    request_data.append("orderID", orderID);
    try {
      const res = await fetch("/blank/ajax_board/get_read_article/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
      });
      if (!res.ok) {
        throw new Error(`get_read_article HTTP error: ${res.status}`);
      }
      data_article = await res.json();
      if (mode2 === "init") {
        try {
          set_article();
        } catch (e) {
        }
      }
      try {
        get_read_article_comment(orderID);
      } catch (e) {
      }
      let normalizedCategory = null;
      if (data_article && typeof data_article.category_url === "string") {
        normalizedCategory = data_article.category_url.trim().toLowerCase();
      }
      if (normalizedCategory === "rblogger") {
        refresh_article_rblogger(orderID);
      }
    } catch (err) {
      console.error("[get_read_article] fetch or JSON error:", err);
    }
  }
  async function click_btn_delete() {
    if (confirm("\uC815\uB9D0\uB85C \uC0AD\uC81C\uD560\uAE4C\uC694?")) {
      const request_data = new FormData();
      request_data.append("uuid", orderID);
      const data = await fetch("/blank/ajax_board/delete_article/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
      }).then((res) => {
        return res.json();
      }).then((res) => {
        return res;
      });
      location.href = init_url;
    }
  }
  function Div_article_read_header(props) {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start py-4 border-t border-b border-gray-200 w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-end w-full" }, /* @__PURE__ */ React.createElement("span", { class: "flex flex-row justify-start items-center text-lg font-extrabold w-full space-x-2" }, props.data.title, /* @__PURE__ */ React.createElement("div", null), /* @__PURE__ */ React.createElement(Span_btn_article_new, { toggle: props.data.is_new }), /* @__PURE__ */ React.createElement(Span_btn_article_secret, { toggle: props.data.is_secret }), /* @__PURE__ */ React.createElement(Span_btn_my_article, { toggle: props.data.check_reader }))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center w-full" }, /* @__PURE__ */ React.createElement("span", { class: "flex flex-row justify-end items-center text-md font-normal w-full space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_user, { user_nickname: props.data.user_nickname, role: props.data.user_role }), /* @__PURE__ */ React.createElement(Span_btn_date, { date: props.data.created_at }), /* @__PURE__ */ React.createElement(Span_btn_article_read, { cnt_read: props.data.cnt_read }), /* @__PURE__ */ React.createElement(Span_btn_article_comment, { cnt_comment: props.data.cnt_comment }))));
  }
  function Div_article_read_file(props) {
    const data = data_article;
    if (!data)
      return null;
    const isRblogger = data.category_url === "rblogger";
    const hasUrl = !!data.url;
    const attachments = normalizeNoticeAttachments(data);
    const hasFile = attachments.length > 0;
    if (data.is_secret === 1 && data.check_reader !== "admin" && data.check_reader !== "writer") {
      return null;
    }
    if (isRblogger && !hasUrl) {
      return null;
    }
    if (!isRblogger && !hasFile) {
      return null;
    }
    if (isRblogger) {
      return /* @__PURE__ */ React.createElement("section", { class: "bg-white py-8 lg:py-16 antialiased" }, /* @__PURE__ */ React.createElement("div", { class: "w-full mx-auto px-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h2", { class: "text-md lg:text-lg font-bold text-gray-900" }, "\uC6D0\uBB38 \uB9C1\uD06C")), /* @__PURE__ */ React.createElement("form", { class: "mb-3" }, /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-50 rounded-lg border border-gray-200" })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-start w-full" }, /* @__PURE__ */ React.createElement(
        "a",
        {
          href: data.url,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-blue-600 underline break-all text-md cursor-pointer hover:text-blue-800 hover:bg-gray-50 px-1 py-0.5 rounded"
        },
        data.url
      ))));
    }
    return /* @__PURE__ */ React.createElement("section", { class: "bg-white py-8 lg:py-16 antialiased" }, /* @__PURE__ */ React.createElement("div", { class: "w-full mx-auto px-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h2", { class: "text-md lg:text-lg font-bold text-gray-900" }, "\uCCA8\uBD80\uD30C\uC77C")), /* @__PURE__ */ React.createElement("form", { class: "mb-3" }, /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-50 rounded-lg border border-gray-200" })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-start items-start w-full gap-2" }, attachments.map((file, index) => /* @__PURE__ */ React.createElement(
      "a",
      {
        key: "notice_file_" + index,
        href: noticeFileHref(file.file_url || file.url_file),
        target: "_blank",
        class: "flex flex-row justify-end items-center text-md font-normal w-fit space-x-2 cursor-pointer hover:bg-gray-100"
      },
      file.file_name || file.origin_file_name || file.file_url
    )))));
  }
  function set_article() {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_header, { data: data_article }), document.getElementById("div_community_read_header"));
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_buttons, { data: data_article }), document.getElementById("div_article_read_buttons"));
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_file, { data: data_article }), document.getElementById("div_community_read_file"));
    const viewer = WebRSolidEdit.renderContent(document.querySelector("#div_community_read_content"), data_article.content);
  }
  function Div_btn_comment_editor_footer_button(props) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: props.function,
        class: "flex flex-row justify-center items-center\n             text-white bg-gradient-to-r from-cyan-500 to-blue-500\n             font-medium rounded-lg text-sm px-5 py-1 text-center\n             hover:bg-gradient-to-bl hover:bg-gray-300\n             focus:ring-4 focus:outline-none focus:ring-cyan-300"
      },
      "\uB4F1\uB85D"
    );
  }
  function Div_btn_comment_editor_footer_button_loading(props) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        class: "flex flex-row justify-center items-center\n             text-white bg-gradient-to-r from-cyan-500 to-blue-500\n             font-medium rounded-lg text-sm px-5 py-1 text-center\n             hover:bg-gradient-to-bl hover:bg-gray-300\n             focus:ring-4 focus:outline-none focus:ring-cyan-300\n             cursor-not-allowed"
      },
      /* @__PURE__ */ React.createElement(
        "svg",
        {
          "aria-hidden": "true",
          role: "status",
          class: "inline w-4 h-4 mr-2 text-white animate-spin",
          viewBox: "0 0 100 101",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858\n             100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50\n             0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z",
            fill: "#E5E7EB"
          }
        ),
        /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116\n             97.0079 33.5539C95.2932 28.8227 92.871 24.3692\n             89.8167 20.348C85.8452 15.1192 80.8826 10.7238\n             75.2124 7.41289C69.5422 4.10194 63.2754 1.94025\n             56.7698 1.05124C51.7666 0.367541 46.6976 0.446843\n             41.7345 1.27873C39.2613 1.69328 37.813 4.19778\n             38.4501 6.62326C39.0873 9.04874 41.5694 10.4717\n             44.0505 10.1071C47.8511 9.54855 51.7191 9.52689\n             55.5402 10.0491C60.8642 10.7766 65.9928 12.5457\n             70.6331 15.2552C75.2735 17.9648 79.3347 21.5619\n             82.5849 25.841C84.9175 28.9121 86.7997 32.2913\n             88.1811 35.8758C89.083 38.2158 91.5421 39.6781\n             93.9676 39.0409Z",
            fill: "currentColor"
          }
        )
      ),
      "\uB4F1\uB85D"
    );
  }
  function Div_btn_comment_footer(props) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        class: "flex justify-center items-center text-sm text-gray-500 hover:underline font-medium",
        onClick: props.function
      },
      props.url_image && /* @__PURE__ */ React.createElement("img", { src: props.url_image, class: "w-4 h-4 mr-2" }),
      props.text
    );
  }
  function Div_btn_comment_footer_loading(props) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        class: "flex justify-center items-center text-sm text-gray-400 font-medium cursor-not-allowed"
      },
      /* @__PURE__ */ React.createElement(
        "svg",
        {
          "aria-hidden": "true",
          class: "inline w-4 h-4 text-gray-200 animate-spin mr-2",
          viewBox: "0 0 100 101",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858\n             100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50\n             0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z",
            fill: "#E5E7EB"
          }
        ),
        /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116\n             97.0079 33.5539C95.2932 28.8227 92.871 24.3692\n             89.8167 20.348C85.8452 15.1192 80.8826 10.7238\n             75.2124 7.41289C69.5422 4.10194 63.2754 1.94025\n             56.7698 1.05124C51.7666 0.367541 46.6976 0.446843\n             41.7345 1.27873C39.2613 1.69328 37.813 4.19778\n             38.4501 6.62326C39.0873 9.04874 41.5694 10.4717\n             44.0505 10.1071C47.8511 9.54855 51.7191 9.52689\n             55.5402 10.0491C60.8642 10.7766 65.9928 12.5457\n             70.6331 15.2552C75.2735 17.9648 79.3347 21.5619\n             82.5849 25.841C84.9175 28.9121 86.7997 32.2913\n             88.1811 35.8758C89.083 38.2158 91.5421 39.6781\n             93.9676 39.0409Z",
            fill: "currentColor"
          }
        )
      ),
      props.text
    );
  }
  function Div_comment_button_list(props) {
    const { data, depth, loading } = props;
    const isDepth1 = depth === 1;
    const ButtonComp = loading ? Div_btn_comment_footer_loading : Div_btn_comment_footer;
    return /* @__PURE__ */ React.createElement("div", { class: "flex items-center space-x-4" }, isDepth1 && !loading && gv_username !== "" && /* @__PURE__ */ React.createElement(
      ButtonComp,
      {
        text: "\uB300\uB313\uAE00",
        function: () => click_btn_reply_comment(data.uuid),
        url_image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment_re_reply.svg"
      }
    ), data && data.check_comment_reader !== "user" && data.active === 1 && /* @__PURE__ */ React.createElement(
      ButtonComp,
      {
        text: "\uC218\uC815",
        function: !loading ? () => click_btn_edit_comment(data.uuid) : void 0,
        url_image: !loading ? "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment_modify.svg" : null
      }
    ), data && data.check_comment_reader !== "user" && data.active === 1 && /* @__PURE__ */ React.createElement(
      ButtonComp,
      {
        text: "\uC0AD\uC81C",
        function: !loading ? () => comment_action("delete", data.uuid) : void 0,
        url_image: !loading ? "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment_delete.svg" : null
      }
    ));
  }
  function Div_comment_form(props) {
    const isNewComment = props.uuid_comment == null;
    const commentId = isNewComment ? "new" : props.uuid_comment;
    return /* @__PURE__ */ React.createElement("div", { class: props.class }, /* @__PURE__ */ React.createElement("p", { class: "flex flex-row underline" }, props.title), /* @__PURE__ */ React.createElement(
      "div",
      {
        id: "div_community_read_comment_new_" + (isNewComment ? "form" : commentId + "_form"),
        class: "w-full"
      }
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        class: "w-full",
        id: "div_comment_editor_footer_button_" + commentId
      },
      /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-between items-center w-full space-x-2 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_comment_file_control_" + commentId }, /* @__PURE__ */ React.createElement(NoticeAttachmentDropZone, { target: "comment", commentId })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement(
        "input",
        {
          id: "chk_secret_" + commentId,
          type: "checkbox",
          value: "",
          class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
        }
      ), /* @__PURE__ */ React.createElement(
        "label",
        {
          for: "chk_secret_" + commentId,
          class: "ms-2 text-sm font-medium text-gray-900"
        },
        /* @__PURE__ */ React.createElement("p", null, "\uBE44\uBC00 \uB313\uAE00", /* @__PURE__ */ React.createElement("span", null, "\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAE00 \uC791\uC131\uC790, \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"))
      ), /* @__PURE__ */ React.createElement(
        "div",
        {
          class: "w-fit",
          id: "btn_comment_editor_footer_button" + (isNewComment ? "" : "_" + commentId)
        },
        /* @__PURE__ */ React.createElement(
          Div_btn_comment_editor_footer_button,
          {
            uuid_comment: commentId,
            function: () => comment_action("submit", commentId)
          }
        )
      )))
    ));
  }
  function Div_article_read_comment(props) {
    function Div_comment_header(propsHeader) {
      return /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement(
        Span_btn_user,
        {
          user_nickname: propsHeader.data.user_nickname,
          role: propsHeader.data.user_role
        }
      ), /* @__PURE__ */ React.createElement(Span_btn_date, { date: propsHeader.data.created_at }), /* @__PURE__ */ React.createElement(Span_btn_comment_secret, { toggle: propsHeader.data.is_secret }), /* @__PURE__ */ React.createElement(Span_btn_my_comment, { toggle: propsHeader.data.check_comment_reader }));
    }
    function Div_comment(propsComment) {
      const isDepth2 = propsComment.depth === 2;
      const depthValue = isDepth2 ? 2 : 1;
      const bgColorClass = propsComment.data.user_writer == 1 ? isDepth2 ? "bg-blue-100 border border-blue-700" : "bg-blue-50" : isDepth2 ? "bg-gray-50" : "bg-white";
      const comment_depth2_list = !isDepth2 && Object.keys(propsComment.data.rereply || {}).map((key) => /* @__PURE__ */ React.createElement(
        Div_comment,
        {
          key: propsComment.data.rereply[key].uuid,
          data: propsComment.data.rereply[key],
          depth: 2
        }
      ));
      const attachments = normalizeNoticeAttachments(propsComment.data);
      return /* @__PURE__ */ React.createElement(
        "article",
        {
          class: "px-6 py-3 " + (isDepth2 ? "ml-4 " : "") + "text-base " + bgColorClass + " rounded-xl w-full space-y-2"
        },
        /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center space-x-2" }, /* @__PURE__ */ React.createElement(Div_comment_header, { data: propsComment.data })),
        /* @__PURE__ */ React.createElement(
          "div",
          {
            class: "text-gray-500",
            id: "div_comment_" + propsComment.data.uuid
          }
        ),
        attachments.length > 0 && /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-start items-start gap-1 text-sm" }, attachments.map((file, index) => /* @__PURE__ */ React.createElement("div", { key: "notice_comment_file_" + propsComment.data.uuid + "_" + index, class: "flex flex-row justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": "1.8",
            stroke: "currentColor",
            class: "w-4 h-4 text-gray-600"
          },
          /* @__PURE__ */ React.createElement(
            "path",
            {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v12a2 2 0 01-2 2z"
            }
          )
        ), /* @__PURE__ */ React.createElement(
          "a",
          {
            href: noticeFileHref(file.file_url || file.url_file),
            target: "_blank",
            class: "hover:underline"
          },
          file.file_name || file.origin_file_name || file.file_url
        )))),
        /* @__PURE__ */ React.createElement(
          "div",
          {
            class: "w-full",
            id: "div_comment_footer_" + propsComment.data.uuid
          },
          /* @__PURE__ */ React.createElement(
            Div_comment_button_list,
            {
              data: propsComment.data,
              depth: depthValue,
              loading: false
            }
          )
        ),
        comment_depth2_list,
        !isDepth2 && /* @__PURE__ */ React.createElement(
          "div",
          {
            id: "div_community_read_comment_new_" + propsComment.data.uuid,
            class: "hidden"
          },
          /* @__PURE__ */ React.createElement(
            Div_comment_form,
            {
              title: "\uB300\uB313\uAE00 \uC4F0\uAE30",
              class: "mt-4 p-4 bg-white rounded-lg w-full space-y-2",
              uuid_comment: propsComment.data.uuid
            }
          )
        )
      );
    }
    const comment_list = Object.keys(props.data).map((key) => /* @__PURE__ */ React.createElement(
      Div_comment,
      {
        key: props.data[key].uuid,
        data: props.data[key],
        depth: 1,
        is_secret: props.is_secret,
        check_reader: props.check_reader
      }
    ));
    return /* @__PURE__ */ React.createElement("section", { class: "bg-white py-8 lg:py-16 antialiased" }, /* @__PURE__ */ React.createElement("div", { class: "w-full mx-auto px-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h2", { class: "text-lg lg:text-2xl font-bold text-gray-900" }, "\uB313\uAE00 (", props.data.length, ")")), /* @__PURE__ */ React.createElement("form", { class: "mb-6" }, /* @__PURE__ */ React.createElement("div", { class: "mb-4 w-full bg-gray-50 rounded-lg border border-gray-200" }, /* @__PURE__ */ React.createElement("div", { id: "div_comment_new", class: "w-full" }))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-end w-full space-y-0" }, comment_list), gv_username !== "" && /* @__PURE__ */ React.createElement(
      "div",
      {
        class: "flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full",
        id: "div_community_read_comment_new"
      },
      /* @__PURE__ */ React.createElement(
        Div_comment_form,
        {
          title: "\uB313\uAE00 \uC4F0\uAE30",
          class: "w-full space-y-2",
          uuid_comment: null
        }
      )
    )));
  }
  function click_btn_reply_comment(uuid_comment) {
    data_comment_upper.forEach((c) => {
      const el = document.getElementById(
        "div_community_read_comment_new_" + c.uuid
      );
      if (!el)
        return;
      if (c.uuid === uuid_comment) {
        el.className = "mt-4 p-4 bg-white rounded-lg w-full space-y-2";
      } else {
        el.className = "hidden";
      }
    });
  }
  async function click_btn_edit_comment(uuid_comment) {
    function Div_comment_editor_form(props) {
      return /* @__PURE__ */ React.createElement("div", { class: "w-full" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          class: "w-full",
          id: "div_comment_editor_main_" + props.uuid_comment
        }
      ), /* @__PURE__ */ React.createElement("div", { class: "w-full mt-2", id: "div_comment_edit_file_control_" + props.uuid_comment }, /* @__PURE__ */ React.createElement(NoticeAttachmentDropZone, { target: "comment", commentId: props.uuid_comment })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center w-full space-x-2 mt-2" }, /* @__PURE__ */ React.createElement(
        "input",
        {
          id: "chk_secret_" + props.uuid_comment,
          type: "checkbox",
          value: "",
          class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded\n                   focus:ring-blue-500 focus:ring-2"
        }
      ), /* @__PURE__ */ React.createElement(
        "label",
        {
          for: "chk_secret_" + props.uuid_comment,
          class: "ms-2 text-sm font-medium text-gray-900"
        },
        "\uBE44\uBC00 \uB313\uAE00\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAE00 \uC791\uC131\uC790, \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"
      ), /* @__PURE__ */ React.createElement(
        "div",
        {
          class: "w-fit",
          id: "btn_comment_editor_footer_button_" + props.uuid_comment
        },
        /* @__PURE__ */ React.createElement(
          Div_btn_comment_editor_footer_button,
          {
            uuid_comment: props.uuid_comment,
            function: () => comment_action("edit", props.uuid_comment)
          }
        )
      )));
    }
    ReactDOM.render(
      /* @__PURE__ */ React.createElement(Div_comment_editor_form, { uuid_comment }),
      document.getElementById("div_comment_" + uuid_comment)
    );
    const target = Object.values(data_comment).find(
      (item) => item.uuid === uuid_comment
    );
    editor[uuid_comment] = await mountSolidNoticeCommentEditor(uuid_comment, target ? target.content || "" : "", "div_comment_editor_main_" + uuid_comment);
    if (target) {
      setNoticeEditorHTML(editor[uuid_comment], target.content || "");
      const chkEl = document.getElementById("chk_secret_" + uuid_comment);
      if (chkEl)
        chkEl.checked = target.is_secret == 1;
    }
  }
  async function comment_action(action, uuid_comment) {
    const isNew = uuid_comment === "new";
    if (action === "delete") {
      if (!confirm("\uC815\uB9D0\uB85C \uC0AD\uC81C\uD560\uAE4C\uC694?"))
        return;
      const isUpper = data_comment_upper.map((item) => item.uuid).includes(uuid_comment);
      const target = Object.values(data_comment).find(
        (item) => item.uuid === uuid_comment
      );
      ReactDOM.render(
        /* @__PURE__ */ React.createElement(
          Div_comment_button_list,
          {
            data: target || { active: 1, check_comment_reader: "" },
            depth: isUpper ? 1 : 2,
            loading: true
          }
        ),
        document.getElementById(
          "div_comment_footer_" + uuid_comment
        )
      );
      const request_data2 = new FormData();
      request_data2.append("uuid", uuid_comment);
      await fetch("/blank/ajax_board/delete_comment/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data2
      }).then((res) => {
        get_read_article_comment(orderID);
      }).then((res) => res);
      return;
    }
    const editorKey = isNew ? "new" : uuid_comment;
    const currentEditor = editor[editorKey];
    if (!currentEditor) {
      alert("\uC5D0\uB514\uD130\uAC00 \uCD08\uAE30\uD654\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
      return;
    }
    const txt_content = getNoticeEditorHTML(currentEditor);
    const chk_id = isNew ? "chk_secret_new" : "chk_secret_" + uuid_comment;
    const secretEl = document.getElementById(chk_id);
    const chk_secret = secretEl ? secretEl.checked : false;
    if (isNoticeContentEmpty(txt_content)) {
      alert("\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      return;
    }
    const btnId = isNew ? "btn_comment_editor_footer_button" : "btn_comment_editor_footer_button_" + uuid_comment;
    const btnEl = document.getElementById(btnId);
    if (btnEl) {
      ReactDOM.render(
        /* @__PURE__ */ React.createElement(Div_btn_comment_editor_footer_button_loading, null),
        btnEl
      );
    }
    const request_data = new FormData();
    let url2 = "";
    if (action === "submit") {
      url2 = "/blank/ajax_board/insert_comment/";
      request_data.append("uuid_article", orderID);
      if (!isNew) {
        request_data.append("uuid_comment", uuid_comment);
      }
    } else if (action === "edit") {
      url2 = "/blank/ajax_board/update_comment/";
      request_data.append("uuid_comment", uuid_comment);
    } else {
      console.error("Unknown comment_action:", action);
      return;
    }
    request_data.append("txt_content", txt_content);
    request_data.append("chk_secret", chk_secret);
    const responseData = await fetch(url2, {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data
    }).then((res) => res.json());
    if (responseData && responseData.error) {
      alert(responseData.error);
      const btnElAfterError = document.getElementById(btnId);
      if (btnElAfterError) {
        ReactDOM.render(
          /* @__PURE__ */ React.createElement(
            Div_btn_comment_editor_footer_button,
            {
              uuid_comment,
              function: () => comment_action(action, uuid_comment)
            }
          ),
          btnElAfterError
        );
      }
      return;
    }
    const savedCommentUUID = responseData && responseData.uuid ? responseData.uuid : uuid_comment;
    try {
      await uploadNoticeQueuedFiles(noticeQueuedCommentFiles(uuid_comment), {
        note: "Comment",
        scope: "comment",
        articleUUID: orderID,
        commentUUID: savedCommentUUID
      });
      clearNoticeCommentFiles(uuid_comment);
    } catch (error) {
      alert("\uB313\uAE00\uC740 \uC800\uC7A5\uB418\uC5C8\uC9C0\uB9CC \uD30C\uC77C \uC5C5\uB85C\uB4DC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4: " + error.message);
    }
    get_read_article_comment(orderID);
    const btnElAfter = document.getElementById(btnId);
    if (btnElAfter) {
      ReactDOM.render(
        /* @__PURE__ */ React.createElement(
          Div_btn_comment_editor_footer_button,
          {
            uuid_comment,
            function: () => comment_action(action, uuid_comment)
          }
        ),
        btnElAfter
      );
    }
  }
  function comment_file_action(action, uuid_comment) {
    if (action === "delete") {
      clearNoticeCommentFiles(uuid_comment);
      return;
    }
    if (action === "upload") {
      const inputEl = document.getElementById(
        "id_file_upload_" + uuid_comment
      );
      if (!inputEl || !inputEl.files || !inputEl.files[0])
        return;
      queueNoticeCommentFiles(uuid_comment, inputEl.files);
      inputEl.value = "";
    }
  }
  async function get_read_article_comment(orderID_param) {
    const request_data = new FormData();
    request_data.append("orderID", orderID_param);
    data_comment = await fetch(
      "/blank/ajax_board/get_read_article_comment/",
      {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
      }
    ).then((res) => res.json()).then((res) => res);
    await set_comment();
  }
  async function set_comment() {
    if (!data_comment) {
      console.warn("[set_comment] data_comment is null or undefined");
      const container = document.getElementById("div_community_read_comment");
      if (container) {
        container.innerHTML = `
				<div class="w-full py-4 text-sm text-gray-500">
					\uC544\uC9C1 \uB4F1\uB85D\uB41C \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.
				</div>
			`;
      }
      return;
    }
    const allComments = Object.values(data_comment).filter((c) => !!c);
    data_comment_upper = allComments.filter((item) => !item.uuid_upper);
    const list_comment = data_comment_upper.map((comment) => {
      return {
        ...comment,
        rereply: allComments.filter((item) => item.uuid_upper === comment.uuid)
      };
    });
    const commentContainer = document.getElementById("div_community_read_comment");
    if (!commentContainer) {
      console.warn("[set_comment] div_community_read_comment not found");
      return;
    }
    let uuid_article = null;
    let is_secret = 0;
    let check_reader = "guest";
    if (!data_article) {
      console.warn("[set_comment] data_article is undefined; using fallback values");
    } else {
      uuid_article = data_article.uuid;
      is_secret = data_article.is_secret;
      check_reader = data_article.check_reader;
    }
    ReactDOM.render(
      /* @__PURE__ */ React.createElement(
        Div_article_read_comment,
        {
          data: list_comment,
          uuid_article,
          is_secret,
          check_reader
        }
      ),
      commentContainer
    );
    allComments.forEach((comment) => {
      if (!comment || !comment.uuid)
        return;
      const el = document.querySelector("#div_comment_" + comment.uuid);
      if (!el) {
        return;
      }
      WebRSolidEdit.renderContent(el, comment.content || "");
    });
    const newFormEl = document.querySelector("#div_community_read_comment_new_form");
    if (newFormEl) {
      editor["new"] = await mountSolidNoticeCommentEditor("new", "");
      setNoticeEditorHTML(editor["new"], "");
    } else {
      console.warn("[set_comment] #div_community_read_comment_new_form not found");
    }
    for (const comment of data_comment_upper) {
      if (!comment || !comment.uuid)
        continue;
      const replyEl = document.querySelector(
        "#div_community_read_comment_new_" + comment.uuid + "_form"
      );
      if (!replyEl) {
        continue;
      }
      editor[comment.uuid] = await mountSolidNoticeCommentEditor(comment.uuid, "");
      setNoticeEditorHTML(editor[comment.uuid], "");
    }
  }
  async function notice_read_set_main() {
    function Div_main() {
      return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center py-8 px-6 w-full max-w-6xl mx-auto md:px-20" }, /* @__PURE__ */ React.createElement(Div_page_header, { title: header_title, subtitle: header_subtitle }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-1 justify-center items-start w-full gap-4 md:grid-cols-3" }, /* @__PURE__ */ React.createElement("div", { class: "md:col-span-2 w-full" }, /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_header" }, /* @__PURE__ */ React.createElement("div", { class: "w-full h-12 bg-gray-300 mb-4 animate-pulse" })), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_content" }, /* @__PURE__ */ React.createElement("div", { class: "w-full h-48 bg-gray-300 mb-4 animate-pulse" })), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_file" }, /* @__PURE__ */ React.createElement("div", { class: "w-full h-12 bg-gray-300 mb-4 animate-pulse" })), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_comment" }, /* @__PURE__ */ React.createElement("div", { class: "w-full h-24 bg-gray-300 animate-pulse" }))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start w-full space-y-4" }, /* @__PURE__ */ React.createElement("div", { id: "div_article_read_buttons", class: "w-full" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_article_famous_list", title: "\uCD5C\uADFC \uC778\uAE30 \uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_new_comment_list", title: "\uCD5C\uADFC \uB313\uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_my_article_list", title: "\uB0B4\uAC00 \uC4F4 \uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_my_comment_list", title: "\uB0B4\uAC00 \uC4F4 \uB313\uAE00" })))));
    }
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
    try {
      await get_read_article("init");
    } catch (e) {
      console.error("[set_main] get_read_article error:", e);
    }
    get_article_famous_list();
    get_new_comment_list();
    get_my_article_list();
    get_my_comment_list();
  }
  return {
    set_main: notice_read_set_main
  };
})();
const IntroNoticeWrite = /* @__PURE__ */ (() => {
  let header_title = "\uACF5\uC9C0\uC0AC\uD56D";
  let header_subtitle = "Web-R \uC18C\uAC1C";
  let toggle_click_submit = false;
  let editor = null;
  let data = null;
  let class_txt_file_delete = "rounded-lg hover:bg-red-100 cursor-pointer";
  function Div_main(props) {
    return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4 md" }, /* @__PURE__ */ React.createElement("div", { id: "div_title", class: "w-full" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
        id: "txt_title",
        name: "txt_title",
        class: "w-full h-[48px] rounded-lg resize-none scroll-hide\n							  text-start text-[14px] font-[500] border-gray-500\n							  focus:ring-gray-700 focus:border-gray-700"
      }
    )), /* @__PURE__ */ React.createElement("div", { id: "div_checker", class: "flex flex-row justify-end items-center w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-center mb-4" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "chk_secret",
        type: "checkbox",
        value: "",
        class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded\n								  focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
      }
    ), /* @__PURE__ */ React.createElement("label", { for: "chk_secret", class: "ms-2 text-sm font-medium text-gray-900" }, "\uBE44\uBC00\uAE00\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"))), /* @__PURE__ */ React.createElement("div", { id: "div_editor", class: "webr-solid-editor-shell w-full" }), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_article_file_control" }, /* @__PURE__ */ React.createElement(NoticeAttachmentDropZone, { target: "article" })), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_button_list" }, /* @__PURE__ */ React.createElement(Div_button, null)));
  }
  function Div_button() {
    return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 justify-center items-center gap-2 w-full" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => click_btn_submit(),
        class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full\n							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
      },
      "\uC644\uB8CC"
    ), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: init_url,
        class: "text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5\n					  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
      },
      "\uBAA9\uB85D\uC73C\uB85C"
    ));
  }
  function Div_button_loading() {
    return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 justify-center items-center gap-2 w-full" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed\n							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
      },
      /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", role: "status", class: "inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "#1C64F2" })),
      "\uC644\uB8CC"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        class: "text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed\n						   focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
      },
      /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", role: "status", class: "inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "#1C64F2" })),
      "\uBAA9\uB85D\uC73C\uB85C"
    ));
  }
  function check_file_upload() {
    const inputEl = document.getElementById("id_file_upload");
    if (!inputEl || !inputEl.files || !inputEl.files[0])
      return;
    queueNoticeArticleFiles(inputEl.files);
    inputEl.value = "";
  }
  function click_delete_file() {
    clearNoticeArticleFiles();
  }
  async function click_btn_submit() {
    let txt_title = document.getElementById("txt_title").value.trim();
    let txt_content = getNoticeEditorHTML(editor);
    let chk_secret = document.getElementById("chk_secret").checked;
    if (!toggle_click_submit) {
      toggle_click_submit = true;
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_button_loading, null), document.getElementById("div_button_list"));
      if (txt_title == null || txt_title == "") {
        alert("\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      } else if (isNoticeContentEmpty(txt_content)) {
        alert("\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      } else {
        const request_data = new FormData();
        request_data.append("tag", url);
        request_data.append("tag_sub", sub);
        request_data.append("txt_title", txt_title);
        request_data.append("txt_content", txt_content);
        request_data.append("chk_secret", chk_secret);
        const data2 = await fetch("/blank/ajax_board/insert_article/", {
          method: "post",
          headers: { "X-CSRFToken": getCookie("csrftoken") },
          body: request_data
        }).then((res) => {
          return res.json();
        }).then((res) => {
          return res;
        });
        if (data2 && data2.error) {
          alert(data2.error);
          toggle_click_submit = false;
          ReactDOM.render(/* @__PURE__ */ React.createElement(Div_button, null), document.getElementById("div_button_list"));
          return;
        }
        try {
          await uploadNoticeQueuedFiles(noticeQueuedArticleFiles(), {
            note: "Article",
            scope: "article",
            articleUUID: data2.uuid
          });
        } catch (error) {
          alert("\uAC8C\uC2DC\uAE00\uC740 \uC800\uC7A5\uB418\uC5C8\uC9C0\uB9CC \uD30C\uC77C \uC5C5\uB85C\uB4DC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4: " + error.message);
        }
        location.href = init_url + "read/" + data2.uuid + "/";
      }
      toggle_click_submit = false;
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_button, null), document.getElementById("div_button_list"));
    }
  }
  async function notice_write_set_main() {
    if (gv_username != "") {
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
      editor = await mountSolidNoticeEditor();
    } else {
      location.href = init_url;
    }
  }
  return {
    set_main: notice_write_set_main,
    check_file_upload
  };
})();
const IntroNoticeEdit = /* @__PURE__ */ (() => {
  let header_title = "\uACF5\uC9C0\uC0AC\uD56D";
  let header_subtitle = "Web-R \uC18C\uAC1C";
  let toggle_click_submit = false;
  let editor = null;
  let data = null;
  let class_txt_file_delete = "rounded-lg hover:bg-red-100 cursor-pointer";
  function Div_main(props) {
    return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4 md" }, /* @__PURE__ */ React.createElement("div", { id: "div_title", class: "w-full" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
        id: "txt_title",
        name: "txt_title",
        class: "w-full h-[48px] rounded-lg resize-none scroll-hide\n							  text-start text-[14px] font-[500] border-gray-500\n							  focus:ring-gray-700 focus:border-gray-700"
      }
    )), /* @__PURE__ */ React.createElement("div", { id: "div_checker", class: "flex flex-row justify-end items-center w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-center mb-4" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "chk_secret",
        type: "checkbox",
        value: "",
        class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded\n								  focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
      }
    ), /* @__PURE__ */ React.createElement("label", { for: "chk_secret", class: "ms-2 text-sm font-medium text-gray-900" }, "\uBE44\uBC00\uAE00\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"))), /* @__PURE__ */ React.createElement("div", { id: "div_editor", class: "webr-solid-editor-shell w-full" }), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_article_file_control" }, /* @__PURE__ */ React.createElement(NoticeAttachmentDropZone, { target: "article", existing: data ? normalizeNoticeAttachments(data) : [] })), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_button_list" }, /* @__PURE__ */ React.createElement(Div_button, null)));
  }
  function Div_button() {
    return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 justify-center items-center gap-2 w-full" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => click_btn_submit(),
        class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full\n							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
      },
      "\uC644\uB8CC"
    ), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: init_url,
        class: "text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5\n					  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
      },
      "\uBAA9\uB85D\uC73C\uB85C"
    ));
  }
  function Div_button_loading() {
    return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 justify-center items-center gap-2 w-full" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed\n							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
      },
      /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", role: "status", class: "inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "#1C64F2" })),
      "\uC644\uB8CC"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        class: "text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed\n						   focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
      },
      /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", role: "status", class: "inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "#1C64F2" })),
      "\uBAA9\uB85D\uC73C\uB85C"
    ));
  }
  function check_file_upload() {
    const inputEl = document.getElementById("id_file_upload");
    if (!inputEl || !inputEl.files || !inputEl.files[0])
      return;
    queueNoticeArticleFiles(inputEl.files);
    inputEl.value = "";
  }
  async function click_btn_submit() {
    let txt_title = document.getElementById("txt_title").value.trim();
    let txt_content = getNoticeEditorHTML(editor);
    let chk_secret = document.getElementById("chk_secret").checked;
    if (!toggle_click_submit) {
      toggle_click_submit = true;
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_button_loading, null), document.getElementById("div_button_list"));
      if (txt_title == null || txt_title == "") {
        alert("\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      } else if (isNoticeContentEmpty(txt_content)) {
        alert("\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      } else {
        const request_data = new FormData();
        request_data.append("tag", url);
        request_data.append("tag_sub", sub);
        request_data.append("uuid_article", orderID);
        request_data.append("txt_title", txt_title);
        request_data.append("txt_content", txt_content);
        request_data.append("chk_secret", chk_secret);
        if (data && data.file_url != null) {
          request_data.append("attached_file", data.file_url);
        }
        const response_data = await fetch("/blank/ajax_board/update_article/", {
          method: "post",
          headers: { "X-CSRFToken": getCookie("csrftoken") },
          body: request_data
        }).then((res) => res.json()).then((res) => res);
        if (response_data && response_data.error) {
          alert(response_data.error);
          toggle_click_submit = false;
          ReactDOM.render(/* @__PURE__ */ React.createElement(Div_button, null), document.getElementById("div_button_list"));
          return;
        }
        try {
          await uploadNoticeQueuedFiles(noticeQueuedArticleFiles(), {
            note: "Article",
            scope: "article",
            articleUUID: response_data.uuid || orderID
          });
        } catch (error) {
          alert("\uAC8C\uC2DC\uAE00\uC740 \uC800\uC7A5\uB418\uC5C8\uC9C0\uB9CC \uD30C\uC77C \uC5C5\uB85C\uB4DC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4: " + error.message);
        }
        location.href = init_url + "read/" + response_data.uuid + "/";
      }
      toggle_click_submit = false;
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_button, null), document.getElementById("div_button_list"));
    }
  }
  function click_delete_file() {
    data.file_url = null;
    data.file_name = null;
    clearNoticeArticleFiles();
  }
  async function notice_edit_set_main() {
    function Div_check_writer() {
      return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4 md" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", class: "w-8 h-8 animate-spin text-gray-200 fill-blue-600", viewBox: "0 0 100 101" }, /* @__PURE__ */ React.createElement("circle", { cx: "50", cy: "50", r: "45", stroke: "currentColor", "stroke-width": "10", fill: "none" }), /* @__PURE__ */ React.createElement("path", { d: "M95 50a45 45 0 0 1-45 45", stroke: "currentColor", "stroke-width": "10" })), /* @__PURE__ */ React.createElement("p", null, "\uC791\uC131\uC790 \uC5EC\uBD80\uB97C \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.")));
    }
    function Div_main_stop() {
      return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/stop.svg",
          class: "size-16"
        }
      ), /* @__PURE__ */ React.createElement("p", null, "\uC791\uC131\uC790\uB9CC \uAE00\uC744 \uC218\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(
        "a",
        {
          href: init_url,
          class: "text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
        },
        "\uBAA9\uB85D\uC73C\uB85C"
      )));
    }
    if (!gv_username) {
      location.href = init_url;
      return;
    }
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_check_writer, null), document.getElementById("div_main"));
    const fd = new FormData();
    fd.append("orderID", orderID);
    data = await fetch("/blank/ajax_board/get_read_article/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: fd
    }).then((res) => res.json());
    if (data.check_reader === "user") {
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_stop, null), document.getElementById("div_main"));
      return;
    }
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
    document.getElementById("txt_title").value = data.title;
    editor = await mountSolidNoticeEditor(data.content || "");
    setNoticeEditorHTML(editor, data.content);
    document.getElementById("chk_secret").checked = data.is_secret == 1;
    renderNoticeArticleAttachmentControl(data);
  }
  return {
    set_main: notice_edit_set_main,
    check_file_upload
  };
})();
function set_main() {
  normalizeNoticeRoute();
  const currentMode = getNoticeMode();
  if (currentMode === "read") {
    return IntroNoticeRead.set_main();
  }
  if (currentMode === "edit") {
    return IntroNoticeEdit.set_main();
  }
  if (currentMode === "write") {
    return IntroNoticeWrite.set_main();
  }
  return IntroNoticeList.set_main();
}
window.set_main = set_main;
window.check_file_upload = function() {
  const currentMode = getNoticeMode();
  if (currentMode === "edit") {
    return IntroNoticeEdit.check_file_upload();
  }
  if (currentMode === "write") {
    return IntroNoticeWrite.check_file_upload();
  }
  return null;
};
