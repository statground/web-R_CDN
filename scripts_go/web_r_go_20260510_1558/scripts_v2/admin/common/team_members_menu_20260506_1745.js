(function () {
  const label = "기관/팀 현황";
  const url = "/admin/team_members/";
  const marker = "data-admin-team-members-link";

  function textOf(node) {
    return (node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function makeButton(sourceButton) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute(marker, "true");
    button.textContent = label;
    button.className = sourceButton && sourceButton.className
      ? sourceButton.className
      : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200";
    button.addEventListener("click", function () {
      location.href = url;
    });
    return button;
  }

  function patchMenu() {
    const root = document.getElementById("div_main");
    if (!root || root.querySelector("button[" + marker + ']')) return true;
    const buttons = Array.from(root.querySelectorAll("button")).filter(function (button) {
      const text = textOf(button);
      return text === "첫 화면" || text === "활성 사용자" || text === "회원 현황" || text === "결제 현황";
    });
    if (buttons.length === 0) return false;
    if (buttons.some(function (button) { return textOf(button) === label; })) return true;

    const memberButton = buttons.find(function (button) { return textOf(button) === "회원 현황"; });
    const reference = memberButton || buttons[buttons.length - 1];
    const container = reference && reference.parentNode;
    if (!container) return false;
    const button = makeButton(reference);
    if (memberButton && memberButton.nextSibling) {
      container.insertBefore(button, memberButton.nextSibling);
    } else {
      container.appendChild(button);
    }
    return true;
  }

  function start() {
    let attempts = 0;
    const timer = window.setInterval(function () {
      attempts += 1;
      if (patchMenu() || attempts >= 60) {
        window.clearInterval(timer);
      }
    }, 150);
    patchMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
