// scripts/intro/notice/set_main.js
// /intro/notice/ list, read, write, edit 를 하나의 route-aware set_main.js 로 통합한 버전

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
        },
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
    textarea.setAttribute("placeholder", "공지 내용을 입력해주세요.");
    textarea.value = initialHTML || "";
    host.appendChild(textarea);
    return createNoticeEditorFallback(textarea);
}

function getNoticeStorageKey() {
    const currentMode = getNoticeMode() || "write";
    const articleID = (typeof orderID === "undefined" || orderID == null || orderID === "" || orderID === "None") ? "new" : orderID;
    return ["web-r", "intro", "notice", currentMode, articleID].join(":");
}

async function mountSolidNoticeEditor(initialHTML = null) {
    const host = document.getElementById("div_editor");
    if (!host) {
        return null;
    }

    const editorOptions = {
        placeholder: "공지 내용을 입력해주세요.",
        storageKey: getNoticeStorageKey(),
        textareaID: "txt_content",
        textareaName: "txt_content",
        restoreDraft: getNoticeMode() !== "edit",
        ribbonExpanded: false,
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
    return raw
        .replace(/<br\s*\/?>/gi, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/<[^>]*>/g, "")
        .trim() === "";
}

const noticeAttachmentState = {
    articleFiles: [],
    commentFiles: {},
};

function noticeFileHref(raw) {
    raw = String(raw || "").trim();
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    const normalizedPath = raw.startsWith("/") ? raw : "/" + raw;
    return window.location.protocol + "//" + window.location.host + normalizedPath;
}

function normalizeNoticeAttachments(data) {
    const fromArray = Array.isArray(data && data.attachments) ? data.attachments : [];
    const attachments = fromArray
        .map((item) => {
            const fileURL = item.file_url || item.url_file || "";
            const fileName = item.file_name || item.origin_file_name || fileURL;
            return { uuid: item.uuid || "", file_url: fileURL, url_file: fileURL, file_name: fileName, origin_file_name: fileName };
        })
        .filter((item) => item.file_url || item.file_name);
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
    return (noticeAttachmentState.commentFiles && noticeAttachmentState.commentFiles[key]) || [];
}

function noticeAppendQueuedFiles(currentFiles, fileList) {
    const files = Array.from(fileList || []).filter(Boolean);
    const next = currentFiles ? currentFiles.slice() : [];
    files.forEach((file) => {
        const duplicate = next.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified);
        if (!duplicate) next.push(file);
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
    return (
        <div class="p-4 w-full rounded-lg border border-dashed border-blue-300 bg-blue-50" onDrop={onDrop} onDragOver={onDragOver}>
            <input type="file" name={inputId} id={inputId} accept="*" class="hidden" multiple
                   onChange={(event) => {
                       onFiles(event.target.files);
                       event.target.value = "";
                   }} />
            <div class="flex flex-row justify-between items-center gap-3 md:flex-col md:items-start">
                <div class="text-sm text-gray-700">
                    <p class="font-semibold">파일을 끌어다 놓거나 선택해주세요.</p>
                    <p class="text-xs text-gray-500">여러 파일을 한 번에 첨부할 수 있습니다.</p>
                </div>
                <button type="button"
                        class="flex flex-row justify-center items-center py-1.5 px-4 text-white bg-blue-700 font-medium rounded-lg text-center text-sm w-fit hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        onClick={() => {
                            const input = document.getElementById(inputId);
                            if (input) input.click();
                        }}>
                    <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/file_upload.svg" class="w-4 h-4 mr-2" />
                    파일 선택
                </button>
            </div>
            {existing.length > 0 && (
                <div class="mt-3 space-y-1">
                    {existing.map((file, index) => (
                        <a key={"existing_notice_" + index} href={noticeFileHref(file.file_url || file.url_file)} target="_blank" class="block w-fit text-xs text-gray-600 hover:underline">
                            기존 첨부: {file.file_name || file.origin_file_name || file.file_url}
                        </a>
                    ))}
                </div>
            )}
            {files.length > 0 && (
                <div class="mt-3 flex flex-col gap-2">
                    {files.map((file, index) => (
                        <div key={file.name + "_" + index} class="flex flex-row justify-between items-center gap-2 rounded-md bg-white border border-blue-100 px-3 py-2 text-sm">
                            <span class="truncate">{file.name}</span>
                            <button type="button" class="text-xs text-red-600 hover:underline" onClick={() => target === "article" ? removeNoticeArticleFile(index) : removeNoticeCommentFile(commentId, index)}>삭제</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function renderNoticeArticleAttachmentControl(existingData) {
    const host = document.getElementById("div_article_file_control");
    if (!host) return;
    const existing = existingData ? normalizeNoticeAttachments(existingData) : [];
    ReactDOM.render(<NoticeAttachmentDropZone target="article" existing={existing} />, host);
}

function renderNoticeCommentAttachmentControl(commentId) {
    const key = commentId == null ? "new" : String(commentId);
    ["div_comment_file_control_" + key, "div_comment_edit_file_control_" + key].forEach((hostID) => {
        const host = document.getElementById(hostID);
        if (!host) return;
        ReactDOM.render(<NoticeAttachmentDropZone target="comment" commentId={key} />, host);
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
        if (options.articleUUID) formData.append("uuid_article", options.articleUUID);
        if (options.commentUUID) formData.append("uuid_comment", options.commentUUID);
        const result = await fetch("/blank/ajax_file_upload/", {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: formData,
        }).then(res => res.json());
        if (result && result.error) throw new Error(result.error);
    }
}

function getNoticeCommentStorageKey(commentId) {
    const articleID = (typeof orderID === "undefined" || orderID == null || orderID === "" || orderID === "None") ? "new" : orderID;
    return ["web-r", "intro", "notice", "comment", articleID, commentId || "new"].join(":");
}

function createNoticeCommentFallbackInHost(host, commentId, initialHTML = "") {
    if (!host) return null;
    host.innerHTML = "";
    const textarea = document.createElement("textarea");
    textarea.id = "txt_content_comment_" + commentId;
    textarea.name = "txt_content_comment_" + commentId;
    textarea.className = "w-full min-h-[220px] rounded-lg border border-gray-300 p-3 text-sm";
    textarea.setAttribute("rows", "8");
    textarea.setAttribute("placeholder", "댓글을 입력해주세요.");
    textarea.value = initialHTML || "";
    host.appendChild(textarea);
    return createNoticeEditorFallback(textarea);
}

async function mountSolidNoticeCommentEditor(commentId, initialHTML = "", hostID = null) {
    const key = commentId == null ? "new" : String(commentId);
    const defaultHostID = key === "new" ? "div_community_read_comment_new_form" : "div_community_read_comment_new_" + key + "_form";
    const host = document.getElementById(hostID || defaultHostID);
    if (!host) return null;
    const textareaID = "txt_content_comment_" + key;
    const options = {
        placeholder: "댓글을 입력해주세요.",
        storageKey: getNoticeCommentStorageKey(key),
        textareaID: textareaID,
        textareaName: textareaID,
        restoreDraft: !hostID,
        ribbonExpanded: false,
    };
    if (typeof initialHTML === "string") options.html = initialHTML;
    if (window.WebRSolidEditor && typeof window.WebRSolidEditor.mountHost === "function") {
        return await window.WebRSolidEditor.mountHost(host, options);
    }
    return createNoticeCommentFallbackInHost(host, key, initialHTML || "");
}

// ===== scripts/common/div/Div_page_header.js =====
function Div_page_header(props) {
    return (
        <div class="flex flex-row w-full justify-start items-end text-start mb-8">
            <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
                <span class="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
            </h1>
            <p class="text-lg font-normal text-gray-500 sm:text-md pb-2">
                {props.subtitle}
            </p>
        </div>
    )
}

// ===== scripts/common/div/Div_box_header.js =====
function Div_box_header(props) {
    return (
        <p class="flex flex-row text-start w-full font-extrabold underline">{props.title}</p>
    )
}

// ===== scripts/common/div/Span_btn_20241004_0318.js =====
let class_span_btn_default = "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl"

// 사용자 역할에 따른 버튼 렌더링
function Span_btn_user(props) {
	const roles = {
		"관리자": "yellow", "기업회원": "red", "VIP회원": "blue",
		"정회원": "green", "준회원": "gray"
	};
	const role = roles[props.role] || "gray";
	return (
		<span class={`${class_span_btn_default} text-xs bg-${role}-100 text-${role}-800`}>
			<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
			{props.user_nickname}
		</span>
	);
}

// 날짜 버튼 렌더링
function Span_btn_date(props) {
	return (
		<span class={`${class_span_btn_default} text-xs bg-blue-100 text-blue-800`}>
			<img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_${Number(props.date.split("-")[2].substr(0, 2))}.svg`} class="w-3 h-3 mr-1" />
			{props.date}
		</span>
	);
}

// 조회수 버튼 렌더링 (0보다 클 때만)
function Span_btn_article_read(props) {
	return props.cnt_read > 0 && (
		<span class={`${class_span_btn_default} text-xs bg-gray-100 text-blue-800`}>
			<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/eye.svg" class="w-3 h-3 mr-1" />
			{props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
		</span>
	);
}

// 댓글 수 버튼 렌더링 (0보다 클 때만)
function Span_btn_article_comment(props) {
	return props.cnt_comment > 0 && (
		<span class={`${class_span_btn_default} text-xs bg-purple-100 text-blue-800`}>
			<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment.svg" class="w-3 h-3 mr-1" />
			{props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
		</span>
	);
}

// 새 글 표시 (toggle이 1일 때만)
function Span_btn_article_new(props) {
	return props.toggle === 1 && (
		<span class={`${class_span_btn_default} text-[10px] bg-red-500 text-white animate-pulse`}>NEW</span>
	);
}

// 비밀글 표시 (toggle이 1일 때만)
function Span_btn_article_secret(props) {
	return props.toggle === 1 && (
		<span class={`${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse`}>SECRET</span>
	);
}

// 비밀 댓글 표시 (toggle이 1일 때만)
function Span_btn_comment_secret(props) {
	return props.toggle === 1 && (
		<span class={`${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse`}>SECRET</span>
	);
}

// 내 글 표시 (toggle이 "writer"일 때만)
function Span_btn_my_article(props) {
	return props.toggle === "writer" && (
		<span class={`${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse`}>MY</span>
	);
}

// 내 댓글 표시 (toggle이 "writer"일 때만)
function Span_btn_my_comment(props) {
	return props.toggle === "writer" && (
		<span class={`${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse`}>MY</span>
	);
}



// ===== Web-R runtime patch: notice sidebar/list components =====
// 공지사항 번들에는 커뮤니티 공용 board sidebar/list 컴포넌트가 누락되어 있었다.
// /intro/notice/ 진입 시 Div_sidelist_skeleton 미정의 오류로 React 렌더가 중단되므로,
// notice 전용 route에 필요한 최소 공용 컴포넌트와 AJAX 로더를 같은 번들 안에 둔다.
function noticeSafeText(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
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
    if (typeof gv_username === "undefined" || gv_username === null) return "";
    return String(gv_username).trim();
}

function getArticleHrefFromData(data) {
    const item = data || {};
    const uuid = item.uuid || item.uuid_article || "";
    const categoryUrl = item.category_url || item.article_category_url || "notice";
    const categoryUrlSub = item.category_url_sub || item.article_category_url_sub || "";
    const explicitUrl = item.url || item.article_url || "";

    if (categoryUrl === "notice") return "/intro/notice/read/" + uuid + "/";
    if (explicitUrl && explicitUrl.indexOf("/webr/notebook/view/") === 0) return explicitUrl;
    if (categoryUrl === "notebook") return "/webr/notebook/view/" + uuid + "/";
    if (categoryUrl === "visitor") return "/community/visitor/read/" + uuid + "/";
    if (categoryUrl === "rblogger" || categoryUrl === "free") return "/community/read/" + uuid + "/";
    if (categoryUrl === "youtube") return "/workshop/youtube/read/" + uuid + "/";
    if (categoryUrl === "workshop") return "/workshop/read/" + uuid + "/";
    if (explicitUrl) return explicitUrl;
    if (categoryUrl && categoryUrlSub) return "/community/" + categoryUrl + "/" + categoryUrlSub + "/read/" + uuid + "/";
    if (categoryUrl) return "/community/" + categoryUrl + "/read/" + uuid + "/";
    return init_url + "read/" + uuid + "/";
}

function Div_sidelist_skeleton(props) {
    return (
        <div id={props.id} class="w-full">
            <div class="flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl">
                <Div_box_header title={props.title} />
                <div class="flex flex-col justify-center items-center w-full space-y-2 animate-pulse">
                    <div class="h-2.5 bg-gray-200 rounded-full w-full"></div>
                    <div class="h-2.5 bg-gray-200 rounded-full w-full"></div>
                    <div class="h-2.5 bg-gray-200 rounded-full w-full"></div>
                </div>
            </div>
        </div>
    );
}

function Div_new_article_list(props) {
    const item = props.data || {};
    const href = getArticleHrefFromData(item);
    const cu = item.category_url || "notice";

    let categoryTitle = "공지사항";
    let categoryClass = " bg-amber-100 text-amber-700 border-amber-300";
    if (cu === "free") {
        categoryTitle = "자유게시판";
        categoryClass = " bg-blue-100 text-blue-700 border-blue-300";
    } else if (cu === "rblogger") {
        categoryTitle = "R-Blogger";
        categoryClass = " bg-purple-100 text-purple-700 border-purple-300";
    } else if (cu === "notebook") {
        categoryTitle = "Web-R Notebook";
        categoryClass = " bg-emerald-100 text-emerald-700 border-emerald-300";
    } else if (cu === "visitor") {
        categoryTitle = "방명록";
        categoryClass = " bg-orange-100 text-orange-700 border-orange-300";
    }

    return (
        <div class="bg-white w-full">
            <a href={href} class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-50 rounded-lg mx-3 my-2">
                <div class="flex items-center gap-2">
                    <span class={"flex-shrink-0 whitespace-nowrap px-2 py-0.5 border rounded-full text-xs font-semibold" + categoryClass}>
                        {categoryTitle}
                    </span>
                    <span class="min-w-0 flex-1 font-bold text-sm truncate">{item.title}</span>
                    <div class="flex-shrink-0 flex items-center gap-1">
                        <Span_btn_article_new toggle={item.is_new} />
                        <Span_btn_article_secret toggle={item.is_secret} />
                        <Span_btn_my_article toggle={item.check_reader} />
                    </div>
                </div>

                <div class="flex flex-wrap items-center space-x-2">
                    <Span_btn_user user_nickname={item.user_nickname} role={item.user_role} />
                    <Span_btn_date date={item.created_at || ""} />
                    <Span_btn_article_read cnt_read={item.cnt_read || 0} />
                    <Span_btn_article_comment cnt_comment={item.cnt_comment || 0} />
                </div>
            </a>
        </div>
    );
}

function Div_new_comment(props) {
    const item = props.data || {};
    const content = noticeSafeText(item.content).replace(/<[^>]*>?/g, "");
    return (
        <div class="bg-white border-b w-full">
            <a href={getArticleHrefFromData(item)} class="flex flex-col px-6 py-4 space-y-2 cursor-pointer hover:bg-gray-100 w-full">
                <div class="flex flex-row justify-start items-center">
                    <span class="font-normal text-sm w-fit max-w-full truncate ...">{content}</span>
                </div>

                <div class="flex flex-row justify-start items-center border border-gray-300 rounded-lg">
                    <span class="font-normal text-xs text-gray-500 w-full mr-2 truncate ...">
                        <span class="bg-gray-300 px-2 py-1 mr-1">원글:</span>
                        {item.article_title}
                    </span>
                </div>

                <div class="flex flex-wrap justify-start items-center space-x-2">
                    <Span_btn_user user_nickname={item.user_nickname} role={item.user_role} />
                    <Span_btn_date date={item.created_at || ""} />
                </div>
            </a>
        </div>
    );
}

function Div_sidebar_notice(props) {
    return (
        <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
            <Div_box_header title={props.title} />
            <span class="text-sm text-gray-500">{props.message}</span>
        </div>
    );
}

function noticeRenderSidebar(targetId, element) {
    const target = document.getElementById(targetId);
    if (target) ReactDOM.render(element, target);
}

async function noticeFetchSidebar(path, title, renderItem, targetId, loginRequired = false) {
    if (loginRequired && !getCurrentUsername()) {
        noticeRenderSidebar(targetId, <Div_sidebar_notice title={title} message="로그인이 필요합니다." />);
        return;
    }

    function SidebarList(props) {
        const rows = Object.values(props.data || {});
        return (
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title={title} />
                <div class="flex flex-col justify-center items-start w-full space-y-2">
                    {rows.length > 0
                        ? rows.map((row, idx) => renderItem(row, idx))
                        : <span class="text-sm text-gray-500">표시할 항목이 없습니다.</span>}
                </div>
            </div>
        );
    }

    try {
        const request_data = new FormData();
        request_data.append("tag", getSidebarTag());
        const data = await fetch(path, {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data,
        }).then(res => res.json());
        noticeRenderSidebar(targetId, <SidebarList data={data} />);
    } catch (e) {
        console.error("[notice sidebar] load failed:", path, e);
        noticeRenderSidebar(targetId, <Div_sidebar_notice title={title} message="목록을 불러오지 못했습니다." />);
    }
}

async function get_article_famous_list() {
    return noticeFetchSidebar(
        "/blank/ajax_board/get_article_famous_list/",
        "최근 인기 글",
        (article, idx) => <Div_new_article_list key={article.uuid || idx} data={article} />,
        "div_article_famous_list"
    );
}

async function get_my_article_list() {
    return noticeFetchSidebar(
        "/blank/ajax_board/get_my_article_list/",
        "내가 쓴 글",
        (article, idx) => <Div_new_article_list key={article.uuid || idx} data={article} />,
        "div_my_article_list",
        true
    );
}

async function get_my_comment_list() {
    return noticeFetchSidebar(
        "/blank/ajax_board/get_my_comment_list/",
        "내가 쓴 댓글",
        (comment, idx) => <Div_new_comment key={comment.uuid || idx} data={comment} />,
        "div_my_comment_list",
        true
    );
}

async function get_new_comment_list() {
    return noticeFetchSidebar(
        "/blank/ajax_board/get_new_comment_list/",
        "최근 댓글",
        (comment, idx) => <Div_new_comment key={comment.uuid || idx} data={comment} />,
        "div_new_comment_list"
    );
}

const IntroNoticeList = (() => {
// ===== scripts/intro/notice/init_variables.js =====
let header_title = "공지사항"
let header_subtitle = "Web-R 소개"

let toggle_click_submit = false
let editor = null

// ===== scripts/common/board/list/_skeleton/Div_article_list_skeleton.js =====
function Div_article_list_skeleton() {
	return (
		<div class="flex flex-col justify-center items-center w-full space-y-2 animate-pulse">
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
		</div>
	)
}

// ===== scripts/common/board/list/init_variables.js =====
let page_num = 1
let article_counter = 0
let toggle_page = false

// ===== scripts/common/board/list/click_btn_search.js =====
// 검색 버튼 클릭
async function click_btn_search() {
	let search_text = document.getElementById("txt_search").value.trim()

	if (search_text == null || search_text == "") {
		alert("검색어를 입력하세요.");
	} else {
		get_article_list("search")
	}
}

// ===== scripts/common/board/list/get_article_list_20241230_0537.js =====
// 최신 글
async function get_article_list(mode) {
    // 공통 컴포넌트 추출
    const ArticleList = ({ data, isMain = false }) => {
        const article_list = Object.keys(data).map(key =>
            <Div_new_article_list key={key} data={data[key]} />
        );

        const listContent = (
            <div class="flex flex-col justify-center items-start w-full space-y-2">
                {article_list}
                <div id={`div_article_list_${page_num + 1}`} class="w-full"></div>
            </div>
        );

        if (!isMain) return listContent;

        return (
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="최신 글" />
                {listContent}
            </div>
        );
    }

    // 토글 ON
    toggle_page = true;

    // FormData 설정
    const request_data = new FormData();
    request_data.append('tag', url);
    request_data.append('tag_sub', sub);

    // 페이지 번호 및 검색어 처리
    if (mode === "init" || mode === "search") {
        page_num = 1;
        ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list"));

        if (mode === "search") {
            request_data.append('txt_search', document.getElementById("txt_search").value.trim());
        }
    } else {
        page_num += 1;
        ReactDOM.render(
            <Div_article_list_skeleton />,
            document.getElementById(`div_article_list_${page_num}`)
        );
    }

    request_data.append('page', page_num);

    // 데이터 가져오기
    const data = await fetch("/blank/ajax_board/get_article_list/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
    }).then(res => res.json());

    // 결과 렌더링
    article_counter = data["count"].cnt;
    const targetId = mode === "init" || mode === "search"
        ? "div_article_list"
        : `div_article_list_${page_num}`;

    ReactDOM.render(
        <ArticleList
            data={data.list}
            isMain={mode === "init" || mode === "search"}
        />,
        document.getElementById(targetId)
    );

    // 토글 OFF
    toggle_page = false;
}

// ===== scripts/community/list/set_main.js =====
function notice_list_set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={header_title} subtitle={header_subtitle} />

				<div id="div_community_list" class="flex flex-col justify-center items-center w-full space-y-4">
					<div class="grid grid-cols-3 justify-center items-start w-full gap-4 md:grid-cols-1">
						<div id="div_article_list" class="col-span-2 w-full">
							<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
								<Div_box_header title={"최신 글"} />
							</div>
						</div>

						<div class="flex flex-col justify-center items-start w-full space-y-4">
							<button type="button" onClick={() =>
															gv_username == ""
															?   alert("로그인이 필요합니다.")
															:   location.href=init_url + 'write/'
															}
									class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
											hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
								글쓰기
							</button>

							<div class="flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl">
								<p class="flex flex-row text-start w-full">검색</p>
								<input type="text" id="txt_search"
									   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5
											  focus:ring-blue-500 focus:border-blue-500" />

								<div class="flex flex-row justify-end items-center w-full">
									<button type="button" onClick={() => click_btn_search()}
											class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center me-2 mb-2
												   hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300">
										검색
									</button>
								</div>
							</div>

							<Div_sidelist_skeleton id={"div_article_famous_list"} title={"최근 인기 글"} />
							<Div_sidelist_skeleton id={"div_new_comment_list"} title={"최근 댓글"} />
							<Div_sidelist_skeleton id={"div_my_article_list"} title={"내가 쓴 글"} />
							<Div_sidelist_skeleton id={"div_my_comment_list"} title={"내가 쓴 댓글"} />

						</div>
					</div>
				</div>

			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	get_article_list("init")
	get_article_famous_list()
	get_new_comment_list()
	get_my_article_list()
	get_my_comment_list()

	window.addEventListener("scroll", () => {
		// 100을 더하면 스크롤을 끝까지 내리기 100px 전에 데이터를 받아올 수 있다.
		const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;

		if (isScrollEnded && !toggle_page && ((page_num * 20) < article_counter)) {
			get_article_list("next")
		}
	});
}

    return {
        set_main: notice_list_set_main
    };
})();

const IntroNoticeRead = (() => {
// ===== scripts/intro/notice/init_variables.js =====
let header_title = "공지사항"
let header_subtitle = "Web-R 소개"

// ===== scripts/common/board/read/init_variables_20250129_0220.js =====
let data_article = null
let data_comment = null
let data_comment_upper = null
let class_txt_file_delete = "size-4 min-size-4 max-size-4 rounded-lg hover:bg-red-100 cursor-pointer"
let editor = {}
let data_file = [];

// ===== scripts/common/board/read/Div_article_read_buttons_20250127_0344.js =====
function Div_article_read_buttons(props) {
	const btnClass = "font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
	const writeBtn = `text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 ${btnClass}
					  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300`
	const listBtn = `text-gray-900 bg-white border border-gray-900 ${btnClass}
					 focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100`
	const editBtn = `text-green-700 border border-green-700 ${btnClass} py-1
					 hover:text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300`
	const deleteBtn = `text-red-700 border border-red-700 ${btnClass} py-1
					   hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300`

	return (
		<div class="flex flex-col justify-center items-center w-full space-y-2">
			<div class="flex flex-col justify-center items-center space-y-2 w-full">
				<button type="button"
						onClick={() => gv_username ? location.href=init_url+'write/' : alert("로그인이 필요합니다.")}
						class={writeBtn}>
					새 글 쓰기
				</button>
				<a href={init_url} class={listBtn}>목록으로</a>
			</div>
			{props.data.check_reader != "user" && (
				<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
					<button onClick={() => location.href=init_url+"edit/"+orderID+"/"} class={editBtn}>수정</button>
					<button onClick={click_btn_delete} class={deleteBtn}>삭제</button>
				</div>
			)}
		</div>
	)
}

// ===== scripts/common/board/read/article/get_read_article_20251122_2102.js =====
async function get_read_article(mode) {
    const request_data = new FormData();
    request_data.append('orderID', orderID);

    try {
        const res = await fetch("/blank/ajax_board/get_read_article/", {
            method: "post",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data
        });

        if (!res.ok) {
            throw new Error(`get_read_article HTTP error: ${res.status}`);
        }

        // 1) 기본 기사 데이터 먼저 세팅 (이걸로만 화면 렌더)
        data_article = await res.json();
        //console.log("[get_read_article] fetched data_article =", data_article);

        // 2) init 모드면 화면에 뿌리기
        if (mode === "init") {
            try {
                set_article();
            } catch (e) {
                //console.error("[get_read_article] set_article() error:", e);
            }
        }

        // 3) 댓글 불러오기
        try {
            get_read_article_comment(orderID);
        } catch (e) {
            //console.error("[get_read_article] get_read_article_comment() error:", e);
        }

        // 4) category_url 확인 후, rblogger면 백그라운드로 refresh 실행
        let normalizedCategory = null;
        if (data_article && typeof data_article.category_url === "string") {
            normalizedCategory = data_article.category_url.trim().toLowerCase();
            //console.log("[get_read_article] category_url(normalized) =", normalizedCategory);
        }

        if (normalizedCategory === "rblogger") {
            //console.log("[get_read_article] rblogger article detected. start refresh. orderID =", orderID);
            // 🔹 화면에는 기존 data_article을 그대로 쓰고,
            //    refresh는 서버 DB 갱신용으로만 사용
            refresh_article_rblogger(orderID);  // 굳이 await 안 해도 됨
        }

    } catch (err) {
        console.error("[get_read_article] fetch or JSON error:", err);
    }
}


// ===== scripts/common/board/read/article/click_btn_delete.js =====
async function click_btn_delete() {
	if (confirm("정말로 삭제할까요?")) {
		const request_data = new FormData();
		request_data.append('uuid', orderID);

		const data = await fetch("/blank/ajax_board/delete_article/", {
							method: "post",
							headers: { "X-CSRFToken": getCookie("csrftoken"), },
							body: request_data
							})
							.then(res=> { return res.json(); })
							.then(res=> { return res; });

		location.href=init_url
	}
}

// ===== scripts/common/board/read/article/Div_article_read_header_20240914_0136.js =====
function Div_article_read_header(props) {
	return (
		<div class="flex flex-col justify-center items-start py-4 border-t border-b border-gray-200 w-full">
			<div class="flex flex-row justify-start items-end w-full">
				<span class="flex flex-row justify-start items-center text-lg font-extrabold w-full space-x-2">
					{props.data.title}
					<div></div>
					<Span_btn_article_new toggle={props.data.is_new} />
					<Span_btn_article_secret toggle={props.data.is_secret} />
					<Span_btn_my_article toggle={props.data.check_reader} />
				</span>
			</div>

			<div class="flex flex-row justify-end items-center w-full">
				<span class="flex flex-row justify-end items-center text-md font-normal w-full space-x-2">
					<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
					<Span_btn_date date={props.data.created_at} />
					<Span_btn_article_read cnt_read={props.data.cnt_read} />
					<Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
				</span>
			</div>
		</div>
	)
}

// ===== scripts/common/board/read/article/Div_article_read_file_20251122_1443.js =====
function Div_article_read_file(props) {
    const data = data_article;
    if (!data) return null;

    const isRblogger = data.category_url === "rblogger";
    const hasUrl = !!data.url;
    const attachments = normalizeNoticeAttachments(data);
    const hasFile = attachments.length > 0;

    // 🔒 비밀글: admin, writer 외에는 아예 보이지 않게
    if (
        data.is_secret === 1 &&
        data.check_reader !== "admin" &&
        data.check_reader !== "writer"
    ) {
        return null;
    }

    // 🌐 rblogger인데 URL이 없으면 섹션 자체 숨김
    if (isRblogger && !hasUrl) {
        return null;
    }

    // 📎 rblogger가 아니고 첨부파일이 없으면 섹션 자체 숨김
    if (!isRblogger && !hasFile) {
        return null;
    }

    // =========================
    //  rblogger: 원문 링크 출력
    // =========================
    if (isRblogger) {
        return (
            <section class="bg-white py-8 lg:py-16 antialiased">
                <div class="w-full mx-auto px-4 space-y-2">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-md lg:text-lg font-bold text-gray-900">
                            원문 링크
                        </h2>
                    </div>

                    <form class="mb-3">
                        <div class="w-full bg-gray-50 rounded-lg border border-gray-200"></div>
                    </form>

                    <div class="flex flex-row justify-start items-start w-full">
                        <a
                            href={data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-600 underline break-all text-md cursor-pointer hover:text-blue-800 hover:bg-gray-50 px-1 py-0.5 rounded"
                        >
                            {data.url}
                        </a>
                    </div>
                </div>
            </section>
        );
    }


    // =========================
    //  일반 게시글: 첨부파일 출력
    // =========================
    return (
        <section class="bg-white py-8 lg:py-16 antialiased">
            <div class="w-full mx-auto px-4 space-y-2">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-md lg:text-lg font-bold text-gray-900">
                        첨부파일
                    </h2>
                </div>

                <form class="mb-3">
                    <div class="w-full bg-gray-50 rounded-lg border border-gray-200"></div>
                </form>

                <div class="flex flex-col justify-start items-start w-full gap-2">
                    {attachments.map((file, index) => (
                        <a
                            key={"notice_file_" + index}
                            href={noticeFileHref(file.file_url || file.url_file)}
                            target="_blank"
                            class="flex flex-row justify-end items-center text-md font-normal w-fit space-x-2 cursor-pointer hover:bg-gray-100"
                        >
                            {file.file_name || file.origin_file_name || file.file_url}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}


// ===== scripts/common/board/read/article/set_article_20240914_0153.js =====
function set_article() {
	// 헤더
	ReactDOM.render(<Div_article_read_header data={data_article} />, document.getElementById("div_community_read_header"))
	ReactDOM.render(<Div_article_read_buttons data={data_article} />, document.getElementById("div_article_read_buttons"))
	ReactDOM.render(<Div_article_read_file data={data_article} />, document.getElementById("div_community_read_file"))

	const viewer = toastui.Editor.factory({
		el: document.querySelector('#div_community_read_content'),
		viewer: true,
		initialValue: data_article.content
	  });
}

// ===== scripts/common/board/read/comment/Div_btn_comment_editor_footer_button_20251122_1600.js =====
function Div_btn_comment_editor_footer_button(props) {
  return (
    <button
      type="button"
      onClick={props.function}
      class="flex flex-row justify-center items-center
             text-white bg-gradient-to-r from-cyan-500 to-blue-500
             font-medium rounded-lg text-sm px-5 py-1 text-center
             hover:bg-gradient-to-bl hover:bg-gray-300
             focus:ring-4 focus:outline-none focus:ring-cyan-300"
    >
      등록
    </button>
  );
}


// ===== scripts/common/board/read/comment/Div_btn_comment_editor_footer_button_loading_20251122_1600.js =====
function Div_btn_comment_editor_footer_button_loading(props) {
  return (
    <button
      type="button"
      class="flex flex-row justify-center items-center
             text-white bg-gradient-to-r from-cyan-500 to-blue-500
             font-medium rounded-lg text-sm px-5 py-1 text-center
             hover:bg-gradient-to-bl hover:bg-gray-300
             focus:ring-4 focus:outline-none focus:ring-cyan-300
             cursor-not-allowed"
    >
      <svg
        aria-hidden="true"
        role="status"
        class="inline w-4 h-4 mr-2 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858
             100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50
             0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116
             97.0079 33.5539C95.2932 28.8227 92.871 24.3692
             89.8167 20.348C85.8452 15.1192 80.8826 10.7238
             75.2124 7.41289C69.5422 4.10194 63.2754 1.94025
             56.7698 1.05124C51.7666 0.367541 46.6976 0.446843
             41.7345 1.27873C39.2613 1.69328 37.813 4.19778
             38.4501 6.62326C39.0873 9.04874 41.5694 10.4717
             44.0505 10.1071C47.8511 9.54855 51.7191 9.52689
             55.5402 10.0491C60.8642 10.7766 65.9928 12.5457
             70.6331 15.2552C75.2735 17.9648 79.3347 21.5619
             82.5849 25.841C84.9175 28.9121 86.7997 32.2913
             88.1811 35.8758C89.083 38.2158 91.5421 39.6781
             93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      등록
    </button>
  );
}


// ===== scripts/common/board/read/comment/Div_btn_comment_footer_20251122_1600.js =====
function Div_btn_comment_footer(props) {
  return (
    <button
      type="button"
      class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium"
      onClick={props.function}
    >
      {props.url_image && (
        <img src={props.url_image} class="w-4 h-4 mr-2" />
      )}
      {props.text}
    </button>
  );
}


// ===== scripts/common/board/read/comment/Div_btn_comment_footer_loading_20251122_1600.js =====
function Div_btn_comment_footer_loading(props) {
  return (
    <button
      type="button"
      class="flex justify-center items-center text-sm text-gray-400 font-medium cursor-not-allowed"
    >
      <svg
        aria-hidden="true"
        class="inline w-4 h-4 text-gray-200 animate-spin mr-2"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858
             100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50
             0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116
             97.0079 33.5539C95.2932 28.8227 92.871 24.3692
             89.8167 20.348C85.8452 15.1192 80.8826 10.7238
             75.2124 7.41289C69.5422 4.10194 63.2754 1.94025
             56.7698 1.05124C51.7666 0.367541 46.6976 0.446843
             41.7345 1.27873C39.2613 1.69328 37.813 4.19778
             38.4501 6.62326C39.0873 9.04874 41.5694 10.4717
             44.0505 10.1071C47.8511 9.54855 51.7191 9.52689
             55.5402 10.0491C60.8642 10.7766 65.9928 12.5457
             70.6331 15.2552C75.2735 17.9648 79.3347 21.5619
             82.5849 25.841C84.9175 28.9121 86.7997 32.2913
             88.1811 35.8758C89.083 38.2158 91.5421 39.6781
             93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      {props.text}
    </button>
  );
}


// ===== scripts/common/board/read/comment/Div_comment_button_list_20251122_1600.js =====
function Div_comment_button_list(props) {
  const { data, depth, loading } = props;
  const isDepth1 = depth === 1;

  const ButtonComp = loading
    ? Div_btn_comment_footer_loading
    : Div_btn_comment_footer;

  return (
    <div class="flex items-center space-x-4">
      {/* depth1: 대댓글 버튼 */}
      {isDepth1 &&
        !loading &&
        gv_username !== "" && (
          <ButtonComp
            text={"대댓글"}
            function={() => click_btn_reply_comment(data.uuid)}
            url_image="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_re_reply.svg"
          />
        )}

      {/* 수정 버튼 */}
      {data &&
        data.check_comment_reader !== "user" &&
        data.active === 1 && (
          <ButtonComp
            text={"수정"}
            function={
              !loading
                ? () => click_btn_edit_comment(data.uuid)
                : undefined
            }
            url_image={
              !loading
                ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg"
                : null
            }
          />
        )}

      {/* 삭제 버튼 */}
      {data &&
        data.check_comment_reader !== "user" &&
        data.active === 1 && (
          <ButtonComp
            text={"삭제"}
            function={
              !loading
                ? () => comment_action("delete", data.uuid)
                : undefined
            }
            url_image={
              !loading
                ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg"
                : null
            }
          />
        )}
    </div>
  );
}


// ===== scripts/common/board/read/comment/Div_comment_form_20251122_1600.js =====
function Div_comment_form(props) {
  const isNewComment = props.uuid_comment == null;
  const commentId = isNewComment ? "new" : props.uuid_comment;

  return (
    <div class={props.class}>
      <p class="flex flex-row underline">{props.title}</p>

      <div
        id={"div_community_read_comment_new_" + (isNewComment ? "form" : commentId + "_form")}
        class="w-full"
      ></div>

      <div
        class="w-full"
        id={"div_comment_editor_footer_button_" + commentId}
      >
        <div class="flex flex-col justify-between items-center w-full space-x-2 space-y-2">
          <div class="w-full" id={"div_comment_file_control_" + commentId}>
            <NoticeAttachmentDropZone target="comment" commentId={commentId} />
          </div>

          <div class="flex flex-row justify-end items-center w-full space-x-2">
            <input
              id={"chk_secret_" + commentId}
              type="checkbox"
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              for={"chk_secret_" + commentId}
              class="ms-2 text-sm font-medium text-gray-900"
            >
              <p>
                비밀 댓글
                <span>
                  로 작성하기 (본인과 글 작성자, 관리자만 읽을 수 있습니다.)
                </span>
              </p>
            </label>

            <div
              class="w-fit"
              id={
                "btn_comment_editor_footer_button" +
                (isNewComment ? "" : "_" + commentId)
              }
            >
              <Div_btn_comment_editor_footer_button
                uuid_comment={commentId}
                function={() =>
                  comment_action("submit", commentId)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ===== scripts/common/board/read/comment/Div_article_read_comment_20251122_1600.js =====
function Div_article_read_comment(props) {
  function Div_comment_header(propsHeader) {
    return (
      <div class="flex flex-row justify-start items-center space-x-2">
        <Span_btn_user
          user_nickname={propsHeader.data.user_nickname}
          role={propsHeader.data.user_role}
        />
        <Span_btn_date date={propsHeader.data.created_at} />
        <Span_btn_comment_secret toggle={propsHeader.data.is_secret} />
        <Span_btn_my_comment toggle={propsHeader.data.check_comment_reader} />
      </div>
    );
  }

  function Div_comment(propsComment) {
    const isDepth2 = propsComment.depth === 2;
    const depthValue = isDepth2 ? 2 : 1;

    const bgColorClass =
      propsComment.data.user_writer == 1
        ? isDepth2
          ? "bg-blue-100 border border-blue-700"
          : "bg-blue-50"
        : isDepth2
        ? "bg-gray-50"
        : "bg-white";

    const comment_depth2_list =
      !isDepth2 &&
      Object.keys(propsComment.data.rereply || {}).map((key) => (
        <Div_comment
          key={propsComment.data.rereply[key].uuid}
          data={propsComment.data.rereply[key]}
          depth={2}
        />
      ));

    const attachments = normalizeNoticeAttachments(propsComment.data);

    return (
      <article
        class={
          "px-6 py-3 " +
          (isDepth2 ? "ml-4 " : "") +
          "text-base " +
          bgColorClass +
          " rounded-xl w-full space-y-2"
        }
      >
        <div class="flex justify-between items-center space-x-2">
          <Div_comment_header data={propsComment.data} />
        </div>

        <div
          class="text-gray-500"
          id={"div_comment_" + propsComment.data.uuid}
        ></div>

        {attachments.length > 0 && (
          <div class="flex flex-col justify-start items-start gap-1 text-sm">
            {attachments.map((file, index) => (
              <div key={"notice_comment_file_" + propsComment.data.uuid + "_" + index} class="flex flex-row justify-start items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  class="w-4 h-4 text-gray-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v12a2 2 0 01-2 2z"
                  />
                </svg>
                <a
                  href={noticeFileHref(file.file_url || file.url_file)}
                  target="_blank"
                  class="hover:underline"
                >
                  {file.file_name || file.origin_file_name || file.file_url}
                </a>
              </div>
            ))}
          </div>
        )}

        <div
          class="w-full"
          id={"div_comment_footer_" + propsComment.data.uuid}
        >
          <Div_comment_button_list
            data={propsComment.data}
            depth={depthValue}
            loading={false}
          />
        </div>

        {comment_depth2_list}

        {!isDepth2 && (
          <div
            id={
              "div_community_read_comment_new_" +
              propsComment.data.uuid
            }
            class="hidden"
          >
            <Div_comment_form
              title={"대댓글 쓰기"}
              class={"mt-4 p-4 bg-white rounded-lg w-full space-y-2"}
              uuid_comment={propsComment.data.uuid}
            />
          </div>
        )}
      </article>
    );
  }

  const comment_list = Object.keys(props.data).map((key) => (
    <Div_comment
      key={props.data[key].uuid}
      data={props.data[key]}
      depth={1}
      is_secret={props.is_secret}
      check_reader={props.check_reader}
    />
  ));

  return (
    <section class="bg-white py-8 lg:py-16 antialiased">
      <div class="w-full mx-auto px-4 space-y-2">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg lg:text-2xl font-bold text-gray-900">
            댓글 ({props.data.length})
          </h2>
        </div>

        <form class="mb-6">
          <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200">
            <div id="div_comment_new" class="w-full"></div>
          </div>
        </form>

        <div class="flex flex-col justify-center items-end w-full space-y-0">
          {comment_list}
        </div>

        {gv_username !== "" && (
          <div
            class="flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full"
            id="div_community_read_comment_new"
          >
            <Div_comment_form
              title={"댓글 쓰기"}
              class={"w-full space-y-2"}
              uuid_comment={null}
            />
          </div>
        )}
      </div>
    </section>
  );
}


// ===== scripts/common/board/read/comment/click_btn_reply_comment_20251122_1600.js =====
function click_btn_reply_comment(uuid_comment) {
  data_comment_upper.forEach((c) => {
    const el = document.getElementById(
      "div_community_read_comment_new_" + c.uuid
    );
    if (!el) return;
    if (c.uuid === uuid_comment) {
      el.className =
        "mt-4 p-4 bg-white rounded-lg w-full space-y-2";
    } else {
      el.className = "hidden";
    }
  });
}


// ===== scripts/common/board/read/comment/click_btn_edit_comment_20251122_1600.js =====
async function click_btn_edit_comment(uuid_comment) {
  function Div_comment_editor_form(props) {
    return (
      <div class="w-full">
        <div
          class="w-full"
          id={"div_comment_editor_main_" + props.uuid_comment}
        ></div>
        <div class="w-full mt-2" id={"div_comment_edit_file_control_" + props.uuid_comment}>
          <NoticeAttachmentDropZone target="comment" commentId={props.uuid_comment} />
        </div>
        <div class="flex flex-row justify-end items-center w-full space-x-2 mt-2">
          <input
            id={"chk_secret_" + props.uuid_comment}
            type="checkbox"
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded
                   focus:ring-blue-500 focus:ring-2"
          />
          <label
            for={"chk_secret_" + props.uuid_comment}
            class="ms-2 text-sm font-medium text-gray-900"
          >
            비밀 댓글로 작성하기 (본인과 글 작성자, 관리자만 읽을 수 있습니다.)
          </label>
          <div
            class="w-fit"
            id={
              "btn_comment_editor_footer_button_" +
              props.uuid_comment
            }
          >
            <Div_btn_comment_editor_footer_button
              uuid_comment={props.uuid_comment}
              function={() =>
                comment_action("edit", props.uuid_comment)
              }
            />
          </div>
        </div>
      </div>
    );
  }

  ReactDOM.render(
    <Div_comment_editor_form uuid_comment={uuid_comment} />,
    document.getElementById("div_comment_" + uuid_comment)
  );

  const target = Object.values(data_comment).find(
    (item) => item.uuid === uuid_comment
  );
  editor[uuid_comment] = await mountSolidNoticeCommentEditor(uuid_comment, target ? target.content || "" : "", "div_comment_editor_main_" + uuid_comment);
  if (target) {
    setNoticeEditorHTML(editor[uuid_comment], target.content || "");
    const chkEl = document.getElementById("chk_secret_" + uuid_comment);
    if (chkEl) chkEl.checked = target.is_secret == 1;
  }
}


// ===== scripts/common/board/read/comment/comment_action_20251122_1600.js =====
async function comment_action(action, uuid_comment) {
  const isNew = uuid_comment === "new";

  if (action === "delete") {
    if (!confirm("정말로 삭제할까요?")) return;

    const isUpper = data_comment_upper
      .map((item) => item.uuid)
      .includes(uuid_comment);

    const target = Object.values(data_comment).find(
      (item) => item.uuid === uuid_comment
    );

    ReactDOM.render(
      <Div_comment_button_list
        data={target || { active: 1, check_comment_reader: "" }}
        depth={isUpper ? 1 : 2}
        loading={true}
      />,
      document.getElementById(
        "div_comment_footer_" + uuid_comment
      )
    );

    const request_data = new FormData();
    request_data.append("uuid", uuid_comment);

    await fetch("/blank/ajax_board/delete_comment/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data,
    })
      .then((res) => {
        get_read_article_comment(orderID);
      })
      .then((res) => res);

    return;
  }

  const editorKey = isNew ? "new" : uuid_comment;
  const currentEditor = editor[editorKey];

  if (!currentEditor) {
    alert("에디터가 초기화되지 않았습니다. 새로고침 후 다시 시도해주세요.");
    return;
  }

  const txt_content = getNoticeEditorHTML(currentEditor);

  const chk_id = isNew
    ? "chk_secret_new"
    : "chk_secret_" + uuid_comment;
  const secretEl = document.getElementById(chk_id);
  const chk_secret = secretEl ? secretEl.checked : false;

  if (isNoticeContentEmpty(txt_content)) {
    alert("내용을 입력해주세요.");
    return;
  }

  const btnId = isNew
    ? "btn_comment_editor_footer_button"
    : "btn_comment_editor_footer_button_" + uuid_comment;

  const btnEl = document.getElementById(btnId);
  if (btnEl) {
    ReactDOM.render(
      <Div_btn_comment_editor_footer_button_loading />,
      btnEl
    );
  }

  const request_data = new FormData();
  let url = "";

  if (action === "submit") {
    url = "/blank/ajax_board/insert_comment/";
    request_data.append("uuid_article", orderID);
    if (!isNew) {
      request_data.append("uuid_comment", uuid_comment);
    }
  } else if (action === "edit") {
    url = "/blank/ajax_board/update_comment/";
    request_data.append("uuid_comment", uuid_comment);
  } else {
    console.error("Unknown comment_action:", action);
    return;
  }

  request_data.append("txt_content", txt_content);
  request_data.append("chk_secret", chk_secret);

  const responseData = await fetch(url, {
    method: "post",
    headers: { "X-CSRFToken": getCookie("csrftoken") },
    body: request_data,
  })
    .then((res) => res.json());

  if (responseData && responseData.error) {
    alert(responseData.error);
    const btnElAfterError = document.getElementById(btnId);
    if (btnElAfterError) {
      ReactDOM.render(
        <Div_btn_comment_editor_footer_button
          uuid_comment={uuid_comment}
          function={() =>
            comment_action(action, uuid_comment)
          }
        />,
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
      commentUUID: savedCommentUUID,
    });
    clearNoticeCommentFiles(uuid_comment);
  } catch (error) {
    alert("댓글은 저장되었지만 파일 업로드에 실패했습니다: " + error.message);
  }

  get_read_article_comment(orderID);

  const btnElAfter = document.getElementById(btnId);
  if (btnElAfter) {
    ReactDOM.render(
      <Div_btn_comment_editor_footer_button
        uuid_comment={uuid_comment}
        function={() =>
          comment_action(action, uuid_comment)
        }
      />,
      btnElAfter
    );
  }
}


// ===== scripts/common/board/read/comment/comment_file_action_20251122_1600.js =====
function comment_file_action(action, uuid_comment) {
  if (action === "delete") {
    clearNoticeCommentFiles(uuid_comment);
    return;
  }

  if (action === "upload") {
    const inputEl = document.getElementById(
      "id_file_upload_" + uuid_comment
    );
    if (!inputEl || !inputEl.files || !inputEl.files[0]) return;

    queueNoticeCommentFiles(uuid_comment, inputEl.files);
    inputEl.value = "";
  }
}


// ===== scripts/common/board/read/comment/get_read_article_comment_20251122_1600.js =====
async function get_read_article_comment(orderID_param) {
  const request_data = new FormData();
  request_data.append("orderID", orderID_param);

  data_comment = await fetch(
    "/blank/ajax_board/get_read_article_comment/",
    {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data,
    }
  )
    .then((res) => res.json())
    .then((res) => res);

  await set_comment();
}


// ===== scripts/common/board/read/comment/set_comment_20251122_2103.js =====
async function set_comment() {
	// 0) 댓글 데이터가 아예 없거나 비정상이면 바로 종료
	if (!data_comment) {
		console.warn("[set_comment] data_comment is null or undefined");
		const container = document.getElementById("div_community_read_comment");
		if (container) {
			container.innerHTML = `
				<div class="w-full py-4 text-sm text-gray-500">
					아직 등록된 댓글이 없습니다.
				</div>
			`;
		}
		return;
	}

	// 1) 전체 댓글에서 null/undefined 제거
	const allComments = Object.values(data_comment).filter(c => !!c);

	// 2) Depth 1 필터링 (상위 댓글만)
	data_comment_upper = allComments.filter(item => !item.uuid_upper);

	// 3) 대댓글 묶기
	const list_comment = data_comment_upper.map(comment => {
		return {
			...comment,
			rereply: allComments.filter(item => item.uuid_upper === comment.uuid)
		};
	});

	// 4) React로 댓글 렌더링
	const commentContainer = document.getElementById("div_community_read_comment");
	if (!commentContainer) {
		console.warn("[set_comment] div_community_read_comment not found");
		return;
	}

	// data_article이 아직 없더라도 기본값으로 처리 (타이밍 이슈 방어)
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
		<Div_article_read_comment
			data={list_comment}
			uuid_article={uuid_article}
			is_secret={is_secret}
			check_reader={check_reader}
		/>,
		commentContainer
	);

	// 5) 댓글 뷰어 설정 (본문 보기)
	allComments.forEach(comment => {
		if (!comment || !comment.uuid) return;
		const el = document.querySelector('#div_comment_' + comment.uuid);
		if (!el) {
			// console.warn(`[set_comment] #div_comment_${comment.uuid} not found`);
			return;
		}
		new toastui.Editor.factory({
			el: el,
			viewer: true,
			initialValue: comment.content || ""
		});
	});

		// 8) 새 댓글 에디터
		const newFormEl = document.querySelector('#div_community_read_comment_new_form');
		if (newFormEl) {
			editor["new"] = await mountSolidNoticeCommentEditor("new", "");
			setNoticeEditorHTML(editor["new"], "");
		} else {
			console.warn("[set_comment] #div_community_read_comment_new_form not found");
		}

		// 9) 대댓글 에디터
		for (const comment of data_comment_upper) {
			if (!comment || !comment.uuid) continue;
			const replyEl = document.querySelector(
				'#div_community_read_comment_new_' + comment.uuid + "_form"
			);
			if (!replyEl) {
				// console.warn(`[set_comment] reply form for ${comment.uuid} not found`);
				continue;
			}
			editor[comment.uuid] = await mountSolidNoticeCommentEditor(comment.uuid, "");
			setNoticeEditorHTML(editor[comment.uuid], "");
		}
	}


// ===== scripts/common/board/read/set_main_20251122_2104.js =====
async function notice_read_set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto
						md:px-8">
				<Div_page_header title={header_title} subtitle={header_subtitle} />

				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<div class="grid grid-cols-3 justify-center items-start w-full gap-4 md:grid-cols-1">
						<div class="col-span-2 w-full">
							<div class="w-full" id="div_community_read_header">
								<div class="w-full h-12 bg-gray-300 mb-4 animate-pulse"></div>
							</div>
							<div class="w-full" id="div_community_read_content">
								<div class="w-full h-48 bg-gray-300 mb-4 animate-pulse"></div>
							</div>
							<div class="w-full" id="div_community_read_file">
								<div class="w-full h-12 bg-gray-300 mb-4 animate-pulse"></div>
							</div>
							<div class="w-full" id="div_community_read_comment">
								<div class="w-full h-24 bg-gray-300 animate-pulse"></div>
							</div>
						</div>

						<div class="flex flex-col justify-center items-start w-full space-y-4">
							<div id="div_article_read_buttons" class="w-full"></div>

							<Div_sidelist_skeleton id={"div_article_famous_list"} title={"최근 인기 글"} />
							<Div_sidelist_skeleton id={"div_new_comment_list"} title={"최근 댓글"} />
							<Div_sidelist_skeleton id={"div_my_article_list"} title={"내가 쓴 글"} />
							<Div_sidelist_skeleton id={"div_my_comment_list"} title={"내가 쓴 댓글"} />

						</div>
					</div>
				</div>

			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))

	// 기사 + 댓글 로딩
	try {
		await get_read_article("init")
	} catch (e) {
		console.error("[set_main] get_read_article error:", e)
	}

	// 사이드 리스트들은 독립적으로 불러도 됨
	get_article_famous_list()
	get_new_comment_list()
	get_my_article_list()
	get_my_comment_list()
}


    return {
        set_main: notice_read_set_main
    };
})();

const IntroNoticeWrite = (() => {
// ===== scripts/intro/notice/init_variables.js =====
let header_title = "공지사항"
let header_subtitle = "Web-R 소개"

let toggle_click_submit = false
let editor = null

// ===== scripts/common/board/write/init_variables_20250127_1722.js =====
let data = null
let class_txt_file_delete = "rounded-lg hover:bg-red-100 cursor-pointer"

// ===== scripts/common/board/write/Div_main.js =====
function Div_main(props) {
	return (
		<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
			<div id="div_title" class="w-full">
				<input type="text" placeholder="제목을 입력해주세요." id="txt_title" name="txt_title"
					   class="w-full h-[48px] rounded-lg resize-none scroll-hide
							  text-start text-[14px] font-[500] border-gray-500
							  focus:ring-gray-700 focus:border-gray-700" />
			</div>

			<div id="div_checker" class="flex flex-row justify-end items-center w-full">
				<div class="flex items-center mb-4">
					<input id="chk_secret" type="checkbox" value=""
						   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
								  focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2" />
					<label for="chk_secret" class="ms-2 text-sm font-medium text-gray-900">비밀글로 작성하기 (본인과 관리자만 읽을 수 있습니다.)</label>
				</div>
			</div>

			<div id="div_editor" class="webr-solid-editor-shell w-full"></div>

				<div class="w-full" id="div_article_file_control">
					<NoticeAttachmentDropZone target="article" />
				</div>

			<div class="w-full" id="div_button_list">
				<Div_button />
			</div>
		</div>
	)
}

// ===== scripts/common/board/write/Div_button.js =====
function Div_button() {
	return (
		<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
			<button type="button" onClick={() => click_btn_submit()}
					class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
				완료
			</button>
			<a href={init_url}
			   class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5
					  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
				목록으로
			</a>
		</div>
	)
}

// ===== scripts/common/board/write/Div_button_loading.js =====
function Div_button_loading() {
	return (
		<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
			<button type="button"
					class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed
							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
				<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
				</svg>
				완료
			</button>
			<button type="button"
					class="text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed
						   focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
				<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
				</svg>
				목록으로
			</button>
		</div>
	)
}

// ===== scripts/common/board/write/check_file_upload_20240526_2322.js =====
// 프로필 사진 - 새 파일 업로드
function check_file_upload() {
	const inputEl = document.getElementById('id_file_upload');
	if (!inputEl || !inputEl.files || !inputEl.files[0]) return;
	queueNoticeArticleFiles(inputEl.files);
	inputEl.value = "";
}

// ===== scripts/common/board/write/click_delete_file.js =====
function click_delete_file() {
	clearNoticeArticleFiles();
}

// ===== scripts/common/board/write/click_btn_submit_20240526_1326.js =====
async function click_btn_submit() {
	let txt_title = document.getElementById("txt_title").value.trim()
	let txt_content = getNoticeEditorHTML(editor)
	let chk_secret = document.getElementById("chk_secret").checked      // true / false

	if (!toggle_click_submit) {
		// 토글 ON
		toggle_click_submit = true
		ReactDOM.render(<Div_button_loading />, document.getElementById("div_button_list"));


		// 제목을 입력하지 않음
		if (txt_title == null || txt_title == "") {
			alert("제목을 입력해주세요.");


		// 내용을 입력하지 않음
		} else if (isNoticeContentEmpty(txt_content)) {
			alert("내용을 입력해주세요.");


		// 게시글 등록
		} else {
			const request_data = new FormData();
			request_data.append('tag', url);
			request_data.append('tag_sub', sub);
			request_data.append('txt_title', txt_title);
			request_data.append('txt_content', txt_content);
			request_data.append('chk_secret', chk_secret);
				const data = await fetch("/blank/ajax_board/insert_article/", {
									method: "post",
									headers: { "X-CSRFToken": getCookie("csrftoken"), },
								body: request_data
								})
									.then(res=> { return res.json(); })
									.then(res=> { return res; });

				if (data && data.error) {
					alert(data.error);
					toggle_click_submit = false;
					ReactDOM.render(<Div_button />, document.getElementById("div_button_list"));
					return;
				}

				try {
					await uploadNoticeQueuedFiles(noticeQueuedArticleFiles(), {
						note: "Article",
						scope: "article",
						articleUUID: data.uuid,
					});
				} catch (error) {
					alert("게시글은 저장되었지만 파일 업로드에 실패했습니다: " + error.message);
				}

				location.href=init_url + "read/" + data.uuid + "/"
			}


		// 토글 OFF
		toggle_click_submit = false
		ReactDOM.render(<Div_button />, document.getElementById("div_button_list"));
	}
}

// ===== scripts/common/board/write/set_main_20251129_1153.js =====
// ===============================
// 게시판 메인 셋업
// ===============================
async function notice_write_set_main() {
	// Menu
	if (gv_username != "") {
		ReactDOM.render(<Div_main />, document.getElementById("div_main"))
		editor = await mountSolidNoticeEditor();

	} else {
		location.href = init_url
	}
}

    return {
        set_main: notice_write_set_main,
        check_file_upload
    };
})();

const IntroNoticeEdit = (() => {
// ===== scripts/intro/notice/init_variables.js =====
let header_title = "공지사항"
let header_subtitle = "Web-R 소개"

let toggle_click_submit = false
let editor = null

// ===== scripts/common/board/write/init_variables_20250127_1722.js =====
let data = null
let class_txt_file_delete = "rounded-lg hover:bg-red-100 cursor-pointer"

// ===== scripts/common/board/write/Div_main.js =====
function Div_main(props) {
	return (
		<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
			<div id="div_title" class="w-full">
				<input type="text" placeholder="제목을 입력해주세요." id="txt_title" name="txt_title"
					   class="w-full h-[48px] rounded-lg resize-none scroll-hide
							  text-start text-[14px] font-[500] border-gray-500
							  focus:ring-gray-700 focus:border-gray-700" />
			</div>

			<div id="div_checker" class="flex flex-row justify-end items-center w-full">
				<div class="flex items-center mb-4">
					<input id="chk_secret" type="checkbox" value=""
						   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
								  focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2" />
					<label for="chk_secret" class="ms-2 text-sm font-medium text-gray-900">비밀글로 작성하기 (본인과 관리자만 읽을 수 있습니다.)</label>
				</div>
			</div>

			<div id="div_editor" class="webr-solid-editor-shell w-full"></div>

				<div class="w-full" id="div_article_file_control">
					<NoticeAttachmentDropZone target="article" existing={data ? normalizeNoticeAttachments(data) : []} />
				</div>

			<div class="w-full" id="div_button_list">
				<Div_button />
			</div>
		</div>
	)
}

// ===== scripts/common/board/write/Div_button.js =====
function Div_button() {
	return (
		<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
			<button type="button" onClick={() => click_btn_submit()}
					class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
				완료
			</button>
			<a href={init_url}
			   class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5
					  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
				목록으로
			</a>
		</div>
	)
}

// ===== scripts/common/board/write/Div_button_loading.js =====
function Div_button_loading() {
	return (
		<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
			<button type="button"
					class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed
							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
				<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
				</svg>
				완료
			</button>
			<button type="button"
					class="text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed
						   focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
				<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
				</svg>
				목록으로
			</button>
		</div>
	)
}

// ===== scripts/common/board/write/check_file_upload_20240526_2322.js =====
// 프로필 사진 - 새 파일 업로드
function check_file_upload() {
	const inputEl = document.getElementById('id_file_upload');
	if (!inputEl || !inputEl.files || !inputEl.files[0]) return;
	queueNoticeArticleFiles(inputEl.files);
	inputEl.value = "";
}

// ===== scripts/common/board/edit/click_btn_submit_20251129_1352.js =====
async function click_btn_submit() {
    let txt_title = document.getElementById("txt_title").value.trim();
    let txt_content = getNoticeEditorHTML(editor);
    let chk_secret = document.getElementById("chk_secret").checked; // true / false

    if (!toggle_click_submit) {
        // 토글 ON
        toggle_click_submit = true;
        ReactDOM.render(<Div_button_loading />, document.getElementById("div_button_list"));

        // 제목을 입력하지 않음
        if (txt_title == null || txt_title == "") {
            alert("제목을 입력해주세요.");

        // 내용을 입력하지 않음
        } else if (isNoticeContentEmpty(txt_content)) {
            alert("내용을 입력해주세요.");

        // 게시글 수정
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
                body: request_data,
            })
                .then((res) => res.json())
                .then((res) => res);

            if (response_data && response_data.error) {
                alert(response_data.error);
                toggle_click_submit = false;
                ReactDOM.render(<Div_button />, document.getElementById("div_button_list"));
                return;
            }

            try {
                await uploadNoticeQueuedFiles(noticeQueuedArticleFiles(), {
                    note: "Article",
                    scope: "article",
                    articleUUID: response_data.uuid || orderID,
                });
            } catch (error) {
                alert("게시글은 저장되었지만 파일 업로드에 실패했습니다: " + error.message);
            }

            location.href = init_url + "read/" + response_data.uuid + "/";
        }

        // 토글 OFF
        toggle_click_submit = false;
        ReactDOM.render(<Div_button />, document.getElementById("div_button_list"));
    }
}


// ===== scripts/common/board/edit/click_delete_file_20240916_1757.js =====
function click_delete_file() {
	data.file_url = null
	data.file_name = null
	clearNoticeArticleFiles();
}

// ===== scripts/common/board/edit/set_main_20251129_1352.js =====
async function notice_edit_set_main() {
    // 작성자 여부 확인 중일 때 화면
    function Div_check_writer() {
        return (
            <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
                <div class="flex flex-col justify-center items-center w-full space-y-4">
                    {/* 간단 로딩 스피너 */}
                    <svg aria-hidden="true" class="w-8 h-8 animate-spin text-gray-200 fill-blue-600" viewBox="0 0 100 101">
                        <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="10" fill="none"></circle>
                        <path d="M95 50a45 45 0 0 1-45 45" stroke="currentColor" stroke-width="10"></path>
                    </svg>
                    <p>작성자 여부를 확인하고 있습니다.</p>
                </div>
            </div>
        );
    }

    // 작성자가 아닐 때 화면
    function Div_main_stop() {
        return (
            <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
                <div class="flex flex-col justify-center items-center w-full space-y-4">
                    <img
                        src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg"
                        class="size-16"
                    />
                    <p>작성자만 글을 수정할 수 있습니다.</p>
                    <a
                        href={init_url}
                        class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
                    >
                        목록으로
                    </a>
                </div>
            </div>
        );
    }

    // 로그인 안 되어 있으면 목록으로 이동
    if (!gv_username) {
        location.href = init_url;
        return;
    }

    // 우선 "작성자 확인중" 화면 렌더
    ReactDOM.render(<Div_check_writer />, document.getElementById("div_main"));

    // ✅ FormData 생성
    const fd = new FormData();
    fd.append("orderID", orderID);

    // 게시글 내용/작성자 확인 (전역 data 에 저장)
    data = await fetch("/blank/ajax_board/get_read_article/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: fd
    }).then((res) => res.json());

    // 작성자가 아니면 수정 불가
    if (data.check_reader === "user") {
        ReactDOM.render(<Div_main_stop />, document.getElementById("div_main"));
        return;
    }

    // 메인 편집 화면 렌더 (Div_main 은 이미 다른 JS에서 정의됨)
    ReactDOM.render(<Div_main />, document.getElementById("div_main"));

    // 기존 데이터 세팅
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
window.check_file_upload = function () {
    const currentMode = getNoticeMode();
    if (currentMode === "edit") {
        return IntroNoticeEdit.check_file_upload();
    }
    if (currentMode === "write") {
        return IntroNoticeWrite.check_file_upload();
    }
    return null;
};
