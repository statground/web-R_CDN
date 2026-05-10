(function () {
  const STYLE_ID = "webr-admin-left-tabs-style-20260510-0430";
  const ACCORDION_VERSION = "20260510_0430";
  const MENU_ITEMS = [
    { key: "main", label: "첫 화면", url: "/admin/" },
    { key: "active_users", label: "활성 사용자", url: "/admin/active_users/" },
    { key: "webr", label: "Web-R 접속 현황", url: "/admin/webr/" },
    { key: "visitors", label: "방문 현황", url: "/admin/visitors/" },
    { key: "members", label: "회원 현황", url: "/admin/members/" },
    { key: "team_members", label: "기관/팀 현황", url: "/admin/team_members/" },
    { key: "admin_team", label: "관리자 팀", url: "/admin/admin_team/" },
    { key: "tester_team", label: "테스터 팀", url: "/admin/tester_team/" },
    { key: "bot_team", label: "Bot 팀", url: "/admin/bot_team/" },
    { key: "payments", label: "결제 현황", url: "/admin/payments/" },
    { key: "balance_account", label: "정산액 조회", url: balanceAccountURL },
  ];
  const MENU_GROUPS = [
    {
      key: "statistics",
      label: "통계",
      items: ["active_users", "webr", "visitors", "payments", "balance_account"],
    },
    {
      key: "members",
      label: "회원 관리",
      items: ["members", "team_members"],
    },
    {
      key: "special",
      label: "특별 계정 관리",
      items: ["admin_team", "tester_team", "bot_team"],
    },
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
    return "/admin/balance_account/" + year.toString() + "/" + safeMonth.toString() + "/";
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

  function menuItemForKey(key) {
    return MENU_ITEMS.find(function (item) {
      return item.key === key;
    });
  }

  function itemURL(item) {
    return typeof item.url === "function" ? item.url() : item.url;
  }

  function groupContainsActive(group, activeKey) {
    return group.items.indexOf(activeKey) >= 0;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#div_main .webr-admin-shell{display:grid!important;grid-template-columns:minmax(220px,260px) minmax(0,1fr)!important;align-items:start!important;gap:1.75rem!important;max-width:1480px;margin:0 auto;padding:2.5rem 2rem!important;color:#0f172a;}",
      "#div_main .webr-admin-menu{position:sticky;top:1.5rem;height:fit-content;border:1px solid #e2e8f0;border-radius:.5rem;background:#fff;padding:.75rem;box-shadow:0 1px 2px rgba(15,23,42,.06);}",
      "#div_main .webr-admin-menu-list{display:flex!important;width:100%!important;flex-direction:column!important;gap:.55rem!important;}",
      "#div_main .webr-admin-menu-home{border-bottom:1px solid #e2e8f0;padding-bottom:.6rem;}",
      "#div_main .webr-admin-accordion{border:1px solid #e2e8f0;border-radius:.5rem;background:#f8fafc;overflow:hidden;}",
      "#div_main .webr-admin-accordion-summary{display:flex;min-height:42px;cursor:pointer;align-items:center;justify-content:space-between;padding:.65rem .8rem;font-size:.8125rem;font-weight:800;color:#0f172a;list-style:none;}",
      "#div_main .webr-admin-accordion-summary::-webkit-details-marker{display:none;}",
      "#div_main .webr-admin-accordion-summary:after{content:\"+\";display:flex;width:1.25rem;height:1.25rem;align-items:center;justify-content:center;border-radius:9999px;background:#e2e8f0;color:#334155;font-size:.9rem;line-height:1;}",
      "#div_main .webr-admin-accordion[open]>.webr-admin-accordion-summary:after{content:\"-\";background:#0f172a;color:#fff;}",
      "#div_main .webr-admin-accordion-panel{display:flex;flex-direction:column;gap:.25rem;border-top:1px solid #e2e8f0;background:#fff;padding:.5rem;}",
      "#div_main .webr-admin-tab{display:flex!important;min-height:44px;width:100%!important;align-items:center;justify-content:space-between;border:1px solid transparent;border-radius:.5rem;background:transparent;padding:.75rem 1rem!important;text-align:left;font-size:.875rem;font-weight:700;line-height:1.25rem;color:#334155;transition:background-color .15s ease,color .15s ease,border-color .15s ease;white-space:normal;margin:0!important;}",
      "#div_main .webr-admin-tab:hover{background:#f1f5f9;color:#0f172a;}",
      "#div_main .webr-admin-tab-active{border-color:#0f172a!important;background:#0f172a!important;color:#fff!important;}",
      "#div_main .webr-admin-tab-active:after{content:\"\";display:block;width:.4rem;height:.4rem;flex:0 0 auto;margin-left:.75rem;border-radius:9999px;background:#38bdf8;}",
      "#div_main .webr-admin-content{grid-column:auto!important;min-width:0!important;width:100%;display:block!important;}",
      "#div_main .webr-admin-content>.w-full+ .w-full{margin-top:1rem;}",
      "#div_main .webr-admin-content>.flex.flex-col.justify-center.items-center.w-full.space-y-4{min-height:min(520px,60vh);}",
      "@media (max-width:768px){#div_main .webr-admin-shell{grid-template-columns:minmax(0,1fr)!important;gap:1rem!important;padding:1.5rem 1rem!important;}#div_main .webr-admin-menu{position:static;}#div_main .webr-admin-tab{min-height:42px;padding:.65rem .8rem!important;font-size:.8125rem;}}",
    ].join("\n");
    document.head.appendChild(style);
  }

  function findMenuButtons(root) {
    return Array.from(root.querySelectorAll("button")).filter(function (button) {
      return !!menuItemForLabel(textOf(button));
    });
  }

  function menuButtonCount(root) {
    return root ? findMenuButtons(root).length : 0;
  }

  function existingMenuList(root) {
    return root ? root.querySelector(".webr-admin-menu-list") : null;
  }

  function legacyMenuListFromButtons(root, buttons) {
    const firstButton = buttons.find(function (button) {
      const item = menuItemForLabel(textOf(button));
      return item && item.key === "main";
    }) || buttons[0];
    let candidate = firstButton ? firstButton.parentElement : null;
    while (candidate && candidate !== root && menuButtonCount(candidate) < 3) {
      candidate = candidate.parentElement;
    }
    return candidate && menuButtonCount(candidate) >= 3 ? candidate : null;
  }

  function createMenuButton(item) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.label;
    return button;
  }

  function buildAccordionMenu(menuList, activeKey) {
    menuList.textContent = "";
    menuList.dataset.webrAdminAccordionVersion = ACCORDION_VERSION;
    menuList.dataset.webrAdminActiveKey = activeKey;

    const home = document.createElement("div");
    home.className = "webr-admin-menu-home";
    const mainItem = menuItemForKey("main");
    const mainButton = createMenuButton(mainItem);
    bindButton(mainButton, mainItem, activeKey);
    home.appendChild(mainButton);
    menuList.appendChild(home);

    MENU_GROUPS.forEach(function (group) {
      const details = document.createElement("details");
      details.className = "webr-admin-accordion";
      details.open = groupContainsActive(group, activeKey) || activeKey === "main";

      const summary = document.createElement("summary");
      summary.className = "webr-admin-accordion-summary";
      summary.textContent = group.label;
      details.appendChild(summary);

      const panel = document.createElement("div");
      panel.className = "webr-admin-accordion-panel";
      group.items.forEach(function (key) {
        const item = menuItemForKey(key);
        if (!item) return;
        const button = createMenuButton(item);
        bindButton(button, item, activeKey);
        panel.appendChild(button);
      });
      details.appendChild(panel);
      menuList.appendChild(details);
    });
  }

  function ensureMenuButtons(buttons) {
    const byLabel = {};
    buttons.forEach(function (button) {
      byLabel[textOf(button)] = button;
    });
    MENU_ITEMS.forEach(function (item, index) {
      if (byLabel[item.label]) return;
      const anchor = MENU_ITEMS.slice(0, index).reverse().map(function (prev) {
        return byLabel[prev.label];
      }).find(Boolean);
      if (!anchor || !anchor.parentNode) return;
      const button = createMenuButton(item);
      if (anchor.nextSibling) {
        anchor.parentNode.insertBefore(button, anchor.nextSibling);
      } else {
        anchor.parentNode.appendChild(button);
      }
      byLabel[item.label] = button;
    });
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
    let menuList = existingMenuList(root);
    let buttons = menuList ? findMenuButtons(menuList) : findMenuButtons(root);
    if (buttons.length === 0) return false;

    ensureMenuButtons(buttons);
    menuList = existingMenuList(root) || legacyMenuListFromButtons(root, findMenuButtons(root));
    if (!menuList) return false;
    buttons = findMenuButtons(menuList);
    const menu = menuList && (menuList.closest(".webr-admin-menu") || menuList.parentElement);
    const shell = menu && (menu.closest(".webr-admin-shell") || menu.parentElement);
    if (!menuList || !menu || !shell) return false;

    shell.classList.add("webr-admin-shell");
    menu.className = "webr-admin-menu";
    menuList.className = "webr-admin-menu-list";

    Array.from(shell.children).forEach(function (child) {
      if (child !== menu) child.classList.add("webr-admin-content");
    });

    const activeKey = currentKey();
    if (menuList.dataset.webrAdminAccordionVersion !== ACCORDION_VERSION || menuList.dataset.webrAdminActiveKey !== activeKey) {
      buildAccordionMenu(menuList, activeKey);
      return true;
    }
    buttons.forEach(function (button) {
      const item = menuItemForLabel(textOf(button));
      if (item) bindButton(button, item, activeKey);
    });
    return true;
  }

  function shouldPatchForMutations(mutations) {
    return mutations.some(function (mutation) {
      const target = mutation.target;
      const element = target && target.nodeType === 1 ? target : target && target.parentElement;
      if (!element) return true;
      return !element.closest(".webr-admin-content");
    });
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
      const observer = new MutationObserver(function (mutations) {
        if (shouldPatchForMutations(mutations)) schedulePatch();
      });
      observer.observe(root, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
