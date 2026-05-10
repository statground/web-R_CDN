(function () {
  if (window.__webrRPackageDetailPager) {
    return;
  }
  window.__webrRPackageDetailPager = true;

  function init(table) {
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
      return rows.filter((row) => !q || (row.dataset.rDepSearchText || "").includes(q));
    }

    function render() {
      const expanded = table.dataset.expanded === "1";
      const filtered = filteredRows();
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
      if (page >= pages) page = pages - 1;
      if (page < 0) page = 0;

      rows.forEach((row) => row.classList.add("hidden"));
      const shown = expanded ? filtered : filtered.slice(page * pageSize, page * pageSize + pageSize);
      shown.forEach((row) => row.classList.remove("hidden"));

      if (empty) empty.classList.toggle("hidden", filtered.length !== 0);
      if (visibleCount) visibleCount.textContent = String(shown.length) + "개 표시";
      if (pageLabel) pageLabel.textContent = expanded ? "전체 표시" : String(page + 1) + " / " + String(pages);
      if (prev) prev.disabled = expanded || page <= 0;
      if (next) next.disabled = expanded || page >= pages - 1;
      if (toggle) toggle.textContent = expanded ? "5개씩 보기" : "전부 펼치기";
    }

    if (search) search.addEventListener("input", function () { page = 0; render(); });
    if (toggle) toggle.addEventListener("click", function () {
      table.dataset.expanded = table.dataset.expanded === "1" ? "0" : "1";
      render();
    });
    if (prev) prev.addEventListener("click", function () { page -= 1; render(); });
    if (next) next.addEventListener("click", function () { page += 1; render(); });
    render();
  }

  function initAll() {
    document.querySelectorAll("[data-r-dep-table]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll, { once: true });
  } else {
    initAll();
  }
})();
