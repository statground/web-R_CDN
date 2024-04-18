function set_menu() {
	function Div_menu() {
		let class_sub_menu = "flex flex-row justify-center items-center px-4 py-2 cursor-pointer hover:bg-blue-200"

		return (
			<div class="flex flex-row justify-between items-center w-full px-[100px] py-[20px] md:px-[10px]">
				<div class="flex flex-row justify-center items-center">
					<a href="/" class="flex items-center">
						<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/logo/logo.png" class="object-scale-down h-8" alt="Statground Logo" />
					</a>
				</div>
			
				<div class="flex flex-row space-x-4 md:flex-col">
					<a href="/membership/" class={class_sub_menu}>
						<img src="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/menu_membership.svg" class="w-4 h-4 mr-2" />
						정회원 가입
					</a>
			
					<a href="/seminar/" class={class_sub_menu}>
						<img src="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/menu_workshop.svg" class="w-4 h-4 mr-2" />
						워크샵, 세미나
					</a>
			
					<a href="https://www.web-r.org" target="_blank" class={class_sub_menu}>
						<img src="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/menu_homepage.svg" class="w-4 h-4 mr-2" />
						공식 홈페이지
					</a>
				</div>
			</div>
		)
	}

	ReactDOM.render(<Div_menu />, document.getElementById("div_menu"))
}