const MenuState = {
  hamburger: false,
  sections: {
    webr: false,
    community: false,
    book: false,
    workshop: false,
    intro: false
  }
};
const MENUS = ["webr", "book", "workshop", "intro"];
const CLASS_PC_OPEN = "mt-1 bg-white border-gray-200 shadow-sm border-y block md:hidden";
const CLASS_MOBILE_OPEN = "flex flex-col w-full justify-center items-start px-[30px] pt-[10px] pb-[20px] space-y-4 border-b-4";
const CLASS_HIDDEN = "hidden";
function closeAllMenus() {
  MENUS.forEach((menu) => {
    MenuState.sections[menu] = false;
    const pc = document.getElementById(`div_megamenu_${menu}`);
    const mobile = document.getElementById(`div_menu_mobile_${menu}`);
    if (pc)
      pc.className = CLASS_HIDDEN;
    if (mobile)
      mobile.className = CLASS_HIDDEN;
  });
}
function click_dropdown(id) {
  if (!id) {
    closeAllMenus();
    return;
  }
  MENUS.forEach((menu) => {
    const isTarget = id === menu;
    const willOpen = isTarget && !MenuState.sections[menu];
    MenuState.sections[menu] = willOpen;
    const pc_element = document.getElementById(`div_megamenu_${menu}`);
    const mobile_element = document.getElementById(`div_menu_mobile_${menu}`);
    if (pc_element)
      pc_element.className = willOpen ? CLASS_PC_OPEN : CLASS_HIDDEN;
    if (mobile_element)
      mobile_element.className = willOpen ? CLASS_MOBILE_OPEN : CLASS_HIDDEN;
  });
}
function click_hamburger() {
  const menuMobile = document.getElementById("div_menu_mobile");
  MenuState.hamburger = !MenuState.hamburger;
  if (menuMobile) {
    menuMobile.className = MenuState.hamburger ? "hidden md:flex md:flex-col md:visible md:mt-[20px]" : "hidden";
  }
}
function isLoginInterstitialPath(path) {
  return path === "/account/" || path === "/account/signup/" || path === "/account/welcome/" || path === "/account/logout/" || path.indexOf("/account/ajax_") === 0;
}
function currentPageLoginURL() {
  const path = window.location.pathname || "/";
  if (isLoginInterstitialPath(path)) {
    return "/account/";
  }
  return "/account/?next=" + encodeURIComponent(path + window.location.search);
}
async function get_menu_header() {
  const mount = document.getElementById("div_menu_sub_header");
  if (!mount)
    return;
  const data = await fetch("/ajax_get_menu_header/", { method: "POST" }).then((res) => res.json()).catch(() => ({ role: "", name: "" }));
  window.gv_role = data["role"] || "";
  console.log("*** role:", window.gv_role);
  function Div_sub_menu_header(props) {
    function Div_sub(props2) {
      return /* @__PURE__ */ React.createElement("a", { href: props2.url, class: "flex flex-row justify-center items-center hover:underline" }, props2.url_image != null && /* @__PURE__ */ React.createElement("img", { src: props2.url_image, class: "size-4 mr-2" }), props2.name);
    }
    const isLoggedIn = (window.gv_username || "") !== "";
    const loginURL = currentPageLoginURL();
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: () => click_dropdown(),
        id: "div_menu_sub_header",
        class: "flex justify-center items-center w-full h-[35px]"
      },
      !isLoggedIn ? /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center text-end text-sm space-x-4 w-full h-full px-[35px]" }, /* @__PURE__ */ React.createElement(Div_sub, { url: loginURL, name: "\uB85C\uADF8\uC778" }), /* @__PURE__ */ React.createElement("span", null, "|"), /* @__PURE__ */ React.createElement(Div_sub, { url: "/account/signup/", name: "\uD68C\uC6D0 \uAC00\uC785" })) : /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center text-end text-sm space-x-4 w-full h-full px-[35px]" }, /* @__PURE__ */ React.createElement(
        Div_sub,
        {
          url: "/account/myinfo/",
          name: props.data.name,
          url_image: "https://cdn.jsdelivr.net/gh/statground/statkiss_CDN/images/svg/header_user.svg"
        }
      ), /* @__PURE__ */ React.createElement("span", null, "|"), /* @__PURE__ */ React.createElement(
        "a",
        {
          href: "/intro/membership/",
          class: "flex flex-row justify-center items-center font-extrabold hover:underline"
        },
        props.data.role,
        props.data.role == "\uC900\uD68C\uC6D0" && /* @__PURE__ */ React.createElement("div", { class: "ml-2 animate-pulse" }, /* @__PURE__ */ React.createElement("span", { class: "font-extrabold text-red-500" }, "(\uC815\uD68C\uC6D0 \uAC00\uC785\uD558\uAE30)"))
      ), /* @__PURE__ */ React.createElement("span", null, "|"), props.data.role == "\uAD00\uB9AC\uC790" && /* @__PURE__ */ React.createElement(Div_sub, { url: "/admin/", name: "Admin Page" }), props.data.role == "\uAD00\uB9AC\uC790" && /* @__PURE__ */ React.createElement("span", null, "|"), /* @__PURE__ */ React.createElement(Div_sub, { url: "/account/logout/", name: "\uB85C\uADF8\uC544\uC6C3" }))
    );
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_sub_menu_header, { data }), mount);
}
function Div_menu() {
  function Div_sub_hamburger() {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        class: "flex items-center hidden md:flex md:visible",
        onClick: () => click_hamburger()
      },
      /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          class: "inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg\n                 hover:bg-gray-100\n                 focus:outline-none focus:ring-2 focus:ring-gray-200",
          "aria-label": "Open main menu",
          "aria-controls": "div_menu_mobile",
          "aria-expanded": MenuState.hamburger ? "true" : "false"
        },
        /* @__PURE__ */ React.createElement(
          "img",
          {
            src: "https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/menu_hamburger.svg",
            class: "w-8 h-8",
            alt: "Menu"
          }
        )
      )
    );
  }
  function Div_sub_menu_pc() {
    function Item(props) {
      return /* @__PURE__ */ React.createElement(
        "span",
        {
          class: "flex flex-row justify-center items-center w-fit px-[24px] h-4/6 text-sm rounded-lg cursor-pointer hover:bg-blue-100",
          onClick: props.onClick,
          role: "button",
          tabindex: "0",
          onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && props.onClick()
        },
        props.name
      );
    }
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-cetner items-center visible md:hidden" }, /* @__PURE__ */ React.createElement(Item, { name: "Web-R \uC811\uC18D", onClick: () => click_dropdown("webr") }), /* @__PURE__ */ React.createElement(Item, { name: "\uCEE4\uBBA4\uB2C8\uD2F0", onClick: () => location.href = "/community/" }), /* @__PURE__ */ React.createElement(Item, { name: "\uB3C4\uC11C", onClick: () => click_dropdown("book") }), /* @__PURE__ */ React.createElement(Item, { name: "\uC6CC\uD06C\uC0F5", onClick: () => click_dropdown("workshop") }), /* @__PURE__ */ React.createElement(Item, { name: "Web-R \uC18C\uAC1C", onClick: () => click_dropdown("intro") }));
  }
  function Div_sub_menu_pc_title(props) {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-center items-center bg-gray-100 border-b border-gray-300 shadow" }, /* @__PURE__ */ React.createElement("p", { class: "text-xs text-gray-700" }, props.title));
  }
  function Div_sub_menu_pc_li(props) {
    return /* @__PURE__ */ React.createElement("li", { class: "flex flex-row justify-center items-center w-full" }, /* @__PURE__ */ React.createElement("a", { href: props.url, target: props.target, class: "px-4 py-2 hover:bg-blue-100" }, props.title));
  }
  function Div_sub_menu_pc_li_img(props) {
    return /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
      "a",
      {
        href: props.url,
        class: "flex flex-col justify-center items-center px-4 py-2 w-full hover:border hover:border-blue-300 hover:bg-blue-100"
      },
      /* @__PURE__ */ React.createElement("img", { src: props.img_url, class: "object-scale-down h-[80px] w-[120px] max-w-full mb-2" }),
      props.title
    ));
  }
  function Div_sub_menu_mobile_title(props) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        class: "flex flex-col justify-center items-start w-full h-[50px] px-[20px] cursor-pointer hover:bg-blue-200",
        onClick: props.onClick
      },
      /* @__PURE__ */ React.createElement("span", { class: "flex flex-row justify-center items-center" }, /* @__PURE__ */ React.createElement("img", { src: props.img_url, class: "w-4 h-4 mr-2" }), props.title)
    );
  }
  function Div_sub_menu_mobile_li(props) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        class: "flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100",
        onClick: () => location.href = props.url
      },
      /* @__PURE__ */ React.createElement("span", { class: "flex flex-row w-full" }, "- ", props.title)
    );
  }
  function Div_sub_menu_mobile_li_img(props) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        class: "flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100",
        onClick: () => location.href = props.url
      },
      /* @__PURE__ */ React.createElement("span", { class: "flex flex-row w-full" }, /* @__PURE__ */ React.createElement("img", { src: props.img_url, class: "w-4 h-4 mr-2" }), props.title)
    );
  }
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col" }, /* @__PURE__ */ React.createElement("div", { onClick: () => click_dropdown(), id: "div_menu_sub_header", class: "w-full" }), /* @__PURE__ */ React.createElement("nav", { class: "flex flex-row justify-between bg-white border-gray-200 h-[50px] px-[200px] sm:px-[50px]" }, /* @__PURE__ */ React.createElement("a", { href: "/", class: "flex items-center text-xl font-bold" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/logo/logo.png",
      class: "object-scale-down h-10",
      alt: "Statground Logo"
    }
  )), /* @__PURE__ */ React.createElement(Div_sub_hamburger, null), /* @__PURE__ */ React.createElement(Div_sub_menu_pc, null)), /* @__PURE__ */ React.createElement("div", { id: "div_megamenu_webr", class: "hidden" }, /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/webr/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/R_logo_black.svg",
      title: "\uBB34\uB8CC \uC11C\uBC84 \uC811\uC18D"
    }
  )), /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/webr/member/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/R_logo.svg",
      title: "\uC815\uD68C\uC6D0 \uC11C\uBC84 \uC811\uC18D"
    }
  )), /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/webr/2.0/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/webr/advanced_webR.png",
      title: "Web-R 2.0"
    }
  )), /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/webr/notebook/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_webr_notebook2.svg",
      title: "Web-R Notebook"
    }
  ))), /* @__PURE__ */ React.createElement(Div_sub_menu_pc_title, { title: "Web-R \uC811\uC18D" })), /* @__PURE__ */ React.createElement("div", { id: "div_megamenu_book", class: "hidden" }, /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/book/001/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_001.jpg",
      title: "\uC758\uD559\uB17C\uBB38 \uC791\uC131\uC744 \uC704\uD55C R\uD1B5\uACC4\uC640 \uADF8\uB798\uD504"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/book/005/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_005.jpg",
      title: "\uC77C\uBC18\uD654\uAC00\uBC95\uBAA8\uD615 \uC18C\uAC1C"
    }
  )), /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/book/002/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_002.jpg",
      title: "R\uC744 \uC774\uC6A9\uD55C \uC870\uAC74\uBD80\uACFC\uC815\uBD84\uC11D"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/book/006/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_006.jpg",
      title: "\uBC11\uBC14\uB2E5\uBD80\uD130 \uC2DC\uC791\uD558\uB294 ROC \uCEE4\uBE0C \uBD84\uC11D"
    }
  )), /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/book/003/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_003.jpg",
      title: "\uC6F9\uC5D0\uC11C \uD074\uB9AD\uB9CC\uC73C\uB85C \uD558\uB294 R\uD1B5\uACC4\uBD84\uC11D"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/book/007/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_007.jpg",
      title: "\uC6F9R\uC744 \uC774\uC6A9\uD55C \uD1B5\uACC4\uBD84\uC11D"
    }
  )), /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/book/004/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_004.jpg",
      title: "Learning ggplot2 Using Shiny App"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/book/008/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_008.jpg",
      title: "\uC758\uB8CC\uC778\uC744 \uC704\uD55C R \uC0DD\uC874\uBD84\uC11D"
    }
  ))), /* @__PURE__ */ React.createElement(Div_sub_menu_pc_title, { title: "\uB3C4\uC11C" })), /* @__PURE__ */ React.createElement("div", { id: "div_megamenu_workshop", class: "hidden" }, /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4 col-start-2" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/workshop/youtube/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_youtube.svg",
      title: "\uC720\uD29C\uBE0C"
    }
  )), /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/workshop/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_workshop.svg",
      title: "\uC6CC\uD06C\uC0F5"
    }
  )))), /* @__PURE__ */ React.createElement("div", { id: "div_megamenu_intro", class: "hidden" }, /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-3 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/intro/notice/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_notice.svg",
      title: "\uACF5\uC9C0\uC0AC\uD56D"
    }
  )), /* @__PURE__ */ React.createElement("ul", { class: "my-4 space-y-4" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_pc_li_img,
    {
      url: "/intro/membership/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_membership.svg",
      title: "\uC815\uD68C\uC6D0 \uAC00\uC785"
    }
  )), /* @__PURE__ */ React.createElement("ul", { class: "my-4" }, /* @__PURE__ */ React.createElement(Div_sub_menu_pc_li, { title: "\uC774\uC6A9 \uC57D\uAD00", url: "/intro/terms/", target: "_self" }), /* @__PURE__ */ React.createElement(Div_sub_menu_pc_li, { title: "\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638 \uBC29\uCE68", url: "/intro/privates/", target: "_self" }), /* @__PURE__ */ React.createElement(Div_sub_menu_pc_li, { title: "\uD658\uBD88 \uADDC\uC815", url: "/intro/refund/", target: "_self" }))), /* @__PURE__ */ React.createElement(Div_sub_menu_pc_title, { title: "Web-R \uC18C\uAC1C" })), /* @__PURE__ */ React.createElement("div", { id: "div_menu_mobile", class: "hidden" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_title,
    {
      title: "Web-R \uC811\uC18D",
      onClick: () => click_dropdown("webr"),
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/R_logo.svg"
    }
  ), /* @__PURE__ */ React.createElement("div", { id: "div_menu_mobile_webr", class: "hidden" }, /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "\uBB34\uB8CC \uC11C\uBC84 \uC811\uC18D", url: "/webr/" }), /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "\uC815\uD68C\uC6D0 \uC11C\uBC84 \uC811\uC18D", url: "/webr/member/" }), /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "Web-R 2.0", url: "/webr/2.0/" }), /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "Web-R Notebook", url: "/webr/notebook/" })), /* @__PURE__ */ React.createElement(
    "a",
    {
      class: "flex flex-col justify-center items-start w-full h-[50px] px-[20px] hover:bg-blue-200",
      href: "/community/"
    },
    /* @__PURE__ */ React.createElement("span", { class: "flex flex-row justify-center items-center" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_free.svg", class: "w-4 h-4 mr-2" }), "\uCEE4\uBBA4\uB2C8\uD2F0")
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_title,
    {
      title: "\uB3C4\uC11C",
      onClick: () => click_dropdown("book"),
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_book.svg"
    }
  ), /* @__PURE__ */ React.createElement("div", { id: "div_menu_mobile_book", class: "hidden" }, /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_li_img,
    {
      title: "\uC758\uD559\uB17C\uBB38 \uC791\uC131\uC744 \uC704\uD55C R\uD1B5\uACC4\uC640 \uADF8\uB798\uD504",
      url: "/book/001/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_001.jpg"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_li_img,
    {
      title: "R\uC744 \uC774\uC6A9\uD55C \uC870\uAC74\uBD80\uACFC\uC815\uBD84\uC11D",
      url: "/book/002/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_002.jpg"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_li_img,
    {
      title: "\uC6F9\uC5D0\uC11C \uD074\uB9AD\uB9CC\uC73C\uB85C \uD558\uB294 R\uD1B5\uACC4\uBD84\uC11D",
      url: "/book/003/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_003.jpg"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_li_img,
    {
      title: "Learning ggplot2 Using Shiny App",
      url: "/book/004/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_004.jpg"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_li_img,
    {
      title: "\uC77C\uBC18\uD654\uAC00\uBC95\uBAA8\uD615 \uC18C\uAC1C",
      url: "/book/005/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_005.jpg"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_li_img,
    {
      title: "\uBC11\uBC14\uB2E5\uBD80\uD130 \uC2DC\uC791\uD558\uB294 ROC \uCEE4\uBE0C \uBD84\uC11D",
      url: "/book/006/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_006.jpg"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_li_img,
    {
      title: "\uC6F9R\uC744 \uC774\uC6A9\uD55C \uD1B5\uACC4\uBD84\uC11D",
      url: "/book/007/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_007.jpg"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_li_img,
    {
      title: "\uC758\uB8CC\uC778\uC744 \uC704\uD55C R \uC0DD\uC874\uBD84\uC11D",
      url: "/book/008/",
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_008.jpg"
    }
  )), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_title,
    {
      title: "\uC6CC\uD06C\uC0F5",
      onClick: () => click_dropdown("workshop"),
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_workshop.svg"
    }
  ), /* @__PURE__ */ React.createElement("div", { id: "div_menu_mobile_workshop", class: "hidden" }, /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "\uC720\uD29C\uBE0C", url: "/workshop/youtube/" }), /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "\uC6CC\uD06C\uC0F5", url: "/workshop/" })), /* @__PURE__ */ React.createElement(
    Div_sub_menu_mobile_title,
    {
      title: "Web-R \uC18C\uAC1C",
      onClick: () => click_dropdown("intro"),
      img_url: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_notice.svg"
    }
  ), /* @__PURE__ */ React.createElement("div", { id: "div_menu_mobile_intro", class: "hidden" }, /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "\uACF5\uC9C0\uC0AC\uD56D", url: "/intro/notice/" }), /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "\uC815\uD68C\uC6D0 \uAC00\uC785", url: "/intro/membership/" }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "\uC774\uC6A9 \uC57D\uAD00", url: "/intro/terms/" }), /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638 \uBC29\uCE68", url: "/intro/privates/" }), /* @__PURE__ */ React.createElement(Div_sub_menu_mobile_li, { title: "\uD658\uBD88 \uADDC\uC815", url: "/intro/refund/" }))));
}
window.WebRMenu = {
  Div_menu,
  get_menu_header,
  click_dropdown
  // if you need manual control elsewhere
};
