function Div_main(props) {
	let list_app_free = Object.values(props.data.list_app).filter(x => x.tag_app=="Free")
	let list_app_advance = Object.values(props.data.list_app).filter(x => x.tag_app=="Advance")

	function Div_app_list(props) {
		const app_stat_list = Object.keys(props.data).map((btn_data) =>  
			<div class="flex flex-row justify-between items-center w-full">
				<p>{props.data[btn_data].name_app}</p>
				<p>{props.data[btn_data].cnt_connect.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")}회 
				   ({props.data[btn_data].cnt_user.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")}명)</p>
			</div>
		)

		return (
			<div class="flex flex-col justify-center items-center rounded-xl space-y-4 w-full p-8">
				{app_stat_list}
			</div>
		)
	}

	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

			<div class="col-span-10 md:grid-cols-1 justify-center item-center">
				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"Web-R 접속 횟수"} />
						<dl class="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card title={"총 접속 횟수"} value={props.data.count.cnt_connect_total['0']} unit={"회"}
										  subtitle={"총 이용자 수"} subvalue={props.data.count.cnt_user_total['0']} subunit={"명"}/>
							<Div_sub_card title={"올해 접속 횟수"} value={props.data.count.cnt_connect_yearly['0']} unit={"회"}
										  subtitle={"올해 이용자 수"} subvalue={props.data.count.cnt_user_yearly['0']} subunit={"명"}/>
							<Div_sub_card title={"이번 달 접속자 수"} value={props.data.count.cnt_connect_monthly['0']} unit={"회"}
										  subtitle={"이번 달 이용자 수"} subvalue={props.data.count.cnt_user_monthly['0']} subunit={"명"}/>
							<Div_sub_card title={"오늘 접속 횟수"} value={props.data.count.cnt_connect_daily['0']} unit={"회"}
										  subtitle={"오늘 이용자 수"} subvalue={props.data.count.cnt_user_daily['0']} subunit={"명"}/>
						</dl>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"App별 접속 통계"} />
						<p>(이번 달 기준)</p>
						<dl class="grid grid-cols-2 justify-center items-start w-full p-4 mx-auto text-gray-900">
							<Div_app_list data={list_app_free} />
							<Div_app_list data={list_app_advance} />
						</dl>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"방문 추이 그래프"} />
						<dl class="flex flex-col justify-center items-start w-full p-4 mx-auto text-gray-900">
							<ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full">
								<li class="me-2" onClick={() => draw_chart(data.list_monthly, "graph_tab_monthly", "graph_tab_yearly")}>
									<div class={class_tab_active} id="graph_tab_monthly">월</div>
								</li>
								<li class="me-2" onClick={() => draw_chart(data.list_yearly, "graph_tab_yearly", "graph_tab_monthly")}>
									<div class={class_tab_inactive} id="graph_tab_yearly">년</div>
								</li>
							</ul>
							<div id="div_statistics_graph" name="div_statistics_graph" class="w-full h-[500px] p-8"></div>
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}