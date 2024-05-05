async function get_myinfo_article_content() {
	//div_tab_article_content
	function Div_new_article_list(props) {
		let category_menu = "community"
		let category_url = "/" + props.data.category_url
	
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
				<a href={'/' + category_menu + category_url + '/read/' + props.data.uuid + '/'} target="_blank"
				   class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
					<div class="flex flex-row justify-start items-center space-x-2">
						<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
							{props.data.title}
						</span>
	
						<Span_btn_article_new toggle={props.data.is_new} />
						<Span_btn_article_secret toggle={props.data.is_secret} />
						<Span_btn_my_article toggle={props.data.check_reader} />
					</div>
					<div class="flex flex-wrap justify-start items-center space-x-2">
						<Span_btn_category category={props.data.category} />
						<Span_btn_date date={props.data.created_at} />
						<Span_btn_article_read cnt_read={props.data.cnt_read} />
						<Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
					</div>
				</a>
			</div>
		)
	}

	function Col(props) {
		const articleList = Object.keys(props.data).map((article) =>
			<Div_new_article_list data={props.data[article]} />
		)

		return (
			<div class="flex flex-col justify-center text-center content-center w-full space-y-2">
				<table class="flex flex-col justify-center items-center text-sm text-left text-gray-500">
					{articleList}
				</table>
			</div>
		)
	}

	function Col_nothing(props) {
		return (
			<div class="flex flex-col justify-center text-center content-center w-full space-y-2 p-12">
				<p>작성한 글이 없습니다.</p>
			</div>
		)
	}

	const tempdata = await fetch("/account/ajax_get_myinfo_article/")
	.then(res=> { return res.json(); })
	.then(res=> { return res; });
	
	if (tempdata.count.cnt == 0) {
		ReactDOM.render(<Col_nothing data={tempdata.list} />, document.getElementById("div_tab_article_content"));
	} else {
		ReactDOM.render(<Col data={tempdata.list} />, document.getElementById("div_tab_article_content"));
	}
}