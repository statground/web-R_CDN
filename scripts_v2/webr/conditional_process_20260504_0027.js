function cpWaitForWebR(timeoutMs = 60000) {
  if (window.WebR) return Promise.resolve(window.WebR);
  if (!window.__webrImportPromise) window.__webrImportPromise = (window.__webrDynamicImport || (window.__webrDynamicImport = Function("specifier", "return import(specifier)")))("https://webr.r-wasm.org/latest/webr.mjs").then((m) => (window.WebR = m.WebR));
  return Promise.race([window.__webrImportPromise, new Promise((_, reject) => setTimeout(() => reject(new Error("WebR runtime load timeout")), timeoutMs))]);
}
function cpEsc(x) { return '"' + String(x || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"'; }
function cpOut(r) { return Array.isArray(r && r.output) ? r.output.filter((x) => x && (x.type === "stdout" || x.type === "stderr")).map((x) => x.data || "").join("\n") : String((r && r.stdout) || "") + String((r && r.stderr) || ""); }
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
if (length(missing) > 0) stop(paste("필수 컬럼이 없습니다:", paste(missing, collapse=", ")))
df <- raw[, unique(need), drop=FALSE]
for (nm in names(df)) df[[nm]] <- suppressWarnings(as.numeric(df[[nm]]))
df <- df[complete.cases(df), , drop=FALSE]
if (nrow(df) < 6) stop("완전한 데이터가 6행 이상 필요합니다.")
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
function cpNum(x){const n=Number(x);return Number.isFinite(n)?n:null}
function cpParse(out){const r={meta:{},coefs:[],indirect:null,slopes:[],conds:[]};String(out||"").split(/\n+/).forEach(line=>{const p=line.trim().split(/\t/);if(p[0]==="META")r.meta={model:p[1],n:cpNum(p[2])};if(p[0]==="COEF")r.coefs.push({eq:p[1],term:p[2],estimate:cpNum(p[3]),se:cpNum(p[4]),t:cpNum(p[5]),p:cpNum(p[6])});if(p[0]==="INDIRECT")r.indirect={estimate:cpNum(p[1]),lcl:cpNum(p[2]),ucl:cpNum(p[3]),direct:cpNum(p[4])};if(p[0]==="SLOPE")r.slopes.push({w:cpNum(p[1]),slope:cpNum(p[2])});if(p[0]==="COND")r.conds.push({w:cpNum(p[1]),effect:cpNum(p[2])});});if(!r.meta.model)throw new Error("조건부 과정 분석 결과를 해석하지 못했습니다.");return r}
function cpFmt(x,d=3){return Number.isFinite(x)?x.toFixed(d):"-"}
function set_main(){
  function App(){
    const webrRef=React.useRef(null);const[model,setModel]=React.useState("mediation"),[csvText,setCsvText]=React.useState(CP_SAMPLE),[x,setX]=React.useState("X"),[m,setM]=React.useState("M"),[y,setY]=React.useState("Y"),[w,setW]=React.useState("W"),[boots,setBoots]=React.useState(200),[status,setStatus]=React.useState("대기 중"),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(""),[result,setResult]=React.useState(null);
    async function ensureWebR(){if(webrRef.current)return webrRef.current;setStatus("WebAssembly R runtime 로딩 중");const C=await cpWaitForWebR();const wr=new C({defaultPackages:["base","stats","utils"],RArgs:["--quiet"]});await wr.init();webrRef.current=wr;return wr}
    async function run(){setBusy(true);setError("");try{const wr=await ensureWebR();setStatus("R에서 조건부 과정 분석 중");const shelter=await new wr.Shelter();const cap=await shelter.captureR(cpBuildCode(csvText,model,x,m,y,w,boots),{withAutoprint:false,captureStreams:true,captureGraphics:false});const output=cpOut(cap);try{shelter.purge()}catch(e){}if(/^Error/i.test(output.trim()))throw new Error(output.trim());setResult(cpParse(output));setStatus("완료")}catch(e){setError(e&&e.message?e.message:String(e));setStatus("오류")}finally{setBusy(false)}}
    return <div className="min-h-[calc(100vh-130px)] bg-slate-50"><div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-6 md:px-4"><header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4"><div><a href="/webr/2.0/" className="text-sm font-semibold text-teal-700 hover:text-teal-800">Web-R 2.0</a><h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-2xl">조건부 과정 분석</h1></div><span className="rounded border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">{status}</span></header>
    <div className="grid grid-cols-[380px_minmax(0,1fr)] gap-5 lg:grid-cols-1"><aside className="space-y-4 rounded border border-slate-200 bg-white p-4"><select value={model} onChange={e=>setModel(e.target.value)} className="w-full rounded border-slate-300 text-sm"><option value="mediation">단순 매개</option><option value="moderation">조절</option><option value="moderated-mediation">조절된 매개</option></select><div className="grid grid-cols-4 gap-2"><input value={x} onChange={e=>setX(e.target.value)} className="rounded border-slate-300 text-sm"/><input value={m} onChange={e=>setM(e.target.value)} className="rounded border-slate-300 text-sm"/><input value={y} onChange={e=>setY(e.target.value)} className="rounded border-slate-300 text-sm"/><input value={w} onChange={e=>setW(e.target.value)} className="rounded border-slate-300 text-sm"/></div><input type="number" value={boots} onChange={e=>setBoots(e.target.value)} className="w-full rounded border-slate-300 text-sm"/><textarea value={csvText} onChange={e=>setCsvText(e.target.value)} rows={14} spellCheck="false" className="w-full rounded border-slate-300 font-mono text-xs leading-5"/><button type="button" disabled={busy} onClick={run} className="w-full rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-400">{busy?"분석 중":"분석 실행"}</button>{error?<div className="whitespace-pre-wrap rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>:null}</aside><main className="space-y-4"><section className="rounded border border-slate-200 bg-white p-4"><h2 className="text-sm font-semibold text-slate-700">결과</h2>{result?<div className="mt-3 space-y-3">{result.indirect?<div className="rounded border border-slate-200 p-3 text-sm">Indirect: <b>{cpFmt(result.indirect.estimate)}</b> ({cpFmt(result.indirect.lcl)}-{cpFmt(result.indirect.ucl)}), Direct: {cpFmt(result.indirect.direct)}</div>:null}{result.slopes.map((s,i)=><div key={i} className="rounded border border-slate-200 p-3 text-sm">W={cpFmt(s.w)} slope={cpFmt(s.slope)}</div>)}{result.conds.map((s,i)=><div key={i} className="rounded border border-slate-200 p-3 text-sm">W={cpFmt(s.w)} conditional indirect={cpFmt(s.effect)}</div>)}<div className="overflow-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b"><th>Eq</th><th>Term</th><th>Coef</th><th>SE</th><th>p</th></tr></thead><tbody>{result.coefs.map((c,i)=><tr key={i} className="border-b border-slate-100"><td>{c.eq}</td><td>{c.term}</td><td>{cpFmt(c.estimate)}</td><td>{cpFmt(c.se)}</td><td>{cpFmt(c.p,4)}</td></tr>)}</tbody></table></div></div>:<p className="mt-3 text-sm text-slate-500">아직 분석 결과가 없습니다.</p>}</section></main></div></div></div>
  }
  ReactDOM.render(<App/>,document.getElementById("div_main"));
}
