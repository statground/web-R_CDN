function set_main() {
  const QuickCard = ({ title, desc, href, icon }) => /* @__PURE__ */ React.createElement(
    "a",
    {
      href,
      class: "flex flex-col justify-between items-start w-full h-full p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-blue-300 transition"
    },
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center w-full space-x-3 mb-4" }, /* @__PURE__ */ React.createElement("img", { src: icon, class: "w-6 h-6 object-cover rounded" }), /* @__PURE__ */ React.createElement("h3", { class: "text-lg font-extrabold text-gray-900" }, title)),
    /* @__PURE__ */ React.createElement("p", { class: "text-sm text-gray-600" }, desc)
  );
  const ExternalLink = ({ title, href }) => /* @__PURE__ */ React.createElement(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      class: "text-blue-700 hover:underline"
    },
    title
  );
  function Div_main() {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-xl mx-auto md:px-8 space-y-8" }, /* @__PURE__ */ React.createElement("div", { class: "w-full max-w-screen-sm" }, /* @__PURE__ */ React.createElement(Div_page_header, { title: "Web-R \uC18C\uAC1C", subtitle: "\uC11C\uBE44\uC2A4 \uC548\uB0B4" }), /* @__PURE__ */ React.createElement("p", { class: "text-gray-600 leading-7" }, "\uD604\uC7AC Web-R \uC18C\uAC1C \uC601\uC5ED\uC758 \uC815\uBCF4\uAD6C\uC870\uB97C \uAE30\uC900\uC73C\uB85C, \uC790\uC8FC \uC774\uB3D9\uD558\uB294 \uACBD\uB85C\uB97C \uD55C \uD654\uBA74\uC5D0\uC11C \uBC14\uB85C \uC811\uADFC\uD560 \uC218 \uC788\uB3C4\uB85D \uC815\uB9AC\uD588\uC2B5\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("section", { class: "w-full max-w-screen-sm space-y-4" }, /* @__PURE__ */ React.createElement("h2", { class: "text-2xl font-extrabold text-gray-900" }, "Web-R \uC811\uC18D"), /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-3 gap-4 md:grid-cols-1" }, /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "\uBB34\uB8CC \uC11C\uBC84 \uC811\uC18D",
        desc: "\uAE30\uBCF8 Web-R \uC11C\uBC84\uC5D0 \uC811\uC18D\uD569\uB2C8\uB2E4.",
        href: "/webr/",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/R_logo.svg"
      }
    ), /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "\uC815\uD68C\uC6D0 \uC11C\uBC84 \uC811\uC18D",
        desc: "\uC815\uD68C\uC6D0 \uC804\uC6A9 \uC11C\uBC84\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.",
        href: "/webr/member/",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/R_logo.svg"
      }
    ), /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "Web-R Notebook",
        desc: "\uBE0C\uB77C\uC6B0\uC800 \uAE30\uBC18 Notebook \uD658\uACBD\uC73C\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.",
        href: "/webr/notebook/",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/R_logo.svg"
      }
    ))), /* @__PURE__ */ React.createElement("section", { class: "w-full max-w-screen-sm space-y-4" }, /* @__PURE__ */ React.createElement("h2", { class: "text-2xl font-extrabold text-gray-900" }, "\uC548\uB0B4 \uBC0F \uC815\uCC45"), /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 gap-4 md:grid-cols-1" }, /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "\uACF5\uC9C0\uC0AC\uD56D",
        desc: "\uC11C\uBE44\uC2A4 \uACF5\uC9C0\uC640 \uC6B4\uC601 \uC548\uB0B4\uB97C \uD655\uC778\uD569\uB2C8\uB2E4.",
        href: "/intro/notice/",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_notice.svg"
      }
    ), /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "\uC815\uD68C\uC6D0 \uAC00\uC785",
        desc: "\uC815\uD68C\uC6D0 / VIP / \uAE30\uAD00\uD68C\uC6D0 \uAC00\uC785 \uC548\uB0B4 \uBC0F \uACB0\uC81C\uB97C \uC9C4\uD589\uD569\uB2C8\uB2E4.",
        href: "/intro/membership/",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_notice.svg"
      }
    ), /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "\uC11C\uBE44\uC2A4 \uC774\uC6A9\uC57D\uAD00",
        desc: "\uC11C\uBE44\uC2A4 \uC774\uC6A9\uC57D\uAD00\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.",
        href: "/intro/terms/",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_notice.svg"
      }
    ), /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638 \uBC29\uCE68",
        desc: "\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638 \uBC29\uCE68\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.",
        href: "/intro/privates/",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_notice.svg"
      }
    ))), /* @__PURE__ */ React.createElement("section", { class: "w-full max-w-screen-sm space-y-4" }, /* @__PURE__ */ React.createElement("h2", { class: "text-2xl font-extrabold text-gray-900" }, "\uD568\uAED8 \uBCF4\uAE30"), /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-3 gap-4 md:grid-cols-1" }, /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "\uCEE4\uBBA4\uB2C8\uD2F0",
        desc: "\uC790\uC720 \uAC8C\uC2DC\uD310 / \uBB3B\uACE0 \uB2F5\uD558\uAE30\uC640 R-Blogger \uAE00\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.",
        href: "/community/",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/menu_free.svg"
      }
    ), /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "\uC758\uD559\uB17C\uBB38 \uC791\uC131\uC744 \uC704\uD55C R\uD1B5\uACC4\uC640 \uADF8\uB798\uD504",
        desc: "\uB300\uD45C \uB3C4\uC11C \uC18C\uAC1C \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.",
        href: "/book/?sub=001",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_001.jpg"
      }
    ), /* @__PURE__ */ React.createElement(
      QuickCard,
      {
        title: "R\uC744 \uC774\uC6A9\uD55C \uC870\uAC74\uBD80\uACFC\uC815\uBD84\uC11D",
        desc: "\uB300\uD45C \uB3C4\uC11C \uC18C\uAC1C \uD398\uC774\uC9C0\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.",
        href: "/book/?sub=002",
        icon: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_002.jpg"
      }
    ))), /* @__PURE__ */ React.createElement("section", { class: "w-full max-w-screen-sm border border-gray-200 rounded-xl p-6 bg-white space-y-3" }, /* @__PURE__ */ React.createElement("h2", { class: "text-xl font-extrabold text-gray-900" }, "\uC678\uBD80 \uB9C1\uD06C"), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start space-y-2 text-sm" }, /* @__PURE__ */ React.createElement(ExternalLink, { title: "\uB2E4\uC74C \uCE74\uD398 Biometrika", href: "https://cafe.daum.net/biometrika" }), /* @__PURE__ */ React.createElement(ExternalLink, { title: "\uD1B5\uACC4\uB9C8\uB2F9", href: "https://www.statground.net" }), /* @__PURE__ */ React.createElement(ExternalLink, { title: "\uD1B5\uACC4\uB9C8\uB2F9 \uD398\uC774\uC2A4\uBD81 \uADF8\uB8F9", href: "https://www.facebook.com/groups/statground" }), /* @__PURE__ */ React.createElement(ExternalLink, { title: "Futuredu", href: "https://www.futuredu.kr" }))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
}
window.set_main = set_main;
