let toggle_click_submit = false;
function Div_buttons() {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => click_btn_submit(),
      class: "text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full\n						hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
    },
    "\uC218\uC815 \uC644\uB8CC"
  ), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "/account/myinfo/",
      class: "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 w-full overflow-hidden text-sm font-medium text-gray-900 rounded-lg\n					group bg-gradient-to-br from-cyan-500 to-blue-500\n					group-hover:from-cyan-500 group-hover:to-blue-500\n					hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200"
    },
    /* @__PURE__ */ React.createElement("span", { class: "relative text-center px-5 py-2.5 w-full transition-all ease-in duration-75 bg-white rounded-lg group-hover:bg-opacity-0" }, "\uB3CC\uC544\uAC00\uAE30")
  ));
}
function Div_buttons_loading() {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      class: "text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full cursor-not-allowed\n						   hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
    },
    /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", role: "status", class: "inline w-4 h-4 me-3 text-white animate-spin", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "#E5E7EB" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentColor" })),
    "\uC218\uC815 \uC644\uB8CC"
  ), /* @__PURE__ */ React.createElement("a", { class: "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 w-full overflow-hidden text-sm font-medium text-gray-900 rounded-lg cursor-not-allowed\n					group bg-gradient-to-br from-cyan-500 to-blue-500\n					group-hover:from-cyan-500 group-hover:to-blue-500\n					hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200" }, /* @__PURE__ */ React.createElement("span", { class: "relative text-center px-5 py-2.5 w-full transition-all ease-in duration-75 bg-white rounded-lg group-hover:bg-opacity-0" }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", role: "status", class: "inline w-4 h-4 me-3 text-gray-200 animate-spin", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "#1C64F2" })), "\uB3CC\uC544\uAC00\uAE30")));
}
async function get_userinfo() {
  const class_tab_active = "inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active cursor-pointer";
  function Div_main_userinfo(props) {
    return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-5 justify-center items-start gap-8 w-full md:grid-cols-1" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center border border-blue-100 rounded-xl w-full px-4 py-8 space-y-2" }, /* @__PURE__ */ React.createElement("p", { class: "text-sm" }, props.data.email), /* @__PURE__ */ React.createElement("p", { class: "text-2xl font-extrabold" }, props.data.name), /* @__PURE__ */ React.createElement("p", { class: "text-sm" }, props.data.realname, "\u3000|\u3000", props.data.gender), /* @__PURE__ */ React.createElement("div", { class: "py-4" }), /* @__PURE__ */ React.createElement("p", { class: "text-lg font-extrabold" }, props.data.role), /* @__PURE__ */ React.createElement("p", { class: "text-sm" }, "\uAC00\uC785 \uC77C\uC790: ", props.data.date_joined), props.data.expired_at == null ? /* @__PURE__ */ React.createElement("p", { class: "text-sm" }, "\uD68C\uC6D0\uB4F1\uAE09 \uB9CC\uB8CC\uC77C: \uBB34\uC81C\uD55C") : /* @__PURE__ */ React.createElement("p", { class: "text-sm" }, "\uD68C\uC6D0\uB4F1\uAE09 \uB9CC\uB8CC\uC77C: ", props.data.expired_at), /* @__PURE__ */ React.createElement("div", { class: "py-4" }), props.data.email_subscription == 1 ? /* @__PURE__ */ React.createElement("p", { class: "text-sm text-green-500" }, "\uC774\uBA54\uC77C \uC218\uC2E0 \uD5C8\uC6A9") : /* @__PURE__ */ React.createElement("p", { class: "text-sm text-gray-500" }, "\uC774\uBA54\uC77C \uC218\uC2E0 \uAC70\uBD80"), /* @__PURE__ */ React.createElement("div", { class: "py-4" }), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_buttons" }, /* @__PURE__ */ React.createElement(Div_buttons, null))), /* @__PURE__ */ React.createElement("div", { class: "col-span-4 flex flex-col justify-start items-start rounded-xl w-full md:col-span-1" }, /* @__PURE__ */ React.createElement("ul", { class: "flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full" }, /* @__PURE__ */ React.createElement("li", { class: "me-2" }, /* @__PURE__ */ React.createElement("p", { class: class_tab_active }, "\uB0B4 \uC815\uBCF4 \uC218\uC815"))), /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-2 gap-4 justify-center items-center w-full p-4" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col w-full" }, /* @__PURE__ */ React.createElement("label", { for: "txt_name", class: "block mb-2 text-sm font-medium text-gray-900" }, "\uB2C9\uB124\uC784"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        id: "txt_name",
        class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
      }
    )), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col w-full" }, /* @__PURE__ */ React.createElement("label", { for: "txt_realname", class: "block mb-2 text-sm font-medium text-gray-900" }, "\uBCF8\uBA85"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        id: "txt_realname",
        class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
      }
    )), /* @__PURE__ */ React.createElement("div", { class: "col-span-2 flex flex-col w-full" }, /* @__PURE__ */ React.createElement("label", { for: "txt_email", class: "block mb-2 text-sm font-medium text-gray-900" }, "\uC774\uBA54\uC77C (\uB85C\uADF8\uC778 \uD560 \uB54C \uACC4\uC815\uC774 \uD568\uAED8 \uBCC0\uACBD\uB429\uB2C8\uB2E4.)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        id: "txt_email",
        class: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
      }
    )), /* @__PURE__ */ React.createElement("div", { class: "col-span-2 flex flex-col w-full" }, /* @__PURE__ */ React.createElement("h3", { class: "block mb-2 text-sm font-medium text-gray-900" }, "\uC131\uBCC4"), /* @__PURE__ */ React.createElement("ul", { class: "flex flex-row justify-center items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg space-x-4" }, /* @__PURE__ */ React.createElement("li", { class: "w-full border-b border-gray-200 sm:border-b-0 sm:border-r" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-center ps-3" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "rad_gender_male",
        type: "radio",
        value: "Male",
        name: "rad_gender",
        class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
      }
    ), /* @__PURE__ */ React.createElement(
      "label",
      {
        for: "rad_gender_male",
        class: "w-full py-3 ms-2 text-sm font-medium text-gray-900"
      },
      "\uB0A8\uC131"
    ))), /* @__PURE__ */ React.createElement("li", { class: "w-full border-b border-gray-200 sm:border-b-0 sm:border-r" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-center ps-3" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "rad_gender_female",
        type: "radio",
        value: "Female",
        name: "rad_gender",
        class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
      }
    ), /* @__PURE__ */ React.createElement("label", { for: "rad_gender_female", class: "w-full py-3 ms-2 text-sm font-medium text-gray-900" }, "\uC5EC\uC131"))))), /* @__PURE__ */ React.createElement("div", { class: "col-span-2 flex flex-col w-full" }, /* @__PURE__ */ React.createElement("h3", { class: "block mb-2 text-sm font-medium text-gray-900" }, "\uC774\uBA54\uC77C \uC218\uC2E0 \uD5C8\uC6A9"), /* @__PURE__ */ React.createElement("ul", { class: "flex flex-row justify-center items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg space-x-4" }, /* @__PURE__ */ React.createElement("li", { class: "w-full border-b border-gray-200 sm:border-b-0 sm:border-r" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-center ps-3" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "rad_email_subscription_agree",
        type: "radio",
        value: 1,
        name: "rad_email_subscription",
        class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
      }
    ), /* @__PURE__ */ React.createElement(
      "label",
      {
        for: "rad_email_subscription_agree",
        class: "w-full py-3 ms-2 text-sm font-medium text-gray-900"
      },
      "\uD5C8\uC6A9"
    ))), /* @__PURE__ */ React.createElement("li", { class: "w-full border-b border-gray-200 sm:border-b-0 sm:border-r" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-center ps-3" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "rad_email_subscription_deny",
        type: "radio",
        value: 0,
        name: "rad_email_subscription",
        class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
      }
    ), /* @__PURE__ */ React.createElement("label", { for: "rad_email_subscription_deny", class: "w-full py-3 ms-2 text-sm font-medium text-gray-900" }, "\uAC70\uBD80"))))))));
  }
  const data = await fetch("/account/ajax_get_myinfo/", { method: "POST" }).then((res) => res.json());
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_userinfo, { data }), document.getElementById("div_main_userinfo"));
  document.getElementById("txt_name").value = data.name;
  document.getElementById("txt_realname").value = data.realname;
  document.getElementById("txt_email").value = data.email;
  if (data.gender == "Male") {
    document.getElementById("rad_gender_male").checked = true;
  } else if (data.gender == "Female") {
    document.getElementById("rad_gender_female").checked = true;
  }
  if (data.email_subscription == 0) {
    document.getElementById("rad_email_subscription_deny").checked = true;
  } else {
    document.getElementById("rad_email_subscription_agree").checked = true;
  }
}
async function click_btn_submit() {
  const txt_name = document.getElementById("txt_name").value.trim();
  const txt_realname = document.getElementById("txt_realname").value.trim();
  const txt_email = document.getElementById("txt_email").value.trim();
  let rad_gender = null;
  if (document.getElementById("rad_gender_male").checked) {
    rad_gender = "Male";
  } else {
    rad_gender = "Female";
  }
  let rad_email_subscription = null;
  if (document.getElementById("rad_email_subscription_deny").checked) {
    rad_email_subscription = 0;
  } else {
    rad_email_subscription = 1;
  }
  if (toggle_click_submit) {
    return;
  }
  toggle_click_submit = true;
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_buttons_loading, null), document.getElementById("div_buttons"));
  try {
    if (txt_name == null || txt_name == "") {
      alert("\uB2C9\uB124\uC784\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
    } else if (txt_realname == null || txt_realname == "") {
      alert("\uBCF8\uBA85\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
    } else if (txt_email == null || txt_email == "") {
      alert("\uC774\uBA54\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
    } else {
      const request_data = new FormData();
      request_data.append("txt_name", txt_name);
      request_data.append("txt_realname", txt_realname);
      request_data.append("txt_email", txt_email);
      request_data.append("rad_gender", rad_gender);
      request_data.append("rad_email_subscription", rad_email_subscription);
      const data = await fetch("/account/ajax_update_userinfo/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
      }).then((res) => res.json());
      if (data.checker == "EXIST") {
        alert("\uBCC0\uACBD\uD558\uACE0\uC790 \uD558\uB294 \uC774\uBA54\uC77C\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4.");
      } else if (data.checker == "NOTEXIST") {
        alert("\uC774\uBA54\uC77C\uC774 \uBCC0\uACBD\uB418\uC5C8\uC73C\uBBC0\uB85C, \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694.");
        location.href = "/account/logout/";
        return;
      } else {
        location.href = "/account/myinfo/";
        return;
      }
    }
  } finally {
    toggle_click_submit = false;
    if (document.getElementById("div_buttons")) {
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_buttons, null), document.getElementById("div_buttons"));
    }
  }
}
function set_main() {
  function Div_main() {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8" }, /* @__PURE__ */ React.createElement(Div_page_header, { title: "\uB0B4 \uC815\uBCF4" }), /* @__PURE__ */ React.createElement("div", { class: "flex w-full", id: "div_main_userinfo" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4 mb-4 animate-pulse" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-center items-center space-x-2" }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", class: "w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentFill" })), /* @__PURE__ */ React.createElement("p", null, "\uD68C\uC6D0 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 mx-auto bg-gray-300 rounded-full w-1/4" }), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 mx-auto bg-gray-300 rounded-full w-1/2" }), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 mx-auto bg-gray-300 rounded-full w-1/3" }), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 mx-auto bg-gray-300 rounded-full w-1/2" }), /* @__PURE__ */ React.createElement("div", { class: "flex items-center justify-center mt-4" }, /* @__PURE__ */ React.createElement("svg", { class: "w-8 h-8 text-gray-200 me-4", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 20 20" }, /* @__PURE__ */ React.createElement("path", { d: "M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" })), /* @__PURE__ */ React.createElement("div", { class: "w-20 h-2.5 bg-gray-200 rounded-full me-3" }), /* @__PURE__ */ React.createElement("div", { class: "w-24 h-2 bg-gray-200 rounded-full" })), /* @__PURE__ */ React.createElement("span", { class: "sr-only" }, "Loading..."))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
  get_userinfo();
}
