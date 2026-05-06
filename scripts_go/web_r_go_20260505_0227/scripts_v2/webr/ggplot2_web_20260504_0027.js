function ggWaitForWebR(timeoutMs = 6e4) {
  if (window.WebR)
    return Promise.resolve(window.WebR);
  if (!window.__webrImportPromise)
    window.__webrImportPromise = import("https://webr.r-wasm.org/v0.4.3/webr.mjs").then((m) => window.WebR = m.WebR);
  return Promise.race([window.__webrImportPromise, new Promise((_, r) => setTimeout(() => r(new Error("WebR runtime load timeout")), timeoutMs))]);
}
function ggEsc(x) {
  return '"' + String(x || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"';
}
function ggOut(r) {
  return Array.isArray(r && r.output) ? r.output.filter((x) => x && (x.type === "stdout" || x.type === "stderr")).map((x) => x.data || "").join("\n") : String(r && r.stdout || "") + String(r && r.stderr || "");
}
const GG_SAMPLE = `"x","y","group"
1,3.2,"A"
2,3.9,"A"
3,5.1,"A"
4,6.0,"A"
5,6.8,"A"
1,2.4,"B"
2,2.9,"B"
3,3.7,"B"
4,4.5,"B"
5,5.2,"B"`;
function ggBuild(csv, xcol, ycol, gcol) {
  return `
raw<-read.csv(text=${ggEsc(csv)},stringsAsFactors=FALSE,check.names=FALSE);names(raw)<-trimws(names(raw))
xcol<-${ggEsc(xcol)};ycol<-${ggEsc(ycol)};gcol<-${ggEsc(gcol)}
need<-c(xcol,ycol,if(gcol!="")gcol else NULL);missing<-need[!(need%in%names(raw))];if(length(missing)>0)stop(paste("\uD544\uC218 \uCEEC\uB7FC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4:",paste(missing,collapse=", ")))
x<-suppressWarnings(as.numeric(raw[[xcol]]));y<-suppressWarnings(as.numeric(raw[[ycol]]));g<-if(gcol!=""&&gcol%in%names(raw))as.character(raw[[gcol]])else rep("All",nrow(raw))
ok<-is.finite(x)&is.finite(y)&!is.na(g);x<-x[ok];y<-y[ok];g<-g[ok]
line<-function(...)cat(paste(...,sep="\\t"),"\\n",sep="");fmt<-function(v)ifelse(is.finite(v),sprintf("%.10g",v),"NA")
line("META",length(x),fmt(min(x)),fmt(max(x)),fmt(min(y)),fmt(max(y)))
for(i in seq_along(x))line("POINT",fmt(x[i]),fmt(y[i]),g[i])
for(gg in unique(g))line("GROUP",gg,length(x[g==gg]),fmt(mean(y[g==gg])),fmt(sd(y[g==gg])))
`;
}
function ggNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function ggParse(o) {
  const r = { meta: {}, points: [], groups: [] };
  String(o || "").split(/\n+/).forEach((line) => {
    const p = line.trim().split(/\t/);
    if (p[0] === "META")
      r.meta = { n: ggNum(p[1]), xmin: ggNum(p[2]), xmax: ggNum(p[3]), ymin: ggNum(p[4]), ymax: ggNum(p[5]) };
    if (p[0] === "POINT")
      r.points.push({ x: ggNum(p[1]), y: ggNum(p[2]), g: p[3] || "All" });
    if (p[0] === "GROUP")
      r.groups.push({ g: p[1], n: ggNum(p[2]), mean: ggNum(p[3]), sd: ggNum(p[4]) });
  });
  if (!r.points.length)
    throw new Error("\uADF8\uB9BC \uB370\uC774\uD130\uB97C \uD574\uC11D\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  return r;
}
function ggDraw(canvas, r, type) {
  if (!canvas)
    return;
  const rect = canvas.getBoundingClientRect(), w = Math.max(320, rect.width || 760), h = Math.max(320, rect.height || 460), ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(w * ratio);
  canvas.height = Math.floor(h * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  const left = 56, right = 24, top = 28, bottom = 48, pw = w - left - right, ph = h - top - bottom;
  ctx.strokeStyle = "#cbd5e1";
  ctx.strokeRect(left, top, pw, ph);
  ctx.fillStyle = "#64748b";
  ctx.font = "500 13px Noto Sans KR, sans-serif";
  ctx.textAlign = "center";
  if (!r) {
    ctx.fillText("\uBD84\uC11D\uC744 \uC2E4\uD589\uD558\uBA74 \uADF8\uB798\uD504\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4.", w / 2, h / 2);
    return;
  }
  const colors = ["#0f766e", "#1d4ed8", "#be123c", "#7c3aed"];
  const xMin = r.meta.xmin, xMax = r.meta.xmax, yMin = Math.min(0, r.meta.ymin), yMax = r.meta.ymax;
  const xFor = (x) => left + (x - xMin) / (xMax - xMin || 1) * pw, yFor = (y) => top + (1 - (y - yMin) / (yMax - yMin || 1)) * ph;
  if (type === "bar") {
    r.groups.forEach((g, i) => {
      const bw = pw / r.groups.length * 0.6, x = left + (i + 0.2) * pw / r.groups.length, y = yFor(g.mean);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(x, y, bw, top + ph - y);
      ctx.fillStyle = "#0f172a";
      ctx.fillText(g.g, x + bw / 2, h - 18);
      ctx.fillText(g.mean.toFixed(2), x + bw / 2, y - 6);
    });
  } else {
    r.points.forEach((p) => {
      const gi = r.groups.findIndex((g) => g.g === p.g);
      ctx.fillStyle = colors[(gi < 0 ? 0 : gi) % colors.length];
      ctx.beginPath();
      ctx.arc(xFor(p.x), yFor(p.y), type === "box" ? 5 : 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.fillStyle = "#0f172a";
  ctx.fillText(type === "bar" ? "Bar plot" : "Scatter plot", left + pw / 2, top + 18);
}
function set_main() {
  function App() {
    const canvasRef = React.useRef(null), webrRef = React.useRef(null);
    const [csv, setCsv] = React.useState(GG_SAMPLE), [x, setX] = React.useState("x"), [y, setY] = React.useState("y"), [g, setG] = React.useState("group"), [type, setType] = React.useState("scatter"), [status, setStatus] = React.useState("\uB300\uAE30 \uC911"), [busy, setBusy] = React.useState(false), [error, setError] = React.useState(""), [result, setResult] = React.useState(null);
    React.useEffect(() => {
      ggDraw(canvasRef.current, result, type);
      const redraw = () => ggDraw(canvasRef.current, result, type);
      window.addEventListener("resize", redraw);
      return () => window.removeEventListener("resize", redraw);
    }, [result, type]);
    async function ensure() {
      if (webrRef.current)
        return webrRef.current;
      setStatus("WebAssembly R runtime \uB85C\uB529 \uC911");
      const C = await ggWaitForWebR();
      const wr = new C({ defaultPackages: ["base", "stats", "utils"], RArgs: ["--quiet"] });
      await wr.init();
      webrRef.current = wr;
      return wr;
    }
    async function run() {
      setBusy(true);
      setError("");
      try {
        const wr = await ensure();
        setStatus("R\uC5D0\uC11C \uB370\uC774\uD130 \uC694\uC57D \uC911");
        const sh = await new wr.Shelter();
        const cap = await sh.captureR(ggBuild(csv, x, y, g), { withAutoprint: false, captureStreams: true, captureGraphics: false });
        const output = ggOut(cap);
        try {
          sh.purge();
        } catch (e) {
        }
        if (/^Error/i.test(output.trim()))
          throw new Error(output.trim());
        setResult(ggParse(output));
        setStatus("\uC644\uB8CC");
      } catch (e) {
        setError(e && e.message ? e.message : String(e));
        setStatus("\uC624\uB958");
      } finally {
        setBusy(false);
      }
    }
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-[calc(100vh-130px)] bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 md:px-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-start justify-between gap-3" }, /*  */ React.createElement(Div_page_header, { title: "\uC6F9\uC5D0\uC11C \uD558\uB294 ggplot2" }), /*  */ React.createElement("span", { className: "rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600" }, status)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-[380px_minmax(0,1fr)] gap-5 lg:grid-cols-1" }, /* @__PURE__ */ React.createElement("aside", { className: "space-y-4 rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("select", { value: type, onChange: (e) => setType(e.target.value), className: "w-full rounded border-slate-300 text-sm" }, /* @__PURE__ */ React.createElement("option", { value: "scatter" }, "\uC0B0\uC810\uB3C4"), /* @__PURE__ */ React.createElement("option", { value: "bar" }, "\uB9C9\uB300\uADF8\uB798\uD504"), /* @__PURE__ */ React.createElement("option", { value: "box" }, "\uC810 \uADF8\uB798\uD504")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2" }, /* @__PURE__ */ React.createElement("input", { value: x, onChange: (e) => setX(e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { value: y, onChange: (e) => setY(e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { value: g, onChange: (e) => setG(e.target.value), className: "rounded border-slate-300 text-sm" })), /* @__PURE__ */ React.createElement("textarea", { value: csv, onChange: (e) => setCsv(e.target.value), rows: 14, spellCheck: "false", className: "w-full rounded border-slate-300 font-mono text-xs leading-5" }), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: busy, onClick: run, className: "w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-400" }, busy ? "\uC2E4\uD589 \uC911" : "\uADF8\uB798\uD504 \uADF8\uB9AC\uAE30"), error ? /* @__PURE__ */ React.createElement("div", { className: "whitespace-pre-wrap rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" }, error) : null), /* @__PURE__ */ React.createElement("main", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("section", { className: "rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, className: "h-[460px] w-full rounded bg-white" }))))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(App, null), document.getElementById("div_main"));
}
