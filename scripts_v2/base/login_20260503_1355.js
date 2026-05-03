(function () {
  const form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const res = await fetch("/account/ajax_signin_email/", {
      method: "POST",
      body: data,
    });
    const payload = await res.json();
    if (payload.checker === "SUCCESS") {
      window.location.href = form.dataset.next || "/account/myinfo/";
      return;
    }

    const messages = {
      NOTEXIST: "존재하지 않는 계정입니다.",
      WRONGPASSWORD: "비밀번호가 올바르지 않습니다.",
      INACTIVE: "비활성 계정입니다.",
    };
    const target = document.getElementById("loginMessage");
    if (target) {
      target.textContent = messages[payload.checker] || payload.checker || "로그인에 실패했습니다.";
    }
  });
})();
