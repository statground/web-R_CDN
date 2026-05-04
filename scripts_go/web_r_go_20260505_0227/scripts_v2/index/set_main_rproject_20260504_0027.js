let class_span_btn_default = "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl";
function getIndexArticleHref(data) {
  const item = data || {};
  const uuid = item.uuid || item.uuid_article || "";
  const categoryUrl = item.category_url || item.article_category_url || "";
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
  if (categoryUrl === "rproject") {
    return "/community/rproject/read/" + uuid + "/";
  }
  if (categoryUrl === "rblogger" || categoryUrl === "free") {
    return "/community/read/" + uuid + "/";
  }
  if (explicitUrl) {
    return explicitUrl;
  }
  return "/community/read/" + uuid + "/";
}
function Span_btn_user(props) {
  const roles = {
    "\uAD00\uB9AC\uC790": "yellow",
    "\uAE30\uC5C5\uD68C\uC6D0": "red",
    "VIP\uD68C\uC6D0": "blue",
    "\uC815\uD68C\uC6D0": "green",
    "\uC900\uD68C\uC6D0": "gray"
  };
  const role = roles[props.role] || "gray";
  return /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-${role}-100 text-${role}-800` }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/board_user.svg",
      class: "w-3 h-3 mr-1"
    }
  ), props.user_nickname);
}
function Span_btn_date(props) {
  return /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-blue-100 text-blue-800` }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: `https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/calendar_${Number(
        props.date.split("-")[2].substr(0, 2)
      )}.svg`,
      class: "w-3 h-3 mr-1"
    }
  ), props.date);
}
function Span_btn_article_read(props) {
  return props.cnt_read > 0 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-gray-100 text-blue-800` }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/eye.svg",
      class: "w-3 h-3 mr-1"
    }
  ), props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
}
function Span_btn_article_comment(props) {
  return props.cnt_comment > 0 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-purple-100 text-blue-800` }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment.svg",
      class: "w-3 h-3 mr-1"
    }
  ), props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
}
function Span_btn_article_new(props) {
  return props.toggle === 1 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-red-500 text-white animate-pulse` }, "NEW");
}
function Span_btn_article_secret(props) {
  return props.toggle === 1 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse` }, "SECRET");
}
function Span_btn_my_article(props) {
  return props.toggle === "writer" && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse` }, "MY");
}
function Div_main_header() {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center text-center w-full" }, /* @__PURE__ */ React.createElement("h1", { class: "mb-4 text-5xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl" }, "\uC6F9\uC5D0\uC11C \uD558\uB294 ", /* @__PURE__ */ React.createElement("mark", { class: "px-2 text-white bg-blue-600 rounded" }, "R"), " \uD1B5\uACC4"), /* @__PURE__ */ React.createElement("p", { class: "text-lg font-normal text-gray-500 lg:text-xl" }, '"\uC6F9\uC5D0\uC11C \uD558\uB294 R\uD1B5\uACC4"\uB294, \uD1B5\uACC4\uC5D0\uB294 \uAD00\uC2EC\uC774 \uC788\uC73C\uB098 R\uC744 \uC5B4\uB824\uC6CC\uD558\uB294 \uC5EC\uB7EC \uC5F0\uAD6C\uC790\uB4E4\uC744 \uC704\uD55C \uD504\uB85C\uC81D\uD2B8\uC785\uB2C8\uB2E4.', /* @__PURE__ */ React.createElement("br", null), "R\uC124\uCE58\uC5C6\uC774 \uD074\uB9AD\uB9CC\uC73C\uB85C \uC6F9\uC5D0 \uC788\uB294 \uC11C\uBC84\uB97C \uC774\uC6A9\uD558\uC5EC \uD1B5\uACC4\uBD84\uC11D\uC744 \uD558\uACE0 \uBCF4\uB2E4 R\uC744 \uC27D\uAC8C \uC0AC\uC6A9\uD558\uAE30 \uC704\uD55C \uD328\uD0A4\uC9C0 \uBC0F \uC571 \uACF5\uB3D9\uAC1C\uBC1C\uC744 \uBAA9\uD45C\uB85C \uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4."));
}
function Div_main_statistics_skeleton() {
  function Div_Sub(props) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        class: "flex items-center w-full w-max-md p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow",
        role: "alert"
      },
      /* @__PURE__ */ React.createElement("img", { src: props.svg, class: "w-6 h-6" }),
      /* @__PURE__ */ React.createElement("div", { class: "pl-4 text-sm font-normal animate-pulse" }, /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-300 rounded-full w-full mb-2.5" }), /* @__PURE__ */ React.createElement("div", { class: "w-32 h-2 bg-gray-200 rounded-full" }))
    );
  }
  return /* @__PURE__ */ React.createElement("div", { class: "grid lg:grid-cols-3 md:grid-cols-1 mx-auto" }, /* @__PURE__ */ React.createElement(Div_Sub, { svg: "https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/member.svg" }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Div_Sub, { svg: "https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/visitors.svg" }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Div_Sub, { svg: "https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/pageview.svg" }));
}
function Div_main_board_skeleton() {
  function Div_table_skeleton({ title, id, rows = 5 }) {
    const Row = () => /* @__PURE__ */ React.createElement("tr", { class: "bg-white border-b" }, /* @__PURE__ */ React.createElement("td", { class: "px-6 py-4" }, /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-300 rounded-full w-3/4 mb-2.5 animate-pulse" }), /* @__PURE__ */ React.createElement("div", { class: "h-2 bg-gray-200 rounded-full w-1/3 animate-pulse" })));
    return /* @__PURE__ */ React.createElement("div", { class: "w-full", id }, /* @__PURE__ */ React.createElement("h5", { class: "mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900" }, title), /* @__PURE__ */ React.createElement("div", { class: "rounded-lg border bg-white" }, /* @__PURE__ */ React.createElement("table", { class: "w-full text-sm text-left text-gray-500" }, /* @__PURE__ */ React.createElement("thead", { class: "text-xs text-gray-700 uppercase bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { class: "px-6 py-3" }))), /* @__PURE__ */ React.createElement("tbody", null, Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ React.createElement(Row, { key: i }))))));
  }
  function Div_card({ title, id, children }) {
    return /* @__PURE__ */ React.createElement("div", { class: "w-full rounded-lg border bg-white p-4", id }, /* @__PURE__ */ React.createElement("h6", { class: "mb-3 text-base font-semibold text-gray-900" }, title), children);
  }
  const Bullet = () => /* @__PURE__ */ React.createElement("div", { class: "flex items-center gap-3 py-2" }, /* @__PURE__ */ React.createElement("div", { class: "h-2.5 w-2.5 rounded-full bg-gray-300 animate-pulse" }), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-300 rounded-full w-3/4 animate-pulse" }));
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-row pt-12 pb-12 justify-center", id: "div_board" }, /* @__PURE__ */ React.createElement("div", { class: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-4 gap-6 md:grid-cols-1" }, /* @__PURE__ */ React.createElement("div", { class: "col-span-3 flex flex-col gap-6" }, /* @__PURE__ */ React.createElement(Div_table_skeleton, { title: "\uCEE4\uBBA4\uB2C8\uD2F0", id: "div_main_board_free", rows: 6 }), /* @__PURE__ */ React.createElement(Div_table_skeleton, { title: "\uCD5C\uADFC \uD65C\uB3D9", id: "div_main_new_members", rows: 6 })), /* @__PURE__ */ React.createElement("div", { class: "col-span-1 flex flex-col gap-6" }, /* @__PURE__ */ React.createElement(Div_card, { title: "\uACF5\uC9C0\uC0AC\uD56D", id: "div_main_board_notice" }, /* @__PURE__ */ React.createElement(Bullet, null), /* @__PURE__ */ React.createElement(Bullet, null), /* @__PURE__ */ React.createElement(Bullet, null)), /* @__PURE__ */ React.createElement(Div_card, { title: "\uC720\uD29C\uBE0C", id: "div_main_youtube" }, /* @__PURE__ */ React.createElement("div", { class: "w-full aspect-video rounded-md bg-gray-300 animate-pulse" }))))));
}
async function get_div_main_statistics() {
  function Div_sub(props) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        id: "toast-simple",
        class: "flex items-center w-full w-max-md p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow",
        role: "alert"
      },
      /* @__PURE__ */ React.createElement("img", { src: props.svg, class: "w-6 h-6" }),
      /* @__PURE__ */ React.createElement("div", { class: "pl-4 text-sm font-normal" }, /* @__PURE__ */ React.createElement("div", { class: "pl-4 text-md font-bold" }, props.title), /* @__PURE__ */ React.createElement("div", { class: "pl-4 text-sm font-normal" }, props.content.toLocaleString(), props.unit))
    );
  }
  function Div_result(props) {
    return /* @__PURE__ */ React.createElement("div", { class: "grid lg:grid-cols-3 md:grid-cols-1 mx-auto" }, /* @__PURE__ */ React.createElement(
      Div_sub,
      {
        title: "\uCD1D \uAC00\uC785\uC790 \uC218",
        content: props.data.cnt_member,
        unit: "\uBA85",
        svg: "https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/member.svg"
      }
    ), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(
      Div_sub,
      {
        title: "\uC624\uB298\uC758 \uBC29\uBB38\uC790 \uC218",
        content: props.data.cnt_visitor,
        unit: "\uBA85",
        svg: "https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/visitors.svg"
      }
    ), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(
      Div_sub,
      {
        title: "\uC624\uB298\uC758 \uD398\uC774\uC9C0 \uBDF0",
        content: props.data.cnt_pageview,
        unit: "\uAC74",
        svg: "https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/pageview.svg"
      }
    ));
  }
  const data = await fetch("/ajax_index_statistics/").then((res) => res.json()).then((res) => res);
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_result, { data }), document.getElementById("div_main_statistics"));
}
function get_book_list() {
  var API_URL = "/book/ajax_get_book_list/";
  var MOUNT_ID = "div_book_list";
  var ICONS = {
    kyobo: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/kyobobook2.png",
    yes24: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/yes24.png",
    ypbooks: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/ypbooks.png",
    coupang: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/coupang.png",
    leanpub: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/LeanPub.png",
    bookdown: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/bookdown.png",
    board: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_free.svg",
    default_vendor: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/icon_default.png",
    default_cover: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/default_book.png"
  };
  function iconForSource(source) {
    var s = (source || "").toLowerCase();
    if (s.indexOf("\uAD50\uBCF4") > -1 || s.indexOf("kyobo") > -1)
      return ICONS.kyobo;
    if (s.indexOf("yes24") > -1)
      return ICONS.yes24;
    if (s.indexOf("\uC601\uD48D") > -1 || s.indexOf("ypbooks") > -1)
      return ICONS.ypbooks;
    if (s.indexOf("\uCFE0\uD321") > -1 || s.indexOf("coupang") > -1)
      return ICONS.coupang;
    if (s.indexOf("leanpub") > -1)
      return ICONS.leanpub;
    if (s.indexOf("bookdown") > -1)
      return ICONS.bookdown;
    return ICONS.default_vendor;
  }
  function pad3(v) {
    return (v == null ? "000" : String(v)).padStart(3, "0");
  }
  function normalizeRows(raw) {
    if (!raw)
      return [];
    if (Array.isArray(raw))
      return raw;
    if (Array.isArray(raw.data))
      return raw.data;
    if (Array.isArray(raw.results))
      return raw.results;
    if (Array.isArray(raw.rows))
      return raw.rows;
    var arr = Object.keys(raw).map(function(k) {
      return raw[k];
    });
    var nestedArr = arr.find(Array.isArray);
    return Array.isArray(nestedArr) ? nestedArr : arr;
  }
  var cls = {
    wrap: "w-full pt-4",
    navWrap: "relative",
    navBtnBase: "absolute z-10 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black text-white shadow",
    navBtnL: "left-2",
    navBtnR: "right-2",
    slider: "flex gap-3 overflow-x-scroll scroll-smooth pb-2 scrollbar-hide",
    card: "flex flex-col justify-start w-64 min-w-64 h-48 p-3 rounded-xl shadow bg-white border hover:border-gray-900",
    img: "w-full object-contain rounded-md border bg-white",
    title: "font-semibold leading-snug text-center",
    meta: "text-xs text-gray-500 text-center",
    vendors: "w-full justify-center gap-2 flex-wrap items-center"
  };
  function groupRows(raw) {
    var rows = normalizeRows(raw);
    var byBook = /* @__PURE__ */ new Map();
    rows.forEach(function(r) {
      if (!r)
        return;
      var key = r.uuid || r.title || "rnd-" + Math.random().toString(16).slice(2);
      if (!byBook.has(key)) {
        byBook.set(key, {
          uuid: r.uuid,
          uuid_board_category: r.uuid_board_category,
          title: r.title,
          publisher: r.publisher,
          published_at: r.published_at,
          url_image: r.url_image,
          randnum: r.randnum == null ? Math.random() : r.randnum,
          sources: {}
        });
      }
      var vendorName = r.marketplace != null && r.marketplace !== "" ? r.marketplace : r.source;
      if (vendorName && r.url) {
        var s = String(vendorName).trim();
        if (!byBook.get(key).sources[s])
          byBook.get(key).sources[s] = [];
        byBook.get(key).sources[s].push(r.url);
      }
    });
    return Array.from(byBook.values()).map(function(b) {
      var vendors = Object.entries(b.sources).map(function(_ref) {
        var source = _ref[0], urls = _ref[1];
        return { source, url: urls[Math.floor(Math.random() * urls.length)] };
      });
      return Object.assign({}, b, { vendors });
    }).sort(function(a, b) {
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
        strokeLinejoin: "round"
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
        strokeLinejoin: "round"
      })
    );
  }
  function CardComp(props) {
    var b = props.b, idx = props.idx, activeIdx = props.activeIdx, setActiveIdx = props.setActiveIdx;
    var GAP_PX = 8, MIN_IMG = 60;
    var hasVendors = Array.isArray(b.vendors) && b.vendors.length > 0;
    var isOpen = activeIdx === idx && hasVendors;
    var cardRef = React.useRef(null);
    var titleRef = React.useRef(null);
    var metaRef = React.useRef(null);
    var vendorsRef = React.useRef(null);
    var _React$useState = React.useState(100), imgH = _React$useState[0], setImgH = _React$useState[1];
    function recalc() {
      if (!cardRef.current)
        return;
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
    React.useEffect(function() {
      function onResize() {
        recalc();
      }
      window.addEventListener("resize", onResize);
      var t = setTimeout(recalc, 0);
      return function() {
        window.removeEventListener("resize", onResize);
        clearTimeout(t);
      };
    }, []);
    function onToggle() {
      setActiveIdx(function(p) {
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
        loading: "lazy"
      }),
      React.createElement("div", { style: { height: GAP_PX + "px" } }),
      React.createElement("div", { ref: titleRef, className: cls.title }, b.title || ""),
      React.createElement("div", { style: { height: GAP_PX + "px" } }),
      React.createElement(
        "div",
        { ref: metaRef, className: cls.meta },
        b.publisher ? b.publisher : " ",
        b.published_at ? " \xB7 " + b.published_at : ""
      ),
      isOpen ? React.createElement("div", { style: { height: GAP_PX + "px" } }) : null,
      React.createElement(
        "div",
        {
          ref: vendorsRef,
          className: "purchase-buttons " + cls.vendors,
          style: { display: isOpen ? "flex" : "none" },
          onClick: function(e) {
            e.stopPropagation();
          }
        },
        (b.vendors || []).map(function(v, i) {
          return React.createElement(
            "a",
            { key: i, href: v.url, target: "_blank", rel: "noopener", title: v.source },
            React.createElement("img", {
              className: "h-6 w-auto",
              src: iconForSource(v.source),
              alt: v.source,
              loading: "lazy"
            })
          );
        }),
        React.createElement(
          "button",
          { onClick: goBoard, title: "\uAC8C\uC2DC\uD310", type: "button" },
          React.createElement("img", {
            className: "h-6 w-auto",
            src: ICONS.board,
            alt: "\uAC8C\uC2DC\uD310",
            loading: "lazy"
          })
        )
      )
    );
  }
  function DivBookList() {
    var _React$useState2 = React.useState([]), books = _React$useState2[0], setBooks = _React$useState2[1];
    var _React$useState3 = React.useState(null), activeIdx = _React$useState3[0], setActiveIdx = _React$useState3[1];
    React.useEffect(function() {
      fetch(API_URL).then(function(r) {
        if (!r.ok)
          throw new Error("HTTP " + r.status);
        return r.json();
      }).then(function(raw) {
        var grouped = groupRows(raw);
        setBooks(grouped);
      }).catch(function(err) {
        console.warn("book list fetch error:", err);
        setBooks([]);
      });
    }, []);
    React.useEffect(
      function() {
        var slider = document.getElementById("div_book_list_slider");
        if (!slider)
          return;
        function scrollByPage(d) {
          slider.scrollBy({ left: d * slider.offsetWidth, behavior: "smooth" });
        }
        var n = document.getElementById("div_book_list_next");
        var p = document.getElementById("div_book_list_prev");
        function next() {
          scrollByPage(1);
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
        return function() {
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
          books.map(function(b, idx) {
            return React.createElement(CardComp, {
              key: b.uuid || idx,
              b,
              idx,
              activeIdx,
              setActiveIdx
            });
          })
        )
      ),
      books.length === 0 ? React.createElement(
        "div",
        { className: "text-center text-sm text-gray-500 pt-2" },
        "\uD45C\uC2DC\uD560 \uCC45\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."
      ) : null
    );
  }
  function mount() {
    var mountEl = document.getElementById(MOUNT_ID);
    if (!mountEl)
      return;
    if (typeof ReactDOM !== "undefined" && typeof ReactDOM.render === "function") {
      ReactDOM.render(React.createElement(DivBookList), mountEl);
      return;
    }
    if (typeof ReactDOM !== "undefined" && typeof ReactDOM.createRoot === "function") {
      if (!window.__webRBookListRoots) {
        window.__webRBookListRoots = /* @__PURE__ */ new WeakMap();
      }
      var root = window.__webRBookListRoots.get(mountEl);
      if (!root) {
        root = ReactDOM.createRoot(mountEl);
        window.__webRBookListRoots.set(mountEl, root);
      }
      root.render(React.createElement(DivBookList));
      return;
    }
    throw new Error("ReactDOM.render/createRoot \uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  mount();
}
window.get_book_list = get_book_list;
async function get_div_main_board() {
  function Div_new_article_list(props) {
    const cu = props.data.category_url;
    const href = getIndexArticleHref(props.data);
    let category_title = "\uCEE4\uBBA4\uB2C8\uD2F0";
    let category_title_color = " bg-blue-100 text-blue-700 border-blue-300";
    if (cu === "free") {
      category_title = "\uC790\uC720\uAC8C\uC2DC\uD310";
      category_title_color = " bg-blue-100 text-blue-700 border-blue-300";
    } else if (cu === "rblogger") {
      category_title = "R-Blogger";
      category_title_color = " bg-purple-100 text-purple-700 border-purple-300";
    } else if (cu === "rproject") {
      category_title = "R-Project (Official)";
      category_title_color = " bg-sky-100 text-sky-700 border-sky-300";
    } else if (cu === "notebook") {
      category_title = "Web-R Notebook";
      category_title_color = " bg-emerald-100 text-emerald-700 border-emerald-300";
    }
    return /* @__PURE__ */ React.createElement("div", { class: "bg-white w-full" }, /* @__PURE__ */ React.createElement(
      "a",
      {
        href,
        class: "flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-50 rounded-lg mx-3 my-2"
      },
      /* @__PURE__ */ React.createElement("div", { class: "flex flex-row items-center space-x-2" }, /* @__PURE__ */ React.createElement(
        "span",
        {
          class: "px-2 py-0.5 border rounded-full text-xs font-semibold w-fit max-w-9/12" + category_title_color
        },
        category_title
      ), /* @__PURE__ */ React.createElement("span", { class: "font-bold text-sm truncate" }, props.data.title), /* @__PURE__ */ React.createElement(Span_btn_article_new, { toggle: props.data.is_new }), /* @__PURE__ */ React.createElement(Span_btn_article_secret, { toggle: props.data.is_secret }), /* @__PURE__ */ React.createElement(Span_btn_my_article, { toggle: props.data.check_reader })),
      /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap items-center space-x-2" }, /* @__PURE__ */ React.createElement(
        Span_btn_user,
        {
          user_nickname: props.data.user_nickname,
          role: props.data.user_role
        }
      ), /* @__PURE__ */ React.createElement(Span_btn_date, { date: props.data.created_at }), /* @__PURE__ */ React.createElement(Span_btn_article_read, { cnt_read: props.data.cnt_read }), /* @__PURE__ */ React.createElement(Span_btn_article_comment, { cnt_comment: props.data.cnt_comment }))
    ));
  }
  function TabButton({ active, onClick, children }) {
    const base = "px-3 py-1.5 text-xs font-bold rounded-full transition-all select-none";
    const activeCls = " bg-blue-600 text-white shadow-sm";
    const inActiveCls = " bg-gray-100 text-gray-700 hover:bg-gray-200";
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick,
        class: base + (active ? activeCls : inActiveCls)
      },
      children
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
    const rbloggerList = arr.filter((x) => x.category_url === "rblogger").sort(sortByCreatedAtDesc);
    const rprojectList = arr.filter((x) => x.category_url === "rproject").sort(sortByCreatedAtDesc);
    const notebookList = arr.filter((x) => x.category_url === "notebook").sort(sortByCreatedAtDesc);
    const pick = [];
    if (freeList.length)
      pick.push(freeList[0]);
    if (rbloggerList.length)
      pick.push(rbloggerList[0]);
    if (rprojectList.length)
      pick.push(rprojectList[0]);
    if (notebookList.length)
      pick.push(notebookList[0]);
    const allList = pick.sort(sortByCreatedAtDesc);
    let current = allList;
    if (activeTab === "free")
      current = freeList;
    if (activeTab === "rblogger")
      current = rbloggerList;
    if (activeTab === "rproject")
      current = rprojectList;
    if (activeTab === "notebook")
      current = notebookList;
    return /* @__PURE__ */ React.createElement("div", { class: "w-full" }, /* @__PURE__ */ React.createElement("h5", { class: "mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900" }, "\uCEE4\uBBA4\uB2C8\uD2F0"), /* @__PURE__ */ React.createElement("div", { class: "rounded-lg bg-white shadow-sm overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap items-center gap-2 px-4 pt-4 pb-3 bg-white" }, /* @__PURE__ */ React.createElement(TabButton, { active: activeTab === "all", onClick: () => setActiveTab("all") }, "\uC804\uCCB4\uBCF4\uAE30"), /* @__PURE__ */ React.createElement(
      TabButton,
      {
        active: activeTab === "free",
        onClick: () => setActiveTab("free")
      },
      "\uC790\uC720\uAC8C\uC2DC\uD310"
    ), /* @__PURE__ */ React.createElement(
      TabButton,
      {
        active: activeTab === "rblogger",
        onClick: () => setActiveTab("rblogger")
      },
      "R-Blogger"
    ), /* @__PURE__ */ React.createElement(
      TabButton,
      {
        active: activeTab === "rproject",
        onClick: () => setActiveTab("rproject")
      },
      "R-Project (Official)"
    ), /* @__PURE__ */ React.createElement(
      TabButton,
      {
        active: activeTab === "notebook",
        onClick: () => setActiveTab("notebook")
      },
      "Web-R Notebook"
    )), /* @__PURE__ */ React.createElement("div", null, current.length > 0 ? current.map((article, idx) => /* @__PURE__ */ React.createElement(
      Div_new_article_list,
      {
        key: article.uuid || article.url || idx,
        data: article
      }
    )) : /* @__PURE__ */ React.createElement("div", { class: "px-6 py-6 text-sm text-gray-500" }, "\uD45C\uC2DC\uD560 \uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."))));
  }
  const data = await fetch("/ajax_index_board/").then((res) => res.json());
  ReactDOM.render(/* @__PURE__ */ React.createElement(Col, { data }), document.getElementById("div_main_board_free"));
}
async function get_div_main_board_notice() {
  function Div_new_notice_list(props) {
    let category_menu = "intro/";
    let category_url = "notice";
    return /* @__PURE__ */ React.createElement("div", { class: "bg-white w-full" }, /* @__PURE__ */ React.createElement(
      "a",
      {
        href: "/" + category_menu + category_url + "/read/" + props.data.uuid + "/",
        class: "flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full"
      },
      /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement("span", { class: "font-bold text-sm w-fit max-w-9/12 truncate ..." }, props.data.title)),
      /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_date, { date: props.data.created_at }), /* @__PURE__ */ React.createElement(Span_btn_article_new, { toggle: props.data.is_new }), /* @__PURE__ */ React.createElement(Span_btn_article_secret, { toggle: props.data.is_secret }))
    ));
  }
  function Col(props) {
    const articleList = Object.keys(props.data).map((article, idx) => /* @__PURE__ */ React.createElement(Div_new_notice_list, { key: props.data[article] && props.data[article].uuid || idx, data: props.data[article] }));
    return /* @__PURE__ */ React.createElement("div", { class: "w-full" }, /* @__PURE__ */ React.createElement("h6", { class: "mb-3 text-base font-semibold text-gray-900" }, "\uACF5\uC9C0\uC0AC\uD56D"), /* @__PURE__ */ React.createElement("div", { class: "rounded-lg bg-white" }, articleList));
  }
  const data = await fetch("/ajax_index_notice/").then((res) => res.json()).then((res) => res);
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Col, { data, title: "\uACF5\uC9C0\uC0AC\uD56D" }),
    document.getElementById("div_main_board_notice")
  );
}
async function get_div_main_youtube() {
  function Div_main_youtube(props) {
    const { uuid, title, youtube_thumbnail } = props.data;
    return /* @__PURE__ */ React.createElement("div", { class: "w-full" }, /* @__PURE__ */ React.createElement("h6", { class: "mb-3 text-base font-semibold text-gray-900" }, "\uC720\uD29C\uBE0C"), /* @__PURE__ */ React.createElement(
      "div",
      {
        class: "rounded-lg bg-white overflow-hidden cursor-pointer hover:bg-gray-50 transition",
        onClick: () => window.location.href = `/workshop/youtube/read/${uuid}/`
      },
      /* @__PURE__ */ React.createElement("div", { class: "flex flex-col items-center" }, /* @__PURE__ */ React.createElement("img", { src: youtube_thumbnail, alt: "YouTube Thumbnail", class: "w-full object-cover" }), /* @__PURE__ */ React.createElement("div", { class: "px-4 py-3 text-sm text-gray-800 text-center font-medium truncate w-full" }, title))
    ));
  }
  const data = await fetch("/ajax_index_youtube/").then((res) => res.json()).catch((err) => {
    console.error("YouTube fetch error:", err);
    return null;
  });
  if (!data || !data[0])
    return;
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Div_main_youtube, { data: data[0] }),
    document.getElementById("div_main_youtube")
  );
}
async function get_div_main_new_event() {
  const BLOCKED_EVENT_NICKNAMES = /* @__PURE__ */ new Set(["\uD0C8\uD1F4\uD55C \uC720\uC800", "\uD0C8\uD1F4\uD55C \uD68C\uC6D0", "Unknown", "unknown", "null", "None", "undefined"]);
  function normalizeEventNickname(value) {
    if (value === void 0 || value === null)
      return "";
    return String(value).trim();
  }
  function isVisibleEventItem(item) {
    if (!item)
      return false;
    const nickname = normalizeEventNickname(item.nickname);
    if (!nickname || BLOCKED_EVENT_NICKNAMES.has(nickname))
      return false;
    return true;
  }
  function makeEventMessage(event, nickname) {
    switch (event) {
      case "\uD68C\uC6D0\uAC00\uC785":
        return `${nickname}\uB2D8\uC774 \uAC00\uC785\uD558\uC600\uC2B5\uB2C8\uB2E4.`;
      case "\uC811\uC18D\uC911":
        return `${nickname}\uB2D8\uC774 \uC811\uC18D\uC911\uC785\uB2C8\uB2E4.`;
      case "\uAC8C\uC2DC\uD310 - youtube":
        return `\uC720\uD29C\uBE0C\uC5D0 \uC0C8\uB85C\uC6B4 \uC601\uC0C1\uC774 \uC5C5\uB85C\uB4DC \uB418\uC5C8\uC2B5\uB2C8\uB2E4.`;
      case "\uAC8C\uC2DC\uD310 - notice":
        return `\uC0C8\uB85C\uC6B4 \uACF5\uC9C0\uC0AC\uD56D\uC774 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`;
      case "\uB313\uAE00":
        return `${nickname}\uB2D8\uC774 \uAC8C\uC2DC\uBB3C\uC5D0 \uB313\uAE00\uC744 \uB2EC\uC558\uC2B5\uB2C8\uB2E4`;
      default:
        if (typeof event === "string") {
          if (event.startsWith("\uAC8C\uC2DC\uD310 - ")) {
            return `${nickname}\uB2D8\uC774 \uCEE4\uBBA4\uB2C8\uD2F0\uC5D0 \uC0C8 \uAE00\uC744 \uAC8C\uC2DC\uD558\uC600\uC2B5\uB2C8\uB2E4.`;
          } else if (event.startsWith("Web-R - ")) {
            const appName = event.replace("Web-R - ", "");
            return `${nickname}\uB2D8\uC774 ${appName}\uC744(\uB97C) \uC2E4\uD589\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.`;
          }
        }
        return `${nickname}\uB2D8\uC758 \uD65C\uB3D9\uC774 \uC788\uC2B5\uB2C8\uB2E4.`;
    }
  }
  function Div_new_event_list(props) {
    const { event, created_at, nickname } = props.data || {};
    const displayNickname = normalizeEventNickname(nickname) || "\uD68C\uC6D0";
    const message = makeEventMessage(event, displayNickname);
    return /* @__PURE__ */ React.createElement("div", { class: "bg-white w-full border-b last:border-b-0" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col px-6 py-4 space-y-1" }, /* @__PURE__ */ React.createElement("div", { class: "text-sm text-gray-800 truncate" }, message), /* @__PURE__ */ React.createElement("div", { class: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_date, { date: created_at }))));
  }
  function Col(props) {
    var _a;
    const sortedData = Object.values(props.data || {}).filter(isVisibleEventItem).sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    const items = sortedData.map((item, idx) => /* @__PURE__ */ React.createElement(Div_new_event_list, { key: item.uuid || item.created_at || idx, data: item }));
    return /* @__PURE__ */ React.createElement("div", { class: "w-full" }, /* @__PURE__ */ React.createElement("h5", { class: "mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900" }, (_a = props.title) != null ? _a : "\uCD5C\uADFC \uD65C\uB3D9"), /* @__PURE__ */ React.createElement("div", { class: "rounded-lg bg-white overflow-hidden" }, items));
  }
  const data = await fetch("/ajax_index_event/").then((res) => res.json()).catch((err) => {
    console.error("index_event fetch error:", err);
    return {};
  });
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Col, { data, title: "\uCD5C\uADFC \uD65C\uB3D9" }),
    document.getElementById("div_main_new_members")
  );
}
function set_main() {
  function Div_main() {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-[25px] mt-[50px] px-[100px] py-[20px] md:px-[10px] md:py-[0px]" }, /* @__PURE__ */ React.createElement("div", { id: "div_main_header", class: "w-full" }), /* @__PURE__ */ React.createElement("div", { id: "div_main_statistics", class: "w-full" }), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_book_list" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-center items-center w-full h-[150px] mb-4 bg-gray-300 animate-pulse" })), /* @__PURE__ */ React.createElement("div", { id: "div_main_board", class: "w-full" }));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_header, null), document.getElementById("div_main_header"));
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_statistics_skeleton, null), document.getElementById("div_main_statistics"));
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_board_skeleton, null), document.getElementById("div_main_board"));
  get_div_main_statistics();
  get_book_list();
  get_div_main_board();
  get_div_main_board_notice();
  get_div_main_youtube();
  get_div_main_new_event();
}
window.set_main = set_main;
