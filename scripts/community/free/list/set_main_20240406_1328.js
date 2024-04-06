function set_main() {
	let header_subtitle = ""
	if (url == "free") {
		header_subtitle = "자유 게시판 / 묻고 답하기"
	} else if (url == "visitor") {
		header_subtitle = "가입 인사 / 방명록"
	} else if (url == "youtube") {
		header_subtitle = "유튜브"
	}

	function Div_main() {
		let init_url = "/community/"
		if (url != "free") {init_url += url + "/"}

		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={header_subtitle} subtitle={"커뮤니티"} />
			
				<div id="div_community_list" class="flex flex-col justify-center items-center w-full space-y-4">
					<div class="grid grid-cols-3 justify-center items-start w-full gap-4 md:grid-cols-1">
						<div id="div_article_list" class="col-span-2 w-full">
							<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
								<Div_box_header title={"최신 글"} />
							</div>
						</div>

						<div class="flex flex-col justify-center items-start w-full space-y-4">
							<button type="button" onClick={() => location.href=init_url + 'write/'}
									class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
											hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
								글쓰기
							</button>

							<div class="flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl">
								<p class="flex flex-row text-start w-full">검색</p>
								<input type="text" id="txt_search" 
									   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5
											  focus:ring-blue-500 focus:border-blue-500" />

								<div class="flex flex-row justify-end items-center w-full">
									<button type="button" onClick={() => click_btn_search()}
											class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center me-2 mb-2
												   hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300">
										검색
									</button>
								</div>
							</div>
							
							<Div_sidelist_skeleton id={"div_article_famous_list"} title={"최근 인기 글"} />
							<Div_sidelist_skeleton id={"div_new_comment_list"} title={"최근 댓글"} />
							<Div_sidelist_skeleton id={"div_my_article_list"} title={"내가 쓴 글"} />
							<Div_sidelist_skeleton id={"div_my_comment_list"} title={"내가 쓴 댓글"} />
							<Div_sidelist_skeleton id={"div_to_me_comment_list"} title={"나에게 쓴 댓글"} />

						</div>
					</div>
				</div>
				
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	get_article_list("init")
	get_article_famous_list()
	get_new_comment_list()
	get_my_article_list()
	get_my_comment_list()
	get_to_me_comment_list()

	window.addEventListener("scroll", () => {
		// 100을 더하면 스크롤을 끝까지 내리기 100px 전에 데이터를 받아올 수 있다.
		const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
	  
		if (isScrollEnded && !toggle_page && ((page_num * 20) < article_counter)) {
			get_article_list("next", url)
		}
	});
}