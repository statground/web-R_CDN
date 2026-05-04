(function () {
  function sanitizeHTML(html) {
    const source = String(html || "");
    const template = document.createElement("template");
    template.innerHTML = source;
    template.content.querySelectorAll("script, style, iframe, object, embed").forEach(function (node) {
      node.remove();
    });
    template.content.querySelectorAll("*").forEach(function (node) {
      Array.from(node.attributes || []).forEach(function (attr) {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || "").trim().toLowerCase();
        if (name.indexOf("on") === 0 || value.indexOf("javascript:") === 0) {
          node.removeAttribute(attr.name);
        }
      });
    });
    return template.innerHTML;
  }

  function renderContent(target, html) {
    if (!target) {
      return null;
    }
    target.innerHTML = sanitizeHTML(html);
    target.classList.add("webr-solid-content-viewer");
    return target;
  }

  function mountEditor(target, options) {
    const host = target || document.createElement("div");
    const config = Object.assign({
      html: "",
      placeholder: "내용을 입력해주세요.",
      restoreDraft: false,
      ribbonExpanded: false,
      height: "250px",
      timeoutMs: 15000,
    }, options || {});
    const wrapper = {
      host,
      instance: null,
      pendingHTML: typeof config.html === "string" ? config.html : "",
      getHTML: function () {
        if (this.instance && window.WebRSolidEditor) {
          return window.WebRSolidEditor.getHTML(this.instance);
        }
        const textarea = this.host.querySelector("textarea");
        return textarea ? textarea.value || "" : this.pendingHTML || "";
      },
      setHTML: function (html) {
        this.pendingHTML = String(html || "");
        if (this.instance && window.WebRSolidEditor) {
          window.WebRSolidEditor.setHTML(this.instance, this.pendingHTML);
          return;
        }
        const textarea = this.host.querySelector("textarea");
        if (textarea) {
          textarea.value = this.pendingHTML;
        }
      },
      destroy: function () {
        if (this.instance && window.WebRSolidEditor) {
          window.WebRSolidEditor.destroy(this.instance);
        } else {
          this.host.innerHTML = "";
        }
      },
    };

    if (!window.WebRSolidEditor || typeof window.WebRSolidEditor.mountHost !== "function") {
      const textarea = document.createElement("textarea");
      textarea.className = "webr-solid-editor-fallback";
      textarea.rows = 10;
      textarea.value = wrapper.pendingHTML;
      host.innerHTML = "";
      host.appendChild(textarea);
      return wrapper;
    }

    window.WebRSolidEditor.mountHost(host, config).then(function (instance) {
      wrapper.instance = instance;
      if (wrapper.pendingHTML) {
        wrapper.setHTML(wrapper.pendingHTML);
      }
    });
    return wrapper;
  }

  function getHTML(editor) {
    return editor && typeof editor.getHTML === "function" ? editor.getHTML() : "";
  }

  function setHTML(editor, html) {
    if (editor && typeof editor.setHTML === "function") {
      editor.setHTML(html);
    }
  }

  function isEmpty(html) {
    if (window.WebRSolidEditor && typeof window.WebRSolidEditor.isEmpty === "function") {
      return window.WebRSolidEditor.isEmpty(html);
    }
    return String(html || "").replace(/<[^>]*>/g, "").trim() === "";
  }

  window.WebRSolidEdit = {
    sanitizeHTML,
    renderContent,
    mountEditor,
    getHTML,
    setHTML,
    isEmpty,
  };
})();
