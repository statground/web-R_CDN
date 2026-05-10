(function () {
  if (window.__webrRPackageDetailAjax) {
    return;
  }
  window.__webrRPackageDetailAjax = true;

  function initDependencyTable(table) {
    if (!table || table.dataset.rDepReady === "1") {
      return;
    }
    table.dataset.rDepReady = "1";

    const rows = Array.from(table.querySelectorAll("[data-r-dep-row]"));
    const search = table.querySelector("[data-r-dep-search]");
    const toggle = table.querySelector("[data-r-dep-toggle]");
    const prev = table.querySelector("[data-r-dep-prev]");
    const next = table.querySelector("[data-r-dep-next]");
    const pageLabel = table.querySelector("[data-r-dep-page]");
    const visibleCount = table.querySelector("[data-r-dep-visible-count]");
    const empty = table.querySelector("[data-r-dep-empty]");
    const pageSize = parseInt(table.dataset.pageSize || "5", 10);
    let page = 0;

    function filteredRows() {
      const q = (search && search.value ? search.value : "").toLowerCase().trim();
      return rows.filter(function (row) {
        return !q || (row.dataset.rDepSearchText || "").includes(q);
      });
    }

    function render() {
      const expanded = table.dataset.expanded === "1";
      const filtered = filteredRows();
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
      if (page >= pages) page = pages - 1;
      if (page < 0) page = 0;

      rows.forEach(function (row) {
        row.classList.add("hidden");
      });

      const shown = expanded ? filtered : filtered.slice(page * pageSize, page * pageSize + pageSize);
      shown.forEach(function (row) {
        row.classList.remove("hidden");
      });

      if (empty) empty.classList.toggle("hidden", filtered.length !== 0);
      if (visibleCount) visibleCount.textContent = String(shown.length) + "개 표시";
      if (pageLabel) pageLabel.textContent = expanded ? "전체 표시" : String(page + 1) + " / " + String(pages);
      if (prev) prev.disabled = expanded || page <= 0;
      if (next) next.disabled = expanded || page >= pages - 1;
      if (toggle) toggle.textContent = expanded ? "5개씩 보기" : "전부 펼치기";
    }

    if (search) {
      search.addEventListener("input", function () {
        page = 0;
        render();
      });
    }
    if (toggle) {
      toggle.addEventListener("click", function () {
        table.dataset.expanded = table.dataset.expanded === "1" ? "0" : "1";
        render();
      });
    }
    if (prev) {
      prev.addEventListener("click", function () {
        page -= 1;
        render();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        page += 1;
        render();
      });
    }
    render();
  }

  function initFunctionSearch(root) {
    const search = root.querySelector("[data-r-function-search]");
    const rows = Array.from(root.querySelectorAll("[data-r-function-search-row], [data-r-function-card]"));
    if (!search || rows.length === 0 || search.dataset.rFunctionReady === "1") {
      return;
    }
    search.dataset.rFunctionReady = "1";

    function render() {
      const q = (search.value || "").toLowerCase().trim();
      rows.forEach(function (row) {
        row.classList.toggle("hidden", !!q && !(row.dataset.rFunctionSearchText || "").includes(q));
      });
    }

    search.addEventListener("input", render);
    render();
  }

  function initManualTopicLinks(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-r-function-card]").forEach(function (card) {
      if (card.dataset.rManualLinkReady === "1") {
        return;
      }
      card.dataset.rManualLinkReady = "1";
      card.addEventListener("click", function () {
        const href = card.getAttribute("href") || "";
        if (!href.startsWith("#") || href.length < 2) {
          return;
        }
        const target = document.getElementById(href.slice(1));
        if (!target) {
          return;
        }
        const panel = target.closest("[data-r-manual-panel]");
        if (panel && "open" in panel) {
          panel.open = true;
        }
        if ("open" in target) {
          target.open = true;
        }
        window.setTimeout(function () {
          target.scrollIntoView({ block: "start", behavior: "smooth" });
        }, 0);
      });
    });
  }

  function highlightCode(root) {
    const scope = root || document;
    if (!window.hljs || typeof window.hljs.highlightElement !== "function") {
      return;
    }
    scope.querySelectorAll("pre code").forEach(function (code) {
      if (code.dataset.rHighlightReady === "1") {
        return;
      }
      window.hljs.highlightElement(code);
      code.dataset.rHighlightReady = "1";
    });
  }

  function initCodeCopy(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-r-copy-code]").forEach(function (button) {
      if (button.dataset.rCopyReady === "1") {
        return;
      }
      button.dataset.rCopyReady = "1";
      button.addEventListener("click", async function () {
        const block = button.closest("[data-r-code-block]");
        const code = block ? block.querySelector("code") : null;
        const text = code ? code.textContent || "" : "";
        if (!text) {
          return;
        }
        try {
          await navigator.clipboard.writeText(text);
          const oldText = button.textContent;
          button.textContent = "Copied";
          window.setTimeout(function () {
            button.textContent = oldText || "Copy";
          }, 1200);
        } catch (error) {
          const range = document.createRange();
          range.selectNodeContents(code);
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      });
    });
  }

  function initInstallTabs(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-r-install-tabs]").forEach(function (tabs) {
      if (tabs.dataset.rInstallReady === "1") {
        return;
      }
      tabs.dataset.rInstallReady = "1";
      const card = tabs.closest("aside") || tabs.parentElement;
      const code = card ? card.querySelector("[data-r-code-block] code") : null;
      const label = card ? card.querySelector("[data-r-code-label]") : null;
      tabs.addEventListener("click", function (event) {
        const button = event.target.closest("[data-r-install-tab]");
        if (!button || !code) {
          return;
        }
        tabs.querySelectorAll("[data-r-install-tab]").forEach(function (tab) {
          tab.classList.remove("bg-white", "text-blue-700");
          tab.classList.add("text-slate-600");
          tab.setAttribute("aria-pressed", "false");
        });
        button.classList.remove("text-slate-600");
        button.classList.add("bg-white", "text-blue-700");
        button.setAttribute("aria-pressed", "true");
        code.textContent = button.dataset.code || "";
        code.removeAttribute("data-highlighted");
        code.dataset.rHighlightReady = "0";
        if (label) {
          label.textContent = button.dataset.hint || button.textContent || "R";
        }
        highlightCode(card);
      });
    });
  }

  async function loadVersionReference(button) {
    const fragmentURL = button ? button.dataset.rPackageVersionDocUrl : "";
    if (!fragmentURL || button.dataset.rPackageVersionDocLoading === "1") {
      return;
    }
    button.dataset.rPackageVersionDocLoading = "1";
    const oldText = button.textContent;
    button.textContent = "Loading";
    button.disabled = true;
    try {
      const request = postFragmentInit(fragmentURL, { Accept: "application/json" });
      const response = await fetch(request.url, request.init);
      const payload = await response.json();
      const target =
        document.querySelector("[data-r-package-reference]") ||
        document.querySelector('[data-r-package-manual-target="manual"]');
      replaceOuterHTML(target, payload.reference_html || payload.manual_html || "");
      initDetailInteractions(document);
      const nextTarget = document.querySelector("[data-r-package-reference]");
      if (nextTarget) {
        nextTarget.scrollIntoView({ block: "start", behavior: "smooth" });
      }
      if (!response.ok) {
        document.documentElement.dataset.rPackageManualStatus = "error";
      }
    } catch (error) {
      button.textContent = "Retry";
    } finally {
      button.disabled = false;
      if (button.textContent === "Loading") {
        button.textContent = oldText || "Docs";
      }
      button.dataset.rPackageVersionDocLoading = "0";
    }
  }

  function initVersionReferenceButtons(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-r-package-version-doc-url]").forEach(function (button) {
      if (button.dataset.rPackageVersionDocReady === "1") {
        return;
      }
      button.dataset.rPackageVersionDocReady = "1";
      button.addEventListener("click", function () {
        void loadVersionReference(button);
      });
    });
  }

  function initDetailInteractions(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-r-dep-table]").forEach(initDependencyTable);
    initFunctionSearch(scope);
    initManualTopicLinks(scope);
    initInstallTabs(scope);
    initVersionReferenceButtons(scope);
    initCodeCopy(scope);
    highlightCode(scope);
  }

  function renderError(mount, message) {
    mount.innerHTML =
      '<section class="w-full bg-white"><div class="mx-auto max-w-7xl px-6 py-8">' +
      '<div class="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">' +
      message +
      "</div></div></section>";
    mount.setAttribute("aria-busy", "false");
  }

  function renderLazyError(target, message) {
    if (!target) {
      return;
    }
    target.innerHTML =
      '<div class="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">' +
      message +
      "</div>";
    target.setAttribute("aria-busy", "false");
  }

  function replaceOuterHTML(target, html) {
    if (!target || typeof html !== "string") {
      return;
    }
    const trimmed = html.trim();
    if (!trimmed) {
      target.remove();
      return;
    }
    target.outerHTML = trimmed;
  }

  function postFragmentInit(rawURL, headers) {
    const target = new URL(rawURL, window.location.href);
    const body = new URLSearchParams(target.search || "");
    target.search = "";
    return {
      url: target,
      init: {
        method: "POST",
        credentials: "same-origin",
        headers: Object.assign({
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "X-Requested-With": "fetch"
        }, headers || {}),
        body
      }
    };
  }

  async function fetchDetailHTML(detailURL) {
    const early = window.__webrEarlyFetch && typeof window.__webrEarlyFetch.take === "function"
      ? window.__webrEarlyFetch.take(detailURL)
      : null;
    if (early) {
      const result = await early;
      return {
        ok: !!result.ok,
        status: result.status || 0,
        html: result.html || ""
      };
    }
    const request = postFragmentInit(detailURL);
    const response = await fetch(request.url, request.init);
    return {
      ok: response.ok,
      status: response.status,
      html: await response.text()
    };
  }

  async function loadDependencyFragments(root) {
    const scope = root || document;
    const slots = Array.from(scope.querySelectorAll("[data-r-package-dependencies-url]"));
    await Promise.all(
      slots.map(async function (slot) {
        if (!slot || slot.dataset.rPackageDependenciesLoading === "1") {
          return;
        }
        const fragmentURL = slot.dataset.rPackageDependenciesUrl;
        if (!fragmentURL) {
          return;
        }
        slot.dataset.rPackageDependenciesLoading = "1";
        try {
          const request = postFragmentInit(fragmentURL, { Accept: "text/html" });
          const response = await fetch(request.url, request.init);
          const html = await response.text();
          replaceOuterHTML(slot, html);
          initDetailInteractions(document);
          if (!response.ok) {
            document.documentElement.dataset.rPackageDependenciesStatus = "error";
          }
        } catch (error) {
          renderLazyError(slot, "dependency 정보를 불러오지 못했습니다.");
        }
      })
    );
  }

  async function loadManualFragments(root) {
    const scope = root || document;
    const trigger = scope.querySelector("[data-r-package-manual-url]");
    if (!trigger || trigger.dataset.rPackageManualLoading === "1") {
      return;
    }
    const fragmentURL = trigger.dataset.rPackageManualUrl;
    if (!fragmentURL) {
      return;
    }
    trigger.dataset.rPackageManualLoading = "1";

    const functionTarget = document.querySelector('[data-r-package-manual-target="functions"]');
    const manualTarget = document.querySelector('[data-r-package-manual-target="manual"]');
    try {
      const request = postFragmentInit(fragmentURL, { Accept: "application/json" });
      const response = await fetch(request.url, request.init);
      const payload = await response.json();
      replaceOuterHTML(functionTarget, payload.functions_html || "");
      replaceOuterHTML(manualTarget, payload.manual_html || "");
      initDetailInteractions(document);
      if (!response.ok) {
        document.documentElement.dataset.rPackageManualStatus = "error";
      }
    } catch (error) {
      renderLazyError(functionTarget, "함수 목록을 불러오지 못했습니다.");
      renderLazyError(manualTarget, "manual topic을 불러오지 못했습니다.");
    }
  }

  async function loadVersionFragments(root) {
    const scope = root || document;
    const slots = Array.from(scope.querySelectorAll("[data-r-package-versions-url]"));
    await Promise.all(
      slots.map(async function (slot) {
        if (!slot || slot.dataset.rPackageVersionsLoading === "1") {
          return;
        }
        const fragmentURL = slot.dataset.rPackageVersionsUrl;
        if (!fragmentURL) {
          return;
        }
        slot.dataset.rPackageVersionsLoading = "1";
        try {
          const request = postFragmentInit(fragmentURL, { Accept: "text/html" });
          const response = await fetch(request.url, request.init);
          const html = await response.text();
          replaceOuterHTML(slot, html);
          if (!response.ok) {
            document.documentElement.dataset.rPackageVersionsStatus = "error";
          }
        } catch (error) {
          renderLazyError(slot, "버전 이력을 불러오지 못했습니다.");
        }
      })
    );
  }

  async function loadLazyFragments(root) {
    await Promise.all([loadDependencyFragments(root), loadManualFragments(root), loadVersionFragments(root)]);
  }

  async function loadDetail() {
    const mount = document.querySelector("[data-r-package-detail-mount]");
    if (!mount) {
      initDetailInteractions(document);
      return;
    }

    const detailURL = mount.dataset.detailUrl;
    if (!detailURL) {
      renderError(mount, "상세 데이터를 불러올 주소가 없습니다.");
      return;
    }

    try {
      const result = await fetchDetailHTML(detailURL);
      mount.innerHTML = result.html;
      mount.setAttribute("aria-busy", "false");
      initDetailInteractions(mount);
      void loadLazyFragments(mount);
      if (!result.ok) {
        mount.dataset.loadStatus = "error";
      }
    } catch (error) {
      renderError(mount, "상세 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadDetail, { once: true });
  } else {
    loadDetail();
  }
})();
