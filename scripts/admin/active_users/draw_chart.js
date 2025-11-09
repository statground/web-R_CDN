const GRAPH_TAB_IDS = ["graph_tab_daily","graph_tab_monthly","graph_tab_yearly","graph_tab_total"];

function draw_chart(inputData, activeTabId) {
  // 탭 스타일
  GRAPH_TAB_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = (id === activeTabId) ? class_tab_active : class_tab_inactive;
  });

  // 데이터 정렬
  const rows = Array.isArray(inputData) ? inputData.slice() : Object.values(inputData || {});
  rows.sort((a,b) => new Date(a.date) - new Date(b.date));

  const n = (x) => (+x || 0);
  const fmt = (x) => n(x).toLocaleString();
  const rate = (a,b) => (b > 0 ? ((+a || 0) / (+b || 0)) * 100 : 0);

  // ---------- KPI 갱신 (마지막 행 기준) ----------
  const last = rows.at(-1) || {};
  const visit  = n(last.cnt_visit);
  const signup = n(last.cnt_signup);
  const login  = n(last.cnt_login);
  const board  = n(last.cnt_board);
  const app    = n(last.cnt_app);

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
  setText("kpi_visit_val",  fmt(visit));
  setText("kpi_signup_val", fmt(signup));
  setText("kpi_login_val",  fmt(login));
  setText("kpi_board_val",  fmt(board));
  setText("kpi_app_val",    fmt(app));
  setText("kpi_cr1", rate(signup, visit).toFixed(1) + "%");
  setText("kpi_cr2", rate(login,  signup).toFixed(1) + "%");
  setText("kpi_cr3", rate(board,  login).toFixed(1) + "%");
  setText("kpi_cr4", rate(app,    login).toFixed(1) + "%");

  // ---------- 공통 ----------
  const ensureChart = (domId) => {
    const el = document.getElementById(domId);
    if (!el) return null;
    const prev = echarts.getInstanceByDom(el);
    if (prev) prev.dispose();
    return echarts.init(el, null, { renderer: "canvas" });
  };

  // ---------- (1) 퍼널 ----------
  const chartFunnel = ensureChart("div_funnel_graph");
  if (chartFunnel) {
    const funnelData = [
      { name: "방문자", value: visit },
      { name: "가입자", value: signup },
      { name: "로그인", value: login },
      { name: "게시판 이용", value: board },
      { name: "앱 사용", value: app }
    ];
    chartFunnel.setOption({
      title: { text: "퍼널 스냅샷", left: "center" },
      tooltip: { trigger: "item", formatter: ({ name, value }) => `${name}: ${(+value||0).toLocaleString()}명` },
      series: [{
        type: "funnel",
        left: "10%", width: "80%", top: 60, bottom: 20,
        sort: "descending", gap: 4,
        label: { show: true, position: "inside", formatter: "{b}\n{c}" },
        itemStyle: { borderColor: "#fff", borderWidth: 1 },
        data: funnelData
      }]
    });
  }

  // ---------- (2) 전환율 막대 ----------
  const chartConv = ensureChart("div_conv_graph");
  if (chartConv) {
    const cats = ["방문→가입", "가입→로그인", "로그인→게시판", "로그인→앱"];
    const vals = [
      rate(signup, visit),
      rate(login,  signup),
      rate(board,  login),
      rate(app,    login),
    ].map(v => +v.toFixed(1));

    chartConv.setOption({
      title: { text: "단계별 전환율(%)", left: "center" },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { top: 50, left: 60, right: 30, bottom: 40 },
      xAxis: { type: "category", data: cats },
      yAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%" } },
      series: [{
        type: "bar",
        data: vals,
        label: { show: true, position: "top", formatter: "{c}%" },
        barMaxWidth: 32
      }]
    });
  }

  // ---------- (3) 추이 라인 ----------
  const chartTrend = ensureChart("div_trend_graph");
  if (chartTrend) {
    const labels = rows.map(r => r.date);
    const sVisit  = rows.map(r => +r.cnt_visit  || 0);
    const sSignup = rows.map(r => +r.cnt_signup || 0);
    const sLogin  = rows.map(r => +r.cnt_login  || 0);
    const sBoard  = rows.map(r => +r.cnt_board  || 0);
    const sApp    = rows.map(r => +r.cnt_app    || 0);

    chartTrend.setOption({
      title: { text: "활동 추이", left: "center" },
      tooltip: { trigger: "axis" },
      legend: { top: 28, data: ["방문","가입","로그인","게시판","앱"] },
      grid: { top: 60, left: 60, right: 30, bottom: 40 },
      xAxis: { type: "category", data: labels },
      yAxis: { type: "value" },
      dataZoom: [{ type: "inside" }, { type: "slider" }],
      series: [
        { name: "방문",   type: "line", data: sVisit,  smooth: true },
        { name: "가입",   type: "line", data: sSignup, smooth: true },
        { name: "로그인", type: "line", data: sLogin,  smooth: true },
        { name: "게시판", type: "line", data: sBoard,  smooth: true },
        { name: "앱",     type: "line", data: sApp,    smooth: true },
      ]
    });
  }

  // 반응형
  const onResize = () => {
    [chartFunnel, chartConv, chartTrend].forEach(c => c && c.resize());
  };
  window.addEventListener("resize", onResize, { passive: true });
}