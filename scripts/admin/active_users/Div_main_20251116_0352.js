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
