function Div_seminar_menu() {
	let class_p = "flex flex-row justify-center items-center border-b-2 text-md font-bold border-gray-500 px-2 py-2 rounded-lg shadow cursor-pointer"
	
	function click_seminar_menu(menu) {
		if (menu == "intro") {
			ReactDOM.render(<Div_intro />, document.getElementById("div_content"))

		} else if (menu == "calendar") {
			ReactDOM.render(<Div_calendar />, document.getElementById("div_content"))

		} else if (menu == "lecturer") {
			ReactDOM.render(<Div_lecturer />, document.getElementById("div_content"))

		} else if (menu == "submit") {
			ReactDOM.render(<Div_submit />, document.getElementById("div_content"))

		} else if (menu == "confirm") {
			ReactDOM.render(<Div_confirm />, document.getElementById("div_content"))

		}
	}

	return (
		<div class="flex flex-row justify-center items-center w-full space-x-8 space-y-0 mb-4
					md:grid md:grid-cols-1 md:space-x-0 md:space-y-2">
			<p class={class_p + " hover:bg-blue-100"} onClick={() => click_seminar_menu('intro')}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/class.svg" class="w-6 h-6 mr-3" />
				워크샵 소개
			</p>
			<p class={class_p + " hover:bg-blue-100"} onClick={() => click_seminar_menu('calendar')}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar.svg" class="w-6 h-6 mr-3" />
				일정
			</p>
			<p class={class_p + " hover:bg-blue-100"} onClick={() => click_seminar_menu('lecturer')}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/lecturer.svg" class="w-6 h-6 mr-3" />
				강사 소개
			</p>
			<p class={class_p + " bg-red-100 hover:bg-red-300"} onClick={() => click_seminar_menu('submit')}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/enter.svg" class="w-6 h-6 mr-3" />
				수강신청하기
			</p>
			<p class={class_p + " bg-green-100 hover:bg-green-300"} onClick={() => click_seminar_menu('confirm')}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/confirm.svg" class="w-6 h-6 mr-3" />
				수강신청 확인
			</p>
		</div>
	)
}