function get_main() {
	function Div_main(props) {
		return (
			<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
				<Div_operation_menu />

				<div class="col-span-10 md:grid-cols-1 justify-center item-center">
					<div class="flex flex-col justify-center items-center w-full space-y-4">
						<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/engineer.svg" class="size-16" />
						<p>관리자 화면입니다. 원하는 메뉴를 선택해주세요.</p>
					</div>
				</div>
			</div>
		)
	}
	
	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
}