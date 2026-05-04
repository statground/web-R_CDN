let data_user = null;
let toggle_click_btn_submit = false;
const class_btn_disabled = "text-gray-100 bg-gray-300 font-medium rounded-xl text-sm w-full h-[48px] hover:bg-gray-200 focus:border focus:border-[#FFFFFF] cursor-not-allowed";
const class_btn_enabled = "text-white bg-blue-500 font-medium rounded-xl text-sm w-full h-[48px] hover:bg-blue-400 focus:border focus:border-[#FFFFFF]";
function Div_btn_submit(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: props.function,
      class: props.class
    },
    props.text
  );
}
function Div_btn_submit_spinner(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: props.function,
      class: props.class
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        class: "inline w-4 h-4 mr-3 text-white animate-spin",
        "aria-hidden": "true",
        role: "status",
        viewBox: "0 0 100 101",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "#E5E7EB" }),
      /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentColor" })
    ),
    props.text
  );
}
function Div_desc_err_msg(props) {
  return /* @__PURE__ */ React.createElement("span", { class: "text-[#FA5252] text-[12px] font-[500]" }, props.text);
}
function Div_main_header() {
  return /* @__PURE__ */ React.createElement("div", { class: "text-lg font-bold" }, "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD/\uCC3E\uAE30 (2/2)");
}
function Div_main_skeleton() {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px]\n						sm:w-[380px] sm:p-[16px]" }, /* @__PURE__ */ React.createElement(Div_main_header, null), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center text-start w-full" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      "aria-hidden": "true",
      class: "w-8 h-8 text-gray-200 animate-spin fill-blue-600 mb-4",
      viewBox: "0 0 100 101",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    },
    /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }),
    /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentFill" })
  ), "Verifying authentication code"), /* @__PURE__ */ React.createElement("div", { class: "flex justify-center items-center w-full" }, /* @__PURE__ */ React.createElement("svg", { width: "420", height: "2", viewBox: "0 0 420 2", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M0 1H420", stroke: "#262626" })))));
}
function Div_main_Error(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px]\n						sm:w-[380px] sm:p-[16px]" }, /* @__PURE__ */ React.createElement(Div_main_header, null), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center text-start w-full" }, props.text), /* @__PURE__ */ React.createElement("div", { id: "btn_submit", class: "w-full" }, /* @__PURE__ */ React.createElement(Div_btn_submit, { class: class_btn_enabled, function: () => location.href = "/account/change_password/", text: "\uC7AC\uC2DC\uB3C4" })), /* @__PURE__ */ React.createElement("div", { class: "flex justify-center items-center w-full" }, /* @__PURE__ */ React.createElement("svg", { width: "420", height: "2", viewBox: "0 0 420 2", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M0 1H420", stroke: "#262626" })))));
}
function Div_main() {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px]\n						sm:w-[380px] sm:p-[16px]" }, /* @__PURE__ */ React.createElement(Div_main_header, null), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center text-start w-full space-y-[12px]" }, /* @__PURE__ */ React.createElement("div", { class: "w-full space-y-[8px]" }, /* @__PURE__ */ React.createElement("span", { class: "font-[500] text-[14px] w-full text-start" }, "\uBE44\uBC00\uBC88\uD638"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      id: "txt_password",
      class: "bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full\n									  focus:ring-gray-200 focus:border-gray-200",
      placeholder: "",
      onkeydown: () => input_checker(),
      onKeyUp: () => input_checker(),
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { class: "w-full space-y-[8px]" }, /* @__PURE__ */ React.createElement("span", { class: "font-[500] text-[14px] w-full text-start" }, "\uBE44\uBC00\uBC88\uD638 \uD655\uC778"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      id: "txt_password_confirm",
      class: "bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full\n									  focus:ring-gray-200 focus:border-gray-200",
      placeholder: "",
      onkeydown: () => input_checker(),
      onKeyUp: () => input_checker(),
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { id: "desc_password_msg", class: "hidden" }), /* @__PURE__ */ React.createElement("div", { id: "btn_submit", class: "w-full" }, /* @__PURE__ */ React.createElement(Div_btn_submit, { class: class_btn_disabled, function: null, text: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD" }))), /* @__PURE__ */ React.createElement("div", { class: "flex justify-center items-center w-full" }, /* @__PURE__ */ React.createElement("svg", { width: "420", height: "2", viewBox: "0 0 420 2", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M0 1H420", stroke: "#262626" })))));
}
function input_checker() {
  const class_desc_msg = "flex flex-row justify-start items-center w-full";
  const txt_password = document.getElementById("txt_password").value;
  const txt_password_confirm = document.getElementById("txt_password_confirm").value;
  document.getElementById("desc_password_msg").className = "hidden";
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Div_btn_submit, { class: class_btn_disabled, function: null, text: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD" }),
    document.getElementById("btn_submit")
  );
  if (txt_password.length < 8) {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uBE44\uBC00\uBC88\uD638\uB294 \uCD5C\uC18C 8\uC790 \uC774\uC0C1 \uC785\uB825\uD574\uC57C \uD569\uB2C8\uB2E4." }), document.getElementById("desc_password_msg"));
  } else if (txt_password_confirm.length < 8) {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778\uC740 \uCD5C\uC18C 8\uC790 \uC774\uC0C1 \uC785\uB825\uD574\uC57C \uD569\uB2C8\uB2E4." }), document.getElementById("desc_password_msg"));
  } else if (txt_password != txt_password_confirm) {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778\uC774 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." }), document.getElementById("desc_password_msg"));
  } else {
    ReactDOM.render(
      /* @__PURE__ */ React.createElement(Div_btn_submit, { class: class_btn_enabled, function: () => click_btn_submit(), text: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD" }),
      document.getElementById("btn_submit")
    );
  }
}
async function check_auth_code() {
  try {
    const inputData = new FormData();
    inputData.append("auth_code", auth_code);
    data_user = await fetch("/account/ajax_check_auth_code/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: inputData
    }).then((res) => res.json());
    if (!data_user || data_user.status == "EXPIRED" || data_user.checker == "EXPIRED") {
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_Error, { text: "\uC778\uC99D \uCF54\uB4DC\uAC00 \uB9CC\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4." }), document.getElementById("div_main"));
    } else {
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
    }
  } catch (e) {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_Error, { text: "\uC778\uC99D \uCF54\uB4DC\uB97C \uD655\uC778\uD558\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4." }), document.getElementById("div_main"));
  }
}
async function click_btn_submit() {
  if (toggle_click_btn_submit) {
    return;
  }
  toggle_click_btn_submit = true;
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Div_btn_submit_spinner, { class: class_btn_enabled + " cursor-not-allowed", function: null, text: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD" }),
    document.getElementById("btn_submit")
  );
  try {
    const inputData = new FormData();
    inputData.append("email", data_user.email_receiver);
    inputData.append("password", document.getElementById("txt_password").value.trim());
    const data = await fetch("/account/ajax_password_change/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: inputData
    }).then((res) => res.json());
    if (data.checker == "SUCCESS") {
      alert("\uBE44\uBC00\uBC88\uD638\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
      location.href = "/account/";
      return;
    } else {
      alert("\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD\uC744 \uC2E4\uD328\uD558\uC600\uC2B5\uB2C8\uB2E4.");
    }
  } catch (e) {
    alert("\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
  } finally {
    toggle_click_btn_submit = false;
    if (document.getElementById("btn_submit")) {
      ReactDOM.render(
        /* @__PURE__ */ React.createElement(Div_btn_submit, { class: class_btn_enabled, function: () => click_btn_submit(), text: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD" }),
        document.getElementById("btn_submit")
      );
    }
  }
}
function set_main() {
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_skeleton, null), document.getElementById("div_main"));
  check_auth_code();
}
