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
  return document.cookie.split(";").map(part => part.trim()).reduce((found, part) => {
    if (found) return found;
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
  return (
    <button type="button" onClick={props.function} className={props.className}>
      {props.text}
    </button>
  );
}

function Div_btn_submit_spinner(props) {
  return (
    <button type="button" onClick={props.function} className={props.className}>
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent align-[-2px] mr-3"></span>
      {props.text}
    </button>
  );
}

function Div_desc_err_msg(props) {
  return <span className="text-[#FA5252] text-[12px] font-[500]">{props.text}</span>;
}

function Div_textbox(props) {
  const inputClass = "bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full focus:ring-gray-200 focus:border-gray-200";
  return (
    <div className="w-full space-y-[8px]">
      <label htmlFor={"txt_" + props.id} className="font-[500] text-[14px] w-full text-start">
        {props.title}
      </label>
      <input
        type={props.type === "password" ? "password" : "text"}
        id={"txt_" + props.id}
        className={inputClass}
        onKeyDown={props.onKeyDown || props.function}
        onKeyUp={props.onKeyUp || props.function}
        autoComplete={props.autoComplete || "off"}
        required
      />
      <div id={"desc_" + props.id + "_msg"} className="hidden"></div>
    </div>
  );
}

function input_checker() {
  const class_desc_msg = "flex flex-row justify-start items-center w-full";

  document.getElementById("desc_email_msg").className = "hidden";
  document.getElementById("desc_password_msg").className = "hidden";

  ReactDOM.render(
    <Div_btn_submit className={class_btn_disabled} function={null} text={"로그인"} />,
    document.getElementById("btn_submit")
  );

  if (email_form_check("txt_email") == "NOT EXIST") {
    document.getElementById("desc_email_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="이메일을 입력해주세요." />, document.getElementById("desc_email_msg"));
  } else if (email_form_check("txt_email") == "FAILED") {
    document.getElementById("desc_email_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="이메일 형식이 올바르지 않습니다." />, document.getElementById("desc_email_msg"));
  } else if (password_form_check("txt_password") == "NOT EXIST") {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="비밀번호를 입력해주세요." />, document.getElementById("desc_password_msg"));
  } else if (password_form_check("txt_password") == "FAILED") {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="비밀번호는 8자 이상이어야 합니다." />, document.getElementById("desc_password_msg"));
  } else {
    ReactDOM.render(
      <Div_btn_submit className={class_btn_enabled} function={() => click_btn_submit()} text={"로그인"} />,
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
    <Div_btn_submit_spinner className={class_btn_enabled + " cursor-not-allowed"} function={null} text={"로그인"} />,
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
    }).then(res => res.json());

    if (data.checker == "SUCCESS") {
      location.href = data.redirect || webrLoginNext();
      return;
    }
    if (data.checker == "NOTEXIST") {
      alert("계정을 확인할 수 없습니다.");
    } else if (data.checker == "WRONGPASSWORD") {
      alert("비밀번호가 틀렸습니다.");
    } else if (data.checker == "INACTIVE") {
      alert("비활성 계정입니다.");
    } else {
      alert("로그인 중 오류가 발생했습니다.");
    }
  } catch (e) {
    alert("로그인 중 오류가 발생했습니다.");
  } finally {
    if (document.getElementById("btn_submit")) {
      ReactDOM.render(
        <Div_btn_submit className={class_btn_enabled} function={() => click_btn_submit()} text={"로그인"} />,
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
    if (target) target.className = "hidden";
  });
  ReactDOM.render(
    <Div_btn_submit className={class_btn_disabled} function={null} text={"회원 가입"} />,
    document.getElementById("btn_submit")
  );

  if (email_form_check("txt_email") == "NOT EXIST") {
    document.getElementById("desc_email_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="이메일을 입력해주세요." />, document.getElementById("desc_email_msg"));
  } else if (email_form_check("txt_email") == "FAILED") {
    document.getElementById("desc_email_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="이메일 형식이 올바르지 않습니다." />, document.getElementById("desc_email_msg"));
  } else if (password_form_check("txt_password") == "NOT EXIST") {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="비밀번호를 입력해주세요." />, document.getElementById("desc_password_msg"));
  } else if (password_form_check("txt_password") == "FAILED") {
    document.getElementById("desc_password_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="비밀번호는 8자 이상이어야 합니다." />, document.getElementById("desc_password_msg"));
  } else if (password_form_check("txt_password_confirm") == "NOT EXIST") {
    document.getElementById("desc_password_confirm_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="비밀번호 확인을 입력해주세요." />, document.getElementById("desc_password_confirm_msg"));
  } else if (document.getElementById("txt_password").value.trim() !== document.getElementById("txt_password_confirm").value.trim()) {
    document.getElementById("desc_password_confirm_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="비밀번호 확인이 일치하지 않습니다." />, document.getElementById("desc_password_confirm_msg"));
  } else if (document.getElementById("txt_name").value.trim().length <= 0) {
    document.getElementById("desc_name_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="닉네임을 입력해주세요." />, document.getElementById("desc_name_msg"));
  } else if (document.getElementById("txt_realname").value.trim().length <= 0) {
    document.getElementById("desc_realname_msg").className = class_desc_msg;
    ReactDOM.render(<Div_desc_err_msg text="이름을 입력해주세요." />, document.getElementById("desc_realname_msg"));
  } else {
    ReactDOM.render(
      <Div_btn_submit className={class_btn_enabled} function={() => click_signup_submit()} text={"회원 가입"} />,
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
    <Div_btn_submit_spinner className={class_btn_enabled + " cursor-not-allowed"} function={null} text={"회원 가입"} />,
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
    }).then(res => res.json());

    if (data.checker == "SUCCESS") {
      location.href = "/account/welcome/";
      return;
    }
    if (data.checker == "EXIST") {
      alert("이미 해당 E-mail로 가입되었습니다.");
    } else {
      alert("회원 가입 중 오류가 발생했습니다.");
    }
  } catch (e) {
    alert("회원 가입 중 오류가 발생했습니다.");
  } finally {
    if (document.getElementById("btn_submit")) {
      ReactDOM.render(
        <Div_btn_submit className={class_btn_enabled} function={() => click_signup_submit()} text={"회원 가입"} />,
        document.getElementById("btn_submit")
      );
    }
    toggle_btn_submit = false;
  }
}

function googleLoginMessage(checker) {
  const messages = {
    GOOGLE_DISABLED: "구글 로그인이 아직 설정되지 않았습니다.",
    CSRF_FAILED: "로그인 요청을 확인하지 못했습니다. 새로고침 후 다시 시도해주세요.",
    NONCE_FAILED: "구글 로그인 응답을 확인하지 못했습니다. 새로고침 후 다시 시도해주세요.",
    INVALID_GOOGLE_TOKEN: "구글 로그인 정보를 확인하지 못했습니다.",
    GOOGLE_EMAIL_REQUIRED: "구글 계정 이메일을 확인하지 못했습니다.",
    GOOGLE_EMAIL_UNVERIFIED: "인증되지 않은 구글 이메일입니다.",
    DOMAIN_NOT_ALLOWED: "허용되지 않은 구글 계정 도메인입니다.",
    LINK_REQUIRED: "같은 이메일의 기존 계정이 있습니다. 먼저 이메일/비밀번호로 로그인해주세요.",
    GOOGLE_ALREADY_LINKED: "이미 다른 구글 계정이 연결된 계정입니다.",
    GOOGLE_ALREADY_LINKED_OTHER: "이미 다른 계정에 연결된 Google 계정입니다.",
    GOOGLE_EMAIL_OWNED_BY_OTHER_ACCOUNT: "해당 Google 이메일을 사용하는 다른 계정이 있습니다.",
    INACTIVE: "비활성 계정입니다."
  };
  return messages[checker] || "구글 로그인에 실패했습니다.";
}

function setGoogleLoginStatus(text, tone = "error") {
  const target = document.getElementById("googleLoginMessage");
  if (!target) return;
  target.className = tone === "ok" ? "text-sm text-emerald-700" : "text-sm text-rose-600";
  target.textContent = text || "";
}

async function handleWebRGoogleCredentialResponse(response) {
  const globals = webrLoginGlobals();
  const credential = webrLoginText(response && response.credential);
  const nonce = webrLoginText(globals.google_login_nonce);
  const endpoint = webrLoginText(globals.google_login_endpoint) || "/account/ajax_signin_google/";
  if (!credential || !nonce) {
    setGoogleLoginStatus("구글 로그인 응답이 비어 있습니다.");
    return;
  }

  setGoogleLoginStatus("구글 계정을 확인하는 중입니다.", "ok");
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
    }).then(res => res.json());
    if (data.checker === "SUCCESS") {
      location.href = data.redirect || webrLoginNext();
      return;
    }
    setGoogleLoginStatus(googleLoginMessage(data.checker));
  } catch (error) {
    setGoogleLoginStatus("구글 로그인 처리 중 오류가 발생했습니다.");
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
      setGoogleLoginStatus("구글 로그인 스크립트를 불러오지 못했습니다.");
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
    nonce: nonce,
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
    if (enabled) initGoogleLoginButton();
  }, [enabled]);
  if (!enabled) {
    return null;
  }
  return (
    <div className="w-full space-y-3">
      {!props.plain && (
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-xs font-medium text-gray-500">또는</span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>
      )}
      <div id="googleLoginButton" className="flex h-[44px] w-full items-center justify-center"></div>
      <p id="googleLoginMessage" className="text-sm text-rose-600"></p>
    </div>
  );
}

function set_main() {
  function AuthChoice(props) {
    const isSignup = webrAuthPage() === "signup";
    const googleEnabled = !!webrLoginText(webrLoginGlobals().google_client_id);
    return (
      <div className="flex flex-col justify-center items-center text-start w-full space-y-[12px]">
        <button type="button" className="w-full rounded-xl border border-slate-900 bg-slate-950 px-4 py-4 text-sm font-semibold text-white hover:bg-slate-800" onClick={() => props.onSelect("email")}>
          {isSignup ? "이메일로 회원 가입" : "이메일로 로그인"}
        </button>
        {googleEnabled && (
          <button type="button" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-950 hover:border-slate-900" onClick={() => props.onSelect("google")}>
            {isSignup ? "Google 계정으로 회원 가입" : "Google 계정으로 로그인"}
          </button>
        )}
      </div>
    );
  }

  function BackButton(props) {
    return (
      <button type="button" className="text-sm font-semibold text-slate-500 hover:text-slate-950" onClick={props.onClick}>
        ← 다른 방식 선택
      </button>
    );
  }

  function EmailLoginForm(props) {
    return (
      <div className="flex flex-col justify-center items-center text-start w-full space-y-[12px]">
        <BackButton onClick={props.onBack} />
        <Div_textbox id="email" type="text" title="E-mail" autoComplete="email" function={handleEmailLoginInput} />
        <Div_textbox id="password" type="password" title="Password" autoComplete="current-password" function={handleEmailLoginInput} />
        <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
          기존 홈페이지 회원은 비밀번호를 1회 변경해야 합니다.
        </div>
        <div id="btn_submit" className="w-full">
          <Div_btn_submit className={class_btn_disabled} function={null} text={"로그인"} />
        </div>
      </div>
    );
  }

  function EmailSignupForm(props) {
    return (
      <div className="flex flex-col justify-center items-center text-start w-full space-y-[12px]">
        <BackButton onClick={props.onBack} />
        <Div_textbox id="email" type="text" title="E-mail" autoComplete="email" function={() => signup_input_checker()} />
        <Div_textbox id="password" type="password" title="비밀번호" autoComplete="new-password" function={() => signup_input_checker()} />
        <Div_textbox id="password_confirm" type="password" title="비밀번호 확인" autoComplete="new-password" function={() => signup_input_checker()} />
        <div className="flex justify-center items-center w-full py-[8px]"></div>
        <Div_textbox id="name" type="text" title="닉네임" autoComplete="nickname" function={() => signup_input_checker()} />
        <Div_textbox id="realname" type="text" title="이름" autoComplete="name" function={() => signup_input_checker()} />
        <div className="w-full space-y-[8px]">
          <label htmlFor="sel_gender" className="font-[500] text-[14px] w-full text-start">성별</label>
          <select id="sel_gender" className="bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full focus:ring-gray-200 focus:border-gray-200" onChange={() => signup_input_checker()}>
            <option value="응답하고 싶지 않음">응답하고 싶지 않음</option>
            <option value="Male">남성</option>
            <option value="Female">여성</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div id="btn_submit" className="w-full">
          <Div_btn_submit className={class_btn_disabled} function={null} text={"회원 가입"} />
        </div>
      </div>
    );
  }

  function GoogleOnlyForm(props) {
    const isSignup = webrAuthPage() === "signup";
    return (
      <div className="flex flex-col justify-center items-center text-start w-full space-y-[16px]">
        <BackButton onClick={props.onBack} />
        <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
          {isSignup ? "Google 계정으로 가입하면 Web-R 계정이 자동으로 생성됩니다. 같은 Gmail 주소의 기존 계정이 있으면 새로 만들지 않고 연결합니다." : "Google 계정으로 로그인합니다. 같은 Gmail 주소의 기존 Web-R 계정은 자동으로 연결됩니다."}
        </div>
        <GoogleLoginBlock plain={true} />
      </div>
    );
  }

  function Div_main() {
    const isSignup = webrAuthPage() === "signup";
    const [method, setMethod] = React.useState("");
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px] sm:w-[380px] sm:p-[16px]">
          <div className="text-lg font-bold">{isSignup ? "회원 가입" : "로그인"}</div>

          {method === "" && <AuthChoice onSelect={setMethod} />}
          {method === "email" && (isSignup ? <EmailSignupForm onBack={() => setMethod("")} /> : <EmailLoginForm onBack={() => setMethod("")} />)}
          {method === "google" && <GoogleOnlyForm onBack={() => setMethod("")} />}

          <div className="flex justify-center items-center w-full">
            <div className="h-px w-full bg-gray-900"></div>
          </div>

          <div className="flex flex-row justify-center items-center space-x-[10px] w-full">
            {!isSignup && (
              <a href="/account/change_password/" className="font-[500] text-[14px] cursor-pointer hover:underline">
                비밀번호 찾기
              </a>
            )}
            {!isSignup && <span className="font-[500] text-[14px]">|</span>}
            <a href={isSignup ? "/account/" : "/account/signup/"} className="font-[500] text-[14px] cursor-pointer hover:underline">
              {isSignup ? "로그인" : "회원 가입"}
            </a>
          </div>
        </div>
      </div>
    );
  }

  ReactDOM.render(<Div_main />, document.getElementById("div_main"));
}
