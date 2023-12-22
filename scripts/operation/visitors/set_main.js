function set_main() {
	function Div_main() {
		return (
			<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
				<Div_operation_menu />

				<div class="col-span-10 md:grid-cols-1 justify-center item-center">
					<div id="div_statistics_vistors" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_statistics_visitors_skeleton />
					</div>

					<div id="div_statistics_pageview" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_statistics_pageview_skeleton />
					</div>

					<div id="div_graph_visitors" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_graph_visitors_skeleton />
					</div>

					<div id="div_table_visitors" name="div_table_visitors"
						 class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_table_visitors_skeleton />
					</div>
				</div>
			</div>
		)
	}

	// 스켈레톤
	ReactDOM.render(<Div_main />, document.getElementById("div_main"))

	get_visitors_statistics_visitors()
	get_visitors_statistics_pageview()
	get_graph_visitors("monthly")
	get_table_visitors("daily")
}