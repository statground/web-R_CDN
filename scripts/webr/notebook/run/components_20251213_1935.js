/**
 * Markdown 공통 렌더링 컴포넌트
 */
function MarkdownRendered({ html }) {
  const containerRef = React.useRef(null); // React.useRef로 안전하게 호출

  React.useEffect(() => {
	if (window.MathJax && containerRef.current) {
	  window.MathJax.typesetPromise([containerRef.current]).catch((err) => {
		console.error("MathJax typeset error", err);
	  });
	}
  }, [html]);

  return (
	<div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/**
 * RCodeEditor (CodeMirror Wrapper)
 */
function RCodeEditor({ value, onChange, darkMode, cellId, mode = "r", onFocus, readOnly = false }) {
  const { useEffect, useRef } = React; // Hook 구조분해
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
	if (!textareaRef.current || !window.CodeMirror) return;

	const editor = window.CodeMirror.fromTextArea(textareaRef.current, {
	  mode: mode === "markdown" ? "markdown" : "r",
	  lineNumbers: true,
	  theme: darkMode ? "material" : "eclipse",
	  viewportMargin: Infinity,
	  lineWrapping: true,
      readOnly: readOnly ? "nocursor" : false
	});

	editorRef.current = editor;
	editor.setValue(value || "");

	// Base64 축약 표시 로직 (overlay)
	try {
	  if (editor && typeof editor.addOverlay === "function") {
		const base64Regex = /data:image\/[a-zA-Z]+;base64,[0-9a-zA-Z+/=]+/;
		editor.addOverlay({
		  token: function(stream) {
			if (stream.match(base64Regex)) return "base64-shortened";
			while (!stream.eol()) {
			  stream.next();
			  if (stream.match(base64Regex, false)) break;
			}
			return null;
		  }
		});

		function updateBase64HeadSpans() {
		  try {
			const wrapper = editor.getWrapperElement && editor.getWrapperElement();
			if (!wrapper) return;
			const spans = wrapper.querySelectorAll(".cm-base64-shortened");
			spans.forEach((span) => span.removeAttribute("data-webr-base64-head"));
			spans.forEach((span) => {
			  const prev = span.previousSibling;
			  if (!prev || !(prev.nodeType === 1 && prev.classList && prev.classList.contains("cm-base64-shortened"))) {
				span.setAttribute("data-webr-base64-head", "1");
			  }
			});
		  } catch (err) { console.error(err); }
		}

		editor.__WEBR_UPDATE_BASE64_HEADS = updateBase64HeadSpans;
		editor.on("changes", () => {
		  setTimeout(() => { if (editor.__WEBR_UPDATE_BASE64_HEADS) editor.__WEBR_UPDATE_BASE64_HEADS(); }, 0);
		});

		if (!window.__WEBR_BASE64_SHORT_STYLE_ADDED) {
		  const styleEl = document.createElement("style");
		  styleEl.type = "text/css";
		  styleEl.innerHTML = `
			.CodeMirror .cm-base64-shortened { color: transparent !important; font-size: 0 !important; position: relative; }
			.CodeMirror .cm-base64-shortened::before { content: ""; }
			.CodeMirror .cm-base64-shortened[data-webr-base64-head="1"]::before { content: "그림"; color: #9ca3af; font-style: italic; white-space: nowrap; font-size: 11px; }
		  `;
		  document.head.appendChild(styleEl);
		  window.__WEBR_BASE64_SHORT_STYLE_ADDED = true;
		}
	  }
	} catch (overlayErr) { console.error(overlayErr); }

	// Paste Handling
	editor.on("paste", (cm, event) => {
		try {
		const currentMode = cm.getOption("mode");
		if (currentMode !== "markdown") return;
		const clipboardData = event.clipboardData || window.clipboardData;
		if (!clipboardData || !clipboardData.items) return;
		let handled = false;
		for (let i = 0; i < clipboardData.items.length; i++) {
		  const item = clipboardData.items[i];
		  if (item && item.type && item.type.indexOf("image") === 0) {
			const file = item.getAsFile && item.getAsFile();
			if (!file) continue;
			const reader = new FileReader();
			reader.onload = (e) => {
			  try {
				const dataUrl = e.target.result; 
				const doc = cm.getDoc();
				const cursor = doc.getCursor();
				const mdImage = `\n![pasted-image](${dataUrl})\n`;
				doc.replaceRange(mdImage, cursor);
				if (editor.__WEBR_UPDATE_BASE64_HEADS) {
				  setTimeout(() => editor.__WEBR_UPDATE_BASE64_HEADS(), 0);
				}
			  } catch (err) { console.error(err); }
			};
			reader.readAsDataURL(file);
			handled = true;
			break;
		  }
		}
		if (handled) event.preventDefault();
	  } catch (err) { console.error(err); }
	});

	editor.on("change", (cm) => { if (!readOnly && onChange) onChange(cm.getValue()); });
	editor.on("focus", () => { if (onFocus) onFocus(); });

	return () => {
	  try {
		if (editorRef.current) {
		  const wrapper = editorRef.current.getWrapperElement();
		  if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
		}
	  } catch (e) { console.error(e); } finally { editorRef.current = null; }
	};
  }, []);

  useEffect(() => { if (editorRef.current) editorRef.current.setOption("theme", darkMode ? "material" : "eclipse"); }, [darkMode]);
  useEffect(() => { if (editorRef.current) editorRef.current.setOption("mode", mode === "markdown" ? "markdown" : "r"); }, [mode]);
  useEffect(() => { if (editorRef.current && value !== editorRef.current.getValue()) editorRef.current.setValue(value || ""); }, [value]);

  return <textarea ref={textareaRef} data-cell-id={cellId} defaultValue={value} style={{ display: "none" }} />;
}

/**
 * CellOutput
 */
function CellOutput({ output, darkMode }) {
  if (!output) return null;
  if (output.type === "text") {
	return (
	  <div className={"mt-2 rounded-xl border " + (darkMode ? "border-slate-700 bg-slate-900/70" : "border-slate-200 bg-white")}>
		<div className="px-3 py-2 border-b border-slate-700/30 text-xs text-slate-400 flex items-center justify-between"><span>Output</span></div>
		<div className={"px-3 py-3 output-area " + (darkMode ? "text-slate-100" : "text-slate-800")}>{output.text}</div>
	  </div>
	);
  }
  if (output.type === "image") {
	const sizeClass = output.inlineSize === "large" ? "max-h-[500px]" : "max-h-[280px]";
	const borderClass = darkMode ? "border-slate-700 bg-slate-900/70" : "border-slate-200 bg-white";
	return (
	  <div className={"mt-2 rounded-xl border " + borderClass + " flex flex-col items-center justify-center"}>
		<div className="px-3 py-2 border-b border-slate-700/30 text-xs text-slate-400 w-full flex items-center justify-between">
		  <span>Plot</span>
		  <button type="button" className="text-[11px] px-2 py-0.5 rounded-full border border-slate-500 hover:bg-slate-700/60" onClick={output.toggleSize}>
			{output.inlineSize === "large" ? "Shrink" : "Enlarge"}
		  </button>
		</div>
		<div className="px-3 py-3">
		  <img src={output.src} alt="R plot" className={"rounded-lg cursor-zoom-in " + sizeClass} onClick={output.toggleSize} />
		</div>
	  </div>
	);
  }
  return null;
}