const MenuState = {
  hamburger: false,
  sections: {
    webr: false,
    r_ecosystem: false,
    community: false,
    book: false,
    workshop: false,
    intro: false
  }
};

const MENUS = ["webr", "r_ecosystem", "community", "book", "workshop", "intro"];
const CLASS_PC_OPEN = "block md:hidden bg-white border-b border-gray-200 shadow-sm";
const CLASS_MOBILE_OPEN = "hidden md:flex md:flex-col md:visible md:px-6 md:py-4 md:space-y-3 md:border-t md:border-gray-200 md:bg-white";
const CLASS_HIDDEN = "hidden";
const h = React.createElement;

const WEBR_CDN = "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/";
const COMMON_CDN = "https://cdn.jsdelivr.net/gh/statground/Common_CDN/";

const socialLinks = [
  ["Facebook Group", "https://www.facebook.com/groups/statground", COMMON_CDN + "images/svg/footer_facebook_group.svg"],
  ["Facebook Page", "https://www.facebook.com/Statground", COMMON_CDN + "images/svg/footer_facebook_page.svg"],
  ["Twitter", "https://twitter.com/Statground1", COMMON_CDN + "images/svg/footer_twitter_x.svg"],
  ["Instagram", "https://www.instagram.com/statground/", COMMON_CDN + "images/svg/footer_instagram.svg"],
  ["LinkedIn", "https://www.linkedin.com/company/82371650/", COMMON_CDN + "images/svg/footer_linkedin.svg"],
  ["Threads", "https://www.threads.net/@statground", COMMON_CDN + "images/svg/footer_threads.svg"]
];

const menuSections = {
  webr: {
    title: "Web-R 접속",
    panelTitle: "Web-R 실행 환경",
    panelText: "브라우저에서 바로 R 분석 환경과 Web-R 2.0 도구를 실행합니다.",
    panelLink: ["/webr/2.0/", "Web-R 2.0 보기"],
    icon: WEBR_CDN + "images/svg/R_logo.svg",
    items: [
      ["/webr/", "무료 서버 접속", "가입 여부와 무관하게 기본 Web-R 서버에 접속합니다."],
      ["/webr/member/", "정회원 서버 접속", "정회원 전용 서버와 분석 환경으로 이동합니다."],
      ["/webr/2.0/", "Web-R 2.0", "메타분석, ROC, 표본수 계산 등 새 Web-R 앱 모음입니다."],
      ["/webr/notebook/", "Web-R Notebook", "분석 노트북을 만들고 실행하고 공유합니다."]
    ]
  },
  r_ecosystem: {
    title: "R 에코시스템",
    panelTitle: "R 생태계 허브",
    panelText: "R 공식 소식, 블로그, 뉴스레터와 패키지 정보를 한곳에서 탐색합니다.",
    panelLink: ["/r-ecosystem/", "R 에코시스템 보기"],
    icon: WEBR_CDN + "images/svg/category.svg",
    items: [
      ["/r-ecosystem/", "소식·글", "공식 발표, 블로그·해설, 저널·뉴스레터를 모아 봅니다."],
      ["/r-ecosystem/packages/", "패키지", "CRAN, Bioconductor, R-universe 패키지와 dependency 신호를 탐색합니다."]
    ]
  },
  community: {
    title: "커뮤니티",
    panelTitle: "Web-R 커뮤니티",
    panelText: "Web-R 게시판과 R 커뮤니티 원천을 분리해서 볼 수 있습니다.",
    panelLink: ["/community/", "커뮤니티 보기"],
    icon: WEBR_CDN + "images/svg/menu_free.svg",
    items: [
      ["/community/", "Web-R 커뮤니티", "Web-R 이용자 게시판과 자유게시판으로 이동합니다."],
      ["/community/r-community/", "R 커뮤니티", "Reddit, Posit Community, Stack Overflow 등 외부 R 커뮤니티 글을 봅니다."]
    ]
  },
  book: {
    title: "도서",
    panelTitle: "Web-R 도서",
    panelText: "통계마당 도서별 자료, 예제, 보조 콘텐츠로 바로 이동합니다.",
    panelLink: ["/book/", "도서 목록 보기"],
    icon: WEBR_CDN + "images/svg/menu_book.svg",
    items: [
      ["/book/001/", "의학논문 작성을 위한 R통계와 그래프", "의학 논문 작성과 R 그래프 실습 자료입니다."],
      ["/book/002/", "R을 이용한 조건부과정분석", "조건부과정분석 예제와 보조 자료입니다."],
      ["/book/003/", "웹에서 클릭만으로 하는 R통계분석", "Web-R 기반 통계분석 실습 도서입니다."],
      ["/book/004/", "Learning ggplot2 Using Shiny App", "ggplot2 학습과 Shiny 예제를 함께 봅니다."],
      ["/book/005/", "일반화가법모형 소개", "GAM 분석 예제와 설명 자료입니다."],
      ["/book/006/", "밑바닥부터 시작하는 ROC 커브 분석", "ROC 커브 분석 실습 자료입니다."],
      ["/book/007/", "웹R을 이용한 통계분석", "웹R 기반 통계분석 예제입니다."],
      ["/book/008/", "의료인을 위한 R 생존분석", "의료 연구 생존분석 실습 자료입니다."]
    ]
  },
  workshop: {
    title: "워크샵",
    panelTitle: "워크샵 자료",
    panelText: "강의 자료와 Web-R 공식 YouTube 영상을 이어서 확인합니다.",
    panelLink: ["/workshop/", "워크샵 보기"],
    icon: WEBR_CDN + "images/svg/menu_workshop.svg",
    items: [
      ["/workshop/youtube/", "유튜브", "Web-R 공식 영상과 관련 자료를 봅니다."],
      ["/workshop/", "워크샵", "워크샵 안내와 강의 자료로 이동합니다."]
    ]
  },
  intro: {
    title: "Web-R 소개",
    panelTitle: "서비스 안내",
    panelText: "공지, 멤버십, 이용 약관과 개인정보 보호 방침을 확인합니다.",
    panelLink: ["/intro/", "회사 소개 보기"],
    icon: WEBR_CDN + "images/svg/menu_notice.svg",
    items: [
      ["/intro/notice/", "공지사항", "서비스 공지와 업데이트 안내를 확인합니다."],
      ["/intro/membership/", "정회원 가입", "정회원과 기관/팀 회원 상품을 확인합니다."],
      ["/intro/", "회사 소개", "Web-R과 통계마당 소개 페이지입니다."],
      ["/intro/terms/", "이용 약관", "서비스 이용 약관으로 이동합니다."],
      ["/intro/privates/", "개인정보 보호 방침", "개인정보 처리 기준을 확인합니다."],
      ["/intro/refund/", "환불 규정", "환불 및 결제 취소 기준을 확인합니다."]
    ]
  }
};

function closeAllMenus() {
  MENUS.forEach(function(menu) {
    MenuState.sections[menu] = false;
    const pc = document.getElementById("div_megamenu_" + menu);
    const mobile = document.getElementById("div_menu_mobile_" + menu);
    if (pc) pc.className = CLASS_HIDDEN;
    if (mobile) mobile.className = CLASS_HIDDEN;
  });
}

function click_dropdown(id) {
  if (!id) {
    closeAllMenus();
    return;
  }
  MENUS.forEach(function(menu) {
    const willOpen = id === menu && !MenuState.sections[menu];
    MenuState.sections[menu] = willOpen;
    const pc = document.getElementById("div_megamenu_" + menu);
    const mobile = document.getElementById("div_menu_mobile_" + menu);
    if (pc) pc.className = willOpen ? CLASS_PC_OPEN : CLASS_HIDDEN;
    if (mobile) mobile.className = willOpen ? CLASS_MOBILE_OPEN : CLASS_HIDDEN;
  });
}

function click_hamburger() {
  const menuMobile = document.getElementById("div_menu_mobile");
  MenuState.hamburger = !MenuState.hamburger;
  if (menuMobile) {
    menuMobile.className = MenuState.hamburger
      ? "hidden md:flex md:flex-col md:visible md:px-6 md:py-4 md:space-y-3 md:border-t md:border-gray-200 md:bg-white"
      : "hidden";
  }
}

function isLoginInterstitialPath(path) {
  return path === "/account/" || path === "/account/signup/" || path === "/account/welcome/" ||
    path === "/account/logout/" || path.indexOf("/account/ajax_") === 0;
}

function currentPageLoginURL() {
  const path = window.location.pathname || "/";
  if (isLoginInterstitialPath(path)) {
    return "/account/";
  }
  return "/account/?next=" + encodeURIComponent(path + window.location.search);
}

function ChevronIcon(props) {
  const className = props && props.className ? props.className : "h-4 w-4";
  return h("svg", { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true" },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" })
  );
}

function DownIcon() {
  return h("svg", { className: "ml-1 h-4 w-4", fill: "currentColor", viewBox: "0 0 20 20", "aria-hidden": "true" },
    h("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" })
  );
}

function SearchIcon() {
  return h("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true" },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" })
  );
}

function HamburgerIcon() {
  return h("svg", { className: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true" },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16M4 12h16M4 18h16" })
  );
}

function UtilityLink(props) {
  return h("a", {
    href: props.href,
    target: props.target || undefined,
    rel: props.target ? "noopener noreferrer" : undefined,
    className: "inline-flex min-h-[32px] items-center whitespace-nowrap px-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:underline"
  }, props.children);
}

function SocialIcon(props) {
  return h("a", {
    href: props.url,
    title: props.name,
    "aria-label": props.name,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 hover:text-blue-700"
  }, h("img", { src: props.icon, className: "h-4 w-4", alt: "" }));
}

function AccountLinks(props) {
  const data = props.data || {};
  const name = data.name || window.gv_username || "";
  const role = data.role || window.gv_role || "";
  const isLoggedIn = name !== "";
  if (!isLoggedIn) {
    return h("div", { className: "flex flex-row flex-wrap items-center gap-1" },
      h(UtilityLink, { href: currentPageLoginURL() }, "로그인"),
      h("span", { className: "h-5 w-px bg-gray-200", "aria-hidden": "true" }),
      h(UtilityLink, { href: "/account/signup/" }, "회원 가입")
    );
  }
  return h("div", { className: "flex flex-row flex-wrap items-center gap-1" },
    h(UtilityLink, { href: "/account/myinfo/" }, name),
    role ? h(UtilityLink, { href: "/intro/membership/" }, role) : null,
    role === "관리자" ? h(UtilityLink, { href: "/admin/" }, "Admin Page") : null,
    h("span", { className: "h-5 w-px bg-gray-200", "aria-hidden": "true" }),
    h(UtilityLink, { href: "/account/logout/" }, "로그아웃")
  );
}

function UtilityBar(props) {
  const data = props.data || {};
  return h("div", { className: "flex w-full flex-row flex-wrap items-center justify-end gap-2 text-sm" },
    h(AccountLinks, { data }),
    h("span", { className: "mx-1 h-5 w-px bg-gray-200", "aria-hidden": "true" }),
    h(UtilityLink, { href: "https://cafe.daum.net/biometrika", target: "_blank" }, "Biometrika"),
    h(UtilityLink, { href: "https://www.statground.net", target: "_blank" }, "통계마당 홈페이지"),
    h("span", { className: "mx-1 h-5 w-px bg-gray-200", "aria-hidden": "true" }),
    h("div", { className: "flex flex-row flex-wrap items-center gap-1" },
      socialLinks.map(function(item) {
        return h(SocialIcon, { key: item[0], name: item[0], url: item[1], icon: item[2] });
      })
    )
  );
}

async function get_menu_header() {
  const mount = document.getElementById("div_menu_sub_header");
  if (!mount) return;
  const data = await fetch("/ajax_get_menu_header/", { method: "POST", credentials: "same-origin" })
    .then(function(res) { return res.json(); })
    .catch(function() { return { role: "", name: "" }; });
  window.gv_role = data.role || "";
  ReactDOM.render(h(UtilityBar, { data }), mount);
}

function splitColumns(items, count) {
  const columns = Array.from({ length: count }, function() { return []; });
  items.forEach(function(item, index) {
    columns[index % count].push(item);
  });
  return columns;
}

function MegaItem(props) {
  const item = props.item;
  return h("li", null,
    h("a", {
      href: item[0],
      className: "flex min-h-[92px] gap-3 rounded-lg p-3 text-gray-900 hover:bg-gray-50 hover:text-blue-700"
    },
      h("span", { className: "mt-0.5 text-gray-500" }, h(ChevronIcon, { className: "h-5 w-5" })),
      h("span", { className: "min-w-0" },
        h("span", { className: "block text-base font-semibold leading-6" }, item[1]),
        h("span", { className: "mt-1 block text-sm font-normal leading-6 text-gray-500" }, item[2])
      )
    )
  );
}

function MegaMenu(props) {
  const section = menuSections[props.id];
  const columns = splitColumns(section.items, 3);
  return h("nav", { id: "div_megamenu_" + props.id, className: "hidden", "aria-label": section.title + " 하위 메뉴" },
    h("div", { className: "mx-auto grid max-w-screen-xl grid-cols-4 gap-6 px-4 py-7 text-gray-900 md:grid-cols-1 md:px-6" },
      columns.map(function(column, index) {
        return h("ul", { key: props.id + "-col-" + index, className: "space-y-1" },
          column.map(function(item) {
            return h(MegaItem, { key: item[0], item });
          })
        );
      }),
      h("aside", { className: "p-3 md:border-t md:border-gray-200" },
        h("h2", { className: "mb-2 text-base font-semibold text-gray-900" }, section.panelTitle),
        h("p", { className: "mb-3 text-sm leading-6 text-gray-500" }, section.panelText),
        h("a", { href: section.panelLink[0], className: "inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800" },
          section.panelLink[1],
          h("span", { className: "ml-1" }, "→")
        )
      )
    )
  );
}

function HeaderSearch() {
  return h("form", { className: "flex min-w-[320px] max-w-xl flex-1 md:min-w-0", method: "get", action: "/r-ecosystem/packages/" },
    h("button", {
      type: "button",
      className: "inline-flex flex-shrink-0 items-center rounded-l-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-200 md:hidden"
    }, "R 패키지", h(DownIcon, null)),
    h("div", { className: "relative w-full" },
      h("input", {
        type: "search",
        name: "q",
        className: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600 md:rounded-l-lg",
        placeholder: "패키지명, maintainer 검색"
      }),
      h("button", {
        type: "submit",
        className: "absolute right-0 top-0 inline-flex h-full items-center rounded-r-lg border border-blue-700 bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200",
        "aria-label": "검색"
      }, h(SearchIcon, null))
    )
  );
}

function DesktopNavItem(props) {
  const section = menuSections[props.id];
  return h("span", {
    className: "inline-flex cursor-pointer items-center whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900 hover:text-blue-700",
    onClick: function() { click_dropdown(props.id); },
    role: "button",
    tabIndex: "0",
    onKeyDown: function(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        click_dropdown(props.id);
      }
    }
  }, section.title, h(DownIcon, null));
}

function MobileMenuItem(props) {
  const section = menuSections[props.id];
  return h("div", { className: "w-full" },
    h("button", {
      type: "button",
      className: "flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 text-left text-sm font-semibold text-gray-900 hover:bg-blue-50",
      onClick: function() { click_dropdown(props.id); }
    },
      h("span", { className: "inline-flex items-center gap-2" },
        h("img", { src: section.icon, className: "h-4 w-4", alt: "" }),
        section.title
      ),
      h(DownIcon, null)
    ),
    h("div", { id: "div_menu_mobile_" + props.id, className: "hidden" },
      h("div", { className: "space-y-1 px-5 pb-2" },
        section.items.map(function(item) {
          return h("a", {
            key: item[0],
            href: item[0],
            className: "block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-700"
          }, item[1]);
        })
      )
    )
  );
}

function Div_menu() {
  return h("header", { className: "webr-flowbite-header bg-white text-gray-900 shadow-md" },
    h("nav", { className: "border-b border-gray-200 bg-white" },
      h("div", { className: "mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6" },
        h("a", { href: "/", className: "flex items-center" },
          h("img", { src: WEBR_CDN + "images/logo/logo.png", className: "mr-3 h-10 object-scale-down", alt: "Statground Logo" })
        ),
        h("div", { id: "div_menu_sub_header", className: "flex min-w-0 flex-1 justify-end" },
          h(UtilityBar, { data: { name: window.gv_username || "", role: window.gv_role || "" } })
        ),
        h("button", {
          type: "button",
          className: "hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:inline-flex",
          "aria-label": "Open main menu",
          "aria-controls": "div_menu_mobile",
          "aria-expanded": MenuState.hamburger ? "true" : "false",
          onClick: click_hamburger
        }, h(HamburgerIcon, null))
      )
    ),
    h("nav", { className: "border-b border-gray-200 bg-white" },
      h("div", { className: "mx-auto flex max-w-screen-xl items-center justify-between gap-8 px-4 py-4 md:flex-col md:items-stretch md:px-6" },
        h("div", { className: "flex flex-row flex-wrap items-center gap-7 md:hidden" },
          MENUS.map(function(id) {
            return h(DesktopNavItem, { key: id, id });
          })
        ),
        h(HeaderSearch, null)
      ),
      h("div", { id: "div_menu_mobile", className: "hidden" },
        MENUS.map(function(id) {
          return h(MobileMenuItem, { key: "mobile-" + id, id });
        })
      )
    ),
    MENUS.map(function(id) {
      return h(MegaMenu, { key: "mega-" + id, id });
    })
  );
}

window.WebRMenu = {
  Div_menu,
  get_menu_header,
  click_dropdown
};
