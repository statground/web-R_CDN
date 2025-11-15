const GRAPH_TAB_IDS = [
  "graph_tab_daily",
  "graph_tab_monthly",
  "graph_tab_yearly",
  "graph_tab_total",
];

function draw_chart(inputData, activeTabId) {
  // 탭 스타일 동기화 (안전하게 한 번 더)
  GRAPH_TAB_IDS.forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = id === activeTabId ? class_tab_active : class_tab_inactive;
  });

  let rows;
  if (Array.isArray(inputData)) {
    rows = inputData.slice();
  } else {
    rows = Object.values(inputData || {});
  }
  rows.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  const n = function (x) { return (+x || 0); };
  const fmt = function (x) { return n(x).toLocaleString(); };
  const rate = function (a, b) { return b > 0 ? ((+a || 0) / (+b || 0)) * 100 : 0; };

  if (!rows.length) {
    // 데이터 없을 때 KPI 초기화
    ["kpi_visit_val", "kpi_signup_val", "kpi_login_val", "kpi_board_val", "kpi_app_val"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.innerText = "0";
    });
    ["kpi_cr1", "kpi_cr2", "kpi_cr3", "kpi_cr4"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.innerText = "0.0%";
    });
    const cumEl0 = document.getElementById("kpi_cum_signup_val");
    if (cumEl0) cumEl0.innerText = "0";
    return;
  }

  const last = rows[rows.length - 1] || {};
  const isMonthly =
    activeTabId === "graph_tab_monthly" || last.type === "monthly";

  // 누적 가입자: cum_signup 있으면 그대로, 없으면 cnt_signup 합
  let cumSignup;
  if (typeof last.cum_signup !== "undefined") {
    cumSignup = n(last.cum_signup);
  } else {
    cumSignup = rows.reduce(function (sum, r) {
      return sum + n(r.cnt_signup);
    }, 0);
  }

  // 월 탭일 때 누적 방문 (기간 합)
  let cumVisit = 0;
  if (isMonthly) {
    cumVisit = rows.reduce(function (sum, r) {
      return sum + n(r.cnt_visit);
    }, 0);
  }

  // 스냅샷(마지막 행)
  const visit = n(last.cnt_visit);
  const signup = n(last.cnt_signup);
  const login = n(last.cnt_login);
  const board = n(last.cnt_board);
  const app = n(last.cnt_app);

  // 전환율
  let cr1, cr2, cr3, cr4;
  if (isMonthly) {
    cr1 = rate(cumSignup, cumVisit);  // 누적 방문 → 누적 가입
    cr2 = rate(login, cumSignup);     // 누적 가입 → (해당 월) 로그인
  } else {
    cr1 = rate(signup, visit);        // 기간 방문 → 기간 가입
    cr2 = rate(login, signup);        // 기간 가입 → 기간 로그인
  }
  cr3 = rate(board, login);           // 로그인 → 게시판
  cr4 = rate(app,   login);           // 로그인 → 앱

  const setText = function (id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  // 누적 가입자 텍스트
  setText("kpi_cum_signup_val", fmt(cumSignup));

  // KPI 숫자
  setText("kpi_visit_val",  fmt(visit));
  setText("kpi_signup_val", fmt(signup));
  setText("kpi_login_val",  fmt(login));
  setText("kpi_board_val",  fmt(board));
  setText("kpi_app_val",    fmt(app));

  // KPI 전환율
  setText("kpi_cr1", (isNaN(cr1) ? 0 : cr1).toFixed(1) + "%");
  setText("kpi_cr2", (isNaN(cr2) ? 0 : cr2).toFixed(1) + "%");
  setText("kpi_cr3", (isNaN(cr3) ? 0 : cr3).toFixed(1) + "%");
  setText("kpi_cr4", (isNaN(cr4) ? 0 : cr4).toFixed(1) + "%");

  // 공통 차트 인스턴스 생성/재사용
  const ensureChart = function (domId) {
    const el = document.getElementById(domId);
    if (!el) return null;
    const prev = echarts.getInstanceByDom(el);
    if (prev) prev.dispose();
    return echarts.init(el, null, { renderer: "canvas" });
  };

  /* ---------- (1) 퍼널 스냅샷 ---------- */
  const chartFunnel = ensureChart("div_funnel_graph");
  if (chartFunnel) {
    const funnelData = [
      { name: "방문자",     value: visit },
      { name: "가입자",     value: signup },
      { name: "로그인",     value: login },
      { name: "게시판 이용", value: board },
      { name: "앱 사용",     value: app },
    ];
    chartFunnel.setOption({
      title: {
        text: "퍼널 스냅샷",
        left: "center",
        top: 10,
      },
      tooltip: {
        trigger: "item",
        formatter: function (p) {
          return (
            p.name + ": " + ((+p.value || 0).toLocaleString()) + "명"
          );
        },
      },
      series: [
        {
          type: "funnel",
          left: "10%",
          width: "80%",
          top: 80,
          bottom: 20,
          sort: "descending",
          gap: 4,
          label: {
            show: true,
            position: "inside",
            formatter: "{b}\n{c}",
          },
          itemStyle: {
            borderColor: "#ffffff",
            borderWidth: 1,
          },
          data: funnelData,
        },
      ],
    });
  }

  /* ---------- (2) 단계별 전환율 ---------- */
  const chartConv = ensureChart("div_conv_graph");
  if (chartConv) {
    const cats = ["방문→가입", "가입→로그인", "로그인→게시판", "로그인→앱"];
    const vals = [
      isNaN(cr1) ? 0 : cr1,
      isNaN(cr2) ? 0 : cr2,
      isNaN(cr3) ? 0 : cr3,
      isNaN(cr4) ? 0 : cr4,
    ].map(function (v) {
      return +v.toFixed(1);
    });

    const maxRate = Math.max.apply(null, [0].concat(vals));
    const yMax = Math.max(100, Math.ceil(maxRate / 10) * 10);

    chartConv.setOption({
      title: {
        text: "단계별 전환율(%)",
        left: "center",
        top: 10,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        top: 80,
        left: 60,
        right: 30,
        bottom: 40,
      },
      xAxis: {
        type: "category",
        data: cats,
      },
      yAxis: {
        type: "value",
        max: yMax,
        axisLabel: { formatter: "{value}%" },
      },
      series: [
        {
          type: "bar",
          data: vals,
          barMaxWidth: 32,
          label: {
            show: true,
            position: "top",
            formatter: "{c}%",
          },
        },
      ],
    });
  }

  /* ---------- (3) 활동 추이 ---------- */
  const chartTrend = ensureChart("div_trend_graph");
  if (chartTrend) {
    const labels  = rows.map(function (r) { return r.date; });
    const sVisit  = rows.map(function (r) { return n(r.cnt_visit); });
    const sSignup = rows.map(function (r) { return n(r.cnt_signup); });
    const sLogin  = rows.map(function (r) { return n(r.cnt_login); });
    const sBoard  = rows.map(function (r) { return n(r.cnt_board); });
    const sApp    = rows.map(function (r) { return n(r.cnt_app); });

    chartTrend.setOption({
      title: {
        text: "활동 추이",
        left: "center",
        top: 10,
      },
      tooltip: { trigger: "axis" },
      legend: {
        top: 40,
        data: ["방문", "가입", "로그인", "게시판", "앱"],
      },
      grid: {
        top: 90,
        left: 60,
        right: 30,
        bottom: 40,
      },
      xAxis: {
        type: "category",
        data: labels,
      },
      yAxis: {
        type: "value",
      },
      dataZoom: [
        { type: "inside" },
        { type: "slider" },
      ],
      series: [
        { name: "방문",   type: "line", data: sVisit,  smooth: true },
        { name: "가입",   type: "line", data: sSignup, smooth: true },
        { name: "로그인", type: "line", data: sLogin,  smooth: true },
        { name: "게시판", type: "line", data: sBoard,  smooth: true },
        { name: "앱",     type: "line", data: sApp,    smooth: true },
      ],
    });
  }

  // 반응형
  const onResize = function () {
    [chartFunnel, chartConv, chartTrend].forEach(function (c) {
      if (c) c.resize();
    });
  };
  window.addEventListener("resize", onResize, { passive: true });
}

async function get_main() {
  ReactDOM.render(<Div_main_skeleton />, document.getElementById("div_main"));

  try {
    const data = await fetch("/admin/ajax_get_admin_active_users/").then(function (r) {
      return r.json();
    });

    const mount = document.getElementById("div_main");
    ReactDOM.render(
      <Div_main data={data} />,
      mount
    );
  } catch (e) {
    console.error(e);
    document.getElementById("div_main").innerHTML =
      '<div class="text-center text-gray-500 py-10">데이터를 불러오는 중 오류가 발생했습니다.</div>';
  }
}
