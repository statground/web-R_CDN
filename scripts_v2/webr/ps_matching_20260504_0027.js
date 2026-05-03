function psmWaitForWebR(timeoutMs = 60000) {
  if (window.WebR) return Promise.resolve(window.WebR);
  if (!window.__webrImportPromise) {
    window.__webrImportPromise = (window.__webrDynamicImport || (window.__webrDynamicImport = Function("specifier", "return import(specifier)")))("https://webr.r-wasm.org/latest/webr.mjs").then((module) => {
      window.WebR = module.WebR;
      return module.WebR;
    });
  }
  return Promise.race([window.__webrImportPromise, new Promise((_, reject) => setTimeout(() => reject(new Error("WebR runtime load timeout")), timeoutMs))]);
}
function psmEscape(value) { return '"' + String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"'; }
function psmOutput(result) { return Array.isArray(result && result.output) ? result.output.filter((x) => x && (x.type === "stdout" || x.type === "stderr")).map((x) => x.data || "").join("\n") : String((result && result.stdout) || "") + String((result && result.stderr) || ""); }
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
if (length(missing) > 0) stop(paste("필수 컬럼이 없습니다:", paste(missing, collapse=", ")))
df <- raw[, need, drop=FALSE]
names(df)[1:2] <- c("treat", "outcome")
for (nm in names(df)) df[[nm]] <- suppressWarnings(as.numeric(df[[nm]]))
df <- df[complete.cases(df), , drop=FALSE]
if (nrow(df) < 4 || length(unique(df$treat)) != 2) stop("처리군과 대조군이 포함된 완전한 데이터가 필요합니다.")
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
function psmNum(x) { const n = Number(x); return Number.isFinite(n) ? n : null; }
function psmParse(output) {
  const result = { meta: {}, effect: {}, balance: [], scores: [] };
  String(output || "").split(/\n+/).forEach((line) => {
    const p = line.trim().split(/\t/);
    if (p[0] === "META") result.meta = { n: psmNum(p[1]), treated: psmNum(p[2]), control: psmNum(p[3]), matched: psmNum(p[4]), psTreated: psmNum(p[5]), psControl: psmNum(p[6]) };
    if (p[0] === "EFFECT") result.effect = { before: psmNum(p[1]), after: psmNum(p[2]), distance: psmNum(p[3]) };
    if (p[0] === "BAL") result.balance.push({ covar: p[1], before: psmNum(p[2]), after: psmNum(p[3]) });
    if (p[0] === "PS") result.scores.push({ treat: psmNum(p[1]), ps: psmNum(p[2]), outcome: psmNum(p[3]) });
  });
  if (!result.meta.n) throw new Error("PSM 결과를 해석하지 못했습니다.");
  return result;
}
function psmFmt(x, d=3) { return Number.isFinite(x) ? x.toFixed(d) : "-"; }
function psmDraw(canvas, result) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect(), w = Math.max(320, rect.width || 760), h = Math.max(280, rect.height || 380), r = window.devicePixelRatio || 1;
  canvas.width = Math.floor(w*r); canvas.height = Math.floor(h*r); const ctx = canvas.getContext("2d"); ctx.setTransform(r,0,0,r,0,0); ctx.clearRect(0,0,w,h); ctx.fillStyle="#fff"; ctx.fillRect(0,0,w,h);
  ctx.fillStyle="#64748b"; ctx.font="500 13px Noto Sans KR, sans-serif"; ctx.textAlign="center";
  if (!result) { ctx.fillText("분석을 실행하면 propensity score 분포가 표시됩니다.", w/2, h/2); return; }
  const left=50,right=20,top=30,bottom=42,pw=w-left-right,ph=h-top-bottom;
  ctx.strokeStyle="#cbd5e1"; ctx.strokeRect(left,top,pw,ph);
  result.scores.forEach((s,i)=>{ if(!Number.isFinite(s.ps)) return; const x=left+s.ps*pw; const y=top+ph-(i%18)/18*ph; ctx.fillStyle=s.treat===1?"#be123c":"#0f766e"; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); });
  ctx.fillStyle="#0f172a"; ctx.fillText("Propensity score", left+pw/2, h-10);
}
function set_main() {
  function PSMApp() {
    const canvasRef=React.useRef(null), webrRef=React.useRef(null);
    const [csvText,setCsvText]=React.useState(PSM_SAMPLE), [treatCol,setTreatCol]=React.useState("treat"), [outcomeCol,setOutcomeCol]=React.useState("re78"), [covars,setCovars]=React.useState("age,educ,race,re74,re75");
    const [status,setStatus]=React.useState("대기 중"), [busy,setBusy]=React.useState(false), [error,setError]=React.useState(""), [result,setResult]=React.useState(null);
    React.useEffect(()=>{psmDraw(canvasRef.current,result); const redraw=()=>psmDraw(canvasRef.current,result); window.addEventListener("resize",redraw); return()=>window.removeEventListener("resize",redraw);},[result]);
    async function ensureWebR(){ if(webrRef.current) return webrRef.current; setStatus("WebAssembly R runtime 로딩 중"); const C=await psmWaitForWebR(); const w=new C({defaultPackages:["base","stats","utils"],RArgs:["--quiet"]}); await w.init(); webrRef.current=w; return w; }
    async function runAnalysis(){ setBusy(true); setError(""); try{ const webr=await ensureWebR(); setStatus("R에서 PSM 계산 중"); const shelter=await new webr.Shelter(); const captured=await shelter.captureR(psmBuildCode(csvText,treatCol,outcomeCol,covars),{withAutoprint:false,captureStreams:true,captureGraphics:false}); const output=psmOutput(captured); try{shelter.purge();}catch(e){} if(/^Error/i.test(output.trim())) throw new Error(output.trim()); const parsed=psmParse(output); setResult(parsed); setStatus(`완료: 매칭 ${parsed.meta.matched}쌍`);}catch(e){setError(e&&e.message?e.message:String(e)); setStatus("오류");}finally{setBusy(false);} }
    return <div className="min-h-[calc(100vh-130px)] bg-slate-50"><div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 md:px-4">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4"><div><a href="/webr/2.0/" className="text-sm font-semibold text-teal-700 hover:text-teal-800">Web-R 2.0</a><h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-2xl">Propensity Score Matching</h1></div><span className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">{status}</span></header>
      <div className="grid grid-cols-[380px_minmax(0,1fr)] gap-5 lg:grid-cols-1"><aside className="space-y-4 rounded border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-2"><input value={treatCol} onChange={(e)=>setTreatCol(e.target.value)} className="rounded border-slate-300 text-sm"/><input value={outcomeCol} onChange={(e)=>setOutcomeCol(e.target.value)} className="rounded border-slate-300 text-sm"/></div>
        <input value={covars} onChange={(e)=>setCovars(e.target.value)} className="w-full rounded border-slate-300 text-sm"/>
        <textarea value={csvText} onChange={(e)=>setCsvText(e.target.value)} rows={14} spellCheck="false" className="w-full rounded border-slate-300 font-mono text-xs leading-5"/>
        <button type="button" disabled={busy} onClick={runAnalysis} className="w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-400">{busy?"분석 중":"분석 실행"}</button>
        {error?<div className="whitespace-pre-wrap rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>:null}
      </aside><main className="space-y-4"><section className="rounded border border-slate-200 bg-white p-4"><canvas ref={canvasRef} className="h-[380px] w-full rounded bg-white"></canvas></section>
        <section className="rounded border border-slate-200 bg-white p-4"><h2 className="text-sm font-semibold text-slate-700">결과</h2>{result?<div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-1"><div className="rounded border border-slate-200 p-3 text-sm">ATT: {psmFmt(result.effect.before)} → <b>{psmFmt(result.effect.after)}</b></div><div className="rounded border border-slate-200 p-3 text-sm">Mean distance: {psmFmt(result.effect.distance)}</div>{result.balance.map(x=><div key={x.covar} className="rounded border border-slate-200 p-3 text-sm">{x.covar}: {psmFmt(x.before)} → {psmFmt(x.after)}</div>)}</div>:<p className="mt-3 text-sm text-slate-500">아직 분석 결과가 없습니다.</p>}</section></main></div>
    </div></div>;
  }
  ReactDOM.render(<PSMApp />, document.getElementById("div_main"));
}
