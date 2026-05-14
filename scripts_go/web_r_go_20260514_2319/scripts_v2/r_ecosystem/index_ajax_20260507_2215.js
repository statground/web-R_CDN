(function () {
  if (window.__webrREcosystemIndexAjax) {
    return;
  }
  window.__webrREcosystemIndexAjax = true;

  let activeController = null;

  function cleanURL(url) {
    const next = new URL(url, window.location.href);
    next.searchParams.delete("fragment");
    next.searchParams.delete("offset");
    return next;
  }

  function contentURL(url) {
    const next = cleanURL(url);
    next.searchParams.set("fragment", "content");
    return next;
  }

  function postBody(url) {
    return new URLSearchParams(url.search || "");
  }

  function isIndexPath(url, section) {
    if (section === "packages") {
      return url.pathname === "/r-ecosystem/packages/" || url.pathname.indexOf("/r-ecosystem/packages/repository/") === 0;
    }
    if (section === "news") {
      return url.pathname === "/r-ecosystem/" || url.pathname === "/r-ecosystem/news/" ||
        url.pathname.indexOf("/r-ecosystem/kind/") === 0 ||
        url.pathname.indexOf("/r-ecosystem/source-type/") === 0 ||
        url.pathname.indexOf("/r-ecosystem/source/") === 0 ||
        url.pathname.indexOf("/r-ecosystem/article-source/") === 0;
    }
    return false;
  }

  function setBusy(mount, busy) {
    mount.setAttribute("aria-busy", busy ? "true" : "false");
    mount.classList.toggle("opacity-70", busy);
  }

  async function fetchContentHTML(targetURL) {
    const target = contentURL(targetURL);
    const early = window.__webrEarlyFetch && typeof window.__webrEarlyFetch.take === "function"
      ? window.__webrEarlyFetch.take(target)
      : null;
    if (early) {
      const result = await early;
      return {
        ok: !!result.ok,
        status: result.status || 0,
        html: result.html || "",
        url: target
      };
    }
    const body = postBody(target);
    target.search = "";
    const response = await fetch(target, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "X-Requested-With": "fetch"
      },
      body,
      signal: activeController.signal
    });
    return {
      ok: response.ok,
      status: response.status,
      html: await response.text(),
      url: target
    };
  }

  function renderError(mount) {
    mount.innerHTML =
      '<section class="w-full bg-white"><div class="mx-auto max-w-7xl px-6 py-8">' +
      '<div class="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">' +
      "R 에코시스템 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." +
      "</div></div></section>";
    setBusy(mount, false);
  }

  async function loadContent(mount, targetURL, options) {
    const opts = options || {};
    if (activeController) {
      activeController.abort();
    }
    activeController = new AbortController();
    setBusy(mount, true);
    try {
      const result = await fetchContentHTML(targetURL);
      if (!result.ok) {
        throw new Error("HTTP " + result.status);
      }
      mount.innerHTML = result.html;
      setBusy(mount, false);
      mount.dataset.fragmentUrl = result.url.pathname + result.url.search;
      initIndex(mount);
      if (opts.push !== false && window.history && window.history.pushState) {
        const clean = cleanURL(targetURL);
        window.history.pushState({ rEcosystemAjax: true }, "", clean.pathname + clean.search + clean.hash);
      }
    } catch (error) {
      if (error && error.name === "AbortError") {
        return;
      }
      renderError(mount);
    }
  }

  function initLinks(mount) {
    const section = mount.dataset.rEcosystemSection || "";
    mount.querySelectorAll("[data-r-ecosystem-ajax-link]").forEach(function (link) {
      if (link.dataset.rEcosystemAjaxReady === "1") {
        return;
      }
      link.dataset.rEcosystemAjaxReady = "1";
      link.addEventListener("click", function (event) {
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }
        const target = new URL(link.href, window.location.href);
        if (target.origin !== window.location.origin || !isIndexPath(target, section)) {
          return;
        }
        event.preventDefault();
        loadContent(mount, target);
      });
    });
  }

  function initPackageSearch(mount) {
    mount.querySelectorAll("[data-r-package-search-form]").forEach(function (form) {
      if (form.dataset.rPackageSearchReady === "1") {
        return;
      }
      form.dataset.rPackageSearchReady = "1";
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const target = new URL(form.action || "/r-ecosystem/packages/", window.location.href);
        const data = new FormData(form);
        target.search = "";
        data.forEach(function (value, key) {
          const text = String(value || "").trim();
          if (text) {
            target.searchParams.set(key, text);
          }
        });
        loadContent(mount, target);
      });
    });
  }

  async function fetchMoreRows(row) {
    if (!row || row.dataset.rPackageMoreLoading === "1") {
      return;
    }
    const url = row.dataset.rPackageMoreUrl;
    if (!url) {
      return;
    }
    row.dataset.rPackageMoreLoading = "1";
    try {
      const target = new URL(url, window.location.href);
      const body = postBody(target);
      target.search = "";
      const response = await fetch(target, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "X-Requested-With": "fetch"
        },
        body
      });
      const html = await response.text();
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      const template = document.createElement("template");
      template.innerHTML = html;
      const parent = row.parentNode;
      const nodes = Array.from(template.content.childNodes);
      row.replaceWith.apply(row, nodes);
      if (parent) {
        initPackageMore(parent);
      }
    } catch (error) {
      row.dataset.rPackageMoreLoading = "0";
      row.querySelector("td").textContent = "다음 패키지를 불러오지 못했습니다.";
    }
  }

  function initPackageMore(root) {
    const rows = Array.from(root.querySelectorAll(".r-package-more-row[data-r-package-more-url]"));
    if (rows.length === 0) {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      rows.forEach(fetchMoreRows);
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          fetchMoreRows(entry.target);
        }
      });
    }, { rootMargin: "400px 0px" });
    rows.forEach(function (row) {
      if (row.dataset.rPackageMoreObserved === "1") {
        return;
      }
      row.dataset.rPackageMoreObserved = "1";
      observer.observe(row);
    });
  }

  function initIndex(mount) {
    initLinks(mount);
    initPackageSearch(mount);
    initPackageMore(mount);
  }

  function start() {
    const mount = document.querySelector("[data-r-ecosystem-ajax-mount]");
    if (!mount) {
      return;
    }
    const initialURL = mount.dataset.fragmentUrl || contentURL(window.location.href).pathname + contentURL(window.location.href).search;
    loadContent(mount, initialURL, { push: false });
    window.addEventListener("popstate", function () {
      loadContent(mount, window.location.href, { push: false });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
