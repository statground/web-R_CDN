/*
 * Web-R index first-screen bundle
 * Merged from the uploaded JS files on 2026-04-19.
 * Only the functions actually used by the current first screen were kept.
 * Omitted as unused on this screen:
 * - Div_page_header
 * - Span_btn_category
 * - Span_btn_comment_secret
 * - Span_btn_my_comment
 * - Span_btn_book
 */

let class_span_btn_default = "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl";

// 사용자 역할에 따른 버튼 렌더링
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
            <img
                src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg"
                class="w-3 h-3 mr-1"
            />
            {props.user_nickname}
        </span>
    );
}

// 날짜 버튼 렌더링
function Span_btn_date(props) {
    return (
        <span class={`${class_span_btn_default} text-xs bg-blue-100 text-blue-800`}>
            <img
                src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_${Number(
                    props.date.split("-")[2].substr(0, 2)
                )}.svg`}
                class="w-3 h-3 mr-1"
            />
            {props.date}
        </span>
    );
}

// 조회수 버튼 렌더링 (0보다 클 때만)
function Span_btn_article_read(props) {
    return props.cnt_read > 0 && (
        <span class={`${class_span_btn_default} text-xs bg-gray-100 text-blue-800`}>
            <img
                src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/eye.svg"
                class="w-3 h-3 mr-1"
            />
            {props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
        </span>
    );
}

// 댓글 수 버튼 렌더링 (0보다 클 때만)
function Span_btn_article_comment(props) {
    return props.cnt_comment > 0 && (
        <span class={`${class_span_btn_default} text-xs bg-purple-100 text-blue-800`}>
            <img
                src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment.svg"
                class="w-3 h-3 mr-1"
            />
            {props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
        </span>
    );
}

// 새 글 표시 (toggle이 1일 때만)
function Span_btn_article_new(props) {
    return props.toggle === 1 && (
        <span class={`${class_span_btn_default} text-[10px] bg-red-500 text-white animate-pulse`}>
            NEW
        </span>
    );
}

// 비밀글 표시 (toggle이 1일 때만)
function Span_btn_article_secret(props) {
    return props.toggle === 1 && (
        <span class={`${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse`}>
            SECRET
        </span>
    );
}

// 내 글 표시 (toggle이 "writer"일 때만)
function Span_btn_my_article(props) {
    return props.toggle === "writer" && (
        <span class={`${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse`}>
            MY
        </span>
    );
}

function Div_main_header() {
    return (
        <div class="flex flex-col justify-center items-center text-center w-full">
            <h1 class="mb-4 text-5xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl">
                웹에서 하는 <mark class="px-2 text-white bg-blue-600 rounded">R</mark> 통계
            </h1>
            <p class="text-lg font-normal text-gray-500 lg:text-xl">
                "웹에서 하는 R통계"는, 통계에는 관심이 있으나 R을 어려워하는 여러 연구자들을 위한 프로젝트입니다.
                <br />
                R설치없이 클릭만으로 웹에 있는 서버를 이용하여 통계분석을 하고 보다 R을 쉽게 사용하기 위한 패키지 및 앱 공동개발을 목표로 하고 있습니다.
            </p>
        </div>
    );
}

function Div_main_statistics_skeleton() {
    function Div_Sub(props) {
        return (
            <div
                class="flex items-center w-full w-max-md p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow"
                role="alert"
            >
                <img src={props.svg} class="w-6 h-6" />
                <div class="pl-4 text-sm font-normal animate-pulse">
                    <div class="h-2.5 bg-gray-300 rounded-full w-full mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div class="grid lg:grid-cols-3 md:grid-cols-1 mx-auto">
            <Div_Sub svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/member.svg" />
            <br />
            <Div_Sub svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/visitors.svg" />
            <br />
            <Div_Sub svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/pageview.svg" />
        </div>
    );
}

function Div_main_board_skeleton() {
    function Div_table_skeleton({ title, id, rows = 5 }) {
        const Row = () => (
            <tr class="bg-white border-b">
                <td class="px-6 py-4">
                    <div class="h-2.5 bg-gray-300 rounded-full w-3/4 mb-2.5 animate-pulse"></div>
                    <div class="h-2 bg-gray-200 rounded-full w-1/3 animate-pulse"></div>
                </td>
            </tr>
        );

        return (
            <div class="w-full" id={id}>
                <h5 class="mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900">{title}</h5>
                <div class="rounded-lg border bg-white">
                    <table class="w-full text-sm text-left text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th class="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>{Array.from({ length: rows }).map((_, i) => <Row key={i} />)}</tbody>
                    </table>
                </div>
            </div>
        );
    }

    function Div_card({ title, id, children }) {
        return (
            <div class="w-full rounded-lg border bg-white p-4" id={id}>
                <h6 class="mb-3 text-base font-semibold text-gray-900">{title}</h6>
                {children}
            </div>
        );
    }

    const Bullet = () => (
        <div class="flex items-center gap-3 py-2">
            <div class="h-2.5 w-2.5 rounded-full bg-gray-300 animate-pulse"></div>
            <div class="h-2.5 bg-gray-300 rounded-full w-3/4 animate-pulse"></div>
        </div>
    );

    return (
        <div class="flex flex-row pt-12 pb-12 justify-center" id="div_board">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-4 gap-6 md:grid-cols-1">
                    <div class="col-span-3 flex flex-col gap-6">
                        <Div_table_skeleton title={"커뮤니티"} id={"div_main_board_free"} rows={6} />
                        <Div_table_skeleton title={"최근 활동"} id={"div_main_new_members"} rows={6} />
                    </div>

                    <div class="col-span-1 flex flex-col gap-6">
                        <Div_card title={"공지사항"} id={"div_main_board_notice"}>
                            <Bullet />
                            <Bullet />
                            <Bullet />
                        </Div_card>

                        <Div_card title={"유튜브"} id={"div_main_youtube"}>
                            <div class="w-full aspect-video rounded-md bg-gray-300 animate-pulse"></div>
                        </Div_card>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function get_div_main_statistics() {
    function Div_sub(props) {
        return (
            <div
                id="toast-simple"
                class="flex items-center w-full w-max-md p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow"
                role="alert"
            >
                <img src={props.svg} class="w-6 h-6" />
                <div class="pl-4 text-sm font-normal">
                    <div class="pl-4 text-md font-bold">{props.title}</div>
                    <div class="pl-4 text-sm font-normal">
                        {props.content.toLocaleString()}
                        {props.unit}
                    </div>
                </div>
            </div>
        );
    }

    function Div_result(props) {
        return (
            <div class="grid lg:grid-cols-3 md:grid-cols-1 mx-auto">
                <Div_sub
                    title="총 가입자 수"
                    content={props.data.cnt_member}
                    unit="명"
                    svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/member.svg"
                />
                <br />
                <Div_sub
                    title="오늘의 방문자 수"
                    content={props.data.cnt_visitor}
                    unit="명"
                    svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/visitors.svg"
                />
                <br />
                <Div_sub
                    title="오늘의 페이지 뷰"
                    content={props.data.cnt_pageview}
                    unit="건"
                    svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/pageview.svg"
                />
            </div>
        );
    }

    const data = await fetch("/ajax_index_statistics/")
        .then((res) => res.json())
        .then((res) => res);

    ReactDOM.render(<Div_result data={data} />, document.getElementById("div_main_statistics"));
}

function get_book_list() {
    var API_URL = "/book/ajax_get_book_list/";
    var MOUNT_ID = "div_book_list";

    var ICONS = {
        kyobo: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/kyobobook2.png",
        yes24: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/yes24.png",
        ypbooks: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/ypbooks.png",
        coupang: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/coupang.png",
        leanpub: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/LeanPub.png",
        bookdown: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/bookdown.png",
        board: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_free.svg",
        default_vendor: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/icon_default.png",
        default_cover: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/default_book.png",
    };

    function iconForSource(source) {
        var s = (source || "").toLowerCase();
        if (s.indexOf("교보") > -1 || s.indexOf("kyobo") > -1) return ICONS.kyobo;
        if (s.indexOf("yes24") > -1) return ICONS.yes24;
        if (s.indexOf("영풍") > -1 || s.indexOf("ypbooks") > -1) return ICONS.ypbooks;
        if (s.indexOf("쿠팡") > -1 || s.indexOf("coupang") > -1) return ICONS.coupang;
        if (s.indexOf("leanpub") > -1) return ICONS.leanpub;
        if (s.indexOf("bookdown") > -1) return ICONS.bookdown;
        return ICONS.default_vendor;
    }

    function pad3(v) {
        return (v == null ? "000" : String(v)).padStart(3, "0");
    }

    function normalizeRows(raw) {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw.data)) return raw.data;
        if (Array.isArray(raw.results)) return raw.results;
        if (Array.isArray(raw.rows)) return raw.rows;

        var arr = Object.keys(raw).map(function (k) {
            return raw[k];
        });
        var nestedArr = arr.find(Array.isArray);
        return Array.isArray(nestedArr) ? nestedArr : arr;
    }

    var cls = {
        wrap: "w-full pt-4",
        navWrap: "relative",
        navBtnBase:
            "absolute z-10 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black text-white shadow",
        navBtnL: "left-2",
        navBtnR: "right-2",
        slider: "flex gap-3 overflow-x-scroll scroll-smooth pb-2 scrollbar-hide",
        card: "flex flex-col justify-start w-64 min-w-64 h-48 p-3 rounded-xl shadow bg-white border hover:border-gray-900",
        img: "w-full object-contain rounded-md border bg-white",
        title: "font-semibold leading-snug text-center",
        meta: "text-xs text-gray-500 text-center",
        vendors: "w-full justify-center gap-2 flex-wrap items-center",
    };

    function groupRows(raw) {
        var rows = normalizeRows(raw);
        var byBook = new Map();

        rows.forEach(function (r) {
            if (!r) return;

            var key = r.uuid || r.title || ("rnd-" + Math.random().toString(16).slice(2));

            if (!byBook.has(key)) {
                byBook.set(key, {
                    uuid: r.uuid,
                    uuid_board_category: r.uuid_board_category,
                    title: r.title,
                    publisher: r.publisher,
                    published_at: r.published_at,
                    url_image: r.url_image,
                    randnum: r.randnum == null ? Math.random() : r.randnum,
                    sources: {},
                });
            }

            var vendorName = r.marketplace != null && r.marketplace !== "" ? r.marketplace : r.source;
            if (vendorName && r.url) {
                var s = String(vendorName).trim();
                if (!byBook.get(key).sources[s]) byBook.get(key).sources[s] = [];
                byBook.get(key).sources[s].push(r.url);
            }
        });

        return Array.from(byBook.values())
            .map(function (b) {
                var vendors = Object.entries(b.sources).map(function (_ref) {
                    var source = _ref[0],
                        urls = _ref[1];
                    return { source: source, url: urls[Math.floor(Math.random() * urls.length)] };
                });
                return Object.assign({}, b, { vendors: vendors });
            })
            .sort(function (a, b) {
                return (a.randnum || 0) - (b.randnum || 0);
            });
    }

    function ChevronLeftSVG() {
        return React.createElement(
            "svg",
            { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": "true" },
            React.createElement("path", {
                d: "M15 6l-6 6 6 6",
                fill: "none",
                stroke: "white",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
            })
        );
    }

    function ChevronRightSVG() {
        return React.createElement(
            "svg",
            { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": "true" },
            React.createElement("path", {
                d: "M9 6l6 6-6 6",
                fill: "none",
                stroke: "white",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
            })
        );
    }

    function CardComp(props) {
        var b = props.b,
            idx = props.idx,
            activeIdx = props.activeIdx,
            setActiveIdx = props.setActiveIdx;

        var GAP_PX = 8,
            MIN_IMG = 60;
        var hasVendors = Array.isArray(b.vendors) && b.vendors.length > 0;
        var isOpen = activeIdx === idx && hasVendors;

        var cardRef = React.useRef(null);
        var titleRef = React.useRef(null);
        var metaRef = React.useRef(null);
        var vendorsRef = React.useRef(null);
        var _React$useState = React.useState(100),
            imgH = _React$useState[0],
            setImgH = _React$useState[1];

        function recalc() {
            if (!cardRef.current) return;

            var innerH = cardRef.current.clientHeight - 24;
            var titleH = titleRef.current ? titleRef.current.offsetHeight : 0;
            var metaH = metaRef.current ? metaRef.current.offsetHeight : 0;
            var vH = 0;

            if (isOpen && vendorsRef.current) {
                var prev = vendorsRef.current.style.display;
                vendorsRef.current.style.display = "flex";
                vH = vendorsRef.current.offsetHeight || 0;
                vendorsRef.current.style.display = prev;
            }

            var gaps = 2 + (isOpen ? 1 : 0);
            var leftover = innerH - (titleH + metaH + vH + gaps * GAP_PX);
            setImgH(Math.max(MIN_IMG, leftover - (isOpen ? 10 : 0)));
        }

        React.useLayoutEffect(recalc, [isOpen]);

        React.useEffect(function () {
            function onResize() {
                recalc();
            }

            window.addEventListener("resize", onResize);
            var t = setTimeout(recalc, 0);

            return function () {
                window.removeEventListener("resize", onResize);
                clearTimeout(t);
            };
        }, []);

        function onToggle() {
            setActiveIdx(function (p) {
                return p === idx ? null : idx;
            });
        }

        function onKey(e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle();
            }
        }

        function goBoard(e) {
            e.stopPropagation();
            window.open("/book/?sub=" + pad3(b.uuid_board_category), "_self");
        }

        return React.createElement(
            "div",
            { ref: cardRef, className: cls.card, role: "button", tabIndex: 0, onClick: onToggle, onKeyDown: onKey },
            React.createElement("img", {
                className: cls.img,
                style: { height: imgH + "px" },
                src: b.url_image || ICONS.default_cover,
                alt: b.title || "book",
                loading: "lazy",
            }),
            React.createElement("div", { style: { height: GAP_PX + "px" } }),
            React.createElement("div", { ref: titleRef, className: cls.title }, b.title || ""),
            React.createElement("div", { style: { height: GAP_PX + "px" } }),
            React.createElement(
                "div",
                { ref: metaRef, className: cls.meta },
                b.publisher ? b.publisher : " ",
                b.published_at ? " · " + b.published_at : ""
            ),
            isOpen ? React.createElement("div", { style: { height: GAP_PX + "px" } }) : null,
            React.createElement(
                "div",
                {
                    ref: vendorsRef,
                    className: "purchase-buttons " + cls.vendors,
                    style: { display: isOpen ? "flex" : "none" },
                    onClick: function (e) {
                        e.stopPropagation();
                    },
                },
                (b.vendors || []).map(function (v, i) {
                    return React.createElement(
                        "a",
                        { key: i, href: v.url, target: "_blank", rel: "noopener", title: v.source },
                        React.createElement("img", {
                            className: "h-6 w-auto",
                            src: iconForSource(v.source),
                            alt: v.source,
                            loading: "lazy",
                        })
                    );
                }),
                React.createElement(
                    "button",
                    { onClick: goBoard, title: "게시판", type: "button" },
                    React.createElement("img", {
                        className: "h-6 w-auto",
                        src: ICONS.board,
                        alt: "게시판",
                        loading: "lazy",
                    })
                )
            )
        );
    }

    function DivBookList() {
        var _React$useState2 = React.useState([]),
            books = _React$useState2[0],
            setBooks = _React$useState2[1];
        var _React$useState3 = React.useState(null),
            activeIdx = _React$useState3[0],
            setActiveIdx = _React$useState3[1];

        React.useEffect(function () {
            fetch(API_URL)
                .then(function (r) {
                    if (!r.ok) throw new Error("HTTP " + r.status);
                    return r.json();
                })
                .then(function (raw) {
                    var grouped = groupRows(raw);
                    setBooks(grouped);
                })
                .catch(function (err) {
                    console.warn("book list fetch error:", err);
                    setBooks([]);
                });
        }, []);

        React.useEffect(
            function () {
                var slider = document.getElementById("div_book_list_slider");
                if (!slider) return;

                function scrollByPage(d) {
                    slider.scrollBy({ left: d * slider.offsetWidth, behavior: "smooth" });
                }

                var n = document.getElementById("div_book_list_next");
                var p = document.getElementById("div_book_list_prev");

                function next() {
                    scrollByPage(+1);
                }

                function prev() {
                    scrollByPage(-1);
                }

                n && n.addEventListener("click", next);
                p && p.addEventListener("click", prev);

                function wheel(e) {
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                        slider.scrollBy({ left: e.deltaY });
                        e.preventDefault();
                    }
                }

                slider.addEventListener("wheel", wheel, { passive: false });

                return function () {
                    n && n.removeEventListener("click", next);
                    p && p.removeEventListener("click", prev);
                    slider.removeEventListener("wheel", wheel);
                };
            },
            [books.length]
        );

        return React.createElement(
            "div",
            { className: cls.wrap },
            React.createElement(
                "div",
                { className: cls.navWrap },
                React.createElement(
                    "button",
                    { id: "div_book_list_prev", className: cls.navBtnBase + " " + cls.navBtnL },
                    React.createElement(ChevronLeftSVG)
                ),
                React.createElement(
                    "button",
                    { id: "div_book_list_next", className: cls.navBtnBase + " " + cls.navBtnR },
                    React.createElement(ChevronRightSVG)
                ),
                React.createElement(
                    "div",
                    { id: "div_book_list_slider", className: cls.slider },
                    books.map(function (b, idx) {
                        return React.createElement(CardComp, {
                            key: b.uuid || idx,
                            b: b,
                            idx: idx,
                            activeIdx: activeIdx,
                            setActiveIdx: setActiveIdx,
                        });
                    })
                )
            ),
            books.length === 0
                ? React.createElement(
                      "div",
                      { className: "text-center text-sm text-gray-500 pt-2" },
                      "표시할 책이 없습니다."
                  )
                : null
        );
    }

    function mount() {
        var mountEl = document.getElementById(MOUNT_ID);
        if (!mountEl) return;

        if (typeof ReactDOM !== "undefined" && typeof ReactDOM.render === "function") {
            ReactDOM.render(React.createElement(DivBookList), mountEl);
            return;
        }

        if (typeof ReactDOM !== "undefined" && typeof ReactDOM.createRoot === "function") {
            if (!window.__webRBookListRoots) {
                window.__webRBookListRoots = new WeakMap();
            }

            var root = window.__webRBookListRoots.get(mountEl);
            if (!root) {
                root = ReactDOM.createRoot(mountEl);
                window.__webRBookListRoots.set(mountEl, root);
            }

            root.render(React.createElement(DivBookList));
            return;
        }

        throw new Error("ReactDOM.render/createRoot 를 찾을 수 없습니다.");
    }

    mount();
}

window.get_book_list = get_book_list;

async function get_div_main_board() {
    function Div_new_article_list(props) {
        const cu = props.data.category_url;

        let href = "/community/read/" + props.data.uuid + "/";
        if (cu === "notebook") {
            href = props.data.url;
        }

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
        }

        return (
            <div class="bg-white w-full">
                <a
                    href={href}
                    class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-50 rounded-lg mx-3 my-2"
                >
                    <div class="flex flex-row items-center space-x-2">
                        <span
                            class={
                                "px-2 py-0.5 border rounded-full text-xs font-semibold w-fit max-w-9/12" +
                                category_title_color
                            }
                        >
                            {category_title}
                        </span>

                        <span class="font-bold text-sm truncate">{props.data.title}</span>

                        <Span_btn_article_new toggle={props.data.is_new} />
                        <Span_btn_article_secret toggle={props.data.is_secret} />
                        <Span_btn_my_article toggle={props.data.check_reader} />
                    </div>

                    <div class="flex flex-wrap items-center space-x-2">
                        <Span_btn_user
                            user_nickname={props.data.user_nickname}
                            role={props.data.user_role}
                        />
                        <Span_btn_date date={props.data.created_at} />
                        <Span_btn_article_read cnt_read={props.data.cnt_read} />
                        <Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
                    </div>
                </a>
            </div>
        );
    }

    function TabButton({ active, onClick, children }) {
        const base = "px-3 py-1.5 text-xs font-bold rounded-full transition-all select-none";
        const activeCls = " bg-blue-600 text-white shadow-sm";
        const inActiveCls = " bg-gray-100 text-gray-700 hover:bg-gray-200";

        return (
            <button
                type="button"
                onClick={onClick}
                class={base + (active ? activeCls : inActiveCls)}
            >
                {children}
            </button>
        );
    }

    function Col(props) {
        const [activeTab, setActiveTab] = React.useState("all");
        const arr = Object.keys(props.data || {}).map((k) => props.data[k]);

        const sortByCreatedAtDesc = (a, b) => {
            const da = new Date(String(a.created_at).replace(" ", "T"));
            const db = new Date(String(b.created_at).replace(" ", "T"));
            return db - da;
        };

        const freeList = arr.filter((x) => x.category_url === "free").sort(sortByCreatedAtDesc);
        const rbloggerList = arr
            .filter((x) => x.category_url === "rblogger")
            .sort(sortByCreatedAtDesc);
        const notebookList = arr
            .filter((x) => x.category_url === "notebook")
            .sort(sortByCreatedAtDesc);

        const pick = [];
        if (freeList.length) pick.push(freeList[0]);
        if (rbloggerList.length) pick.push(rbloggerList[0]);
        if (notebookList.length) pick.push(notebookList[0]);

        const allList = pick.sort(sortByCreatedAtDesc);

        let current = allList;
        if (activeTab === "free") current = freeList;
        if (activeTab === "rblogger") current = rbloggerList;
        if (activeTab === "notebook") current = notebookList;

        return (
            <div class="w-full">
                <h5 class="mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900">커뮤니티</h5>

                <div class="rounded-lg bg-white shadow-sm overflow-hidden">
                    <div class="flex flex-wrap items-center gap-2 px-4 pt-4 pb-3 bg-white">
                        <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
                            전체보기
                        </TabButton>
                        <TabButton
                            active={activeTab === "free"}
                            onClick={() => setActiveTab("free")}
                        >
                            자유게시판
                        </TabButton>
                        <TabButton
                            active={activeTab === "rblogger"}
                            onClick={() => setActiveTab("rblogger")}
                        >
                            R-Blogger
                        </TabButton>
                        <TabButton
                            active={activeTab === "notebook"}
                            onClick={() => setActiveTab("notebook")}
                        >
                            Web-R Notebook
                        </TabButton>
                    </div>

                    <div>
                        {current.length > 0 ? (
                            current.map((article, idx) => (
                                <Div_new_article_list
                                    key={article.uuid || article.url || idx}
                                    data={article}
                                />
                            ))
                        ) : (
                            <div class="px-6 py-6 text-sm text-gray-500">표시할 글이 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const data = await fetch("/ajax_index_board/").then((res) => res.json());

    ReactDOM.render(<Col data={data} />, document.getElementById("div_main_board_free"));
}

async function get_div_main_board_notice() {
    function Div_new_notice_list(props) {
        let category_menu = "intro/";
        let category_url = "notice";

        return (
            <div class="bg-white w-full">
                <a
                    href={"/" + category_menu + category_url + "/read/" + props.data.uuid + "/"}
                    class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full"
                >
                    <div class="flex flex-row justify-start items-center space-x-2">
                        <span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
                            {props.data.title}
                        </span>
                    </div>
                    <div class="flex flex-wrap justify-start items-center space-x-2">
                        <Span_btn_date date={props.data.created_at} />
                        <Span_btn_article_new toggle={props.data.is_new} />
                        <Span_btn_article_secret toggle={props.data.is_secret} />
                    </div>
                </a>
            </div>
        );
    }

    function Col(props) {
        const articleList = Object.keys(props.data).map((article, idx) => (
            <Div_new_notice_list key={(props.data[article] && props.data[article].uuid) || idx} data={props.data[article]} />
        ));

        return (
            <div class="w-full">
                <h6 class="mb-3 text-base font-semibold text-gray-900">공지사항</h6>
                <div class="rounded-lg bg-white">{articleList}</div>
            </div>
        );
    }

    const data = await fetch("/ajax_index_notice/")
        .then((res) => res.json())
        .then((res) => res);

    ReactDOM.render(
        <Col data={data} title="공지사항" />,
        document.getElementById("div_main_board_notice")
    );
}

async function get_div_main_youtube() {
    function Div_main_youtube(props) {
        const { uuid, title, youtube_thumbnail } = props.data;

        return (
            <div class="w-full">
                <h6 class="mb-3 text-base font-semibold text-gray-900">유튜브</h6>
                <div
                    class="rounded-lg bg-white overflow-hidden cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => (window.location.href = `/workshop/youtube/read/${uuid}/`)}
                >
                    <div class="flex flex-col items-center">
                        <img src={youtube_thumbnail} alt="YouTube Thumbnail" class="w-full object-cover" />
                        <div class="px-4 py-3 text-sm text-gray-800 text-center font-medium truncate w-full">
                            {title}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const data = await fetch("/ajax_index_youtube/")
        .then((res) => res.json())
        .catch((err) => {
            console.error("YouTube fetch error:", err);
            return null;
        });

    if (!data || !data[0]) return;

    ReactDOM.render(
        <Div_main_youtube data={data[0]} />,
        document.getElementById("div_main_youtube")
    );
}

async function get_div_main_new_event() {
    function makeEventMessage(event, nickname) {
        switch (event) {
            case "회원가입":
                return `${nickname}님이 가입하였습니다.`;
            case "접속중":
                return `${nickname}님이 접속중입니다.`;
            case "게시판 - youtube":
                return `유튜브에 새로운 영상이 업로드 되었습니다.`;
            case "게시판 - notice":
                return `새로운 공지사항이 등록되었습니다.`;
            case "댓글":
                return `${nickname}님이 게시물에 댓글을 달았습니다`;
            default:
                if (typeof event === "string") {
                    if (event.startsWith("게시판 - ")) {
                        return `${nickname}님이 커뮤니티에 새 글을 게시하였습니다.`;
                    } else if (event.startsWith("Web-R - ")) {
                        const appName = event.replace("Web-R - ", "");
                        return `${nickname}님이 ${appName}을(를) 실행하고 있습니다.`;
                    }
                }
                return `${nickname}님의 활동이 있습니다.`;
        }
    }

    function Div_new_event_list(props) {
        const { event, created_at, nickname } = props.data;
        const message = makeEventMessage(event, nickname ?? "회원");

        return (
            <div class="bg-white w-full border-b last:border-b-0">
                <div class="flex flex-col px-6 py-4 space-y-1">
                    <div class="text-sm text-gray-800 truncate">{message}</div>
                    <div class="flex items-center space-x-2">
                        <Span_btn_date date={created_at} />
                    </div>
                </div>
            </div>
        );
    }

    function Col(props) {
        const sortedData = Object.values(props.data).sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        const items = sortedData.map((item, idx) => (
            <Div_new_event_list key={item.uuid || item.created_at || idx} data={item} />
        ));

        return (
            <div class="w-full">
                <h5 class="mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900">
                    {props.title ?? "최근 활동"}
                </h5>
                <div class="rounded-lg bg-white overflow-hidden">{items}</div>
            </div>
        );
    }

    const data = await fetch("/ajax_index_event/").then((res) => res.json());

    ReactDOM.render(
        <Col data={data} title="최근 활동" />,
        document.getElementById("div_main_new_members")
    );
}

function set_main() {
    function Div_main() {
        return (
            <div class="flex flex-col justify-center items-center w-full space-y-[25px] mt-[50px] px-[100px] py-[20px] md:px-[10px] md:py-[0px]">
                <div id="div_main_header" class="w-full"></div>
                <div id="div_main_statistics" class="w-full"></div>
                <div class="w-full" id="div_book_list">
                    <div class="flex flex-row justify-center items-center w-full h-[150px] mb-4 bg-gray-300 animate-pulse"></div>
                </div>
                <div id="div_main_board" class="w-full"></div>
            </div>
        );
    }

    ReactDOM.render(<Div_main />, document.getElementById("div_main"));

    ReactDOM.render(<Div_main_header />, document.getElementById("div_main_header"));
    ReactDOM.render(<Div_main_statistics_skeleton />, document.getElementById("div_main_statistics"));
    ReactDOM.render(<Div_main_board_skeleton />, document.getElementById("div_main_board"));

    get_div_main_statistics();
    get_book_list();
    get_div_main_board();
    get_div_main_board_notice();
    get_div_main_youtube();
    get_div_main_new_event();
}

window.set_main = set_main;
