function set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={"도서"} />
			
				<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
					<div class="w-full" id="div_book_list">
						<div class="flex flex-row justify-center items-center w-full h-[150px] mb-4 bg-gray-300 animate-pulse"></div>
					</div>
					<div class="w-full" id="div_book_content">
						<Div_book_content_skeleton />
					</div>
					
				</div>
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	get_book_list()
	get_article_list("init")
}