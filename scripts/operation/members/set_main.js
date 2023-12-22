function set_main() {
	function Div_main() {
		return (
			<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
				<Div_operation_menu />

				<div class="col-span-10 md:grid-cols-1 justify-center item-center">
					<div id="div_statistics_count" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_statistics_count_skeleton />
					</div>

					<div id="div_statistics_group" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_statistics_group_skeleton />
					</div>

					<div id="div_graph_visitors" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_graph_members_skeleton />
					</div>

					<div id="div_table_members" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_table_members_skeleton />
					</div>
				</div>
			</div>
		)
	}

	// 스켈레톤
	ReactDOM.render(<Div_main />, document.getElementById("div_main"))

	get_members_statistics_count()
	get_members_statistics_group()
	get_graph_members("monthly")
	get_table_members()
}