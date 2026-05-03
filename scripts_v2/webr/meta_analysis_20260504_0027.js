function metaWaitForWebR(timeoutMs = 60000) {
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

function metaEscapeRString(value) {
  return '"' + String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n") + '"';
}

function metaCaptureOutput(result) {
  if (!result) return "";
  if (Array.isArray(result.output)) {
    return result.output
      .filter((item) => item && (item.type === "stdout" || item.type === "stderr"))
      .map((item) => item.data || "")
      .join("\n");
  }
  return String(result.stdout || "") + String(result.stderr || "");
}

const META_SAMPLES = {
  continuous: {
    label: "연속형 예제",
    type: "continuous",
    measure: "MD",
    csv: `"study","m1","s1","n1","m2","s2","n2","group"
"study_01",110,20,100,102,21,100,"2_weeks"
"study_02",112,21,50,104,18,50,"2_weeks"
"study_03",120,18,90,112,19,90,"2_weeks"
"study_04",104,24,300,100,24,300,"2_weeks"
"study_05",125,19,20,110,16,20,"4_weeks"
"study_06",118,22,200,112,19,200,"4_weeks"
"study_07",114,19,400,100,22,400,"4_weeks"
"study_08",104,20,50,92,24,50,"6_weeks"
"study_09",122,24,100,102,18,100,"6_weeks"
"study_10",118,18,100,100,20,100,"6_weeks"`,
  },
  binary: {
    label: "이분형 예제",
    type: "binary",
    measure: "OR",
    csv: `"study","a","b","n1","c","d","n2"
"study_1",16,49,65,12,53,65
"study_2",10,30,40,8,32,40
"study_3",19,61,80,14,66,80
"study_4",80,320,400,25,375,400
"study_5",11,29,40,8,32,40
"study_6",18,47,65,16,49,65`,
  },
  effect: {
    label: "효과크기 예제",
    type: "effect",
    measure: "GENERIC",
    csv: `"study","yi","lower","upper","vi"
"study_29",0.231,0.0348,0.4274,0.01
"study_25",-0.03,-0.25,0.1891,0.0125
"study_22",-0.236,-0.4846,0.0132,0.0161
"study_34",0.166,-0.1031,0.4341,0.0188
"study_37",0.182,-0.1109,0.4756,0.0224
"study_14",0.501,0.1478,0.8538,0.0324
"study_35",0.372,0.0153,0.7278,0.033
"study_21",0.058,-0.3016,0.4182,0.0337
"study_15",0.174,-0.1993,0.5472,0.0363
"study_32",0.148,-0.2255,0.5223,0.0364`,
  },
};

function metaMeasureOptions(dataType) {
  if (dataType === "continuous") {
    return [
      { value: "MD", label: "Mean Difference" },
      { value: "SMD", label: "Standardized Mean Difference" },
    ];
  }
  if (dataType === "binary") {
    return [
      { value: "OR", label: "Odds Ratio" },
      { value: "RR", label: "Risk Ratio" },
    ];
  }
  return [{ value: "GENERIC", label: "Effect Size" }];
}

function metaBuildRCode(csvText, dataType, measure) {
  return `
csv_text <- ${metaEscapeRString(csvText)}
data_type <- ${metaEscapeRString(dataType)}
measure <- ${metaEscapeRString(measure)}
raw <- read.csv(text = csv_text, stringsAsFactors = FALSE, check.names = FALSE)
names(raw) <- trimws(names(raw))
if (nrow(raw) == 0) stop("분석할 데이터가 없습니다.")

pick <- function(name) {
  if (!(name %in% names(raw))) return(rep(NA_real_, nrow(raw)))
  suppressWarnings(as.numeric(raw[[name]]))
}
require_cols <- function(cols) {
  missing <- cols[!(cols %in% names(raw))]
  if (length(missing) > 0) stop(paste("필수 컬럼이 없습니다:", paste(missing, collapse = ", ")))
}
all_missing <- function(x) all(!is.finite(x))
fmt <- function(x) {
  ifelse(is.finite(x), sprintf("%.10g", x), "NA")
}
line <- function(...) {
  cat(paste(..., sep = "\\t"), "\\n", sep = "")
}
clean_study <- function(x) {
  gsub("[\\t\\r\\n]+", " ", as.character(x))
}

study <- if ("study" %in% names(raw)) clean_study(raw[["study"]]) else paste0("study_", seq_len(nrow(raw)))
scale <- "linear"
reference <- 0
label <- measure

if (data_type == "continuous") {
  require_cols(c("m1", "s1", "n1", "m2", "s2", "n2"))
  m1 <- pick("m1"); s1 <- pick("s1"); n1 <- pick("n1")
  m2 <- pick("m2"); s2 <- pick("s2"); n2 <- pick("n2")
  if (measure == "SMD") {
    sd_pooled <- sqrt(((n1 - 1) * s1^2 + (n2 - 1) * s2^2) / pmax(n1 + n2 - 2, 1))
    d <- (m1 - m2) / sd_pooled
    j <- 1 - 3 / pmax(4 * (n1 + n2) - 9, 1)
    yi <- j * d
    vi <- (n1 + n2) / (n1 * n2) + yi^2 / pmax(2 * (n1 + n2 - 2), 1)
    label <- "SMD"
  } else {
    yi <- m1 - m2
    vi <- s1^2 / n1 + s2^2 / n2
    label <- "MD"
  }
} else if (data_type == "binary") {
  require_cols(c("a", "c"))
  a0 <- pick("a")
  c0 <- pick("c")
  n1raw <- if ("n1" %in% names(raw)) pick("n1") else a0 + pick("b")
  n2raw <- if ("n2" %in% names(raw)) pick("n2") else c0 + pick("d")
  b0 <- n1raw - a0
  d0 <- n2raw - c0
  needs_correction <- a0 <= 0 | b0 <= 0 | c0 <= 0 | d0 <= 0
  a <- ifelse(needs_correction, a0 + 0.5, a0)
  b <- ifelse(needs_correction, b0 + 0.5, b0)
  c <- ifelse(needs_correction, c0 + 0.5, c0)
  d <- ifelse(needs_correction, d0 + 0.5, d0)
  n1 <- a + b
  n2 <- c + d
  if (measure == "RR") {
    yi <- log((a / n1) / (c / n2))
    vi <- 1 / a - 1 / n1 + 1 / c - 1 / n2
    label <- "RR"
  } else {
    yi <- log((a / b) / (c / d))
    vi <- 1 / a + 1 / b + 1 / c + 1 / d
    label <- "OR"
  }
  scale <- "ratio"
  reference <- 1
} else {
  require_cols(c("yi"))
  yi <- pick("yi")
  vi <- if ("vi" %in% names(raw)) pick("vi") else rep(NA_real_, nrow(raw))
  if (all_missing(vi) && "se" %in% names(raw)) {
    vi <- pick("se")^2
  }
  if (all_missing(vi) && all(c("lower", "upper") %in% names(raw))) {
    vi <- ((pick("upper") - pick("lower")) / (2 * 1.96))^2
  }
  label <- "Effect"
}

valid <- is.finite(yi) & is.finite(vi) & vi > 0
study <- study[valid]
yi <- yi[valid]
vi <- vi[valid]
k <- length(yi)
if (k < 2) stop("유효한 연구가 2개 이상 필요합니다.")
sei <- sqrt(vi)

summarize_model <- function(weights) {
  estimate <- sum(weights * yi) / sum(weights)
  se <- sqrt(1 / sum(weights))
  lcl <- estimate - 1.96 * se
  ucl <- estimate + 1.96 * se
  z <- estimate / se
  p <- 2 * pnorm(abs(z), lower.tail = FALSE)
  c(estimate = estimate, se = se, lcl = lcl, ucl = ucl, z = z, p = p)
}

w_fixed <- 1 / vi
fixed <- summarize_model(w_fixed)
q <- sum(w_fixed * (yi - fixed[["estimate"]])^2)
df <- k - 1
c_value <- sum(w_fixed) - sum(w_fixed^2) / sum(w_fixed)
tau2 <- if (is.finite(c_value) && c_value > 0) max(0, (q - df) / c_value) else 0
i2 <- if (is.finite(q) && q > 0) max(0, (q - df) / q) * 100 else 0
q_p <- if (df > 0) pchisq(q, df = df, lower.tail = FALSE) else NA_real_
w_random <- 1 / (vi + tau2)
random <- summarize_model(w_random)

transform_value <- function(x) {
  if (scale == "ratio") exp(x) else x
}

line("META", data_type, label, scale, fmt(reference), fmt(k))
line("HET", fmt(q), fmt(df), fmt(q_p), fmt(tau2), fmt(i2))
line("SUMMARY", "fixed", fmt(transform_value(fixed[["estimate"]])), fmt(transform_value(fixed[["lcl"]])), fmt(transform_value(fixed[["ucl"]])), fmt(fixed[["se"]]), fmt(fixed[["z"]]), fmt(fixed[["p"]]))
line("SUMMARY", "random", fmt(transform_value(random[["estimate"]])), fmt(transform_value(random[["lcl"]])), fmt(transform_value(random[["ucl"]])), fmt(random[["se"]]), fmt(random[["z"]]), fmt(random[["p"]]))

fixed_pct <- 100 * w_fixed / sum(w_fixed)
random_pct <- 100 * w_random / sum(w_random)
for (i in seq_len(k)) {
  line(
    "STUDY",
    study[[i]],
    fmt(transform_value(yi[[i]])),
    fmt(transform_value(yi[[i]] - 1.96 * sei[[i]])),
    fmt(transform_value(yi[[i]] + 1.96 * sei[[i]])),
    fmt(sei[[i]]),
    fmt(fixed_pct[[i]]),
    fmt(random_pct[[i]])
  )
}
`;
}

function metaNumber(value) {
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

function metaParseOutput(output) {
  const result = {
    dataType: "",
    measure: "",
    scale: "linear",
    reference: 0,
    k: 0,
    heterogeneity: {},
    summaries: {},
    studies: [],
  };

  String(output || "").split(/\n+/).forEach((line) => {
    const parts = line.trim().split(/\t/);
    if (parts.length === 0) return;
    if (parts[0] === "META") {
      result.dataType = parts[1] || "";
      result.measure = parts[2] || "";
      result.scale = parts[3] || "linear";
      result.reference = metaNumber(parts[4]);
      result.k = metaNumber(parts[5]) || 0;
    } else if (parts[0] === "HET") {
      result.heterogeneity = {
        q: metaNumber(parts[1]),
        df: metaNumber(parts[2]),
        p: metaNumber(parts[3]),
        tau2: metaNumber(parts[4]),
        i2: metaNumber(parts[5]),
      };
    } else if (parts[0] === "SUMMARY") {
      result.summaries[parts[1]] = {
        model: parts[1],
        estimate: metaNumber(parts[2]),
        lcl: metaNumber(parts[3]),
        ucl: metaNumber(parts[4]),
        se: metaNumber(parts[5]),
        z: metaNumber(parts[6]),
        p: metaNumber(parts[7]),
      };
    } else if (parts[0] === "STUDY") {
      result.studies.push({
        study: parts[1] || "",
        estimate: metaNumber(parts[2]),
        lcl: metaNumber(parts[3]),
        ucl: metaNumber(parts[4]),
        se: metaNumber(parts[5]),
        fixedWeight: metaNumber(parts[6]),
        randomWeight: metaNumber(parts[7]),
      });
    }
  });

  if (result.studies.length === 0 || !result.summaries.fixed) {
    throw new Error("분석 결과를 해석하지 못했습니다.");
  }
  return result;
}

function metaFormat(value, digits = 3) {
  if (!Number.isFinite(value)) return "-";
  if (Math.abs(value) >= 100) return value.toFixed(1);
  if (Math.abs(value) >= 10) return value.toFixed(2);
  return value.toFixed(digits);
}

function metaDrawForest(canvas, result, model) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width || 900);
  const height = Math.max(420, rect.height || 520);
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  if (!result) {
    ctx.fillStyle = "#64748b";
    ctx.font = "500 15px Noto Sans KR, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("분석을 실행하면 forest plot이 표시됩니다.", width / 2, height / 2);
    return;
  }

  const summary = result.summaries[model] || result.summaries.random || result.summaries.fixed;
  const studies = result.studies.slice(0, 28);
  const left = width < 640 ? 118 : 178;
  const right = width < 640 ? 26 : 48;
  const top = 46;
  const bottom = 52;
  const rowHeight = Math.max(18, Math.min(28, (height - top - bottom) / (studies.length + 2)));
  const values = studies.flatMap((item) => [item.lcl, item.ucl]).concat([summary.lcl, summary.ucl, result.reference])
    .filter((value) => Number.isFinite(value) && value > 0 || result.scale !== "ratio" && Number.isFinite(value));
  const toScale = (value) => result.scale === "ratio" ? Math.log(value) : value;
  let min = Math.min.apply(null, values.map(toScale));
  let max = Math.max.apply(null, values.map(toScale));
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    min = (result.scale === "ratio" ? Math.log(0.5) : -1);
    max = (result.scale === "ratio" ? Math.log(2) : 1);
  }
  const pad = (max - min) * 0.08;
  min -= pad;
  max += pad;
  const xFor = (value) => left + ((toScale(value) - min) / (max - min)) * (width - left - right);
  const yAxis = height - bottom + 12;

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(left, yAxis);
  ctx.lineTo(width - right, yAxis);
  ctx.stroke();

  const reference = Number.isFinite(result.reference) ? result.reference : (result.scale === "ratio" ? 1 : 0);
  if (Number.isFinite(reference) && (result.scale !== "ratio" || reference > 0)) {
    const xRef = xFor(reference);
    ctx.strokeStyle = "#94a3b8";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xRef, top - 18);
    ctx.lineTo(xRef, yAxis);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.fillStyle = "#0f172a";
  ctx.font = "700 13px Noto Sans KR, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Study", 10, 24);
  ctx.textAlign = "center";
  ctx.fillText(`${result.measure} (95% CI)`, left + (width - left - right) / 2, 24);

  studies.forEach((item, index) => {
    const y = top + index * rowHeight;
    const weight = model === "fixed" ? item.fixedWeight : item.randomWeight;
    const pointSize = Math.max(4, Math.min(12, 4 + Math.sqrt(Math.max(weight || 0, 0))));

    ctx.fillStyle = "#334155";
    ctx.font = "500 12px Noto Sans KR, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(item.study, 10, y + 4, left - 18);

    if (Number.isFinite(item.lcl) && Number.isFinite(item.ucl) && Number.isFinite(item.estimate)) {
      const x1 = xFor(item.lcl);
      const x2 = xFor(item.ucl);
      const xp = xFor(item.estimate);
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
      ctx.fillStyle = "#0f766e";
      ctx.fillRect(xp - pointSize / 2, y - pointSize / 2, pointSize, pointSize);
    }
  });

  const summaryY = top + studies.length * rowHeight + rowHeight * 0.7;
  if (Number.isFinite(summary.lcl) && Number.isFinite(summary.ucl) && Number.isFinite(summary.estimate)) {
    const xl = xFor(summary.lcl);
    const xu = xFor(summary.ucl);
    const xe = xFor(summary.estimate);
    ctx.fillStyle = "#be123c";
    ctx.beginPath();
    ctx.moveTo(xl, summaryY);
    ctx.lineTo(xe, summaryY - 8);
    ctx.lineTo(xu, summaryY);
    ctx.lineTo(xe, summaryY + 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 12px Noto Sans KR, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(model === "fixed" ? "Fixed" : "Random", 10, summaryY + 4, left - 18);
  }

  const axisValues = [Math.exp(min), reference, Math.exp(max)];
  const linearAxisValues = [min, reference, max];
  const labels = result.scale === "ratio" ? axisValues : linearAxisValues;
  ctx.fillStyle = "#475569";
  ctx.font = "500 11px Noto Sans KR, sans-serif";
  ctx.textAlign = "center";
  labels.forEach((value) => {
    if (!Number.isFinite(value) || (result.scale === "ratio" && value <= 0)) return;
    const x = xFor(value);
    ctx.beginPath();
    ctx.moveTo(x, yAxis - 4);
    ctx.lineTo(x, yAxis + 4);
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();
    ctx.fillText(metaFormat(value, 2), x, yAxis + 20);
  });
}

function set_main() {
  function MetaAnalysisApp() {
    const canvasRef = React.useRef(null);
    const webrRef = React.useRef(null);
    const [sampleKey, setSampleKey] = React.useState("continuous");
    const [dataType, setDataType] = React.useState(META_SAMPLES.continuous.type);
    const [measure, setMeasure] = React.useState(META_SAMPLES.continuous.measure);
    const [csvText, setCsvText] = React.useState(META_SAMPLES.continuous.csv);
    const [model, setModel] = React.useState("random");
    const [status, setStatus] = React.useState("대기 중");
    const [busy, setBusy] = React.useState(false);
    const [error, setError] = React.useState("");
    const [result, setResult] = React.useState(null);

    React.useEffect(() => {
      metaDrawForest(canvasRef.current, result, model);
      const redraw = () => metaDrawForest(canvasRef.current, result, model);
      window.addEventListener("resize", redraw);
      return () => window.removeEventListener("resize", redraw);
    }, [result, model]);

    async function ensureWebR() {
      if (webrRef.current) return webrRef.current;
      setStatus("WebAssembly R runtime 로딩 중");
      const WebRClass = await metaWaitForWebR();
      const webr = new WebRClass({
        defaultPackages: ["base", "stats", "utils"],
        RArgs: ["--quiet"],
      });
      await webr.init();
      webrRef.current = webr;
      return webr;
    }

    function applySample(nextKey) {
      const sample = META_SAMPLES[nextKey];
      setSampleKey(nextKey);
      setDataType(sample.type);
      setMeasure(sample.measure);
      setCsvText(sample.csv);
      setResult(null);
      setError("");
      setStatus("대기 중");
    }

    function changeDataType(nextType) {
      setDataType(nextType);
      const nextMeasure = metaMeasureOptions(nextType)[0].value;
      setMeasure(nextMeasure);
    }

    async function runAnalysis() {
      setBusy(true);
      setError("");
      try {
        const webr = await ensureWebR();
        setStatus("R에서 메타분석 계산 중");
        const shelter = await new webr.Shelter();
        const captured = await shelter.captureR(
          metaBuildRCode(csvText, dataType, measure),
          { withAutoprint: false, captureStreams: true, captureGraphics: false }
        );
        const output = metaCaptureOutput(captured);
        try { shelter.purge(); } catch (e) {}
        if (/^Error/i.test(output.trim())) throw new Error(output.trim());
        const parsed = metaParseOutput(output);
        setResult(parsed);
        setStatus(`완료: 연구 ${parsed.studies.length.toLocaleString("ko-KR")}개`);
      } catch (e) {
        setError(e && e.message ? e.message : String(e));
        setStatus("오류");
      } finally {
        setBusy(false);
      }
    }

    const selectedSummary = result ? (result.summaries[model] || result.summaries.random || result.summaries.fixed) : null;
    const measureOptions = metaMeasureOptions(dataType);

    return (
      <div className="min-h-[calc(100vh-130px)] bg-slate-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 md:px-4">
          <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <a href="/webr/2.0/" className="text-sm font-semibold text-teal-700 hover:text-teal-800">Web-R 2.0</a>
              <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-2xl">메타분석</h1>
            </div>
            <span className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">{status}</span>
          </header>

          <div className="grid grid-cols-[380px_minmax(0,1fr)] gap-5 lg:grid-cols-1">
            <aside className="space-y-4 rounded border border-slate-200 bg-white p-4">
              <label className="block text-sm font-semibold text-slate-700">
                예제 데이터
                <select
                  value={sampleKey}
                  onChange={(e) => applySample(e.target.value)}
                  className="mt-1 w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600"
                >
                  {Object.keys(META_SAMPLES).map((key) => (
                    <option key={key} value={key}>{META_SAMPLES[key].label}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold text-slate-700">
                  데이터 유형
                  <select
                    value={dataType}
                    onChange={(e) => changeDataType(e.target.value)}
                    className="mt-1 w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600"
                  >
                    <option value="continuous">연속형</option>
                    <option value="binary">이분형</option>
                    <option value="effect">효과크기</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  효과척도
                  <select
                    value={measure}
                    onChange={(e) => setMeasure(e.target.value)}
                    className="mt-1 w-full rounded border-slate-300 text-sm focus:border-teal-600 focus:ring-teal-600"
                  >
                    {measureOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                CSV 데이터
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  rows={13}
                  spellCheck="false"
                  className="mt-1 w-full rounded border-slate-300 font-mono text-xs leading-5 focus:border-teal-600 focus:ring-teal-600"
                />
              </label>

              <button
                type="button"
                disabled={busy}
                onClick={runAnalysis}
                className="w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:bg-slate-400"
              >
                {busy ? "분석 중" : "분석 실행"}
              </button>

              {error ? (
                <div className="whitespace-pre-wrap rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
              ) : null}
            </aside>

            <main className="space-y-4">
              <section className="rounded border border-slate-200 bg-white p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700">Forest plot</h2>
                    {result ? (
                      <p className="mt-1 text-xs text-slate-500">
                        Q={metaFormat(result.heterogeneity.q)}, I²={metaFormat(result.heterogeneity.i2, 1)}%, tau²={metaFormat(result.heterogeneity.tau2)}
                      </p>
                    ) : null}
                  </div>
                  <div className="inline-flex overflow-hidden rounded border border-slate-200 text-sm">
                    <button
                      type="button"
                      onClick={() => setModel("fixed")}
                      className={(model === "fixed" ? "bg-teal-700 text-white" : "bg-white text-slate-700 hover:bg-slate-50") + " px-3 py-1"}
                    >
                      Fixed
                    </button>
                    <button
                      type="button"
                      onClick={() => setModel("random")}
                      className={(model === "random" ? "bg-teal-700 text-white" : "bg-white text-slate-700 hover:bg-slate-50") + " border-l border-slate-200 px-3 py-1"}
                    >
                      Random
                    </button>
                  </div>
                </div>
                <canvas ref={canvasRef} className="h-[520px] w-full rounded bg-white"></canvas>
              </section>

              <section className="rounded border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-semibold text-slate-700">요약 결과</h2>
                {selectedSummary ? (
                  <div className="mt-3 grid grid-cols-4 gap-3 md:grid-cols-2">
                    <div className="rounded border border-slate-200 px-3 py-2">
                      <p className="text-xs text-slate-500">Estimate</p>
                      <p className="mt-1 text-lg font-bold text-slate-950">{metaFormat(selectedSummary.estimate)}</p>
                    </div>
                    <div className="rounded border border-slate-200 px-3 py-2">
                      <p className="text-xs text-slate-500">95% CI</p>
                      <p className="mt-1 text-lg font-bold text-slate-950">{metaFormat(selectedSummary.lcl)} - {metaFormat(selectedSummary.ucl)}</p>
                    </div>
                    <div className="rounded border border-slate-200 px-3 py-2">
                      <p className="text-xs text-slate-500">P value</p>
                      <p className="mt-1 text-lg font-bold text-slate-950">{metaFormat(selectedSummary.p, 4)}</p>
                    </div>
                    <div className="rounded border border-slate-200 px-3 py-2">
                      <p className="text-xs text-slate-500">Studies</p>
                      <p className="mt-1 text-lg font-bold text-slate-950">{result.studies.length.toLocaleString("ko-KR")}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">아직 분석 결과가 없습니다.</p>
                )}
              </section>

              {result ? (
                <section className="rounded border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-slate-700">연구별 효과크기</h2>
                    <span className="text-xs text-slate-500">{result.measure}</span>
                  </div>
                  <div className="max-h-[360px] overflow-auto">
                    <table className="w-full min-w-[620px] text-left text-sm">
                      <thead className="border-b border-slate-200 text-xs text-slate-500">
                        <tr>
                          <th className="py-2 pr-3">Study</th>
                          <th className="py-2 pr-3">Estimate</th>
                          <th className="py-2 pr-3">Lower</th>
                          <th className="py-2 pr-3">Upper</th>
                          <th className="py-2 pr-3">Weight</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.studies.map((item) => (
                          <tr key={item.study}>
                            <td className="py-2 pr-3 font-medium text-slate-800">{item.study}</td>
                            <td className="py-2 pr-3 text-slate-600">{metaFormat(item.estimate)}</td>
                            <td className="py-2 pr-3 text-slate-600">{metaFormat(item.lcl)}</td>
                            <td className="py-2 pr-3 text-slate-600">{metaFormat(item.ucl)}</td>
                            <td className="py-2 pr-3 text-slate-600">{metaFormat(model === "fixed" ? item.fixedWeight : item.randomWeight, 1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}
            </main>
          </div>
        </div>
      </div>
    );
  }

  ReactDOM.render(<MetaAnalysisApp />, document.getElementById("div_main"));
}
