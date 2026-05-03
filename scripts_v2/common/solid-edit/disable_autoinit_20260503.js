(function () {
    window.CONTENT_EDITOR_AUTOSTART = false;
    window.LOCAL_RICH_EDITOR_AUTOSTART = false;
    window.CONTENT_EDITOR_AUTOINIT = false;
    window.STATKISS_SOLID_EDIT_AUTOINIT = false;
    window.CONTENT_EDITOR_CONFIG = Object.assign({
        placeholder: "내용을 입력해주세요.",
    }, window.CONTENT_EDITOR_CONFIG || {});
    window.CONTENT_EDITOR_MATHJAX_CDN_URL = window.CONTENT_EDITOR_MATHJAX_CDN_URL || "https://cdn.jsdelivr.net/gh/mathjax/MathJax@3.2.2/es5/tex-svg.js";
    window.CONTENT_EDITOR_HLJS_SCRIPT_SRC = window.CONTENT_EDITOR_HLJS_SCRIPT_SRC || "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js";
    window.CONTENT_EDITOR_HLJS_STYLE_HREF = window.CONTENT_EDITOR_HLJS_STYLE_HREF || "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/github.min.css";
})();
