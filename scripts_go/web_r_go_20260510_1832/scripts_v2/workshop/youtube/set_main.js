let header_title = "\uC720\uD29C\uBE0C";
let header_subtitle = "\uC6CC\uD06C\uC0F5";
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
async function postForm(url2, formData, options = {}) {
  const parseJson = options.parseJson !== false;
  const response = await fetch(url2, {
    method: "post",
    headers: { "X-CSRFToken": getCsrfToken() },
    body: formData
  });
  if (!response.ok) {
    throw new Error(url2 + " -> HTTP " + response.status);
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
  if (value == null || value === "")
    return "0";
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function safeDateText(value) {
  if (!value)
    return "";
  return String(value);
}
function compactNumber(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number <= 0)
    return "";
  if (number >= 1e6)
    return (number / 1e6).toFixed(number >= 1e7 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (number >= 1e3)
    return (number / 1e3).toFixed(number >= 1e4 ? 0 : 1).replace(/\.0$/, "") + "K";
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
  if (!raw)
    return "";
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
    if (card)
      card.classList.add("hidden");
    return;
  }
  event.currentTarget.dataset.fallbackApplied = "1";
  event.currentTarget.src = fallback;
}
function onYoutubeThumbLoad(event) {
  if (event.currentTarget.naturalWidth <= 120 && event.currentTarget.naturalHeight <= 90) {
    const card = event.currentTarget.closest("[data-youtube-card]");
    if (card)
      card.classList.add("hidden");
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
    if (!key)
      return;
    const previousIndex = indexByKey[key];
    if (previousIndex == null) {
      indexByKey[key] = out.length;
      out.push(item);
      return;
    }
    const previous = out[previousIndex];
    const shouldReplace = isOfficialYoutube(item) && !isOfficialYoutube(previous) || isOfficialYoutube(item) === isOfficialYoutube(previous) && Number(item.youtube_views || 0) > Number(previous.youtube_views || 0);
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
  const byLowViews = [...base].filter((item) => Number(item.youtube_views || 0) > 0).sort((a, b) => Number(a.youtube_views || 0) - Number(b.youtube_views || 0));
  const lanes = [byLatest, byViews, byOfficial, byLowViews];
  const seen = {};
  const out = [];
  for (let i = 0; out.length < base.length && i < base.length * lanes.length; i += 1) {
    lanes.forEach((lane) => {
      const candidate = lane.shift();
      if (!candidate)
        return;
      const key = youtubeVideoID(candidate.youtube_url) || candidate.uuid;
      if (seen[key])
        return;
      seen[key] = true;
      out.push(candidate);
    });
  }
  base.forEach((item) => {
    const key = youtubeVideoID(item.youtube_url) || item.uuid;
    if (!seen[key])
      out.push(item);
  });
  return out;
}
function youtubeItemKey(item) {
  return youtubeVideoID(item && item.youtube_url) || item && item.uuid || "";
}
function randomSpotlightItem(items) {
  const candidates = (items || []).slice(0, 12);
  if (!candidates.length)
    return null;
  const current = candidates.find((item) => youtubeItemKey(item) === youtubeSpotlightKey);
  if (current)
    return current;
  const item = candidates[Math.floor(Math.random() * candidates.length)] || candidates[0];
  youtubeSpotlightKey = youtubeItemKey(item);
  return item;
}
function videoMetaText(item) {
  const pieces = [];
  if (displayDate(item.youtube_publish_date || item.created_at))
    pieces.push(displayDate(item.youtube_publish_date || item.created_at));
  if (compactNumber(item.youtube_views))
    pieces.push(compactNumber(item.youtube_views) + " \uC870\uD68C");
  return pieces.join(" \xB7 ");
}
function categoryLabel(item) {
  if (isOfficialYoutube(item))
    return "Web-R \uACF5\uC2DD";
  return "";
}
function plainTextFromHTML(value) {
  const div = document.createElement("div");
  div.innerHTML = value || "";
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
}
function articleSummary(item) {
  const text = plainTextFromHTML(item && item.content);
  if (!text)
    return "Web-R \uC6CC\uD06C\uC0F5\uC5D0\uC11C \uC81C\uACF5\uD558\uB294 YouTube \uC601\uC0C1\uC785\uB2C8\uB2E4.";
  return text.length > 170 ? text.slice(0, 170) + "..." : text;
}
async function _compressImageOnce(blob, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
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
  return /* @__PURE__ */ React.createElement("span", { class: "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl text-xs bg-" + role + "-100 text-" + role + "-800" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/board_user.svg", class: "w-3 h-3 mr-1" }), props.user_nickname);
}
function Span_btn_date(props) {
  const rawDate = safeDateText(props.date);
  const dateKey = rawDate && rawDate.split("-")[2] ? Number(rawDate.split("-")[2].substr(0, 2)) : 1;
  return /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " text-xs bg-blue-100 text-blue-800" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/calendar_" + dateKey + ".svg", class: "w-3 h-3 mr-1" }), rawDate);
}
function Span_btn_article_read(props) {
  if (!(Number(props.cnt_read || 0) > 0))
    return null;
  return /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " text-xs bg-gray-100 text-blue-800" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/eye.svg", class: "w-3 h-3 mr-1" }), numberWithCommas(props.cnt_read));
}
function Span_btn_article_comment(props) {
  if (!(Number(props.cnt_comment || 0) > 0))
    return null;
  return /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " text-xs bg-purple-100 text-blue-800" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment.svg", class: "w-3 h-3 mr-1" }), numberWithCommas(props.cnt_comment));
}
function Span_btn_article_new(props) {
  return normalizeBool(props.toggle) ? /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " text-[10px] bg-red-500 text-white animate-pulse" }, "NEW") : null;
}
function Span_btn_article_secret(props) {
  return normalizeBool(props.toggle) ? /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " text-[10px] bg-gray-500 text-white animate-pulse" }, "SECRET") : null;
}
function Span_btn_comment_secret(props) {
  return normalizeBool(props.toggle) ? /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " text-[10px] bg-gray-500 text-white animate-pulse" }, "SECRET") : null;
}
function Span_btn_my_article(props) {
  return props.toggle === "writer" ? /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " text-[10px] bg-blue-500 text-white animate-pulse" }, "MY") : null;
}
function Span_btn_my_comment(props) {
  return props.toggle === "writer" ? /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " text-[10px] bg-blue-500 text-white animate-pulse" }, "MY") : null;
}
function Div_sidelist_skeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { id: props.id, class: "w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: props.title }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-2 animate-pulse" }, /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-200 rounded-full w-full" }), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-200 rounded-full w-full" }), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-200 rounded-full w-full" }))));
}
function Div_article_list_skeleton() {
  return /* @__PURE__ */ React.createElement("div", { class: "w-full space-y-8 animate-pulse" }, /* @__PURE__ */ React.createElement("div", { class: "overflow-hidden rounded-lg border border-gray-200 bg-white" }, /* @__PURE__ */ React.createElement("div", { class: "grid gap-6 p-6 lg:grid-cols-2 lg:p-10" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "h-4 w-32 rounded-full bg-gray-200" }), /* @__PURE__ */ React.createElement("div", { class: "h-10 w-4/5 rounded bg-gray-200" }), /* @__PURE__ */ React.createElement("div", { class: "h-4 w-2/3 rounded bg-gray-100" }), /* @__PURE__ */ React.createElement("div", { class: "h-10 w-32 rounded-lg bg-gray-200" })), /* @__PURE__ */ React.createElement("div", { class: "aspect-video rounded-lg bg-gray-200" }))), /* @__PURE__ */ React.createElement("div", { class: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" }, [0, 1, 2, 3, 4].map((idx) => /* @__PURE__ */ React.createElement("div", { key: idx, class: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { class: "aspect-video rounded-lg bg-gray-200" }), /* @__PURE__ */ React.createElement("div", { class: "h-4 rounded bg-gray-200" }), /* @__PURE__ */ React.createElement("div", { class: "h-3 w-2/3 rounded bg-gray-100" })))));
}
function Div_new_article_list(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "bg-white border-b w-full" }, /* @__PURE__ */ React.createElement("a", { href: init_url + "read/" + props.data.uuid + "/", class: "flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement("span", { class: "font-bold text-sm w-fit max-w-9/12 truncate ..." }, props.data.title), /* @__PURE__ */ React.createElement(Span_btn_article_new, { toggle: props.data.is_new }), /* @__PURE__ */ React.createElement(Span_btn_article_secret, { toggle: props.data.is_secret }), /* @__PURE__ */ React.createElement(Span_btn_my_article, { toggle: props.data.check_reader })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap justify-start items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_user, { user_nickname: props.data.user_nickname, role: props.data.user_role }), /* @__PURE__ */ React.createElement(Span_btn_date, { date: props.data.created_at }), /* @__PURE__ */ React.createElement(Span_btn_article_read, { cnt_read: props.data.cnt_read }), /* @__PURE__ */ React.createElement(Span_btn_article_comment, { cnt_comment: props.data.cnt_comment }))));
}
function Div_new_comment(props) {
  const plainText = (props.data.content || "").replace(/<[^>]*>?/g, "");
  return /* @__PURE__ */ React.createElement("div", { class: "bg-white border-b w-full" }, /* @__PURE__ */ React.createElement("a", { href: init_url + "read/" + props.data.uuid_article + "/", class: "flex flex-col px-6 py-4 space-y-2 cursor-pointer hover:bg-gray-100 w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center" }, /* @__PURE__ */ React.createElement("span", { class: "font-normal text-sm w-fit max-w-full truncate ..." }, plainText)), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center border border-gray-300 rounded-lg" }, /* @__PURE__ */ React.createElement("span", { class: "font-normal text-xs text-gray-500 w-full mr-2 truncate ..." }, /* @__PURE__ */ React.createElement("span", { class: "bg-gray-300 px-2 py-1 mr-1" }, "\uC6D0\uAE00:"), props.data.article_title)), /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_user, { user_nickname: props.data.user_nickname, role: props.data.user_role }), /* @__PURE__ */ React.createElement(Span_btn_date, { date: props.data.created_at }))));
}
function Div_new_article_list_youtube(props) {
  return /* @__PURE__ */ React.createElement(YoutubeVideoCard, { data: props.data });
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
  return /* @__PURE__ */ React.createElement("a", { href: youtubeHref(item), class: (compact ? "w-[240px] shrink-0 sm:w-[260px] " : "") + "group block", "data-youtube-card": "1" }, /* @__PURE__ */ React.createElement("div", { class: "relative aspect-video overflow-hidden rounded-lg bg-gray-900 shadow-sm" }, /* @__PURE__ */ React.createElement("img", { src: youtubeThumb(item), alt: item.title || "YouTube thumbnail", class: "h-full w-full object-cover transition duration-300 group-hover:scale-105", loading: "lazy", onError: (event) => {
    onYoutubeThumbError(event, item);
  }, onLoad: onYoutubeThumbLoad }), official ? /* @__PURE__ */ React.createElement("div", { class: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3" }, /* @__PURE__ */ React.createElement("span", { class: "inline-flex h-6 items-center rounded-full bg-emerald-400 px-2 text-[11px] font-bold text-gray-900" }, categoryLabel(item))) : null), /* @__PURE__ */ React.createElement("div", { class: "mt-3 space-y-1" }, /* @__PURE__ */ React.createElement("h3", { class: "text-sm font-bold leading-5 text-gray-900 group-hover:text-emerald-600", style: titleStyle }, item.title || "\uC81C\uBAA9 \uC5C6\uC74C"), /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap items-center gap-2 text-xs text-gray-500" }, meta ? /* @__PURE__ */ React.createElement("span", null, meta) : null, item.cnt_comment ? /* @__PURE__ */ React.createElement("span", null, "\uB313\uAE00 " + numberWithCommas(item.cnt_comment)) : null)));
}
function YoutubeSearchBar() {
  const submitSearch = (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input[name='youtube_search']");
    youtubeSearchQuery = input ? input.value.trim() : "";
    get_article_list_youtube("init");
  };
  return /* @__PURE__ */ React.createElement("form", { onSubmit: submitSearch, class: "mx-auto flex w-full max-w-2xl items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm" }, /* @__PURE__ */ React.createElement("input", { type: "search", name: "youtube_search", defaultValue: youtubeSearchQuery, placeholder: "\uC601\uC0C1 \uC81C\uBAA9, \uC124\uBA85, \uD328\uD0A4\uC9C0\uBA85 \uAC80\uC0C9", class: "min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400" }), /* @__PURE__ */ React.createElement("button", { type: "submit", class: "h-10 rounded-lg bg-emerald-500 px-5 text-sm font-bold text-white hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100" }, "\uAC80\uC0C9"));
}
function YoutubeOfficialSpotlight(props) {
  const item = props.item || {};
  const official = isOfficialYoutube(item);
  const meta = videoMetaText(item);
  if (!item.uuid)
    return null;
  return /* @__PURE__ */ React.createElement("section", { class: "relative overflow-hidden rounded-lg bg-gray-900 text-white shadow-xl" }, /* @__PURE__ */ React.createElement("img", { src: youtubeThumb(item), alt: "", class: "absolute inset-0 h-full w-full object-cover opacity-30", loading: "lazy", onError: (event) => {
    event.currentTarget.style.display = "none";
  } }), /* @__PURE__ */ React.createElement("div", { class: "absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/35" }), /* @__PURE__ */ React.createElement("div", { class: "relative grid gap-8 p-6 lg:grid-cols-2 lg:p-10" }, /* @__PURE__ */ React.createElement("div", { class: "flex min-h-[280px] flex-col justify-center space-y-5" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap items-center gap-2" }, official ? /* @__PURE__ */ React.createElement("span", { class: "inline-flex h-7 items-center rounded-full bg-emerald-400 px-3 text-xs font-extrabold text-gray-900" }, "Web-R \uACF5\uC2DD") : null, props.totalCount ? /* @__PURE__ */ React.createElement("span", { class: "text-xs font-semibold text-white/70" }, "\uC804\uCCB4 " + numberWithCommas(props.totalCount) + "\uAC1C") : null), /* @__PURE__ */ React.createElement("div", { class: "space-y-3" }, /* @__PURE__ */ React.createElement("h2", { class: "max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-2xl" }, item.title || "Web-R YouTube"), meta ? /* @__PURE__ */ React.createElement("p", { class: "text-sm font-medium text-white/70" }, meta) : null), /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap gap-3" }, /* @__PURE__ */ React.createElement("a", { href: youtubeHref(item), class: "inline-flex h-11 items-center rounded-lg bg-white px-5 text-sm font-extrabold text-gray-900 hover:bg-emerald-50" }, "\uC790\uC138\uD788 \uBCF4\uAE30"), item.youtube_url ? /* @__PURE__ */ React.createElement("a", { href: item.youtube_url, target: "_blank", rel: "noopener noreferrer", class: "inline-flex h-11 items-center rounded-lg border border-white/30 px-5 text-sm font-bold text-white hover:bg-white/10" }, "YouTube") : null)), /* @__PURE__ */ React.createElement("a", { href: youtubeHref(item), class: "group relative flex items-center" }, /* @__PURE__ */ React.createElement("div", { class: "aspect-video w-full overflow-hidden rounded-lg border border-white/15 bg-black shadow-2xl" }, /* @__PURE__ */ React.createElement("img", { src: youtubeThumb(item), alt: item.title || "YouTube thumbnail", class: "h-full w-full object-cover transition duration-300 group-hover:scale-105", loading: "lazy", onError: (event) => {
    event.currentTarget.src = "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_youtube.svg";
  } })))));
}
function YoutubeRail(props) {
  const items = props.items || [];
  if (!items.length)
    return null;
  return /* @__PURE__ */ React.createElement("section", { class: "w-full space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-end justify-between" }, /* @__PURE__ */ React.createElement("h2", { class: "text-xl font-extrabold text-gray-900" }, props.title), props.caption ? /* @__PURE__ */ React.createElement("span", { class: "text-xs font-semibold text-gray-500" }, props.caption) : null), /* @__PURE__ */ React.createElement("div", { class: "-mx-1 flex gap-4 overflow-x-auto px-1 pb-2" }, items.map((item, idx) => /* @__PURE__ */ React.createElement(YoutubeVideoCard, { key: (item.uuid || "youtube") + "_rail_" + idx, data: item, compact: true }))));
}
function YoutubeCatalog(props) {
  const items = arrangeYoutubeItems(props.items || []);
  const spotlight = randomSpotlightItem(items);
  const spotlightKey = youtubeItemKey(spotlight);
  const gridItems = spotlightKey ? items.filter((item) => youtubeItemKey(item) !== spotlightKey) : items;
  if (!items.length) {
    return /* @__PURE__ */ React.createElement("div", { class: "flex min-h-[320px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center" }, /* @__PURE__ */ React.createElement("p", { class: "text-lg font-extrabold text-gray-900" }, "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("p", { class: "mt-2 text-sm text-gray-500" }, "\uB2E4\uB978 \uAC80\uC0C9\uC5B4\uB85C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694."));
  }
  return /* @__PURE__ */ React.createElement("div", { class: "w-full space-y-8" }, spotlight ? /* @__PURE__ */ React.createElement(YoutubeOfficialSpotlight, { item: spotlight, totalCount: props.totalCount }) : null, /* @__PURE__ */ React.createElement("section", { class: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-end justify-between gap-4" }, /* @__PURE__ */ React.createElement("h2", { class: "text-xl font-extrabold text-gray-900" }, "\uCD94\uCC9C \uC601\uC0C1"), /* @__PURE__ */ React.createElement("span", { class: "text-xs font-semibold text-gray-500" }, numberWithCommas(items.length) + "\uAC1C \uD45C\uC2DC \uC911")), /* @__PURE__ */ React.createElement("div", { class: "grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" }, gridItems.map((item, idx) => /* @__PURE__ */ React.createElement(YoutubeVideoCard, { key: (item.uuid || "youtube") + "_grid_" + idx, data: item }))), /* @__PURE__ */ React.createElement("div", { id: props.placeholderId, class: "h-1 w-full" })));
}
function Div_article_read_header(props) {
  const item = props.data || {};
  const official = isOfficialYoutube(item);
  const meta = videoMetaText(item);
  return /* @__PURE__ */ React.createElement("div", { class: "flex min-h-[300px] flex-col justify-center space-y-5" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap items-center gap-2 text-sm font-bold text-white/60" }, /* @__PURE__ */ React.createElement("a", { href: init_url, class: "hover:text-white" }, "\uC720\uD29C\uBE0C"), /* @__PURE__ */ React.createElement("span", null, "/"), /* @__PURE__ */ React.createElement("span", null, official ? "Web-R \uACF5\uC2DD" : "\uC6CC\uD06C\uC0F5")), /* @__PURE__ */ React.createElement("div", { class: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap items-center gap-2" }, official ? /* @__PURE__ */ React.createElement("span", { class: "inline-flex h-7 items-center rounded-full bg-emerald-400 px-3 text-xs font-extrabold text-gray-900" }, "Web-R \uACF5\uC2DD") : null, /* @__PURE__ */ React.createElement(Span_btn_article_new, { toggle: item.is_new }), /* @__PURE__ */ React.createElement(Span_btn_my_article, { toggle: item.check_reader })), /* @__PURE__ */ React.createElement("h1", { class: "max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-3xl" }, item.title || "\uC81C\uBAA9 \uC5C6\uC74C"), /* @__PURE__ */ React.createElement("p", { class: "max-w-3xl text-base font-medium leading-7 text-white/70" }, articleSummary(item))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap items-center gap-3 text-sm font-semibold text-white/70" }, item.user_nickname ? /* @__PURE__ */ React.createElement("span", null, item.user_nickname) : null, meta ? /* @__PURE__ */ React.createElement("span", null, meta) : null, item.cnt_comment ? /* @__PURE__ */ React.createElement("span", null, "\uB313\uAE00 " + numberWithCommas(item.cnt_comment)) : null));
}
function Div_article_read_youtube(props) {
  const item = props.data || {};
  const embedURL = youtubeEmbedUrl(item.youtube_url);
  if (!embedURL)
    return null;
  return /* @__PURE__ */ React.createElement("div", { class: "flex h-full items-center" }, /* @__PURE__ */ React.createElement("div", { class: "w-full overflow-hidden rounded-lg border border-white/15 bg-black shadow-2xl" }, /* @__PURE__ */ React.createElement("div", { class: "aspect-video w-full" }, /* @__PURE__ */ React.createElement(
    "iframe",
    {
      class: "h-full w-full",
      src: embedURL,
      title: "YouTube video player",
      frameBorder: "0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      referrerPolicy: "strict-origin-when-cross-origin",
      allowFullScreen: true
    }
  ))));
}
function Div_article_read_file(props) {
  const article = props.data || data_article;
  if (!article || !article.file_url)
    return null;
  const fileHref = article.file_url.startsWith("http") ? article.file_url : article.file_url.startsWith("/") ? article.file_url : "/" + article.file_url;
  return /* @__PURE__ */ React.createElement("section", { class: "bg-white py-8 lg:py-16 antialiased" }, /* @__PURE__ */ React.createElement("div", { class: "w-full mx-auto px-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h2", { class: "text-md lg:text-lg font-bold text-gray-900" }, "\uCCA8\uBD80\uD30C\uC77C")), /* @__PURE__ */ React.createElement("form", { class: "mb-3" }, /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-50 rounded-lg border border-gray-200" })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-center items-start w-full" }, /* @__PURE__ */ React.createElement("a", { href: fileHref, target: "_blank", class: "flex flex-row justify-end items-center text-md font-normal w-fit space-x-2 cursor-pointer hover:bg-gray-100" }, article.file_name))));
}
function Div_article_read_buttons(props) {
  const item = props.data || {};
  const btnClass = "inline-flex h-11 items-center justify-center rounded-lg text-sm font-extrabold";
  return /* @__PURE__ */ React.createElement("div", { class: "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" }, /* @__PURE__ */ React.createElement("div", { class: "space-y-4 p-5" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { class: "text-sm font-bold text-gray-500" }, "\uC601\uC0C1"), /* @__PURE__ */ React.createElement("p", { class: "mt-1 text-2xl font-extrabold text-gray-900" }, "\uBB34\uB8CC")), item.youtube_url ? /* @__PURE__ */ React.createElement("a", { href: item.youtube_url, target: "_blank", rel: "noopener noreferrer", class: btnClass + " w-full bg-emerald-500 text-white hover:bg-emerald-600" }, "YouTube\uC5D0\uC11C \uBCF4\uAE30") : null, /* @__PURE__ */ React.createElement("a", { href: init_url, class: btnClass + " w-full border border-gray-300 bg-white text-gray-900 hover:bg-gray-50" }, "\uBAA9\uB85D\uC73C\uB85C")), /* @__PURE__ */ React.createElement("div", { class: "border-t border-gray-100 p-5 text-sm" }, /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-[90px_1fr] gap-y-2 text-gray-500" }, /* @__PURE__ */ React.createElement("dt", null, "\uAC8C\uC2DC\uC790"), /* @__PURE__ */ React.createElement("dd", { class: "font-bold text-gray-900" }, item.user_nickname || "-"), /* @__PURE__ */ React.createElement("dt", null, "\uAC8C\uC2DC\uC77C"), /* @__PURE__ */ React.createElement("dd", { class: "font-bold text-gray-900" }, displayDate(item.youtube_publish_date || item.created_at) || "-"), /* @__PURE__ */ React.createElement("dt", null, "\uC870\uD68C\uC218"), /* @__PURE__ */ React.createElement("dd", { class: "font-bold text-gray-900" }, numberWithCommas(item.youtube_views || item.cnt_read || 0)))), item.check_reader !== "user" && /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 gap-2 border-t border-gray-100 p-5" }, /* @__PURE__ */ React.createElement("button", { onClick: () => location.href = init_url + "edit/" + orderID + "/", class: btnClass + " border border-green-600 text-green-700 hover:bg-green-50" }, "\uC218\uC815"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => click_btn_delete(), class: btnClass + " border border-red-600 text-red-700 hover:bg-red-50" }, "\uC0AD\uC81C")));
}
function Div_btn_comment_editor_footer_button(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: props.function,
      class: "flex flex-row justify-center items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center hover:bg-gradient-to-bl hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-cyan-300"
    },
    "\uB4F1\uB85D"
  );
}
function Div_btn_comment_editor_footer_button_loading() {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      class: "flex flex-row justify-center items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center hover:bg-gradient-to-bl hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-cyan-300 cursor-not-allowed"
    },
    /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", role: "status", class: "inline w-4 h-4 mr-2 text-white animate-spin", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z", fill: "#E5E7EB" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentColor" })),
    "\uB4F1\uB85D"
  );
}
function Div_btn_comment_footer(props) {
  return /* @__PURE__ */ React.createElement("button", { type: "button", class: "flex justify-center items-center text-sm text-gray-500 hover:underline font-medium", onClick: props.function }, props.url_image && /* @__PURE__ */ React.createElement("img", { src: props.url_image, class: "w-4 h-4 mr-2" }), props.text);
}
function Div_btn_comment_footer_loading(props) {
  return /* @__PURE__ */ React.createElement("button", { type: "button", class: "flex justify-center items-center text-sm text-gray-400 font-medium cursor-not-allowed" }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", class: "inline w-4 h-4 text-gray-200 animate-spin mr-2", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z", fill: "#E5E7EB" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentColor" })), props.text);
}
function Div_comment_button_list(props) {
  const { data, depth, loading } = props;
  const isDepth1 = depth === 1;
  const ButtonComp = loading ? Div_btn_comment_footer_loading : Div_btn_comment_footer;
  return /* @__PURE__ */ React.createElement("div", { class: "flex items-center space-x-4" }, isDepth1 && !loading && getCurrentUsername() !== "" && /* @__PURE__ */ React.createElement(
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
  return /* @__PURE__ */ React.createElement("div", { class: props.class }, /* @__PURE__ */ React.createElement("p", { class: "flex flex-row underline" }, props.title), /* @__PURE__ */ React.createElement("div", { id: "div_community_read_comment_new_" + (isNewComment ? "form" : commentId + "_form"), class: "w-full" }), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_comment_editor_footer_button_" + commentId }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-between items-center w-full space-x-2 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      name: "id_file_upload_" + commentId,
      id: "id_file_upload_" + commentId,
      accept: "*",
      class: "hidden",
      onChange: () => comment_file_action("upload", commentId)
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      class: "flex flex-row justify-center items-center py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
      onClick: () => document.getElementById("id_file_upload_" + commentId).click()
    },
    /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/file_upload.svg", class: "w-4 h-4 mr-2 md:mr-0" }),
    /* @__PURE__ */ React.createElement("p", { class: "block md:hidden" }, "\uD30C\uC77C \uCCA8\uBD80\uD558\uAE30")
  ), /* @__PURE__ */ React.createElement("p", { id: "txt_filename_" + commentId }), /* @__PURE__ */ React.createElement("p", { id: "txt_file_delete_" + commentId, class: "hidden", onClick: () => comment_file_action("delete", commentId) }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/trash.svg", class: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement("input", { id: "chk_secret_" + commentId, type: "checkbox", value: "", class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2" }), /* @__PURE__ */ React.createElement("label", { for: "chk_secret_" + commentId, class: "ms-2 text-sm font-medium text-gray-900" }, /* @__PURE__ */ React.createElement("p", null, "\uBE44\uBC00 \uB313\uAE00", /* @__PURE__ */ React.createElement("span", null, "\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAE00 \uC791\uC131\uC790, \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"))), /* @__PURE__ */ React.createElement("div", { class: "w-fit", id: "btn_comment_editor_footer_button" + (isNewComment ? "" : "_" + commentId) }, /* @__PURE__ */ React.createElement(Div_btn_comment_editor_footer_button, { uuid_comment: commentId, function: () => comment_action("submit", commentId) }))))));
}
function Div_article_read_comment(props) {
  function Div_comment_header(propsHeader) {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_user, { user_nickname: propsHeader.data.user_nickname, role: propsHeader.data.user_role }), /* @__PURE__ */ React.createElement(Span_btn_date, { date: propsHeader.data.created_at }), /* @__PURE__ */ React.createElement(Span_btn_comment_secret, { toggle: propsHeader.data.is_secret }), /* @__PURE__ */ React.createElement(Span_btn_my_comment, { toggle: propsHeader.data.check_comment_reader }));
  }
  function Div_comment(propsComment) {
    const isDepth2 = propsComment.depth === 2;
    const depthValue = isDepth2 ? 2 : 1;
    const bgColorClass = propsComment.data.user_writer == 1 ? isDepth2 ? "bg-blue-100 border border-blue-700" : "bg-blue-50" : isDepth2 ? "bg-gray-50" : "bg-white";
    const comment_depth2_list = !isDepth2 && Object.keys(propsComment.data.rereply || {}).map((key) => /* @__PURE__ */ React.createElement(Div_comment, { key: propsComment.data.rereply[key].uuid, data: propsComment.data.rereply[key], depth: 2 }));
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
    return /* @__PURE__ */ React.createElement("article", { class: "px-6 py-3 " + (isDepth2 ? "ml-4 " : "") + "text-base " + bgColorClass + " rounded-xl w-full space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center space-x-2" }, /* @__PURE__ */ React.createElement(Div_comment_header, { data: propsComment.data })), /* @__PURE__ */ React.createElement("div", { class: "text-gray-500", id: "div_comment_" + propsComment.data.uuid }), propsComment.data.file_url != null && /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-2 text-sm" }, /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", "stroke-width": "1.8", stroke: "currentColor", class: "w-4 h-4 text-gray-600" }, /* @__PURE__ */ React.createElement("path", { "stroke-linecap": "round", "stroke-linejoin": "round", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v12a2 2 0 01-2 2z" })), /* @__PURE__ */ React.createElement("a", { href: fileHref, target: "_blank", class: "hover:underline" }, propsComment.data.file_name)), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_comment_footer_" + propsComment.data.uuid }, /* @__PURE__ */ React.createElement(Div_comment_button_list, { data: propsComment.data, depth: depthValue, loading: false })), comment_depth2_list, !isDepth2 && /* @__PURE__ */ React.createElement("div", { id: "div_community_read_comment_new_" + propsComment.data.uuid, class: "hidden" }, /* @__PURE__ */ React.createElement(Div_comment_form, { title: "\uB300\uB313\uAE00 \uC4F0\uAE30", class: "mt-4 p-4 bg-white rounded-lg w-full space-y-2", uuid_comment: propsComment.data.uuid })));
  }
  const comment_list = Object.keys(props.data).map((key) => /* @__PURE__ */ React.createElement(Div_comment, { key: props.data[key].uuid, data: props.data[key], depth: 1 }));
  return /* @__PURE__ */ React.createElement("section", { class: "bg-white py-8 lg:py-16 antialiased" }, /* @__PURE__ */ React.createElement("div", { class: "w-full mx-auto px-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h2", { class: "text-lg lg:text-2xl font-bold text-gray-900" }, "\uB313\uAE00 (", props.data.length, ")")), /* @__PURE__ */ React.createElement("form", { class: "mb-6" }, /* @__PURE__ */ React.createElement("div", { class: "mb-4 w-full bg-gray-50 rounded-lg border border-gray-200" }, /* @__PURE__ */ React.createElement("div", { id: "div_comment_new", class: "w-full" }))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-end w-full space-y-0" }, comment_list), getCurrentUsername() !== "" && /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full", id: "div_community_read_comment_new" }, /* @__PURE__ */ React.createElement(Div_comment_form, { title: "\uB313\uAE00 \uC4F0\uAE30", class: "w-full space-y-2", uuid_comment: null }))));
}
function Div_article_submit_buttons(props) {
  if (props.loading) {
    return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 justify-center items-center gap-2 w-full" }, /* @__PURE__ */ React.createElement("button", { type: "button", class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300" }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", role: "status", class: "inline w-4 h-4 mr-3 text-gray-200 animate-spin", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "#1C64F2" })), "\uC644\uB8CC"), /* @__PURE__ */ React.createElement("button", { type: "button", class: "text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100" }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", role: "status", class: "inline w-4 h-4 mr-3 text-gray-200 animate-spin", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "#1C64F2" })), "\uBAA9\uB85D\uC73C\uB85C"));
  }
  return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 justify-center items-center gap-2 w-full" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => click_btn_submit(), class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300" }, "\uC644\uB8CC"), /* @__PURE__ */ React.createElement("a", { href: init_url, class: "text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100" }, "\uBAA9\uB85D\uC73C\uB85C"));
}
function Div_article_editor_main() {
  return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4 md" }, /* @__PURE__ */ React.createElement("div", { id: "div_title", class: "w-full" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
      id: "txt_title",
      name: "txt_title",
      class: "w-full h-[48px] rounded-lg resize-none scroll-hide text-start text-[14px] font-[500] border-gray-500 focus:ring-gray-700 focus:border-gray-700"
    }
  )), /* @__PURE__ */ React.createElement("div", { id: "div_checker", class: "flex flex-row justify-end items-center w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-center mb-4" }, /* @__PURE__ */ React.createElement("input", { id: "chk_secret", type: "checkbox", value: "", class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" }), /* @__PURE__ */ React.createElement("label", { for: "chk_secret", class: "ms-2 text-sm font-medium text-gray-900" }, "\uBE44\uBC00\uAE00\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"))), /* @__PURE__ */ React.createElement("div", { id: "div_editor", class: "w-full" }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      class: "flex flex-row justify-center items-center py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
      onClick: () => document.getElementById("id_file_upload").click()
    },
    /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/file_upload.svg", class: "w-4 h-4 mr-2" }),
    "\uD30C\uC77C \uCCA8\uBD80\uD558\uAE30"
  ), /* @__PURE__ */ React.createElement("p", { id: "txt_filename" }), /* @__PURE__ */ React.createElement("p", { id: "txt_file_delete", class: "hidden", onClick: () => click_delete_file() }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/trash.svg", class: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_button_list" }, /* @__PURE__ */ React.createElement(Div_article_submit_buttons, { loading: false })));
}
function Div_status_loading(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4 md" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", class: "w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentFill" })), /* @__PURE__ */ React.createElement("p", null, props.text)));
}
function Div_status_stop(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/stop.svg", class: "size-16" }), /* @__PURE__ */ React.createElement("p", null, props.text), /* @__PURE__ */ React.createElement("a", { href: init_url, class: "text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100" }, "\uBAA9\uB85D\uC73C\uB85C")));
}
function YouTubeListPage(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "w-full bg-white" }, /* @__PURE__ */ React.createElement("div", { class: "mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 py-8 md:px-6" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(Div_page_header, { title: header_title, subtitle: header_subtitle }), props.showWriteButton && /* @__PURE__ */ React.createElement("div", { class: "flex justify-end" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => location.href = init_url + "write/", class: "h-10 rounded-lg bg-gray-900 px-5 text-sm font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200" }, "\uAE00\uC4F0\uAE30"))), /* @__PURE__ */ React.createElement(YoutubeSearchBar, null), /* @__PURE__ */ React.createElement("div", { id: "div_community_list", class: "w-full" }, /* @__PURE__ */ React.createElement("div", { id: "div_article_list", class: "w-full" }, /* @__PURE__ */ React.createElement(Div_article_list_skeleton, null)))));
}
function YouTubeReadPage() {
  return /* @__PURE__ */ React.createElement("div", { class: "w-full bg-white" }, /* @__PURE__ */ React.createElement("section", { class: "bg-gray-950" }, /* @__PURE__ */ React.createElement("div", { class: "mx-auto grid w-full max-w-screen-xl gap-8 px-6 py-10 lg:grid-cols-[1.05fr_.95fr] lg:px-8" }, /* @__PURE__ */ React.createElement("div", { id: "div_community_read_header" }, /* @__PURE__ */ React.createElement("div", { class: "min-h-[300px] space-y-4 py-10 animate-pulse" }, /* @__PURE__ */ React.createElement("div", { class: "h-4 w-40 rounded-full bg-white/20" }), /* @__PURE__ */ React.createElement("div", { class: "h-10 w-4/5 rounded bg-white/20" }), /* @__PURE__ */ React.createElement("div", { class: "h-4 w-3/4 rounded bg-white/10" }), /* @__PURE__ */ React.createElement("div", { class: "h-4 w-2/3 rounded bg-white/10" }))), /* @__PURE__ */ React.createElement("div", { id: "div_community_read_youtube" }, /* @__PURE__ */ React.createElement("div", { class: "aspect-video w-full rounded-lg bg-gray-200 animate-pulse" })))), /* @__PURE__ */ React.createElement("div", { class: "border-b border-gray-200 bg-white" }, /* @__PURE__ */ React.createElement("div", { class: "mx-auto flex w-full max-w-screen-xl gap-8 px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("span", { class: "border-b-2 border-gray-900 py-4 text-sm font-extrabold text-gray-900" }, "\uC601\uC0C1 \uC18C\uAC1C"), /* @__PURE__ */ React.createElement("a", { href: init_url, class: "py-4 text-sm font-bold text-gray-500 hover:text-gray-900" }, "\uBAA9\uB85D"))), /* @__PURE__ */ React.createElement("div", { class: "mx-auto grid w-full max-w-screen-xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8" }, /* @__PURE__ */ React.createElement("main", { class: "min-w-0 space-y-8" }, /* @__PURE__ */ React.createElement("section", { class: "space-y-5" }, /* @__PURE__ */ React.createElement("h2", { class: "text-2xl font-extrabold text-gray-900" }, "\uC601\uC0C1 \uAC1C\uC694"), /* @__PURE__ */ React.createElement("div", { class: "rounded-lg border border-gray-200 bg-white p-6" }, /* @__PURE__ */ React.createElement("div", { id: "div_community_read_content", class: "w-full" }, /* @__PURE__ */ React.createElement("div", { class: "h-48 w-full rounded bg-gray-200 animate-pulse" })))), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_file" }, /* @__PURE__ */ React.createElement("div", { class: "h-12 w-full rounded bg-gray-200 animate-pulse" })), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_comment" }, /* @__PURE__ */ React.createElement("div", { class: "h-24 w-full rounded bg-gray-200 animate-pulse" }))), /* @__PURE__ */ React.createElement("aside", { class: "space-y-4 lg:sticky lg:top-6 lg:self-start" }, /* @__PURE__ */ React.createElement("div", { id: "div_article_read_buttons", class: "w-full" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_article_famous_list", title: "\uCD5C\uADFC \uC778\uAE30 \uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_new_comment_list", title: "\uCD5C\uADFC \uB313\uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_my_article_list", title: "\uB0B4\uAC00 \uC4F4 \uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_my_comment_list", title: "\uB0B4\uAC00 \uC4F4 \uB313\uAE00" }))));
}
function renderArticleSubmitButtons(loading = false) {
  const target = document.getElementById("div_button_list");
  if (!target)
    return;
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_submit_buttons, { loading }), target);
}
async function get_article_famous_list() {
  const target = document.getElementById("div_article_famous_list");
  if (!target)
    return;
  const request_data = new FormData();
  request_data.append("tag", url);
  const data = await postForm(ENDPOINTS.articleFamous, request_data);
  ReactDOM.render(
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uCD5C\uC2E0 \uC778\uAE30 \uAE00" }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start w-full space-y-2" }, Object.values(data || {}).map((article) => /* @__PURE__ */ React.createElement(Div_new_article_list, { key: article.id || article.uuid, data: article })))),
    target
  );
}
async function get_new_comment_list() {
  const target = document.getElementById("div_new_comment_list");
  if (!target)
    return;
  const request_data = new FormData();
  request_data.append("tag", url);
  const data = await postForm(ENDPOINTS.newComment, request_data);
  ReactDOM.render(
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uCD5C\uC2E0 \uB313\uAE00" }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start w-full space-y-2" }, Object.values(data || {}).map((comment) => /* @__PURE__ */ React.createElement(Div_new_comment, { key: comment.id || comment.uuid, data: comment })))),
    target
  );
}
async function get_my_article_list() {
  const target = document.getElementById("div_my_article_list");
  if (!target)
    return;
  if (!getCurrentUsername()) {
    ReactDOM.render(
      /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uB0B4\uAC00 \uC4F4 \uAE00" }), /* @__PURE__ */ React.createElement("span", null, "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.")),
      target
    );
    return;
  }
  const request_data = new FormData();
  request_data.append("tag", url);
  const data = await postForm(ENDPOINTS.myArticle, request_data);
  ReactDOM.render(
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uB0B4\uAC00 \uC4F4 \uAE00" }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start w-full space-y-2" }, Object.values(data || {}).map((article) => /* @__PURE__ */ React.createElement(Div_new_article_list, { key: article.id || article.uuid, data: article })))),
    target
  );
}
async function get_my_comment_list() {
  const target = document.getElementById("div_my_comment_list");
  if (!target)
    return;
  if (!getCurrentUsername()) {
    ReactDOM.render(
      /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uB0B4\uAC00 \uC4F4 \uB313\uAE00" }), /* @__PURE__ */ React.createElement("span", null, "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.")),
      target
    );
    return;
  }
  const request_data = new FormData();
  request_data.append("tag", url);
  const data = await postForm(ENDPOINTS.myComment, request_data);
  ReactDOM.render(
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uB0B4\uAC00 \uC4F4 \uB313\uAE00" }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start w-full space-y-2" }, Object.values(data || {}).map((comment) => /* @__PURE__ */ React.createElement(Div_new_comment, { key: comment.id || comment.uuid, data: comment })))),
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
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_list_skeleton, null), document.getElementById("div_article_list"));
  } else {
    page_num += 1;
    const nextTarget = document.getElementById("div_article_list_" + page_num);
    if (nextTarget) {
      ReactDOM.render(
        /* @__PURE__ */ React.createElement("div", { class: "py-6" }, /* @__PURE__ */ React.createElement(Div_article_list_skeleton, null)),
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
  ReactDOM.render(/* @__PURE__ */ React.createElement(YoutubeCatalog, { items: youtubeLoadedItems, totalCount: article_counter, placeholderId }), document.getElementById("div_article_list"));
  toggle_page = false;
}
function render_article() {
  if (!data_article)
    return;
  const headerTarget = document.getElementById("div_community_read_header");
  const youtubeTarget = document.getElementById("div_community_read_youtube");
  const buttonTarget = document.getElementById("div_article_read_buttons");
  const fileTarget = document.getElementById("div_community_read_file");
  const contentTarget = document.querySelector("#div_community_read_content");
  if (headerTarget) {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_header, { data: data_article }), headerTarget);
  }
  if (youtubeTarget) {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_youtube, { data: data_article }), youtubeTarget);
  }
  if (buttonTarget) {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_buttons, { data: data_article }), buttonTarget);
  }
  if (fileTarget) {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_file, { data: data_article }), fileTarget);
  }
  if (contentTarget && window.WebRSolidEdit) {
    WebRSolidEdit.renderContent(contentTarget, data_article.content || "");
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
  if (!commentContainer)
    return;
  const allComments = Object.values(data_comment || {}).filter((item) => !!item);
  const upperComments = allComments.filter((item) => !item.uuid_upper);
  const treeComments = upperComments.map((comment) => ({
    ...comment,
    rereply: allComments.filter((item) => item.uuid_upper === comment.uuid)
  }));
  data_comment_upper = treeComments;
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(
      Div_article_read_comment,
      {
        data: treeComments,
        uuid_article: data_article ? data_article.uuid : null,
        is_secret: data_article ? data_article.is_secret : 0,
        check_reader: data_article ? data_article.check_reader : "guest"
      }
    ),
    commentContainer
  );
  if (!window.WebRSolidEdit) {
    return;
  }
  allComments.forEach((comment) => {
    const viewerTarget = document.querySelector("#div_comment_" + comment.uuid);
    if (!viewerTarget)
      return;
    WebRSolidEdit.renderContent(viewerTarget, comment.content || "");
  });
  commentEditors = {};
  commentFiles = Array.isArray(commentFiles) ? commentFiles : [];
const editorConfig = {
    previewStyle: "vertical",
    height: "250px",
    initialEditType: "wysiwyg",
    hooks: {
      addImageBlobHook: async (blob, callback) => {
        try {
          const compressedBase64 = await compressImage(blob);
          callback(compressedBase64, blob.name);
        } catch (error) {
          alert("\uC774\uBBF8\uC9C0 \uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
        }
      }
    }
  };
  const newFormEl = document.querySelector("#div_community_read_comment_new_form");
  if (newFormEl && getCurrentUsername() !== "") {
    commentEditors["new"] = WebRSolidEdit.mountEditor(newFormEl, { height: "250px", placeholder: "내용을 입력해주세요." });
    commentEditors["new"].setHTML("");
  }
  data_comment_upper.forEach((comment) => {
    const replyEl = document.querySelector("#div_community_read_comment_new_" + comment.uuid + "_form");
    if (!replyEl)
      return;
    commentEditors[comment.uuid] = WebRSolidEdit.mountEditor(replyEl, { height: "250px", placeholder: "내용을 입력해주세요." });
    commentEditors[comment.uuid].setHTML("");
  });
}
function click_btn_reply_comment(uuid_comment) {
  data_comment_upper.forEach((comment) => {
    const el = document.getElementById("div_community_read_comment_new_" + comment.uuid);
    if (!el)
      return;
    if (comment.uuid === uuid_comment) {
      el.className = "mt-4 p-4 bg-white rounded-lg w-full space-y-2";
    } else {
      el.className = "hidden";
    }
  });
}
async function click_btn_edit_comment(uuid_comment) {
  function Div_comment_editor_form(props) {
    return /* @__PURE__ */ React.createElement("div", { class: "w-full" }, /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_comment_editor_main_" + props.uuid_comment }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center w-full space-x-2 mt-2" }, /* @__PURE__ */ React.createElement("input", { id: "chk_secret_" + props.uuid_comment, type: "checkbox", value: "", class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2" }), /* @__PURE__ */ React.createElement("label", { for: "chk_secret_" + props.uuid_comment, class: "ms-2 text-sm font-medium text-gray-900" }, "\uBE44\uBC00 \uB313\uAE00\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAE00 \uC791\uC131\uC790, \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"), /* @__PURE__ */ React.createElement("div", { class: "w-fit", id: "btn_comment_editor_footer_button_" + props.uuid_comment }, /* @__PURE__ */ React.createElement(Div_btn_comment_editor_footer_button, { uuid_comment: props.uuid_comment, function: () => comment_action("edit", props.uuid_comment) }))));
  }
  const targetComment = Object.values(data_comment || {}).find((item) => item.uuid === uuid_comment);
  const targetEl = document.getElementById("div_comment_" + uuid_comment);
  if (!targetComment || !targetEl || !window.WebRSolidEdit) {
    return;
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_comment_editor_form, { uuid_comment }), targetEl);
commentEditors[uuid_comment] = WebRSolidEdit.mountEditor(document.querySelector("#div_comment_editor_main_" + uuid_comment), { height: "250px", placeholder: "내용을 입력해주세요." });
  commentEditors[uuid_comment].setHTML(targetComment.content || "");
  const secretEl = document.getElementById("chk_secret_" + uuid_comment);
  if (secretEl) {
    secretEl.checked = normalizeBool(targetComment.is_secret);
  }
}
async function comment_action(action, uuid_comment) {
  const isNew = uuid_comment === "new";
  if (action === "delete") {
    if (!confirm("\uC815\uB9D0\uB85C \uC0AD\uC81C\uD560\uAE4C\uC694?"))
      return;
    const isUpper = data_comment_upper.some((item) => item.uuid === uuid_comment);
    const target = Object.values(data_comment || {}).find((item) => item.uuid === uuid_comment);
    const footerTarget = document.getElementById("div_comment_footer_" + uuid_comment);
    if (footerTarget) {
      ReactDOM.render(
        /* @__PURE__ */ React.createElement(Div_comment_button_list, { data: target || { active: 1, check_comment_reader: "" }, depth: isUpper ? 1 : 2, loading: true }),
        footerTarget
      );
    }
    const request_data2 = new FormData();
    request_data2.append("uuid", uuid_comment);
    await postForm(ENDPOINTS.commentDelete, request_data2, { parseJson: false });
    await get_read_article_comment(orderID);
    return;
  }
  const editorKey = isNew ? "new" : uuid_comment;
  const currentEditor = commentEditors[editorKey];
  if (!currentEditor) {
    alert("\uC5D0\uB514\uD130\uAC00 \uCD08\uAE30\uD654\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
    return;
  }
  const txt_content = currentEditor.getHTML();
  const secretId = isNew ? "chk_secret_new" : "chk_secret_" + uuid_comment;
  const secretEl = document.getElementById(secretId);
  const chk_secret = secretEl ? secretEl.checked : false;
  if (txt_content == null || txt_content === "" || txt_content === "<p><br></p>") {
    alert("\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
    return;
  }
  const btnId = isNew ? "btn_comment_editor_footer_button" : "btn_comment_editor_footer_button_" + uuid_comment;
  const btnEl = document.getElementById(btnId);
  if (btnEl) {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_btn_comment_editor_footer_button_loading, null), btnEl);
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
    if (inputEl)
      inputEl.value = "";
    if (nameEl)
      nameEl.innerHTML = "";
    if (deleteEl)
      deleteEl.className = "hidden";
    return;
  }
  if (action === "upload") {
    const inputEl = document.getElementById("id_file_upload_" + uuid_comment);
    if (!inputEl || !inputEl.files || !inputEl.files[0])
      return;
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
      timeout: 6e5,
      success: function(filedata) {
        filedata["uuid_comment"] = uuid_comment;
        const existingIndex = commentFiles.findIndex((item) => item.uuid_comment === uuid_comment);
        if (existingIndex !== -1) {
          commentFiles[existingIndex] = filedata;
        } else {
          commentFiles.push(filedata);
        }
        const nameEl = document.getElementById("txt_filename_" + uuid_comment);
        const deleteEl = document.getElementById("txt_file_delete_" + uuid_comment);
        if (nameEl)
          nameEl.innerHTML = filedata.origin_file_name || filedata.file_name || "";
        if (deleteEl)
          deleteEl.className = class_txt_file_delete;
      },
      error: function(error) {
        console.error("comment file upload error", error);
      }
    });
  }
}
function check_file_upload() {
  const inputEl = document.getElementById("id_file_upload");
  if (!inputEl || !inputEl.files || !inputEl.files[0])
    return;
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
    timeout: 6e5,
    success: function(filedata) {
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
    error: function(error) {
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
  if (inputEl)
    inputEl.value = "";
  if (nameEl)
    nameEl.innerHTML = "";
  if (deleteEl)
    deleteEl.className = "hidden";
}
function initArticleEditor(initialHTML) {
  if (!window.WebRSolidEdit) {
    return;
  }
articleEditor = WebRSolidEdit.mountEditor(document.querySelector("#div_editor"), { height: "500px", placeholder: "내용을 입력해주세요." });
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
  if (toggle_click_submit)
    return;
  const titleInput = document.getElementById("txt_title");
  const secretEl = document.getElementById("chk_secret");
  const txt_title = titleInput ? titleInput.value.trim() : "";
  const txt_content = articleEditor ? articleEditor.getHTML() : "";
  const chk_secret = secretEl ? secretEl.checked : false;
  toggle_click_submit = true;
  renderArticleSubmitButtons(true);
  try {
    if (!txt_title) {
      alert("\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      return;
    }
    if (!txt_content || txt_content === "<p><br></p>") {
      alert("\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
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
  if (!confirm("\uC815\uB9D0\uB85C \uC0AD\uC81C\uD560\uAE4C\uC694?"))
    return;
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
  youtubeListCanWrite = !!menuData.username && (normalizedRole === "admin" || normalizedRole === "\uAD00\uB9AC\uC790");
  ReactDOM.render(/* @__PURE__ */ React.createElement(YouTubeListPage, { showWriteButton: youtubeListCanWrite }), document.getElementById("div_main"));
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
  ReactDOM.render(/* @__PURE__ */ React.createElement(YouTubeReadPage, null), document.getElementById("div_main"));
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
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_editor_main, null), document.getElementById("div_main"));
  renderArticleSubmitButtons(false);
  initArticleEditor("");
}
async function renderWorkshopEditPage() {
  clearInfiniteScroll();
  if (!getCurrentUsername()) {
    location.href = init_url;
    return;
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_status_loading, { text: "\uC791\uC131\uC790 \uC5EC\uBD80\uB97C \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4." }), document.getElementById("div_main"));
  const request_data = new FormData();
  request_data.append("orderID", orderID);
  currentEditArticle = await postForm(ENDPOINTS.read, request_data);
  if (currentEditArticle.check_reader === "user") {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_status_stop, { text: "\uC791\uC131\uC790\uB9CC \uAE00\uC744 \uC218\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }), document.getElementById("div_main"));
    return;
  }
  articleEditorMode = "edit";
  uploadedArticleFile = null;
  toggle_click_submit = false;
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_editor_main, null), document.getElementById("div_main"));
  renderArticleSubmitButtons(false);
  initArticleEditor(currentEditArticle.content || "");
  const titleInput = document.getElementById("txt_title");
  const secretEl = document.getElementById("chk_secret");
  const fileNameEl = document.getElementById("txt_filename");
  const fileDeleteEl = document.getElementById("txt_file_delete");
  if (titleInput)
    titleInput.value = currentEditArticle.title || "";
  if (secretEl)
    secretEl.checked = normalizeBool(currentEditArticle.is_secret);
  if (currentEditArticle.file_name) {
    if (fileNameEl)
      fileNameEl.innerHTML = currentEditArticle.file_name;
    if (fileDeleteEl)
      fileDeleteEl.className = class_txt_file_delete;
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
