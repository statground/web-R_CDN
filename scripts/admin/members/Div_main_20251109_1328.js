function Div_main(props) {
  const data = props.data;

  return (
    <div className="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
      <Div_operation_menu />

      <div className="col-span-10 md:grid-cols-1 justify-center item-center">

        {/* 가입자 수 카드 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"가입자 수"} />
            <dl className="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
              <Div_sub_card title={"총 가입자 수"} value={data.count_joined.val_member_total['0']} unit={"명"} />
              <Div_sub_card title={"올해 가입자 수"} value={data.count_joined.val_member_yearly['0']} unit={"명"}
                            subtitle={"작년"} subvalue={data.count_joined.val_member_yearly_last['0']} />
              <Div_sub_card title={"이번 달 가입자 수"} value={data.count_joined.val_member_monthly['0']} unit={"명"}
                            subtitle={"지난 달"} subvalue={data.count_joined.val_member_monthly_last['0']} />
              <Div_sub_card title={"오늘 가입자 수"} value={data.count_joined.val_member_daily['0']} unit={"명"}
                            subtitle={"어제"} subvalue={data.count_joined.val_member_daily_last['0']} />
            </dl>
          </div>
        </div>

        {/* 등급별 멤버 수 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"등급별 멤버 수"} />
            <dl className="grid grid-cols-5 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
              <Div_sub_card title={data.count_role['0'].name} value={data.count_role['0'].cnt} unit={"명"}/>
              <Div_sub_card title={data.count_role['1'].name} value={data.count_role['1'].cnt} unit={"명"}/>
              <Div_sub_card title={data.count_role['2'].name} value={data.count_role['2'].cnt} unit={"명"}/>
              <Div_sub_card title={data.count_role['3'].name} value={data.count_role['3'].cnt} unit={"명"}/>
              <Div_sub_card title={data.count_role['4'].name} value={data.count_role['4'].cnt} unit={"명"}/>
            </dl>
          </div>
        </div>

        {/* 가입자 수 추이 그래프 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <dl className="flex flex-col justify-center items-start w-full p-4 mx-auto text-gray-900">
              <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full">
                <li className="me-2" onClick={() => draw_chart(data.list_daily, "graph_tab_daily")}>
                  <div className={class_tab_inactive} id="graph_tab_daily">일</div>
                </li>
                <li className="me-2" onClick={() => draw_chart(data.list_monthly, "graph_tab_monthly")}>
                  <div className={class_tab_active} id="graph_tab_monthly">월</div>
                </li>
                <li className="me-2" onClick={() => draw_chart(data.list_yearly, "graph_tab_yearly")}>
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