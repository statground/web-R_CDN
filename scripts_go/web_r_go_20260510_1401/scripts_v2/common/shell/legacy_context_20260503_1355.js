(function() {
  function readContext() {
    const node = document.getElementById("webr-legacy-context");
    if (!node) {
      return {};
    }
    try {
      return JSON.parse(node.textContent || "{}") || {};
    } catch (error) {
      console.error("legacy context parse failed", error);
      return {};
    }
  }
  const context = readContext();
  const globals = context.globals || {};
  window.__webr_legacy_context__ = context;
  window.__webr_globals__ = globals;
  window.gv_username = context.gv_username || "";
  window.gv_role = context.gv_role || "";
  Object.keys(globals).forEach(function(key) {
    window[key] = globals[key];
  });
})();
