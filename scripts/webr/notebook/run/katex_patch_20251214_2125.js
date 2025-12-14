/**
 * KaTeX auto-render loader patch (ES5 compatible)
 * - This file intentionally avoids let/const/arrow functions to work with some in-browser transformers.
 */
(function () {
  var tried = 0;
  var maxTry = 200; // ~10s
  var interval = 50;

  function reRenderAllMarkdownNodes() {
    try {
      var nodes = document.querySelectorAll(".markdown-body");
      for (var i = 0; i < nodes.length; i += 1) {
        var root = nodes[i];
        try {
          window.renderMathInElement(root, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false }
            ],
            throwOnError: false
          });
        } catch (e1) {}
      }
    } catch (e2) {}
  }

  var timer = setInterval(function () {
    tried += 1;

    if (window.renderMathInElement) {
      clearInterval(timer);
      reRenderAllMarkdownNodes();
      setTimeout(reRenderAllMarkdownNodes, 300);
      setTimeout(reRenderAllMarkdownNodes, 1200);
      return;
    }

    if (tried >= maxTry) clearInterval(timer);
  }, interval);
})();
