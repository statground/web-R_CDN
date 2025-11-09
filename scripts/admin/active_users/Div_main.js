function Div_main(props) {
  const data = props.data || {};

  // 기본 탭: 월(monthly)
  const rowsMonthly = Object.values(data.list_monthly || {}).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const last = rowsMonthly.length ? rowsMonthly[rowsMonthly.length - 1] : {};

  const n = (x) => (+x || 0);
  const fmt = (x) => n(x).toLocaleString();
  const rate = (a, b) => (b > 0 ? ((+a || 0) / (+b || 0)) * 100 : 0);

  const visit0  = fmt(last.cnt_visit);
  const signup0 = fmt(last.cnt_signup);
  const login0  = fmt(last.cnt_login);
  const board0  = fmt(last.cnt_board);
  const app0    = fmt(last.cnt_app);

  const cr1_0 = rate(last.cnt_signup, last.cnt_visit).toFixed(1) + "%";
  const cr2_0 = rate(last.cnt_login,  last.cnt_signup).toFixed(1) + "%";
  const cr3_0 = rate(last.cnt_board,  last.cnt_login).toFixed(1) + "%";
  const cr4_0 = rate(last.cnt_app,    last.cnt_login).toFixed(1) + "%";

  const classCard = "w-full bg-white border border-gray-200 rounded-lg shadow";
  const classWrap = "p-4 bg-white rounded-lg md:p-8 text-center";

  const Kpi = ({title, idVal, val, idRate, rateText, sub}) => (
    <div className="flex flex-col items-center justify-center">
      <div className="text-4xl font-extrabold">
        <span id={idVal}>{val}</span>명
      </div>
      <div className="mt-1 text-xl font-semibold">{title}</div>
      <div className="mt-1 text-slate-500 text-sm">
        {sub}{idRate && (<><span> </span><span id={idRate}>{rateText}</span></>)}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12 md:grid-cols-1 justify-center items-top w-full px-[100px] py-[20px] md:px-[10px]">
      <Div_operation_menu />

      <div className="col-span-10 md:grid-cols-1 justify-center items-center">
        {/* 🔵 퍼널 KPI — Div_sub_card 대신 직접 마크업 */}
        <div className={classCard}>
          <div className={classWrap}>
            <Div_sub_title title={"퍼널 요약"} />
            <div className="grid grid-cols-5 gap-8 md:grid-cols-1 p-4">
              <Kpi title="방문자"     idVal="kpi_visit_val"  val={visit0}  idRate=""       rateText=""   sub="(최상단 모수)" />
              <Kpi title="가입자"     idVal="kpi_signup_val" val={signup0} idRate="kpi_cr1" rateText={cr1_0} sub="방문→가입 전환:" />
              <Kpi title="로그인"     idVal="kpi_login_val"  val={login0}  idRate="kpi_cr2" rateText={cr2_0} sub="가입→로그인 전환:" />
              <Kpi title="게시판 이용" idVal="kpi_board_val"  val={board0}  idRate="kpi_cr3" rateText={cr3_0} sub="로그인→게시판 전환:" />
              <Kpi title="앱 사용"     idVal="kpi_app_val"    val={app0}    idRate="kpi_cr4" rateText={cr4_0} sub="로그인→앱 전환:" />
            </div>
          </div>
        </div>

        {/* 🔵 탭 + 세로 차트 3종 */}
        <div className={classCard}>
          <div className={classWrap}>
            <dl className="flex flex-col justify-center items-start w-full p-4 mx-auto text-gray-900">
              <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full">
                <li className="me-2" onClick={() => draw_chart(data.list_daily,   "graph_tab_daily")}>
                  <div className={class_tab_inactive} id="graph_tab_daily">일</div>
                </li>
                <li className="me-2" onClick={() => draw_chart(data.list_monthly, "graph_tab_monthly")}>
                  <div className={class_tab_active} id="graph_tab_monthly">월</div>
                </li>
                <li className="me-2" onClick={() => draw_chart(data.list_yearly,  "graph_tab_yearly")}>
                  <div className={class_tab_inactive} id="graph_tab_yearly">년</div>
                </li>
                <li className="me-2" onClick={() => draw_chart(data.list_total,   "graph_tab_total")}>
                  <div className={class_tab_inactive} id="graph_tab_total">전체</div>
                </li>
              </ul>

              {/* 세로로 하나씩 */}
              <div className="w-full mt-4 space-y-6">
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