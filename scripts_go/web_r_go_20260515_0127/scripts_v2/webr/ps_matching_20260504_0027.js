function psmWaitForWebR(timeoutMs = 6e4) {
  if (window.WebR)
    return Promise.resolve(window.WebR);
  if (!window.__webrImportPromise) {
    window.__webrImportPromise = import("https://webr.r-wasm.org/v0.4.3/webr.mjs").then((module) => {
      window.WebR = module.WebR;
      return module.WebR;
    });
  }
  return Promise.race([window.__webrImportPromise, new Promise((_, reject) => setTimeout(() => reject(new Error("WebR runtime load timeout")), timeoutMs))]);
}
function psmEscape(value) {
  return '"' + String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"';
}
function psmOutput(result) {
  return Array.isArray(result && result.output) ? result.output.filter((x) => x && (x.type === "stdout" || x.type === "stderr")).map((x) => x.data || "").join("\n") : String(result && result.stdout || "") + String(result && result.stderr || "");
}
const PSM_SAMPLE = `"treat","age","educ","race","re74","re75","re78"
1,37,11,1,0,0,9930
1,22,9,0,0,0,3595
1,30,12,1,0,0,24909
1,27,11,0,0,0,7506
1,33,8,1,0,0,289
0,39,12,1,19785,6608,499
0,20,12,0,8644,11688,0
0,31,9,1,0,0,5340
0,24,10,0,0,0,0
0,35,8,1,13732,17976,1659
0,29,12,0,1462,0,3672
0,28,11,1,0,0,0`;
function psmBuildCode(csvText, treatCol, outcomeCol, covarsText) {
  return `
raw <- read.csv(text=${psmEscape(csvText)}, stringsAsFactors=FALSE, check.names=FALSE)
names(raw) <- trimws(names(raw))
treat_col <- ${psmEscape(treatCol)}
outcome_col <- ${psmEscape(outcomeCol)}
covars <- trimws(strsplit(${psmEscape(covarsText)}, ",")[[1]])
covars <- covars[covars != ""]
need <- c(treat_col, outcome_col, covars)
missing <- need[!(need %in% names(raw))]
if (length(missing) > 0) stop(paste("\uD544\uC218 \uCEEC\uB7FC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4:", paste(missing, collapse=", ")))
df <- raw[, need, drop=FALSE]
names(df)[1:2] <- c("treat", "outcome")
for (nm in names(df)) df[[nm]] <- suppressWarnings(as.numeric(df[[nm]]))
df <- df[complete.cases(df), , drop=FALSE]
if (nrow(df) < 4 || length(unique(df$treat)) != 2) stop("\uCC98\uB9AC\uAD70\uACFC \uB300\uC870\uAD70\uC774 \uD3EC\uD568\uB41C \uC644\uC804\uD55C \uB370\uC774\uD130\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.")
fit <- glm(treat ~ ., data=df[, c("treat", covars), drop=FALSE], family=binomial())
ps <- as.numeric(predict(fit, type="response"))
tr <- df$treat == 1
controls <- which(!tr)
used <- rep(FALSE, length(controls))
pairs <- data.frame(ti=integer(), ci=integer(), dist=numeric())
for (ti in which(tr)) {
  avail <- controls[!used]
  if (length(avail) == 0) break
  ci <- avail[which.min(abs(ps[avail] - ps[ti]))]
  used[match(ci, controls)] <- TRUE
  pairs <- rbind(pairs, data.frame(ti=ti, ci=ci, dist=abs(ps[ci] - ps[ti])))
}
smd <- function(x, z) {
  s <- sqrt((var(x[z==1], na.rm=TRUE) + var(x[z==0], na.rm=TRUE))/2)
  ifelse(is.finite(s) && s > 0, (mean(x[z==1], na.rm=TRUE) - mean(x[z==0], na.rm=TRUE))/s, NA_real_)
}
fmt <- function(x) ifelse(is.finite(x), sprintf("%.10g", x), "NA")
line <- function(...) cat(paste(..., sep="\\t"), "\\n", sep="")
line("META", nrow(df), sum(tr), sum(!tr), nrow(pairs), fmt(mean(ps[tr])), fmt(mean(ps[!tr])))
if (nrow(pairs) > 0) {
  effect_before <- mean(df$outcome[tr]) - mean(df$outcome[!tr])
  effect_after <- mean(df$outcome[pairs$ti]) - mean(df$outcome[pairs$ci])
  line("EFFECT", fmt(effect_before), fmt(effect_after), fmt(mean(pairs$dist)))
}
for (nm in covars) {
  before <- smd(df[[nm]], df$treat)
  after <- NA_real_
  if (nrow(pairs) > 0) after <- smd(c(df[[nm]][pairs$ti], df[[nm]][pairs$ci]), c(rep(1, nrow(pairs)), rep(0, nrow(pairs))))
  line("BAL", nm, fmt(before), fmt(after))
}
for (i in seq_along(ps)) line("PS", df$treat[i], fmt(ps[i]), fmt(df$outcome[i]))
`;
}
function psmNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function psmParse(output) {
  const result = { meta: {}, effect: {}, balance: [], scores: [] };
  String(output || "").split(/\n+/).forEach((line) => {
    const p = line.trim().split(/\t/);
    if (p[0] === "META")
      result.meta = { n: psmNum(p[1]), treated: psmNum(p[2]), control: psmNum(p[3]), matched: psmNum(p[4]), psTreated: psmNum(p[5]), psControl: psmNum(p[6]) };
    if (p[0] === "EFFECT")
      result.effect = { before: psmNum(p[1]), after: psmNum(p[2]), distance: psmNum(p[3]) };
    if (p[0] === "BAL")
      result.balance.push({ covar: p[1], before: psmNum(p[2]), after: psmNum(p[3]) });
    if (p[0] === "PS")
      result.scores.push({ treat: psmNum(p[1]), ps: psmNum(p[2]), outcome: psmNum(p[3]) });
  });
  if (!result.meta.n)
    throw new Error("PSM \uACB0\uACFC\uB97C \uD574\uC11D\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  return result;
}
function psmFmt(x, d = 3) {
  return Number.isFinite(x) ? x.toFixed(d) : "-";
}
function psmDraw(canvas, result) {
  if (!canvas)
    return;
  const rect = canvas.getBoundingClientRect(), w = Math.max(320, rect.width || 760), h = Math.max(280, rect.height || 380), r = window.devicePixelRatio || 1;
  canvas.width = Math.floor(w * r);
  canvas.height = Math.floor(h * r);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(r, 0, 0, r, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#64748b";
  ctx.font = "500 13px Noto Sans KR, sans-serif";
  ctx.textAlign = "center";
  if (!result) {
    ctx.fillText("\uBD84\uC11D\uC744 \uC2E4\uD589\uD558\uBA74 propensity score \uBD84\uD3EC\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4.", w / 2, h / 2);
    return;
  }
  const left = 50, right = 20, top = 30, bottom = 42, pw = w - left - right, ph = h - top - bottom;
  ctx.strokeStyle = "#cbd5e1";
  ctx.strokeRect(left, top, pw, ph);
  result.scores.forEach((s, i) => {
    if (!Number.isFinite(s.ps))
      return;
    const x = left + s.ps * pw;
    const y = top + ph - i % 18 / 18 * ph;
    ctx.fillStyle = s.treat === 1 ? "#be123c" : "#0f766e";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#0f172a";
  ctx.fillText("Propensity score", left + pw / 2, h - 10);
}
function set_main() {
  function PSMApp() {
    const canvasRef = React.useRef(null), webrRef = React.useRef(null);
    const [csvText, setCsvText] = React.useState(PSM_SAMPLE), [treatCol, setTreatCol] = React.useState("treat"), [outcomeCol, setOutcomeCol] = React.useState("re78"), [covars, setCovars] = React.useState("age,educ,race,re74,re75");
    const [status, setStatus] = React.useState("\uB300\uAE30 \uC911"), [busy, setBusy] = React.useState(false), [error, setError] = React.useState(""), [result, setResult] = React.useState(null);
    React.useEffect(() => {
      psmDraw(canvasRef.current, result);
      const redraw = () => psmDraw(canvasRef.current, result);
      window.addEventListener("resize", redraw);
      return () => window.removeEventListener("resize", redraw);
    }, [result]);
    async function ensureWebR() {
      if (webrRef.current)
        return webrRef.current;
      setStatus("WebAssembly R runtime \uB85C\uB529 \uC911");
      const C = await psmWaitForWebR();
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
        setStatus("R\uC5D0\uC11C PSM \uACC4\uC0B0 \uC911");
        const shelter = await new webr.Shelter();
        const captured = await shelter.captureR(psmBuildCode(csvText, treatCol, outcomeCol, covars), { withAutoprint: false, captureStreams: true, captureGraphics: false });
        const output = psmOutput(captured);
        try {
          shelter.purge();
        } catch (e) {
        }
        if (/^Error/i.test(output.trim()))
          throw new Error(output.trim());
        const parsed = psmParse(output);
        setResult(parsed);
        setStatus(`\uC644\uB8CC: \uB9E4\uCE6D ${parsed.meta.matched}\uC30D`);
      } catch (e) {
        setError(e && e.message ? e.message : String(e));
        setStatus("\uC624\uB958");
      } finally {
        setBusy(false);
      }
    }
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-[calc(100vh-130px)] bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-start justify-between gap-3" }, /*  */ React.createElement(Div_page_header, { title: "Propensity Score Matching" }), /*  */ React.createElement("span", { className: "rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600" }, status)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-[380px_minmax(0,1fr)]" }, /* @__PURE__ */ React.createElement("aside", { className: "space-y-4 rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2" }, /* @__PURE__ */ React.createElement("input", { value: treatCol, onChange: (e) => setTreatCol(e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { value: outcomeCol, onChange: (e) => setOutcomeCol(e.target.value), className: "rounded border-slate-300 text-sm" })), /* @__PURE__ */ React.createElement("input", { value: covars, onChange: (e) => setCovars(e.target.value), className: "w-full rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("textarea", { value: csvText, onChange: (e) => setCsvText(e.target.value), rows: 14, spellCheck: "false", className: "w-full rounded border-slate-300 font-mono text-xs leading-5" }), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: busy, onClick: runAnalysis, className: "w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-400" }, busy ? "\uBD84\uC11D \uC911" : "\uBD84\uC11D \uC2E4\uD589"), error ? /* @__PURE__ */ React.createElement("div", { className: "whitespace-pre-wrap rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" }, error) : null), /* @__PURE__ */ React.createElement("main", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("section", { className: "rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, className: "h-[380px] w-full rounded bg-white" })), /* @__PURE__ */ React.createElement("section", { className: "rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-sm font-semibold text-slate-700" }, "\uACB0\uACFC"), result ? /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-1 gap-3 md:grid-cols-2" }, /* @__PURE__ */ React.createElement("div", { className: "rounded border border-slate-200 p-3 text-sm" }, "ATT: ", psmFmt(result.effect.before), " \u2192 ", /* @__PURE__ */ React.createElement("b", null, psmFmt(result.effect.after))), /* @__PURE__ */ React.createElement("div", { className: "rounded border border-slate-200 p-3 text-sm" }, "Mean distance: ", psmFmt(result.effect.distance)), result.balance.map((x) => /* @__PURE__ */ React.createElement("div", { key: x.covar, className: "rounded border border-slate-200 p-3 text-sm" }, x.covar, ": ", psmFmt(x.before), " \u2192 ", psmFmt(x.after)))) : /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-sm text-slate-500" }, "\uC544\uC9C1 \uBD84\uC11D \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."))))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(PSMApp, null), document.getElementById("div_main"));
}
