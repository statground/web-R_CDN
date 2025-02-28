async function get_myinfo_comment_content() {
	//div_tab_comment_content
	function Div_new_comment(props) {
		let category_menu = "community"
		let category_url = "/" + props.data.article_category_url
	
		if (category_url == "/free") {
			category_url = ""
		} else if (category_url == "/book") {
			category_menu = "book"
			category_url = ""
		} else if (category_url == "/workshop") {
			category_menu = "workshop"
			category_url = ""
		} else if (category_url == "/youtube") {
			category_menu = "workshop/"
			category_url = "youtube"
		} else if (category_url == "/notice") {
			category_menu = "intro/"
			category_url = "notice"
		}

		return (
			<div class="bg-white border-b w-full">
				<a href={'/' + category_menu + category_url + '/read/' + props.data.uuid_article + '/'} target="_blank"
					class="flex flex-col px-6 py-4 space-y-2 cursor-pointer hover:bg-gray-100 w-full">
					<div class="flex flex-row justify-start items-center">
						<span class="font-normal text-sm w-fit max-w-full truncate ...">
							{props.data.content.replace(/<[^>]*>?/g, '')}
						</span>
					</div>
	
					<div class="flex flex-row justify-start items-center border border-gray-300 rounded-lg">
						<span class="font-normal text-xs text-gray-500 w-full mr-2 truncate ...">
							<span class="bg-gray-300 px-2 py-1 mr-1">
								원글: 
							</span>
	
							{props.data.article_title}
						</span>
					</div>
	
					<div class="flex flex-wrap justify-start items-center space-x-2">
						<Span_btn_category category={props.data.category_name} />
						<Span_btn_date date={props.data.created_at} />
					</div>
				</a>
			</div>
		)
	}

	function Col(props) {
		const comment_list = Object.keys(props.data).map((btn_data) =>  
			<Div_new_comment data={props.data[btn_data]} />
		)

		return (
			<div class="flex flex-col justify-center items-center rounded-xl space-y-4 w-full">
				<div class="flex flex-col justify-center items-start w-full space-y-2">
					{comment_list}
				</div>
			</div>
		)
	}

	function Col_nothing(props) {
		return (
			<div class="flex flex-col justify-center items-center rounded-xl space-y-4 w-full p-12">
				<p>작성한 댓글이 없습니다.</p>
			</div>
		)
	}

	const tempdata = await fetch("/account/ajax_get_myinfo_comment/")
	.then(res=> { return res.json(); })
	.then(res=> { return res; });

	if (tempdata.count.cnt == 0) {
		ReactDOM.render(<Col_nothing data={tempdata.list} />, document.getElementById("div_tab_comment_content"));
	} else {
		ReactDOM.render(<Col data={tempdata.list} />, document.getElementById("div_tab_comment_content"));
	}
}