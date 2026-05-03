(function () {
  function shouldCallSetMain() {
    const context = window.__webr_legacy_context__ || {};
    return !!context.call_set_main;
  }

  function renderShellOnce() {
    if (window.__webr_legacy_shell_rendered__) {
      return;
    }

    const menu = document.getElementById("div_menu");
    if (menu && typeof Div_menu === "function") {
      ReactDOM.render(React.createElement(Div_menu), menu);
    }

    if (typeof data_footer === "object" && data_footer !== null) {
      data_footer.administrator = "Web-R 운영자: 문건웅";
    }
    if (typeof set_footer === "function") {
      set_footer();
    }
    if (typeof get_menu_header === "function") {
      get_menu_header();
    }

    window.__webr_legacy_shell_rendered__ = true;
  }

  function boot(attempt) {
    if (attempt > 200) {
      console.error("legacy shell bootstrap timeout");
      return;
    }

    const needsShell =
      document.getElementById("div_menu") ||
      document.getElementById("div_footer");
    const shellReady =
      typeof Div_menu === "function" &&
      typeof set_footer === "function" &&
      typeof get_menu_header === "function";

    if (needsShell && !shellReady) {
      window.setTimeout(function () {
        boot(attempt + 1);
      }, 25);
      return;
    }

    renderShellOnce();

    if (shouldCallSetMain() && typeof set_main !== "function") {
      window.setTimeout(function () {
        boot(attempt + 1);
      }, 25);
      return;
    }

    if (shouldCallSetMain() && !window.__webr_set_main_called__) {
      window.__webr_set_main_called__ = true;
      set_main();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      boot(0);
    });
  } else {
    boot(0);
  }
})();
