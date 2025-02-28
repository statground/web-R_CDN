function set_main() {
	let header_subtitle = ""
	if (url == "None") {header_subtitle = "무료 서버 접속"}
	if (url == "member") {header_subtitle = "정회원 서버 접속"}

	function Div_app_skeleton() {
		return (
				<div class="flex flex-col justify-center items-center bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-2">
					<div class="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96">
						<svg class="w-10 h-10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
							<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
						</svg>
					</div>
					<div class="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
				</div> 
		)
	}

	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto
						md:px-8">
				<Div_page_header title={header_subtitle} subtitle={"Web-R 접속"} />
			
				<div id="div_app_list">
					<div class="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1 animate-pulse">
						<Div_app_skeleton /><Div_app_skeleton /><Div_app_skeleton /><Div_app_skeleton /><Div_app_skeleton /><Div_app_skeleton />
					</div>
				</div>
				
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	get_app_list()
}