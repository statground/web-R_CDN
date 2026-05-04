function Div_main(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4 md" }, /* @__PURE__ */ React.createElement("div", { id: "div_title", class: "w-full" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "\uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.",
      id: "txt_title",
      name: "txt_title",
      class: "w-full h-[48px] rounded-lg resize-none scroll-hide \n							  text-start text-[14px] font-[500] border-gray-500\n							  focus:ring-gray-700 focus:border-gray-700"
    }
  )), /* @__PURE__ */ React.createElement("div", { id: "div_checker", class: "flex flex-row justify-end items-center w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-center mb-4" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "chk_secret",
      type: "checkbox",
      value: "",
      class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded \n								  focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
    }
  ), /* @__PURE__ */ React.createElement("label", { for: "chk_secret", class: "ms-2 text-sm font-medium text-gray-900" }, "\uBE44\uBC00\uAE00\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"))), /* @__PURE__ */ React.createElement("div", { id: "div_editor", class: "w-full" }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      class: "flex flex-row justify-center items-center py-1.5 px-5 text-white \n							bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto\n							hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
      onClick: () => document.getElementById("id_file_upload").click()
    },
    /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/file_upload.svg", class: "w-4 h-4 mr-2" }),
    "\uD30C\uC77C \uCCA8\uBD80\uD558\uAE30"
  ), /* @__PURE__ */ React.createElement("p", { id: "txt_filename" }), /* @__PURE__ */ React.createElement("p", { id: "txt_file_delete", class: "hidden", onClick: () => click_delete_file() }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/trash.svg", class: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_button_list" }, /* @__PURE__ */ React.createElement(Div_button, null)));
}
