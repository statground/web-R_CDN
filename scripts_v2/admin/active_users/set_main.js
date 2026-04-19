/**
 * Integrated admin script for /admin/active_users/
 * Generated from the current admin index bundle layout.
 * Only functions/components actually used by this menu were kept.
 */
let class_tab_active = "inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active cursor-pointer";
let class_tab_inactive = "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 cursor-pointer";

function Div_operation_menu() {
	function Div_menu_button(props) {
		return (
			<button type="button" onClick={() => location.href=props.url}
					class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200
						focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
				{props.name}
			</button>
		)
	}

	var date = new Date();

	return (
		<div class="col-span-2 md:grid-cols-1 justify-center item-center">
			<div class="flex flex-col md:flex-row lg:w-48 md:w-full item-center">
				<Div_menu_button name={"첫 화면"} url={'/admin/'} />
				<Div_menu_button name={"활성 사용자"} url={'/admin/active_users/'} />
				<Div_menu_button name={"Web-R 접속 현황"} url={'/admin/webr/'} />
				<Div_menu_button name={"방문 현황"} url={'/admin/visitors/'} />
				<Div_menu_button name={"회원 현황"} url={'/admin/members/'} />
				<Div_menu_button name={"결제 현황"} url={'/admin/payments/'} />
				<Div_menu_button name={"정산액 조회"} url={'/admin/balance_account/?year=' + date.getFullYear().toString() + "&month=" + (date.getMonth()+1).toString() }/>
			</div>
		</div>
	)
}

function Div_sub_title(props) {
	return (
		<h5 class="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
			<span class="text-blue-600">
				{props.title}
			</span>
		</h5>            
	)
}

function Div_main_skeleton(props) {    
	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

		  <div className="col-span-10 flex flex-col space-y-8">
			{Array.from({ length: 4 }).map((_, idx) => (
			  <div
				key={idx}
				className="w-full bg-white border border-gray-200 rounded-lg shadow animate-pulse"
			  >
				<div className="p-6">
				  <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
				  <div className="h-[350px] w-full bg-gray-100 rounded"></div>
				</div>
			  </div>
			))}
		  </div>
		</div>
	)
}

function Div_main(props) {
  const data = props.data || {};

  const getSortedRows = (list) => {
    const arr = Array.isArray(list) ? list.slice() : Object.values(list || {});
    arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    return arr;
  };

  const dailyRows   = getSortedRows(data.list_daily);
  const monthlyRows = getSortedRows(data.list_monthly);
  const yearlyRows  = getSortedRows(data.list_yearly);
  const totalRows   = getSortedRows(data.list_total);

  // ▣ 초기 탭: 월
  const [activeTab, setActiveTab] = React.useState("monthly");

  // ▣ 탭별 선택 기준일(또는 월/연도)
  const [selectedDates, setSelectedDates] = React.useState(() => ({
    daily:   dailyRows.length   ? dailyRows[dailyRows.length - 1].date     : "",
    monthly: monthlyRows.length ? monthlyRows[monthlyRows.length - 1].date : "",
    yearly:  yearlyRows.length  ? yearlyRows[yearlyRows.length - 1].date   : "",
  }));

  const tabIdMap = {
    daily: "graph_tab_daily",
    monthly: "graph_tab_monthly",
    yearly: "graph_tab_yearly",
    total: "graph_tab_total",
  };

  // ▣ 현재 탭 기준으로, 선택된 날짜/월/연도까지의 rows 잘라내기
  const getActiveRows = () => {
    if (activeTab === "daily") {
      if (!dailyRows.length) return [];
      const sel = selectedDates.daily || dailyRows[dailyRows.length - 1].date;
      return dailyRows.filter((r) => r.date <= sel);
    }
    if (activeTab === "monthly") {
      if (!monthlyRows.length) return [];
      const sel = selectedDates.monthly || monthlyRows[monthlyRows.length - 1].date;
      return monthlyRows.filter((r) => r.date <= sel);
    }
    if (activeTab === "yearly") {
      if (!yearlyRows.length) return [];
      const sel = selectedDates.yearly || yearlyRows[yearlyRows.length - 1].date;
      return yearlyRows.filter((r) => r.date <= sel);
    }
    // total
    return totalRows;
  };

  // ▣ 탭/날짜 변경될 때마다 KPI + 그래프 다시 그림
  React.useEffect(() => {
    const rows = getActiveRows();
    if (!rows.length) return;
    draw_chart(rows, tabIdMap[activeTab]);
  }, [activeTab, selectedDates, data]);

  const classCard = "w-full bg-white border border-gray-200 rounded-lg shadow";
  const classWrap = "p-4 bg-white rounded-lg md:p-8 text-center";

  // ▣ KPI 카드 (초기값은 0, draw_chart가 채워줌)
  const Kpi = ({ title, idVal, subTop, subBottom, idRate }) => (
    <div className="flex flex-col items-center justify-center">
      <div className="text-4xl font-extrabold">
        <span id={idVal}>0</span>명
      </div>
      <div className="mt-1 text-xl font-semibold">{title}</div>
      <div className="mt-1 text-slate-500 text-sm leading-snug text-center">
        {subTop && (
          <>
            {subTop}
            <br />
          </>
        )}
        {subBottom}
        {idRate && (
          <>
            {" "}
            <span id={idRate}>0.0%</span>
          </>
        )}
      </div>
    </div>
  );

  // ▣ 탭 클릭 핸들러
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  // ▣ 날짜/월/연도 변경 핸들러
  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDates((prev) => {
      const next = { ...prev };
      if (activeTab === "daily") {
        next.daily = value;
      } else if (activeTab === "monthly") {
        next.monthly = value;
      } else if (activeTab === "yearly") {
        next.yearly = value;
      }
      return next;
    });
  };

  // 현재 탭의 선택값 & min/max
  let currentValue = "";
  let minValue = "";
  let maxValue = "";
  if (activeTab === "daily") {
    currentValue =
      selectedDates.daily ||
      (dailyRows.length ? dailyRows[dailyRows.length - 1].date : "");
    minValue = dailyRows.length ? dailyRows[0].date : "";
    maxValue = dailyRows.length ? dailyRows[dailyRows.length - 1].date : "";
  } else if (activeTab === "monthly") {
    currentValue =
      selectedDates.monthly ||
      (monthlyRows.length ? monthlyRows[monthlyRows.length - 1].date : "");
    minValue = monthlyRows.length ? monthlyRows[0].date : "";
    maxValue = monthlyRows.length
      ? monthlyRows[monthlyRows.length - 1].date
      : "";
  } else if (activeTab === "yearly") {
    currentValue =
      selectedDates.yearly ||
      (yearlyRows.length ? yearlyRows[yearlyRows.length - 1].date : "");
    minValue = yearlyRows.length ? yearlyRows[0].date : "";
    maxValue = yearlyRows.length
      ? yearlyRows[yearlyRows.length - 1].date
      : "";
  }

  return (
    <div className="grid grid-cols-12 md:grid-cols-1 justify-center items-top w-full px-[100px] py-[20px] md:px-[10px]">
      {/* 좌측 메뉴 */}
      <Div_operation_menu />

      {/* 우측 본문 */}
      <div className="col-span-10 md:grid-cols-1 justify-center items-center">
        <div className={classCard}>
          <div className={classWrap}>
            <dl className="flex flex-col justify-center items-start w-full p-4 mx-auto text-gray-900">
              {/* ▣ 탭 + 날짜 입력 */}
              <div className="flex flex-wrap items-center justify-between w-full mb-4 gap-3">
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 flex-1">
                  <li className="me-2" onClick={() => handleTabClick("daily")}>
                    <div
                      className={
                        activeTab === "daily"
                          ? class_tab_active
                          : class_tab_inactive
                      }
                      id="graph_tab_daily"
                    >
                      일
                    </div>
                  </li>
                  <li
                    className="me-2"
                    onClick={() => handleTabClick("monthly")}
                  >
                    <div
                      className={
                        activeTab === "monthly"
                          ? class_tab_active
                          : class_tab_inactive
                      }
                      id="graph_tab_monthly"
                    >
                      월
                    </div>
                  </li>
                  <li className="me-2" onClick={() => handleTabClick("yearly")}>
                    <div
                      className={
                        activeTab === "yearly"
                          ? class_tab_active
                          : class_tab_inactive
                      }
                      id="graph_tab_yearly"
                    >
                      년
                    </div>
                  </li>
                  <li className="me-2" onClick={() => handleTabClick("total")}>
                    <div
                      className={
                        activeTab === "total"
                          ? class_tab_active
                          : class_tab_inactive
                      }
                      id="graph_tab_total"
                    >
                      전체
                    </div>
                  </li>
                </ul>

                {/* 날짜/월/연도 입력 (total 제외) */}
                {activeTab !== "total" && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>
                      {activeTab === "daily"
                        ? "날짜 선택"
                        : activeTab === "monthly"
                        ? "년월 선택"
                        : "연도 선택"}
                      :
                    </span>

                    {activeTab === "daily" && (
                      <input
                        type="date"
                        className="border border-gray-300 rounded-lg p-2 text-sm"
                        min={minValue}
                        max={maxValue}
                        value={currentValue}
                        onChange={handleDateChange}
                      />
                    )}

                    {activeTab === "monthly" && (
                      <input
                        type="month"
                        className="border border-gray-300 rounded-lg p-2 text-sm"
                        min={minValue}
                        max={maxValue}
                        value={currentValue}
                        onChange={handleDateChange}
                      />
                    )}

                    {activeTab === "yearly" && (
                      <input
                        type="number"
                        className="border border-gray-300 rounded-lg p-2 w-24 text-sm"
                        min={minValue || undefined}
                        max={maxValue || undefined}
                        value={currentValue}
                        onChange={handleDateChange}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* ▣ 퍼널 요약 */}
              <Div_sub_title title={"퍼널 요약"} />
              <div className="grid grid-cols-5 gap-8 md:grid-cols-1 p-4 w-full">
                <Kpi
                  title="방문자"
                  idVal="kpi_visit_val"
                  subTop=""
                  subBottom="(최상단 모수)"
                  idRate=""
                />
                <Kpi
                  title="가입자"
                  idVal="kpi_signup_val"
                  subTop={
                    <>
                      (누적{" "}
                      <span id="kpi_cum_signup_val">
                        0
                      </span>
                      명)
                    </>
                  }
                  subBottom="방문→가입 전환:"
                  idRate="kpi_cr1"
                />
                <Kpi
                  title="로그인"
                  idVal="kpi_login_val"
                  subTop=""
                  subBottom="가입→로그인 전환:"
                  idRate="kpi_cr2"
                />
                <Kpi
                  title="게시판 이용"
                  idVal="kpi_board_val"
                  subTop=""
                  subBottom="로그인→게시판 전환:"
                  idRate="kpi_cr3"
                />
                <Kpi
                  title="앱 사용"
                  idVal="kpi_app_val"
                  subTop=""
                  subBottom="로그인→앱 전환:"
                  idRate="kpi_cr4"
                />
              </div>

              {/* ▣ 차트 3개 */}
              <div className="w-full mt-6 space-y-6">
                <div id="div_funnel_graph" className="w-full h-[420px] p-2"></div>
                <div id="div_conv_graph"   className="w-full h-[380px] p-2"></div>
                <div id="div_trend_graph"  className="w-full h-[420px] p-2"></div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

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

async function set_main() {
	function Div_check_admin() {
		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<p>관리자 여부를 확인하고 있습니다.</p>
				</div>
			</div>
		)
	}

	function Div_main_stop() {
		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg" class="size-16" />
					<p>관리자를 위한 메뉴입니다.</p>
					<a href="/"
					   class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px]
							  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
						첫 화면으로
					</a>
				</div>
			</div>
		)
	}

	const username = window.gv_username || "";
	if (!username) {
		location.href = "/";
		return;
	}

	const mount = document.getElementById("div_main");
	ReactDOM.render(<Div_check_admin />, mount);

	try {
		const headerData = await fetch("/ajax_get_menu_header/").then((res) => res.json());
		const role = (headerData && headerData.role) ? headerData.role : "";
		window.gv_role = role;

		if (role === "관리자") {
			ReactDOM.render(<Div_main_skeleton />, mount);
			await get_main();
		} else {
			ReactDOM.render(<Div_main_stop />, mount);
		}
	} catch (error) {
		console.error(error);
		mount.innerHTML = '<div class="text-center text-gray-500 py-10">관리자 여부를 확인하는 중 오류가 발생했습니다.</div>';
	}
}
