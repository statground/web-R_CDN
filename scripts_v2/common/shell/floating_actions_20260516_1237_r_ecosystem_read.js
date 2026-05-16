(function() {
  const STYLE_ID = "webr-floating-actions-style";
  const DOCK_ID = "webr-floating-action-dock";
  const HIDDEN_ATTR = "data-webr-floating-hidden";
  let observer = null;
  let scheduled = false;

  function getContext() {
    return window.__webr_legacy_context__ || {};
  }

  function getGlobals() {
    return window.__webr_globals__ || getContext().globals || {};
  }

  function getMode() {
    const globals = getGlobals();
    const value = typeof window.mode !== "undefined" ? window.mode : globals.mode;
    if (value == null || value === "None") {
      return "";
    }
    return String(value).trim().toLowerCase();
  }

  function getOrderID() {
    const globals = getGlobals();
    const value = typeof window.orderID !== "undefined" ? window.orderID : globals.orderID;
    if (value == null || value === "None") {
      return "";
    }
    return String(value).trim();
  }

  function normalizedPath() {
    const raw = window.location && window.location.pathname ? window.location.pathname : "/";
    return raw.endsWith("/") ? raw : raw + "/";
  }

  function normalizeBase(raw) {
    const value = String(raw || "/").trim() || "/";
    return value.endsWith("/") ? value : value + "/";
  }

  function currentBase() {
    const globals = getGlobals();
    const value = typeof window.init_url !== "undefined" ? window.init_url : globals.init_url;
    return normalizeBase(value);
  }

  function routeInfo() {
    const path = normalizedPath();
    const mode = getMode();
    if (path === "/webr/notebook/") {
      return { kind: "notebook-list", mode: "list", base: "/webr/notebook/" };
    }
    if (path.startsWith("/workshop/write/") || path.startsWith("/workshop/edit/")) {
      return { kind: "workshop-form", mode: mode || (path.includes("/write/") ? "write" : "edit"), base: "/workshop/" };
    }
    if (path === "/workshop/") {
      return { kind: "workshop-list", mode: "list", base: "/workshop/" };
    }
    if (path.startsWith("/workshop/read/")) {
      return { kind: "board-read", mode: "read", base: "/workshop/" };
    }
    if (path.startsWith("/workshop/youtube/")) {
      if (mode === "write" || mode === "edit" || path.includes("/write/") || path.includes("/edit/")) {
        return { kind: "board-editor", mode: mode || (path.includes("/write/") ? "write" : "edit"), base: "/workshop/youtube/" };
      }
      return {
        kind: path.includes("/read/") || mode === "read" ? "board-read" : "board-list",
        mode: path.includes("/read/") || mode === "read" ? "read" : "list",
        base: "/workshop/youtube/"
      };
    }
    if (path.startsWith("/intro/notice/")) {
      if (mode === "write" || mode === "edit" || path.includes("/write/") || path.includes("/edit/")) {
        return { kind: "board-editor", mode: mode || (path.includes("/write/") ? "write" : "edit"), base: "/intro/notice/" };
      }
      return {
        kind: path.includes("/read/") || mode === "read" ? "board-read" : "board-list",
        mode: path.includes("/read/") || mode === "read" ? "read" : "list",
        base: "/intro/notice/"
      };
    }
    if (path.startsWith("/community/")) {
      if (mode === "write" || mode === "edit" || path.includes("/write/") || path.includes("/edit/")) {
        return { kind: "board-editor", mode: mode || (path.includes("/write/") ? "write" : "edit"), base: currentBase() };
      }
      return {
        kind: path.includes("/read/") || mode === "read" ? "board-read" : "board-list",
        mode: path.includes("/read/") || mode === "read" ? "read" : "list",
        base: currentBase()
      };
    }
    if (path.startsWith("/r-ecosystem/read/")) {
      return { kind: "read-only-read", mode: "read", base: "/r-ecosystem/" };
    }
    return null;
  }

  function textOf(node) {
    return String(node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function isInDock(node) {
    return !!(node && node.closest && node.closest("#" + DOCK_ID));
  }

  function findActionNodes(label, root) {
    const base = root || document.getElementById("div_main") || document.body;
    return Array.from(base.querySelectorAll("button, a")).filter(function(node) {
      return !isInDock(node) && textOf(node) === label;
    });
  }

  function hideNode(node) {
    if (!node || isInDock(node)) {
      return;
    }
    node.setAttribute(HIDDEN_ATTR, "1");
    node.style.display = "none";
  }

  function originalHas(label, root) {
    return findActionNodes(label, root).length > 0;
  }

  function hideListSources(info) {
    if (info.kind === "notebook-list") {
      findActionNodes("새 Notebook 만들기").forEach(hideNode);
      return;
    }
    if (info.kind === "workshop-list") {
      Array.from((document.getElementById("div_main") || document.body).querySelectorAll("a[href='/workshop/write/'], a[href='/workshop/write']")).forEach(function(node) {
        if (textOf(node) === "워크샵 등록") {
          hideNode(node);
        }
      });
      return;
    }
    if (info.kind === "board-list") {
      findActionNodes("글쓰기").forEach(hideNode);
    }
  }

  function hideReadSources() {
    const source = document.getElementById("div_article_read_buttons");
    if (source) {
      hideNode(source);
    }
  }

  function hideEditorSources() {
    const source = document.getElementById("div_button_list");
    if (source) {
      hideNode(source);
    }
  }

  function hideWorkshopFormSources() {
    const main = document.getElementById("div_main") || document.body;
    findActionNodes("저장", main).concat(findActionNodes("저장 중...", main), findActionNodes("취소", main)).forEach(hideNode);
  }

  function hideReadOnlySources() {
    findActionNodes("목록으로 돌아가기").forEach(hideNode);
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#" + DOCK_ID + " { position: fixed; right: 1.5rem; bottom: 1.5rem; z-index: 70; display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem; pointer-events: none; }",
      "#" + DOCK_ID + " .webr-floating-action { pointer-events: auto; display: inline-flex; min-width: 112px; min-height: 48px; align-items: center; justify-content: center; border-radius: 9999px; border: 1px solid transparent; padding: 0.75rem 1.25rem; font-size: 0.875rem; font-weight: 700; line-height: 1; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.22); outline: 4px solid rgba(255, 255, 255, 0.72); transition: transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease, border-color 150ms ease; white-space: nowrap; }",
      "#" + DOCK_ID + " .webr-floating-action:hover { transform: translateY(-1px); box-shadow: 0 22px 46px rgba(15, 23, 42, 0.26); }",
      "#" + DOCK_ID + " .webr-floating-action-primary { background: #2563eb; border-color: #2563eb; color: #fff; }",
      "#" + DOCK_ID + " .webr-floating-action-primary:hover { background: #1d4ed8; border-color: #1d4ed8; }",
      "#" + DOCK_ID + " .webr-floating-action-secondary { background: #fff; border-color: #d1d5db; color: #111827; }",
      "#" + DOCK_ID + " .webr-floating-action-secondary:hover { border-color: #94a3b8; background: #f8fafc; }",
      "#" + DOCK_ID + " .webr-floating-action-danger { background: #fff; border-color: #fecaca; color: #dc2626; }",
      "#" + DOCK_ID + " .webr-floating-action-danger:hover { background: #fee2e2; border-color: #fca5a5; }",
      "#" + DOCK_ID + " .webr-floating-action-ghost { background: rgba(255, 255, 255, 0.92); border-color: #e5e7eb; color: #374151; }",
      "#" + DOCK_ID + " .webr-floating-action[disabled], #" + DOCK_ID + " .webr-floating-action-disabled { cursor: wait; opacity: 0.72; transform: none; }",
      "body.webr-has-floating-actions { padding-bottom: 6rem; }",
      "@media (max-width: 640px) { #" + DOCK_ID + " { right: 1rem; bottom: 1rem; gap: 0.625rem; } #" + DOCK_ID + " .webr-floating-action { min-width: 104px; min-height: 44px; padding: 0.65rem 1rem; font-size: 0.8125rem; } body.webr-has-floating-actions { padding-bottom: 5.25rem; } }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function removeDock() {
    const dock = document.getElementById(DOCK_ID);
    if (dock) {
      dock.remove();
    }
    document.body.classList.remove("webr-has-floating-actions");
  }

  function createButton(action) {
    const disabled = !!action.disabled;
    const node = action.href && !disabled ? document.createElement("a") : document.createElement("button");
    node.className = "webr-floating-action webr-floating-action-" + (action.tone || "secondary") + (disabled ? " webr-floating-action-disabled" : "");
    node.textContent = action.label;
    if (action.href && !disabled) {
      node.href = action.href;
    } else {
      node.type = "button";
    }
    if (disabled) {
      node.disabled = true;
      node.setAttribute("aria-disabled", "true");
    } else if (typeof action.onClick === "function") {
      node.addEventListener("click", action.onClick);
    }
    return node;
  }

  function loggedIn() {
    return String(window.gv_username || "").trim() !== "";
  }

  function requireLoginThen(callback) {
    if (!loggedIn()) {
      alert("로그인이 필요합니다.");
      return;
    }
    callback();
  }

  function goTo(url) {
    window.location.href = url;
  }

  function clickOriginal(node) {
    if (node && typeof node.click === "function") {
      node.click();
    }
  }

  function firstAction(label, root) {
    const matches = findActionNodes(label, root);
    return matches.length ? matches[0] : null;
  }

  function isBusyNode(node) {
    return !!(node && (node.disabled || String(node.className || "").includes("cursor-not-allowed") || textOf(node).includes("중")));
  }

  function buildActions(info) {
    const actions = [];
    const base = info.base || currentBase();
    const orderID = getOrderID();
    if (info.kind === "notebook-list") {
      actions.push({ label: "새 Notebook", tone: "primary", href: "/webr/notebook/new/" });
      return actions;
    }
    if (info.kind === "workshop-list") {
      const hasAdminWrite = Array.from((document.getElementById("div_main") || document.body).querySelectorAll("a[href='/workshop/write/'], a[href='/workshop/write']")).some(function(node) {
        return textOf(node) === "워크샵 등록";
      });
      if (hasAdminWrite) {
        actions.push({ label: "워크샵 등록", tone: "primary", href: "/workshop/write/" });
      }
      return actions;
    }
    if (info.kind === "board-list") {
      actions.push({ label: "글쓰기", tone: "primary", onClick: function() { requireLoginThen(function() { goTo(base + "write/"); }); } });
      return actions;
    }
    if (info.kind === "board-read") {
      const source = document.getElementById("div_article_read_buttons");
      const canEdit = source ? originalHas("수정", source) : false;
      const canDelete = source ? originalHas("삭제", source) : false;
      actions.push({ label: "글쓰기", tone: "primary", onClick: function() { requireLoginThen(function() { goTo(base + "write/"); }); } });
      if (canEdit && orderID) {
        actions.push({ label: "수정", tone: "secondary", href: base + "edit/" + orderID + "/" });
      }
      if (canDelete) {
        actions.push({ label: "삭제", tone: "danger", onClick: function() { if (typeof window.click_btn_delete === "function") { window.click_btn_delete(); } } });
      }
      actions.push({ label: "목록", tone: "ghost", href: base });
    }
    if (info.kind === "read-only-read") {
      actions.push({ label: "목록", tone: "ghost", href: base });
    }
    if (info.kind === "board-editor") {
      const source = document.getElementById("div_button_list");
      const submit = source ? firstAction("완료", source) : null;
      const list = source ? firstAction("목록으로", source) : null;
      if (submit) {
        actions.push({ label: "완료", tone: "primary", disabled: isBusyNode(submit), onClick: function() { clickOriginal(submit); } });
      }
      actions.push({ label: "목록", tone: "ghost", href: list && list.href ? list.href : base });
    }
    if (info.kind === "workshop-form") {
      const main = document.getElementById("div_main") || document.body;
      const save = firstAction("저장", main) || firstAction("저장 중...", main);
      const cancel = firstAction("취소", main);
      if (save) {
        actions.push({ label: textOf(save) || "저장", tone: "primary", disabled: isBusyNode(save), onClick: function() { clickOriginal(save); } });
      }
      if (cancel) {
        actions.push({ label: "취소", tone: "ghost", href: cancel.href || base });
      }
    }
    return actions;
  }

  function renderDock(actions) {
    if (!actions.length) {
      removeDock();
      return;
    }
    ensureStyle();
    let dock = document.getElementById(DOCK_ID);
    if (!dock) {
      dock = document.createElement("div");
      dock.id = DOCK_ID;
      dock.setAttribute("aria-label", "빠른 작업");
      document.body.appendChild(dock);
    }
    dock.innerHTML = "";
    actions.forEach(function(action) {
      dock.appendChild(createButton(action));
    });
    document.body.classList.add("webr-has-floating-actions");
  }

  function applyFloatingActions() {
    scheduled = false;
    const info = routeInfo();
    if (!info) {
      removeDock();
      return;
    }
    if (info.kind === "board-read") {
      hideReadSources();
    } else if (info.kind === "read-only-read") {
      hideReadOnlySources();
    } else if (info.kind === "board-editor") {
      hideEditorSources();
    } else if (info.kind === "workshop-form") {
      hideWorkshopFormSources();
    } else {
      hideListSources(info);
    }
    renderDock(buildActions(info));
    ensureObserver();
  }

  function scheduleApply(delay) {
    window.setTimeout(function() {
      if (scheduled) {
        return;
      }
      scheduled = true;
      window.requestAnimationFrame(applyFloatingActions);
    }, delay || 0);
  }

  function scheduleApplyBurst() {
    [0, 80, 250, 700, 1400].forEach(scheduleApply);
  }

  function ensureObserver() {
    if (observer) {
      return;
    }
    const target = document.getElementById("div_main");
    if (!target || typeof MutationObserver === "undefined") {
      return;
    }
    observer = new MutationObserver(function() {
      scheduleApply(30);
    });
    observer.observe(target, { childList: true, subtree: true });
  }

  function wrapSetMain() {
    if (typeof window.set_main !== "function" || window.set_main.__webrFloatingWrapped) {
      return;
    }
    const original = window.set_main;
    window.set_main = function() {
      const result = original.apply(this, arguments);
      Promise.resolve(result).then(scheduleApplyBurst, scheduleApplyBurst);
      return result;
    };
    window.set_main.__webrFloatingWrapped = true;
  }

  wrapSetMain();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      wrapSetMain();
      scheduleApplyBurst();
    });
  } else {
    scheduleApplyBurst();
  }
})();
