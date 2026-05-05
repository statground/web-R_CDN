
let header_title = "유튜브";
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
let youtubeListCanWrite = false;
let youtubeSearchQuery = "";
let youtubeLoadedItems = [];
let youtubeSpotlightKey = "";

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

function compactNumber(value) {
    const number = Number(value || 0);
    if (!Number.isFinite(number) || number <= 0) return "";
    if (number >= 1000000) return (number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace(/\.0$/, "") + "M";
    if (number >= 1000) return (number / 1000).toFixed(number >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K";
    return String(number);
}

function displayDate(value) {
    const text = safeDateText(value);
    return text ? text.slice(0, 10) : "";
}

function youtubeThumb(item) {
    return item && item.youtube_thumbnail ? item.youtube_thumbnail : "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_youtube.svg";
}

function youtubeHref(item) {
    return init_url + "read/" + item.uuid + "/";
}

function youtubeVideoID(rawURL) {
    const raw = String(rawURL || "").trim();
    if (!raw) return "";
    try {
        const parsed = new URL(raw);
        if (parsed.hostname.includes("youtu.be")) {
            return parsed.pathname.replace("/", "").split("/")[0];
        }
        if (parsed.pathname.includes("/embed/")) {
            return parsed.pathname.split("/embed/")[1].split("/")[0];
        }
        if (parsed.pathname.includes("/shorts/")) {
            return parsed.pathname.split("/shorts/")[1].split("/")[0];
        }
        return parsed.searchParams.get("v") || "";
    } catch (error) {
        const match = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
        return match ? match[1] : "";
    }
}

function youtubeFallbackThumb(item) {
    const videoID = youtubeVideoID(item && item.youtube_url);
    return videoID ? "https://i.ytimg.com/vi/" + videoID + "/hqdefault.jpg" : "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_youtube.svg";
}

function onYoutubeThumbError(event, item) {
    const fallback = youtubeFallbackThumb(item);
    if (event.currentTarget.dataset.fallbackApplied === "1" || event.currentTarget.src === fallback) {
        const card = event.currentTarget.closest("[data-youtube-card]");
        if (card) card.classList.add("hidden");
        return;
    }
    event.currentTarget.dataset.fallbackApplied = "1";
    event.currentTarget.src = fallback;
}

function onYoutubeThumbLoad(event) {
    if (event.currentTarget.naturalWidth <= 120 && event.currentTarget.naturalHeight <= 90) {
        const card = event.currentTarget.closest("[data-youtube-card]");
        if (card) card.classList.add("hidden");
    }
}

function youtubeEmbedUrl(rawURL) {
    const videoID = youtubeVideoID(rawURL);
    return videoID ? "https://www.youtube.com/embed/" + videoID + "?rel=0&modestbranding=1" : "";
}

function isRenderableYoutubeItem(item) {
    return !!(item && item.uuid && item.youtube_url && item.title);
}

function isOfficialYoutube(item) {
    return item && (item.source === "article" || Number(item.sort_priority || 0) > 0);
}

function dedupeYoutubeItems(items) {
    const out = [];
    const indexByKey = {};

    (items || []).filter(isRenderableYoutubeItem).forEach((item) => {
        const key = youtubeVideoID(item.youtube_url) || item.uuid;
        if (!key) return;
        const previousIndex = indexByKey[key];
        if (previousIndex == null) {
            indexByKey[key] = out.length;
            out.push(item);
            return;
        }
        const previous = out[previousIndex];
        const shouldReplace = (isOfficialYoutube(item) && !isOfficialYoutube(previous)) ||
            (isOfficialYoutube(item) === isOfficialYoutube(previous) && Number(item.youtube_views || 0) > Number(previous.youtube_views || 0));
        if (shouldReplace) {
            out[previousIndex] = item;
        }
    });

    return out;
}

function arrangeYoutubeItems(items) {
    const base = dedupeYoutubeItems(items);
    const byLatest = [...base].sort((a, b) => String(b.youtube_publish_date || b.created_at || "").localeCompare(String(a.youtube_publish_date || a.created_at || "")));
    const byViews = [...base].sort((a, b) => Number(b.youtube_views || 0) - Number(a.youtube_views || 0));
    const byOfficial = [...base].filter(isOfficialYoutube).sort((a, b) => String(b.youtube_publish_date || b.created_at || "").localeCompare(String(a.youtube_publish_date || a.created_at || "")));
    const byLowViews = [...base]
        .filter((item) => Number(item.youtube_views || 0) > 0)
        .sort((a, b) => Number(a.youtube_views || 0) - Number(b.youtube_views || 0));
    const lanes = [byLatest, byViews, byOfficial, byLowViews];
    const seen = {};
    const out = [];

    for (let i = 0; out.length < base.length && i < base.length * lanes.length; i += 1) {
        lanes.forEach((lane) => {
            const candidate = lane.shift();
            if (!candidate) return;
            const key = youtubeVideoID(candidate.youtube_url) || candidate.uuid;
            if (seen[key]) return;
            seen[key] = true;
            out.push(candidate);
        });
    }

    base.forEach((item) => {
        const key = youtubeVideoID(item.youtube_url) || item.uuid;
        if (!seen[key]) out.push(item);
    });

    return out;
}

function youtubeItemKey(item) {
    return youtubeVideoID(item && item.youtube_url) || (item && item.uuid) || "";
}

function randomSpotlightItem(items) {
    const candidates = (items || []).slice(0, 12);
    if (!candidates.length) return null;

    const current = candidates.find((item) => youtubeItemKey(item) === youtubeSpotlightKey);
    if (current) return current;

    const item = candidates[Math.floor(Math.random() * candidates.length)] || candidates[0];
    youtubeSpotlightKey = youtubeItemKey(item);
    return item;
}

function videoMetaText(item) {
    const pieces = [];
    if (displayDate(item.youtube_publish_date || item.created_at)) pieces.push(displayDate(item.youtube_publish_date || item.created_at));
    if (compactNumber(item.youtube_views)) pieces.push(compactNumber(item.youtube_views) + " 조회");
    return pieces.join(" · ");
}

function categoryLabel(item) {
    if (isOfficialYoutube(item)) return "Web-R 공식";
    return "";
}

function plainTextFromHTML(value) {
    const div = document.createElement("div");
    div.innerHTML = value || "";
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
}

function articleSummary(item) {
    const text = plainTextFromHTML(item && item.content);
    if (!text) return "Web-R 워크샵에서 제공하는 YouTube 영상입니다.";
    return text.length > 170 ? text.slice(0, 170) + "..." : text;
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
        <div class="w-full space-y-8 animate-pulse">
            <div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div class="grid gap-6 p-6 lg:grid-cols-2 lg:p-10">
                    <div class="flex flex-col justify-center space-y-4">
                        <div class="h-4 w-32 rounded-full bg-gray-200"></div>
                        <div class="h-10 w-4/5 rounded bg-gray-200"></div>
                        <div class="h-4 w-2/3 rounded bg-gray-100"></div>
                        <div class="h-10 w-32 rounded-lg bg-gray-200"></div>
                    </div>
                    <div class="aspect-video rounded-lg bg-gray-200"></div>
                </div>
            </div>
            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {[0, 1, 2, 3, 4].map((idx) => (
                    <div key={idx} class="space-y-3">
                        <div class="aspect-video rounded-lg bg-gray-200"></div>
                        <div class="h-4 rounded bg-gray-200"></div>
                        <div class="h-3 w-2/3 rounded bg-gray-100"></div>
                    </div>
                ))}
            </div>
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


function Div_new_article_list_youtube(props) {
    return <YoutubeVideoCard data={props.data} />;
}

function YoutubeVideoCard(props) {
    const item = props.data || {};
    const compact = !!props.compact;
    const official = isOfficialYoutube(item);
    const meta = videoMetaText(item);
    const titleStyle = {
        display: "-webkit-box",
        WebkitLineClamp: compact ? 2 : 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
    };

    return (
        <a href={youtubeHref(item)} class={(compact ? "w-[240px] shrink-0 sm:w-[260px] " : "") + "group block"} data-youtube-card="1">
            <div class="relative aspect-video overflow-hidden rounded-lg bg-gray-900 shadow-sm">
                <img
                    src={youtubeThumb(item)}
                    alt={item.title || "YouTube thumbnail"}
                    class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(event) => {
                        onYoutubeThumbError(event, item);
                    }}
                    onLoad={onYoutubeThumbLoad}
                />
                {official ? (
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3">
                        <span class="inline-flex h-6 items-center rounded-full bg-emerald-400 px-2 text-[11px] font-bold text-gray-900">
                            {categoryLabel(item)}
                        </span>
                    </div>
                ) : null}
            </div>
            <div class="mt-3 space-y-1">
                <h3 class="text-sm font-bold leading-5 text-gray-900 group-hover:text-emerald-600" style={titleStyle}>
                    {item.title || "제목 없음"}
                </h3>
                <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {meta ? <span>{meta}</span> : null}
                    {item.cnt_comment ? <span>댓글 {numberWithCommas(item.cnt_comment)}</span> : null}
                </div>
            </div>
        </a>
    );
}

function YoutubeSearchBar() {
    const submitSearch = (event) => {
        event.preventDefault();
        const input = event.currentTarget.querySelector("input[name='youtube_search']");
        youtubeSearchQuery = input ? input.value.trim() : "";
        get_article_list_youtube("init");
    };

    return (
        <form onSubmit={submitSearch} class="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
            <input
                type="search"
                name="youtube_search"
                defaultValue={youtubeSearchQuery}
                placeholder="영상 제목, 설명, 패키지명 검색"
                class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button type="submit" class="h-10 rounded-lg bg-emerald-500 px-5 text-sm font-bold text-white hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100">
                검색
            </button>
        </form>
    );
}

function YoutubeOfficialSpotlight(props) {
    const item = props.item || {};
    const official = isOfficialYoutube(item);
    const meta = videoMetaText(item);

    if (!item.uuid) {
        return null;
    }

    return (
        <section class="relative overflow-hidden rounded-lg bg-gray-900 text-white shadow-xl">
            <img
                src={youtubeThumb(item)}
                alt=""
                class="absolute inset-0 h-full w-full object-cover opacity-30"
                loading="lazy"
                onError={(event) => {
                    event.currentTarget.style.display = "none";
                }}
            />
            <div class="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/35"></div>
            <div class="relative grid gap-8 p-6 lg:grid-cols-2 lg:p-10">
                <div class="flex min-h-[280px] flex-col justify-center space-y-5">
                    <div class="flex flex-wrap items-center gap-2">
                        {official ? (
                            <span class="inline-flex h-7 items-center rounded-full bg-emerald-400 px-3 text-xs font-extrabold text-gray-900">
                                Web-R 공식
                            </span>
                        ) : null}
                        {props.totalCount ? <span class="text-xs font-semibold text-white/70">전체 {numberWithCommas(props.totalCount)}개</span> : null}
                    </div>
                    <div class="space-y-3">
                        <h2 class="max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-2xl">
                            {item.title || "Web-R YouTube"}
                        </h2>
                        {meta ? <p class="text-sm font-medium text-white/70">{meta}</p> : null}
                    </div>
                    <div class="flex flex-wrap gap-3">
                        <a href={youtubeHref(item)} class="inline-flex h-11 items-center rounded-lg bg-white px-5 text-sm font-extrabold text-gray-900 hover:bg-emerald-50">
                            자세히 보기
                        </a>
                        {item.youtube_url ? (
                            <a href={item.youtube_url} target="_blank" rel="noopener noreferrer" class="inline-flex h-11 items-center rounded-lg border border-white/30 px-5 text-sm font-bold text-white hover:bg-white/10">
                                YouTube
                            </a>
                        ) : null}
                    </div>
                </div>
                <a href={youtubeHref(item)} class="group relative flex items-center">
                    <div class="aspect-video w-full overflow-hidden rounded-lg border border-white/15 bg-black shadow-2xl">
                        <img
                            src={youtubeThumb(item)}
                            alt={item.title || "YouTube thumbnail"}
                            class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(event) => {
                                event.currentTarget.src = "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_youtube.svg";
                            }}
                        />
                    </div>
                </a>
            </div>
        </section>
    );
}

function YoutubeRail(props) {
    const items = props.items || [];
    if (!items.length) return null;

    return (
        <section class="w-full space-y-4">
            <div class="flex items-end justify-between">
                <h2 class="text-xl font-extrabold text-gray-900">{props.title}</h2>
                {props.caption ? <span class="text-xs font-semibold text-gray-500">{props.caption}</span> : null}
            </div>
            <div class="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
                {items.map((item, idx) => (
                    <YoutubeVideoCard key={(item.uuid || "youtube") + "_rail_" + idx} data={item} compact={true} />
                ))}
            </div>
        </section>
    );
}

function YoutubeCatalog(props) {
    const items = arrangeYoutubeItems(props.items || []);
    const spotlight = randomSpotlightItem(items);
    const spotlightKey = youtubeItemKey(spotlight);
    const gridItems = spotlightKey ? items.filter((item) => youtubeItemKey(item) !== spotlightKey) : items;

    if (!items.length) {
        return (
            <div class="flex min-h-[320px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
                <p class="text-lg font-extrabold text-gray-900">검색 결과가 없습니다.</p>
                <p class="mt-2 text-sm text-gray-500">다른 검색어로 다시 확인해 주세요.</p>
            </div>
        );
    }

    return (
        <div class="w-full space-y-8">
            {spotlight ? <YoutubeOfficialSpotlight item={spotlight} totalCount={props.totalCount} /> : null}
            <section class="space-y-4">
                <div class="flex items-end justify-between gap-4">
                    <h2 class="text-xl font-extrabold text-gray-900">추천 영상</h2>
                    <span class="text-xs font-semibold text-gray-500">{numberWithCommas(items.length)}개 표시 중</span>
                </div>
                <div class="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {gridItems.map((item, idx) => (
                        <YoutubeVideoCard key={(item.uuid || "youtube") + "_grid_" + idx} data={item} />
                    ))}
                </div>
                <div id={props.placeholderId} class="h-1 w-full"></div>
            </section>
        </div>
    );
}

function Div_article_read_header(props) {
    const item = props.data || {};
    const official = isOfficialYoutube(item);
    const meta = videoMetaText(item);
    return (
        <div class="flex min-h-[300px] flex-col justify-center space-y-5">
            <div class="flex flex-wrap items-center gap-2 text-sm font-bold text-white/60">
                <a href={init_url} class="hover:text-white">유튜브</a>
                <span>/</span>
                <span>{official ? "Web-R 공식" : "워크샵"}</span>
            </div>
            <div class="space-y-4">
                <div class="flex flex-wrap items-center gap-2">
                    {official ? <span class="inline-flex h-7 items-center rounded-full bg-emerald-400 px-3 text-xs font-extrabold text-gray-900">Web-R 공식</span> : null}
                    <Span_btn_article_new toggle={item.is_new} />
                    <Span_btn_my_article toggle={item.check_reader} />
                </div>
                <h1 class="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-3xl">{item.title || "제목 없음"}</h1>
                <p class="max-w-3xl text-base font-medium leading-7 text-white/70">{articleSummary(item)}</p>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-sm font-semibold text-white/70">
                {item.user_nickname ? <span>{item.user_nickname}</span> : null}
                {meta ? <span>{meta}</span> : null}
                {item.cnt_comment ? <span>댓글 {numberWithCommas(item.cnt_comment)}</span> : null}
            </div>
        </div>
    );
}


function Div_article_read_youtube(props) {
    const item = props.data || {};
    const embedURL = youtubeEmbedUrl(item.youtube_url);
    if (!embedURL) return null;
    return (
        <div class="flex h-full items-center">
            <div class="w-full overflow-hidden rounded-lg border border-white/15 bg-black shadow-2xl">
                <div class="aspect-video w-full">
                    <iframe
                        class="h-full w-full"
                        src={embedURL}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen={true}
                    ></iframe>
                </div>
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
    const item = props.data || {};
    const btnClass = "inline-flex h-11 items-center justify-center rounded-lg text-sm font-extrabold";

    return (
        <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div class="space-y-4 p-5">
                <div>
                    <p class="text-sm font-bold text-gray-500">영상</p>
                    <p class="mt-1 text-2xl font-extrabold text-gray-900">무료</p>
                </div>
                {item.youtube_url ? (
                    <a href={item.youtube_url} target="_blank" rel="noopener noreferrer" class={btnClass + " w-full bg-emerald-500 text-white hover:bg-emerald-600"}>
                        YouTube에서 보기
                    </a>
                ) : null}
                <a href={init_url} class={btnClass + " w-full border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"}>목록으로</a>
            </div>
            <div class="border-t border-gray-100 p-5 text-sm">
                <dl class="grid grid-cols-[90px_1fr] gap-y-2 text-gray-500">
                    <dt>게시자</dt>
                    <dd class="font-bold text-gray-900">{item.user_nickname || "-"}</dd>
                    <dt>게시일</dt>
                    <dd class="font-bold text-gray-900">{displayDate(item.youtube_publish_date || item.created_at) || "-"}</dd>
                    <dt>조회수</dt>
                    <dd class="font-bold text-gray-900">{numberWithCommas(item.youtube_views || item.cnt_read || 0)}</dd>
                </dl>
            </div>
            {item.check_reader !== "user" && (
                <div class="grid grid-cols-2 gap-2 border-t border-gray-100 p-5">
                    <button onClick={() => location.href = init_url + "edit/" + orderID + "/"} class={btnClass + " border border-green-600 text-green-700 hover:bg-green-50"}>수정</button>
                    <button type="button" onClick={() => click_btn_delete()} class={btnClass + " border border-red-600 text-red-700 hover:bg-red-50"}>삭제</button>
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


function YouTubeListPage(props) {
    return (
        <div class="w-full bg-gray-50">
            <div class="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-6 py-8 md:px-4">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="space-y-2">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="inline-flex h-7 items-center rounded-full bg-emerald-100 px-3 text-xs font-extrabold text-emerald-700">Web-R Workshop</span>
                            <span class="inline-flex h-7 items-center rounded-full bg-gray-900 px-3 text-xs font-extrabold text-white">YouTube</span>
                        </div>
                        <div>
                            <h1 class="text-3xl font-extrabold leading-tight text-gray-900 sm:text-2xl">{header_title}</h1>
                            <p class="mt-1 text-sm font-semibold text-gray-500">{header_subtitle}</p>
                        </div>
                    </div>
                    {props.showWriteButton && (
                        <button
                            type="button"
                            onClick={() => (location.href = init_url + "write/")}
                            class="h-10 rounded-lg bg-gray-900 px-5 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200"
                        >
                            글쓰기
                        </button>
                    )}
                </div>

                <YoutubeSearchBar />

                <div id="div_community_list" class="w-full">
                    <div id="div_article_list" class="w-full">
                        <Div_article_list_skeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}


function YouTubeReadPage() {
    return (
        <div class="w-full bg-white">
            <section class="bg-gray-950">
                <div class="mx-auto grid w-full max-w-screen-xl gap-8 px-6 py-10 lg:grid-cols-[1.05fr_.95fr] md:px-4">
                    <div id="div_community_read_header">
                        <div class="min-h-[300px] space-y-4 py-10 animate-pulse">
                            <div class="h-4 w-40 rounded-full bg-white/20"></div>
                            <div class="h-10 w-4/5 rounded bg-white/20"></div>
                            <div class="h-4 w-3/4 rounded bg-white/10"></div>
                            <div class="h-4 w-2/3 rounded bg-white/10"></div>
                        </div>
                    </div>
                    <div id="div_community_read_youtube">
                        <div class="aspect-video w-full rounded-lg bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
            </section>

            <div class="border-b border-gray-200 bg-white">
                <div class="mx-auto flex w-full max-w-screen-xl gap-8 px-6 md:px-4">
                    <span class="border-b-2 border-gray-900 py-4 text-sm font-extrabold text-gray-900">영상 소개</span>
                    <a href={init_url} class="py-4 text-sm font-bold text-gray-500 hover:text-gray-900">목록</a>
                </div>
            </div>

            <div class="mx-auto grid w-full max-w-screen-xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_320px] md:px-4">
                <main class="min-w-0 space-y-8">
                    <section class="space-y-5">
                        <h2 class="text-2xl font-extrabold text-gray-900">영상 개요</h2>
                        <div class="rounded-lg border border-gray-200 bg-white p-6">
                            <div id="div_community_read_content" class="w-full">
                                <div class="h-48 w-full rounded bg-gray-200 animate-pulse"></div>
                            </div>
                        </div>
                    </section>
                    <div class="w-full" id="div_community_read_file">
                        <div class="h-12 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>
                    <div class="w-full" id="div_community_read_comment">
                        <div class="h-24 w-full rounded bg-gray-200 animate-pulse"></div>
                    </div>
                </main>

                <aside class="space-y-4 lg:sticky lg:top-6 lg:self-start">
                    <div id="div_article_read_buttons" class="w-full"></div>
                    <Div_sidelist_skeleton id="div_article_famous_list" title="최근 인기 글" />
                    <Div_sidelist_skeleton id="div_new_comment_list" title="최근 댓글" />
                    <Div_sidelist_skeleton id="div_my_article_list" title="내가 쓴 글" />
                    <Div_sidelist_skeleton id="div_my_comment_list" title="내가 쓴 댓글" />
                </aside>
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


async function get_article_list_youtube(mode_value) {
    const request_data = new FormData();
    request_data.append("tag", url);
    request_data.append("tag_sub", sub);
    request_data.append("txt_search", youtubeSearchQuery);

    toggle_page = true;

    if (mode_value === "init") {
        page_num = 1;
        youtubeLoadedItems = [];
        youtubeSpotlightKey = "";
        ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list"));
    } else {
        page_num += 1;
        const nextTarget = document.getElementById("div_article_list_" + page_num);
        if (nextTarget) {
            ReactDOM.render(
                <div class="py-6">
                    <Div_article_list_skeleton />
                </div>,
                nextTarget
            );
        }
    }

    request_data.append("page", page_num);

    const data = await postForm("/blank/ajax_board/get_article_list_youtube/", request_data);
    article_counter = Number(data && data.count ? data.count.cnt : 0);

    const chunk = Object.keys(data.list || {}).map((key) => data.list[key]);
    youtubeLoadedItems = dedupeYoutubeItems(youtubeLoadedItems.concat(chunk));
    const placeholderId = "div_article_list_" + (page_num + 1);

    ReactDOM.render(<YoutubeCatalog items={youtubeLoadedItems} totalCount={article_counter} placeholderId={placeholderId} />, document.getElementById("div_article_list"));

    toggle_page = false;
}


function render_article() {
    if (!data_article) return;

    const headerTarget = document.getElementById("div_community_read_header");
    const youtubeTarget = document.getElementById("div_community_read_youtube");
    const buttonTarget = document.getElementById("div_article_read_buttons");
    const fileTarget = document.getElementById("div_community_read_file");
    const contentTarget = document.querySelector("#div_community_read_content");

    if (headerTarget) {
        ReactDOM.render(<Div_article_read_header data={data_article} />, headerTarget);
    }
    if (youtubeTarget) {
        ReactDOM.render(<Div_article_read_youtube data={data_article} />, youtubeTarget);
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

async function renderWorkshopListPage() {
    clearInfiniteScroll();
    page_num = 1;
    article_counter = 0;
    toggle_page = false;
    youtubeSearchQuery = "";
    youtubeLoadedItems = [];
    youtubeSpotlightKey = "";

    const menuData = await fetch(ENDPOINTS.menuHeader).then((res) => res.json()).catch(() => ({ username: getCurrentUsername(), role: typeof gv_role === "string" ? gv_role : "" }));
    const normalizedRole = typeof menuData.role === "string" ? menuData.role.trim().toLowerCase() : "";
    youtubeListCanWrite = !!menuData.username && (normalizedRole === "admin" || normalizedRole === "관리자");

    ReactDOM.render(<YouTubeListPage showWriteButton={youtubeListCanWrite} />, document.getElementById("div_main"));
    get_article_list_youtube("init");

    bindInfiniteScroll(() => {
        const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
        if (isScrollEnded && !toggle_page && page_num * PAGE_SIZE < article_counter) {
            get_article_list_youtube("next");
        }
    });
}

function renderWorkshopReadPage() {
    clearInfiniteScroll();
    commentFiles = [];
    commentEditors = {};
    ReactDOM.render(<YouTubeReadPage />, document.getElementById("div_main"));

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
