/**
 * Integrated admin script for /admin/webr/
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

function Div_sub_card(props) {
	return (
		<div class="flex flex-col items-center justify-center p-4">
			<dt class="text-3xl font-extrabold">
				{props.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",") }{props.unit}
			</dt>
			<dd class="font-light text-gray-500">
				{props.title}
			</dd>
			{
				props.subvalue != null
				?   <dd class="font-light text-gray-500">
						({props.subtitle}: {props.subvalue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")}
						{
							props.subunit == null
							?   props.unit
							:   props.subunit
						})
					</dd>
				:   null
			}

		</div>
	)
}

function Div_sub_card_skeleton(props) {
	return (
		<div class="flex flex-col items-center justify-center">
			<dt class="text-3xl font-extrabold">
				<div class="h-5 bg-gray-300 rounded-full w-48 mb-4"></div>
			</dt>
			<dd class="font-light text-gray-500">
				{props.title}
			</dd>
		</div>            
	)
}

function Div_table_skeleton() {
	function Div_row() {
		return (
			<div class="flex items-center justify-between w-full">
				<div>
					<div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
					<div class="w-32 h-2 bg-gray-200 rounded-full"></div>
				</div>
				<div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
			</div>
		)
	}

	return (
		<div role="status" class="w-full p-4 space-y-4 divide-y divide-gray-200 rounded animate-pulse md:p-6">
			<Div_row /><Div_row /><Div_row /><Div_row /><Div_row />
		</div>
	)
}

function Div_graph_skeleton() {
	return (
		<div class="w-full p-4 rounded animate-pulse md:p-6">
			<div class="flex items-baseline mt-4 space-x-6">
				<div class="w-full bg-gray-200 rounded-t-lg h-72"></div>
				<div class="w-full h-56 bg-gray-200 rounded-t-lg"></div>
				<div class="w-full bg-gray-200 rounded-t-lg h-72"></div>
				<div class="w-full h-64 bg-gray-200 rounded-t-lg"></div>
				<div class="w-full bg-gray-200 rounded-t-lg h-80"></div>
				<div class="w-full bg-gray-200 rounded-t-lg h-72"></div>
				<div class="w-full bg-gray-200 rounded-t-lg h-80"></div>
			</div>
		</div>
	)
}

function Div_main_skeleton(props) {    
	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

			<div class="col-span-10 md:grid-cols-1 justify-center item-center">
				<div id="div_statistics_usage" name="div_statistics_usage"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"Web-R 접속 횟수"} />
						<dl class="grid grid-cols-4 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card_skeleton title={"총 접속 횟수"} />
							<Div_sub_card_skeleton title={"올해 접속 횟수"} />
							<Div_sub_card_skeleton title={"이번 달 접속 횟수"} />
							<Div_sub_card_skeleton title={"오늘 접속 횟수"} />
						</dl>
					</div>
				</div>

				<div id="div_statistics_table_webr" name="div_statistics_table_webr"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"App별 접속 통계"} />
						<dl class="grid grid-cols-2 justify-center items-center w-full p-4 mx-auto text-gray-900">
							<Div_table_skeleton />
							<Div_table_skeleton />
						</dl>
					</div>
				</div>

				<div id="div_statistics_graph" name="div_statistics_graph"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"Web-R 접속 추이 그래프"} />
						<dl class="flex flex-row justify-center items-center w-full p-4 mx-auto text-gray-900">
							<Div_graph_skeleton />
						</dl>
					</div>
				</div>    
			</div>
		</div>
	)
}

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

const GRAPH_TAB_IDS = ['graph_tab_daily', 'graph_tab_monthly', 'graph_tab_yearly'];

function draw_chart(inputData, activeTabId) {
  // 탭 스타일 토글
  GRAPH_TAB_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = (id === activeTabId) ? class_tab_active : class_tab_inactive;
  });

  const el = document.getElementById('div_statistics_graph');
  if (!el) return;

  // 인스턴스 정리
  const prev = echarts.getInstanceByDom(el);
  if (prev) prev.dispose();

  const chart = echarts.init(el, null, { renderer: 'canvas' });

  // 데이터 정렬
  const rows = Object.values(inputData || {}).sort((a, b) => new Date(a.date) - new Date(b.date));
  const categories = rows.map(d => d.date);
  const connects   = rows.map(d => d.cnt_connect || 0);
  const users      = rows.map(d => d.cnt_user || 0);

  const option = {
    title: { text: '이용 추이 그래프', left: 'center', top: 0, textStyle: { fontSize: 24, fontWeight: '700' } },
    legend: { data: ['접속 횟수', '이용자 수'], top: 36 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    toolbox: { right: 10, feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} } },
    grid: { left: 60, right: 60, top: 80, bottom: 60 },
    xAxis: { type: 'category', data: categories },
    yAxis: [{ type: 'value', name: '접속 횟수' }, { type: 'value', name: '이용자 수' }],
    dataZoom: [{ type: 'inside', xAxisIndex: 0 }, { type: 'slider', xAxisIndex: 0 }],
    series: [
      { name: '접속 횟수', type: 'bar', yAxisIndex: 0, data: connects, barMaxWidth: 20 },
      { name: '이용자 수', type: 'bar', yAxisIndex: 1, data: users, barMaxWidth: 20 }
    ]
  };

  chart.setOption(option);

  // 보였다가 그릴 수도 있으니 resize 안전 장치
  requestAnimationFrame(() => chart.resize());
  window.addEventListener('resize', () => chart.resize(), { passive: true });
}

async function get_main() {
  const data = await fetch("/admin/ajax_get_admin_webr/").then(r => r.json());
  ReactDOM.render(
    <Div_main data={data} />,
    document.getElementById("div_main"),
    () => {
      // 렌더 완료 후 기본: 월 탭
      requestAnimationFrame(() => {
        draw_chart(data.list_monthly, "graph_tab_monthly");
      });
    }
  );
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
