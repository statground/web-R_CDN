function set_main() {
	function Div_main() {
		return (
			<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
				<Div_operation_menu />

				<div class="col-span-10 md:grid-cols-1 justify-center item-center">
					<div id="div_statistics_amount" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_statistics_amount_skeleton />
					</div>

					<div id="div_graph_payments" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_graph_payments_skeleton />
					</div>

					<div id="div_table_payments" class="w-full bg-white border border-gray-200 rounded-lg shadow">
						<Div_table_payments_skeleton />
					</div>
				</div>
			</div>
		)
	}

	// 스켈레톤
	ReactDOM.render(<Div_main />, document.getElementById("div_main"))

	get_payments_statistics_amount()
	get_graph_payments("monthly")
	get_table_payments()
}