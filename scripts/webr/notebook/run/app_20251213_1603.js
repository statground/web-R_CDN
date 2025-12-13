/**
 * Notebook 컴포넌트 (메인)
 */
function Notebook() {
  const { useState, useEffect, useRef } = React;

  // =========================
  // URL에서 notebookID 추출
  // =========================
  function getNotebookIdFromUrl() {
    try {
      const m = (location.pathname || "").match(/\/webr\/notebook\/run\/([^\/]+)\//);
      return m ? m[1] : null;
    } catch (e) {}
    return null;
  }
  const notebookIdFromUrlRef = useRef(getNotebookIdFromUrl());

  // =========================
  // WebR 및 상태 관련
  // =========================
  const [webrInstance, setWebrInstance] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Initializing...");

  // =========================
  // UI 상태
  // =========================
  const [darkMode, setDarkMode] = useState(false);
  const [notebookTitle, setNotebookTitle] = useState("Untitled Web-R Notebook");

  const [showHelp, setShowHelp] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareText, setShareText] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [loginAccount, setLoginAccount] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // =========================
  // Auth
  // =========================
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authWorking, setAuthWorking] = useState(false);
  const [authError, setAuthError] = useState("");

  async function refreshAuth() {
    setAuthLoading(true);
    try {
      const u = await apiGetUserInfo();
      setAuthUser(u);
    } catch (e) {
      setAuthUser(null);
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    refreshAuth();
    function onFocus() {
      refreshAuth();
    }
    window.addEventListener("focus", onFocus);
    const t = setInterval(refreshAuth, 60 * 1000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(t);
    };
  }, []);

  // =========================
  // Overlay
  // =========================
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayText, setOverlayText] = useState("Booting WebR...");

  // =========================
  // 셀 상태 (초기값은 constants.js 상수 활용)
  // =========================
  const [cells, setCells] = useState([
    {
      id: 1,
      mode: "markdown",
      source: INITIAL_LATEX_LINES.join("\n"),
      output: {
        type: "markdown",
        html: renderMarkdown(INITIAL_LATEX_LINES.join("\n")),
      },
      mdPreview: true,
      showCode: true,
      showOutput: true,
    },
    {
      id: 2,
      mode: "r",
      source: INITIAL_R_LINES.join("\n"),
      output: null,
      mdPreview: false,
      showCode: true,
      showOutput: true,
    },
  ]);
  const [activeCellId, setActiveCellId] = useState(2);

  // =========================
  // Dark Mode 처리 (Tailwind + CodeMirror)
  // =========================
  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", !!darkMode);
    } catch (e) {}

    // material-darker 테마 CSS 한 번만 로드
    try {
      const id = "cm-theme-material-darker";
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/codemirror@5/theme/material-darker.css";
        document.head.appendChild(link);
      }
    } catch (e) {}

    setTimeout(() => {
      try {
        document.querySelectorAll(".CodeMirror").forEach((el) => {
          const cm = el && el.CodeMirror;
          if (!cm) return;
          try {
            cm.setOption("theme", darkMode ? "material-darker" : "default");
          } catch (e) {}
          try {
            cm.refresh();
          } catch (e) {}
        });
      } catch (e) {}
    }, 50);
  }, [darkMode]);

  // 셀 변경 시 CodeMirror refresh 보정
  useEffect(() => {
    setTimeout(() => {
      try {
        document.querySelectorAll(".CodeMirror").forEach((el) => {
          const cm = el && el.CodeMirror;
          if (!cm) return;
          try {
            cm.setOption("theme", darkMode ? "material-darker" : "default");
          } catch (e) {}
          try {
            cm.refresh();
          } catch (e) {}
        });
      } catch (e) {}
    }, 30);
  }, [cells, activeCellId, darkMode]);

  // =========================
  // WebR 초기화
  // =========================
  useEffect(() => {
    let cancelled = false;
    async function initWebR() {
      try {
        setShowOverlay(true);
        setOverlayText("Downloading WebR runtime...");

        const WebRClass = await waitForWebR();
        if (cancelled) return;

        const webr = new WebRClass({
          defaultPackages: ["base", "graphics", "grDevices", "stats"],
          RArgs: ["--quiet"],
        });

        setStatus("Starting WebR...");
        await webr.init();
        if (cancelled) return;

        await webr.evalRVoid('options(repos = c(CRAN = "https://repo.r-wasm.org"))');
        await webr.evalRVoid("options(device = webr::canvas)");

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
    return () => {
      cancelled = true;
    };
  }, []);
  // =========================
  // Restore runtime state from DB after WebR is ready
  // - packages: installPackages() again so library() works without re-adding
  // - data files: re-write to FS so read.csv/read_excel can find them
  // =========================
  useEffect(() => {
    if (!webrInstance) return;

    // 파일 복원 (dataFiles가 이미 로드되어 있는 경우)
    if (!dataFilesRestoreRef.current && Array.isArray(dataFiles) && dataFiles.length) {
      dataFilesRestoreRef.current = true;
      ensureDataFilesInFS(dataFiles);
    }

    // 패키지 복원 (installedPackages가 이미 로드되어 있는 경우)
    if (!packagesRestoreRef.current && Array.isArray(installedPackages) && installedPackages.length) {
      packagesRestoreRef.current = true;
      ensurePackagesInstalled(installedPackages);
    }
  }, [webrInstance, dataFiles, installedPackages]);


  // =========================
  // DB Load: 페이지 진입 시 notebook data 로드
  // =========================
  useEffect(() => {
    (async () => {
      const nbid = notebookIdFromUrlRef.current;
      if (!nbid) return;

      try {
        setStatus("Loading notebook...");
        const res = await apiLoadNotebook(nbid);

        if (!res || res.ok !== true || !res.item) {
          setStatus("Failed to load");
          return;
        }

        if (res.item.title) setNotebookTitle(res.item.title);

        // data는 JSON 컬럼 (객체/문자열 모두 처리)
        if (res.item.data) {
          const parsed = typeof res.item.data === "string" ? JSON.parse(res.item.data) : res.item.data;

          if (parsed && Array.isArray(parsed.cells)) {
            const loadedCells = parsed.cells.map((cell) => {
              let restoredOutput = null;

              if (cell.mode === "markdown") {
                restoredOutput = { type: "markdown", html: renderMarkdown(cell.source || "") };
                return {
                  id: cell.id,
                  mode: "markdown",
                  source: cell.source || "",
                  output: restoredOutput,
                  mdPreview: true,
                  showCode: cell.showCode !== false,
                  showOutput: cell.showOutput !== false,
                };
              }

              if (cell.output) {
                if (cell.output.type === "text") restoredOutput = { type: "text", text: cell.output.text };
                if (cell.output.type === "image") {
                  restoredOutput = {
                    type: "image",
                    src: cell.output.src,
                    inlineSize: cell.output.inlineSize || "small",
                    toggleSize: () => {},
                  };
                }
              }

              return {
                id: cell.id,
                mode: "r",
                source: cell.source || "",
                output: restoredOutput,
                mdPreview: false,
                showCode: cell.showCode !== false,
                showOutput: cell.showOutput !== false,
              };
            });

            const finalCells = loadedCells.map((c) => {
              if (c.output && c.output.type === "image") {
                c.output.toggleSize = () => {
                  setCells((prev) =>
                    prev.map((p) => {
                      if (p.id !== c.id) return p;
                      const sz = p.output.inlineSize === "large" ? "small" : "large";
                      return { ...p, output: { ...p.output, inlineSize: sz } };
                    })
                  );
                };
              }
              return c;
            });

            setCells(finalCells);
            if (finalCells.length > 0) setActiveCellId(finalCells[0].id);
          }
        }

        setStatus("Loaded");
      } catch (e) {
        console.error(e);
        setStatus("Load error");
      }
    })();
  }, []);

  // =========================
  // Cell operations
  // =========================
  function addCellBelow(targetId) {
    setCells((prev) => {
      const idx = prev.findIndex((c) => c.id === targetId);
      const newId = nextCellId();
      const newCell = {
        id: newId,
        mode: "r",
        source: "",
        output: null,
        mdPreview: false,
        showCode: true,
        showOutput: true,
      };
      if (idx === -1) return [...prev, newCell];
      const newArr = [...prev];
      newArr.splice(idx + 1, 0, newCell);
      return newArr;
    });
  }

  function deleteCell(id) {
    setCells((prev) => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex((c) => c.id === id);
      const filtered = prev.filter((c) => c.id !== id);
      if (idx !== -1 && activeCellId === id && filtered.length > 0) {
        const newIdx = Math.max(0, idx - 1);
        setActiveCellId(filtered[newIdx].id);
      }
      return filtered;
    });
  }

  function moveCell(id, direction) {
    setCells((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
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
    const cell = cells.find((c) => c.id === id);
    if (!cell || cell.mode !== "r" || !webrInstance) return;

    setBusy(true);
    setStatus(`Running cell ${id}...`);

    try {
      const code = cell.source || "";
      const shelter = await new webrInstance.Shelter();

      const result = await shelter.captureR(code, {
        withAutoprint: true,
        captureStreams: true,
        captureGraphics: { width: 504, height: 504, bg: "white" },
      });

      let textOut = "";
      if (Array.isArray(result.output)) {
        textOut = result.output
          .filter((o) => o.type === "stdout" || o.type === "stderr")
          .map((o) => o.data)
          .join("\n");
      } else {
        textOut = (result.stdout || "") + (result.stderr || "");
      }

      const ansiRegex =
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
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
            setCells((prev) =>
              prev.map((c) => {
                if (c.id !== id) return c;
                const currentSize =
                  (c.output && c.output.inlineSize) === "large" ? "small" : "large";
                return { ...c, output: { ...c.output, inlineSize: currentSize } };
              })
            );
          },
        };
      } else {
        newOutput = { type: "text", text: textOut || "Done (no output)" };
      }

      setCells((prev) => prev.map((c) => (c.id === id ? { ...c, output: newOutput } : c)));
      setStatus(`Finished running cell ${id}`);
      if (insertBelow) addCellBelow(id);

      shelter.purge();
    } catch (e) {
      console.error(e);
      setCells((prev) =>
        prev.map((c) => (c.id === id ? { ...c, output: { type: "text", text: String(e.message || e) } } : c))
      );
      setStatus(`Error in cell ${id}`);
    } finally {
      setBusy(false);
    }
  }

  function runMarkdownCell(id) {
    const cell = cells.find((c) => c.id === id);
    if (!cell || cell.mode !== "markdown") return;
    const html = renderMarkdown(cell.source || "");
    const newOutput = { type: "markdown", html };
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, output: newOutput, mdPreview: true } : c)));
    setStatus(`Rendered markdown cell ${id}`);
  }

  async function runAllCells() {
    for (const cell of cells) {
      if (cell.mode === "r") await runRCell(cell.id, false);
      if (cell.mode === "markdown") runMarkdownCell(cell.id);
    }
  }

  // =========================
  // 단축키 처리
  // =========================
  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key;
      const isAltEnter = key === "Enter" && e.altKey;
      const isRunCombo = key === "Enter" && !e.altKey && (e.shiftKey || e.ctrlKey || e.metaKey);
      const isHelpCombo =
        (key === "h" || key === "H") && (e.altKey || (e.ctrlKey && e.shiftKey) || (e.metaKey && e.shiftKey));

      if (!isAltEnter && !isRunCombo && !isHelpCombo) return;

      if (isHelpCombo) {
        e.preventDefault();
        e.stopPropagation();
        setShowHelp(true);
        return;
      }

      const activeEl = document.activeElement;
      const inCM = activeEl && typeof activeEl.closest === "function" && activeEl.closest(".CodeMirror");
      if (!inCM) return;

      const cell = cells.find((c) => c.id === activeCellId);
      if (!cell) return;

      e.preventDefault();
      e.stopPropagation();

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

  // =========================
  // Notebook 기능들
  // =========================
  function handleNewNotebook() {
    if (!window.confirm("현재 노트북 내용을 모두 지우고 새로 시작할까요?")) return;
    setCells([
      {
        id: 1,
        mode: "markdown",
        source: INITIAL_LATEX_LINES.join("\n"),
        output: { type: "markdown", html: renderMarkdown(INITIAL_LATEX_LINES.join("\n")) },
        mdPreview: true,
        showCode: true,
        showOutput: true,
      },
      {
        id: 2,
        mode: "r",
        source: INITIAL_R_LINES.join("\n"),
        output: null,
        mdPreview: false,
        showCode: true,
        showOutput: true,
      },
    ]);
    setActiveCellId(2);
    setNotebookTitle("Untitled Web-R Notebook");
  }

  // ✅ DB 저장
  async function handleSaveNotebook() {
    const nbid = notebookIdFromUrlRef.current;
    if (!nbid) {
      alert("Notebook ID not found in URL.");
      return;
    }

    const payload = {
      version: "2.0",
      cells: cells.map((c) => ({
        id: c.id,
        mode: c.mode,
        source: c.source,
        showCode: c.showCode !== false,
        showOutput: c.showOutput !== false,
        output:
          c.output && c.output.type === "image"
            ? { type: "image", src: c.output.src, inlineSize: c.output.inlineSize }
            : c.output && c.output.type === "text"
            ? { type: "text", text: c.output.text }
            : null,
      })),
      darkMode,
      timestamp: new Date().toISOString(),
    };

    try {
      setBusy(true);
      setStatus("Saving...");
      const parts = buildDbPartsFromNotebookState();
      const res = await apiSaveNotebook(nbid, notebookTitle, { ...parts, _skip_confirm: true });
      if (res && res.ok) {
        setStatus("Saved");
      } else {
        alert((res && res.msg) ? res.msg : "Save failed");
        setStatus("Save failed");
      }
    } catch (e) {
      console.error(e);
      alert("Save error");
      setStatus("Save error");
    } finally {
      setBusy(false);
    }
  }

  // ✅ DB에서 다시 로드(새로고침 대신)
  async function handleReloadFromDB() {
    const nbid = notebookIdFromUrlRef.current;
    if (!nbid) return;

    if (!window.confirm("DB에 저장된 노트북 내용을 다시 불러올까요? (현재 화면의 변경사항은 사라질 수 있어요)")) return;

    await loadNotebookFromDB(nbid, { setStatusText: true });
  }
      if (res.item.title) setNotebookTitle(res.item.title);
      if (res.item.data) {
        const parsed = typeof res.item.data === "string" ? JSON.parse(res.item.data) : res.item.data;
        if (parsed && Array.isArray(parsed.cells)) {
          const loadedCells = parsed.cells.map((cell) => {
            let restoredOutput = null;

            if (cell.mode === "markdown") {
              restoredOutput = { type: "markdown", html: renderMarkdown(cell.source || "") };
              return {
                id: cell.id,
                mode: "markdown",
                source: cell.source || "",
                output: restoredOutput,
                mdPreview: true,
                showCode: cell.showCode !== false,
                showOutput: cell.showOutput !== false,
              };
            }

            if (cell.output) {
              if (cell.output.type === "text") restoredOutput = { type: "text", text: cell.output.text };
              if (cell.output.type === "image") {
                restoredOutput = { type: "image", src: cell.output.src, inlineSize: cell.output.inlineSize || "small", toggleSize: () => {} };
              }
            }

            return {
              id: cell.id,
              mode: "r",
              source: cell.source || "",
              output: restoredOutput,
              mdPreview: false,
              showCode: cell.showCode !== false,
              showOutput: cell.showOutput !== false,
            };
          });

          const finalCells = loadedCells.map((c) => {
            if (c.output && c.output.type === "image") {
              c.output.toggleSize = () => {
                setCells((prev) =>
                  prev.map((p) => {
                    if (p.id !== c.id) return p;
                    const sz = p.output.inlineSize === "large" ? "small" : "large";
                    return { ...p, output: { ...p.output, inlineSize: sz } };
                  })
                );
              };
            }
            return c;
          });

          setCells(finalCells);
          if (finalCells.length > 0) setActiveCellId(finalCells[0].id);
        }
      }
      setStatus("Loaded");
    } catch (e) {
      console.error(e);
      setStatus("Reload error");
    } finally {
      setBusy(false);
    }
  }

  function handleShare() {
    const payload = { version: "2.0", cells: cells.map((c) => ({ id: c.id, mode: c.mode, source: c.source })) };
    setShareText(JSON.stringify(payload));
    setShowShare(true);
  }

  function applyShareJson() {
    try {
      const parsed = JSON.parse(shareText);
      if (!parsed.cells) throw new Error("Invalid JSON");
      const newCells = parsed.cells.map((c, idx) => ({
        id: c.id || (idx + 1),
        mode: c.mode || "r",
        source: c.source || "",
        output: c.mode === "markdown" ? { type: "markdown", html: renderMarkdown(c.source || "") } : null,
        mdPreview: c.mode === "markdown",
        showCode: true,
        showOutput: true,
      }));
      setCells(newCells);
      setActiveCellId(newCells[0] ? newCells[0].id : 1);
      setShowShare(false);
    } catch (e) {
      alert("Invalid JSON");
    }
  }

  // =========================
  // 패키지 & 데이터 매니저 (원본 로직 유지)
  // =========================
  const [pkgInput, setPkgInput] = useState("");
  const [installedPackages, setInstalledPackages] = useState([...CORE_PACKAGES]);
  const [dataFiles, setDataFiles] = useState([]);

  async function handleInstallPackage() {
    if (!webrInstance) return;
    const pkg = (pkgInput || "").trim();
    if (!pkg) return;
    try {
      setBusy(true);
      setStatus(`Installing package '${pkg}'...`);
      await webrInstance.installPackages([pkg]);
      setInstalledPackages((prev) => (prev.includes(pkg) ? prev : [...prev, pkg].sort()));
      setPkgInput("");
      setStatus(`Installed package '${pkg}'.`);
    } catch (e) {
      console.error(e);
      alert("Failed: " + e.message);
      setStatus("Install failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemovePackage(pkg) {
    if (CORE_PACKAGES.includes(pkg)) {
      alert("Cannot remove core package.");
      return;
    }
    if (!window.confirm(`Remove "${pkg}"?`)) return;
    try {
      setBusy(true);
      await webrInstance.evalRVoid(`if ("${pkg}" %in% rownames(installed.packages())) remove.packages("${pkg}")`);
    } catch (e) {
      console.warn(e);
    } finally {
      setBusy(false);
      setInstalledPackages((prev) => prev.filter((p) => p !== pkg));
      setStatus(`Removed '${pkg}'.`);
    }
  }

  function getDataFileExtension(name) {
    if (!name) return "";
    const lower = name.toLowerCase();
    const dot = lower.lastIndexOf(".");
    return dot === -1 ? "" : lower.slice(dot + 1);
  }

  function buildExampleCodeForDataFile(filename, ext, varName) {
    const v = varName || "df";
    if (ext === "csv") {
      return `${v} <- read.csv("${filename}", header = TRUE)\n${v}`;
    }
    if (ext === "txt") {
      return `${v} <- read.table("${filename}", header = TRUE)\n${v}`;
    }
    if (ext === "rds") {
      return `${v} <- readRDS("${filename}")\n${v}`;
    }
    if (ext === "xlsx" || ext === "xls") {
      // readxl은 필요할 때 자동으로 설치/로드되도록 별도 처리됨
      return `library(readxl)\n${v} <- read_excel("${filename}")\n${v}`;
    }
    return `${v} <- read.csv("${filename}", header = TRUE)\n${v}`;
  }

  function createNewRCellWithSource(source) {
    setCells((prev) => {
      const newId = nextCellId();
      const next = [...prev, { id: newId, mode: "r", source, output: null, mdPreview: false, showCode: true,
        showOutput: true }];
      // ✅ id 충돌 방지: 새 셀 추가 후 시퀀스 동기화
      if (typeof syncCellIdSeqFromCells === "function") syncCellIdSeqFromCells(next);
      // ✅ 새로 추가한 셀을 active로 설정 (Data Manager + Cell 연동 이슈 방지)
      setActiveCellId(newId);
      return next;
    });
  }

  async function handleDataUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !webrInstance) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const buffer = reader.result;

        setDataFiles((prev) => {
          // 1) 동일 파일명 업로드 대비: 내부 저장명(path/name)을 유니크하게
          const existingNames = prev.map((x) => x.name);
          const uniqueName = makeUniqueFileName(existingNames, file.name);

          const ext = getDataFileExtension(uniqueName);
          let varName = toSafeRVarName(getBaseName(uniqueName), "df");
          // 변수명 충돌 대비
          const usedVars = new Set(prev.map((x) => x.varName).filter(Boolean));
          if (usedVars.has(varName)) {
            let vn = 2;
            while (usedVars.has(`${varName}_${vn}`)) vn += 1;
            varName = `${varName}_${vn}`;
          }
          const exampleCode = buildExampleCodeForDataFile(uniqueName, ext, varName);

          const uint8 = new Uint8Array(buffer);
          // 2) webR FS에 저장 (실행 시 read.csv/read_excel 등이 이 파일을 찾는다)
          webrInstance.FS.writeFile(uniqueName, uint8);

          // 3) DB 저장/로드를 위해 base64도 같이 들고간다.
          const contentBase64 = arrayBufferToBase64(buffer);

          // 기존 동일 이름이 있으면 교체(유니크 네이밍이므로 거의 없음)
          const others = prev.filter((f) => f.name !== uniqueName);

          return [
            ...others,
            {
              name: uniqueName,
              originalName: file.name,
              size: file.size,
              path: uniqueName,
              ext,
              varName,
              exampleCode,
              contentBase64,
            },
          ];
        });

        setStatus(`Uploaded '${file.name}'`);
      } catch (err) {
        console.error(err);
        alert("Upload failed");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  });
        setStatus(`Uploaded '${file.name}'`);
      } catch (err) {
        console.error(err);
        alert("Upload failed");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleRemoveDataFile(target) {
    if (!webrInstance) return;
    if (!window.confirm(`Delete '${target.name}'?`)) return;
    try {
      webrInstance.FS.unlink(target.path);
    } catch (e) {
      console.warn(e);
    }
    setDataFiles((prev) => prev.filter((f) => f.path !== target.path));
  }


  // =========================
  // DB split columns: restore/build helpers
  // =========================
  function parseJsonSafe(v, fallback) {
    try {
      if (v === null || typeof v === "undefined") return fallback;
      if (typeof v === "string") {
        const t = v.trim();
        if (!t) return fallback;
        return JSON.parse(t);
      }
      return v;
    } catch (e) {
      return fallback;
    }
  }

  function restoreNotebookFromDbItem(item) {
    const title = (item && item.title) ? item.title : null;

    const mdList  = parseJsonSafe(item && item.data_markdown, []);
    const rList   = parseJsonSafe(item && item.data_rcode, []);
    const rrList  = parseJsonSafe(item && item.data_rcode_result, []);
    const dataMgr = parseJsonSafe(item && item.data_data, []);
    const pkgList = parseJsonSafe(item && item.data_rpackage, []);
    const meta    = parseJsonSafe(item && item.data_meta, {});

    function normalizeDataFiles(list) {
      const arr = Array.isArray(list) ? list : [];
      return arr.map((f) => {
        // allow legacy string form: ["file.csv", ...]
        if (typeof f === "string") {
          const name = f;
          const ext = getDataFileExtension(name);

    // data manager normalize
    const rawFiles = Array.isArray(item.data_data) ? item.data_data : (item.data_data && item.data_data.files ? item.data_data.files : []);
    const dataFiles = (rawFiles || []).map((f, idx) => {
      const name = f.name || f.path || `file_${idx+1}`;
      const ext = f.ext || getDataFileExtension(name);
      const varName = f.varName || toSafeRVarName(getBaseName(name), "df");
      const exampleCode = f.exampleCode || buildExampleCodeForDataFile(name, ext, varName);
      return {
        name,
        originalName: f.originalName || f.name || name,
        size: f.size || 0,
        path: f.path || name,
        ext,
        varName,
        exampleCode,
        contentBase64: f.contentBase64 || null,
      };
    });

    return { name, size: 0, path: name, ext, exampleCode: buildExampleCodeForDataFile(name, ext) };
        }
        const name = f && (f.name || f.path) ? (f.name || f.path) : "unknown";
        const path = f && f.path ? f.path : name; // key 안정화
        const ext  = f && f.ext ? f.ext : getDataFileExtension(name);
        const exampleCode = f && f.exampleCode ? f.exampleCode : buildExampleCodeForDataFile(name, ext);
        const size = (f && typeof f.size === "number") ? f.size : 0;
        return { ...f, name, path, ext, exampleCode, size };
      });
    }

    // Backward compatibility:
    // - If older versions stored everything inside data_meta (e.g. meta.cells),
    //   restore from that structure without migration.
    if ((!mdList || !mdList.length) && (!rList || !rList.length) && meta && Array.isArray(meta.cells) && meta.cells.length) {
      const legacyCells = meta.cells;
      return {
        title,
        cells: legacyCells,
        activeCellId: meta.activeCellId || (legacyCells[0] ? legacyCells[0].id : 1),
        darkMode: (typeof meta.darkMode !== "undefined") ? !!meta.darkMode : null,
        dataFiles: Array.isArray(meta.dataFiles) ? meta.dataFiles : [],
        installedPackages: Array.isArray(meta.installedPackages) ? meta.installedPackages : [],
      };
    }

    const mdById = new Map((Array.isArray(mdList) ? mdList : []).map((x) => [x.id, x.source || ""]));
    const rById  = new Map((Array.isArray(rList) ? rList : []).map((x) => [x.id, x.source || ""]));
    const rrById = new Map((Array.isArray(rrList) ? rrList : []).map((x) => [x.id, x.output || null]));

    const order = Array.isArray(meta.cell_order) ? meta.cell_order : null;
    const ids = (order && order.length)
      ? order
      : Array.from(new Set([...mdById.keys(), ...rById.keys()])).sort((a,b)=>a-b);

    const restoredCells = ids.map((id) => {
      const mode = (meta.cell_mode && meta.cell_mode[id]) ? meta.cell_mode[id] : (rById.has(id) ? "r" : "markdown");
      const source = mode === "markdown" ? (mdById.get(id) || "") : (rById.get(id) || "");
      const showCode = meta.cell_showCode && typeof meta.cell_showCode[id] !== "undefined" ? !!meta.cell_showCode[id] : true;
      const showOutput = meta.cell_showOutput && typeof meta.cell_showOutput[id] !== "undefined" ? !!meta.cell_showOutput[id] : true;
      const mdPreview = mode === "markdown" ? (meta.cell_mdPreview && typeof meta.cell_mdPreview[id] !== "undefined" ? !!meta.cell_mdPreview[id] : true) : false;

      let output = null;
      if (mode === "markdown") {
        output = { type: "markdown", html: renderMarkdown(source || "") };
      } else {
        const out = rrById.get(id);
        if (out && out.type === "text") output = { type: "text", text: out.text || "" };
        if (out && out.type === "image") output = { type: "image", src: out.src, inlineSize: out.inlineSize || "small", toggleSize: () => {} };
      }

      return { id, mode, source, output, mdPreview, showCode, showOutput };
    });

    // attach toggleSize for images
    const finalCells = restoredCells.map((c) => {
      if (c.output && c.output.type === "image") {
        c.output.toggleSize = () => {
          setCells((prev) =>
            prev.map((p) => {
              if (p.id !== c.id) return p;
              const sz = p.output.inlineSize === "large" ? "small" : "large";
              return { ...p, output: { ...p.output, inlineSize: sz } };
            })
          );
        };
      }
      return c;
    });

    return {
      title,
      cells: finalCells.length ? finalCells : null,
      activeCellId: (meta && meta.activeCellId) ? meta.activeCellId : (finalCells[0] ? finalCells[0].id : 1),
      darkMode: (typeof meta.darkMode !== "undefined") ? !!meta.darkMode : null,
      dataFiles: normalizeDataFiles(Array.isArray(dataMgr) ? dataMgr : []),
      installedPackages: Array.isArray(pkgList) ? pkgList : [],
    };
  }

  function buildDbPartsFromNotebookState() {
    const data_markdown = cells
      .filter((c) => c.mode === "markdown")
      .map((c) => ({ id: c.id, source: c.source || "" }));

    const data_rcode = cells
      .filter((c) => c.mode === "r")
      .map((c) => ({ id: c.id, source: c.source || "" }));

    const data_rcode_result = cells
      .filter((c) => c.mode === "r")
      .map((c) => {
        let output = null;
        if (c.output && c.output.type === "text") output = { type: "text", text: c.output.text || "" };
        if (c.output && c.output.type === "image") output = { type: "image", src: c.output.src, inlineSize: c.output.inlineSize || "small" };
        return { id: c.id, output };
      });

    const data_data = Array.isArray(dataFiles) ? dataFiles : [];

    const data_rpackage = Array.isArray(installedPackages)
      ? installedPackages.filter((p) => !CORE_PACKAGES.includes(p))
      : [];

    const data_meta = {
      version: "split-v1",
      darkMode: !!darkMode,
      activeCellId,
      cell_order: cells.map((c) => c.id),
      cell_mode: Object.fromEntries(cells.map((c) => [c.id, c.mode])),
      cell_mdPreview: Object.fromEntries(cells.map((c) => [c.id, !!c.mdPreview])),
      cell_showCode: Object.fromEntries(cells.map((c) => [c.id, c.showCode !== false])),
      cell_showOutput: Object.fromEntries(cells.map((c) => [c.id, c.showOutput !== false])),
      timestamp: new Date().toISOString(),
    };

    return { data_markdown, data_rcode, data_rcode_result, data_data, data_rpackage, data_meta };
  }


  /**
   * DB에서 노트북 데이터를 불러와 상태에 반영 (split columns)
   */

  /**
   * Data Manager 복원:
   * - DB에서 복원된 dataFiles에는 contentBase64가 포함될 수 있음
   * - webR FS에는 없을 수 있으므로, webrInstance 준비 후 재주입
   */
  async function ensureDataFilesInFS(files) {
    if (!webrInstance) return;
    const list = Array.isArray(files) ? files : [];
    for (const f of list) {
      try {
        if (!f || !f.path) continue;
        const exists = webrInstance.FS.analyzePath(f.path).exists;
        if (exists) continue;
        if (!f.contentBase64) continue;
        const bytes = base64ToUint8Array(f.contentBase64);
        webrInstance.FS.writeFile(f.path, bytes);
      } catch (e) {
        console.warn("ensureDataFilesInFS failed:", e);
      }
    }
  }

  /**
   * Package Manager 복원:
   * - UI에 'ready'로 보이는 패키지 리스트가 있어도, Notebook을 새로 열면 webR 세션에는 없을 수 있음
   * - load 후 webrInstance 준비되면 한 번 설치를 시도해준다(이미 있으면 빠르게 끝남)
   */
  async function ensurePackagesInstalled(pkgs) {
    if (!webrInstance) return;
    const list = (pkgs || []).filter((p) => p && !CORE_PACKAGES.includes(p));
    if (list.length === 0) return;
    try {
      setBusy(true);
      setStatus("Restoring packages...");
      // 순차 설치: webR 환경에서 과도한 병렬은 불안정할 수 있음
      for (const p of list) {
        try {
          await webrInstance.installPackages([p]);
        } catch (e) {
          console.warn("installPackages failed:", p, e);
        }
      }
      setStatus("Packages restored");
    } finally {
      setBusy(false);
    }
  }
  async function loadNotebookFromDB(nbid, { setStatusText = true } = {}) {
    if (!nbid) return false;

    try {
      setBusy(true);
      if (setStatusText) setStatus("Loading...");

      const res = await apiLoadNotebook(nbid);
      if (!res || res.ok !== true || !res.item) {
        if (setStatusText) setStatus("Load failed");
        return false;
      }

            const restored = restoreNotebookFromDbItem(res.item);

      // 로드할 때마다 복원 플래그 초기화 (패키지/파일을 다시 세션에 주입)
      packagesRestoreRef.current = false;
      dataFilesRestoreRef.current = false;


      if (restored.title) setNotebookTitle(restored.title);

      if (restored.cells && restored.cells.length) {
        setCells(restored.cells);
        // ✅ cell id 충돌 방지: 시퀀스 동기화
        if (typeof syncCellIdSeqFromCells === "function") syncCellIdSeqFromCells(restored.cells);
        setActiveCellId(restored.activeCellId);
      }

      if (restored.darkMode !== null) setDarkMode(restored.darkMode);
      if (restored.dataFiles) {
        setDataFiles(restored.dataFiles);
        // webrInstance가 이미 준비된 경우 즉시 FS에 주입
        if (webrInstance) ensureDataFilesInFS(restored.dataFiles);
      }

      if (restored.installedPackages) {
        const merged = Array.from(new Set([...CORE_PACKAGES, ...restored.installedPackages])).sort();
        setInstalledPackages(merged);
        if (webrInstance) ensurePackagesInstalled(merged);
      }

      if (setStatusText) setStatus("Loaded");
      return true;
    } catch (e) {
      console.error(e);
      if (setStatusText) setStatus("Load error");
      return false;
    } finally {
      setBusy(false);
    }
  }

  // ✅ /webr/notebook/run/<UUID>/ 진입 시 DB에서 불러오기 (split columns)
  useEffect(() => {
    const nbid = notebookIdFromUrlRef.current;
    if (!nbid) return;
    loadNotebookFromDB(nbid, { setStatusText: true });
  }, []);

  // =========================
  // UI 렌더링
  // =========================
  const rootClass =
    "flex flex-col h-full transition-colors duration-300 " + (darkMode ? "bg-stone-900 text-stone-100" : "bg-slate-100 text-slate-900");
  const headerClass =
    "h-14 flex items-center justify-between px-4 border-b shadow-sm backdrop-blur " +
    (darkMode ? "border-stone-800 bg-stone-950/95" : "border-slate-200 bg-white/95");

  const cellClass =
    "group relative rounded-2xl border shadow-sm transition-colors " +
    (darkMode ? "bg-stone-900/80 border-stone-800 hover:border-orange-500/80" : "bg-white border-slate-200 hover:border-orange-300/80 hover:shadow-md");
  const cellHeaderClass =
    "flex items-center justify-between px-3 py-2 border-b rounded-t-2xl " + (darkMode ? "border-stone-800/80 bg-stone-950/90" : "border-slate-200 bg-slate-50");

  return (
    <div className={rootClass}>
      {/* 상단 헤더 바 */}
      <header className={headerClass}>
        <div className="flex items-center gap-3">
          {/* 로고/타이틀 클릭 시 /webr/notebook/ 이동 */}
          <a href="/webr/notebook/" className="flex items-center gap-2 cursor-pointer select-none" title="Back to /webr/notebook/">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">R</div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold tracking-tight">WEB-R NOTEBOOK</span>
              <span className="text-[11px] text-slate-400">Browser-based R Notebook</span>
            </div>
          </a>

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
          <button type="button" onClick={handleNewNotebook} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            <span className="font-medium">New</span>
          </button>

          <button type="button" onClick={handleSaveNotebook} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            <span className="font-medium">Save</span>
          </button>

          <button type="button" onClick={handleReloadFromDB} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            <span className="font-medium">Reload</span>
          </button>

          <button type="button" onClick={() => setShowHelp(true)} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            <span className="font-medium">Help</span>
          </button>

          <button type="button" onClick={handleShare} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            <span className="font-medium">Share</span>
          </button>

          <button type="button" onClick={() => setDarkMode(!darkMode)} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">
            <span className="font-medium">{darkMode ? "Light" : "Dark"}</span>
          </button>

          <button
            type="button"
            onClick={runAllCells}
            disabled={!ready || busy}
            className={
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium " +
              (ready ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-slate-300 text-slate-500 cursor-not-allowed")
            }
          >
            ▶ Run All
          </button>

          {authLoading ? (
            <span className="ml-2 rounded-full border border-slate-300 px-3 py-1 text-[11px] text-slate-500 dark:border-slate-600">
              Checking...
            </span>
          ) : authUser ? (
            <div className="ml-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] dark:border-slate-700 dark:bg-slate-950">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
                  {((authUser.nickname || authUser.name || (authUser.email ? authUser.email.split("@")[0] : "U")) || "U").slice(0, 1)}
                </span>
                <div className="leading-tight">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">
                    {authUser.nickname || authUser.name || (authUser.email ? authUser.email.split("@")[0] : "User")}
                  </div>
                  <div className="text-[10px] text-slate-400">{authUser.is_staff ? "관리자" : "회원"}</div>
                </div>
              </div>

              <button
                type="button"
                disabled={authWorking}
                onClick={async () => {
                  try {
                    setAuthWorking(true);
                    await apiLogout();
                    await refreshAuth();
                  } catch (e) {
                    location.href = "/account/logout/";
                    return;
                  } finally {
                    setAuthWorking(false);
                  }
                }}
                className={"rounded-full px-3 py-1 text-[11px] font-medium text-white " + (authWorking ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800")}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthError("");
                setLoginAccount("");
                setLoginPassword("");
                setShowLogin(true);
              }}
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-semibold text-white">R</span>
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={notebookTitle}
                onChange={(e) => setNotebookTitle(e.target.value)}
                className={"w-80 md:w-[420px] rounded-lg border px-3 py-1 text-sm " + (darkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900")}
              />
              <span className="text-[11px] text-slate-400">{status}</span>
            </div>
          </div>

          <div className="space-y-4 pb-8">
            {cells.map((cell) => (
              <section key={cell.id} className={cellClass + (activeCellId === cell.id ? " ring-2 ring-orange-400/70" : "")} onClick={() => setActiveCellId(cell.id)}>
                <div className={cellHeaderClass}>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className={"rounded-full px-2 py-0.5 text-[11px] " + (darkMode ? "bg-slate-800 text-slate-200" : "bg-white text-slate-700 border border-slate-200")}>
                      In [{cell.id}]
                    </span>

                    <div className="inline-flex items-center rounded-full bg-slate-900/5 p-0.5 dark:bg-slate-800/60">
                      <button
                        type="button"
                        onClick={() => setCells((prev) => prev.map((c) => (c.id === cell.id ? { ...c, mode: "r" } : c)))}
                        className={"px-2 py-0.5 text-[11px] rounded-full " + (cell.mode === "r" ? "bg-orange-500 text-white" : "text-slate-500")}
                      >
                        R Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setCells((prev) => prev.map((c) => (c.id === cell.id ? { ...c, mode: "markdown" } : c)))}
                        className={"px-2 py-0.5 text-[11px] rounded-full " + (cell.mode === "markdown" ? "bg-orange-500 text-white" : "text-slate-500")}
                      >
                        Markdown (LaTeX)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px]">
                    {cell.mode === "r" && (
                      <>
                        <button type="button" onClick={() => runRCell(cell.id, false)} disabled={!ready || busy} className={"inline-flex items-center rounded-full px-2 py-0.5 " + (ready ? "text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800" : "text-slate-400 cursor-not-allowed")}>
                          ▶ Run
                        </button>
                        <button type="button" onClick={() => runRCell(cell.id, true)} disabled={!ready || busy} className={"inline-flex items-center rounded-full px-2 py-0.5 " + (ready ? "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-slate-400 cursor-not-allowed")}>
                          ▶ + Cell
                        </button>
                      </>
                    )}

                    <button type="button" onClick={() => moveCell(cell.id, "up")} className="inline-flex items-center rounded-full px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                      ↑
                    </button>
                    <button type="button" onClick={() => moveCell(cell.id, "down")} className="inline-flex items-center rounded-full px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                      ↓
                    </button>
                    <button type="button" onClick={() => deleteCell(cell.id)} className="inline-flex items-center rounded-full px-2 py-0.5 text-red-400 hover:bg-red-50 dark:hover:bg-slate-800">
                      ✕
                    </button>
                  </div>
                </div>

                <div className="px-4 py-3">
                  {/* Markdown 모드 */}
                  {cell.mode === "markdown" ? (
                    cell.mdPreview ? (
                      <div className={"markdown-body prose prose-sm max-w-none rounded-xl border px-3 py-2 text-sm " + (darkMode ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-slate-50 text-slate-800")}>
                        <div className="flex items-center justify-between mb-2 text-[11px] text-slate-400">
                          <span>"Markdown Preview (LaTeX 수식 지원)"</span>
                          <button
                            type="button"
                            onClick={() => setCells((prev) => prev.map((c) => (c.id === cell.id ? { ...c, mdPreview: false } : c)))}
                            className="rounded-full border border-slate-300 px-2 py-0.5 text-[11px] hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                          >
                            Edit Markdown
                          </button>
                        </div>
                        <MarkdownRendered html={cell.output && cell.output.type === "markdown" ? cell.output.html : renderMarkdown(cell.source)} />
                      </div>
                    ) : (
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                          <span>"Markdown Editor (LaTeX 수식 지원)"</span>
                          <button type="button" onClick={() => runMarkdownCell(cell.id)} className="rounded-full border border-slate-300 px-2 py-0.5 text-[11px] hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800">
                            Preview Markdown
                          </button>
                        </div>
                        <RCodeEditor value={cell.source} onChange={(v) => setCells((prev) => prev.map((c) => (c.id === cell.id ? { ...c, source: v } : c)))} darkMode={darkMode} cellId={cell.id} mode="markdown" onFocus={() => setActiveCellId(cell.id)} />
                      </div>
                    )
                  ) : (
                    // R Code 모드
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <button
                          type="button"
                          onClick={() => setCells((prev) => prev.map((c) => (c.id === cell.id ? { ...c, showCode: c.showCode === false ? true : !c.showCode } : c)))}
                          className={"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 " + (darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100")}
                        >
                          <span>{cell.showCode === false ? "▶" : "▼"}</span>
                          <span>Code</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCells((prev) => prev.map((c) => (c.id === cell.id ? { ...c, showOutput: c.showOutput === false ? true : !c.showOutput } : c)))}
                          className={"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 " + (darkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100")}
                        >
                          <span>{cell.showOutput === false ? "▶" : "▼"}</span>
                          <span>Output</span>
                        </button>
                      </div>

                      {cell.showCode !== false && <RCodeEditor value={cell.source} onChange={(v) => setCells((prev) => prev.map((c) => (c.id === cell.id ? { ...c, source: v } : c)))} darkMode={darkMode} cellId={cell.id} mode="r" onFocus={() => setActiveCellId(cell.id)} />}
                    </div>
                  )}

                  {cell.mode === "r" && cell.showOutput !== false && <CellOutput output={cell.output} darkMode={darkMode} />}
                </div>
              </section>
            ))}

            <div className="flex justify-center">
              <button type="button" onClick={() => addCellBelow(cells[cells.length - 1].id)} className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500 hover:border-orange-400 hover:text-orange-500 dark:border-slate-600 dark:hover:border-orange-400">
                + New Cell
              </button>
            </div>
          </div>
        </main>

        {/* 사이드바 */}
        <aside className={(darkMode ? "bg-slate-950 border-l border-slate-800" : "bg-slate-50 border-l border-slate-200") + " w-72 flex-shrink-0 overflow-y-auto px-3 py-4 text-[12px]"}>
          {/* Package Manager */}
          <section className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[12px] font-semibold text-slate-600 dark:text-slate-200">PACKAGE MANAGER</h2>
            </div>
            <div className="mb-2 flex gap-1">
              <input type="text" placeholder="e.g. dplyr" value={pkgInput} onChange={(e) => setPkgInput(e.target.value)} className={"flex-1 rounded-lg border px-2 py-1 text-xs " + (darkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900")} />
              <button type="button" onClick={handleInstallPackage} className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-medium text-white hover:bg-orange-600">
                Add
              </button>
            </div>
            <div className="mb-2 flex flex-wrap gap-1">
              {POPULAR_PACKAGES.map((pkg) => (
                <button key={pkg} type="button" onClick={() => setPkgInput(pkg)} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:bg-slate-800 dark:text-slate-300">
                  {pkg}
                </button>
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
                        <button type="button" onClick={() => handleRemovePackage(pkg)} className="rounded-full px-1 text-[11px] text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-slate-800" title="Remove package">
                          ✕
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Data Manager */}
          <section className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[12px] font-semibold text-slate-600 dark:text-slate-200">DATA MANAGER</h2>
            </div>
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
                        <button type="button" onClick={() => handleRemoveDataFile(f)} className="rounded-full px-1 text-[11px] text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-slate-800">
                          ✕
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400">{(f.size / 1024).toFixed(1)} KB</span>
                      {f.exampleCode && (
                        <div className={"mt-1 rounded-lg border px-2 py-1 font-mono " + (darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50")}>
                          <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
                            <span>Example Code</span>
                            <button type="button" onClick={() => createNewRCellWithSource(f.exampleCode)} className="rounded-full border px-2 py-0.5 text-[10px] hover:bg-orange-50 dark:border-slate-600 dark:hover:bg-slate-800">
                              + Cell
                            </button>
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={(e) => { if (e.target === e.currentTarget) setShowHelp(false); }}>
          <div className={"w-full max-w-lg rounded-2xl border p-4 text-sm " + (darkMode ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800")}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Web-R Notebook Help</h2>
              <button type="button" onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={(e) => { if (e.target === e.currentTarget) setShowShare(false); }}>
          <div className={"w-full max-w-xl rounded-2xl border p-4 text-sm " + (darkMode ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800")}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Share Notebook (JSON)</h2>
              <button type="button" onClick={() => setShowShare(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <textarea className={"h-48 w-full rounded-xl border px-2 py-1 text-[11px] " + (darkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-slate-50 text-slate-800")} value={shareText} onChange={(e) => setShareText(e.target.value)} />
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <div className="flex gap-2">
                <button type="button" onClick={() => navigator.clipboard.writeText(shareText).then(() => alert("Copied"))} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-700">
                  Copy JSON
                </button>
                <button type="button" onClick={applyShareJson} className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white hover:bg-orange-600">
                  Load from JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 모달: 로그인 */}
      {showLogin && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40" onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div className={"w-full max-w-sm rounded-2xl border p-4 text-sm " + (darkMode ? "border-slate-700 bg-slate-950 text-slate-100" : "border-slate-200 bg-white text-slate-800")}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Web-R 로그인</h2>
              <button type="button" onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="mb-3 text-[11px] text-slate-400">Web-R 홈페이지 계정으로 로그인합니다.</p>
            {authError && (
              <div className="mb-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                {authError}
              </div>
            )}
            <form className="space-y-3 text-[12px]">
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-500">ID</label>
                <input type="text" value={loginAccount} onChange={(e) => setLoginAccount(e.target.value)} className={"w-full rounded-lg border px-2 py-1 " + (darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")} />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-500">Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={"w-full rounded-lg border px-2 py-1 " + (darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")} />
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => { setAuthError(""); setShowLogin(false); }} className="rounded-full border px-3 py-1">
                  취소
                </button>
                <button
                  type="button"
                  disabled={authWorking}
                  onClick={async () => {
                    setAuthError("");
                    const email = (loginAccount || "").trim();
                    const pass = loginPassword || "";
                    if (!email || !pass) {
                      setAuthError("ID/Password를 입력해 주세요.");
                      return;
                    }
                    try {
                      setAuthWorking(true);
                      const result = await apiLogin(email, pass);
                      if (result && result.checker === "SUCCESS") {
                        await refreshAuth();
                        setShowLogin(false);
                      } else if (result && result.checker === "WRONGPASSWORD") {
                        setAuthError("비밀번호가 올바르지 않습니다.");
                      } else {
                        setAuthError("계정을 확인할 수 없습니다.");
                      }
                    } catch (e) {
                      setAuthError("서버 오류가 발생했습니다.");
                    } finally {
                      setAuthWorking(false);
                      setLoginPassword("");
                    }
                  }}
                  className={"rounded-full px-3 py-1 text-white " + (authWorking ? "bg-slate-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600")}
                >
                  {authWorking ? "로그인 중..." : "로그인"}
                </button>
              </div>
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
