function Div_main(props) {
	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

			<div class="col-span-10 md:grid-cols-1 justify-center item-center">
				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"방문자 수"} />
						<dl class="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card title={"평균 방문자 수/일"} value={props.data.count.avg_visitor_total['0']} unit={"명"} />
							<Div_sub_card title={"올해 방문자 수/일"} value={props.data.count.avg_visitor_yearly['0']} unit={"명"} 
										  subtitle={"작년"} subvalue={props.data.count.avg_visitor_yearly_last['0']} />
							<Div_sub_card title={"이번 달 방문자 수/일"} value={props.data.count.avg_visitor_monthly['0']} unit={"명"}
										  subtitle={"지난 달"} subvalue={props.data.count.avg_visitor_monthly_last['0']} />
							<Div_sub_card title={"오늘 방문자 수"} value={props.data.count.avg_visitor_daily['0']} unit={"명"} 
										  subtitle={"어제"} subvalue={props.data.count.avg_visitor_daily_last['0']} />
						</dl>
					</div>
				</div>
			
				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"페이지 뷰"} />
						<dl class="grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card title={"총 페이지 뷰"} value={props.data.count.cnt_pageview_total['0']} unit={"건"} />
							<Div_sub_card title={"올해 페이지 뷰"} value={props.data.count.cnt_pageview_yearly['0']} unit={"건"}
										  subtitle={"작년"} subvalue={props.data.count.cnt_pageview_yearly_last['0']} />
							<Div_sub_card title={"이번 달 페이지 뷰"} value={props.data.count.cnt_pageview_monthly['0']} unit={"건"}
										  subtitle={"지난 달"} subvalue={props.data.count.cnt_pageview_monthly_last['0']} />
							<Div_sub_card title={"오늘 페이지 뷰"} value={props.data.count.cnt_pageview_daily['0']} unit={"건"}
										  subtitle={"어제"} subvalue={props.data.count.cnt_pageview_daily_last['0']} />
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