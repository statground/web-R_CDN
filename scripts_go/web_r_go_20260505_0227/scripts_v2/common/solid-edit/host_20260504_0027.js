(function() {
  const STYLE_ID = "webr-solid-editor-host-style";
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
            .webr-solid-editor-shell {
                position: relative;
                overflow: visible !important;
            }
            .webr-solid-editor-host {
                display: block;
                width: 100%;
                min-height: 640px;
                padding: 18px;
            }
            .webr-solid-editor-textarea {
                display: none !important;
            }
            .webr-solid-editor-fallback {
                display: block;
                width: 100%;
                min-height: 560px;
                border: 1px solid #cbd5e1;
                border-radius: 16px;
                background: #fff;
                color: #0f172a;
                padding: 16px;
                font-size: 14px;
                line-height: 1.6;
                outline: none;
            }
            .webr-solid-editor-host .solid-embedded-editor-host {
                display: block;
                width: 100%;
            }
            .webr-solid-editor-host .lre-root {
                min-height: 0 !important;
                padding: 0 !important;
            }
            .webr-solid-editor-host .lre-docbar,
            .webr-solid-editor-host #lreDocTitle,
            .webr-solid-editor-host .lre-doc-title {
                display: none !important;
            }
            .webr-solid-editor-host .lre-app,
            .webr-solid-editor-host .lre-surface,
            .webr-solid-editor-host .lre-main-wrap,
            .webr-solid-editor-host .lre-editor-shell {
                background: transparent !important;
                border: 0 !important;
                border-radius: 0 !important;
                box-shadow: none !important;
            }
            .webr-solid-editor-host .lre-surface {
                padding: 0 !important;
            }
            .webr-solid-editor-host .lre-root.lre-embedded-content .lre-editor-page {
                width: 100% !important;
                max-width: none !important;
                min-height: 560px !important;
            }
            .webr-solid-editor-host .lre-dialog,
            .webr-solid-editor-host .lre-color-popover,
            .webr-solid-editor-host .table-picker-overlay,
            .webr-solid-editor-host .lre-slash-menu {
                z-index: 40;
            }
            @media (max-width: 980px) {
                .webr-solid-editor-host {
                    min-height: 520px;
                    padding: 12px;
                }
                .webr-solid-editor-host .lre-root.lre-embedded-content .lre-editor-page {
                    min-height: 420px !important;
                }
            }
        `;
    document.head.appendChild(style);
  }
  function getMountApi() {
    return window.mountContentEditor || window.mountStatkissContentEditor || window.mountEmbeddedContentEditor || null;
  }
  function getInitApi() {
    return window.initContentEditor || window.initStatkissContentEditor || null;
  }
  function waitForApi(timeoutMs = 15e3, interval = 50) {
    return new Promise((resolve, reject) => {
      const timeout = Number(timeoutMs) > 0 ? Number(timeoutMs) : 15e3;
      const startedAt = Date.now();
      function finish() {
        const initApi = getInitApi();
        const mountApi = getMountApi();
        if (typeof initApi !== "function" && typeof mountApi !== "function") {
          return false;
        }
        resolve(initApi || mountApi);
        return true;
      }
      if (finish()) {
        return;
      }
      const timer = window.setInterval(() => {
        if (finish()) {
          window.clearInterval(timer);
          return;
        }
        if (Date.now() - startedAt > timeout) {
          window.clearInterval(timer);
          reject(new Error("SolidEdit API was not found. Load editor.js before mounting."));
        }
      }, interval);
    });
  }
  function destroy(editor) {
    const instance = editor || null;
    if (typeof window.destroyLocalRichEditor === "function") {
      try {
        return !!window.destroyLocalRichEditor(instance || void 0);
      } catch (_) {
        return false;
      }
    }
    if (instance && instance.root && instance.root.parentNode) {
      instance.root.parentNode.removeChild(instance.root);
      return true;
    }
    if (instance && instance.host && instance.host.parentNode) {
      instance.host.innerHTML = "";
      return true;
    }
    return false;
  }
  function createFallback(host, textarea, options) {
    const target = host || document.createElement("div");
    const field = textarea || document.createElement("textarea");
    target.innerHTML = "";
    target.classList.add("webr-solid-editor-host");
    field.className = "webr-solid-editor-fallback";
    field.setAttribute("rows", "18");
    field.setAttribute("spellcheck", "true");
    if (options && typeof options.placeholder === "string") {
      field.setAttribute("placeholder", options.placeholder);
    }
    if (options && typeof options.html === "string") {
      field.value = options.html;
    }
    target.appendChild(field);
    return {
      failed: true,
      host: target,
      textarea: field,
      getHTML: () => field.value || "",
      setHTML: (html) => {
        field.value = String(html || "");
      },
      __hostMirrorNow: () => field.value || "",
      destroy: () => {
        target.innerHTML = "";
      }
    };
  }
  function syncEnvironment(editor, options) {
    const api = editor || null;
    if (!api || api.failed) {
      return api;
    }
    const nextLang = String(options && options.lang || "ko").trim() || "ko";
    const nextTitle = String(options && options.title || "").trim();
    const nextPlaceholder = String(options && options.placeholder || "").trim();
    try {
      if (api.root) {
        api.root.setAttribute("lang", nextLang);
      }
      api.state = api.state || {};
      api.state.dark = !!(options && options.dark);
      document.body.classList.toggle("lre-dark", !!api.state.dark);
      if (nextTitle && typeof api.setTitle === "function") {
        api.setTitle(nextTitle);
      } else if (api.docTitle) {
        api.docTitle.value = nextTitle || "";
      }
      if (api.editor && nextPlaceholder) {
        api.editor.setAttribute("data-placeholder", nextPlaceholder);
      }
      if (typeof api.updateToolbarActiveState === "function")
        api.updateToolbarActiveState();
      if (typeof api.renderAllCodeBlocks === "function")
        api.renderAllCodeBlocks();
      if (typeof api.renderAllMath === "function")
        api.renderAllMath();
      if (typeof api.updateOutline === "function")
        api.updateOutline();
      if (typeof api.updateSourceView === "function")
        api.updateSourceView();
      if (typeof api.updateStatus === "function")
        api.updateStatus();
      if (typeof api.updateLayout === "function")
        api.updateLayout();
    } catch (_) {
    }
    return api;
  }
  function setHTML(editor, html) {
    const api = editor || null;
    const value = String(html || "");
    if (!api) {
      return false;
    }
    if (api.failed) {
      api.setHTML(value);
      return true;
    }
    if (!api.editor) {
      return false;
    }
    try {
      if (typeof api.setHTML === "function") {
        api.setHTML(value);
      } else {
        api.editor.innerHTML = value;
        if (typeof api.normalizeAfterImport === "function") {
          api.normalizeAfterImport();
        }
      }
      if (typeof api.__hostMirrorNow === "function") {
        api.__hostMirrorNow(true);
      }
      return true;
    } catch (_) {
      return false;
    }
  }
  function getHTML(editor) {
    const api = editor || null;
    if (!api) {
      return "";
    }
    if (api.failed) {
      return api.getHTML();
    }
    try {
      const html = typeof api.getHTML === "function" ? api.getHTML() : api.editor ? api.editor.innerHTML : "";
      if (typeof api.__hostMirrorNow === "function") {
        api.__hostMirrorNow(true);
      }
      return String(html || "");
    } catch (_) {
      return "";
    }
  }
  function isEmpty(html) {
    const raw = String(html || "").trim();
    if (!raw) {
      return true;
    }
    if (/<(img|video|audio|iframe|table|pre|code|figure|hr|math|svg)\b/i.test(raw)) {
      return false;
    }
    return raw.replace(/<br\s*\/?>/gi, "").replace(/&nbsp;/gi, " ").replace(/<[^>]*>/g, "").trim() === "";
  }
  async function mountHost(host, options) {
    if (!host) {
      return null;
    }
    const mergedOptions = Object.assign({
      restoreDraft: true,
      ribbonExpanded: false,
      lang: "ko"
    }, options || {});
    injectStyles();
    destroy(host.__webrSolidEditorInstance);
    if (window.localRichEditor && window.localRichEditor.root && !host.contains(window.localRichEditor.root)) {
      destroy(window.localRichEditor);
      window.localRichEditor = null;
    }
    host.__webrSolidEditorInstance = null;
    host.innerHTML = "";
    host.classList.add("webr-solid-editor-host");
    const textarea = document.createElement("textarea");
    textarea.className = "webr-solid-editor-textarea";
    textarea.setAttribute("rows", "18");
    textarea.setAttribute("spellcheck", "true");
    if (mergedOptions.textareaID) {
      textarea.id = mergedOptions.textareaID;
    }
    if (mergedOptions.textareaName) {
      textarea.name = mergedOptions.textareaName;
    }
    if (typeof mergedOptions.placeholder === "string") {
      textarea.setAttribute("placeholder", mergedOptions.placeholder);
    }
    if (typeof mergedOptions.html === "string") {
      textarea.value = mergedOptions.html;
    }
    host.appendChild(textarea);
    try {
      await waitForApi(mergedOptions.timeoutMs || 15e3);
      let instance = null;
      const mountContentEditor = getMountApi();
      if (typeof mountContentEditor !== "function") {
        throw new Error("SolidEdit mount API is unavailable.");
      }
      instance = mountContentEditor(textarea, mergedOptions);
      if (!instance || !instance.editor) {
        throw new Error("SolidEdit did not initialize.");
      }
      host.__webrSolidEditorInstance = instance;
      syncEnvironment(instance, mergedOptions);
      if (typeof mergedOptions.html === "string") {
        setHTML(instance, mergedOptions.html);
      }
      return instance;
    } catch (error) {
      try {
        console.error("[Web-R] SolidEdit mount failed", error);
      } catch (_) {
      }
      const fallback = createFallback(host, textarea, mergedOptions);
      host.__webrSolidEditorInstance = fallback;
      return fallback;
    }
  }
  window.WebRSolidEditor = {
    injectStyles,
    getMountApi,
    getInitApi,
    waitForApi,
    destroy,
    mountHost,
    syncEnvironment,
    setHTML,
    getHTML,
    isEmpty
  };
})();
