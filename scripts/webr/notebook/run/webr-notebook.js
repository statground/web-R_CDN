const { useState, useEffect, useRef } = React;

    function waitForWebR(timeoutMs = 60000) {
      return new Promise((resolve, reject) => {
        const start = performance.now();
        function check() {
          if (window.WebR) return resolve(window.WebR);
          if (performance.now() - start > timeoutMs) {
            return reject(new Error("Timed out waiting for WebR."));
          }
          requestAnimationFrame(check);
        }
        check();
      });
    }

    // [FIXED] Key 중복 방지를 위해 초기값 2 설정
    let _cellIdCounter = 2;
    function nextCellId() { return ++_cellIdCounter; }

    const POPULAR_PACKAGES = ["ggplot2", "dplyr", "tidyr", "jsonlite", "stringr", "lubridate"];

    function RCodeEditor({
      value,
      onChange,
      darkMode,
      cellId,
      onRun,
      onRunInsertBelow,
      onHelp,
      onFocus,
      mode = "r",
      hidden = false
    }) {
      const textareaRef = useRef(null);
      const editorRef = useRef(null);

      useEffect(() => {
        if (!textareaRef.current || !window.CodeMirror) return;

        const editor = window.CodeMirror.fromTextArea(textareaRef.current, {
          mode: mode === "markdown" ? "markdown" : "r",
          lineNumbers: true,
          theme: darkMode ? "material" : "eclipse",
          viewportMargin: Infinity,
          lineWrapping: true
        });

        editorRef.current = editor;
        editor.setValue(value || "");

        editor.on("change", function (cm) {
          const v = cm.getValue();
          if (v !== value && onChange) {
            onChange(v);
          }
        });

        editor.on("focus", function () {
          if (onFocus) onFocus();
        });

        editor.addKeyMap({
          "Shift-Enter": function () {
            if (onRun) onRun();
          },
          "Ctrl-Enter": function () {
            if (onRun) onRun();
          },
          "Cmd-Enter": function () {
            if (onRun) onRun();
          },
          "Alt-Enter": function () {
            if (onRunInsertBelow) {
              onRunInsertBelow();
            } else if (onRun) {
              onRun();
            }
          },
          "Ctrl-H": function () {
            if (onHelp) onHelp();
          },
          "Cmd-H": function () {
            if (onHelp) onHelp();
          },
          "Alt-H": function () {
            if (onHelp) onHelp();
          }
        });

        return () => {
          try {
            if (editorRef.current) {
              const wrapper = editorRef.current.getWrapperElement && editorRef.current.getWrapperElement();
              if (wrapper && wrapper.parentNode) {
                wrapper.parentNode.removeChild(wrapper);
              }
            }
          } catch (e) {
            console.error("CodeMirror cleanup error", e);
          } finally {
            editorRef.current = null;
          }
        };
      }, []);

      useEffect(() => {
        if (editorRef.current) {
          editorRef.current.setOption("theme", darkMode ? "material" : "eclipse");
        }
      }, [darkMode]);

      useEffect(() => {
        if (editorRef.current) {
          editorRef.current.setOption("mode", mode === "markdown" ? "markdown" : "r");
        }
      }, [mode]);

      useEffect(() => {
        if (editorRef.current && value !== editorRef.current.getValue()) {
          editorRef.current.setValue(value || "");
        }
      }, [value]);

      return (
        <textarea
          ref={textareaRef}
          data-cell-id={cellId}
          defaultValue={value}
          style={{ display: "none" }}
          spellCheck="false"
        />
      );
    }

    function Notebook() {
      const [darkMode, setDarkMode] = useState(false);
      const [status, setStatus] = useState("Initializing...");
      const [ready, setReady] = useState(false);
      const [showOverlay, setShowOverlay] = useState(true);
      const [overlayText, setOverlayText] = useState("Booting WebR...");

      const [title, setTitle] = useState("");

      const [showHelp, setShowHelp] = useState(false);
      const [showNewConfirm, setShowNewConfirm] = useState(false);
      const [showShare, setShowShare] = useState(false);

      const initialMarkdown = [
        "# Welcome to Web-R Notebook",
        "",
        "Try running the R example code in the next cell with **Shift+Enter** or **Ctrl+Enter**.",
        "",
        "```r",
        "library(ggplot2)",
        "",
        "ggplot(mpg, aes(displ, hwy, colour = class)) +",
        "  geom_point() +",
        "  geom_smooth(se = FALSE) +",
        "  theme_minimal()",
        "```"
      ].join("\n");

      const initialRCode = [
        "library(ggplot2)",
        "",
        "ggplot(mpg, aes(displ, hwy, colour = class)) +",
        "  geom_point() +",
        "  geom_smooth(se = FALSE) +",
        "  theme_minimal()"
      ].join("\n");

      const [cells, setCells] = useState([
        {
          id: 1,
          code: initialMarkdown,
          output: null,
          running: false,
          mode: "markdown",
          view: "render",
          markdownHtml: (window.marked && typeof window.marked.parse === "function")
            ? window.marked.parse(initialMarkdown)
            : initialMarkdown
        },
        {
          id: 2,
          code: initialRCode,
          output: null,
          running: false,
          mode: "r",
          view: "edit",
          markdownHtml: ""
        }
      ]);

      const [sidebarOpen, setSidebarOpen] = useState(true);
      const [pkgSectionOpen, setPkgSectionOpen] = useState(true);
      const [dataSectionOpen, setDataSectionOpen] = useState(true);

      const [pkgInput, setPkgInput] = useState("");
      const [installedPkgs, setInstalledPkgs] = useState([
        "base", "datasets", "graphics", "grDevices", "methods", "stats", "utils"
      ]);
      const [isInstalling, setIsInstalling] = useState(false);
      const [installStatus, setInstallStatus] = useState("");

      const [uploadedFiles, setUploadedFiles] = useState([]);

      const webRRef = useRef(null);
      const loadInputRef = useRef(null);

      const [activeCellId, setActiveCellId] = useState(null);

      useEffect(() => {
        (async () => {
          try {
            setShowOverlay(true);
            setOverlayText("Downloading WebR runtime...");

            const WebRClass = await waitForWebR();
            const webR = new WebRClass({ baseUrl: "https://webr.r-wasm.org/latest/" });
            webRRef.current = webR;

            setStatus("Starting WebR...");
            await webR.init();

            setOverlayText("Configuring R environment...");
            await webR.evalRVoid('options(repos = c(CRAN = "https://repo.r-wasm.org"))');
            await webR.evalRVoid("webr::shim_install()");
            await webR.evalRVoid("options(device = webr::canvas)");

            setReady(true);
            setStatus("Ready");
            setShowOverlay(false);
          } catch (e) {
            console.error(e);
            setOverlayText("❌ Initialization Failed:\\n" + e.message);
          }
        })();
      }, []);


      useEffect(() => {
        const webR = webRRef.current;
        if (!ready || !webR) return;
        try {
          uploadedFiles.forEach((f) => {
            if (!f || !f.contentB64 || !f.path) return;
            try {
              const exists = webR.FS.analyzePath(f.path).exists;
              if (exists) return;
            } catch {
            }
            try {
              const binary = atob(f.contentB64);
              const arr = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) {
                arr[i] = binary.charCodeAt(i);
              }
              webR.FS.writeFile(f.path, arr);
            } catch (err) {
              console.error("Failed to restore file", f.path, err);
            }
          });
        } catch (e) {
          console.error("Failed to resync uploaded files", e);
        }
      }, [uploadedFiles, ready]);

      const updateCell = (id, patch) => {
        setCells(prev => prev.map(c => (c.id === id ? Object.assign({}, c, patch) : c)));
      };

      const addCellBelow = (id) => {
        setCells(prev => {
          const idx = prev.findIndex(c => c.id === id);
          const newCell = {
            id: nextCellId(),
            code: "",
            output: null,
            running: false,
            mode: "r",
            view: "edit",
            markdownHtml: ""
          };
          const copy = prev.slice();
          copy.splice(idx + 1, 0, newCell);
          return copy;
        });
      };

      const deleteCell = (id) => {
        setCells(prev => (prev.length === 1 ? prev : prev.filter(c => c.id !== id)));
      };

      const moveCell = (id, dir) => {
        setCells(prev => {
          const idx = prev.findIndex(c => c.id === id);
          if (idx === -1) return prev;
          const newIdx = idx + dir;
          if (newIdx < 0 || newIdx >= prev.length) return prev;
          const copy = prev.slice();
          const cell = copy.splice(idx, 1)[0];
          copy.splice(newIdx, 0, cell);
          return copy;
        });
      };

      const handleCodeChange = (id, newCode) => {
        updateCell(id, { code: newCode });
      };

      const toggleCellMode = (id, mode) => {
        setCells(prev => prev.map(c => {
          if (c.id !== id) return c;
          return {
            ...c,
            mode,
            view: "edit"
          };
        }));
      };

      const toggleMarkdownView = (id) => {
        setCells(prev => prev.map(c => {
          if (c.id !== id) return c;
          return {
            ...c,
            view: c.view === "render" ? "edit" : "render"
          };
        }));
      };

      const toggleImageSize = (id) => {
        setCells(prev =>
          prev.map(c => {
            if (c.id !== id || !c.output) return c;
            return {
              ...c,
              output: {
                ...c.output,
                expanded: !c.output.expanded
              }
            };
          })
        );
      };

      const runCell = async (id) => {
        const cell = cells.find(c => c.id === id);
        if (!cell || !cell.code || !cell.code.trim()) return;

        if (cell.mode === "markdown") {
          setStatus("Rendering Markdown...");
          const src = cell.code || "";
          let html = src;
          try {
            if (window.marked && typeof window.marked.parse === "function") {
              html = window.marked.parse(src);
            }
          } catch (err) {
            html = "<pre>" + (err.message || "Markdown render error") + "</pre>";
          }

          updateCell(id, {
            markdownHtml: html,
            view: "render",
            output: null,
            running: false
          });
          setStatus("Ready");
          return;
        }

        const webR = webRRef.current;
        if (!webR || !ready) return;

        updateCell(id, { running: true, view: "edit" });
        setStatus("Running...");

        // [FIXED] 캔버스 잔상 제거 로직
        const canvas = document.getElementById('webr-canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        try {
          const shelter = webR.globalShelter;
          const result = await shelter.captureR(cell.code, {
            withAutoprint: true,
            captureStreams: true,
            captureGraphics: true
          });

          // [FIXED] 줄바꿈 및 ANSI 색상 코드 제거
          // 1. join("\\n") -> join("\n") : 실제 줄바꿈 문자로 연결
          let textOut = result.output
            .filter(o => o.type === "stdout" || o.type === "stderr")
            .map(o => o.data)
            .join("\n"); 
          
          // 2. ANSI Escape Codes 제거 정규식 (R의 tibble 출력 등에서 발생하는 특수문자 제거)
          // 예: \033[3m, \033[90m 등을 빈 문자열로 대체
          const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
          textOut = textOut.replace(ansiRegex, "");

          let imgUrl = null;
          if (result.images && result.images.length > 0) {
            const img = result.images[result.images.length - 1];
            const canvasEl = document.createElement("canvas");
            canvasEl.width = img.width;
            canvasEl.height = img.height;
            const ctx = canvasEl.getContext("2d");
            ctx.drawImage(img, 0, 0);
            imgUrl = canvasEl.toDataURL("image/png");
          }

          updateCell(id, {
            output: {
              text: textOut || (imgUrl ? "" : "✔ Done (No output)"),
              imgUrl: imgUrl,
              expanded: false
            }
          });
        } catch (e) {
          updateCell(id, {
            output: { text: "❌ Error: " + e.message, imgUrl: null, expanded: false }
          });
        } finally {
          updateCell(id, { running: false });
          setStatus("Ready");
        }
      };

      const runCellAndInsertBelow = async (id) => {
        await runCell(id);
        addCellBelow(id);
      };

      const runAll = async () => {
        for (const cell of cells) {
          await runCell(cell.id);
        }
      };

      const installPackage = async (pkgName) => {
        if (!pkgName) return;
        if (!ready) {
          alert("WebR is not ready yet.");
          return;
        }

        setIsInstalling(true);
        setInstallStatus("Installing " + pkgName + "...");

        try {
          const webR = webRRef.current;
          await webR.evalRVoid('install.packages(\"' + pkgName + '\")');

          setInstalledPkgs(prev => (prev.indexOf(pkgName) !== -1 ? prev : prev.concat(pkgName)));
          setInstallStatus("✔ " + pkgName + " installed!");
          setPkgInput("");

          setTimeout(() => setInstallStatus(""), 3000);
        } catch (e) {
          console.error(e);
          setInstallStatus("❌ Failed: " + e.message);
        } finally {
          setIsInstalling(false);
        }
      };

      const handleFileUpload = async (event) => {
        const fileList = Array.from(event.target.files || []);
        if (!fileList.length) return;

        const webR = webRRef.current;
        if (!webR || !ready) {
          alert("WebR is not ready yet.");
          return;
        }

        for (const file of fileList) {
          try {
            const buf = await file.arrayBuffer();
            const uint8 = new Uint8Array(buf);
            webR.FS.writeFile(file.name, uint8);

            // encode content for session persistence
            let binary = "";
            for (let i = 0; i < uint8.length; i++) {
              binary += String.fromCharCode(uint8[i]);
            }
            const b64 = btoa(binary);

            setUploadedFiles(prev =>
              prev.concat({
                name: file.name,
                size: file.size,
                type: file.type || "n/a",
                path: file.name,
                ts: Date.now(),
                contentB64: b64
              })
            );
          } catch (e) {
            console.error("Upload failed for", file.name, e);
          }
        }

        event.target.value = "";
      };

      const createReadCodeCell = (file) => {
        const codeSnippet = `# Load data from uploaded file
df <- read.csv("${file.path}", stringsAsFactors = FALSE)
str(df)`;
        setCells(prev =>
          prev.concat({
            id: nextCellId(),
            code: codeSnippet,
            output: null,
            running: false,
            mode: "r",
            view: "edit",
            markdownHtml: ""
          })
        );
      };

      const newNotebookCore = () => {
        setTitle("");
        // [FIXED] 리셋 시에도 2로 설정
        _cellIdCounter = 2;

        const mdHtml = (window.marked && typeof window.marked.parse === "function")
          ? window.marked.parse(initialMarkdown)
          : initialMarkdown;

        setCells([
          {
            id: 1,
            code: initialMarkdown,
            output: null,
            running: false,
            mode: "markdown",
            view: "render",
            markdownHtml: mdHtml
          },
          {
            id: 2,
            code: initialRCode,
            output: null,
            running: false,
            mode: "r",
            view: "edit",
            markdownHtml: ""
          }
        ]);
        setUploadedFiles([]);
        setInstalledPkgs([
          "base", "datasets", "graphics", "grDevices", "methods", "stats", "utils"
        ]);
      };

      const openNewConfirm = () => {
        setShowNewConfirm(true);
      };

      const confirmNew = () => {
        setShowNewConfirm(false);
        newNotebookCore();
      };

            const saveNotebookAsHTML = () => {
        const data = {
          version: 7,
          title,
          darkMode,
          cells,
          installedPkgs,
          uploadedFiles
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = (title || "webr_notebook") + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      const triggerLoadNotebook = () => {
        if (loadInputRef.current) {
          loadInputRef.current.click();
        }
      };

      const handleLoadNotebook = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const text = e.target.result;
            let data;
            try {
              data = JSON.parse(text);
            } catch {
              const parser = new DOMParser();
              const doc = parser.parseFromString(text, "text/html");
              const pre = doc.getElementById("nb-data");
              if (!pre) throw new Error("Invalid notebook file");
              data = JSON.parse(decodeURIComponent(pre.textContent || ""));
            }

            if (typeof data.title === "string") {
              setTitle(data.title);
            }

            if (Array.isArray(data.cells)) {
              setCells(
                data.cells.map((c, idx) => ({
                  id: c.id || idx + 1,
                  code: c.code || "",
                  output: c.output || null,
                  running: false,
                  mode: c.mode || "r",
                  view: c.view || "edit",
                  markdownHtml: c.markdownHtml || ""
                }))
              );
              const maxId = data.cells.reduce(function (m, c) {
                const cid = c.id || 0;
                return cid > m ? cid : m;
              }, 0);
              if (maxId > 0) {
                _cellIdCounter = maxId;
              }
            }

            if (Array.isArray(data.installedPkgs)) {
              setInstalledPkgs(data.installedPkgs);
            }
            if (Array.isArray(data.uploadedFiles)) {
              setUploadedFiles(data.uploadedFiles);
            }
            if (typeof data.darkMode === "boolean") {
              setDarkMode(data.darkMode);
            }
          } catch (err) {
            console.error("Failed to load notebook:", err);
            alert("Invalid notebook file.");
          }
        };
        reader.readAsText(file);
        event.target.value = "";
      };

      useEffect(() => {
        function handleKey(e) {
          const ctrlOrCmd = e.ctrlKey || e.metaKey;

          if ((ctrlOrCmd && (e.key === "s" || e.key === "S")) || (e.altKey && (e.key === "s" || e.key === "S"))) {
            e.preventDefault();
            saveNotebookAsHTML();
            return;
          }
          if ((ctrlOrCmd && (e.key === "o" || e.key === "O")) || (e.altKey && (e.key === "o" || e.key === "O"))) {
            e.preventDefault();
            triggerLoadNotebook();
            return;
          }
          if ((ctrlOrCmd && e.shiftKey && (e.key === "n" || e.key === "N")) || (e.altKey && (e.key === "n" || e.key === "N"))) {
            e.preventDefault();
            openNewConfirm();
            return;
          }
          if ((ctrlOrCmd && (e.key === "l" || e.key === "L")) || (e.altKey && (e.key === "l" || e.key === "L"))) {
            e.preventDefault();
            setDarkMode(v => !v);
            return;
          }
          if ((ctrlOrCmd && e.shiftKey && (e.key === "r" || e.key === "R")) || (e.altKey && (e.key === "r" || e.key === "R"))) {
            e.preventDefault();
            runAll();
            return;
          }
          if ((ctrlOrCmd && (e.key === "h" || e.key === "H")) || (e.altKey && (e.key === "h" || e.key === "H"))) {
            e.preventDefault();
            setShowHelp(true);
            return;
          }
          if (e.key === "Enter" && (e.shiftKey || ctrlOrCmd) && !e.altKey) {
            if (activeCellId != null) {
              e.preventDefault();
              runCell(activeCellId);
            }
          }
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
      });

      const rootClass =
        "flex flex-col h-full transition-colors duration-300 " +
        (darkMode ? "bg-stone-900 text-stone-100" : "bg-slate-100 text-slate-900");

      const headerClass =
        "h-14 flex items-center justify-between px-4 border-b shadow-sm backdrop-blur " +
        (darkMode ? "border-stone-800 bg-stone-950/95" : "border-slate-200 bg-white/95");

      const cellClass =
        "group relative rounded-2xl border shadow-sm transition-colors " +
        (darkMode
          ? "bg-stone-900/80 border-stone-800 hover:border-orange-500/80"
          : "bg-white border-slate-200 hover:border-orange-300/80 hover:shadow-md");

      const cellHeaderClass =
        "flex items-center justify-between px-3 py-2 border-b rounded-t-2xl " +
        (darkMode
          ? "border-stone-800/80 bg-stone-950/90"
          : "border-slate-200 bg-slate-50");

      const outputClass =
        "border-t rounded-b-2xl px-4 py-3 md:px-5 md:py-4 " +
        (darkMode ? "border-stone-800 bg-stone-950/80" : "border-slate-200 bg-slate-50");

      const sidebarClass =
        "w-80 border-l flex flex-col shrink-0 " +
        (darkMode ? "border-stone-800 bg-stone-950/95" : "border-slate-200 bg-slate-50");

      const toolboxHeaderClass =
        "p-4 border-b flex items-center justify-between " +
        (darkMode ? "border-stone-800" : "border-slate-200 bg-white/70");

      const cardClass =
        "rounded-xl border " +
        (darkMode ? "border-stone-800 bg-stone-900/80" : "border-slate-200 bg-white");

      const inputBaseClass =
        "rounded-lg px-2 py-1.5 text-sm outline-none border " +
        (darkMode
          ? "placeholder:text-stone-500 border-stone-700 bg-stone-900 text-stone-100 focus:border-orange-400"
          : "placeholder:text-slate-400 border-slate-300 bg-white text-slate-900 focus:border-orange-400");

      return (
        <div className={rootClass}>
          <input
            type="file"
            accept=".json,.html"
            ref={loadInputRef}
            onChange={handleLoadNotebook}
            style={{ display: "none" }}
          />

          {showOverlay && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-stone-50">
              <div className="w-12 h-12 border-4 border-stone-700 border-t-orange-400 rounded-full animate-spin mb-4"></div>
              <div className="text-stone-200 font-mono text-sm whitespace-pre-line text-center px-4">
                {overlayText}
              </div>
            </div>
          )}

          {showHelp && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
              <div className={"w-full max-w-xl mx-4 rounded-2xl shadow-xl border " + (darkMode ? "bg-stone-950 border-stone-800 text-stone-100" : "bg-white border-slate-200 text-slate-900")}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800/60">
                  <h2 className="text-sm font-semibold">Help · Web-R Notebook</h2>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="text-xs px-2 py-1 rounded-full hover:bg-stone-800/40"
                  >
                    ✕
                  </button>
                </div>
                <div className="px-4 py-3 text-xs space-y-3 max-h-[70vh] overflow-y-auto">
                  <section>
                    <h3 className="font-semibold mb-1">Keyboard Shortcuts</h3>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li><b>Shift + Enter</b> · Run current cell</li>
                      <li><b>Ctrl/Cmd + Enter</b> · Run current cell</li>
                      <li><b>Alt + Enter</b> · Run current cell + insert new cell below</li>
                      <li><b>Ctrl/Cmd or Alt + S</b> · Save notebook (JSON)</li>
                      <li><b>Ctrl/Cmd or Alt + O</b> · Load notebook</li>
                      <li><b>Ctrl/Cmd+Shift or Alt + N</b> · New notebook</li>
                      <li><b>Ctrl/Cmd or Alt + L</b> · Toggle Light/Dark theme</li>
                      <li><b>Ctrl/Cmd+Shift or Alt + R</b> · Run all cells</li>
                      <li><b>Ctrl/Cmd or Alt + H</b> · Open this help</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold mb-1">Package Manager</h3>
                    <p>
                      오른쪽 Toolbox의 <b>Package Manager</b> 에서 패키지 이름을 입력하고 <b>Add</b> 를 누르면
                      <code className="mx-1 px-1 py-0.5 rounded bg-black/10 text-[0.7rem]">install.packages()</code>
                      를 통해 WebR 환경에 설치합니다.
                    </p>
                  </section>
                  <section>
                    <h3 className="font-semibold mb-1">Data Manager</h3>
                    <p>
                      <b>Data Manager</b> 에서는 CSV / RDS 등 파일을 업로드하면 WebR 가상 파일 시스템에 저장됩니다.
                      업로드된 파일 옆의 <b>+ Code Cell</b> 버튼을 누르면 해당 파일을 읽어오는 R 코드 셀을 자동으로 만들어 줍니다.
                    </p>
                  </section>
                </div>
                <div className="px-4 py-3 border-t border-stone-800/60 text-right">
                  <button
                    onClick={() => setShowHelp(false)}
                    className={
                      "text-xs px-3 py-1.5 rounded-full border font-medium " +
                      (darkMode
                        ? "border-stone-700 bg-stone-900 text-stone-100 hover:bg-stone-800"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100")
                    }
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showNewConfirm && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
              <div className={"w-full max-w-sm mx-4 rounded-2xl shadow-xl border " + (darkMode ? "bg-stone-950 border-stone-800 text-stone-100" : "bg-white border-slate-200 text-slate-900")}>
                <div className="px-4 py-3 border-b border-stone-800/60">
                  <h2 className="text-sm font-semibold">Start a new notebook?</h2>
                </div>
                <div className="px-4 py-3 text-xs space-y-2">
                  <p>현재 노트북의 셀, 출력 결과, 업로드 정보가 모두 초기화됩니다.</p>
                </div>
                <div className="px-4 py-3 border-t border-stone-800/60 flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => setShowNewConfirm(false)}
                    className={
                      "px-3 py-1.5 rounded-full border font-medium " +
                      (darkMode
                        ? "border-stone-700 bg-stone-900 text-stone-100 hover:bg-stone-800"
                        : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200")
                    }
                  >
                    No
                  </button>
                  <button
                    onClick={confirmNew}
                    className="px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-400 text-stone-950 font-semibold"
                  >
                    Yes, start new
                  </button>
                </div>
              </div>
            </div>
          )}

          {showShare && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
              <div className={"w-full max-w-md mx-4 rounded-2xl shadow-xl border " + (darkMode ? "bg-stone-950 border-stone-800 text-stone-100" : "bg-white border-slate-200 text-slate-900")}>
                <div className="px-4 py-3 border-b border-stone-800/60 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Share notebook</h2>
                  <button
                    onClick={() => setShowShare(false)}
                    className="text-xs px-2 py-1 rounded-full hover:bg-stone-800/40"
                  >
                    ✕
                  </button>
                </div>
                <div className="px-4 py-3 text-xs space-y-3">
                  <p>
                    Colab처럼 다른 사용자가 <b>뷰어(viewer)</b>로 노트북을 볼 수 있도록 공유하는 UI입니다.
                    실제 권한 제어와 링크 발급은 서버 API와 연동하면 됩니다.
                  </p>
                  <div className="space-y-1">
                    <span className="font-semibold">Link access</span>
                    <p className={darkMode ? "text-stone-400" : "text-slate-500"}>
                      예시: <code>https://web-r.org/notebooks/12345?mode=view</code>
                    </p>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Shareable link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://web-r.org/notebooks/demo-id?mode=view"
                        className={inputBaseClass + " flex-1 text-[11px]"}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText("https://web-r.org/notebooks/demo-id?mode=view").catch(() => {});
                        }}
                        className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-stone-950 text-[11px] font-semibold"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-stone-800/60 text-right">
                  <button
                    onClick={() => setShowShare(false)}
                    className={
                      "text-xs px-3 py-1.5 rounded-full border font-medium " +
                      (darkMode
                        ? "border-stone-700 bg-stone-900 text-stone-100 hover:bg-stone-800"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100")
                    }
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <header className={headerClass}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-stone-950 text-xs font-extrabold shadow">
                  R
                </div>
                <span className={"text-xs uppercase tracking-[0.2em] " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                  Web-R Notebook
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={
                  "ml-3 flex-1 min-w-0 bg-transparent border rounded px-2 py-1 text-sm outline-none " +
                  (darkMode
                    ? "border-stone-700 hover:border-stone-500 focus:border-orange-400 text-stone-100 placeholder:text-stone-500"
                    : "border-slate-300 hover:border-slate-400 focus:border-orange-400 text-slate-900 placeholder:text-slate-400")
                }
                placeholder="Untitled Web-R Notebook"
              />
              <span
                className={
                  "hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full border " +
                  (ready
                    ? "border-emerald-500/50 text-emerald-600 bg-emerald-500/5"
                    : "border-amber-500/50 text-amber-600 bg-amber-500/5")
                }
              >
                {status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div
                className={
                  "hidden md:flex items-center gap-2 px-2 py-1 rounded-full border " +
                  (darkMode
                    ? "border-stone-700 bg-stone-900 text-stone-100"
                    : "border-slate-300 bg-white text-slate-800")
                }
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-[10px] font-bold text-stone-950">
                  JS
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-semibold">Signed in</span>
                  <span className="text-[10px] opacity-70">you@example.com</span>
                </div>
              </div>

              <button
                onClick={openNewConfirm}
                className={
                  "px-2 py-1 rounded-full border text-xs font-medium " +
                  (darkMode
                    ? "border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-50")
                }
                title="New Notebook"
              >
                🆕 New
              </button>

              <button
                onClick={saveNotebookAsHTML}
                className={
                  "px-2 py-1 rounded-full border text-xs font-medium " +
                  (darkMode
                    ? "border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-50")
                }
                title="Save notebook as JSON"
              >
                💾 Save
              </button>

              <button
                onClick={triggerLoadNotebook}
                className={
                  "px-2 py-1 rounded-full border text-xs font-medium " +
                  (darkMode
                    ? "border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-50")
                }
                title="Load notebook"
              >
                📂 Load
              </button>

              <button
                onClick={() => setShowHelp(true)}
                className={
                  "px-2 py-1 rounded-full border text-xs font-medium " +
                  (darkMode
                    ? "border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-50")
                }
                title="Help"
              >
                ❔ Help
              </button>

              <button
                onClick={() => setShowShare(true)}
                className={
                  "px-2 py-1 rounded-full border text-xs font-medium " +
                  (darkMode
                    ? "border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-50")
                }
                title="Share"
              >
                🔗 Share
              </button>

              <button
                onClick={() => setDarkMode(v => !v)}
                className={
                  "flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium " +
                  (darkMode
                    ? "border-stone-700 bg-stone-900 text-amber-200 hover:bg-stone-800"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-50")
                }
                title="Toggle light/dark mode"
              >
                <span>{darkMode ? "🌙 Dark" : "☀ Light"}</span>
              </button>

              <button
                onClick={runAll}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-400 text-stone-950 font-semibold shadow-lg shadow-orange-500/30"
                title="Run all cells"
              >
                <span>▶ Run All</span>
              </button>

              <button
                onClick={() => setSidebarOpen(o => !o)}
                className={
                  "p-2 rounded-full text-sm " +
                  (darkMode ? "hover:bg-stone-800 text-stone-300" : "hover:bg-slate-100 text-slate-500")
                }
                title="Toggle sidebar"
              >
                {sidebarOpen ? "⟩" : "⟨"}
              </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
              <div className="w-full mx-auto space-y-6 pb-20">
                {cells.map((cell, idx) => (
                  <div
                    key={cell.id}
                    className={cellClass}
                  >
                    <div className={cellHeaderClass}>
                      <div className={"flex items-center gap-3 text-xs font-mono " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                        <span className="inline-flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/30 shadow-sm">
                            In [{idx + 1}]
                          </span>
                        </span>
                        <div
                          className={
                            "inline-flex items-center text-[10px] rounded-full border px-0.5 py-0.5 " +
                            (darkMode ? "border-stone-700 bg-stone-900" : "border-slate-300 bg-white")
                          }
                        >
                          <button
                            onClick={() => toggleCellMode(cell.id, "r")}
                            className={
                              "px-2 py-0.5 rounded-full " +
                              (cell.mode === "r"
                                ? "bg-orange-500 text-stone-950 font-semibold"
                                : (darkMode ? "text-stone-400" : "text-slate-500"))
                            }
                          >
                            R
                          </button>
                          <button
                            onClick={() => toggleCellMode(cell.id, "markdown")}
                            className={
                              "px-2 py-0.5 rounded-full " +
                              (cell.mode === "markdown"
                                ? "bg-orange-500 text-stone-950 font-semibold"
                                : (darkMode ? "text-stone-400" : "text-slate-500"))
                            }
                          >
                            Md
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => runCell(cell.id)}
                          className="p-1 text-orange-500 hover:bg-orange-500/10 rounded"
                          title="Run"
                        >
                          ▶
                        </button>
                        <button
                          onClick={() => addCellBelow(cell.id)}
                          className={"p-1 rounded " + (darkMode ? "text-stone-400 hover:bg-stone-700/70" : "text-slate-500 hover:bg-slate-200")}
                          title="Add Below"
                        >
                          +
                        </button>
                        <button
                          onClick={() => moveCell(cell.id, -1)}
                          className={"p-1 rounded " + (darkMode ? "text-stone-400 hover:bg-stone-700/70" : "text-slate-500 hover:bg-slate-200")}
                          title="Up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveCell(cell.id, 1)}
                          className={"p-1 rounded " + (darkMode ? "text-stone-400 hover:bg-stone-700/70" : "text-slate-500 hover:bg-slate-200")}
                          title="Down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => deleteCell(cell.id)}
                          className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Editor / Markdown view */}
                    <div className="relative p-3 md:p-4">
                      {!(cell.mode === "markdown" && cell.view === "render") && (
                        <RCodeEditor
                          cellId={cell.id}
                          value={cell.code}
                          onChange={newCode => handleCodeChange(cell.id, newCode)}
                          darkMode={darkMode}
                          mode={cell.mode || "r"}
                          onRun={() => runCell(cell.id)}
                          onRunInsertBelow={() => runCellAndInsertBelow(cell.id)}
                          onHelp={() => setShowHelp(true)}
                          onFocus={() => setActiveCellId(cell.id)}
                        />
                      )}

                      {cell.mode === "markdown" && cell.view === "render" && (
                        <div
                          className={
                            "prose prose-sm max-w-none cursor-text " +
                            (darkMode ? "prose-invert" : "") +
                            " rounded-xl border px-4 py-3 " +
                            (darkMode ? "border-stone-700 bg-stone-950" : "border-slate-200 bg-white")
                          }
                          onClick={() => toggleMarkdownView(cell.id)}
                          title="클릭하면 다시 편집 모드로 전환됩니다."
                          dangerouslySetInnerHTML={{ __html: cell.markdownHtml || "<p><em>(empty)</em></p>" }}
                        />
                      )}

                      {cell.running && (
                        <div className="absolute top-3 right-3">
                          <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    {/* Output: only R mode */}
                    {cell.mode !== "markdown" && cell.output && (
                      <div className={outputClass}>
                        <div className={"text-xs mb-2 font-mono " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                          Out [{idx + 1}]:
                        </div>

                        {cell.output.text && (
                          <pre className={"font-mono text-sm whitespace-pre overflow-x-auto " + (darkMode ? "text-stone-100" : "text-slate-900")}>
                            {cell.output.text}
                          </pre>
                        )}

                        {cell.output.imgUrl && (
                          <div className="mt-3 rounded-xl p-2 inline-block bg-black/5 max-w-full">
                            <img
                              src={cell.output.imgUrl}
                              className={
                                "rounded-lg cursor-zoom-in mx-auto " +
                                (cell.output.expanded ? "max-h-[480px]" : "max-h-48")
                              }
                              onClick={() => toggleImageSize(cell.id)}
                              title={cell.output.expanded ? "Click to shrink" : "Click to enlarge"}
                            />
                            <div className={"mt-1 text-[10px] text-center " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                              {cell.output.expanded ? "이미지를 클릭하면 다시 작게 볼 수 있습니다." : "이미지를 클릭하면 크게 볼 수 있습니다."}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => {
                      setCells(prev =>
                        prev.concat({
                          id: nextCellId(),
                          code: "",
                          output: null,
                          running: false,
                          mode: "r",
                          view: "edit",
                          markdownHtml: ""
                        })
                      );
                    }}
                    className={
                      "px-4 py-2 rounded-full border text-sm " +
                      (darkMode
                        ? "border-stone-700 text-stone-200 hover:bg-stone-800"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50")
                    }
                  >
                    + New Cell
                  </button>
                </div>
              </div>
            </main>

            {sidebarOpen && (
              <aside className={sidebarClass}>
                <div className={toolboxHeaderClass}>
                  <div>
                    <h2 className={"text-sm font-bold flex items-center gap-2 " + (darkMode ? "text-stone-100" : "text-slate-900")}>
                      <span>Toolbox</span>
                    </h2>
                    <p className={"text-[11px] mt-1 " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                      Packages, data files, and notebook utils.
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                  <div className={cardClass}>
                    <button
                      className={"w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide " + (darkMode ? "text-stone-400" : "text-slate-500")}
                      onClick={() => setPkgSectionOpen(o => !o)}
                    >
                      <span>📦 Package Manager</span>
                      <span>{pkgSectionOpen ? "▾" : "▸"}</span>
                    </button>
                    {pkgSectionOpen && (
                      <div className="px-3 pb-3 space-y-3">
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={pkgInput}
                            onChange={e => setPkgInput(e.target.value)}
                            placeholder="e.g. dplyr"
                            disabled={isInstalling}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                installPackage(pkgInput);
                              }
                            }}
                            className={inputBaseClass}
                          />
                          <button
                            onClick={() => installPackage(pkgInput)}
                            disabled={isInstalling || !pkgInput}
                            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 text-xs font-bold rounded-lg transition"
                          >
                            {isInstalling ? "..." : "Add"}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_PACKAGES.map(pkg => {
                            const installed = installedPkgs.indexOf(pkg) !== -1;
                            return (
                              <button
                                key={pkg}
                                onClick={() => installPackage(pkg)}
                                disabled={installed || isInstalling}
                                className={
                                  "text-[10px] px-2 py-1 rounded-full border transition " +
                                  (installed
                                    ? (darkMode
                                        ? "border-emerald-700 bg-emerald-900/40 text-emerald-300 cursor-default"
                                        : "border-emerald-400 bg-emerald-50 text-emerald-700 cursor-default")
                                    : (darkMode
                                        ? "border-stone-700 bg-stone-900 text-stone-200 hover:border-orange-400 hover:text-orange-200"
                                        : "border-slate-300 bg-white text-slate-600 hover:border-orange-400 hover:text-orange-500"))
                                }
                              >
                                {installed ? "✔ " + pkg : pkg}
                              </button>
                            );
                          })}
                        </div>

                        {installStatus && (
                          <div
                            className={
                              "text-xs p-2 rounded-lg border " +
                              (installStatus.indexOf("Failed") !== -1
                                ? (darkMode
                                    ? "border-rose-900 text-rose-300 bg-rose-950/40"
                                    : "border-rose-300 text-rose-700 bg-rose-50")
                                : (darkMode
                                    ? "border-stone-700 text-orange-200 bg-stone-900/80"
                                    : "border-orange-200 text-orange-700 bg-orange-50"))
                            }
                          >
                            {installStatus}
                          </div>
                        )}

                        <div className="mt-1">
                          <span className={"text-[11px] uppercase font-semibold " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                            Installed ({installedPkgs.length})
                          </span>
                          <div className={"max-h-32 overflow-y-auto rounded-lg border text-[11px] " + (darkMode ? "border-stone-800 bg-stone-950/60" : "border-slate-200 bg-slate-50")}>
                            {installedPkgs.map(pkg => (
                              <div
                                key={pkg}
                                className={"px-2 py-1 border-b last:border-0 flex items-center justify-between " + (darkMode ? "border-stone-800 text-stone-100" : "border-slate-200 text-slate-800")}
                              >
                                <span>{pkg}</span>
                                <span className={"text-[10px] " + (darkMode ? "text-stone-500" : "text-slate-400")}>v?</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={cardClass}>
                    <button
                      className={"w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide " + (darkMode ? "text-stone-400" : "text-slate-500")}
                      onClick={() => setDataSectionOpen(o => !o)}
                    >
                      <span>📂 Data Manager</span>
                      <span>{dataSectionOpen ? "▾" : "▸"}</span>
                    </button>
                    {dataSectionOpen && (
                      <div className="px-3 pb-3 space-y-3">
                        <div className="mt-1">
                          <label className={"block text-[11px] mb-1 " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                            Upload CSV / RDS / etc. (saved to WebR FS)
                          </label>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className={
                              "block w-full text-[11px] " +
                              (darkMode ? "text-stone-300" : "text-slate-700") +
                              " file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-stone-950 hover:file:bg-orange-400 cursor-pointer"
                            }
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className={"text-[11px] uppercase font-semibold " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                              Uploaded Files ({uploadedFiles.length})
                            </span>
                          </div>
                          {uploadedFiles.length === 0 ? (
                            <p className={"text-[11px] " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                              No files yet. Upload a CSV to use in R.
                            </p>
                          ) : (
                            <div className={"max-h-40 overflow-y-auto rounded-lg border text-[11px] " + (darkMode ? "border-stone-800 bg-stone-950/70" : "border-slate-200 bg-slate-50")}>
                              {uploadedFiles.map(file => (
                                <div
                                  key={file.ts + "-" + file.name}
                                  className={"px-2 py-1.5 border-b last:border-0 " + (darkMode ? "border-stone-800" : "border-slate-200")}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={darkMode ? "font-medium text-stone-100" : "font-medium text-slate-900"}>{file.name}</span>
                                    <span className={"text-[10px] " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                                      {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                  </div>
                                  <div className={"text-[10px] mt-0.5 " + (darkMode ? "text-stone-500" : "text-slate-500")}>
                                    path: {file.path}
                                  </div>
                                  <div className="mt-1 flex items-center justify-between gap-2">
                                    <code className={"text-[10px] px-1.5 py-0.5 rounded " + (darkMode ? "bg-stone-900 text-stone-200" : "bg-slate-100 text-slate-800")}>
                                      df &lt;- read.csv("{file.path}", stringsAsFactors = FALSE)
                                    </code>
                                    <button
                                      onClick={() => createReadCodeCell(file)}
                                      className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-stone-950 hover:bg-emerald-500"
                                    >
                                      + Code Cell
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<Notebook />);