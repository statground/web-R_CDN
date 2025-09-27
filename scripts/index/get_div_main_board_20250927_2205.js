async function get_div_main_board(){
    function Div_new_article_list(props) {
        let category_menu = "community"
        let category_url = "/" + props.data.category_url
        let category_title = '커뮤니티'
        let category_title_color = 'bg-blue-100 text-blue-700 border-blue-300'

        if (category_url == "/free") {
            category_url = ""
            category_title = '자유게시판'
            category_title_color = 'bg-blue-100 text-blue-700 border-blue-300'
        } else if (category_url == "/book") {
            category_menu = "book"
            category_url = ""
            category_title = '도서'
            category_title_color = 'bg-blue-100 text-blue-700 border-blue-300'
        } else if (category_url == "/workshop") {
            category_menu = "workshop"
            category_url = ""
            category_title = '워크샵'
            category_title_color = 'bg-orange-100 text-orange-700 border-orange-300'
        } else if (category_url == "/youtube") {
            category_menu = "workshop/"
            category_url = "youtube"
            category_title = '유튜브'
            category_title_color = 'bg-red-100 text-red-700 border-red-300'
        } else if (category_url == "/notice") {
            category_menu = "intro/"
            category_url = "notice"
            category_title = '공지사항'
            category_title_color = 'bg-teal-100 text-teal-700 border-teal-300'
        }

        return (
            <div class="bg-white border-b w-full">
                <a href={'/' + category_menu + category_url + '/read/' + props.data.uuid + '/'}
                class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
                    <div class="flex flex-row justify-start items-center space-x-2">
                        <span class={"px-3 py-1 border rounded-full text-sm font-bold w-fit max-w-9/12" + category_title_color}>
                            {category_title} 
                        </span>
                        <span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
                            {props.data.title}
                        </span>

                        <Span_btn_article_new toggle={props.data.is_new} />
                        <Span_btn_article_secret toggle={props.data.is_secret} />
                        <Span_btn_my_article toggle={props.data.check_reader} />
                    </div>
                    <div class="flex flex-wrap justify-start items-center space-x-2">
                        <Span_btn_user user_nickname={props.data.user_nickname} role={props.data.user_role} />
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
			<div class="w-full">
				<h5 class="mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900">커뮤니티</h5>
				<div class="rounded-lg border bg-white">
                    {articleList}
				</div>
			</div>
		)
	}

	const data = await fetch("/ajax_index_board/")
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

	ReactDOM.render(<Col data={data} title="커뮤니티"/>, document.getElementById("div_main_board_free"));
}