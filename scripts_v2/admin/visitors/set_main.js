/**
 * Integrated admin script for /admin/visitors/
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
				<div id="div_statistics_visitors" name="div_statistics_visitors"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"방문자 수"} />
						<dl class="grid grid-cols-4 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card_skeleton title={"총 방문자 수"} />
							<Div_sub_card_skeleton title={"올해 방문자 수"} />
							<Div_sub_card_skeleton title={"이번 달 방문자 수"} />
							<Div_sub_card_skeleton title={"오늘 방문자 수"} />
						</dl>
					</div>
				</div>
			
				<div id="div_statistics_pageview" name="div_statistics_pageview"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"페이지 뷰"} />
						<dl class="grid grid-cols-4 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card_skeleton title={"총 페이지 뷰"} />
							<Div_sub_card_skeleton title={"올해 페이지 뷰"} />
							<Div_sub_card_skeleton title={"이번 달 페이지 뷰"} />
							<Div_sub_card_skeleton title={"오늘 페이지 뷰"} />
						</dl>
					</div>
				</div>

				<div id="div_statistics_graph" name="div_statistics_graph"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"방문 추이 그래프"} />
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

  return (
    <div className="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
      <Div_operation_menu />

      <div className="col-span-10 md:grid-cols-1 justify-center item-center">

        {/* 방문자 수 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"방문자 수"} />
            <dl className="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
              <Div_sub_card title={"총 방문자 수"} value={data.count.val_visitor_total['0']} unit={"명"} />
              <Div_sub_card title={"올해 방문자 수"} value={data.count.val_visitor_yearly['0']} unit={"명"}
                            subtitle={"작년"} subvalue={data.count.val_visitor_yearly_last['0']} />
              <Div_sub_card title={"이번 달 방문자 수"} value={data.count.val_visitor_monthly['0']} unit={"명"}
                            subtitle={"지난 달"} subvalue={data.count.val_visitor_monthly_last['0']} />
              <Div_sub_card title={"오늘 방문자 수"} value={data.count.val_visitor_daily['0']} unit={"명"}
                            subtitle={"어제"} subvalue={data.count.val_visitor_daily_last['0']} />
            </dl>
          </div>
        </div>

        {/* 페이지 뷰 */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 bg-white rounded-lg md:p-8 text-center">
            <Div_sub_title title={"페이지 뷰"} />
            <dl className="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
              <Div_sub_card title={"총 페이지 뷰"} value={data.count.val_pageview_total['0']} unit={"건"} />
              <Div_sub_card title={"올해 페이지 뷰"} value={data.count.val_pageview_yearly['0']} unit={"건"}
                            subtitle={"작년"} subvalue={data.count.val_pageview_yearly_last['0']} />
              <Div_sub_card title={"이번 달 페이지 뷰"} value={data.count.val_pageview_monthly['0']} unit={"건"}
                            subtitle={"지난 달"} subvalue={data.count.val_pageview_monthly_last['0']} />
              <Div_sub_card title={"오늘 페이지 뷰"} value={data.count.val_pageview_daily['0']} unit={"건"}
                            subtitle={"어제"} subvalue={data.count.val_pageview_daily_last['0']} />
            </dl>
          </div>
        </div>

        {/* 방문 추이 그래프 */}
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

const GRAPH_TAB_IDS = ['graph_tab_daily', 'graph_tab_monthly', 'graph_tab_yearly'];

function draw_chart(inputData, activeTabId) {
  // 탭 스타일 토글
  GRAPH_TAB_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = (id === activeTabId) ? class_tab_active : class_tab_inactive;
  });

  // 타겟 엘리먼트
  const el = document.getElementById('div_statistics_graph');
  if (!el) return;

  // 기존 인스턴스 제거 후 재생성
  const prev = echarts.getInstanceByDom(el);
  if (prev) prev.dispose();
  const chart = echarts.init(el, null, { renderer: 'canvas' });

  // 입력 데이터 -> 정렬된 배열
  const rows = Object.values(inputData || {}).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const categories = rows.map(d => d.date);
  const visitors   = rows.map(d => d.avg_visitor || 0);     // 방문자 수
  const pageviews  = rows.map(d => d.cnt_pageview || 0);    // 페이지 뷰

  const option = {
    title: {
      text: '방문 추이 그래프',
      left: 'center',
      top: 0,
      textStyle: { fontSize: 24, fontWeight: '700' }
    },
    legend: { data: ['방문자 수', '페이지 뷰'], top: 36 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    toolbox: {
      right: 10,
      feature: { dataZoom: { yAxisIndex: 'none' }, restore: {}, saveAsImage: {} }
    },
    grid: { left: 60, right: 60, top: 80, bottom: 60 },
    xAxis: { type: 'category', data: categories, axisLabel: { interval: 'auto' } },
    yAxis: [
      { type: 'value', name: '방문자 수' },
      { type: 'value', name: '페이지 뷰' }
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseMove: true },
      { type: 'slider', xAxisIndex: 0 }
    ],
    series: [
      { name: '방문자 수', type: 'bar', yAxisIndex: 0, data: visitors, barMaxWidth: 28 },
      { name: '페이지 뷰', type: 'bar', yAxisIndex: 1, data: pageviews, barMaxWidth: 28 }
    ]
  };

  chart.setOption(option);

  // 보이는 순간/리사이즈 안전장치
  requestAnimationFrame(() => chart.resize());
  window.addEventListener('resize', () => chart.resize(), { passive: true });

  // 컨테이너가 숨김 상태였다가 보일 수도 있는 UI 대비
  if (el.offsetWidth === 0 || el.offsetHeight === 0) {
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        ro.disconnect();
        chart.resize();
      }
    });
    ro.observe(el);
  }
}

async function get_main() {
  const data = await fetch("/admin/ajax_get_admin_visitors/").then(res => res.json());

  ReactDOM.render(
    <Div_main data={data} />,
    document.getElementById("div_main"),
    () => {
      // 렌더가 끝난 뒤 그래프 그리기 (컨테이너 크기 확보)
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
