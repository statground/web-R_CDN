function Div_article_read_buttons(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center space-y-2 w-full" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: gv_username == "" ? () => alert("\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.") : () => location.href = init_url + "write/",
      class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full\n								hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
    },
    "\uC0C8 \uAE00 \uC4F0\uAE30"
  ), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: init_url,
      class: "text-gray-900 bg-white border border-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full\n						  focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100"
    },
    "\uBAA9\uB85D\uC73C\uB85C"
  )), props.data.check_reader != "user" ? /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 justify-center items-center gap-2 w-full" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => location.href = init_url + "edit/" + orderID + "/",
      class: "text-green-700 border border-green-700 font-medium rounded-lg text-sm px-5 py-1 text-center w-full\n									   hover:text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300"
    },
    "\uC218\uC815"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => click_btn_delete(),
      class: "text-red-700 border border-red-700 font-medium rounded-lg text-sm px-5 py-1 text-center w-full\n									   hover:text-white hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
    },
    "\uC0AD\uC81C"
  )) : "");
}
