function cpWaitForWebR(timeoutMs = 6e4) {
  if (window.WebR)
    return Promise.resolve(window.WebR);
  if (!window.__webrImportPromise)
    window.__webrImportPromise = import("https://webr.r-wasm.org/v0.4.3/webr.mjs").then((m) => window.WebR = m.WebR);
  return Promise.race([window.__webrImportPromise, new Promise((_, reject) => setTimeout(() => reject(new Error("WebR runtime load timeout")), timeoutMs))]);
}
function cpEsc(x) {
  return '"' + String(x || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"';
}
function cpOut(r) {
  return Array.isArray(r && r.output) ? r.output.filter((x) => x && (x.type === "stdout" || x.type === "stderr")).map((x) => x.data || "").join("\n") : String(r && r.stdout || "") + String(r && r.stderr || "");
}
const CP_SAMPLE = `"X","M","W","Y"
2.1,3.2,1.0,5.2
1.7,2.9,0.4,4.1
3.0,4.0,1.5,6.7
2.8,3.7,1.2,6.2
1.2,2.2,-0.5,3.1
3.4,4.3,1.7,7.1
2.5,3.1,0.8,5.4
1.9,2.4,-0.2,3.8
3.8,4.8,2.0,7.8
2.2,3.3,0.6,5.1
1.5,2.1,-0.8,3.0
3.1,4.1,1.3,6.8`;
function cpBuildCode(csvText, model, xCol, mCol, yCol, wCol, boots) {
  return `
raw <- read.csv(text=${cpEsc(csvText)}, stringsAsFactors=FALSE, check.names=FALSE)
names(raw) <- trimws(names(raw))
model <- ${cpEsc(model)}
xcol <- ${cpEsc(xCol)}; mcol <- ${cpEsc(mCol)}; ycol <- ${cpEsc(yCol)}; wcol <- ${cpEsc(wCol)}
B <- as.integer(${Number(boots) || 200})
need <- c(xcol, ycol, if(model != "moderation") mcol else NULL, if(model != "mediation") wcol else NULL)
missing <- need[!(need %in% names(raw))]
if (length(missing) > 0) stop(paste("\uD544\uC218 \uCEEC\uB7FC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4:", paste(missing, collapse=", ")))
df <- raw[, unique(need), drop=FALSE]
for (nm in names(df)) df[[nm]] <- suppressWarnings(as.numeric(df[[nm]]))
df <- df[complete.cases(df), , drop=FALSE]
if (nrow(df) < 6) stop("\uC644\uC804\uD55C \uB370\uC774\uD130\uAC00 6\uD589 \uC774\uC0C1 \uD544\uC694\uD569\uB2C8\uB2E4.")
line <- function(...) cat(paste(..., sep="\\t"), "\\n", sep="")
fmt <- function(x) ifelse(is.finite(x), sprintf("%.10g", x), "NA")
coef_line <- function(fit, prefix) {
  sm <- summary(fit)$coefficients
  for (rn in rownames(sm)) line("COEF", prefix, rn, fmt(sm[rn,1]), fmt(sm[rn,2]), fmt(sm[rn,3]), fmt(sm[rn,4]))
}
if (model == "mediation") {
  fitM <- lm(as.formula(paste(mcol, "~", xcol)), data=df)
  fitY <- lm(as.formula(paste(ycol, "~", xcol, "+", mcol)), data=df)
  a <- coef(fitM)[[xcol]]; b <- coef(fitY)[[mcol]]; cprime <- coef(fitY)[[xcol]]
  inds <- replicate(B, {
    idx <- sample(seq_len(nrow(df)), replace=TRUE)
    d <- df[idx,,drop=FALSE]
    coef(lm(as.formula(paste(mcol, "~", xcol)), data=d))[[xcol]] * coef(lm(as.formula(paste(ycol, "~", xcol, "+", mcol)), data=d))[[mcol]]
  })
  line("META", model, nrow(df)); line("INDIRECT", fmt(a*b), fmt(quantile(inds,.025,na.rm=TRUE)), fmt(quantile(inds,.975,na.rm=TRUE)), fmt(cprime))
  coef_line(fitM, "M"); coef_line(fitY, "Y")
} else if (model == "moderation") {
  df$XW <- df[[xcol]] * df[[wcol]]
  fit <- lm(as.formula(paste(ycol, "~", xcol, "+", wcol, "+ XW")), data=df)
  line("META", model, nrow(df)); coef_line(fit, "Y")
  wvals <- mean(df[[wcol]]) + c(-1,0,1) * sd(df[[wcol]])
  b <- coef(fit)
  for (wv in wvals) line("SLOPE", fmt(wv), fmt(b[[xcol]] + b[["XW"]] * wv))
} else {
  df$XW <- df[[xcol]] * df[[wcol]]
  fitM <- lm(as.formula(paste(mcol, "~", xcol, "+", wcol, "+ XW")), data=df)
  fitY <- lm(as.formula(paste(ycol, "~", xcol, "+", mcol, "+", wcol)), data=df)
  b <- coef(fitY)[[mcol]]
  wvals <- mean(df[[wcol]]) + c(-1,0,1) * sd(df[[wcol]])
  line("META", model, nrow(df)); coef_line(fitM, "M"); coef_line(fitY, "Y")
  cm <- coef(fitM)
  for (wv in wvals) line("COND", fmt(wv), fmt((cm[[xcol]] + cm[["XW"]] * wv) * b))
}
`;
}
function cpNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function cpParse(out) {
  const r = { meta: {}, coefs: [], indirect: null, slopes: [], conds: [] };
  String(out || "").split(/\n+/).forEach((line) => {
    const p = line.trim().split(/\t/);
    if (p[0] === "META")
      r.meta = { model: p[1], n: cpNum(p[2]) };
    if (p[0] === "COEF")
      r.coefs.push({ eq: p[1], term: p[2], estimate: cpNum(p[3]), se: cpNum(p[4]), t: cpNum(p[5]), p: cpNum(p[6]) });
    if (p[0] === "INDIRECT")
      r.indirect = { estimate: cpNum(p[1]), lcl: cpNum(p[2]), ucl: cpNum(p[3]), direct: cpNum(p[4]) };
    if (p[0] === "SLOPE")
      r.slopes.push({ w: cpNum(p[1]), slope: cpNum(p[2]) });
    if (p[0] === "COND")
      r.conds.push({ w: cpNum(p[1]), effect: cpNum(p[2]) });
  });
  if (!r.meta.model)
    throw new Error("\uC870\uAC74\uBD80 \uACFC\uC815 \uBD84\uC11D \uACB0\uACFC\uB97C \uD574\uC11D\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  return r;
}
function cpFmt(x, d = 3) {
  return Number.isFinite(x) ? x.toFixed(d) : "-";
}
function set_main() {
  function App() {
    const webrRef = React.useRef(null);
    const [model, setModel] = React.useState("mediation"), [csvText, setCsvText] = React.useState(CP_SAMPLE), [x, setX] = React.useState("X"), [m, setM] = React.useState("M"), [y, setY] = React.useState("Y"), [w, setW] = React.useState("W"), [boots, setBoots] = React.useState(200), [status, setStatus] = React.useState("\uB300\uAE30 \uC911"), [busy, setBusy] = React.useState(false), [error, setError] = React.useState(""), [result, setResult] = React.useState(null);
    async function ensureWebR() {
      if (webrRef.current)
        return webrRef.current;
      setStatus("WebAssembly R runtime \uB85C\uB529 \uC911");
      const C = await cpWaitForWebR();
      const wr = new C({ defaultPackages: ["base", "stats", "utils"], RArgs: ["--quiet"] });
      await wr.init();
      webrRef.current = wr;
      return wr;
    }
    async function run() {
      setBusy(true);
      setError("");
      try {
        const wr = await ensureWebR();
        setStatus("R\uC5D0\uC11C \uC870\uAC74\uBD80 \uACFC\uC815 \uBD84\uC11D \uC911");
        const shelter = await new wr.Shelter();
        const cap = await shelter.captureR(cpBuildCode(csvText, model, x, m, y, w, boots), { withAutoprint: false, captureStreams: true, captureGraphics: false });
        const output = cpOut(cap);
        try {
          shelter.purge();
        } catch (e) {
        }
        if (/^Error/i.test(output.trim()))
          throw new Error(output.trim());
        setResult(cpParse(output));
        setStatus("\uC644\uB8CC");
      } catch (e) {
        setError(e && e.message ? e.message : String(e));
        setStatus("\uC624\uB958");
      } finally {
        setBusy(false);
      }
    }
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-[calc(100vh-130px)] bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 md:px-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-start justify-between gap-3" }, /*  */ React.createElement(Div_page_header, { title: "\uC870\uAC74\uBD80 \uACFC\uC815 \uBD84\uC11D" }), /*  */ React.createElement("span", { className: "rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600" }, status)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-[380px_minmax(0,1fr)] gap-5 lg:grid-cols-1" }, /* @__PURE__ */ React.createElement("aside", { className: "space-y-4 rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("select", { value: model, onChange: (e) => setModel(e.target.value), className: "w-full rounded border-slate-300 text-sm" }, /* @__PURE__ */ React.createElement("option", { value: "mediation" }, "\uB2E8\uC21C \uB9E4\uAC1C"), /* @__PURE__ */ React.createElement("option", { value: "moderation" }, "\uC870\uC808"), /* @__PURE__ */ React.createElement("option", { value: "moderated-mediation" }, "\uC870\uC808\uB41C \uB9E4\uAC1C")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-4 gap-2" }, /* @__PURE__ */ React.createElement("input", { value: x, onChange: (e) => setX(e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { value: m, onChange: (e) => setM(e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { value: y, onChange: (e) => setY(e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { value: w, onChange: (e) => setW(e.target.value), className: "rounded border-slate-300 text-sm" })), /* @__PURE__ */ React.createElement("input", { type: "number", value: boots, onChange: (e) => setBoots(e.target.value), className: "w-full rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("textarea", { value: csvText, onChange: (e) => setCsvText(e.target.value), rows: 14, spellCheck: "false", className: "w-full rounded border-slate-300 font-mono text-xs leading-5" }), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: busy, onClick: run, className: "w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-400" }, busy ? "\uBD84\uC11D \uC911" : "\uBD84\uC11D \uC2E4\uD589"), error ? /* @__PURE__ */ React.createElement("div", { className: "whitespace-pre-wrap rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" }, error) : null), /* @__PURE__ */ React.createElement("main", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("section", { className: "rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-sm font-semibold text-slate-700" }, "\uACB0\uACFC"), result ? /* @__PURE__ */ React.createElement("div", { className: "mt-3 space-y-3" }, result.indirect ? /* @__PURE__ */ React.createElement("div", { className: "rounded border border-slate-200 p-3 text-sm" }, "Indirect: ", /* @__PURE__ */ React.createElement("b", null, cpFmt(result.indirect.estimate)), " (", cpFmt(result.indirect.lcl), "-", cpFmt(result.indirect.ucl), "), Direct: ", cpFmt(result.indirect.direct)) : null, result.slopes.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "rounded border border-slate-200 p-3 text-sm" }, "W=", cpFmt(s.w), " slope=", cpFmt(s.slope))), result.conds.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "rounded border border-slate-200 p-3 text-sm" }, "W=", cpFmt(s.w), " conditional indirect=", cpFmt(s.effect))), /* @__PURE__ */ React.createElement("div", { className: "overflow-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full min-w-[620px] text-left text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "border-b" }, /* @__PURE__ */ React.createElement("th", null, "Eq"), /* @__PURE__ */ React.createElement("th", null, "Term"), /* @__PURE__ */ React.createElement("th", null, "Coef"), /* @__PURE__ */ React.createElement("th", null, "SE"), /* @__PURE__ */ React.createElement("th", null, "p"))), /* @__PURE__ */ React.createElement("tbody", null, result.coefs.map((c, i) => /* @__PURE__ */ React.createElement("tr", { key: i, className: "border-b border-slate-100" }, /* @__PURE__ */ React.createElement("td", null, c.eq), /* @__PURE__ */ React.createElement("td", null, c.term), /* @__PURE__ */ React.createElement("td", null, cpFmt(c.estimate)), /* @__PURE__ */ React.createElement("td", null, cpFmt(c.se)), /* @__PURE__ */ React.createElement("td", null, cpFmt(c.p, 4)))))))) : /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-sm text-slate-500" }, "\uC544\uC9C1 \uBD84\uC11D \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."))))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(App, null), document.getElementById("div_main"));
}
