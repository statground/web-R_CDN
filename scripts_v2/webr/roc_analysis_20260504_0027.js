function rocWaitForWebR(timeoutMs = 60000) {
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

function rocEscapeRString(value) {
  return '"' + String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n") + '"';
}

function rocCaptureOutput(result) {
  if (!result) return "";
  if (Array.isArray(result.output)) {
    return result.output
      .filter((item) => item && (item.type === "stdout" || item.type === "stderr"))
      .map((item) => item.data || "")
      .join("\n");
  }
  return String(result.stdout || "") + String(result.stderr || "");
}

const ROC_SAMPLE = `"disease","marker","age","sex"
1,0.93,71,"M"
1,0.86,66,"F"
1,0.82,64,"M"
1,0.77,60,"F"
1,0.74,58,"M"
1,0.69,55,"F"
1,0.63,51,"M"
1,0.57,49,"F"
0,0.62,67,"M"
0,0.51,62,"F"
0,0.47,57,"M"
0,0.42,54,"F"
0,0.36,50,"M"
0,0.29,46,"F"
0,0.24,44,"M"
0,0.18,39,"F"`;

function rocBuildCode(csvText, outcomeCol, markerCol, positiveValue, direction) {
  return `
csv_text <- ${rocEscapeRString(csvText)}
outcome_col <- ${rocEscapeRString(outcomeCol)}
marker_col <- ${rocEscapeRString(markerCol)}
positive_value <- ${rocEscapeRString(positiveValue)}
direction <- ${rocEscapeRString(direction)}
raw <- read.csv(text = csv_text, stringsAsFactors = FALSE, check.names = FALSE)
names(raw) <- trimws(names(raw))
if (!(outcome_col %in% names(raw))) stop("결과 컬럼을 찾을 수 없습니다.")
if (!(marker_col %in% names(raw))) stop("표지자 컬럼을 찾을 수 없습니다.")
y_raw <- raw[[outcome_col]]
score <- suppressWarnings(as.numeric(raw[[marker_col]]))
if (positive_value == "") {
  vals <- unique(y_raw[!is.na(y_raw)])
  positive_value <- as.character(vals[length(vals)])
}
y <- as.character(y_raw) == positive_value
valid <- !is.na(y) & is.finite(score)
y <- y[valid]
score <- score[valid]
n_pos <- sum(y)
n_neg <- sum(!y)
if (n_pos < 1 || n_neg < 1) stop("양성/음성 사례가 각각 1개 이상 필요합니다.")

rank_auc <- function(y, score) {
  ranks <- rank(score, ties.method = "average")
  auc <- (sum(ranks[y]) - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg)
  auc
}
auc_higher <- rank_auc(y, score)
flip <- FALSE
if (direction == "lower") {
  flip <- TRUE
} else if (direction == "auto" && auc_higher < 0.5) {
  flip <- TRUE
}
if (flip) score <- -score
auc <- rank_auc(y, score)
q1 <- auc / (2 - auc)
q2 <- 2 * auc^2 / (1 + auc)
se <- sqrt(max(0, (auc * (1 - auc) + (n_pos - 1) * (q1 - auc^2) + (n_neg - 1) * (q2 - auc^2)) / (n_pos * n_neg)))
lcl <- max(0, auc - 1.96 * se)
ucl <- min(1, auc + 1.96 * se)

thresholds <- sort(unique(score), decreasing = TRUE)
calc <- function(th) {
  pred <- score >= th
  tp <- sum(pred & y)
  fp <- sum(pred & !y)
  fn <- sum(!pred & y)
  tn <- sum(!pred & !y)
  sens <- tp / (tp + fn)
  spec <- tn / (tn + fp)
  c(threshold = th, sens = sens, spec = spec, youden = sens + spec - 1, tp = tp, fp = fp, fn = fn, tn = tn)
}
tab <- as.data.frame(t(vapply(thresholds, calc, numeric(8))))
best <- tab[which.max(tab$youden), ]
points <- rbind(
  data.frame(threshold = Inf, sens = 0, spec = 1, youden = 0, tp = 0, fp = 0, fn = n_pos, tn = n_neg),
  tab,
  data.frame(threshold = -Inf, sens = 1, spec = 0, youden = 0, tp = n_pos, fp = n_neg, fn = 0, tn = 0)
)
if (flip) {
  points$threshold <- -points$threshold
  best$threshold <- -best$threshold
}
fmt <- function(x) ifelse(is.finite(x), sprintf("%.10g", x), ifelse(x > 0, "Inf", "-Inf"))
line <- function(...) cat(paste(..., sep = "\\t"), "\\n", sep = "")
line("META", n_pos, n_neg, ifelse(flip, "lower", "higher"))
line("AUC", fmt(auc), fmt(se), fmt(lcl), fmt(ucl))
line("BEST", fmt(best$threshold), fmt(best$sens), fmt(best$spec), fmt(best$youden), fmt(best$tp), fmt(best$fp), fmt(best$fn), fmt(best$tn))
for (i in seq_len(nrow(points))) {
  line("POINT", fmt(points$threshold[i]), fmt(points$sens[i]), fmt(points$spec[i]), fmt(1 - points$spec[i]))
}
`;
}

function rocNumber(value) {
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

function rocParseOutput(output) {
  const result = { meta: {}, auc: {}, best: {}, points: [] };
  String(output || "").split(/\n+/).forEach((line) => {
    const parts = line.trim().split(/\t/);
    if (parts[0] === "META") {
      result.meta = { positive: rocNumber(parts[1]), negative: rocNumber(parts[2]), direction: parts[3] || "" };
    } else if (parts[0] === "AUC") {
      result.auc = { estimate: rocNumber(parts[1]), se: rocNumber(parts[2]), lcl: rocNumber(parts[3]), ucl: rocNumber(parts[4]) };
    } else if (parts[0] === "BEST") {
      result.best = {
        threshold: rocNumber(parts[1]),
        sensitivity: rocNumber(parts[2]),
        specificity: rocNumber(parts[3]),
        youden: rocNumber(parts[4]),
        tp: rocNumber(parts[5]),
        fp: rocNumber(parts[6]),
        fn: rocNumber(parts[7]),
        tn: rocNumber(parts[8]),
      };
    } else if (parts[0] === "POINT") {
      result.points.push({
        threshold: rocNumber(parts[1]),
        sensitivity: rocNumber(parts[2]),
        specificity: rocNumber(parts[3]),
        fpr: rocNumber(parts[4]),
      });
    }
  });
  if (!Number.isFinite(result.auc.estimate) || result.points.length === 0) {
    throw new Error("ROC 분석 결과를 해석하지 못했습니다.");
  }
  return result;
}

function rocFormat(value, digits = 3) {
  if (!Number.isFinite(value)) return "-";
  return value.toFixed(digits);
}

function rocDraw(canvas, result) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width || 760);
  const height = Math.max(320, rect.height || 460);
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const left = 58;
  const right = 24;
  const top = 28;
  const bottom = 52;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const xFor = (fpr) => left + fpr * plotW;
  const yFor = (tpr) => top + (1 - tpr) * plotH;

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  ctx.strokeRect(left, top, plotW, plotH);
  ctx.beginPath();
  ctx.moveTo(xFor(0), yFor(0));
  ctx.lineTo(xFor(1), yFor(1));
  ctx.strokeStyle = "#94a3b8";
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#475569";
  ctx.font = "500 12px Noto Sans KR, sans-serif";
  ctx.textAlign = "center";
  [0, 0.25, 0.5, 0.75, 1].forEach((tick) => {
    const x = xFor(tick);
    const y = yFor(tick);
    ctx.strokeStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, top + plotH);
    ctx.moveTo(left, y);
    ctx.lineTo(left + plotW, y);
    ctx.stroke();
    ctx.fillText(tick.toFixed(2), x, height - 24);
    ctx.textAlign = "right";
    ctx.fillText(tick.toFixed(2), left - 8, y + 4);
    ctx.textAlign = "center";
  });

  if (!result) {
    ctx.fillStyle = "#64748b";
    ctx.font = "500 15px Noto Sans KR, sans-serif";
    ctx.fillText("분석을 실행하면 ROC curve가 표시됩니다.", width / 2, height / 2);
    return;
  }

  const points = result.points.filter((point) => Number.isFinite(point.fpr) && Number.isFinite(point.sensitivity));
  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = xFor(point.fpr);
    const y = yFor(point.sensitivity);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  if (result.best && Number.isFinite(result.best.sensitivity) && Number.isFinite(result.best.specificity)) {
    const x = xFor(1 - result.best.specificity);
    const y = yFor(result.best.sensitivity);
    ctx.fillStyle = "#be123c";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#0f172a";
  ctx.font = "700 13px Noto Sans KR, sans-serif";
  ctx.fillText(`AUC ${rocFormat(result.auc.estimate)} (${rocFormat(result.auc.lcl)}-${rocFormat(result.auc.ucl)})`, left + plotW / 2, top + 18);
  ctx.font = "500 12px Noto Sans KR, sans-serif";
  ctx.fillText("1 - Specificity", left + plotW / 2, height - 5);
  ctx.save();
  ctx.translate(16, top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Sensitivity", 0, 0);
  ctx.restore();
}

function set_main() {
  function ROCAnalysisApp() {
    const canvasRef = React.useRef(null);
    const webrRef = React.useRef(null);
    const [csvText, setCsvText] = React.useState(ROC_SAMPLE);
    const [outcomeCol, setOutcomeCol] = React.useState("disease");
    const [markerCol, setMarkerCol] = React.useState("marker");
    const [positiveValue, setPositiveValue] = React.useState("1");
    const [direction, setDirection] = React.useState("auto");
    const [status, setStatus] = React.useState("대기 중");
    const [busy, setBusy] = React.useState(false);
    const [error, setError] = React.useState("");
    const [result, setResult] = React.useState(null);

    React.useEffect(() => {
      rocDraw(canvasRef.current, result);
      const redraw = () => rocDraw(canvasRef.current, result);
      window.addEventListener("resize", redraw);
      return () => window.removeEventListener("resize", redraw);
    }, [result]);

    async function ensureWebR() {
      if (webrRef.current) return webrRef.current;
      setStatus("WebAssembly R runtime 로딩 중");
      const WebRClass = await rocWaitForWebR();
      const webr = new WebRClass({ defaultPackages: ["base", "stats", "utils"], RArgs: ["--quiet"] });
      await webr.init();
      webrRef.current = webr;
      return webr;
    }

    async function runAnalysis() {
      setBusy(true);
      setError("");
      try {
        const webr = await ensureWebR();
        setStatus("R에서 ROC 계산 중");
        const shelter = await new webr.Shelter();
        const captured = await shelter.captureR(
          rocBuildCode(csvText, outcomeCol, markerCol, positiveValue, direction),
          { withAutoprint: false, captureStreams: true, captureGraphics: false }
        );
        const output = rocCaptureOutput(captured);
        try { shelter.purge(); } catch (e) {}
        if (/^Error/i.test(output.trim())) throw new Error(output.trim());
        const parsed = rocParseOutput(output);
        setResult(parsed);
        setStatus(`완료: 양성 ${parsed.meta.positive}, 음성 ${parsed.meta.negative}`);
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
          <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <a href="/webr/2.0/" className="text-sm font-semibold text-teal-700 hover:text-teal-800">Web-R 2.0</a>
              <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-2xl">ROC 분석</h1>
            </div>
            <span className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">{status}</span>
          </header>

          <div className="grid grid-cols-[380px_minmax(0,1fr)] gap-5 lg:grid-cols-1">
            <aside className="space-y-4 rounded border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold text-slate-700">
                  결과 컬럼
                  <input value={outcomeCol} onChange={(e) => setOutcomeCol(e.target.value)} className="mt-1 w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  점수 컬럼
                  <input value={markerCol} onChange={(e) => setMarkerCol(e.target.value)} className="mt-1 w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold text-slate-700">
                  양성 값
                  <input value={positiveValue} onChange={(e) => setPositiveValue(e.target.value)} className="mt-1 w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  방향
                  <select value={direction} onChange={(e) => setDirection(e.target.value)} className="mt-1 w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600">
                    <option value="auto">자동</option>
                    <option value="higher">높을수록 양성</option>
                    <option value="lower">낮을수록 양성</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-700">
                CSV 데이터
                <textarea value={csvText} onChange={(e) => setCsvText(e.target.value)} rows={14} spellCheck="false" className="mt-1 w-full rounded border-slate-300 font-mono text-xs leading-5 focus:border-teal-600 focus:ring-teal-600" />
              </label>
              <button type="button" disabled={busy} onClick={runAnalysis} className="w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:bg-slate-400">
                {busy ? "분석 중" : "분석 실행"}
              </button>
              {error ? <div className="whitespace-pre-wrap rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
            </aside>

            <main className="space-y-4">
              <section className="rounded border border-slate-200 bg-white p-4">
                <canvas ref={canvasRef} className="h-[460px] w-full rounded bg-white"></canvas>
              </section>
              <section className="rounded border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-semibold text-slate-700">요약 결과</h2>
                {result ? (
                  <div className="mt-3 grid grid-cols-4 gap-3 md:grid-cols-2">
                    <div className="rounded border border-slate-200 px-3 py-2"><p className="text-xs text-slate-500">AUC</p><p className="mt-1 text-lg font-bold text-slate-950">{rocFormat(result.auc.estimate)}</p></div>
                    <div className="rounded border border-slate-200 px-3 py-2"><p className="text-xs text-slate-500">95% CI</p><p className="mt-1 text-lg font-bold text-slate-950">{rocFormat(result.auc.lcl)} - {rocFormat(result.auc.ucl)}</p></div>
                    <div className="rounded border border-slate-200 px-3 py-2"><p className="text-xs text-slate-500">Cutoff</p><p className="mt-1 text-lg font-bold text-slate-950">{rocFormat(result.best.threshold)}</p></div>
                    <div className="rounded border border-slate-200 px-3 py-2"><p className="text-xs text-slate-500">Youden</p><p className="mt-1 text-lg font-bold text-slate-950">{rocFormat(result.best.youden)}</p></div>
                    <div className="rounded border border-slate-200 px-3 py-2"><p className="text-xs text-slate-500">Sensitivity</p><p className="mt-1 text-lg font-bold text-slate-950">{rocFormat(result.best.sensitivity)}</p></div>
                    <div className="rounded border border-slate-200 px-3 py-2"><p className="text-xs text-slate-500">Specificity</p><p className="mt-1 text-lg font-bold text-slate-950">{rocFormat(result.best.specificity)}</p></div>
                    <div className="rounded border border-slate-200 px-3 py-2"><p className="text-xs text-slate-500">Positive</p><p className="mt-1 text-lg font-bold text-slate-950">{result.meta.positive}</p></div>
                    <div className="rounded border border-slate-200 px-3 py-2"><p className="text-xs text-slate-500">Negative</p><p className="mt-1 text-lg font-bold text-slate-950">{result.meta.negative}</p></div>
                  </div>
                ) : <p className="mt-3 text-sm text-slate-500">아직 분석 결과가 없습니다.</p>}
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }

  ReactDOM.render(<ROCAnalysisApp />, document.getElementById("div_main"));
}
