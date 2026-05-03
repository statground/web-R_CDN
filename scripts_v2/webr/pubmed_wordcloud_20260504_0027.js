function waitForWebR(timeoutMs = 60000) {
  if (window.WebR) return Promise.resolve(window.WebR);
  if (!window.__webrImportPromise) {
    window.__webrImportPromise = (window.__webrDynamicImport || (window.__webrDynamicImport = Function("specifier", "return import(specifier)")))("https://webr.r-wasm.org/latest/webr.mjs")
      .then((module) => {
        window.WebR = module.WebR;
        return module.WebR;
      });
  }
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("WebR runtime load timeout")), timeoutMs);
  });
  return Promise.race([window.__webrImportPromise, timeout]);
}

function pubmedEscapeRString(value) {
  return '"' + String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n") + '"';
}

function pubmedCaptureOutput(result) {
  if (!result) return "";
  if (Array.isArray(result.output)) {
    return result.output
      .filter((item) => item && (item.type === "stdout" || item.type === "stderr"))
      .map((item) => item.data || "")
      .join("\n");
  }
  return String(result.stdout || "") + String(result.stderr || "");
}

function pubmedExtractArticleText(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText || "", "application/xml");
  const articles = Array.from(doc.querySelectorAll("PubmedArticle"));
  return articles.map((article, index) => {
    const titleNode = article.querySelector("ArticleTitle");
    const abstractNodes = Array.from(article.querySelectorAll("AbstractText"));
    const title = titleNode ? titleNode.textContent.trim() : `PubMed article ${index + 1}`;
    const abstract = abstractNodes.map((node) => node.textContent.trim()).filter(Boolean).join(" ");
    return { title, abstract };
  }).filter((item) => item.abstract);
}

function pubmedBuildWordCode(abstracts, limit) {
  const stopWords = [
    "the", "and", "for", "with", "that", "this", "from", "were", "was", "are", "have", "has",
    "had", "not", "but", "our", "can", "may", "all", "use", "used", "using", "between", "into",
    "than", "then", "these", "those", "there", "their", "also", "such", "after", "before",
    "study", "studies", "result", "results", "method", "methods", "conclusion", "conclusions",
    "background", "objective", "objectives", "analysis", "data", "patients", "patient", "group",
    "groups", "clinical", "significant", "associated", "effect", "effects", "risk", "model",
    "models", "based", "including", "among", "however", "respectively", "confidence", "interval"
  ];
  const textVector = abstracts.length > 0 ? abstracts.map(pubmedEscapeRString).join(", ") : '""';
  const stopVector = stopWords.map(pubmedEscapeRString).join(", ");
  const maxWords = Math.max(10, Math.min(100, Number(limit || 50)));

  return `
texts <- c(${textVector})
words <- tolower(unlist(regmatches(texts, gregexpr("[A-Za-z][A-Za-z][A-Za-z-]+", texts))))
words <- gsub("^-+|-+$", "", words)
words <- words[nchar(words) >= 3]
stop_words <- c(${stopVector})
words <- words[!(words %in% stop_words)]
freq <- sort(table(words), decreasing = TRUE)
freq <- head(freq, ${maxWords})
if (length(freq) > 0) {
  cat(paste(names(freq), as.integer(freq), sep = "\\t"), sep = "\\n")
}
`;
}

function pubmedParseWordOutput(output) {
  return String(output || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\t/);
      return { word: parts[0], freq: Number(parts[1] || 0) };
    })
    .filter((item) => item.word && Number.isFinite(item.freq) && item.freq > 0);
}

function pubmedIntersects(a, b) {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
}

function pubmedDrawWordcloud(canvas, words) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width || 900);
  const height = Math.max(320, rect.height || 420);
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  if (!words || words.length === 0) {
    ctx.fillStyle = "#64748b";
    ctx.font = "500 16px Noto Sans KR, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("검색 결과가 없습니다.", width / 2, height / 2);
    return;
  }

  const palette = ["#0f766e", "#1d4ed8", "#be123c", "#7c2d12", "#4d7c0f", "#4338ca", "#0369a1"];
  const max = Math.max.apply(null, words.map((item) => item.freq));
  const min = Math.min.apply(null, words.map((item) => item.freq));
  const placed = [];
  const cx = width / 2;
  const cy = height / 2;

  words.forEach((item, index) => {
    const scale = max === min ? 0.65 : (item.freq - min) / (max - min);
    const fontSize = Math.round(16 + scale * 42);
    const rotate = index % 7 === 0 ? -Math.PI / 2 : 0;
    ctx.font = `700 ${fontSize}px Noto Sans KR, Arial, sans-serif`;
    const metrics = ctx.measureText(item.word);
    const textWidth = metrics.width;
    const textHeight = fontSize * 1.15;

    for (let step = 0; step < 900; step += 1) {
      const angle = step * 0.38;
      const radius = 2.7 * Math.sqrt(step);
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      const box = rotate === 0
        ? { x: x - textWidth / 2 - 5, y: y - textHeight / 2 - 5, w: textWidth + 10, h: textHeight + 10 }
        : { x: x - textHeight / 2 - 5, y: y - textWidth / 2 - 5, w: textHeight + 10, h: textWidth + 10 };
      const inside = box.x >= 8 && box.y >= 8 && box.x + box.w <= width - 8 && box.y + box.h <= height - 8;
      if (!inside || placed.some((other) => pubmedIntersects(box, other))) continue;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotate);
      ctx.fillStyle = palette[index % palette.length];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.word, 0, 0);
      ctx.restore();
      placed.push(box);
      break;
    }
  });
}

function set_main() {
  function PubMedWordcloudApp() {
    const canvasRef = React.useRef(null);
    const webrRef = React.useRef(null);
    const [query, setQuery] = React.useState("breast cancer survival");
    const [retmax, setRetmax] = React.useState(30);
    const [wordLimit, setWordLimit] = React.useState(50);
    const [status, setStatus] = React.useState("대기 중");
    const [busy, setBusy] = React.useState(false);
    const [error, setError] = React.useState("");
    const [words, setWords] = React.useState([]);
    const [articles, setArticles] = React.useState([]);

    React.useEffect(() => {
      pubmedDrawWordcloud(canvasRef.current, words);
      const redraw = () => pubmedDrawWordcloud(canvasRef.current, words);
      window.addEventListener("resize", redraw);
      return () => window.removeEventListener("resize", redraw);
    }, [words]);

    async function ensureWebR() {
      if (webrRef.current) return webrRef.current;
      setStatus("WebAssembly R runtime 로딩 중");
      const WebRClass = await waitForWebR();
      const webr = new WebRClass({
        defaultPackages: ["base", "stats", "utils"],
        RArgs: ["--quiet"],
      });
      await webr.init();
      await webr.evalRVoid('options(repos = c(CRAN = "https://repo.r-wasm.org"))');
      webrRef.current = webr;
      return webr;
    }

    async function fetchPubMedArticles() {
      const term = query.trim();
      if (!term) throw new Error("검색어를 입력해 주세요.");
      const maxResults = Math.max(1, Math.min(100, Number(retmax || 30)));
      const searchURL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        + `?db=pubmed&retmode=json&retmax=${maxResults}&term=${encodeURIComponent(term)}`;
      const searchRes = await fetch(searchURL);
      if (!searchRes.ok) throw new Error("PubMed 검색에 실패했습니다.");
      const searchData = await searchRes.json();
      const ids = (((searchData || {}).esearchresult || {}).idlist || []).filter(Boolean);
      if (ids.length === 0) return [];

      const fetchURL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
        + `?db=pubmed&retmode=xml&id=${encodeURIComponent(ids.join(","))}`;
      const articleRes = await fetch(fetchURL);
      if (!articleRes.ok) throw new Error("PubMed 초록을 불러오지 못했습니다.");
      return pubmedExtractArticleText(await articleRes.text());
    }

    async function runSearch() {
      setBusy(true);
      setError("");
      setWords([]);
      setArticles([]);
      try {
        setStatus("PubMed 검색 중");
        const nextArticles = await fetchPubMedArticles();
        setArticles(nextArticles);
        if (nextArticles.length === 0) {
          setStatus("검색 결과 없음");
          return;
        }

        const webr = await ensureWebR();
        setStatus("R에서 단어 빈도 계산 중");
        const shelter = await new webr.Shelter();
        const result = await shelter.captureR(
          pubmedBuildWordCode(nextArticles.map((item) => item.abstract), wordLimit),
          { withAutoprint: false, captureStreams: true, captureGraphics: false }
        );
        const nextWords = pubmedParseWordOutput(pubmedCaptureOutput(result));
        try { shelter.purge(); } catch (e) {}
        setWords(nextWords);
        setStatus(`완료: 논문 ${nextArticles.length}편, 단어 ${nextWords.length}개`);
      } catch (e) {
        setError(e && e.message ? e.message : String(e));
        setStatus("오류");
      } finally {
        setBusy(false);
      }
    }

    return (
      <div className="min-h-[calc(100vh-130px)] bg-slate-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 md:px-4">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <p className="text-sm font-semibold text-teal-700">Web-R 2.0</p>
              <h1 className="text-3xl font-bold text-slate-950 sm:text-2xl">PubMed wordcloud</h1>
            </div>
            <span className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">{status}</span>
          </div>

          <div className="grid grid-cols-[360px_minmax(0,1fr)] gap-5 lg:grid-cols-1">
            <aside className="space-y-4 rounded border border-slate-200 bg-white p-4">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="pubmed-query">검색어</label>
              <textarea
                id="pubmed-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
                className="w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600"
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold text-slate-700">
                  논문 수
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={retmax}
                    onChange={(e) => setRetmax(e.target.value)}
                    className="mt-1 w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  상위 단어
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(e.target.value)}
                    className="mt-1 w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600"
                  />
                </label>
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={runSearch}
                className="w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:bg-slate-400"
              >
                {busy ? "실행 중" : "검색"}
              </button>

              {error ? (
                <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
              ) : null}

              <div className="max-h-[360px] overflow-auto border-t border-slate-200 pt-3">
                <h2 className="mb-2 text-sm font-semibold text-slate-700">논문</h2>
                {articles.length === 0 ? (
                  <p className="text-sm text-slate-500">아직 검색 결과가 없습니다.</p>
                ) : (
                  <ol className="space-y-2 text-sm text-slate-600">
                    {articles.slice(0, 12).map((article, index) => (
                      <li key={`${article.title}-${index}`} className="leading-5">{index + 1}. {article.title}</li>
                    ))}
                  </ol>
                )}
              </div>
            </aside>

            <main className="space-y-4">
              <section className="rounded border border-slate-200 bg-white p-4">
                <canvas ref={canvasRef} className="h-[420px] w-full rounded bg-slate-50"></canvas>
              </section>

              <section className="rounded border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-700">단어 빈도</h2>
                  <span className="text-xs text-slate-500">{words.length.toLocaleString("ko-KR")}개</span>
                </div>
                <div className="grid grid-cols-5 gap-2 md:grid-cols-3 sm:grid-cols-2">
                  {words.slice(0, 25).map((item) => (
                    <div key={item.word} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2 text-sm">
                      <span className="truncate font-medium text-slate-800">{item.word}</span>
                      <span className="ml-2 text-slate-500">{item.freq}</span>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }

  ReactDOM.render(<PubMedWordcloudApp />, document.getElementById("div_main"));
}
