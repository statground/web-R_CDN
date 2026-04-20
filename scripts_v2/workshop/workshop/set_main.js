
let header_title = "워크샵";
let header_subtitle = "워크샵";

let page_num = 1;
let article_counter = 0;
let toggle_page = false;
let articleEditor = null;
let articleEditorMode = "write";
let commentEditors = {};
let uploadedArticleFile = null;
let commentFiles = [];
let data_article = null;
let data_comment = null;
let data_comment_upper = [];
let currentEditArticle = null;
let toggle_click_submit = false;

const PAGE_SIZE = 20;
const class_txt_file_delete = "rounded-lg hover:bg-red-100 cursor-pointer";

const ENDPOINTS = {
    menuHeader: "/ajax_get_menu_header/",
    list: "/blank/ajax_board/get_article_list/",
    read: "/blank/ajax_board/get_read_article/",
    readComments: "/blank/ajax_board/get_read_article_comment/",
    articleDelete: "/blank/ajax_board/delete_article/",
    articleInsert: "/blank/ajax_board/insert_article/",
    articleUpdate: "/blank/ajax_board/update_article/",
    articleFamous: "/blank/ajax_board/get_article_famous_list/",
    myArticle: "/blank/ajax_board/get_my_article_list/",
    myComment: "/blank/ajax_board/get_my_comment_list/",
    newComment: "/blank/ajax_board/get_new_comment_list/",
    commentInsert: "/blank/ajax_board/insert_comment/",
    commentUpdate: "/blank/ajax_board/update_comment/",
    commentDelete: "/blank/ajax_board/delete_comment/",
    fileUpload: "/blank/ajax_file_upload/"
};

function getCurrentUsername() {
    return typeof gv_username === "string" ? gv_username : "";
}

function normalizeBool(value) {
    return value === true || value === 1 || value === "1";
}

function getCsrfToken() {
    if (typeof getCookie === "function") {
        return getCookie("csrftoken") || "";
    }
    const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
}

async function postForm(url, formData, options = {}) {
    const parseJson = options.parseJson !== false;

    const response = await fetch(url, {
        method: "post",
        headers: { "X-CSRFToken": getCsrfToken() },
        body: formData
    });

    if (!response.ok) {
        throw new Error(url + " -> HTTP " + response.status);
    }

    if (!parseJson) {
        return response;
    }

    const text = await response.text();
    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return text;
    }
}

function clearInfiniteScroll() {
    if (window.__workshopListScrollHandler) {
        window.removeEventListener("scroll", window.__workshopListScrollHandler);
        window.__workshopListScrollHandler = null;
    }
}

function bindInfiniteScroll(handler) {
    clearInfiniteScroll();
    window.__workshopListScrollHandler = handler;
    window.addEventListener("scroll", handler);
}

function numberWithCommas(value) {
    if (value == null || value === "") return "0";
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function safeDateText(value) {
    if (!value) return "";
    return String(value);
}

async function _compressImageOnce(blob, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();

                img.onload = function () {
                    let width = img.width;
                    let height = img.height;

                    const widthRatio = maxWidth / width;
                    const heightRatio = maxHeight / height;
                    const ratio = Math.min(widthRatio, heightRatio, 1);

                    const targetWidth = Math.round(width * ratio);
                    const targetHeight = Math.round(height * ratio);

                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    ctx.clearRect(0, 0, targetWidth, targetHeight);
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                    let mimeType = blob.type;
                    if (mimeType !== "image/png" && mimeType !== "image/jpeg") {
                        mimeType = "image/jpeg";
                    }

                    let dataUrl;
                    if (mimeType === "image/png") {
                        dataUrl = canvas.toDataURL("image/png");
                    } else {
                        dataUrl = canvas.toDataURL("image/jpeg", quality);
                    }

                    resolve(dataUrl);
                };

                img.onerror = reject;
                img.src = e.target.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(blob);
        } catch (error) {
            reject(error);
        }
    });
}

async function compressImage(blob, maxWidth = 1200, maxHeight = 1200, quality = 0.8, maxSizeKB = 500) {
    let currentQuality = quality;
    let dataUrl = await _compressImageOnce(blob, maxWidth, maxHeight, currentQuality);

    const calcSizeKB = (base64) => {
        const commaIndex = base64.indexOf(",");
        const base64Str = commaIndex >= 0 ? base64.substring(commaIndex + 1) : base64;
        const byteLength = Math.ceil(base64Str.length * 3 / 4);
        return byteLength / 1024;
    };

    let sizeKB = calcSizeKB(dataUrl);

    while (sizeKB > maxSizeKB && currentQuality > 0.3) {
        currentQuality = parseFloat((currentQuality - 0.1).toFixed(2));
        if (currentQuality <= 0.3) {
            currentQuality = 0.3;
        }

        dataUrl = await _compressImageOnce(blob, maxWidth, maxHeight, currentQuality);
        sizeKB = calcSizeKB(dataUrl);
    }

    return dataUrl;
}

function Div_page_header(props) {
    return (
        <div class="flex flex-row w-full justify-start items-end text-start mb-8">
            <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
                <span class="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
            </h1>
            <p class="text-lg font-normal text-gray-500 sm:text-md pb-2">{props.subtitle}</p>
        </div>
    );
}

function Div_box_header(props) {
    return <p class="flex flex-row text-start w-full font-extrabold underline">{props.title}</p>;
}

let class_span_btn_default = "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl";

function Span_btn_user(props) {
    const roles = {
        "관리자": "yellow",
        "기업회원": "red",
        "VIP회원": "blue",
        "정회원": "green",
        "준회원": "gray"
    };
    const role = roles[props.role] || "gray";
    return (
        <span class={"flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl text-xs bg-" + role + "-100 text-" + role + "-800"}>
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
            {props.user_nickname}
        </span>
    );
}

function Span_btn_date(props) {
    const rawDate = safeDateText(props.date);
    const dateKey = rawDate && rawDate.split("-")[2] ? Number(rawDate.split("-")[2].substr(0, 2)) : 1;
    return (
        <span class={class_span_btn_default + " text-xs bg-blue-100 text-blue-800"}>
            <img src={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_" + dateKey + ".svg"} class="w-3 h-3 mr-1" />
            {rawDate}
        </span>
    );
}

function Span_btn_article_read(props) {
    if (!(Number(props.cnt_read || 0) > 0)) return null;
    return (
        <span class={class_span_btn_default + " text-xs bg-gray-100 text-blue-800"}>
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/eye.svg" class="w-3 h-3 mr-1" />
            {numberWithCommas(props.cnt_read)}
        </span>
    );
}

function Span_btn_article_comment(props) {
    if (!(Number(props.cnt_comment || 0) > 0)) return null;
    return (
        <span class={class_span_btn_default + " text-xs bg-purple-100 text-blue-800"}>
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment.svg" class="w-3 h-3 mr-1" />
            {numberWithCommas(props.cnt_comment)}
        </span>
    );
}

function Span_btn_article_new(props) {
    return normalizeBool(props.toggle) ? (
        <span class={class_span_btn_default + " text-[10px] bg-red-500 text-white animate-pulse"}>NEW</span>
    ) : null;
}

function Span_btn_article_secret(props) {
    return normalizeBool(props.toggle) ? (
        <span class={class_span_btn_default + " text-[10px] bg-gray-500 text-white animate-pulse"}>SECRET</span>
    ) : null;
}

function Span_btn_comment_secret(props) {
    return normalizeBool(props.toggle) ? (
        <span class={class_span_btn_default + " text-[10px] bg-gray-500 text-white animate-pulse"}>SECRET</span>
    ) : null;
}

function Span_btn_my_article(props) {
    return props.toggle === "writer" ? (
        <span class={class_span_btn_default + " text-[10px] bg-blue-500 text-white animate-pulse"}>MY</span>
    ) : null;
}

function Span_btn_my_comment(props) {
    return props.toggle === "writer" ? (
        <span class={class_span_btn_default + " text-[10px] bg-blue-500 text-white animate-pulse"}>MY</span>
    ) : null;
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

function Div_article_list_skeleton() {
    return (
        <div class="flex flex-col justify-center items-center w-full space-y-2 animate-pulse">
            <div class="h-5 bg-gray-200 rounded-full w-full"></div>
            <div class="h-5 bg-gray-200 rounded-full w-full"></div>
            <div class="h-5 bg-gray-200 rounded-full w-full"></div>
            <div class="h-5 bg-gray-200 rounded-full w-full"></div>
            <div class="h-5 bg-gray-200 rounded-full w-full"></div>
        </div>
    );
}

function Div_new_article_list(props) {
    return (
        <div class="bg-white border-b w-full">
            <a href={init_url + "read/" + props.data.uuid + "/"} class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
                <div class="flex flex-row justify-start items-center space-x-2">
                    <span class="font-bold text-sm w-fit max-w-9/12 truncate ...">{props.data.title}</span>
                    <Span_btn_article_new toggle={props.data.is_new} />
                    <Span_btn_article_secret toggle={props.data.is_secret} />
                    <Span_btn_my_article toggle={props.data.check_reader} />
                </div>
                <div class="flex flex-wrap justify-start items-center w-full space-x-2">
                    <Span_btn_user user_nickname={props.data.user_nickname} role={props.data.user_role} />
                    <Span_btn_date date={props.data.created_at} />
                    <Span_btn_article_read cnt_read={props.data.cnt_read} />
                    <Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
                </div>
            </a>
        </div>
    );
}

function Div_new_comment(props) {
    const plainText = (props.data.content || "").replace(/<[^>]*>?/g, "");
    return (
        <div class="bg-white border-b w-full">
            <a href={init_url + "read/" + props.data.uuid_article + "/"} class="flex flex-col px-6 py-4 space-y-2 cursor-pointer hover:bg-gray-100 w-full">
                <div class="flex flex-row justify-start items-center">
                    <span class="font-normal text-sm w-fit max-w-full truncate ...">{plainText}</span>
                </div>

                <div class="flex flex-row justify-start items-center border border-gray-300 rounded-lg">
                    <span class="font-normal text-xs text-gray-500 w-full mr-2 truncate ...">
                        <span class="bg-gray-300 px-2 py-1 mr-1">원글:</span>
                        {props.data.article_title}
                    </span>
                </div>

                <div class="flex flex-wrap justify-start items-center space-x-2">
                    <Span_btn_user user_nickname={props.data.user_nickname} role={props.data.user_role} />
                    <Span_btn_date date={props.data.created_at} />
                </div>
            </a>
        </div>
    );
}

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
                    <Span_btn_user user_nickname={props.data.user_nickname} role={props.data.user_role} />
                    <Span_btn_date date={props.data.created_at} />
                    <Span_btn_article_read cnt_read={props.data.cnt_read} />
                    <Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
                </span>
            </div>
        </div>
    );
}

function Div_article_read_file(props) {
    const article = props.data || data_article;
    if (!article || !article.file_url) return null;

    const fileHref = article.file_url.startsWith("http")
        ? article.file_url
        : (article.file_url.startsWith("/") ? article.file_url : "/" + article.file_url);

    return (
        <section class="bg-white py-8 lg:py-16 antialiased">
            <div class="w-full mx-auto px-4 space-y-2">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-md lg:text-lg font-bold text-gray-900">첨부파일</h2>
                </div>
                <form class="mb-3">
                    <div class="w-full bg-gray-50 rounded-lg border border-gray-200"></div>
                </form>
                <div class="flex flex-row justify-center items-start w-full">
                    <a href={fileHref} target="_blank" class="flex flex-row justify-end items-center text-md font-normal w-fit space-x-2 cursor-pointer hover:bg-gray-100">
                        {article.file_name}
                    </a>
                </div>
            </div>
        </section>
    );
}

function Div_article_read_buttons(props) {
    const btnClass = "font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full";
    const writeBtn = "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 " + btnClass + " hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300";
    const listBtn = "text-gray-900 bg-white border border-gray-900 " + btnClass + " focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100";
    const editBtn = "text-green-700 border border-green-700 " + btnClass + " py-1 hover:text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300";
    const deleteBtn = "text-red-700 border border-red-700 " + btnClass + " py-1 hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300";

    return (
        <div class="flex flex-col justify-center items-center w-full space-y-2">
            <div class="flex flex-col justify-center items-center space-y-2 w-full">
                <button
                    type="button"
                    onClick={() => getCurrentUsername() ? (location.href = init_url + "write/") : alert("로그인이 필요합니다.")}
                    class={writeBtn}
                >
                    새 글 쓰기
                </button>
                <a href={init_url} class={listBtn}>목록으로</a>
            </div>
            {props.data.check_reader !== "user" && (
                <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
                    <button onClick={() => location.href = init_url + "edit/" + orderID + "/"} class={editBtn}>수정</button>
                    <button type="button" onClick={() => click_btn_delete()} class={deleteBtn}>삭제</button>
                </div>
            )}
        </div>
    );
}

function Div_btn_comment_editor_footer_button(props) {
    return (
        <button
            type="button"
            onClick={props.function}
            class="flex flex-row justify-center items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center hover:bg-gradient-to-bl hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-cyan-300"
        >
            등록
        </button>
    );
}

function Div_btn_comment_editor_footer_button_loading() {
    return (
        <button
            type="button"
            class="flex flex-row justify-center items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center hover:bg-gradient-to-bl hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-cyan-300 cursor-not-allowed"
        >
            <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
            등록
        </button>
    );
}

function Div_btn_comment_footer(props) {
    return (
        <button type="button" class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium" onClick={props.function}>
            {props.url_image && <img src={props.url_image} class="w-4 h-4 mr-2" />}
            {props.text}
        </button>
    );
}

function Div_btn_comment_footer_loading(props) {
    return (
        <button type="button" class="flex justify-center items-center text-sm text-gray-400 font-medium cursor-not-allowed">
            <svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin mr-2" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
            {props.text}
        </button>
    );
}

function Div_comment_button_list(props) {
    const { data, depth, loading } = props;
    const isDepth1 = depth === 1;
    const ButtonComp = loading ? Div_btn_comment_footer_loading : Div_btn_comment_footer;

    return (
        <div class="flex items-center space-x-4">
            {isDepth1 && !loading && getCurrentUsername() !== "" && (
                <ButtonComp
                    text="대댓글"
                    function={() => click_btn_reply_comment(data.uuid)}
                    url_image="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_re_reply.svg"
                />
            )}

            {data && data.check_comment_reader !== "user" && data.active === 1 && (
                <ButtonComp
                    text="수정"
                    function={!loading ? () => click_btn_edit_comment(data.uuid) : undefined}
                    url_image={!loading ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg" : null}
                />
            )}

            {data && data.check_comment_reader !== "user" && data.active === 1 && (
                <ButtonComp
                    text="삭제"
                    function={!loading ? () => comment_action("delete", data.uuid) : undefined}
                    url_image={!loading ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg" : null}
                />
            )}
        </div>
    );
}

function Div_comment_form(props) {
    const isNewComment = props.uuid_comment == null;
    const commentId = isNewComment ? "new" : props.uuid_comment;

    return (
        <div class={props.class}>
            <p class="flex flex-row underline">{props.title}</p>
            <div id={"div_community_read_comment_new_" + (isNewComment ? "form" : commentId + "_form")} class="w-full"></div>

            <div class="w-full" id={"div_comment_editor_footer_button_" + commentId}>
                <div class="flex flex-col justify-between items-center w-full space-x-2 space-y-2">
                    <div class="flex flex-row justify-start items-center w-full space-x-2">
                        <input
                            type="file"
                            name={"id_file_upload_" + commentId}
                            id={"id_file_upload_" + commentId}
                            accept="*"
                            class="hidden"
                            onChange={() => comment_file_action("upload", commentId)}
                        />

                        <button
                            type="button"
                            class="flex flex-row justify-center items-center py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                            onClick={() => document.getElementById("id_file_upload_" + commentId).click()}
                        >
                            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/file_upload.svg" class="w-4 h-4 mr-2 md:mr-0" />
                            <p class="block md:hidden">파일 첨부하기</p>
                        </button>

                        <p id={"txt_filename_" + commentId}></p>
                        <p id={"txt_file_delete_" + commentId} class="hidden" onClick={() => comment_file_action("delete", commentId)}>
                            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/trash.svg" class="w-4 h-4" />
                        </p>
                    </div>

                    <div class="flex flex-row justify-end items-center w-full space-x-2">
                        <input id={"chk_secret_" + commentId} type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2" />
                        <label for={"chk_secret_" + commentId} class="ms-2 text-sm font-medium text-gray-900">
                            <p>비밀 댓글<span>로 작성하기 (본인과 글 작성자, 관리자만 읽을 수 있습니다.)</span></p>
                        </label>

                        <div class="w-fit" id={"btn_comment_editor_footer_button" + (isNewComment ? "" : "_" + commentId)}>
                            <Div_btn_comment_editor_footer_button uuid_comment={commentId} function={() => comment_action("submit", commentId)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Div_article_read_comment(props) {
    function Div_comment_header(propsHeader) {
        return (
            <div class="flex flex-row justify-start items-center space-x-2">
                <Span_btn_user user_nickname={propsHeader.data.user_nickname} role={propsHeader.data.user_role} />
                <Span_btn_date date={propsHeader.data.created_at} />
                <Span_btn_comment_secret toggle={propsHeader.data.is_secret} />
                <Span_btn_my_comment toggle={propsHeader.data.check_comment_reader} />
            </div>
        );
    }

    function Div_comment(propsComment) {
        const isDepth2 = propsComment.depth === 2;
        const depthValue = isDepth2 ? 2 : 1;

        const bgColorClass = propsComment.data.user_writer == 1
            ? (isDepth2 ? "bg-blue-100 border border-blue-700" : "bg-blue-50")
            : (isDepth2 ? "bg-gray-50" : "bg-white");

        const comment_depth2_list = !isDepth2 && Object.keys(propsComment.data.rereply || {}).map((key) => (
            <Div_comment key={propsComment.data.rereply[key].uuid} data={propsComment.data.rereply[key]} depth={2} />
        ));

        let fileHref = "";
        if (propsComment.data.file_url) {
            const raw = propsComment.data.file_url;
            if (raw.startsWith("http://") || raw.startsWith("https://")) {
                fileHref = raw;
            } else {
                const normalizedPath = raw.startsWith("/") ? raw : "/" + raw;
                fileHref = window.location.protocol + "//" + window.location.host + normalizedPath;
            }
        }

        return (
            <article class={"px-6 py-3 " + (isDepth2 ? "ml-4 " : "") + "text-base " + bgColorClass + " rounded-xl w-full space-y-2"}>
                <div class="flex justify-between items-center space-x-2">
                    <Div_comment_header data={propsComment.data} />
                </div>

                <div class="text-gray-500" id={"div_comment_" + propsComment.data.uuid}></div>

                {propsComment.data.file_url != null && (
                    <div class="flex flex-row justify-start items-center space-x-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 text-gray-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v12a2 2 0 01-2 2z" />
                        </svg>
                        <a href={fileHref} target="_blank" class="hover:underline">{propsComment.data.file_name}</a>
                    </div>
                )}

                <div class="w-full" id={"div_comment_footer_" + propsComment.data.uuid}>
                    <Div_comment_button_list data={propsComment.data} depth={depthValue} loading={false} />
                </div>

                {comment_depth2_list}

                {!isDepth2 && (
                    <div id={"div_community_read_comment_new_" + propsComment.data.uuid} class="hidden">
                        <Div_comment_form title="대댓글 쓰기" class="mt-4 p-4 bg-white rounded-lg w-full space-y-2" uuid_comment={propsComment.data.uuid} />
                    </div>
                )}
            </article>
        );
    }

    const comment_list = Object.keys(props.data).map((key) => (
        <Div_comment key={props.data[key].uuid} data={props.data[key]} depth={1} />
    ));

    return (
        <section class="bg-white py-8 lg:py-16 antialiased">
            <div class="w-full mx-auto px-4 space-y-2">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-lg lg:text-2xl font-bold text-gray-900">댓글 ({props.data.length})</h2>
                </div>

                <form class="mb-6">
                    <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200">
                        <div id="div_comment_new" class="w-full"></div>
                    </div>
                </form>

                <div class="flex flex-col justify-center items-end w-full space-y-0">
                    {comment_list}
                </div>

                {getCurrentUsername() !== "" && (
                    <div class="flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full" id="div_community_read_comment_new">
                        <Div_comment_form title="댓글 쓰기" class="w-full space-y-2" uuid_comment={null} />
                    </div>
                )}
            </div>
        </section>
    );
}

function Div_article_submit_buttons(props) {
    if (props.loading) {
        return (
            <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
                <button type="button" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                    </svg>
                    완료
                </button>
                <button type="button" class="text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                    </svg>
                    목록으로
                </button>
            </div>
        );
    }

    return (
        <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
            <button type="button" onClick={() => click_btn_submit()} class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
                완료
            </button>
            <a href={init_url} class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
                목록으로
            </a>
        </div>
    );
}

function Div_article_editor_main() {
    return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
            <div id="div_title" class="w-full">
                <input
                    type="text"
                    placeholder="제목을 입력해주세요."
                    id="txt_title"
                    name="txt_title"
                    class="w-full h-[48px] rounded-lg resize-none scroll-hide text-start text-[14px] font-[500] border-gray-500 focus:ring-gray-700 focus:border-gray-700"
                />
            </div>

            <div id="div_checker" class="flex flex-row justify-end items-center w-full">
                <div class="flex items-center mb-4">
                    <input id="chk_secret" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                    <label for="chk_secret" class="ms-2 text-sm font-medium text-gray-900">비밀글로 작성하기 (본인과 관리자만 읽을 수 있습니다.)</label>
                </div>
            </div>

            <div id="div_editor" class="w-full"></div>

            <div class="flex flex-row justify-start items-center space-x-4">
                <button
                    type="button"
                    class="flex flex-row justify-center items-center py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    onClick={() => document.getElementById("id_file_upload").click()}
                >
                    <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/file_upload.svg" class="w-4 h-4 mr-2" />
                    파일 첨부하기
                </button>
                <p id="txt_filename"></p>
                <p id="txt_file_delete" class="hidden" onClick={() => click_delete_file()}>
                    <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/trash.svg" class="w-4 h-4" />
                </p>
            </div>

            <div class="w-full" id="div_button_list">
                <Div_article_submit_buttons loading={false} />
            </div>
        </div>
    );
}

function Div_status_loading(props) {
    return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
            <div class="flex flex-col justify-center items-center w-full space-y-4">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <p>{props.text}</p>
            </div>
        </div>
    );
}

function Div_status_stop(props) {
    return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
            <div class="flex flex-col justify-center items-center w-full space-y-4">
                <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg" class="size-16" />
                <p>{props.text}</p>
                <a href={init_url} class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
                    목록으로
                </a>
            </div>
        </div>
    );
}

function WorkshopListPage() {
    return (
        <div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
            <Div_page_header title={header_title} subtitle={header_subtitle} />

            <div id="div_community_list" class="flex flex-col justify-center items-center w-full space-y-4">
                <div class="grid grid-cols-3 justify-center items-start w-full gap-4 md:grid-cols-1">
                    <div id="div_article_list" class="col-span-2 w-full">
                        <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                            <Div_box_header title="최신 글" />
                        </div>
                    </div>

                    <div class="flex flex-col justify-center items-start w-full space-y-4">
                        <button
                            type="button"
                            onClick={() => getCurrentUsername() === "" ? alert("로그인이 필요합니다.") : (location.href = init_url + "write/")}
                            class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
                        >
                            글쓰기
                        </button>

                        <div class="flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl">
                            <p class="flex flex-row text-start w-full">검색</p>
                            <input id="txt_search" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                            <div class="flex flex-row justify-end items-center w-full">
                                <button
                                    type="button"
                                    onClick={() => click_btn_search()}
                                    class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center me-2 mb-2 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300"
                                >
                                    검색
                                </button>
                            </div>
                        </div>

                        <Div_sidelist_skeleton id="div_article_famous_list" title="최근 인기 글" />
                        <Div_sidelist_skeleton id="div_new_comment_list" title="최근 댓글" />
                        <Div_sidelist_skeleton id="div_my_article_list" title="내가 쓴 글" />
                        <Div_sidelist_skeleton id="div_my_comment_list" title="내가 쓴 댓글" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function WorkshopReadPage() {
    return (
        <div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
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
                        <Div_sidelist_skeleton id="div_article_famous_list" title="최근 인기 글" />
                        <Div_sidelist_skeleton id="div_new_comment_list" title="최근 댓글" />
                        <Div_sidelist_skeleton id="div_my_article_list" title="내가 쓴 글" />
                        <Div_sidelist_skeleton id="div_my_comment_list" title="내가 쓴 댓글" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function renderArticleSubmitButtons(loading = false) {
    const target = document.getElementById("div_button_list");
    if (!target) return;
    ReactDOM.render(<Div_article_submit_buttons loading={loading} />, target);
}

async function get_article_famous_list() {
    const target = document.getElementById("div_article_famous_list");
    if (!target) return;

    const request_data = new FormData();
    request_data.append("tag", url);

    const data = await postForm(ENDPOINTS.articleFamous, request_data);

    ReactDOM.render(
        <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
            <Div_box_header title="최신 인기 글" />
            <div class="flex flex-col justify-center items-start w-full space-y-2">
                {Object.values(data || {}).map((article) => <Div_new_article_list key={article.id || article.uuid} data={article} />)}
            </div>
        </div>,
        target
    );
}

async function get_new_comment_list() {
    const target = document.getElementById("div_new_comment_list");
    if (!target) return;

    const request_data = new FormData();
    request_data.append("tag", url);

    const data = await postForm(ENDPOINTS.newComment, request_data);

    ReactDOM.render(
        <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
            <Div_box_header title="최신 댓글" />
            <div class="flex flex-col justify-center items-start w-full space-y-2">
                {Object.values(data || {}).map((comment) => <Div_new_comment key={comment.id || comment.uuid} data={comment} />)}
            </div>
        </div>,
        target
    );
}

async function get_my_article_list() {
    const target = document.getElementById("div_my_article_list");
    if (!target) return;

    if (!getCurrentUsername()) {
        ReactDOM.render(
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="내가 쓴 글" />
                <span>로그인이 필요합니다.</span>
            </div>,
            target
        );
        return;
    }

    const request_data = new FormData();
    request_data.append("tag", url);

    const data = await postForm(ENDPOINTS.myArticle, request_data);

    ReactDOM.render(
        <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
            <Div_box_header title="내가 쓴 글" />
            <div class="flex flex-col justify-center items-start w-full space-y-2">
                {Object.values(data || {}).map((article) => <Div_new_article_list key={article.id || article.uuid} data={article} />)}
            </div>
        </div>,
        target
    );
}

async function get_my_comment_list() {
    const target = document.getElementById("div_my_comment_list");
    if (!target) return;

    if (!getCurrentUsername()) {
        ReactDOM.render(
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="내가 쓴 댓글" />
                <span>로그인이 필요합니다.</span>
            </div>,
            target
        );
        return;
    }

    const request_data = new FormData();
    request_data.append("tag", url);

    const data = await postForm(ENDPOINTS.myComment, request_data);

    ReactDOM.render(
        <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
            <Div_box_header title="내가 쓴 댓글" />
            <div class="flex flex-col justify-center items-start w-full space-y-2">
                {Object.values(data || {}).map((comment) => <Div_new_comment key={comment.id || comment.uuid} data={comment} />)}
            </div>
        </div>,
        target
    );
}

async function click_btn_search() {
    const input = document.getElementById("txt_search");
    const search_text = input ? input.value.trim() : "";

    if (!search_text) {
        alert("검색어를 입력하세요.");
        return;
    }

    await get_article_list("search");
}

async function get_article_list(mode_value) {
    const request_data = new FormData();
    request_data.append("tag", url);
    request_data.append("tag_sub", sub);

    toggle_page = true;

    if (mode_value === "init" || mode_value === "search") {
        page_num = 1;
        ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list"));
        if (mode_value === "search") {
            const searchInput = document.getElementById("txt_search");
            request_data.append("txt_search", searchInput ? searchInput.value.trim() : "");
        }
    } else {
        page_num += 1;
        ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list_" + page_num));
    }

    request_data.append("page", page_num);

    const data = await postForm(ENDPOINTS.list, request_data);
    article_counter = Number(data && data.count ? data.count.cnt : 0);

    const chunk = Object.keys(data.list || {}).map((key) => <Div_new_article_list key={key} data={data.list[key]} />);

    const placeholderId = "div_article_list_" + (page_num + 1);

    if (mode_value === "init" || mode_value === "search") {
        ReactDOM.render(
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="최신 글" />
                <div class="flex flex-col justify-center items-start w-full space-y-2">
                    {chunk}
                    <div id={placeholderId} class="w-full"></div>
                </div>
            </div>,
            document.getElementById("div_article_list")
        );
    } else {
        ReactDOM.render(
            <div class="flex flex-col justify-center items-start w-full space-y-2">
                {chunk}
                <div id={placeholderId} class="w-full"></div>
            </div>,
            document.getElementById("div_article_list_" + page_num)
        );
    }

    toggle_page = false;
}

function render_article() {
    if (!data_article) return;

    const headerTarget = document.getElementById("div_community_read_header");
    const buttonTarget = document.getElementById("div_article_read_buttons");
    const fileTarget = document.getElementById("div_community_read_file");
    const contentTarget = document.querySelector("#div_community_read_content");

    if (headerTarget) {
        ReactDOM.render(<Div_article_read_header data={data_article} />, headerTarget);
    }
    if (buttonTarget) {
        ReactDOM.render(<Div_article_read_buttons data={data_article} />, buttonTarget);
    }
    if (fileTarget) {
        ReactDOM.render(<Div_article_read_file data={data_article} />, fileTarget);
    }
    if (contentTarget && typeof toastui !== "undefined" && toastui.Editor) {
        toastui.Editor.factory({
            el: contentTarget,
            viewer: true,
            initialValue: data_article.content || ""
        });
    }
}

async function get_read_article(mode_value) {
    const request_data = new FormData();
    request_data.append("orderID", orderID);

    data_article = await postForm(ENDPOINTS.read, request_data);

    if (mode_value === "init") {
        render_article();
    }

    await get_read_article_comment(orderID);
}

async function get_read_article_comment(orderID_value) {
    const request_data = new FormData();
    request_data.append("orderID", orderID_value);

    data_comment = await postForm(ENDPOINTS.readComments, request_data);
    set_comment();
}

function set_comment() {
    const commentContainer = document.getElementById("div_community_read_comment");
    if (!commentContainer) return;

    const allComments = Object.values(data_comment || {}).filter((item) => !!item);
    const upperComments = allComments.filter((item) => !item.uuid_upper);

    const treeComments = upperComments.map((comment) => ({
        ...comment,
        rereply: allComments.filter((item) => item.uuid_upper === comment.uuid)
    }));

    data_comment_upper = treeComments;

    ReactDOM.render(
        <Div_article_read_comment
            data={treeComments}
            uuid_article={data_article ? data_article.uuid : null}
            is_secret={data_article ? data_article.is_secret : 0}
            check_reader={data_article ? data_article.check_reader : "guest"}
        />,
        commentContainer
    );

    if (typeof toastui === "undefined" || !toastui.Editor) {
        return;
    }

    allComments.forEach((comment) => {
        const viewerTarget = document.querySelector("#div_comment_" + comment.uuid);
        if (!viewerTarget) return;

        toastui.Editor.factory({
            el: viewerTarget,
            viewer: true,
            initialValue: comment.content || ""
        });
    });

    commentEditors = {};
    commentFiles = Array.isArray(commentFiles) ? commentFiles : [];

    const { Editor } = toastui;
    const { colorSyntax, tableMergedCell } = Editor.plugin;
    const editorConfig = {
        previewStyle: "vertical",
        height: "250px",
        initialEditType: "wysiwyg",
        plugins: [colorSyntax, tableMergedCell],
        hooks: {
            addImageBlobHook: async (blob, callback) => {
                try {
                    const compressedBase64 = await compressImage(blob);
                    callback(compressedBase64, blob.name);
                } catch (error) {
                    alert("이미지 처리에 실패했습니다. 다시 시도해 주세요.");
                }
            }
        }
    };

    const newFormEl = document.querySelector("#div_community_read_comment_new_form");
    if (newFormEl && getCurrentUsername() !== "") {
        commentEditors["new"] = new toastui.Editor({
            el: newFormEl,
            ...editorConfig
        });
        commentEditors["new"].setHTML("");
    }

    data_comment_upper.forEach((comment) => {
        const replyEl = document.querySelector("#div_community_read_comment_new_" + comment.uuid + "_form");
        if (!replyEl) return;

        commentEditors[comment.uuid] = new toastui.Editor({
            el: replyEl,
            ...editorConfig
        });
        commentEditors[comment.uuid].setHTML("");
    });
}

function click_btn_reply_comment(uuid_comment) {
    data_comment_upper.forEach((comment) => {
        const el = document.getElementById("div_community_read_comment_new_" + comment.uuid);
        if (!el) return;

        if (comment.uuid === uuid_comment) {
            el.className = "mt-4 p-4 bg-white rounded-lg w-full space-y-2";
        } else {
            el.className = "hidden";
        }
    });
}

async function click_btn_edit_comment(uuid_comment) {
    function Div_comment_editor_form(props) {
        return (
            <div class="w-full">
                <div class="w-full" id={"div_comment_editor_main_" + props.uuid_comment}></div>
                <div class="flex flex-row justify-end items-center w-full space-x-2 mt-2">
                    <input id={"chk_secret_" + props.uuid_comment} type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2" />
                    <label for={"chk_secret_" + props.uuid_comment} class="ms-2 text-sm font-medium text-gray-900">
                        비밀 댓글로 작성하기 (본인과 글 작성자, 관리자만 읽을 수 있습니다.)
                    </label>
                    <div class="w-fit" id={"btn_comment_editor_footer_button_" + props.uuid_comment}>
                        <Div_btn_comment_editor_footer_button uuid_comment={props.uuid_comment} function={() => comment_action("edit", props.uuid_comment)} />
                    </div>
                </div>
            </div>
        );
    }

    const targetComment = Object.values(data_comment || {}).find((item) => item.uuid === uuid_comment);
    const targetEl = document.getElementById("div_comment_" + uuid_comment);

    if (!targetComment || !targetEl || typeof toastui === "undefined" || !toastui.Editor) {
        return;
    }

    ReactDOM.render(<Div_comment_editor_form uuid_comment={uuid_comment} />, targetEl);

    const { Editor } = toastui;
    const { colorSyntax, tableMergedCell } = Editor.plugin;

    commentEditors[uuid_comment] = new toastui.Editor({
        el: document.querySelector("#div_comment_editor_main_" + uuid_comment),
        previewStyle: "vertical",
        height: "250px",
        initialEditType: "wysiwyg",
        plugins: [colorSyntax, tableMergedCell]
    });

    commentEditors[uuid_comment].setHTML(targetComment.content || "");

    const secretEl = document.getElementById("chk_secret_" + uuid_comment);
    if (secretEl) {
        secretEl.checked = normalizeBool(targetComment.is_secret);
    }
}

async function comment_action(action, uuid_comment) {
    const isNew = uuid_comment === "new";

    if (action === "delete") {
        if (!confirm("정말로 삭제할까요?")) return;

        const isUpper = data_comment_upper.some((item) => item.uuid === uuid_comment);
        const target = Object.values(data_comment || {}).find((item) => item.uuid === uuid_comment);

        const footerTarget = document.getElementById("div_comment_footer_" + uuid_comment);
        if (footerTarget) {
            ReactDOM.render(
                <Div_comment_button_list data={target || { active: 1, check_comment_reader: "" }} depth={isUpper ? 1 : 2} loading={true} />,
                footerTarget
            );
        }

        const request_data = new FormData();
        request_data.append("uuid", uuid_comment);

        await postForm(ENDPOINTS.commentDelete, request_data, { parseJson: false });
        await get_read_article_comment(orderID);
        return;
    }

    const editorKey = isNew ? "new" : uuid_comment;
    const currentEditor = commentEditors[editorKey];

    if (!currentEditor) {
        alert("에디터가 초기화되지 않았습니다. 새로고침 후 다시 시도해주세요.");
        return;
    }

    const txt_content = currentEditor.getHTML();
    const secretId = isNew ? "chk_secret_new" : "chk_secret_" + uuid_comment;
    const secretEl = document.getElementById(secretId);
    const chk_secret = secretEl ? secretEl.checked : false;

    if (txt_content == null || txt_content === "" || txt_content === "<p><br></p>") {
        alert("내용을 입력해주세요.");
        return;
    }

    const btnId = isNew ? "btn_comment_editor_footer_button" : "btn_comment_editor_footer_button_" + uuid_comment;
    const btnEl = document.getElementById(btnId);
    if (btnEl) {
        ReactDOM.render(<Div_btn_comment_editor_footer_button_loading />, btnEl);
    }

    const request_data = new FormData();
    let endpoint = "";

    if (action === "submit") {
        endpoint = ENDPOINTS.commentInsert;
        request_data.append("uuid_article", orderID);
        if (!isNew) {
            request_data.append("uuid_comment", uuid_comment);
        }
    } else if (action === "edit") {
        endpoint = ENDPOINTS.commentUpdate;
        request_data.append("uuid_comment", uuid_comment);
    } else {
        return;
    }

    request_data.append("txt_content", txt_content);
    request_data.append("chk_secret", chk_secret);

    if (action === "submit") {
        const fileIndex = commentFiles.findIndex((item) => item.uuid_comment === uuid_comment);
        if (fileIndex !== -1) {
            request_data.append("attached_file", commentFiles[fileIndex].uuid);
        }
    }

    await postForm(endpoint, request_data, { parseJson: false });
    await get_read_article_comment(orderID);
}

function comment_file_action(action, uuid_comment) {
    if (action === "delete") {
        const index = commentFiles.findIndex((item) => item.uuid_comment === uuid_comment);
        if (index !== -1) {
            commentFiles.splice(index, 1);
        }

        const inputEl = document.getElementById("id_file_upload_" + uuid_comment);
        const nameEl = document.getElementById("txt_filename_" + uuid_comment);
        const deleteEl = document.getElementById("txt_file_delete_" + uuid_comment);

        if (inputEl) inputEl.value = "";
        if (nameEl) nameEl.innerHTML = "";
        if (deleteEl) deleteEl.className = "hidden";

        return;
    }

    if (action === "upload") {
        const inputEl = document.getElementById("id_file_upload_" + uuid_comment);
        if (!inputEl || !inputEl.files || !inputEl.files[0]) return;

        const formData = new FormData();
        formData.append("file_input", inputEl.files[0]);
        formData.append("host", window.location.href.toString());
        formData.append("note", "Comment");
        formData.append("active", 1);

        $.ajax({
            type: "POST",
            enctype: "multipart/form-data",
            url: ENDPOINTS.fileUpload,
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (filedata) {
                filedata["uuid_comment"] = uuid_comment;

                const existingIndex = commentFiles.findIndex((item) => item.uuid_comment === uuid_comment);
                if (existingIndex !== -1) {
                    commentFiles[existingIndex] = filedata;
                } else {
                    commentFiles.push(filedata);
                }

                const nameEl = document.getElementById("txt_filename_" + uuid_comment);
                const deleteEl = document.getElementById("txt_file_delete_" + uuid_comment);

                if (nameEl) nameEl.innerHTML = filedata.origin_file_name || filedata.file_name || "";
                if (deleteEl) deleteEl.className = class_txt_file_delete;
            },
            error: function (error) {
                console.error("comment file upload error", error);
            }
        });
    }
}

function check_file_upload() {
    const inputEl = document.getElementById("id_file_upload");
    if (!inputEl || !inputEl.files || !inputEl.files[0]) return;

    const formData = new FormData();
    formData.append("file_input", inputEl.files[0]);
    formData.append("host", window.location.href.toString());
    formData.append("note", "Article");
    formData.append("active", 1);

    $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: ENDPOINTS.fileUpload,
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (filedata) {
            uploadedArticleFile = filedata;

            const nameEl = document.getElementById("txt_filename");
            const deleteEl = document.getElementById("txt_file_delete");

            if (nameEl) {
                nameEl.innerHTML = filedata.origin_file_name || filedata.file_name || "";
            }
            if (deleteEl) {
                deleteEl.className = class_txt_file_delete;
            }
        },
        error: function (error) {
            console.error("article file upload error", error);
        }
    });
}

function click_delete_file() {
    uploadedArticleFile = null;
    if (currentEditArticle) {
        currentEditArticle.file_url = null;
        currentEditArticle.file_name = null;
    }

    const inputEl = document.getElementById("id_file_upload");
    const nameEl = document.getElementById("txt_filename");
    const deleteEl = document.getElementById("txt_file_delete");

    if (inputEl) inputEl.value = "";
    if (nameEl) nameEl.innerHTML = "";
    if (deleteEl) deleteEl.className = "hidden";
}

function initArticleEditor(initialHTML) {
    if (typeof toastui === "undefined" || !toastui.Editor) {
        return;
    }

    const { Editor } = toastui;
    const { colorSyntax, tableMergedCell } = Editor.plugin;

    articleEditor = new toastui.Editor({
        el: document.querySelector("#div_editor"),
        previewStyle: "vertical",
        height: "500px",
        initialEditType: "wysiwyg",
        plugins: [colorSyntax, tableMergedCell],
        hooks: {
            addImageBlobHook: async (blob, callback) => {
                try {
                    const compressedBase64 = await compressImage(blob);
                    callback(compressedBase64, blob.name);
                } catch (error) {
                    alert("이미지 처리에 실패했습니다. 다시 시도해 주세요.");
                }
            }
        }
    });

    articleEditor.setHTML(initialHTML || "");
}

async function click_btn_submit() {
    if (articleEditorMode === "edit") {
        await submit_article("edit");
    } else {
        await submit_article("write");
    }
}

async function submit_article(mode_value) {
    if (toggle_click_submit) return;

    const titleInput = document.getElementById("txt_title");
    const secretEl = document.getElementById("chk_secret");
    const txt_title = titleInput ? titleInput.value.trim() : "";
    const txt_content = articleEditor ? articleEditor.getHTML() : "";
    const chk_secret = secretEl ? secretEl.checked : false;

    toggle_click_submit = true;
    renderArticleSubmitButtons(true);

    try {
        if (!txt_title) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!txt_content || txt_content === "<p><br></p>") {
            alert("내용을 입력해주세요.");
            return;
        }

        const request_data = new FormData();
        request_data.append("tag", url);
        request_data.append("tag_sub", sub);
        request_data.append("txt_title", txt_title);
        request_data.append("txt_content", txt_content);
        request_data.append("chk_secret", chk_secret);

        let response_data = null;

        if (mode_value === "edit") {
            request_data.append("uuid_article", orderID);
            if (uploadedArticleFile != null) {
                request_data.append("attached_file", uploadedArticleFile.file_name || uploadedArticleFile.uuid || "");
            } else if (currentEditArticle && currentEditArticle.file_url) {
                request_data.append("attached_file", currentEditArticle.file_url);
            }

            response_data = await postForm(ENDPOINTS.articleUpdate, request_data);
        } else {
            if (uploadedArticleFile != null) {
                request_data.append("attached_file", uploadedArticleFile.uuid || uploadedArticleFile.file_name || "");
            }

            response_data = await postForm(ENDPOINTS.articleInsert, request_data);
        }

        const nextUuid = response_data && response_data.uuid ? response_data.uuid : orderID;
        location.href = init_url + "read/" + nextUuid + "/";
    } finally {
        toggle_click_submit = false;
        renderArticleSubmitButtons(false);
    }
}

async function click_btn_delete() {
    if (!confirm("정말로 삭제할까요?")) return;

    const request_data = new FormData();
    request_data.append("uuid", orderID);
    await postForm(ENDPOINTS.articleDelete, request_data, { parseJson: false });
    location.href = init_url;
}

function renderWorkshopListPage() {
    clearInfiniteScroll();
    page_num = 1;
    article_counter = 0;
    toggle_page = false;

    ReactDOM.render(<WorkshopListPage />, document.getElementById("div_main"));
    get_article_list("init");
    get_article_famous_list();
    get_new_comment_list();
    get_my_article_list();
    get_my_comment_list();

    bindInfiniteScroll(() => {
        const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
        if (isScrollEnded && !toggle_page && page_num * PAGE_SIZE < article_counter) {
            get_article_list("next");
        }
    });
}

function renderWorkshopReadPage() {
    clearInfiniteScroll();
    commentFiles = [];
    commentEditors = {};
    ReactDOM.render(<WorkshopReadPage />, document.getElementById("div_main"));

    get_read_article("init");
    get_article_famous_list();
    get_new_comment_list();
    get_my_article_list();
    get_my_comment_list();
}

function renderWorkshopWritePage() {
    clearInfiniteScroll();
    if (!getCurrentUsername()) {
        location.href = init_url;
        return;
    }

    articleEditorMode = "write";
    currentEditArticle = null;
    uploadedArticleFile = null;
    toggle_click_submit = false;

    ReactDOM.render(<Div_article_editor_main />, document.getElementById("div_main"));
    renderArticleSubmitButtons(false);
    initArticleEditor("");
}

async function renderWorkshopEditPage() {
    clearInfiniteScroll();
    if (!getCurrentUsername()) {
        location.href = init_url;
        return;
    }

    ReactDOM.render(<Div_status_loading text="작성자 여부를 확인하고 있습니다." />, document.getElementById("div_main"));

    const request_data = new FormData();
    request_data.append("orderID", orderID);
    currentEditArticle = await postForm(ENDPOINTS.read, request_data);

    if (currentEditArticle.check_reader === "user") {
        ReactDOM.render(<Div_status_stop text="작성자만 글을 수정할 수 있습니다." />, document.getElementById("div_main"));
        return;
    }

    articleEditorMode = "edit";
    uploadedArticleFile = null;
    toggle_click_submit = false;

    ReactDOM.render(<Div_article_editor_main />, document.getElementById("div_main"));
    renderArticleSubmitButtons(false);
    initArticleEditor(currentEditArticle.content || "");

    const titleInput = document.getElementById("txt_title");
    const secretEl = document.getElementById("chk_secret");
    const fileNameEl = document.getElementById("txt_filename");
    const fileDeleteEl = document.getElementById("txt_file_delete");

    if (titleInput) titleInput.value = currentEditArticle.title || "";
    if (secretEl) secretEl.checked = normalizeBool(currentEditArticle.is_secret);

    if (currentEditArticle.file_name) {
        if (fileNameEl) fileNameEl.innerHTML = currentEditArticle.file_name;
        if (fileDeleteEl) fileDeleteEl.className = class_txt_file_delete;
    }
}

function set_main() {
    if (mode === "read") {
        renderWorkshopReadPage();
    } else if (mode === "edit") {
        renderWorkshopEditPage();
    } else if (mode === "write") {
        renderWorkshopWritePage();
    } else {
        renderWorkshopListPage();
    }
}
