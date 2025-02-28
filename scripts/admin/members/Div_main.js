function Div_main(props) {
	function Div_payment_list(props) {
		const payment_list = Object.keys(props.data).map((btn_data) =>  
			<div class="flex flex-row justify-between items-center w-full">
				<p>{props.data[btn_data].product_name}</p>
				<p>{props.data[btn_data].amt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")}원 
				   ({props.data[btn_data].cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")}건)</p>
			</div>
		)

		return (
			<div class="flex flex-col justify-center items-center rounded-xl border border-gray-200 space-y-4 w-full p-8">
				<p class="font-extrabold underline">{props.title}</p>
				{payment_list}
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
							<Div_sub_card title={"총 가입자 수"} value={props.data.count_joined.cnt_member_total['0']} unit={"명"} />
							<Div_sub_card title={"올해 가입자 수"} value={props.data.count_joined.cnt_member_yearly['0']} unit={"명"}
										  subtitle={"작년"} subvalue={props.data.count_joined.cnt_member_yearly_last['0']} />
							<Div_sub_card title={"이번 달 가입자 수"} value={props.data.count_joined.cnt_member_monthly['0']} unit={"명"}
										  subtitle={"지난 달"} subvalue={props.data.count_joined.cnt_member_monthly_last['0']} />
							<Div_sub_card title={"오늘 가입자 수"} value={props.data.count_joined.cnt_member_daily['0']} unit={"명"}
										  subtitle={"어제"} subvalue={props.data.count_joined.cnt_member_daily_last['0']} />
						</dl>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"등급별 멤버 수"} />
						<dl class="grid grid-cols-5 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card title={props.data.count_role['0'].name} value={props.data.count_role['0'].cnt} unit={"명"}/>
							<Div_sub_card title={props.data.count_role['1'].name} value={props.data.count_role['1'].cnt} unit={"명"}/>
							<Div_sub_card title={props.data.count_role['2'].name} value={props.data.count_role['2'].cnt} unit={"명"}/>
							<Div_sub_card title={props.data.count_role['3'].name} value={props.data.count_role['3'].cnt} unit={"명"}/>
							<Div_sub_card title={props.data.count_role['4'].name} value={props.data.count_role['4'].cnt} unit={"명"}/>
						</dl>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"가입자 수 추이 그래프"} />
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