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

  // =======================================================================
  // [중요] 이곳에 원래 있던 Notebook 내부 함수들(runRCell, handleDataUpload 등)이 
  // 반드시 모두 포함되어 있어야 합니다. (기존 전체 코드 유지)
  // =======================================================================

  /**
   * WebR 초기화 (useEffect)
   */
  useEffect(() => {
	let cancelled = false;
	async function initWebR() {
	  try {
		setShowOverlay(true);
		setOverlayText("Downloading WebR runtime...");

		const WebRClass = await waitForWebR(); // utils.js 함수 사용
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

  // UI 렌더링 변수
  const rootClass = "flex flex-col h-full transition-colors duration-300 " + (darkMode ? "bg-stone-900 text-stone-100" : "bg-slate-100 text-slate-900");
  const headerClass = "h-14 flex items-center justify-between px-4 border-b shadow-sm backdrop-blur " + (darkMode ? "border-stone-800 bg-stone-950/95" : "border-slate-200 bg-white/95");
  const cellClass = "group relative rounded-2xl border shadow-sm transition-colors " + (darkMode ? "bg-stone-900/80 border-stone-800 hover:border-orange-500/80" : "bg-white border-slate-200 hover:border-orange-300/80 hover:shadow-md");
  const cellHeaderClass = "flex items-center justify-between px-3 py-2 border-b rounded-t-2xl " + (darkMode ? "border-stone-800/80 bg-stone-950/90" : "border-slate-200 bg-slate-50");

  return (
	<div className={rootClass}>
	   <header className={headerClass}>
          {/* Header 내용... (원래 코드 그대로 사용) */}
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
            {/* 우측 툴바 (Help, Share, Login, Theme 등) 원래 코드 유지 */}
            <div className="flex items-center gap-2 text-[12px]">
               {/* ... 버튼들 ... */}
               <button type="button" onClick={() => setDarkMode(!darkMode)} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
                 <span className="font-medium">{darkMode ? "Light" : "Dark"}</span>
               </button>
               {/* ... */}
            </div>
	   </header>
	   
	   <div className="flex flex-1 overflow-hidden">
		 <main className="flex-1 overflow-y-auto px-6 py-4">
		   <div className="space-y-4 pb-8">
			{cells.map((cell) => (
			  <section key={cell.id} className={cellClass + (activeCellId === cell.id ? " ring-2 ring-orange-400/70" : "")} onClick={() => setActiveCellId(cell.id)}>
				<div className={cellHeaderClass}>
                   {/* 셀 헤더 (In[], 모드 토글, 실행 버튼 등) 원래 코드 유지 */}
                   <div className="flex items-center gap-2 text-[12px]">
                      <span className={"rounded-full px-2 py-0.5 text-[11px] " + (darkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-700 border border-slate-200")}>In [{cell.id}]</span>
                   </div>
                   {/* ... */}
				</div>
				<div className="px-4 py-3">
                   {/* RCodeEditor, MarkdownRendered 사용 부분 (원래 코드 유지) */}
                   {cell.mode === "markdown" ? (
                        cell.mdPreview ? (
                          <div className={"markdown-body prose prose-sm max-w-none rounded-xl border px-3 py-2 text-sm " + (darkMode ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-slate-50 text-slate-800")}>
                            <MarkdownRendered html={cell.output && cell.output.type === "markdown" ? cell.output.html : renderMarkdown(cell.source)} />
                          </div>
                        ) : (
                          <RCodeEditor value={cell.source} onChange={(v) => {
                              // updateCellSource 로직 필요
                              setCells(prev => prev.map(c => c.id === cell.id ? { ...c, source: v } : c));
                          }} darkMode={darkMode} cellId={cell.id} mode="markdown" onFocus={() => setActiveCellId(cell.id)} />
                        )
                      ) : (
                        <div>
                           {/* R Code 모드... */}
                           {cell.showCode !== false && (
                            <RCodeEditor value={cell.source} onChange={(v) => {
                                setCells(prev => prev.map(c => c.id === cell.id ? { ...c, source: v } : c));
                            }} darkMode={darkMode} cellId={cell.id} mode="r" onFocus={() => setActiveCellId(cell.id)} />
                          )}
                        </div>
                      )}
                      {cell.mode === "r" && cell.showOutput !== false && (
                        <CellOutput output={cell.output} darkMode={darkMode} />
                      )}
				</div>
			  </section>
			))}
		   </div>
		 </main>
		 <aside className={(darkMode ? "bg-slate-950 border-l border-slate-800" : "bg-slate-50 border-l border-slate-200") + " w-72 flex-shrink-0 overflow-y-auto px-3 py-4 text-[12px]"}>
		   {/* Package Manager / Data Manager (원래 코드 유지) */}
		 </aside>
	   </div>
	   
	   {/* Modals (Help, Share, Login, Overlay) - 원래 코드 유지 */}
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