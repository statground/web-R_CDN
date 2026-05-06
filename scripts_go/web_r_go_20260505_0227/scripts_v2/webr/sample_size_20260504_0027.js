function ssWaitForWebR(timeoutMs = 6e4) {
  if (window.WebR)
    return Promise.resolve(window.WebR);
  if (!window.__webrImportPromise)
    window.__webrImportPromise = import("https://webr.r-wasm.org/v0.4.3/webr.mjs").then((m) => window.WebR = m.WebR);
  return Promise.race([window.__webrImportPromise, new Promise((_, r) => setTimeout(() => r(new Error("WebR runtime load timeout")), timeoutMs))]);
}
function ssOut(r) {
  return Array.isArray(r && r.output) ? r.output.filter((x) => x && (x.type === "stdout" || x.type === "stderr")).map((x) => x.data || "").join("\n") : String(r && r.stdout || "") + String(r && r.stderr || "");
}
function ssBuild(test, params) {
  return `
test <- "${test}"
alpha <- ${Number(params.alpha) || 0.05}; power <- ${Number(params.power) || 0.8}; loss <- ${Number(params.loss) || 0}; ratio <- ${Number(params.ratio) || 1}
z_alpha <- qnorm(1-alpha/2); z_beta <- qnorm(power)
if (test == "two-mean") {
  m1 <- ${Number(params.mean1) || 5}; m2 <- ${Number(params.mean2) || 7}; sd <- ${Number(params.sd) || 4}
  d <- abs(m1-m2)
  n2 <- ((1+1/ratio)*(z_alpha+z_beta)^2*sd^2)/(d^2)
  n1 <- ratio*n2
} else if (test == "two-prop") {
  p1 <- ${Number(params.p1) || 0.35}; p2 <- ${Number(params.p2) || 0.55}
  pbar <- (p1+p2)/2
  n2 <- ((z_alpha*sqrt(2*pbar*(1-pbar)) + z_beta*sqrt(p1*(1-p1)+p2*(1-p2)/ratio))^2)/((p1-p2)^2)
  n1 <- ratio*n2
} else {
  mu <- ${Number(params.mu) || 2}; mu0 <- ${Number(params.mu0) || 0}; sd <- ${Number(params.sd) || 4}
  n1 <- ((z_alpha+z_beta)*sd/abs(mu-mu0))^2
  n2 <- NA
}
adj <- function(n) ceiling(n/(1-loss))
cat("RESULT\\t", ceiling(n1), "\\t", ifelse(is.na(n2),"NA",ceiling(n2)), "\\t", adj(n1), "\\t", ifelse(is.na(n2),"NA",adj(n2)), "\\n", sep="")
`;
}
function ssParse(o) {
  const p = String(o || "").trim().split(/\t/);
  if (p[0] !== "RESULT")
    throw new Error("\uC0D8\uD50C \uC218 \uACB0\uACFC\uB97C \uD574\uC11D\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  return { n1: Number(p[1]), n2: p[2] === "NA" ? null : Number(p[2]), adj1: Number(p[3]), adj2: p[4] === "NA" ? null : Number(p[4]) };
}
function set_main() {
  function App() {
    const webrRef = React.useRef(null);
    const [test, setTest] = React.useState("two-mean"), [params, setParams] = React.useState({ mean1: 5, mean2: 10, mu: 2, mu0: 0, sd: 10, p1: 0.35, p2: 0.55, alpha: 0.05, power: 0.8, loss: 0.15, ratio: 1 }), [status, setStatus] = React.useState("\uB300\uAE30 \uC911"), [busy, setBusy] = React.useState(false), [error, setError] = React.useState(""), [result, setResult] = React.useState(null);
    function setP(k, v) {
      setParams({ ...params, [k]: v });
    }
    async function ensure() {
      if (webrRef.current)
        return webrRef.current;
      setStatus("WebAssembly R runtime \uB85C\uB529 \uC911");
      const C = await ssWaitForWebR();
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
        setStatus("R\uC5D0\uC11C \uC0D8\uD50C \uC218 \uACC4\uC0B0 \uC911");
        const sh = await new wr.Shelter();
        const cap = await sh.captureR(ssBuild(test, params), { withAutoprint: false, captureStreams: true, captureGraphics: false });
        const output = ssOut(cap);
        try {
          sh.purge();
        } catch (e) {
        }
        if (/^Error/i.test(output.trim()))
          throw new Error(output.trim());
        setResult(ssParse(output));
        setStatus("\uC644\uB8CC");
      } catch (e) {
        setError(e && e.message ? e.message : String(e));
        setStatus("\uC624\uB958");
      } finally {
        setBusy(false);
      }
    }
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-[calc(100vh-130px)] bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 py-6 md:px-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-start justify-between gap-3" }, /*  */ React.createElement(Div_page_header, { title: "\uC0D8\uD50C \uC218\uC758 \uACC4\uC0B0" }), /*  */ React.createElement("span", { className: "rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600" }, status)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-[360px_minmax(0,1fr)] gap-5 lg:grid-cols-1" }, /* @__PURE__ */ React.createElement("aside", { className: "space-y-4 rounded border border-slate-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("select", { value: test, onChange: (e) => setTest(e.target.value), className: "w-full rounded border-slate-300 text-sm" }, /* @__PURE__ */ React.createElement("option", { value: "two-mean" }, "\uB450 \uD3C9\uADE0 \uBE44\uAD50"), /* @__PURE__ */ React.createElement("option", { value: "two-prop" }, "\uB450 \uBE44\uC728 \uBE44\uAD50"), /* @__PURE__ */ React.createElement("option", { value: "one-mean" }, "\uD55C \uD3C9\uADE0 \uAC80\uC815")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, test === "two-mean" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { type: "number", value: params.mean1, onChange: (e) => setP("mean1", e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { type: "number", value: params.mean2, onChange: (e) => setP("mean2", e.target.value), className: "rounded border-slate-300 text-sm" })) : null, test === "two-prop" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { type: "number", step: ".01", value: params.p1, onChange: (e) => setP("p1", e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { type: "number", step: ".01", value: params.p2, onChange: (e) => setP("p2", e.target.value), className: "rounded border-slate-300 text-sm" })) : null, test === "one-mean" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { type: "number", value: params.mu, onChange: (e) => setP("mu", e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { type: "number", value: params.mu0, onChange: (e) => setP("mu0", e.target.value), className: "rounded border-slate-300 text-sm" })) : null, /* @__PURE__ */ React.createElement("input", { type: "number", value: params.sd, onChange: (e) => setP("sd", e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { type: "number", step: ".01", value: params.power, onChange: (e) => setP("power", e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { type: "number", step: ".01", value: params.alpha, onChange: (e) => setP("alpha", e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { type: "number", step: ".01", value: params.loss, onChange: (e) => setP("loss", e.target.value), className: "rounded border-slate-300 text-sm" }), /* @__PURE__ */ React.createElement("input", { type: "number", step: ".1", value: params.ratio, onChange: (e) => setP("ratio", e.target.value), className: "rounded border-slate-300 text-sm" })), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: busy, onClick: run, className: "w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-400" }, busy ? "\uACC4\uC0B0 \uC911" : "\uACC4\uC0B0"), error ? /* @__PURE__ */ React.createElement("div", { className: "rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" }, error) : null), /* @__PURE__ */ React.createElement("main", { className: "rounded border border-slate-200 bg-white p-4" }, result ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-1" }, /* @__PURE__ */ React.createElement("div", { className: "rounded border border-slate-200 p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, "Group A"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold" }, result.n1), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, "adjusted ", result.adj1)), result.n2 ? /* @__PURE__ */ React.createElement("div", { className: "rounded border border-slate-200 p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, "Group B"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold" }, result.n2), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, "adjusted ", result.adj2)) : null) : /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, "\uACC4\uC0B0 \uACB0\uACFC\uAC00 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4.")))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(App, null), document.getElementById("div_main"));
}
