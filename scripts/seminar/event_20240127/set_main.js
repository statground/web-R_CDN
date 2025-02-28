function set_main(url) {
	function Div_main() {
		return (
			<div class="flex flex-col w-full">
				<div id="div_header" class="w-full"></div>

				<div id="div_seminar_menu" class="w-full"></div>

				<div class="flex flex-col w-full space-y-8">
					<div id="div_content" class="w-full"></div>
				</div>
			</div>
		)
	}

	// 메인 셋팅
	ReactDOM.render(<Div_main />, document.getElementById("div_main"))

	ReactDOM.render(<Div_header />, document.getElementById("div_header"))
	ReactDOM.render(<Div_seminar_menu />, document.getElementById("div_seminar_menu"))
	ReactDOM.render(<Div_intro />, document.getElementById("div_content"))
	if (url == "result") {
		get_result_order_id(payment_key, order_id)

	} else {
		ReactDOM.render(<Div_submit />, document.getElementById("div_content"))
	}
	
}