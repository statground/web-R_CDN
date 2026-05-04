(function () {
  function hardenHTMX() {
    if (!window.htmx || !window.htmx.config) {
      return;
    }
    window.htmx.config.allowEval = false;
    window.htmx.config.allowScriptTags = false;
  }

  function closeLegacyMenus() {
    if (typeof window.click_dropdown === "function") {
      window.click_dropdown();
    }
  }

  function bindLegacyShellEvents() {
    ["div_main", "div_footer"].forEach(function (id) {
      var element = document.getElementById(id);
      if (!element || element.dataset.webrShellEvents === "1") {
        return;
      }
      element.dataset.webrShellEvents = "1";
      element.addEventListener("click", closeLegacyMenus);
    });
  }

  hardenHTMX();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindLegacyShellEvents);
  } else {
    bindLegacyShellEvents();
  }
})();
