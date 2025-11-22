async function set_main() {
	function Div_main() {    
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto
						md:px-8">
				<Div_page_header title={header_title} subtitle={header_subtitle} />
			
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<div class="grid grid-cols-3 justify-center items-start w-full gap-4 md:grid-cols-1">
						<div class="col-span-2 w-full">
							<div class="w-full" id="div_community_read_header">
								<div class="w-full h-12 bg-gray-300 mb-4 animate-pulse"></div>
							</div>
							<div class="w-full" id="div_community_read_content">
								<div class="w-full h-48 bg-gray-300 mb-4 animate-pulse"></div>
							</div>
							<div class="w-full" id="div_community_read_file">
								<div class="w-full h-12 bg-gray-300 mb-4 animate-pulse"></div>
							</div>
							<div class="w-full" id="div_community_read_comment">
								<div class="w-full h-24 bg-gray-300 animate-pulse"></div>
							</div>
						</div>

						<div class="flex flex-col justify-center items-start w-full space-y-4">
							<div id="div_article_read_buttons" class="w-full"></div>
							
							<Div_sidelist_skeleton id={"div_article_famous_list"} title={"최근 인기 글"} />
							<Div_sidelist_skeleton id={"div_new_comment_list"} title={"최근 댓글"} />
							<Div_sidelist_skeleton id={"div_my_article_list"} title={"내가 쓴 글"} />
							<Div_sidelist_skeleton id={"div_my_comment_list"} title={"내가 쓴 댓글"} />

						</div>
					</div>
				</div>
				
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))

	// 기사 + 댓글 로딩
	try {
		await get_read_article("init")
	} catch (e) {
		console.error("[set_main] get_read_article error:", e)
	}

	// 사이드 리스트들은 독립적으로 불러도 됨
	get_article_famous_list()
	get_new_comment_list()
	get_my_article_list()
	get_my_comment_list()
}
