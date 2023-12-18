function set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center w-full space-y-[50px] mt-[50px] px-[100px] py-[20px] md:px-[10px]">
				<div id="div_main_header" class="w-full"></div>
				<div id="div_main_statistics" class="w-full"></div>
				<div id="div_main_event" class="w-full"></div>
				<div id="div_main_board" class="w-full"></div>
			</div>
		)
	}

	// 메인 셋팅
	ReactDOM.render(<Div_main />, document.getElementById("div_main"))

	// 스켈레톤
	ReactDOM.render(<Div_main_header />, document.getElementById("div_main_header"))
	ReactDOM.render(<Div_main_statistics_skeleton />, document.getElementById("div_main_statistics"))
	ReactDOM.render(<Div_main_event />, document.getElementById("div_main_event"))
	ReactDOM.render(<Div_main_board_skeleton />, document.getElementById("div_main_board"))

	// 데이터 불러오기
	get_div_main_statistics()
	get_div_main_board()
}
