(function () {
  const STYLE_ID = "webr-admin-left-tabs-style-20260506-2055";
  const MENU_ITEMS = [
    { key: "main", label: "첫 화면", url: "/admin/" },
    { key: "active_users", label: "활성 사용자", url: "/admin/active_users/" },
    { key: "webr", label: "Web-R 접속 현황", url: "/admin/webr/" },
    { key: "visitors", label: "방문 현황", url: "/admin/visitors/" },
    { key: "members", label: "회원 현황", url: "/admin/members/" },
    { key: "team_members", label: "기관/팀 현황", url: "/admin/team_members/" },
    { key: "payments", label: "결제 현황", url: "/admin/payments/" },
    { key: "balance_account", label: "정산액 조회", url: balanceAccountURL },
  ];

  function textOf(node) {
    return (node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function balanceAccountURL() {
    const now = new Date();
    const params = new URLSearchParams(window.location.search || "");
    const year = Number(params.get("year")) || now.getFullYear();
    const month = Number(params.get("month")) || now.getMonth() + 1;
    const safeMonth = month >= 1 && month <= 12 ? month : now.getMonth() + 1;
    return "/admin/balance_account/?year=" + year.toString() + "&month=" + safeMonth.toString();
  }

  function currentKey() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts[0] !== "admin") return "";
    return parts[1] || "main";
  }

  function menuItemForLabel(label) {
    return MENU_ITEMS.find(function (item) {
      return item.label === label;
    });
  }

  function itemURL(item) {
    return typeof item.url === "function" ? item.url() : item.url;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#div_main .webr-admin-shell{display:grid!important;grid-template-columns:minmax(220px,260px) minmax(0,1fr)!important;align-items:start!important;gap:1.75rem!important;max-width:1480px;margin:0 auto;padding:2.5rem 2rem!important;color:#0f172a;}",
      "#div_main .webr-admin-menu{position:sticky;top:1.5rem;height:fit-content;border:1px solid #e2e8f0;border-radius:.5rem;background:#fff;padding:.75rem;box-shadow:0 1px 2px rgba(15,23,42,.06);}",
      "#div_main .webr-admin-menu-list{display:flex!important;width:100%!important;flex-direction:column!important;gap:.25rem!important;}",
      "#div_main .webr-admin-tab{display:flex!important;min-height:44px;width:100%!important;align-items:center;justify-content:space-between;border:1px solid transparent;border-radius:.5rem;background:transparent;padding:.75rem 1rem!important;text-align:left;font-size:.875rem;font-weight:700;line-height:1.25rem;color:#334155;transition:background-color .15s ease,color .15s ease,border-color .15s ease;white-space:normal;margin:0!important;}",
      "#div_main .webr-admin-tab:hover{background:#f1f5f9;color:#0f172a;}",
      "#div_main .webr-admin-tab-active{border-color:#0f172a!important;background:#0f172a!important;color:#fff!important;}",
      "#div_main .webr-admin-tab-active:after{content:\"\";display:block;width:.4rem;height:.4rem;flex:0 0 auto;margin-left:.75rem;border-radius:9999px;background:#38bdf8;}",
      "#div_main .webr-admin-content{grid-column:auto!important;min-width:0!important;width:100%;display:block!important;}",
      "#div_main .webr-admin-content>.w-full+ .w-full{margin-top:1rem;}",
      "@media (max-width:768px){#div_main .webr-admin-shell{grid-template-columns:minmax(0,1fr)!important;gap:1rem!important;padding:1.5rem 1rem!important;}#div_main .webr-admin-menu{position:static;}#div_main .webr-admin-menu-list{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:.5rem!important;}#div_main .webr-admin-tab{min-height:42px;padding:.65rem .8rem!important;font-size:.8125rem;}}",
      "@media (max-width:480px){#div_main .webr-admin-menu-list{grid-template-columns:minmax(0,1fr)!important;}}",
    ].join("\n");
    document.head.appendChild(style);
  }

  function findMenuButtons(root) {
    return Array.from(root.querySelectorAll("button")).filter(function (button) {
      return !!menuItemForLabel(textOf(button));
    });
  }

  function ensureTeamButton(buttons) {
    if (buttons.some(function (button) { return textOf(button) === "기관/팀 현황"; })) return;
    const memberButton = buttons.find(function (button) { return textOf(button) === "회원 현황"; });
    if (!memberButton || !memberButton.parentNode) return;
    const item = menuItemForLabel("기관/팀 현황");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.label;
    button.addEventListener("click", function () {
      window.location.href = itemURL(item);
    });
    if (memberButton.nextSibling) {
      memberButton.parentNode.insertBefore(button, memberButton.nextSibling);
    } else {
      memberButton.parentNode.appendChild(button);
    }
  }

  function bindButton(button, item, activeKey) {
    const selected = item.key === activeKey;
    button.type = "button";
    button.className = "webr-admin-tab" + (selected ? " webr-admin-tab-active" : "");
    if (selected) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
    if (button.dataset.webrAdminLeftTabsBound === "true") return;
    button.dataset.webrAdminLeftTabsBound = "true";
    button.addEventListener("click", function () {
      window.location.href = itemURL(item);
    });
  }

  function patchAdminMenu() {
    ensureStyle();
    const root = document.getElementById("div_main");
    if (!root) return false;
    let buttons = findMenuButtons(root);
    if (buttons.length === 0) return false;

    ensureTeamButton(buttons);
    buttons = findMenuButtons(root);
    const firstButton = buttons[0];
    const menuList = firstButton && firstButton.parentElement;
    const menu = menuList && menuList.parentElement;
    const shell = menu && menu.parentElement;
    if (!menuList || !menu || !shell) return false;

    shell.classList.add("webr-admin-shell");
    menu.className = "webr-admin-menu";
    menuList.className = "webr-admin-menu-list";

    Array.from(shell.children).forEach(function (child) {
      if (child !== menu) child.classList.add("webr-admin-content");
    });

    const activeKey = currentKey();
    buttons.forEach(function (button) {
      const item = menuItemForLabel(textOf(button));
      if (item) bindButton(button, item, activeKey);
    });
    return true;
  }

  function start() {
    let pending = false;
    function schedulePatch() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () {
        pending = false;
        patchAdminMenu();
      });
    }

    let attempts = 0;
    const timer = window.setInterval(function () {
      attempts += 1;
      if (patchAdminMenu() || attempts >= 80) {
        window.clearInterval(timer);
      }
    }, 150);
    patchAdminMenu();

    const root = document.getElementById("div_main");
    if (root) {
      const observer = new MutationObserver(schedulePatch);
      observer.observe(root, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
