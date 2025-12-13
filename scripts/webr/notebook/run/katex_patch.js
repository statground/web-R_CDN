/**
 * KaTeX auto-render가 defer로 로딩되면,
 * 초기 마크다운 렌더 시점엔 window.renderMathInElement가 없어서 수식이 그대로 노출될 수 있음.
 *
 * ✅ 해결:
 * - KaTeX auto-render가 준비된 뒤, 화면에 렌더된 markdown 영역들을 다시 한 번 렌더
 * - 기존 코드/구조를 건드리지 않고, 런타임 패치로 해결
 */
(function () {
  let tried = 0;
  const maxTry = 200; // ~10s (50ms * 200)
  const interval = 50;

  function reRenderAllMarkdownNodes() {
    try {
      // Notebook이 사용하는 markdown 렌더 영역을 다시 KaTeX 렌더만 수행
      // (marked 재파싱은 Notebook 내부에서 하므로 여기선 DOM 기반 재렌더만)
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

      // 1) 즉시 한 번
      reRenderAllMarkdownNodes();

      // 2) React 렌더 타이밍 보정(약간 뒤 한 번 더)
      setTimeout(reRenderAllMarkdownNodes, 300);
      setTimeout(reRenderAllMarkdownNodes, 1200);
      return;
    }

    if (tried >= maxTry) {
      clearInterval(timer);
    }
  }, interval);
})();
