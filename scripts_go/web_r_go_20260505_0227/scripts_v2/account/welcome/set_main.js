function set_main() {
  function Div_main() {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full py-16 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-center items-center space-x-2" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/statkiss_CDN/images/svg/waving_hand.svg", class: "w-16 h-16 mr-2" }), /* @__PURE__ */ React.createElement("span", { class: "text-2xl font-bold" }, "\uD658\uC601\uD569\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("span", { class: "text-xl" }, "\uD558\uB2E8\uC758 Home \uBC84\uD2BC\uC744 \uD074\uB9AD\uD558\uC5EC, Web-R\uC744 \uC2DC\uC791\uD574\uBCF4\uC138\uC694."), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => location.href = "/",
        class: "py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-sm w-auto text-center\n							   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
      },
      "Home"
    ));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
}
