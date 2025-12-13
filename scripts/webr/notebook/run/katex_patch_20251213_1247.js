(function () {
  let tried = 0;
  const maxTry = 200; // ~10s
  const interval = 50;

  function reRenderAllMarkdownNodes() {
    try {
      document.querySelectorAll(".markdown-body").forEach((root) => {
        try {
          window.renderMathInElement(root, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
            ],
            throwOnError: false,
          });
        } catch (e) {}
      });
    } catch (e) {}
  }

  const timer = setInterval(() => {
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