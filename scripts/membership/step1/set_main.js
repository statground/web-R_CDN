function set_main() {
	function Div_main() {
		return (
			<div class="w-full">
				<div id="div_intro" class="w-full"></div>
				<div id="div_sub" class="w-full"></div>
			</div>
		)
	}

	// 메인 셋팅
	ReactDOM.render(<Div_main />, document.getElementById("div_main"))

	ReactDOM.render(<Div_intro step={1} />, document.getElementById("div_intro"))
	ReactDOM.render(<Div_sub />, document.getElementById("div_sub"))
}