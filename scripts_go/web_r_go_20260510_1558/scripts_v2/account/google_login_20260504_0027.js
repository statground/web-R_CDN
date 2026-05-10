let toggle_btn_submit = false;
const class_btn_disabled = "text-gray-100 bg-gray-300 font-medium rounded-xl text-sm w-full h-[48px] hover:bg-gray-200 focus:border focus:border-[#FFFFFF] cursor-not-allowed";
const class_btn_enabled = "text-white bg-blue-500 font-medium rounded-xl text-sm w-full h-[48px] hover:bg-blue-400 focus:border focus:border-[#FFFFFF]";
function webrLoginGlobals() {
  return window.__webr_globals__ || {};
}
function webrLoginText(value) {
  return String(value == null ? "" : value).trim();
}
function getCookie(name) {
  const prefix = name + "=";
  return document.cookie.split(";").map((part) => part.trim()).reduce((found, part) => {
    if (found)
      return found;
    return part.startsWith(prefix) ? decodeURIComponent(part.slice(prefix.length)) : "";
  }, "");
}
function webrLoginNext() {
  const next = webrLoginText(webrLoginGlobals().google_next);
  return next || "/";
}
function webrAuthPage() {
  return webrLoginText(webrLoginGlobals().auth_page) === "signup" ? "signup" : "login";
}
function webrGoogleFlow() {
  return webrLoginText(webrLoginGlobals().google_flow) || webrAuthPage();
}
function email_form_check(id = "txt_email") {
  const email = document.getElementById(id).value.trim();
  const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,}$/i;
  if (email == "" || email == null) {
    return "NOT EXIST";
  } else if (!regExp.test(email)) {
    return "FAILED";
  }
  return "SUCCESS";
}
function password_form_check(id = "txt_password", max_len = 8) {
  const passwd = document.getElementById(id).value.trim();
  if (passwd == "" || passwd == null) {
    return "NOT EXIST";
  } else if (passwd.length < max_len) {
    return "FAILED";
  }
  return "SUCCESS";
}
function emailLoginReady() {
  return email_form_check("txt_email") === "SUCCESS" && password_form_check("txt_password") === "SUCCESS";
}
function handleEmailLoginInput(event) {
  input_checker();
  if (event && event.type === "keydown" && event.key === "Enter") {
    event.preventDefault();
    if (emailLoginReady()) {
      click_btn_submit();
    }
  }
}
function Div_btn_submit(props) {
  return /* @__PURE__ */ React.createElement("button", { type: "button", onClick: props.function, className: props.className }, props.text);
}
function Div_btn_submit_spinner(props) {
  return /* @__PURE__ */ React.createElement("button", { type: "button", onClick: props.function, className: props.className }, /* @__PURE__ */ React.createElement("span", { className: "inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent align-[-2px] mr-3" }), props.text);
}
function Div_desc_err_msg(props) {
  return /* @__PURE__ */ React.createElement("span", { className: "text-[#FA5252] text-[12px] font-[500]" }, props.text);
}
function Div_textbox(props) {
  const inputClass = "bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full focus:ring-gray-200 focus:border-gray-200";
  return /* @__PURE__ */ React.createElement("div", { className: "w-full space-y-[8px]" }, /* @__PURE__ */ React.createElement("label", { htmlFor: "txt_" + props.id, className: "font-[500] text-[14px] w-full text-start" }, props.title), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: props.type === "password" ? "password" : "text",
      id: "txt_" + props.id,
      className: inputClass,
      onKeyDown: props.onKeyDown || props.function,
      onKeyUp: props.onKeyUp || props.function,
      autoComplete: props.autoComplete || "off",
      required: true
    }
  ), /* @__PURE__ */ React.createElement("div", { id: "desc_" + props.id + "_msg", className: "hidden" }));
}
function input_checker() {
  const class_desc_msg = "flex flex-row justify-start items-center w-full";
  document.getElementById("desc_email_msg").className = "hidden";
  document.getElementById("desc_password_msg").className = "hidden";
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Div_btn_submit, { className: class_btn_disabled, function: null, text: "\uB85C\uADF8\uC778" }),
    document.getElementById("btn_submit")
  );
  if (email_form_check("txt_email") == "NOT EXIST") {
    document.getElementById("desc_email_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uC774\uBA54\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694." }), document.getElementById("desc_email_msg"));
  } else if (email_form_check("txt_email") == "FAILED") {
    document.getElementById("desc_email_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uC774\uBA54\uC77C \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." }), document.getElementById("desc_email_msg"));
  } else if (password_form_check("txt_password") == "NOT EXIST") {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694." }), document.getElementById("desc_password_msg"));
  } else if (password_form_check("txt_password") == "FAILED") {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uBE44\uBC00\uBC88\uD638\uB294 8\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4." }), document.getElementById("desc_password_msg"));
  } else {
    ReactDOM.render(
      /* @__PURE__ */ React.createElement(Div_btn_submit, { className: class_btn_enabled, function: () => click_btn_submit(), text: "\uB85C\uADF8\uC778" }),
      document.getElementById("btn_submit")
    );
  }
}
async function click_btn_submit() {
  if (toggle_btn_submit) {
    return;
  }
  toggle_btn_submit = true;
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Div_btn_submit_spinner, { className: class_btn_enabled + " cursor-not-allowed", function: null, text: "\uB85C\uADF8\uC778" }),
    document.getElementById("btn_submit")
  );
  try {
    const inputData = new FormData();
    inputData.append("txt_email", document.getElementById("txt_email").value.trim());
    inputData.append("txt_password", document.getElementById("txt_password").value.trim());
    inputData.append("next", webrLoginNext());
    const data = await fetch("/account/ajax_signin_email/", {
      method: "post",
      credentials: "same-origin",
      headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
      body: inputData
    }).then((res) => res.json());
    if (data.checker == "SUCCESS") {
      location.href = data.redirect || webrLoginNext();
      return;
    }
    if (data.checker == "NOTEXIST") {
      alert("\uACC4\uC815\uC744 \uD655\uC778\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    } else if (data.checker == "WRONGPASSWORD") {
      alert("\uBE44\uBC00\uBC88\uD638\uAC00 \uD2C0\uB838\uC2B5\uB2C8\uB2E4.");
    } else if (data.checker == "INACTIVE") {
      alert("\uBE44\uD65C\uC131 \uACC4\uC815\uC785\uB2C8\uB2E4.");
    } else {
      alert("\uB85C\uADF8\uC778 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
    }
  } catch (e) {
    alert("\uB85C\uADF8\uC778 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
  } finally {
    if (document.getElementById("btn_submit")) {
      ReactDOM.render(
        /* @__PURE__ */ React.createElement(Div_btn_submit, { className: class_btn_enabled, function: () => click_btn_submit(), text: "\uB85C\uADF8\uC778" }),
        document.getElementById("btn_submit")
      );
    }
    toggle_btn_submit = false;
  }
}
function signup_input_checker() {
  const class_desc_msg = "flex flex-row justify-start items-center w-full";
  ["email", "password", "password_confirm", "name", "realname"].forEach((key) => {
    const target = document.getElementById("desc_" + key + "_msg");
    if (target)
      target.className = "hidden";
  });
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Div_btn_submit, { className: class_btn_disabled, function: null, text: "\uD68C\uC6D0 \uAC00\uC785" }),
    document.getElementById("btn_submit")
  );
  if (email_form_check("txt_email") == "NOT EXIST") {
    document.getElementById("desc_email_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uC774\uBA54\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694." }), document.getElementById("desc_email_msg"));
  } else if (email_form_check("txt_email") == "FAILED") {
    document.getElementById("desc_email_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uC774\uBA54\uC77C \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." }), document.getElementById("desc_email_msg"));
  } else if (password_form_check("txt_password") == "NOT EXIST") {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694." }), document.getElementById("desc_password_msg"));
  } else if (password_form_check("txt_password") == "FAILED") {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uBE44\uBC00\uBC88\uD638\uB294 8\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4." }), document.getElementById("desc_password_msg"));
  } else if (password_form_check("txt_password_confirm") == "NOT EXIST") {
    document.getElementById("desc_password_confirm_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694." }), document.getElementById("desc_password_confirm_msg"));
  } else if (document.getElementById("txt_password").value.trim() !== document.getElementById("txt_password_confirm").value.trim()) {
    document.getElementById("desc_password_confirm_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778\uC774 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." }), document.getElementById("desc_password_confirm_msg"));
  } else if (document.getElementById("txt_name").value.trim().length <= 0) {
    document.getElementById("desc_name_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uB2C9\uB124\uC784\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694." }), document.getElementById("desc_name_msg"));
  } else if (document.getElementById("txt_realname").value.trim().length <= 0) {
    document.getElementById("desc_realname_msg").className = class_desc_msg;
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_desc_err_msg, { text: "\uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694." }), document.getElementById("desc_realname_msg"));
  } else {
    ReactDOM.render(
      /* @__PURE__ */ React.createElement(Div_btn_submit, { className: class_btn_enabled, function: () => click_signup_submit(), text: "\uD68C\uC6D0 \uAC00\uC785" }),
      document.getElementById("btn_submit")
    );
  }
}
async function click_signup_submit() {
  if (toggle_btn_submit) {
    return;
  }
  toggle_btn_submit = true;
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Div_btn_submit_spinner, { className: class_btn_enabled + " cursor-not-allowed", function: null, text: "\uD68C\uC6D0 \uAC00\uC785" }),
    document.getElementById("btn_submit")
  );
  try {
    const inputData = new FormData();
    inputData.append("txt_email", document.getElementById("txt_email").value.trim());
    inputData.append("txt_password", document.getElementById("txt_password").value.trim());
    inputData.append("txt_name", document.getElementById("txt_name").value.trim());
    inputData.append("txt_realname", document.getElementById("txt_realname").value.trim());
    inputData.append("sel_gender", document.getElementById("sel_gender").value.trim());
    const data = await fetch("/account/ajax_signup/", {
      method: "post",
      credentials: "same-origin",
      headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
      body: inputData
    }).then((res) => res.json());
    if (data.checker == "SUCCESS") {
      location.href = "/account/welcome/";
      return;
    }
    if (data.checker == "EXIST") {
      alert("\uC774\uBBF8 \uD574\uB2F9 E-mail\uB85C \uAC00\uC785\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    } else {
      alert("\uD68C\uC6D0 \uAC00\uC785 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
    }
  } catch (e) {
    alert("\uD68C\uC6D0 \uAC00\uC785 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
  } finally {
    if (document.getElementById("btn_submit")) {
      ReactDOM.render(
        /* @__PURE__ */ React.createElement(Div_btn_submit, { className: class_btn_enabled, function: () => click_signup_submit(), text: "\uD68C\uC6D0 \uAC00\uC785" }),
        document.getElementById("btn_submit")
      );
    }
    toggle_btn_submit = false;
  }
}
function googleLoginMessage(checker) {
  const messages = {
    GOOGLE_DISABLED: "\uAD6C\uAE00 \uB85C\uADF8\uC778\uC774 \uC544\uC9C1 \uC124\uC815\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.",
    CSRF_FAILED: "\uB85C\uADF8\uC778 \uC694\uCCAD\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.",
    NONCE_FAILED: "\uAD6C\uAE00 \uB85C\uADF8\uC778 \uC751\uB2F5\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.",
    INVALID_GOOGLE_TOKEN: "\uAD6C\uAE00 \uB85C\uADF8\uC778 \uC815\uBCF4\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
    GOOGLE_EMAIL_REQUIRED: "\uAD6C\uAE00 \uACC4\uC815 \uC774\uBA54\uC77C\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
    GOOGLE_EMAIL_UNVERIFIED: "\uC778\uC99D\uB418\uC9C0 \uC54A\uC740 \uAD6C\uAE00 \uC774\uBA54\uC77C\uC785\uB2C8\uB2E4.",
    DOMAIN_NOT_ALLOWED: "\uD5C8\uC6A9\uB418\uC9C0 \uC54A\uC740 \uAD6C\uAE00 \uACC4\uC815 \uB3C4\uBA54\uC778\uC785\uB2C8\uB2E4.",
    LINK_REQUIRED: "\uAC19\uC740 \uC774\uBA54\uC77C\uC758 \uAE30\uC874 \uACC4\uC815\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uBA3C\uC800 \uC774\uBA54\uC77C/\uBE44\uBC00\uBC88\uD638\uB85C \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694.",
    GOOGLE_ALREADY_LINKED: "\uC774\uBBF8 \uB2E4\uB978 \uAD6C\uAE00 \uACC4\uC815\uC774 \uC5F0\uACB0\uB41C \uACC4\uC815\uC785\uB2C8\uB2E4.",
    GOOGLE_ALREADY_LINKED_OTHER: "\uC774\uBBF8 \uB2E4\uB978 \uACC4\uC815\uC5D0 \uC5F0\uACB0\uB41C Google \uACC4\uC815\uC785\uB2C8\uB2E4.",
    GOOGLE_EMAIL_OWNED_BY_OTHER_ACCOUNT: "\uD574\uB2F9 Google \uC774\uBA54\uC77C\uC744 \uC0AC\uC6A9\uD558\uB294 \uB2E4\uB978 \uACC4\uC815\uC774 \uC788\uC2B5\uB2C8\uB2E4.",
    INACTIVE: "\uBE44\uD65C\uC131 \uACC4\uC815\uC785\uB2C8\uB2E4."
  };
  return messages[checker] || "\uAD6C\uAE00 \uB85C\uADF8\uC778\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.";
}
function setGoogleLoginStatus(text, tone = "error") {
  const target = document.getElementById("googleLoginMessage");
  if (!target)
    return;
  target.className = tone === "ok" ? "text-sm text-emerald-700" : "text-sm text-rose-600";
  target.textContent = text || "";
}
async function handleWebRGoogleCredentialResponse(response) {
  const globals = webrLoginGlobals();
  const credential = webrLoginText(response && response.credential);
  const nonce = webrLoginText(globals.google_login_nonce);
  const endpoint = webrLoginText(globals.google_login_endpoint) || "/account/ajax_signin_google/";
  if (!credential || !nonce) {
    setGoogleLoginStatus("\uAD6C\uAE00 \uB85C\uADF8\uC778 \uC751\uB2F5\uC774 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    return;
  }
  setGoogleLoginStatus("\uAD6C\uAE00 \uACC4\uC815\uC744 \uD655\uC778\uD558\uB294 \uC911\uC785\uB2C8\uB2E4.", "ok");
  const form = new FormData();
  form.append("credential", credential);
  form.append("nonce", nonce);
  form.append("next", webrLoginNext());
  form.append("flow", webrGoogleFlow());
  try {
    const data = await fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      body: form
    }).then((res) => res.json());
    if (data.checker === "SUCCESS") {
      location.href = data.redirect || webrLoginNext();
      return;
    }
    setGoogleLoginStatus(googleLoginMessage(data.checker));
  } catch (error) {
    setGoogleLoginStatus("\uAD6C\uAE00 \uB85C\uADF8\uC778 \uCC98\uB9AC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
  }
}
function initGoogleLoginButton(attempt = 0) {
  const globals = webrLoginGlobals();
  const clientId = webrLoginText(globals.google_client_id);
  const nonce = webrLoginText(globals.google_login_nonce);
  const target = document.getElementById("googleLoginButton");
  if (!clientId || !nonce || !target) {
    return;
  }
  if (!window.google || !google.accounts || !google.accounts.id) {
    if (attempt < 120) {
      window.setTimeout(() => initGoogleLoginButton(attempt + 1), 50);
    } else {
      setGoogleLoginStatus("\uAD6C\uAE00 \uB85C\uADF8\uC778 \uC2A4\uD06C\uB9BD\uD2B8\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    }
    return;
  }
  if (target.dataset.rendered === "1") {
    return;
  }
  target.dataset.rendered = "1";
  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleWebRGoogleCredentialResponse,
    nonce,
    auto_select: false,
    cancel_on_tap_outside: true,
    use_fedcm_for_prompt: true
  });
  google.accounts.id.renderButton(target, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    logo_alignment: "left",
    width: Math.min(420, Math.max(260, target.offsetWidth || 420)),
    locale: "ko"
  });
}
function GoogleLoginBlock(props) {
  const enabled = !!webrLoginText(webrLoginGlobals().google_client_id);
  React.useEffect(() => {
    if (enabled)
      initGoogleLoginButton();
  }, [enabled]);
  if (!enabled) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", { className: "w-full space-y-3" }, !props.plain && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 py-1" }, /* @__PURE__ */ React.createElement("div", { className: "h-px flex-1 bg-gray-200" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium text-gray-500" }, "\uB610\uB294"), /* @__PURE__ */ React.createElement("div", { className: "h-px flex-1 bg-gray-200" })), /* @__PURE__ */ React.createElement("div", { id: "googleLoginButton", className: "flex h-[44px] w-full items-center justify-center" }), /* @__PURE__ */ React.createElement("p", { id: "googleLoginMessage", className: "text-sm text-rose-600" }));
}
function set_main() {
  function AuthChoice(props) {
    const isSignup = webrAuthPage() === "signup";
    const googleEnabled = !!webrLoginText(webrLoginGlobals().google_client_id);
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center text-start w-full space-y-[12px]" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "w-full rounded-xl border border-slate-900 bg-slate-950 px-4 py-4 text-sm font-semibold text-white hover:bg-slate-800", onClick: () => props.onSelect("email") }, isSignup ? "\uC774\uBA54\uC77C\uB85C \uD68C\uC6D0 \uAC00\uC785" : "\uC774\uBA54\uC77C\uB85C \uB85C\uADF8\uC778"), googleEnabled && /* @__PURE__ */ React.createElement("button", { type: "button", className: "w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-950 hover:border-slate-900", onClick: () => props.onSelect("google") }, isSignup ? "Google \uACC4\uC815\uC73C\uB85C \uD68C\uC6D0 \uAC00\uC785" : "Google \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778"));
  }
  function BackButton(props) {
    return /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-sm font-semibold text-slate-500 hover:text-slate-950", onClick: props.onClick }, "\u2190 \uB2E4\uB978 \uBC29\uC2DD \uC120\uD0DD");
  }
  function EmailLoginForm(props) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center text-start w-full space-y-[12px]" }, /* @__PURE__ */ React.createElement(BackButton, { onClick: props.onBack }), /* @__PURE__ */ React.createElement(Div_textbox, { id: "email", type: "text", title: "E-mail", autoComplete: "email", function: handleEmailLoginInput }), /* @__PURE__ */ React.createElement(Div_textbox, { id: "password", type: "password", title: "Password", autoComplete: "current-password", function: handleEmailLoginInput }), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900" }, "\uAE30\uC874 \uD648\uD398\uC774\uC9C0 \uD68C\uC6D0\uC740 \uBE44\uBC00\uBC88\uD638\uB97C 1\uD68C \uBCC0\uACBD\uD574\uC57C \uD569\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { id: "btn_submit", className: "w-full" }, /* @__PURE__ */ React.createElement(Div_btn_submit, { className: class_btn_disabled, function: null, text: "\uB85C\uADF8\uC778" })));
  }
  function EmailSignupForm(props) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center text-start w-full space-y-[12px]" }, /* @__PURE__ */ React.createElement(BackButton, { onClick: props.onBack }), /* @__PURE__ */ React.createElement(Div_textbox, { id: "email", type: "text", title: "E-mail", autoComplete: "email", function: () => signup_input_checker() }), /* @__PURE__ */ React.createElement(Div_textbox, { id: "password", type: "password", title: "\uBE44\uBC00\uBC88\uD638", autoComplete: "new-password", function: () => signup_input_checker() }), /* @__PURE__ */ React.createElement(Div_textbox, { id: "password_confirm", type: "password", title: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778", autoComplete: "new-password", function: () => signup_input_checker() }), /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center w-full py-[8px]" }), /* @__PURE__ */ React.createElement(Div_textbox, { id: "name", type: "text", title: "\uB2C9\uB124\uC784", autoComplete: "nickname", function: () => signup_input_checker() }), /* @__PURE__ */ React.createElement(Div_textbox, { id: "realname", type: "text", title: "\uC774\uB984", autoComplete: "name", function: () => signup_input_checker() }), /* @__PURE__ */ React.createElement("div", { className: "w-full space-y-[8px]" }, /* @__PURE__ */ React.createElement("label", { htmlFor: "sel_gender", className: "font-[500] text-[14px] w-full text-start" }, "\uC131\uBCC4"), /* @__PURE__ */ React.createElement("select", { id: "sel_gender", className: "bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full focus:ring-gray-200 focus:border-gray-200", onChange: () => signup_input_checker() }, /* @__PURE__ */ React.createElement("option", { value: "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C" }, "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C"), /* @__PURE__ */ React.createElement("option", { value: "Male" }, "\uB0A8\uC131"), /* @__PURE__ */ React.createElement("option", { value: "Female" }, "\uC5EC\uC131"), /* @__PURE__ */ React.createElement("option", { value: "\uAE30\uD0C0" }, "\uAE30\uD0C0"))), /* @__PURE__ */ React.createElement("div", { id: "btn_submit", className: "w-full" }, /* @__PURE__ */ React.createElement(Div_btn_submit, { className: class_btn_disabled, function: null, text: "\uD68C\uC6D0 \uAC00\uC785" })));
  }
  function GoogleOnlyForm(props) {
    const isSignup = webrAuthPage() === "signup";
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center text-start w-full space-y-[16px]" }, /* @__PURE__ */ React.createElement(BackButton, { onClick: props.onBack }), /* @__PURE__ */ React.createElement("div", { className: "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700" }, isSignup ? "Google \uACC4\uC815\uC73C\uB85C \uAC00\uC785\uD558\uBA74 Web-R \uACC4\uC815\uC774 \uC790\uB3D9\uC73C\uB85C \uC0DD\uC131\uB429\uB2C8\uB2E4. \uAC19\uC740 Gmail \uC8FC\uC18C\uC758 \uAE30\uC874 \uACC4\uC815\uC774 \uC788\uC73C\uBA74 \uC0C8\uB85C \uB9CC\uB4E4\uC9C0 \uC54A\uACE0 \uC5F0\uACB0\uD569\uB2C8\uB2E4." : "Google \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uD569\uB2C8\uB2E4. \uAC19\uC740 Gmail \uC8FC\uC18C\uC758 \uAE30\uC874 Web-R \uACC4\uC815\uC740 \uC790\uB3D9\uC73C\uB85C \uC5F0\uACB0\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(GoogleLoginBlock, { plain: true }));
  }
  function Div_main() {
    const isSignup = webrAuthPage() === "signup";
    const [method, setMethod] = React.useState("");
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center w-full" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px] sm:w-[380px] sm:p-[16px]" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-bold" }, isSignup ? "\uD68C\uC6D0 \uAC00\uC785" : "\uB85C\uADF8\uC778"), method === "" && /* @__PURE__ */ React.createElement(AuthChoice, { onSelect: setMethod }), method === "email" && (isSignup ? /* @__PURE__ */ React.createElement(EmailSignupForm, { onBack: () => setMethod("") }) : /* @__PURE__ */ React.createElement(EmailLoginForm, { onBack: () => setMethod("") })), method === "google" && /* @__PURE__ */ React.createElement(GoogleOnlyForm, { onBack: () => setMethod("") }), /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center w-full" }, /* @__PURE__ */ React.createElement("div", { className: "h-px w-full bg-gray-900" })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-row justify-center items-center space-x-[10px] w-full" }, !isSignup && /* @__PURE__ */ React.createElement("a", { href: "/account/change_password/", className: "font-[500] text-[14px] cursor-pointer hover:underline" }, "\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30"), !isSignup && /* @__PURE__ */ React.createElement("span", { className: "font-[500] text-[14px]" }, "|"), /* @__PURE__ */ React.createElement("a", { href: isSignup ? "/account/" : "/account/signup/", className: "font-[500] text-[14px] cursor-pointer hover:underline" }, isSignup ? "\uB85C\uADF8\uC778" : "\uD68C\uC6D0 \uAC00\uC785"))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
}
