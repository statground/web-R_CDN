function survWaitForWebR(timeoutMs = 6e4) {
  if (window.WebR)
    return Promise.resolve(window.WebR);
  if (!window.__webrImportPromise) {
    window.__webrImportPromise = import("https://webr.r-wasm.org/v0.4.3/webr.mjs").then((module) => {
      window.WebR = module.WebR;
      return module.WebR;
    });
  }
  return Promise.race([
    window.__webrImportPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("WebR runtime load timeout")), timeoutMs))
  ]);
}
function survEscape(value) {
  return '"' + String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"';
}
function survOutput(result) {
  if (!result)
    return "";
  if (Array.isArray(result.output))
    return result.output.filter((x) => x && (x.type === "stdout" || x.type === "stderr")).map((x) => x.data || "").join("\n");
  return String(result.stdout || "") + String(result.stderr || "");
}
const SURV_SAMPLE = `"time","status","group","treat","age","marker"
6,1,"Control",0,68,5.1
8,1,"Control",0,61,4.8
10,0,"Control",0,59,4.2
12,1,"Control",0,72,5.9
15,1,"Control",0,65,5.4
18,0,"Control",0,57,3.8
20,1,"Control",0,70,6.1
9,1,"Treatment",1,69,5.6
14,0,"Treatment",1,62,4.7
16,1,"Treatment",1,60,4.5
22,0,"Treatment",1,73,6.0
24,1,"Treatment",1,66,5.2
28,0,"Treatment",1,58,3.9
32,0,"Treatment",1,71,5.8`;
function survBuildCode(csvText, timeCol, statusCol, groupCol, treatCol, covarsText) {
  return `
raw <- read.csv(text = ${survEscape(csvText)}, stringsAsFactors = FALSE, check.names = FALSE)
names(raw) <- trimws(names(raw))
time_col <- ${survEscape(timeCol)}
status_col <- ${survEscape(statusCol)}
group_col <- ${survEscape(groupCol)}
treat_col <- ${survEscape(treatCol)}
covars <- trimws(strsplit(${survEscape(covarsText)}, ",")[[1]])
covars <- covars[covars != ""]
need <- c(time_col, status_col, group_col, treat_col, covars)
missing <- need[!(need %in% names(raw))]
if (length(missing) > 0) stop(paste("\uD544\uC218 \uCEEC\uB7FC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4:", paste(missing, collapse = ", ")))
time <- suppressWarnings(as.numeric(raw[[time_col]]))
status <- suppressWarnings(as.numeric(raw[[status_col]]))
group <- as.character(raw[[group_col]])
valid <- is.finite(time) & is.finite(status) & !is.na(group)
raw <- raw[valid, , drop = FALSE]
time <- time[valid]; status <- status[valid]; group <- group[valid]
line <- function(...) cat(paste(..., sep = "\\t"), "\\n", sep = "")
fmt <- function(x) ifelse(is.finite(x), sprintf("%.10g", x), "NA")

km_one <- function(t, e) {
  event_times <- sort(unique(t[e == 1]))
  surv <- 1
  out <- data.frame(time = 0, surv = 1, n_risk = length(t), events = 0)
  for (tt in event_times) {
    n_risk <- sum(t >= tt)
    d <- sum(t == tt & e == 1)
    surv <- surv * (1 - d / n_risk)
    out <- rbind(out, data.frame(time = tt, surv = surv, n_risk = n_risk, events = d))
  }
  out
}
for (g in unique(group)) {
  idx <- group == g
  km <- km_one(time[idx], status[idx])
  line("GROUP", g, sum(idx), sum(status[idx] == 1), fmt(median(time[idx])))
  for (i in seq_len(nrow(km))) line("KM", g, fmt(km$time[i]), fmt(km$surv[i]), fmt(km$n_risk[i]), fmt(km$events[i]))
}

if (length(unique(group)) == 2) {
  g1 <- unique(group)[1]
  event_times <- sort(unique(time[status == 1]))
  oe <- 0; vv <- 0
  for (tt in event_times) {
    risk <- time >= tt
    d <- sum(time == tt & status == 1)
    n <- sum(risk)
    n1 <- sum(risk & group == g1)
    d1 <- sum(time == tt & status == 1 & group == g1)
    exp1 <- d * n1 / n
    var1 <- if (n > 1) n1 * (n - n1) * d * (n - d) / (n^2 * (n - 1)) else 0
    oe <- oe + d1 - exp1
    vv <- vv + var1
  }
  chisq <- if (vv > 0) oe^2 / vv else NA_real_
  p <- if (is.finite(chisq)) pchisq(chisq, df = 1, lower.tail = FALSE) else NA_real_
  line("LOGRANK", fmt(chisq), fmt(p))
}

if (treat_col %in% names(raw) && length(covars) > 0) {
  treat <- suppressWarnings(as.numeric(raw[[treat_col]]))
  df <- raw[, c(treat_col, covars), drop = FALSE]
  names(df)[1] <- "treat"
  for (nm in covars) df[[nm]] <- suppressWarnings(as.numeric(df[[nm]]))
  complete <- complete.cases(df)
  df <- df[complete, , drop = FALSE]
  if (nrow(df) > 2 && length(unique(df$treat)) == 2) {
    fit <- glm(treat ~ ., data = df, family = binomial())
    ps <- as.numeric(predict(fit, type = "response"))
    tr <- df$treat == 1
    used <- rep(FALSE, sum(!tr))
    controls <- which(!tr)
    pairs <- data.frame(ti = integer(), ci = integer(), dist = numeric())
    for (ti in which(tr)) {
      avail <- controls[!used]
      if (length(avail) == 0) break
      ci <- avail[which.min(abs(ps[avail] - ps[ti]))]
      used[match(ci, controls)] <- TRUE
      pairs <- rbind(pairs, data.frame(ti = ti, ci = ci, dist = abs(ps[ci] - ps[ti])))
    }
    line("PSM", nrow(df), sum(tr), sum(!tr), nrow(pairs), fmt(mean(ps[tr])), fmt(mean(ps[!tr])))
    smd <- function(x, z) {
      m1 <- mean(x[z == 1], na.rm = TRUE); m0 <- mean(x[z == 0], na.rm = TRUE)
      s <- sqrt((var(x[z == 1], na.rm = TRUE) + var(x[z == 0], na.rm = TRUE)) / 2)
      ifelse(is.finite(s) && s > 0, (m1 - m0) / s, NA_real_)
    }
    for (nm in covars) {
      before <- smd(df[[nm]], df$treat)
      after <- NA_real_
      if (nrow(pairs) > 0) {
        matched_x <- c(df[[nm]][pairs$ti], df[[nm]][pairs$ci])
        matched_t <- c(rep(1, nrow(pairs)), rep(0, nrow(pairs)))
        after <- smd(matched_x, matched_t)
      }
      line("BAL", nm, fmt(before), fmt(after))
    }
  }
}
`;
}
function survNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function survParse(output) {
  const result = { groups: [], km: [], logrank: null, psm: null, balance: [] };
  String(output || "").split(/\n+/).forEach((line) => {
    const p = line.trim().split(/\t/);
    if (p[0] === "GROUP")
      result.groups.push({ group: p[1], n: survNum(p[2]), events: survNum(p[3]), median: survNum(p[4]) });
    if (p[0] === "KM")
      result.km.push({ group: p[1], time: survNum(p[2]), survival: survNum(p[3]), risk: survNum(p[4]), events: survNum(p[5]) });
    if (p[0] === "LOGRANK")
      result.logrank = { chisq: survNum(p[1]), p: survNum(p[2]) };
    if (p[0] === "PSM")
      result.psm = { n: survNum(p[1]), treated: survNum(p[2]), control: survNum(p[3]), matched: survNum(p[4]), psTreated: survNum(p[5]), psControl: survNum(p[6]) };
    if (p[0] === "BAL")
      result.balance.push({ covar: p[1], before: survNum(p[2]), after: survNum(p[3]) });
  });
  if (result.km.length === 0)
    throw new Error("\uC0DD\uC874\uBD84\uC11D \uACB0\uACFC\uB97C \uD574\uC11D\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  return result;
}
function survFmt(x, d = 3) {
  return Number.isFinite(x) ? x.toFixed(d) : "-";
}
function survDraw(canvas, result) {
  if (!canvas)
    return;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(320, rect.width || 760), h = Math.max(320, rect.height || 460), r = window.devicePixelRatio || 1;
  canvas.width = Math.floor(w * r);
  canvas.height = Math.floor(h * r);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(r, 0, 0, r, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  const left = 58, right = 24, top = 28, bottom = 52, pw = w - left - right, ph = h - top - bottom;
  const maxTime = result ? Math.max(...result.km.map((x) => x.time || 0), 1) : 1;
  const xFor = (x) => left + x / maxTime * pw, yFor = (y) => top + (1 - y) * ph;
  ctx.strokeStyle = "#cbd5e1";
  ctx.strokeRect(left, top, pw, ph);
  ctx.fillStyle = "#475569";
  ctx.font = "500 12px Noto Sans KR, sans-serif";
  ctx.textAlign = "center";
  [0, 0.25, 0.5, 0.75, 1].forEach((tick) => {
    ctx.fillText(tick.toFixed(2), left - 10, yFor(tick) + 4);
  });
  ctx.fillText("Time", left + pw / 2, h - 8);
  if (!result) {
    ctx.fillText("\uBD84\uC11D\uC744 \uC2E4\uD589\uD558\uBA74 Kaplan-Meier curve\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4.", w / 2, h / 2);
    return;
  }
  const colors = ["#0f766e", "#1d4ed8", "#be123c", "#7c3aed"];
  result.groups.forEach((g, i) => {
    const pts = result.km.filter((x) => x.group === g.group).sort((a, b) => a.time - b.time);
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 3;
    ctx.beginPath();
    pts.forEach((p, j) => {
      const x = xFor(p.time), y = yFor(p.survival);
      if (j === 0)
        ctx.moveTo(x, y);
      else
        ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillText(g.group, left + 70 + i * 130, top + 18);
  });
}
function set_main() {
  function SurvivalPSMApp() {
    const canvasRef = React.useRef(null), webrRef = React.useRef(null);
    const [csvText, setCsvText] = React.useState(SURV_SAMPLE);
    const [timeCol, setTimeCol] = React.useState("time"), [statusCol, setStatusCol] = React.useState("status"), [groupCol, setGroupCol] = React.useState("group");
    const [treatCol, setTreatCol] = React.useState("treat"), [covars, setCovars] = React.useState("age,marker");
    const [status, setStatus] = React.useState("\uB300\uAE30 \uC911"), [busy, setBusy] = React.useState(false), [error, setError] = React.useState(""), [result, setResult] = React.useState(null);
    React.useEffect(() => {
      survDraw(canvasRef.current, result);
      const redraw = () => survDraw(canvasRef.current, result);
      window.addEventListener("resize", redraw);
      return () => window.removeEventListener("resize", redraw);
    }, [result]);
    async function ensureWebR() {
      if (webrRef.current)
        return webrRef.current;
      setStatus("WebAssembly R runtime \uB85C\uB529 \uC911");
      const C = await survWaitForWebR();
      const w = new C({ defaultPackages: ["base", "stats", "utils"], RArgs: ["--quiet"] });
      await w.init();
      webrRef.current = w;
      return w;
    }
    async function runAnalysis() {
      setBusy(true);
      setError("");
      try {
        const webr = await ensureWebR();
        setStatus("R\uC5D0\uC11C \uC0DD\uC874\uBD84\uC11D\uACFC PSM \uACC4\uC0B0 \uC911");
        const shelter = await new webr.Shelter();
        const captured = await shelter.captureR(survBuildCode(csvText, timeCol, statusCol, groupCol, treatCol, covars), { withAutoprint: false, captureStreams: true, captureGraphics: false });
        const output = survOutput(captured);
        try {
          shelter.purge();
        } catch (e) {
        }
        if (/^Error/i.test(output.trim()))
          throw new Error(output.trim());
        const parsed = survParse(output);
        setResult(parsed);
        setStatus(`\uC644\uB8CC: \uAD70 ${parsed.groups.length}\uAC1C`);
      } catch (e) {
        setError(e && e.message ? e.message : String(e));
        setStatus("\uC624\uB958");
      } finally {
        setBusy(false);
      }
    }
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-[calc(100vh-130px)] bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-start justify-between gap-3" }, /*  */ React.createElement(Div_page_header, { title: "\uC0DD\uC874\uBD84\uC11D\uACFC PSM" }), /*  */ React.createElement("span", { className: "rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600" }, status)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-[380px_minmax(0,1fr)]" }, /* @__PURE__ */ React.createElement("aside", { className: "space-y-4 rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-3" }, /* @__PURE__ */ React.createElement("input", { value: timeCol, onChange: (e) => setTimeCol(e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { value: statusCol, onChange: (e) => setStatusCol(e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { value: groupCol, onChange: (e) => setGroupCol(e.target.value), className: "rounded border-slate-300 text-sm" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2" }, /* @__PURE__ */ React.createElement("input", { value: treatCol, onChange: (e) => setTreatCol(e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { value: covars, onChange: (e) => setCovars(e.target.value), className: "rounded border-slate-300 text-sm" })), /* @__PURE__ */ React.createElement("textarea", { value: csvText, onChange: (e) => setCsvText(e.target.value), rows: 14, spellCheck: "false", className: "w-full rounded border-slate-300 font-mono text-xs leading-5" }), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: busy, onClick: runAnalysis, className: "w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-400" }, busy ? "\uBD84\uC11D \uC911" : "\uBD84\uC11D \uC2E4\uD589"), error ? /* @__PURE__ */ React.createElement("div", { className: "whitespace-pre-wrap rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" }, error) : null), /* @__PURE__ */ React.createElement("main", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("section", { className: "rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, className: "h-[460px] w-full rounded bg-white" })), /* @__PURE__ */ React.createElement("section", { className: "rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-sm font-semibold text-slate-700" }, "\uACB0\uACFC"), result ? /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-1 gap-3 md:grid-cols-2" }, /* @__PURE__ */ React.createElement("div", { className: "rounded border border-slate-200 p-3 text-sm" }, "Log-rank p: ", /* @__PURE__ */ React.createElement("b", null, result.logrank ? survFmt(result.logrank.p, 4) : "-")), /* @__PURE__ */ React.createElement("div", { className: "rounded border border-slate-200 p-3 text-sm" }, "Matched pairs: ", /* @__PURE__ */ React.createElement("b", null, result.psm ? result.psm.matched : "-")), result.balance.map((x) => /* @__PURE__ */ React.createElement("div", { key: x.covar, className: "rounded border border-slate-200 p-3 text-sm" }, x.covar, ": SMD ", survFmt(x.before), " \u2192 ", survFmt(x.after)))) : /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-sm text-slate-500" }, "\uC544\uC9C1 \uBD84\uC11D \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."))))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(SurvivalPSMApp, null), document.getElementById("div_main"));
}
