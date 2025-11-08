function Div_main(props) {
  const data = props.data;
  const fmt = (n) => (n ?? 0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

  const list_app_free    = Object.values(data.list_app).filter(x => x.tag_app === "Free");
  const list_app_advance = Object.values(data.list_app).filter(x => x.tag_app === "Advance");

  function Div_app_list({ data }) {
    const items = Object.keys(data).map((k) => (
      <div className="flex flex-row justify-between items-center w-full" key={k}>
        <p>{data[k].name_app}</p>
        <p>
          {fmt(data[k].cnt_connect)}회 ({fmt(data[k].cnt_user)}명)
        </p>
      </div>
    ));
    return (
      <div className="flex flex-col justify-center items-center rounded-xl space-y-4 w-full p-8">
        {items}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
      <Div_operation_menu />

      <div className="col-span-10 md:grid-cols-1 justify-center item-center">
        {/* Web-R 접속 횟수 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"Web-R 접속 횟수"} />
            <dl className="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
              <Div_sub_card
                title={"총 접속 횟수"}
                value={data.count.val_connect_app_total['0']}
                unit={"회"}
                subtitle={"총 이용자 수"}
                subvalue={data.count.val_user_total['0']}
                subunit={"명"}
              />
              <Div_sub_card
                title={"올해 접속 횟수"}
                value={data.count.val_connect_app_yearly['0']}
                unit={"회"}
                subtitle={"올해 이용자 수"}
                subvalue={data.count.val_user_yearly['0']}
                subunit={"명"}
              />
              <Div_sub_card
                title={"이번 달 접속 횟수"}
                value={data.count.val_connect_app_monthly['0']}
                unit={"회"}
                subtitle={"이번 달 이용자 수"}
                subvalue={data.count.val_user_monthly['0']}
                subunit={"명"}
              />
              <Div_sub_card
                title={"오늘 접속 횟수"}
                value={data.count.val_connect_app_daily['0']}
                unit={"회"}
                subtitle={"오늘 이용자 수"}
                subvalue={data.count.val_user_daily['0']}
                subunit={"명"}
              />
            </dl>
          </div>
        </div>

        {/* App별 접속 통계 (이번 달 기준) */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"App별 접속 통계"} />
            <p>(이번 달 기준)</p>
            <dl className="grid grid-cols-2 justify-center items-start w-full p-4 mx-auto text-gray-900">
              <Div_app_list data={list_app_free} />
              <Div_app_list data={list_app_advance} />
            </dl>
          </div>
        </div>

        {/* 이용 추이 그래프 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"이용 추이 그래프"} />
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
              </ul>
              <div id="div_statistics_graph" name="div_statistics_graph" className="w-full h-[500px] p-8"></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}