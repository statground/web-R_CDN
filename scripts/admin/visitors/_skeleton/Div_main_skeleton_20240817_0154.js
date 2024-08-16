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
							<Div_sub_card_skeleton title={"평균 방문자 수"} />
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