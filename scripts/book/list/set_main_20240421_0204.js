function set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={"도서"} />
			
				<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
					<div class="w-full" id="div_book_list">
						<div class="flex flex-row justify-center items-center w-full h-[150px] mb-4 bg-gray-300 animate-pulse"></div>
					</div>
					<div class="grid grid-cols-4 w-full gap-4" id="div_book_content">
						<div class="col-span-1 w-full md:col-span-4" id="div_book_info">
							<Div_book_content_skeleton />
						</div>
						<div class="col-span-3 w-full md:col-span-4" id="div_article_list">
							<Div_book_content_skeleton />
						</div>
					</div>
					
				</div>
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	get_book_list()
	get_book_info()
	get_article_list("init")

	window.addEventListener("scroll", () => {
		// 100을 더하면 스크롤을 끝까지 내리기 100px 전에 데이터를 받아올 수 있다.
		const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
	  
		if (isScrollEnded && !toggle_page && ((page_num * 20) < article_counter)) {
			get_article_list("next")
		}
	});
}