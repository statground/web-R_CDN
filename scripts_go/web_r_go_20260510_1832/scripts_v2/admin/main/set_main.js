function Div_operation_menu() {
  function Div_menu_button(props) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => location.href = props.url,
        class: "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200\n						focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
      },
      props.name
    );
  }
  var date = /* @__PURE__ */ new Date();
  return /* @__PURE__ */ React.createElement("div", { class: "md:col-span-2 justify-center item-center" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row flex-wrap w-full md:flex-col md:w-48 item-center" }, /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uCCAB \uD654\uBA74", url: "/admin/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uD65C\uC131 \uC0AC\uC6A9\uC790", url: "/admin/active_users/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "Web-R \uC811\uC18D \uD604\uD669", url: "/admin/webr/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uBC29\uBB38 \uD604\uD669", url: "/admin/visitors/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uD68C\uC6D0 \uD604\uD669", url: "/admin/members/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uACB0\uC81C \uD604\uD669", url: "/admin/payments/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uC815\uC0B0\uC561 \uC870\uD68C", url: "/admin/balance_account/" + date.getFullYear().toString() + "/" + (date.getMonth() + 1).toString() + "/" })));
}
function Div_sub_title(props) {
  return /* @__PURE__ */ React.createElement("h5", { class: "mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900" }, /* @__PURE__ */ React.createElement("span", { class: "text-blue-600" }, props.title));
}
function Div_sub_card_skeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col items-center justify-center" }, /* @__PURE__ */ React.createElement("dt", { class: "text-3xl font-extrabold" }, /* @__PURE__ */ React.createElement("div", { class: "h-5 bg-gray-300 rounded-full w-48 mb-4" })), /* @__PURE__ */ React.createElement("dd", { class: "font-light text-gray-500" }, props.title));
}
function Div_main_skeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-1 md:grid-cols-12 justify-center item-center w-full px-[10px] py-[20px] md:px-[100px]" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { class: "md:col-span-10 justify-center item-center" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_usage",
      name: "div_statistics_usage",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uC774\uC6A9 \uD604\uD669" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-1 w-full md:grid-cols-3 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC77C \uD3C9\uADE0 \uD398\uC774\uC9C0 \uBDF0" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC77C \uD3C9\uADE0 \uC811\uC18D\uC790 \uC218" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC774\uBC88 \uB2EC \uAC00\uC785\uC790 \uC218" })))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_payments",
      name: "div_statistics_payments",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uACB0\uC81C \uD604\uD669" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-1 w-full md:grid-cols-3 gap-8 pt-8 mx-auto text-gray-900 md:pt-4" }, /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uCD1D \uACB0\uC81C" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uD68C\uC6D0 \uC5C5\uADF8\uB808\uC774\uB4DC \uACB0\uC81C" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC138\uBBF8\uB098 \uACB0\uC81C" })), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-1 w-full md:grid-cols-5 gap-8 pt-8 mx-auto text-gray-900 md:pt-4" }, /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uBD80\uAC00\uC138 (10%)" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20 \uC218\uC218\uB8CC (3.63%)" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uD1B5\uACC4\uB9C8\uB2F9 \uC218\uC218\uB8CC (10%)" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uAE30\uD0C0\uC18C\uB4DD \uC138\uAE08 (8.8%)" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC815\uC0B0\uC561" })))
  )));
}
function get_main() {
  function Div_main(props) {
    return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-1 md:grid-cols-12 justify-center item-center w-full px-[10px] py-[20px] md:px-[100px]" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { class: "md:col-span-10 justify-center item-center" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/engineer.svg", class: "size-16" }), /* @__PURE__ */ React.createElement("p", null, "\uAD00\uB9AC\uC790 \uD654\uBA74\uC785\uB2C8\uB2E4. \uC6D0\uD558\uB294 \uBA54\uB274\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694."))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
}
async function set_main() {
  function Div_check_admin() {
    return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4 md" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", class: "w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentFill" })), /* @__PURE__ */ React.createElement("p", null, "\uAD00\uB9AC\uC790 \uC5EC\uBD80\uB97C \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.")));
  }
  function Div_main_stop() {
    return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/stop.svg", class: "size-16" }), /* @__PURE__ */ React.createElement("p", null, "\uAD00\uB9AC\uC790\uB97C \uC704\uD55C \uBA54\uB274\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: "/",
        class: "text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px]\n							  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
      },
      "\uCCAB \uD654\uBA74\uC73C\uB85C"
    )));
  }
  const username = window.gv_username || "";
  if (!username) {
    location.href = "/";
    return;
  }
  const mount = document.getElementById("div_main");
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_check_admin, null), mount);
  try {
    const headerData = await fetch("/ajax_get_menu_header/", { method: "POST" }).then((res) => res.json());
    const role = headerData && headerData.role ? headerData.role : "";
    window.gv_role = role;
    if (role === "\uAD00\uB9AC\uC790") {
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_skeleton, null), mount);
      await get_main();
    } else {
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_stop, null), mount);
    }
  } catch (error) {
    console.error(error);
    mount.innerHTML = '<div class="text-center text-gray-500 py-10">\uAD00\uB9AC\uC790 \uC5EC\uBD80\uB97C \uD655\uC778\uD558\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.</div>';
  }
}
