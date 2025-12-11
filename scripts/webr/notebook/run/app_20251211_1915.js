/**
 * Notebook 컴포넌트 (메인)
 */
function Notebook() {
  // [수정됨] React Hook을 전역이 아닌 컴포넌트 내부에서 구조 분해 할당
  const { useState, useEffect, useRef } = React;

  // WebR 및 상태 관련
  const [webrInstance, setWebrInstance] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  
  // UI 상태
  const [darkMode, setDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareText, setShareText] = useState("");
  
  const [showLogin, setShowLogin] = useState(false);
  const [loginAccount, setLoginAccount] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayText, setOverlayText] = useState("Booting WebR...");

  // 셀 상태 (초기값은 constants.js의 상수 활용)
  const [cells, setCells] = useState([
    {
      id: 1, mode: "markdown", source: INITIAL_LATEX_LINES.join("\n"),
      output: { type: "markdown", html: renderMarkdown(INITIAL_LATEX_LINES.join("\n")) },
      mdPreview: true, showCode: true, showOutput: true
    },
    {
      id: 2, mode: "r", source: INITIAL_R_LINES.join("\n"),
      output: null, mdPreview: false, showCode: true, showOutput: true
    }
  ]);
  const [activeCellId, setActiveCellId] = useState(2);

  // 패키지 / 데이터 매니저 상태
  const [pkgInput, setPkgInput] = useState("");
  const [installedPackages, setInstalledPackages] = useState([...CORE_PACKAGES]);
  const [dataFiles, setDataFiles] = useState([]);

  /**
   * WebR 초기화 (useEffect)
   */
  useEffect(() => {
    let cancelled = false;
    async function initWebR() {
      try {
        setShowOverlay(true);
        setOverlayText("Downloading WebR runtime...");

        // utils.js의 waitForWebR 사용
        const WebRClass = await waitForWebR(); 
        if (cancelled) return;

        const webr = new WebRClass({
          defaultPackages: ["base", "graphics", "grDevices", "stats"],
          RArgs: ["--quiet"]
        });

        setStatus("Starting WebR...");
        await webr.init();
        if (cancelled) return;

        await webr.evalRVoid('options(repos = c(CRAN = "https://repo.r-wasm.org"))');
        await webr.evalRVoid('options(device = webr::canvas)');
        
        await webr.evalRVoid(`
          options(
            help_type = "text",
            pager = function(files, header, title, delete.file) {
              if (length(files) == 0L) return(invisible())
              out <- character()
              for (f in files) {
                if (file.exists(f)) {
                  txt <- tryCatch({
                      raw_txt <- readLines(f, warn = FALSE, encoding = "UTF-8")
                      iconv(raw_txt, from = "UTF-8", to = "UTF-8", sub = "byte")
                    }, error = function(e) character())
                  out <- c(out, txt, "")
                }
              }
              if (length(out)) { cat(paste(out, collapse = "\n"), sep = "\n") }
              invisible()
            }
          )
        `);

        setWebrInstance(webr);
        setStatus("Ready");
        setReady(true);
        setOverlayText("WebR is ready.");
        setTimeout(() => setShowOverlay(false), 300);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setStatus("Failed to start WebR");
          setOverlayText("Initialization failed:\n" + (e.message || String(e)));
        }
      }
    }
    initWebR();
    return () => { cancelled = true; };
  }, []);

  // --- 기능 함수들 (누락되었던 부분 복구) ---

  function addCellBelow(targetId) {
    setCells(prev => {
      const idx = prev.findIndex(c => c.id === targetId);
      const newId = nextCellId(); // utils.js 함수
      const newCell = {
        id: newId, mode: "r", source: "", output: null,
        mdPreview: false, showCode: true, showOutput: true
      };
      if (idx === -1) return [...prev, newCell];
      const newArr = [...prev];
      newArr.splice(idx + 1, 0, newCell);
      return newArr;
    });
  }

  function deleteCell(id) {
    setCells(prev => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex(c => c.id === id);
      const filtered = prev.filter(c => c.id !== id);
      if (idx !== -1 && activeCellId === id && filtered.length > 0) {
        const newIdx = Math.max(0, idx - 1);
        setActiveCellId(filtered[newIdx].id);
      }
      return filtered;
    });
  }

  function moveCell(id, direction) {
    setCells(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const newArr = [...prev];
      const [cell] = newArr.splice(idx, 1);
      let newIndex = idx + (direction === "up" ? -1 : 1);
      newIndex = Math.max(0, Math.min(newIndex, newArr.length));
      newArr.splice(newIndex, 0, cell);
      return newArr;
    });
  }

  async function runRCell(id, insertBelow = false) {
    const cell = cells.find(c => c.id === id);
    if (!cell || cell.mode !== "r" || !webrInstance) return;

    setBusy(true);
    setStatus(`Running cell ${id}...`);

    try {
      const code = cell.source || "";
      const shelter = await new webrInstance.Shelter();

      const result = await shelter.captureR(code, {
        withAutoprint: true,
        captureStreams: true,
        captureGraphics: { width: 504, height: 504, bg: "white" }
      });

      let textOut = "";
      if (Array.isArray(result.output)) {
        textOut = result.output
          .filter(o => o.type === "stdout" || o.type === "stderr")
          .map(o => o.data)
          .join("\n");
      } else {
        textOut = (result.stdout || "") + (result.stderr || "");
      }

      // ANSI 제거 및 오버스트라이크 제거
      const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
      textOut = textOut.replace(ansiRegex, "").replace(/.\u0008/g, "");

      let newOutput = null;
      const images = result.images || [];
      if (images.length > 0) {
        const img = images[images.length - 1];
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imgUrl = canvas.toDataURL("image/png");

        newOutput = {
          type: "image",
          src: imgUrl,
          inlineSize: "small",
          toggleSize: () => {
             // 클로저 문제 해결을 위해 toggleSize는 렌더링 시점에 재정의하거나
             // 여기서 정의하되 setCells 안에서 다시 연결해주는 방식 등이 필요하지만
             // 간단하게 여기서 처리합니다.
             setCells(prev => prev.map(c => {
                 if(c.id !== id) return c;
                 const currentSize = (c.output && c.output.inlineSize) === "large" ? "small" : "large";
                 return { ...c, output: { ...c.output, inlineSize: currentSize } };
             }));
          }
        };
      } else {
        newOutput = { type: "text", text: textOut || "Done (no output)" };
      }

      setCells(prev => prev.map(c => (c.id === id ? { ...c, output: newOutput } : c)));
      setStatus(`Finished running cell ${id}`);
      if (insertBelow) addCellBelow(id);

      shelter.purge();
    } catch (e) {
      console.error(e);
      setCells(prev => prev.map(c => c.id === id ? { ...c, output: { type: "text", text: String(e.message || e) } } : c));
      setStatus(`Error in cell ${id}`);
    } finally {
      setBusy(false);
    }
  }

  function runMarkdownCell(id) {
    const cell = cells.find(c => c.id === id);
    if (!cell || cell.mode !== "markdown") return;
    const html = renderMarkdown(cell.source || ""); // utils.js
    const newOutput = { type: "markdown", html };
    setCells(prev => prev.map(c => c.id === id ? { ...c, output: newOutput, mdPreview: true } : c));
    setStatus(`Rendered markdown cell ${id}`);
  }

  async function runAllCells() {
    for (const cell of cells) {
      if (cell.mode === "r") {
        await runRCell(cell.id, false);
      } else if (cell.mode === "markdown") {
        runMarkdownCell(cell.id);
      }
    }
  }

  // 단축키 처리
  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key;
      const isAltEnter = key === "Enter" && e.altKey;
      const isRunCombo = key === "Enter" && !e.altKey && (e.shiftKey || e.ctrlKey || e.metaKey);
      const isHelpCombo = (key === "h" || key === "H") && (e.altKey || (e.ctrlKey && e.shiftKey) || (e.metaKey && e.shiftKey));

      if (!isAltEnter && !isRunCombo && !isHelpCombo) return;

      if (isHelpCombo) {
        e.preventDefault(); e.stopPropagation(); setShowHelp(true); return;
      }

      const activeEl = document.activeElement;
      const inCM = activeEl && typeof activeEl.closest === "function" && activeEl.closest(".CodeMirror");
      if (!inCM) return;

      const cell = cells.find(c => c.id === activeCellId);
      if (!cell) return;

      e.preventDefault(); e.stopPropagation();

      if (isAltEnter) {
        addCellBelow(activeCellId);
        return;
      }
      if (isRunCombo) {
        if (cell.mode === "r") {
          const insertBelow = (e.ctrlKey || e.metaKey) && e.shiftKey;
          runRCell(cell.id, insertBelow);
        } else if (cell.mode === "markdown") {
          runMarkdownCell(cell.id);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cells, activeCellId]);

  // Notebook 기능들
  function handleNewNotebook() {
    if (!window.confirm("현재 노트북 내용을 모두 지우고 새로 시작할까요?")) return;
    setCells([
        { id: 1, mode: "markdown", source: INITIAL_LATEX_LINES.join("\n"), output: { type: "markdown", html: renderMarkdown(INITIAL_LATEX_LINES.join("\n")) }, mdPreview: true, showCode: true, showOutput: true },
        { id: 2, mode: "r", source: INITIAL_R_LINES.join("\n"), output: null, mdPreview: false, showCode: true, showOutput: true }
    ]);
    setActiveCellId(2);
  }

  function handleSaveNotebook() {
    const payload = {
      version: "1.2",
      cells: cells.map(c => ({
        id: c.id, mode: c.mode, source: c.source, showCode: c.showCode !== false, showOutput: c.showOutput !== false,
        output: (c.output && c.output.type === "image") ? { type: "image", src: c.output.src, inlineSize: c.output.inlineSize } : (c.output && c.output.type === "text" ? { type: "text", text: c.output.text } : null)
      })),
      darkMode,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "webr-notebook.json";
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function handleLoadNotebookFromFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.cells || !Array.isArray(parsed.cells)) throw new Error("Invalid notebook file.");
        
        const loadedCells = parsed.cells.map(cell => {
           let restoredOutput = null;
           if (cell.output) {
             if (cell.output.type === "text") restoredOutput = { type: "text", text: cell.output.text };
             else if (cell.output.type === "image") {
                 restoredOutput = { 
                     type: "image", src: cell.output.src, inlineSize: cell.output.inlineSize || "small",
                     toggleSize: () => { /* Load 후에는 개별 할당 필요, 렌더링 시 처리 */ } 
                 };
             }
           }
           // Markdown 복원
           let finalOutput = restoredOutput;
           let finalMdPreview = false;
           if (cell.mode === "markdown") {
               finalMdPreview = true;
               if (!finalOutput) finalOutput = { type: "markdown", html: renderMarkdown(cell.source || "") };
           }
           
           return {
               id: cell.id, mode: cell.mode || "r", source: cell.source || "", output: finalOutput,
               mdPreview: finalMdPreview, showCode: cell.showCode !== false, showOutput: cell.showOutput !== false
           };
        });

        // ToggleSize 함수 재연결 (간단 구현)
        const finalCells = loadedCells.map(c => {
             if(c.output && c.output.type === "image") {
                 c.output.toggleSize = () => {
                      setCells(prev => prev.map(p => {
                          if(p.id !== c.id) return p;
                          const sz = (p.output.inlineSize === "large") ? "small" : "large";
                          return { ...p, output: { ...p.output, inlineSize: sz } };
                      }));
                 }
             }
             return c;
        });

        setCells(finalCells);
        if (finalCells.length > 0) setActiveCellId(finalCells[0].id);
        alert("Notebook loaded.");
      } catch (err) { console.error(err); alert("Failed to load: " + err.message); }
      finally { e.target.value = ""; }
    };
    reader.readAsText(file);
  }

  function handleShare() {
    const payload = { version: "1.1", cells: cells.map(c => ({ mode: c.mode, source: c.source })) };
    setShareText(JSON.stringify(payload));
    setShowShare(true);
  }

  function applyShareJson() {
    try {
        const parsed = JSON.parse(shareText);
        if (!parsed.cells) throw new Error("Invalid JSON");
        const newCells = parsed.cells.map((c, idx) => ({
            id: idx + 1, mode: c.mode || "r", source: c.source || "", output: null, mdPreview: false, showCode: true, showOutput: true
        }));
        setCells(newCells);
        setActiveCellId(1);
        setShowShare(false);
    } catch(e) { alert("Invalid JSON"); }
  }

  // 패키지 & 데이터 관리
  async function handleInstallPackage() {
    if (!webrInstance) return;
    const pkg = (pkgInput || "").trim();
    if (!pkg) return;
    try {
      setBusy(true); setStatus(`Installing package '${pkg}'...`);
      await webrInstance.installPackages([pkg]);
      setInstalledPackages(prev => prev.includes(pkg) ? prev : [...prev, pkg].sort());
      setPkgInput(""); setStatus(`Installed package '${pkg}'.`);
    } catch (e) { console.error(e); alert("Failed: " + e.message); setStatus("Install failed"); }
    finally { setBusy(false); }
  }

  async function handleRemovePackage(pkg) {
    if (CORE_PACKAGES.includes(pkg)) { alert("Cannot remove core package."); return; }
    if (!window.confirm(`Remove "${pkg}"?`)) return;
    try {
        setBusy(true);
        // WebR에서 실제 제거는 제한적일 수 있음
        await webrInstance.evalRVoid(`if ("${pkg}" %in% rownames(installed.packages())) remove.packages("${pkg}")`);
    } catch(e) { console.warn(e); }
    finally {
        setBusy(false);
        setInstalledPackages(prev => prev.filter(p => p !== pkg));
        setStatus(`Removed '${pkg}'.`);
    }
  }

  function getDataFileExtension(name) {
      if(!name) return "";
      const lower = name.toLowerCase();
      const dot = lower.lastIndexOf(".");
      return dot === -1 ? "" : lower.slice(dot+1);
  }

  function buildExampleCodeForDataFile(name, ext) {
      if(ext === "csv") return `df <- read.csv("${name}", header = TRUE)`;
      if(ext === "rds") return `obj <- readRDS("${name}")`;
      if(ext === "xlsx") return `library(readxl)\ndf <- read_excel("${name}")`;
      return `# Use proper function for ${name}`;
  }

  function createNewRCellWithSource(source) {
      setCells(prev => {
          const newId = nextCellId(); // utils
          return [...prev, { id: newId, mode: "r", source, output: null, mdPreview: false, showCode: true, showOutput: true }];
      });
  }

  async function handleDataUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !webrInstance) return;
    
    const ext = getDataFileExtension(file.name);
    const exampleCode = buildExampleCodeForDataFile(file.name, ext);
    
    const reader = new FileReader();
    reader.onload = async () => {
        try {
            const buffer = reader.result;
            const uint8 = new Uint8Array(buffer);
            webrInstance.FS.writeFile(file.name, uint8);
            
            setDataFiles(prev => {
                const others = prev.filter(f => f.name !== file.name);
                return [...others, { name: file.name, size: file.size, path: file.name, ext, exampleCode }];
            });
            setStatus(`Uploaded '${file.name}'`);
        } catch(err) { console.error(err); alert("Upload failed"); }
        finally { e.target.value = ""; }
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleRemoveDataFile(target) {
      if(!webrInstance) return;
      if(!window.confirm(`Delete '${target.name}'?`)) return;
      try { webrInstance.FS.unlink(target.path); } catch(e) { console.warn(e); }
      setDataFiles(prev => prev.filter(f => f.path !== target.path));
  }

  // UI 렌더링 변수
  const rootClass = "flex flex-col h-full transition-colors duration-300 " + (darkMode ? "bg-stone-900 text-stone-100" : "bg-slate-100 text-slate-900");
  const headerClass = "h-14 flex items-center justify-between px-4 border-b shadow-sm backdrop-blur " + (darkMode ? "border-stone-800 bg-stone-950/95" : "border-slate-200 bg-white/95");
  const cellClass = "group relative rounded-2xl border shadow-sm transition-colors " + (darkMode ? "bg-stone-900/80 border-stone-800 hover:border-orange-500/80" : "bg-white border-slate-200 hover:border-orange-300/80 hover:shadow-md");
  const cellHeaderClass = "flex items-center justify-between px-3 py-2 border-b rounded-t-2xl " + (darkMode ? "border-stone-800/80 bg-stone-950/90" : "border-slate-200 bg-slate-50");

  return (
    <div className={rootClass}>
       {/* 상단 헤더 바 (복구됨) */}
       <header className={headerClass}>
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">R</div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[13px] font-semibold tracking-tight">WEB-R NOTEBOOK</span>
                  <span className="text-[11px] text-slate-400">Browser-based R Notebook</span>
                </div>
              </div>
              <span className={"ml-4 rounded-full px-2 py-0.5 text-[11px] " + (ready ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                {ready ? "Ready" : "Starting WebR..."}
              </span>
              {busy && (
                <span className="flex items-center gap-1 text-[11px] text-amber-400">
                  <span className="h-2 w-2 animate-ping rounded-full bg-amber-400" /> Running...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[12px]">
              <button type="button" onClick={handleNewNotebook} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"><span className="font-medium">New</span></button>
              <button type="button" onClick={handleSaveNotebook} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"><span className="font-medium">Save</span></button>
              <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
                <span className="font-medium">Load</span>
                <input type="file" accept="application/json" className="hidden" onChange={handleLoadNotebookFromFile} />
              </label>
              <button type="button" onClick={() => setShowHelp(true)} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"><span className="font-medium">Help</span></button>
              <button type="button" onClick={handleShare} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"><span className="font-medium">Share</span></button>
              <button type="button" onClick={() => setDarkMode(!darkMode)} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
                 <span className="font-medium">{darkMode ? "Light" : "Dark"}</span>
               </button>
               <button type="button" onClick={runAllCells} disabled={!ready || busy} className={"inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium " + (ready ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-slate-300 text-slate-500 cursor-not-allowed")}>▶ Run All</button>
               <button type="button" onClick={() => setShowLogin(true)} className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                 <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-semibold text-white">R</span>
                 <span>로그인</span>
               </button>
            </div>
       </header>
       
       <div className="flex flex-1 overflow-hidden">
         <main className="flex-1 overflow-y-auto px-6 py-4">
           <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="text" defaultValue="Untitled Web-R Notebook" className={"w-80 md:w-[420px] rounded-lg border px-3 py-1 text-sm " + (darkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900")} />
                  <span className="text-[11px] text-slate-400">{status}</span>
                </div>
           </div>

           <div className="space-y-4 pb-8">
            {cells.map((cell) => (
              <section key={cell.id} className={cellClass + (activeCellId === cell.id ? " ring-2 ring-orange-400/70" : "")} onClick={() => setActiveCellId(cell.id)}>
                <div className={cellHeaderClass}>
                   <div className="flex items-center gap-2 text-[12px]">
                      <span className={"rounded-full px-2 py-0.5 text-[11px] " + (darkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-700 border border-slate-200")}>In [{cell.id}]</span>
                      <div className="inline-flex items-center rounded-full bg-slate-900/5 p-0.5 dark:bg-slate-800/60">
                          <button type="button" onClick={() => setCells(prev => prev.map(c => c.id === cell.id ? { ...c, mode: "r" } : c))} className={"px-2 py-0.5 text-[11px] rounded-full " + (cell.mode === "r" ? "bg-orange-500 text-white" : "text-slate-500")}>R Code</button>
                          <button type="button" onClick={() => setCells(prev => prev.map(c => c.id === cell.id ? { ...c, mode: "markdown" } : c))} className={"px-2 py-0.5 text-[11px] rounded-full " + (cell.mode === "markdown" ? "bg-orange-500 text-white" : "text-slate-500")}>Markdown (LaTeX)</button>
                      </div>
                   </div>
                   <div className="flex items-center gap-1 text-[11px]">
                        {cell.mode === "r" && (
                          <>
                            <button type="button" onClick={() => runRCell(cell.id, false)} disabled={!ready || busy} className={"inline-flex items-center rounded-full px-2 py-0.5 " + (ready ? "text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800" : "text-slate-400 cursor-not-allowed")}>▶ Run</button>
                            <button type="button" onClick={() => runRCell(cell.id, true)} disabled={!ready || busy} className={"inline-flex items-center rounded-full px-2 py-0.5 " + (ready ? "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-slate-400 cursor-not-allowed")}>▶ + Cell</button>
                          </>
                        )}
                        <button type="button" onClick={() => moveCell(cell.id, "up")} className="inline-flex items-center rounded-full px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">↑</button>
                        <button type="button" onClick={() => moveCell(cell.id, "down")} className="inline-flex items-center rounded-full px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">↓</button>
                        <button type="button" onClick={() => deleteCell(cell.id)} className="inline-flex items-center rounded-full px-2 py-0.5 text-red-400 hover:bg-red-50 dark:hover:bg-slate-800">✕</button>
                   </div>
                </div>

                <div className="px-4 py-3">
                   {/* Markdown 모드 */}
                   {cell.mode === "markdown" ? (
                        cell.mdPreview ? (
                          <div className={"markdown-body prose prose-sm max-w-none rounded-xl border px-3 py-2 text-sm " + (darkMode ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-slate-50 text-slate-800")}>
                            <div className="flex items-center justify-between mb-2 text-[11px] text-slate-400">
                                <span>"Markdown Preview (LaTeX 수식 지원)"</span>
                                <button type="button" onClick={() => setCells(prev => prev.map(c => c.id === cell.id ? { ...c, mdPreview: false } : c))} className="rounded-full border border-slate-300 px-2 py-0.5 text-[11px] hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">Edit Markdown</button>
                            </div>
                            <MarkdownRendered html={cell.output && cell.output.type === "markdown" ? cell.output.html : renderMarkdown(cell.source)} />
                          </div>
                        ) : (
                          <div>
                            <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                              <span>"Markdown Editor (LaTeX 수식 지원)"</span>
                              <button type="button" onClick={() => runMarkdownCell(cell.id)} className="rounded-full border border-slate-300 px-2 py-0.5 text-[11px] hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">Preview Markdown</button>
                            </div>
                            <RCodeEditor value={cell.source} onChange={(v) => setCells(prev => prev.map(c => c.id === cell.id ? { ...c, source: v } : c))} darkMode={darkMode} cellId={cell.id} mode="markdown" onFocus={() => setActiveCellId(cell.id)} />
                          </div>
                        )
                      ) : (
                        // R Code 모드
                        <div>
                           <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                <button type="button" onClick={() => setCells(prev => prev.map(c => c.id === cell.id ? { ...c, showCode: c.showCode === false ? true : !c.showCode } : c))} className={"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 " + (darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100")}>
                                    <span>{cell.showCode === false ? "▶" : "▼"}</span><span>Code</span>
                                </button>
                                <button type="button" onClick={() => setCells(prev => prev.map(c => c.id === cell.id ? { ...c, showOutput: c.showOutput === false ? true : !c.showOutput } : c))} className={"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 " + (darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100")}>
                                    <span>{cell.showOutput === false ? "▶" : "▼"}</span><span>Output</span>
                                </button>
                           </div>
                           {cell.showCode !== false && (
                            <RCodeEditor value={cell.source} onChange={(v) => setCells(prev => prev.map(c => c.id === cell.id ? { ...c, source: v } : c))} darkMode={darkMode} cellId={cell.id} mode="r" onFocus={() => setActiveCellId(cell.id)} />
                          )}
                        </div>
                      )}
                      {cell.mode === "r" && cell.showOutput !== false && (
                        <CellOutput output={cell.output} darkMode={darkMode} />
                      )}
                </div>
              </section>
            ))}
             <div className="flex justify-center">
                  <button type="button" onClick={() => addCellBelow(cells[cells.length - 1].id)} className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500 hover:border-orange-400 hover:text-orange-500 dark:border-slate-600 dark:hover:border-orange-400">+ New Cell</button>
             </div>
           </div>
         </main>

         {/* 사이드바 (복구됨) */}
         <aside className={(darkMode ? "bg-slate-950 border-l border-slate-800" : "bg-slate-50 border-l border-slate-200") + " w-72 flex-shrink-0 overflow-y-auto px-3 py-4 text-[12px]"}>
           {/* Package Manager */}
           <section className="mb-4">
                <div className="mb-2 flex items-center justify-between"><h2 className="text-[12px] font-semibold text-slate-600 dark:text-slate-200">PACKAGE MANAGER</h2></div>
                <div className="mb-2 flex gap-1">
                  <input type="text" placeholder="e.g. dplyr" value={pkgInput} onChange={(e) => setPkgInput(e.target.value)} className={"flex-1 rounded-lg border px-2 py-1 text-xs " + (darkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900")} />
                  <button type="button" onClick={handleInstallPackage} className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-medium text-white hover:bg-orange-600">Add</button>
                </div>
                <div className="mb-2 flex flex-wrap gap-1">
                  {POPULAR_PACKAGES.map((pkg) => (
                    <button key={pkg} type="button" onClick={() => setPkgInput(pkg)} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:bg-slate-800 dark:text-slate-300">{pkg}</button>
                  ))}
                </div>
                <div className={"rounded-xl border text-[11px] " + (darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white")}>
                  <div className="border-b px-2 py-1.5 text-[11px] text-slate-400 dark:border-slate-800">INSTALLED PACKAGES</div>
                  <ul className="max-h-40 overflow-y-auto px-2 py-1.5 space-y-0.5">
                    {installedPackages.map((pkg) => (
                      <li key={pkg} className="flex items-center justify-between py-0.5">
                        <span className="text-slate-600 dark:text-slate-200">{pkg}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-emerald-500">{CORE_PACKAGES.includes(pkg) ? "core" : "ready"}</span>
                          {!CORE_PACKAGES.includes(pkg) && (
                            <button type="button" onClick={() => handleRemovePackage(pkg)} className="rounded-full px-1 text-[11px] text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-slate-800" title="Remove package">✕</button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
           </section>

           {/* Data Manager */}
           <section className="mb-4">
                <div className="mb-2 flex items-center justify-between"><h2 className="text-[12px] font-semibold text-slate-600 dark:text-slate-200">DATA MANAGER</h2></div>
                <label className="mb-2 inline-flex w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 px-2 py-2 text-[11px] text-slate-500 hover:border-orange-400 hover:text-orange-500 dark:border-slate-700 dark:hover:border-orange-400">
                  <span>CSV / RDS / XLSX / TXT Upload</span>
                  <input type="file" accept=".csv,.rds,.txt,.xlsx,.xls" className="hidden" onChange={handleDataUpload} />
                </label>
                <div className={"rounded-xl border text-[11px] " + (darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white")}>
                   <div className="border-b px-2 py-1.5 text-[11px] text-slate-400 dark:border-slate-800">UPLOADED FILES</div>
                   {dataFiles.length === 0 ? (
                    <div className="px-2 py-2 text-[11px] text-slate-400">No files yet.</div>
                   ) : (
                    <ul className="max-h-40 overflow-y-auto px-2 py-1.5 space-y-1">
                      {dataFiles.map((f) => (
                        <li key={f.path} className="flex flex-col gap-0.5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-800 dark:text-slate-100">{f.name}</span>
                            <button type="button" onClick={() => handleRemoveDataFile(f)} className="rounded-full px-1 text-[11px] text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-slate-800">✕</button>
                          </div>
                          <span className="text-[10px] text-slate-400">{(f.size / 1024).toFixed(1)} KB</span>
                          {f.exampleCode && (
                            <div className={"mt-1 rounded-lg border px-2 py-1 font-mono " + (darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50")}>
                               <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
                                   <span>Example Code</span>
                                   <button type="button" onClick={() => createNewRCellWithSource(f.exampleCode)} className="rounded-full border px-2 py-0.5 text-[10px] hover:bg-orange-50 dark:border-slate-600 dark:hover:bg-slate-800">+ Cell</button>
                               </div>
                               <pre className="whitespace-pre-wrap text-[10px] leading-snug">{f.exampleCode}</pre>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                   )}
                </div>
           </section>
         </aside>
       </div>
       
       {/* 모달: Help */}
       {showHelp && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={(e) => { if(e.target===e.currentTarget) setShowHelp(false); }}>
              <div className={"w-full max-w-lg rounded-2xl border p-4 text-sm " + (darkMode ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800")}>
                <div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-semibold">Web-R Notebook Help</h2><button type="button" onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">✕</button></div>
                <div className="space-y-2 text-[12px]">
                  <p className="font-medium">Keyboard Shortcuts</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Ctrl+Enter</strong>: Run current cell</li>
                    <li><strong>Ctrl+Shift+Enter</strong>: Run cell + insert below</li>
                    <li><strong>Alt+Enter</strong>: Insert new R Code cell below</li>
                  </ul>
                </div>
              </div>
            </div>
       )}

       {/* 모달: Share */}
       {showShare && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={(e) => { if(e.target===e.currentTarget) setShowShare(false); }}>
              <div className={"w-full max-w-xl rounded-2xl border p-4 text-sm " + (darkMode ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800")}>
                <div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-semibold">Share Notebook (JSON)</h2><button type="button" onClick={() => setShowShare(false)} className="text-slate-400 hover:text-slate-600">✕</button></div>
                <textarea className={"h-48 w-full rounded-xl border px-2 py-1 text-[11px] " + (darkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-slate-50 text-slate-800")} value={shareText} onChange={(e) => setShareText(e.target.value)} />
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => navigator.clipboard.writeText(shareText).then(()=>alert("Copied"))} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-700">Copy JSON</button>
                    <button type="button" onClick={applyShareJson} className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white hover:bg-orange-600">Load from JSON</button>
                  </div>
                </div>
              </div>
            </div>
       )}

       {/* 모달: 로그인 */}
       {showLogin && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={(e) => { if(e.target===e.currentTarget) setShowLogin(false); }}>
              <div className={"w-full max-w-sm rounded-2xl border p-4 text-sm " + (darkMode ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800")}>
                <div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-semibold">Web-R 로그인</h2><button type="button" onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-slate-600">✕</button></div>
                <p className="mb-3 text-[11px] text-slate-400">데모용 UI입니다. 실제 로그인은 동작하지 않습니다.</p>
                <form className="space-y-3 text-[12px]">
                  <div className="space-y-1">
                    <label className="block text-[11px] text-slate-500">ID</label>
                    <input type="text" value={loginAccount} onChange={(e) => setLoginAccount(e.target.value)} className={"w-full rounded-lg border px-2 py-1 " + (darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] text-slate-500">Password</label>
                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={"w-full rounded-lg border px-2 py-1 " + (darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")} />
                  </div>
                  <div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setShowLogin(false)} className="rounded-full border px-3 py-1">취소</button><button type="button" onClick={() => setShowLogin(false)} className="rounded-full bg-orange-500 px-3 py-1 text-white">로그인</button></div>
                </form>
              </div>
            </div>
       )}

       {/* WebR Loading Overlay */}
       {showOverlay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
              <div className="w-full max-w-sm rounded-2xl border border-orange-500/50 bg-slate-950 px-6 py-4 text-sm text-orange-100 shadow-2xl">
                <div className="mb-2 flex items-center gap-3">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
                  <div className="font-semibold">Starting Web-R Notebook...</div>
                </div>
                <pre className="whitespace-pre-wrap text-[11px] text-orange-200/80">{overlayText}</pre>
              </div>
            </div>
       )}
    </div>
  );
}

// React DOM 렌더링
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Notebook />);