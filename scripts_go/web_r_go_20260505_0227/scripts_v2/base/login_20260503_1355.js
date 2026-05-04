(function() {
  const form = document.getElementById("loginForm");
  if (!form) {
    return;
  }
  form.addEventListener("submit", async function(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const res = await fetch("/account/ajax_signin_email/", {
      method: "POST",
      body: data
    });
    const payload = await res.json();
    if (payload.checker === "SUCCESS") {
      window.location.href = form.dataset.next || "/account/myinfo/";
      return;
    }
    const messages = {
      NOTEXIST: "\uC874\uC7AC\uD558\uC9C0 \uC54A\uB294 \uACC4\uC815\uC785\uB2C8\uB2E4.",
      WRONGPASSWORD: "\uBE44\uBC00\uBC88\uD638\uAC00 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
      INACTIVE: "\uBE44\uD65C\uC131 \uACC4\uC815\uC785\uB2C8\uB2E4."
    };
    const target = document.getElementById("loginMessage");
    if (target) {
      target.textContent = messages[payload.checker] || payload.checker || "\uB85C\uADF8\uC778\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.";
    }
  });
})();
