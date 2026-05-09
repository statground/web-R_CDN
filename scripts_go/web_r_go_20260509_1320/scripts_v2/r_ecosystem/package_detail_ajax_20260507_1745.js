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
    const cards = Array.from(root.querySelectorAll("[data-r-function-card]"));
    if (!search || cards.length === 0 || search.dataset.rFunctionReady === "1") {
      return;
    }
    search.dataset.rFunctionReady = "1";

    function render() {
      const q = (search.value || "").toLowerCase().trim();
      cards.forEach(function (card) {
        card.classList.toggle("hidden", !!q && !(card.dataset.rFunctionSearchText || "").includes(q));
      });
    }

    search.addEventListener("input", render);
    render();
  }

  function initDetailInteractions(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-r-dep-table]").forEach(initDependencyTable);
    initFunctionSearch(scope);
  }

  function renderError(mount, message) {
    mount.innerHTML =
      '<section class="w-full bg-white"><div class="mx-auto max-w-7xl px-6 py-8">' +
      '<div class="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">' +
      message +
      "</div></div></section>";
    mount.setAttribute("aria-busy", "false");
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
      const response = await fetch(detailURL, {
        credentials: "same-origin",
        headers: { "X-Requested-With": "fetch" }
      });
      const html = await response.text();
      mount.innerHTML = html;
      mount.setAttribute("aria-busy", "false");
      initDetailInteractions(mount);
      if (!response.ok) {
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
