function Div_main(props) {
	let list_product_membership = Object.values(props.data.list_product).filter(x => x.product=="membership")
	let list_product_workshop = Object.values(props.data.list_product).filter(x => x.product=="workshop")

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
						<Div_sub_title title={"결제액"} />
						<dl class="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card title={"총 결제액"} value={props.data.count.sum_amount_total['0']} unit={"원"}
										  subtitle={"총 결제 건 수"} subvalue={props.data.count.cnt_amount_total['0']} subunit={"건"}/>
							<Div_sub_card title={"올해 결제액"} value={props.data.count.sum_amount_yearly['0']} unit={"원"}
										  subtitle={"올해 결제 건 수"} subvalue={props.data.count.cnt_amount_yearly['0']} subunit={"건"}/>
							<Div_sub_card title={"이번 달 결제액"} value={props.data.count.sum_amount_monthly['0']} unit={"원"}
										  subtitle={"이번 달 결제 건 수"} subvalue={props.data.count.cnt_amount_monthly['0']} subunit={"건"}/>
							<Div_sub_card title={"오늘 결제액"} value={props.data.count.sum_amount_daily['0']} unit={"원"}
										  subtitle={"오늘 결제 건 수"} subvalue={props.data.count.cnt_amount_daily['0']} subunit={"건"}/>
						</dl>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"결제 항목"} />
						<p>(이번 달 기준)</p>
						<dl class="grid grid-cols-2 justify-center items-start w-full gap-4 p-4 mx-auto text-gray-900">
							<Div_payment_list data={list_product_membership} title={"회원 등급 업그레이드 결제"}/>
							<Div_payment_list data={list_product_workshop} title={"워크샵 결제"}/>
						</dl>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"결제 추이 그래프"} />
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