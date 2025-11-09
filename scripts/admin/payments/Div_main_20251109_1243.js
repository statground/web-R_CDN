function Div_main(props) {
  const data = props.data;

  // 🔧 여기만 수정: membership/workshop → webr/seminar
  const list_product_membership = Object.values(data.list_product).filter(x => x.product === "webr");
  const list_product_workshop   = Object.values(data.list_product).filter(x => x.product === "seminar");

  function Div_payment_list({ data, title }) {
    const payment_list = Object.keys(data).map((k) => (
      <div className="flex flex-row justify-between items-center w-full" key={k}>
        <p>{data[k].product_name}</p>
        <p>
          {data[k].amt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원
          {' '}
          ({data[k].cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}건)
        </p>
      </div>
    ));

    return (
      <div className="flex flex-col justify-center items-center rounded-xl border border-gray-200 space-y-4 w-full p-8">
        <p className="font-extrabold underline">{title}</p>
        {payment_list.length > 0 ? payment_list : <p className="text-gray-400">표시할 항목이 없습니다.</p>}
      </div>
    );
  }

  function Div_sub_title(props) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-2xl font-extrabold">{props.title}</p>
      </div>
    )
  }

  function Div_sub_card(props) {
    let value = props.value;
    let subvalue = props.subvalue;
    const unit = props.unit ? props.unit : "";
    const subunit = props.subunit ? props.subunit : "";

    if (value === undefined || value === null || value === "") value = 0;
    if (subvalue === undefined || subvalue === null || subvalue === "") subvalue = 0;

    return (
      <div className="flex flex-col justify-center items-center rounded-xl space-y-2 w-full p-6">
        <dt className="mb-2 text-3xl md:text-3xl font-extrabold">{value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{unit}</dt>
        <dd className="text-gray-500">
          {props.title}<br />
          <span className="text-xs">({props.subtitle} : {subvalue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{subunit})</span>
        </dd>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 md:grid-cols-1 justify-center items-start w-full px-[100px] py-[20px] md:px-[10px]">
        <div className="col-span-2 self-start">
            <Div_operation_menu />
        </div>

      <div className="col-span-10 md:grid-cols-1 justify-center item-center">
        {/* 결제액 카드 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"결제액"} />
            <dl className="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
              <Div_sub_card title={"총 결제액"} value={data.count.sum_amount_total['0']} unit={"원"}
                            subtitle={"총 결제 건 수"} subvalue={data.count.cnt_amount_total['0']} subunit={"건"} />
              <Div_sub_card title={"올해 결제액"} value={data.count.sum_amount_yearly['0']} unit={"원"}
                            subtitle={"올해 결제 건 수"} subvalue={data.count.cnt_amount_yearly['0']} subunit={"건"} />
              <Div_sub_card title={"이번 달 결제액"} value={data.count.sum_amount_monthly['0']} unit={"원"}
                            subtitle={"이번 달 결제 건 수"} subvalue={data.count.cnt_amount_monthly['0']} subunit={"건"} />
              <Div_sub_card title={"오늘 결제액"} value={data.count.sum_amount_daily['0']} unit={"원"}
                            subtitle={"오늘 결제 건 수"} subvalue={data.count.cnt_amount_daily['0']} subunit={"건"} />
            </dl>
          </div>
        </div>

        {/* 결제 항목 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"결제 항목"} />
            <p>(이번 달 기준)</p>
            <dl className="grid grid-cols-2 justify-center items-start w-full gap-4 p-4 mx-auto text-gray-900">
              <Div_payment_list data={list_product_membership} title={"회원 등급 업그레이드 결제"} />
              <Div_payment_list data={list_product_workshop}   title={"워크샵 결제"} />
            </dl>
          </div>
        </div>

        {/* 결제 추이 그래프 */}
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