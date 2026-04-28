
// scripts/community/set_main.js
// /community/, /community/visitor/, read/write/edit 를 하나의 route-aware set_main.js 로 통합한 버전

const COMMUNITY_FILE_DELETE_CLASS = "rounded-lg hover:bg-red-100 cursor-pointer";
const COMMUNITY_COMMENT_FILE_DELETE_CLASS = "size-4 min-size-4 max-size-4 rounded-lg hover:bg-red-100 cursor-pointer";
const COMMUNITY_TABBED_URLS = ["all", "free", "rblogger", "notebook"];

let header_title = "";
let header_subtitle = "커뮤니티";

const communityState = {
    page_num: 1,
    article_counter: 0,
    toggle_page: false,
    toggle_click_submit: false,
    articleData: null,
    commentData: null,
    commentUpper: [],
    articleEditor: null,
    commentEditors: {},
    articleFile: null,
    commentFiles: [],
    listScrollBound: false,
};

function getCommunityMode() {
    if (typeof mode === "undefined" || mode == null || mode === "None") {
        return "";
    }
    return String(mode).trim().toLowerCase();
}

function normalizeCommunityRoute() {
    if (typeof sub === "undefined") {
        sub = null;
    }

    if (typeof orderID !== "undefined" && (orderID === "None" || orderID === "")) {
        orderID = null;
    }

    if (typeof url === "undefined" || url == null || url === "None" || url === "") {
        url = "free";
    }

    try {
        const pathname = window.location && window.location.pathname ? window.location.pathname : "";
        if (pathname === "/community" || pathname === "/community/") {
            url = "all";
        }
    } catch (e) {}

    header_title = getCommunityHeaderTitle(url);
    header_subtitle = "커뮤니티";
    init_url = getCommunityBaseUrl(url);
}

function getCommunityBaseUrl(boardUrl) {
    if (boardUrl == null || boardUrl === "" || boardUrl === "None" || boardUrl === "all" || boardUrl === "free") {
        return "/community/";
    }
    return "/community/" + boardUrl + "/";
}

function getCommunityHeaderTitle(boardUrl) {
    if (boardUrl === "all") { return "커뮤니티"; }
    if (boardUrl === "free") { return "자유 게시판 / 묻고 답하기"; }
    if (boardUrl === "rblogger") { return "R-Blogger"; }
    if (boardUrl === "notebook") { return "Web-R Notebook"; }
    if (boardUrl === "visitor") { return "가입 인사 / 방명록"; }
    return "커뮤니티";
}

function isTabbedCommunityUrl(boardUrl = url) {
    return COMMUNITY_TABBED_URLS.includes(boardUrl);
}

function getSidebarTag() {
    return url === "all" ? "free" : url;
}

function getArticleHrefFromData(data) {
    const item = data || {};
    const uuid = item.uuid || item.uuid_article || "";
    const categoryUrl = item.category_url || item.article_category_url || "";
    const categoryUrlSub = item.category_url_sub || item.article_category_url_sub || "";
    const explicitUrl = item.url || item.article_url || "";

    if (explicitUrl && explicitUrl.indexOf("/webr/notebook/view/") === 0) {
        return explicitUrl;
    }
    if (categoryUrl === "notebook") {
        return "/webr/notebook/view/" + uuid + "/";
    }
    if (categoryUrl === "notice") {
        return "/intro/notice/read/" + uuid + "/";
    }
    if (categoryUrl === "visitor") {
        return "/community/visitor/read/" + uuid + "/";
    }
    if (categoryUrl === "rblogger" || categoryUrl === "free") {
        return "/community/read/" + uuid + "/";
    }
    if (categoryUrl === "youtube") {
        return "/workshop/youtube/read/" + uuid + "/";
    }
    if (categoryUrl === "workshop") {
        return "/workshop/read/" + uuid + "/";
    }
    if (explicitUrl) {
        return explicitUrl;
    }
    if (categoryUrl && categoryUrlSub) {
        return "/community/" + categoryUrl + "/" + categoryUrlSub + "/read/" + uuid + "/";
    }
    if (categoryUrl) {
        return "/community/" + categoryUrl + "/read/" + uuid + "/";
    }
    return init_url + "read/" + uuid + "/";
}


function resetListPagination() {
    communityState.page_num = 1;
    communityState.article_counter = 0;
    communityState.toggle_page = false;
}

function resetEditorState() {
    communityState.toggle_click_submit = false;
    communityState.articleEditor = null;
    communityState.articleData = null;
    communityState.articleFile = null;
    communityState.commentEditors = {};
    communityState.commentFiles = [];
    communityState.commentData = null;
    communityState.commentUpper = [];
}

function getEditorPlugins() {
    const plugins = [];
    try {
        if (toastui && toastui.Editor && toastui.Editor.plugin && toastui.Editor.plugin.colorSyntax) {
            plugins.push(toastui.Editor.plugin.colorSyntax);
        }
    } catch (e) {}
    try {
        if (toastui && toastui.Editor && toastui.Editor.plugin && toastui.Editor.plugin.tableMergedCell) {
            plugins.push(toastui.Editor.plugin.tableMergedCell);
        }
    } catch (e) {}
    return plugins;
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

function _compressImageOnce(blob, maxWidth, maxHeight, quality) {
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

                    if (mimeType === "image/png") {
                        resolve(canvas.toDataURL("image/png"));
                    } else {
                        resolve(canvas.toDataURL("image/jpeg", quality));
                    }
                };
                img.onerror = function (err) {
                    reject(err);
                };
                img.src = e.target.result;
            };
            reader.onerror = function (err) {
                reject(err);
            };
            reader.readAsDataURL(blob);
        } catch (err) {
            reject(err);
        }
    });
}

const class_span_btn_default = "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl";

function Span_btn_user(props) {
    const roles = {
        "관리자": "yellow",
        "기업회원": "red",
        "VIP회원": "blue",
        "정회원": "green",
        "준회원": "gray",
    };
    const role = roles[props.role] || "gray";
    return (
        <span class={`${class_span_btn_default} text-xs bg-${role}-100 text-${role}-800`}>
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
            {props.user_nickname}
        </span>
    );
}

function Span_btn_date(props) {
    return (
        <span class={`${class_span_btn_default} text-xs bg-blue-100 text-blue-800`}>
            <img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_${Number(props.date.split("-")[2].substr(0, 2))}.svg`} class="w-3 h-3 mr-1" />
            {props.date}
        </span>
    );
}

function Span_btn_article_read(props) {
    return props.cnt_read > 0 && (
        <span class={`${class_span_btn_default} text-xs bg-gray-100 text-blue-800`}>
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/eye.svg" class="w-3 h-3 mr-1" />
            {props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
        </span>
    );
}

function Span_btn_article_comment(props) {
    return props.cnt_comment > 0 && (
        <span class={`${class_span_btn_default} text-xs bg-purple-100 text-blue-800`}>
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment.svg" class="w-3 h-3 mr-1" />
            {props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
        </span>
    );
}

function Span_btn_article_new(props) {
    return props.toggle === 1 && (
        <span class={`${class_span_btn_default} text-[10px] bg-red-500 text-white animate-pulse`}>NEW</span>
    );
}

function Span_btn_article_secret(props) {
    return props.toggle === 1 && (
        <span class={`${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse`}>SECRET</span>
    );
}

function Span_btn_comment_secret(props) {
    return props.toggle === 1 && (
        <span class={`${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse`}>SECRET</span>
    );
}

function Span_btn_my_article(props) {
    return props.toggle === "writer" && (
        <span class={`${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse`}>MY</span>
    );
}

function Span_btn_my_comment(props) {
    return props.toggle === "writer" && (
        <span class={`${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse`}>MY</span>
    );
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

function TabButton({ active, onClick, children }) {
    const base = "px-3 py-1.5 text-xs font-bold rounded-full transition-all select-none";
    const activeCls = " bg-blue-600 text-white shadow-sm";
    const inActiveCls = " bg-gray-100 text-gray-700 hover:bg-gray-200";
    return (
        <button type="button" onClick={onClick} class={base + (active ? activeCls : inActiveCls)}>
            {children}
        </button>
    );
}

function DivBoardTabs() {
    if (!isTabbedCommunityUrl(url)) {
        return null;
    }

    const activeTab = isTabbedCommunityUrl(url) ? url : "all";
    return (
        <div class="flex flex-wrap items-center gap-2 w-full pt-2">
            <TabButton active={activeTab === "all"} onClick={() => handleChangeTab("all")}>전체보기</TabButton>
            <TabButton active={activeTab === "free"} onClick={() => handleChangeTab("free")}>자유게시판</TabButton>
            <TabButton active={activeTab === "rblogger"} onClick={() => handleChangeTab("rblogger")}>R-Blogger</TabButton>
            <TabButton active={activeTab === "notebook"} onClick={() => handleChangeTab("notebook")}>Web-R Notebook</TabButton>
        </div>
    );
}

function Div_new_article_list(props) {
    const cu = props.data.category_url;
    const href = getArticleHrefFromData(props.data);

    let category_title = "커뮤니티";
    let category_title_color = " bg-blue-100 text-blue-700 border-blue-300";

    if (cu === "free") {
        category_title = "자유게시판";
        category_title_color = " bg-blue-100 text-blue-700 border-blue-300";
    } else if (cu === "rblogger") {
        category_title = "R-Blogger";
        category_title_color = " bg-purple-100 text-purple-700 border-purple-300";
    } else if (cu === "notebook") {
        category_title = "Web-R Notebook";
        category_title_color = " bg-emerald-100 text-emerald-700 border-emerald-300";
    } else if (cu === "visitor") {
        category_title = "방명록";
        category_title_color = " bg-orange-100 text-orange-700 border-orange-300";
    }

    return (
        <div class="bg-white w-full">
            <a href={href} class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-50 rounded-lg mx-3 my-2">
                <div class="flex items-center gap-2">
                    <span class={"flex-shrink-0 whitespace-nowrap px-2 py-0.5 border rounded-full text-xs font-semibold" + category_title_color}>
                        {category_title}
                    </span>

                    <span class="min-w-0 flex-1 font-bold text-sm truncate">{props.data.title}</span>

                    <div class="flex-shrink-0 flex items-center gap-1">
                        <Span_btn_article_new toggle={props.data.is_new} />
                        <Span_btn_article_secret toggle={props.data.is_secret} />
                        <Span_btn_my_article toggle={props.data.check_reader} />
                    </div>
                </div>

                <div class="flex flex-wrap items-center space-x-2">
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
    return (
        <div class="bg-white border-b w-full">
            <a href={getArticleHrefFromData(props.data)}
               class="flex flex-col px-6 py-4 space-y-2 cursor-pointer hover:bg-gray-100 w-full">
                <div class="flex flex-row justify-start items-center">
                    <span class="font-normal text-sm w-fit max-w-full truncate ...">
                        {props.data.content.replace(/<[^>]*>?/g, "")}
                    </span>
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

function Div_sidebar_notice(props) {
    return (
        <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
            <Div_box_header title={props.title} />
            <span>{props.message}</span>
        </div>
    );
}

async function get_article_famous_list() {
    function Div_article_list(props) {
        return (
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="최신 인기 글" />
                <div class="flex flex-col justify-center items-start w-full space-y-2">
                    {Object.values(props.data || {}).map(article => <Div_new_article_list key={article.id || article.uuid} data={article} />)}
                </div>
            </div>
        );
    }

    const request_data = new FormData();
    request_data.append("tag", getSidebarTag());
    const data = await fetch("/blank/ajax_board/get_article_famous_list/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data,
    }).then(res => res.json());

    ReactDOM.render(<Div_article_list data={data} />, document.getElementById("div_article_famous_list"));
}

async function get_my_article_list() {
    if (!gv_username) {
        ReactDOM.render(<Div_sidebar_notice title="내가 쓴 글" message="로그인이 필요합니다." />, document.getElementById("div_my_article_list"));
        return;
    }

    function Div_article_list(props) {
        return (
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="내가 쓴 글" />
                <div class="flex flex-col justify-center items-start w-full space-y-2">
                    {Object.values(props.data || {}).map(article => <Div_new_article_list key={article.id || article.uuid} data={article} />)}
                </div>
            </div>
        );
    }

    const request_data = new FormData();
    request_data.append("tag", getSidebarTag());
    const data = await fetch("/blank/ajax_board/get_my_article_list/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data,
    }).then(res => res.json());

    ReactDOM.render(<Div_article_list data={data} />, document.getElementById("div_my_article_list"));
}

async function get_my_comment_list() {
    if (!gv_username) {
        ReactDOM.render(<Div_sidebar_notice title="내가 쓴 댓글" message="로그인이 필요합니다." />, document.getElementById("div_my_comment_list"));
        return;
    }

    function Div_comment_list(props) {
        return (
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="내가 쓴 댓글" />
                <div class="flex flex-col justify-center items-start w-full space-y-2">
                    {Object.values(props.data || {}).map(comment => <Div_new_comment key={comment.id || comment.uuid} data={comment} />)}
                </div>
            </div>
        );
    }

    const request_data = new FormData();
    request_data.append("tag", getSidebarTag());
    const data = await fetch("/blank/ajax_board/get_my_comment_list/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data,
    }).then(res => res.json());

    ReactDOM.render(<Div_comment_list data={data} />, document.getElementById("div_my_comment_list"));
}

async function get_new_comment_list() {
    function Div_comment_list(props) {
        return (
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="최신 댓글" />
                <div class="flex flex-col justify-center items-start w-full space-y-2">
                    {Object.values(props.data || {}).map(comment => <Div_new_comment key={comment.id || comment.uuid} data={comment} />)}
                </div>
            </div>
        );
    }

    const request_data = new FormData();
    request_data.append("tag", getSidebarTag());
    const data = await fetch("/blank/ajax_board/get_new_comment_list/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data,
    }).then(res => res.json());

    ReactDOM.render(<Div_comment_list data={data} />, document.getElementById("div_new_comment_list"));
}

function refreshSidebarWidgets() {
    get_article_famous_list();
    get_new_comment_list();
    get_my_article_list();
    get_my_comment_list();
}

function ListMain() {
    return (
        <div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
            <Div_page_header title={header_title} subtitle={header_subtitle} />

            <div id="div_community_list" class="flex flex-col justify-center items-center w-full space-y-4">
                <div class="grid grid-cols-3 justify-center items-start w-full gap-4 md:grid-cols-1">
                    <div id="div_article_list" class="col-span-2 w-full">
                        <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                            <Div_box_header title="최신 글" />
                            <DivBoardTabs />
                        </div>
                    </div>

                    <div class="flex flex-col justify-center items-start w-full space-y-4">
                        <button type="button"
                                onClick={() => gv_username === "" ? alert("로그인이 필요합니다.") : location.href = init_url + "write/"}
                                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
                            글쓰기
                        </button>

                        <div class="flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl">
                            <p class="flex flex-row text-start w-full">검색</p>
                            <input type="text" id="txt_search"
                                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500" />

                            <div class="flex flex-row justify-end items-center w-full">
                                <button type="button"
                                        onClick={() => click_btn_search()}
                                        class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center me-2 mb-2 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300">
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

function renderListPageShell() {
    ReactDOM.render(<ListMain />, document.getElementById("div_main"));
}

async function get_article_list(loadMode) {
    function ArticleList(props) {
        const article_list = Object.keys(props.data || {}).map(key => (
            <Div_new_article_list key={key} data={props.data[key]} />
        ));

        const listContent = (
            <div class="flex flex-col justify-center items-start w-full space-y-2">
                {article_list}
                <div id={`div_article_list_${communityState.page_num + 1}`} class="w-full"></div>
            </div>
        );

        if (!props.isMain) {
            return listContent;
        }

        return (
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="최신 글" />
                <DivBoardTabs />
                {listContent}
            </div>
        );
    }

    communityState.toggle_page = true;
    const request_data = new FormData();
    request_data.append("tag", url);
    request_data.append("tag_sub", sub);

    if (loadMode === "init" || loadMode === "search") {
        communityState.page_num = 1;
        ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list"));
        if (loadMode === "search") {
            const searchEl = document.getElementById("txt_search");
            request_data.append("txt_search", searchEl ? searchEl.value.trim() : "");
        }
    } else {
        communityState.page_num += 1;
        ReactDOM.render(<Div_article_list_skeleton />, document.getElementById(`div_article_list_${communityState.page_num}`));
    }

    request_data.append("page", communityState.page_num);

    const data = await fetch("/blank/ajax_board/get_article_list/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data,
    }).then(res => res.json());

    communityState.article_counter = data["count"] ? data["count"].cnt : 0;
    const targetId = (loadMode === "init" || loadMode === "search") ? "div_article_list" : `div_article_list_${communityState.page_num}`;

    ReactDOM.render(
        <ArticleList data={data.list} isMain={loadMode === "init" || loadMode === "search"} />,
        document.getElementById(targetId)
    );

    communityState.toggle_page = false;
}

async function click_btn_search() {
    const searchEl = document.getElementById("txt_search");
    const search_text = searchEl ? searchEl.value.trim() : "";
    if (!search_text) {
        alert("검색어를 입력하세요.");
        return;
    }
    resetListPagination();
    await get_article_list("search");
}

async function handleChangeTab(tab) {
    if (!isTabbedCommunityUrl(tab)) {
        tab = "all";
    }
    url = tab;
    init_url = getCommunityBaseUrl(tab);
    header_title = getCommunityHeaderTitle(tab);
    resetListPagination();
    renderListPageShell();
    await get_article_list("init");
    refreshSidebarWidgets();
}

function ensureListScrollListener() {
    if (communityState.listScrollBound) {
        return;
    }

    window.addEventListener("scroll", () => {
        if (getCommunityMode() !== "") {
            return;
        }

        const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
        if (isScrollEnded && !communityState.toggle_page && ((communityState.page_num * 20) < communityState.article_counter)) {
            get_article_list("next");
        }
    });

    communityState.listScrollBound = true;
}

async function set_main_list() {
    resetListPagination();
    renderListPageShell();
    await get_article_list("init");
    refreshSidebarWidgets();
    ensureListScrollListener();
}

function Div_article_read_buttons(props) {
    const btnClass = "font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full";
    const writeBtn = `text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 ${btnClass} hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300`;
    const listBtn = `text-gray-900 bg-white border border-gray-900 ${btnClass} focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100`;
    const editBtn = `text-green-700 border border-green-700 ${btnClass} py-1 hover:text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300`;
    const deleteBtn = `text-red-700 border border-red-700 ${btnClass} py-1 hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300`;

    return (
        <div class="flex flex-col justify-center items-center w-full space-y-2">
            <div class="flex flex-col justify-center items-center space-y-2 w-full">
                <button type="button" onClick={() => gv_username ? location.href = init_url + "write/" : alert("로그인이 필요합니다.")} class={writeBtn}>
                    새 글 쓰기
                </button>
                <a href={init_url} class={listBtn}>목록으로</a>
            </div>
            {props.data.check_reader !== "user" && (
                <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
                    <button onClick={() => location.href = init_url + "edit/" + orderID + "/"} class={editBtn}>수정</button>
                    <button onClick={click_btn_delete} class={deleteBtn}>삭제</button>
                </div>
            )}
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

function Div_article_read_file() {
    const data = communityState.articleData;
    if (!data) return null;

    const isRblogger = data.category_url === "rblogger";
    const hasUrl = !!data.url;
    const hasFile = !!data.file_url;

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
        return (
            <section class="bg-white py-8 lg:py-16 antialiased">
                <div class="w-full mx-auto px-4 space-y-2">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-md lg:text-lg font-bold text-gray-900">원문 링크</h2>
                    </div>

                    <form class="mb-3"><div class="w-full bg-gray-50 rounded-lg border border-gray-200"></div></form>

                    <div class="flex flex-row justify-start items-start w-full">
                        <a href={data.url} target="_blank" rel="noopener noreferrer"
                           class="text-blue-600 underline break-all text-md cursor-pointer hover:text-blue-800 hover:bg-gray-50 px-1 py-0.5 rounded">
                            {data.url}
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section class="bg-white py-8 lg:py-16 antialiased">
            <div class="w-full mx-auto px-4 space-y-2">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-md lg:text-lg font-bold text-gray-900">첨부파일</h2>
                </div>

                <form class="mb-3"><div class="w-full bg-gray-50 rounded-lg border border-gray-200"></div></form>

                <div class="flex flex-row justify-center items-start w-full">
                    <a href={"/" + data.file_url} target="_blank"
                       class="flex flex-row justify-end items-center text-md font-normal w-fit space-x-2 cursor-pointer hover:bg-gray-100">
                        {data.file_name}
                    </a>
                </div>
            </div>
        </section>
    );
}

function ReadMain() {
    return (
        <div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
            <Div_page_header title={header_title} subtitle={header_subtitle} />

            <div class="flex flex-col justify-center items-center w-full space-y-4">
                <div class="grid grid-cols-3 justify-center items-start w-full gap-4 md:grid-cols-1">
                    <div class="col-span-2 w-full">
                        <div class="w-full" id="div_community_read_header"><div class="w-full h-12 bg-gray-300 mb-4 animate-pulse"></div></div>
                        <div class="w-full" id="div_community_read_content"><div class="w-full h-48 bg-gray-300 mb-4 animate-pulse"></div></div>
                        <div class="w-full" id="div_community_read_file"><div class="w-full h-12 bg-gray-300 mb-4 animate-pulse"></div></div>
                        <div class="w-full" id="div_community_read_comment"><div class="w-full h-24 bg-gray-300 animate-pulse"></div></div>
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

function renderReadPageShell() {
    ReactDOM.render(<ReadMain />, document.getElementById("div_main"));
}

function set_article() {
    ReactDOM.render(<Div_article_read_header data={communityState.articleData} />, document.getElementById("div_community_read_header"));
    ReactDOM.render(<Div_article_read_buttons data={communityState.articleData} />, document.getElementById("div_article_read_buttons"));
    ReactDOM.render(<Div_article_read_file />, document.getElementById("div_community_read_file"));

    toastui.Editor.factory({
        el: document.querySelector("#div_community_read_content"),
        viewer: true,
        initialValue: communityState.articleData.content,
    });
}

async function get_read_article(loadMode) {
    const request_data = new FormData();
    request_data.append("orderID", orderID);

    try {
        const res = await fetch("/blank/ajax_board/get_read_article/", {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data,
        });

        if (!res.ok) {
            throw new Error(`get_read_article HTTP error: ${res.status}`);
        }

        communityState.articleData = await res.json();

        if (communityState.articleData && communityState.articleData.redirect_url) {
            window.location.href = communityState.articleData.redirect_url;
            return;
        }

        if (loadMode === "init") {
            set_article();
        }

        get_read_article_comment(orderID);

        let normalizedCategory = null;
        if (communityState.articleData && typeof communityState.articleData.category_url === "string") {
            normalizedCategory = communityState.articleData.category_url.trim().toLowerCase();
        }

        if (normalizedCategory === "rblogger") {
            refresh_article_rblogger(orderID);
        }
    } catch (err) {
        console.error("[get_read_article] fetch or JSON error:", err);
    }
}

async function refresh_article_rblogger(articleId) {
    const request_data = new FormData();
    request_data.append("uuid", articleId);

    try {
        const res = await fetch("/blank/ajax_board/refresh_article_rblogger/", {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data,
        });

        if (!res.ok) {
            throw new Error(`refresh_article_rblogger HTTP error: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("[refresh_article_rblogger] error:", err);
        return null;
    }
}

async function click_btn_delete() {
    if (!confirm("정말로 삭제할까요?")) {
        return;
    }

    const request_data = new FormData();
    request_data.append("uuid", orderID);

    await fetch("/blank/ajax_board/delete_article/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data,
    }).then(res => res.json());

    location.href = init_url;
}

function Div_btn_comment_editor_footer_button(props) {
    return (
        <button type="button" onClick={props.function}
                class="flex flex-row justify-center items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center hover:bg-gradient-to-bl hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-cyan-300">
            등록
        </button>
    );
}

function Div_btn_comment_editor_footer_button_loading() {
    return (
        <button type="button"
                class="flex flex-row justify-center items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center hover:bg-gradient-to-bl hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-cyan-300 cursor-not-allowed">
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
            {isDepth1 && !loading && gv_username !== "" && (
                <ButtonComp text="대댓글" function={() => click_btn_reply_comment(data.uuid)} url_image="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_re_reply.svg" />
            )}

            {data && data.check_comment_reader !== "user" && data.active === 1 && (
                <ButtonComp text="수정" function={!loading ? () => click_btn_edit_comment(data.uuid) : undefined}
                            url_image={!loading ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg" : null} />
            )}

            {data && data.check_comment_reader !== "user" && data.active === 1 && (
                <ButtonComp text="삭제" function={!loading ? () => comment_action("delete", data.uuid) : undefined}
                            url_image={!loading ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg" : null} />
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
                        <input type="file" name={"id_file_upload_" + commentId} id={"id_file_upload_" + commentId}
                               accept="*" class="hidden" onChange={() => comment_file_action("upload", commentId)} />

                        <button type="button"
                                class="flex flex-row justify-center items-center py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                onClick={() => document.getElementById("id_file_upload_" + commentId).click()}>
                            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/file_upload.svg" class="w-4 h-4 mr-2 md:mr-0" />
                            <p class="block md:hidden">파일 첨부하기</p>
                        </button>

                        <p id={"txt_filename_" + commentId}></p>
                        <p id={"txt_file_delete_" + commentId} class="hidden" onClick={() => comment_file_action("delete", commentId)}>
                            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/trash.svg" class="w-4 h-4" />
                        </p>
                    </div>

                    <div class="flex flex-row justify-end items-center w-full space-x-2">
                        <input id={"chk_secret_" + commentId} type="checkbox" value=""
                               class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2" />
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

    const comment_list = Object.keys(props.data || {}).map((key) => (
        <Div_comment key={props.data[key].uuid} data={props.data[key]} depth={1} is_secret={props.is_secret} check_reader={props.check_reader} />
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

                {gv_username !== "" && (
                    <div class="flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full" id="div_community_read_comment_new">
                        <Div_comment_form title="댓글 쓰기" class="w-full space-y-2" uuid_comment={null} />
                    </div>
                )}
            </div>
        </section>
    );
}

function click_btn_reply_comment(uuid_comment) {
    (communityState.commentUpper || []).forEach((c) => {
        const el = document.getElementById("div_community_read_comment_new_" + c.uuid);
        if (!el) return;
        if (c.uuid === uuid_comment) {
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
                    <input id={"chk_secret_" + props.uuid_comment} type="checkbox" value=""
                           class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2" />
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

    ReactDOM.render(<Div_comment_editor_form uuid_comment={uuid_comment} />, document.getElementById("div_comment_" + uuid_comment));

    communityState.commentEditors[uuid_comment] = new toastui.Editor({
        el: document.querySelector("#div_comment_editor_main_" + uuid_comment),
        previewStyle: "vertical",
        height: "250px",
        initialEditType: "wysiwyg",
        plugins: getEditorPlugins(),
    });

    const target = Object.values(communityState.commentData || {}).find((item) => item.uuid === uuid_comment);
    if (target) {
        communityState.commentEditors[uuid_comment].setHTML(target.content);
        const secretEl = document.getElementById("chk_secret_" + uuid_comment);
        if (secretEl) {
            secretEl.checked = target.is_secret == 1;
        }
    }
}

async function comment_action(action, uuid_comment) {
    const isNew = uuid_comment === "new";

    if (action === "delete") {
        if (!confirm("정말로 삭제할까요?")) {
            return;
        }

        const isUpper = (communityState.commentUpper || []).map((item) => item.uuid).includes(uuid_comment);
        const target = Object.values(communityState.commentData || {}).find((item) => item.uuid === uuid_comment);

        ReactDOM.render(
            <Div_comment_button_list data={target || { active: 1, check_comment_reader: "" }} depth={isUpper ? 1 : 2} loading={true} />,
            document.getElementById("div_comment_footer_" + uuid_comment)
        );

        const request_data = new FormData();
        request_data.append("uuid", uuid_comment);

        await fetch("/blank/ajax_board/delete_comment/", {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data,
        });

        get_read_article_comment(orderID);
        return;
    }

    const editorKey = isNew ? "new" : uuid_comment;
    const currentEditor = communityState.commentEditors[editorKey];
    if (!currentEditor) {
        alert("에디터가 초기화되지 않았습니다. 새로고침 후 다시 시도해주세요.");
        return;
    }

    const txt_content = currentEditor.getHTML();
    const chk_id = isNew ? "chk_secret_new" : "chk_secret_" + uuid_comment;
    const secretEl = document.getElementById(chk_id);
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
    let requestUrl = "";

    if (action === "submit") {
        requestUrl = "/blank/ajax_board/insert_comment/";
        request_data.append("uuid_article", orderID);
        if (!isNew) {
            request_data.append("uuid_comment", uuid_comment);
        }
    } else if (action === "edit") {
        requestUrl = "/blank/ajax_board/update_comment/";
        request_data.append("uuid_comment", uuid_comment);
    } else {
        console.error("Unknown comment_action:", action);
        return;
    }

    request_data.append("txt_content", txt_content);
    request_data.append("chk_secret", chk_secret);

    if (action === "submit") {
        const fileItem = (communityState.commentFiles || []).find((item) => item.uuid_comment === uuid_comment);
        if (fileItem) {
            request_data.append("attached_file", fileItem.uuid);
        }
    }

    await fetch(requestUrl, {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data,
    });

    get_read_article_comment(orderID);

    const btnElAfter = document.getElementById(btnId);
    if (btnElAfter) {
        ReactDOM.render(
            <Div_btn_comment_editor_footer_button uuid_comment={uuid_comment} function={() => comment_action(action, uuid_comment)} />,
            btnElAfter
        );
    }
}

async function comment_file_action(action, uuid_comment) {
    if (action === "delete") {
        const idx = (communityState.commentFiles || []).findIndex((item) => item.uuid_comment === uuid_comment);
        if (idx !== -1) {
            communityState.commentFiles.splice(idx, 1);
        }

        const inputEl = document.getElementById("id_file_upload_" + uuid_comment);
        if (inputEl) inputEl.value = "";

        const nameEl = document.getElementById("txt_filename_" + uuid_comment);
        if (nameEl) nameEl.innerHTML = "";

        const delEl = document.getElementById("txt_file_delete_" + uuid_comment);
        if (delEl) delEl.className = "hidden";
        return;
    }

    if (action === "upload") {
        const inputEl = document.getElementById("id_file_upload_" + uuid_comment);
        if (!inputEl || !inputEl.files || !inputEl.files[0]) {
            return;
        }

        const formData = new FormData();
        formData.append("file_input", inputEl.files[0]);
        formData.append("host", window.location.href.toString());
        formData.append("note", "Comment");
        formData.append("active", 1);

        const filedata = await fetch("/blank/ajax_file_upload/", {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: formData,
        }).then(res => res.json());

        filedata.uuid_comment = uuid_comment;

        const existingIndex = (communityState.commentFiles || []).findIndex((item) => item.uuid_comment === uuid_comment);
        if (existingIndex !== -1) {
            communityState.commentFiles[existingIndex] = filedata;
        } else {
            communityState.commentFiles.push(filedata);
        }

        const nameEl = document.getElementById("txt_filename_" + uuid_comment);
        if (nameEl) nameEl.innerHTML = filedata.origin_file_name;

        const delEl = document.getElementById("txt_file_delete_" + uuid_comment);
        if (delEl) delEl.className = COMMUNITY_COMMENT_FILE_DELETE_CLASS;
    }
}

async function get_read_article_comment(orderID_param) {
    const request_data = new FormData();
    request_data.append("orderID", orderID_param);

    communityState.commentData = await fetch("/blank/ajax_board/get_read_article_comment/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data,
    }).then(res => res.json());

    set_comment();
}

function set_comment() {
    if (!communityState.commentData) {
        const container = document.getElementById("div_community_read_comment");
        if (container) {
            container.innerHTML = `<div class="w-full py-4 text-sm text-gray-500">아직 등록된 댓글이 없습니다.</div>`;
        }
        return;
    }

    const allComments = Object.values(communityState.commentData).filter((c) => !!c);
    communityState.commentUpper = allComments.filter((item) => !item.uuid_upper);

    const list_comment = communityState.commentUpper.map((comment) => ({
        ...comment,
        rereply: allComments.filter((item) => item.uuid_upper === comment.uuid),
    }));

    const commentContainer = document.getElementById("div_community_read_comment");
    if (!commentContainer) {
        return;
    }

    let uuid_article = null;
    let is_secret = 0;
    let check_reader = "guest";

    if (communityState.articleData) {
        uuid_article = communityState.articleData.uuid;
        is_secret = communityState.articleData.is_secret;
        check_reader = communityState.articleData.check_reader;
    }

    ReactDOM.render(
        <Div_article_read_comment data={list_comment} uuid_article={uuid_article} is_secret={is_secret} check_reader={check_reader} />,
        commentContainer
    );

    allComments.forEach((comment) => {
        if (!comment || !comment.uuid) return;
        const el = document.querySelector("#div_comment_" + comment.uuid);
        if (!el) return;
        toastui.Editor.factory({ el: el, viewer: true, initialValue: comment.content || "" });
    });

    communityState.commentEditors = {};
    const editorConfig = {
        previewStyle: "vertical",
        height: "250px",
        initialEditType: "wysiwyg",
        plugins: getEditorPlugins(),
        hooks: {
            addImageBlobHook: async (blob, callback) => {
                try {
                    const compressedBase64 = await compressImage(blob);
                    callback(compressedBase64, blob.name);
                } catch (error) {
                    alert("이미지 처리에 실패했습니다. 다시 시도해 주세요.");
                }
            },
        },
    };

    const newFormEl = document.querySelector("#div_community_read_comment_new_form");
    if (newFormEl) {
        communityState.commentEditors["new"] = new toastui.Editor({ el: newFormEl, ...editorConfig });
        communityState.commentEditors["new"].setHTML("");
    }

    communityState.commentUpper.forEach((comment) => {
        if (!comment || !comment.uuid) return;
        const replyEl = document.querySelector("#div_community_read_comment_new_" + comment.uuid + "_form");
        if (!replyEl) return;
        communityState.commentEditors[comment.uuid] = new toastui.Editor({ el: replyEl, ...editorConfig });
        communityState.commentEditors[comment.uuid].setHTML("");
    });
}

async function set_main_read() {
    resetEditorState();
    renderReadPageShell();
    await get_read_article("init");
    refreshSidebarWidgets();
}

function Div_main() {
    return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
            <div id="div_title" class="w-full">
                <input type="text" placeholder="제목을 입력해주세요." id="txt_title" name="txt_title"
                       class="w-full h-[48px] rounded-lg resize-none scroll-hide text-start text-[14px] font-[500] border-gray-500 focus:ring-gray-700 focus:border-gray-700" />
            </div>

            <div id="div_checker" class="flex flex-row justify-end items-center w-full">
                <div class="flex items-center mb-4">
                    <input id="chk_secret" type="checkbox" value=""
                           class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2" />
                    <label for="chk_secret" class="ms-2 text-sm font-medium text-gray-900">비밀글로 작성하기 (본인과 관리자만 읽을 수 있습니다.)</label>
                </div>
            </div>

            <div id="div_editor" class="w-full"></div>

            <div class="flex flex-row justify-start items-center space-x-4">
                <button class="flex flex-row justify-center items-center py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        onClick={() => document.getElementById("id_file_upload").click()}>
                    <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/file_upload.svg" class="w-4 h-4 mr-2" />
                    파일 첨부하기
                </button>
                <p id="txt_filename"></p>
                <p id="txt_file_delete" class="hidden" onClick={() => click_delete_file()}>
                    <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/trash.svg" class="w-4 h-4" />
                </p>
            </div>

            <div class="w-full" id="div_button_list">
                <Div_button />
            </div>
        </div>
    );
}

function Div_button() {
    return (
        <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
            <button type="button" onClick={() => click_btn_submit()}
                    class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
                완료
            </button>
            <a href={init_url}
               class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
                목록으로
            </a>
        </div>
    );
}

function Div_button_loading() {
    return (
        <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
            <button type="button" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                </svg>
                완료
            </button>
            <button type="button" class="text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                </svg>
                목록으로
            </button>
        </div>
    );
}

async function check_file_upload() {
    const inputEl = document.getElementById("id_file_upload");
    if (!inputEl || !inputEl.files || !inputEl.files[0]) {
        return;
    }

    const formData = new FormData();
    formData.append("file_input", inputEl.files[0]);
    formData.append("host", window.location.href.toString());
    formData.append("note", "Article");
    formData.append("active", 1);

    const filedata = await fetch("/blank/ajax_file_upload/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: formData,
    }).then(res => res.json());

    communityState.articleFile = filedata;
    const nameEl = document.getElementById("txt_filename");
    if (nameEl) nameEl.innerHTML = filedata.origin_file_name;
    const deleteEl = document.getElementById("txt_file_delete");
    if (deleteEl) deleteEl.className = COMMUNITY_FILE_DELETE_CLASS;
}

function click_delete_file() {
    communityState.articleFile = null;
    if (communityState.articleData) {
        communityState.articleData.file_url = null;
        communityState.articleData.file_name = null;
    }

    const inputEl = document.getElementById("id_file_upload");
    if (inputEl) inputEl.value = "";
    const nameEl = document.getElementById("txt_filename");
    if (nameEl) nameEl.innerHTML = null;
    const deleteEl = document.getElementById("txt_file_delete");
    if (deleteEl) deleteEl.className = "hidden";
}

function mountArticleEditor() {
    communityState.articleEditor = new toastui.Editor({
        el: document.querySelector("#div_editor"),
        previewStyle: "vertical",
        height: "500px",
        initialEditType: "wysiwyg",
        plugins: getEditorPlugins(),
        hooks: {
            addImageBlobHook: async (blob, callback) => {
                try {
                    const compressedBase64 = await compressImage(blob, 1200, 1200, 0.8, 500);
                    callback(compressedBase64, blob.name || "image");
                } catch (error) {
                    alert("이미지 처리에 실패했습니다. 다시 시도해 주세요.");
                }
            },
        },
    });
}

function Div_check_writer() {
    return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
            <div class="flex flex-col justify-center items-center w-full space-y-4">
                <svg aria-hidden="true" class="w-8 h-8 animate-spin text-gray-200 fill-blue-600" viewBox="0 0 100 101">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="10" fill="none"></circle>
                    <path d="M95 50a45 45 0 0 1-45 45" stroke="currentColor" stroke-width="10"></path>
                </svg>
                <p>작성자 여부를 확인하고 있습니다.</p>
            </div>
        </div>
    );
}

function Div_main_stop() {
    return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
            <div class="flex flex-col justify-center items-center w-full space-y-4">
                <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg" class="size-16" />
                <p>작성자만 글을 수정할 수 있습니다.</p>
                <a href={init_url}
                   class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
                    목록으로
                </a>
            </div>
        </div>
    );
}

async function submit_write() {
    const txt_title = document.getElementById("txt_title").value.trim();
    const txt_content = communityState.articleEditor.getHTML();
    const chk_secret = document.getElementById("chk_secret").checked;

    if (communityState.toggle_click_submit) {
        return;
    }

    communityState.toggle_click_submit = true;
    ReactDOM.render(<Div_button_loading />, document.getElementById("div_button_list"));

    if (txt_title == null || txt_title === "") {
        alert("제목을 입력해주세요.");
    } else if (txt_content == null || txt_content === "" || txt_content === "<p><br></p>") {
        alert("내용을 입력해주세요.");
    } else {
        const request_data = new FormData();
        request_data.append("tag", url);
        request_data.append("tag_sub", sub);
        request_data.append("txt_title", txt_title);
        request_data.append("txt_content", txt_content);
        request_data.append("chk_secret", chk_secret);
        if (communityState.articleFile != null) {
            request_data.append("attached_file", communityState.articleFile.uuid);
        }

        const data = await fetch("/blank/ajax_board/insert_article/", {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data,
        }).then(res => res.json());

        location.href = init_url + "read/" + data.uuid + "/";
    }

    communityState.toggle_click_submit = false;
    ReactDOM.render(<Div_button />, document.getElementById("div_button_list"));
}

async function submit_edit() {
    const txt_title = document.getElementById("txt_title").value.trim();
    const txt_content = communityState.articleEditor.getHTML();
    const chk_secret = document.getElementById("chk_secret").checked;

    if (communityState.toggle_click_submit) {
        return;
    }

    communityState.toggle_click_submit = true;
    ReactDOM.render(<Div_button_loading />, document.getElementById("div_button_list"));

    if (txt_title == null || txt_title === "") {
        alert("제목을 입력해주세요.");
    } else if (txt_content == null || txt_content === "" || txt_content === "<p><br></p>") {
        alert("내용을 입력해주세요.");
    } else {
        const request_data = new FormData();
        request_data.append("tag", url);
        request_data.append("tag_sub", sub);
        request_data.append("uuid_article", orderID);
        request_data.append("txt_title", txt_title);
        request_data.append("txt_content", txt_content);
        request_data.append("chk_secret", chk_secret);

        if (communityState.articleFile != null) {
            request_data.append("attached_file", communityState.articleFile.file_name);
        } else if (communityState.articleData && communityState.articleData.file_url != null) {
            request_data.append("attached_file", communityState.articleData.file_url);
        }

        const response_data = await fetch("/blank/ajax_board/update_article/", {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data,
        }).then(res => res.json());

        location.href = init_url + "read/" + response_data.uuid + "/";
    }

    communityState.toggle_click_submit = false;
    ReactDOM.render(<Div_button />, document.getElementById("div_button_list"));
}

async function click_btn_submit() {
    if (getCommunityMode() === "edit") {
        return submit_edit();
    }
    return submit_write();
}

async function set_main_write() {
    resetEditorState();
    if (gv_username !== "") {
        ReactDOM.render(<Div_main />, document.getElementById("div_main"));
        mountArticleEditor();
    } else {
        location.href = init_url;
    }
}

async function set_main_edit() {
    resetEditorState();

    if (!gv_username) {
        location.href = init_url;
        return;
    }

    ReactDOM.render(<Div_check_writer />, document.getElementById("div_main"));

    const fd = new FormData();
    fd.append("orderID", orderID);

    communityState.articleData = await fetch("/blank/ajax_board/get_read_article/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: fd,
    }).then(res => res.json());

    if (communityState.articleData.check_reader === "user") {
        ReactDOM.render(<Div_main_stop />, document.getElementById("div_main"));
        return;
    }

    ReactDOM.render(<Div_main />, document.getElementById("div_main"));
    mountArticleEditor();

    document.getElementById("txt_title").value = communityState.articleData.title;
    communityState.articleEditor.setHTML(communityState.articleData.content);
    document.getElementById("chk_secret").checked = communityState.articleData.is_secret == 1;

    if (communityState.articleData.file_name) {
        document.getElementById("txt_filename").innerHTML = communityState.articleData.file_name;
        document.getElementById("txt_file_delete").className = COMMUNITY_FILE_DELETE_CLASS;
    }
}

async function set_main() {
    normalizeCommunityRoute();

    if (getCommunityMode() === "read") {
        await set_main_read();
    } else if (getCommunityMode() === "write") {
        await set_main_write();
    } else if (getCommunityMode() === "edit") {
        await set_main_edit();
    } else {
        await set_main_list();
    }
}

window.set_main = set_main;
window.check_file_upload = check_file_upload;
window.click_btn_search = click_btn_search;
window.handleChangeTab = handleChangeTab;
window.click_btn_delete = click_btn_delete;
window.click_btn_reply_comment = click_btn_reply_comment;
window.click_btn_edit_comment = click_btn_edit_comment;
window.comment_action = comment_action;
window.comment_file_action = comment_file_action;
window.click_delete_file = click_delete_file;
window.click_btn_submit = click_btn_submit;
