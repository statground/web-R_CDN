async function get_div_main_board_notice(){
    function Div_new_notice_list(props) {
        let category_menu = "intro/"
        let category_url = "notice"

        return (
            <div class="bg-white w-full">
                <a href={'/' + category_menu + category_url + '/read/' + props.data.uuid + '/'}
                class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
                    <div class="flex flex-row justify-start items-center space-x-2">
                        <span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
                            {props.data.title}
                        </span>
                    </div>
                    <div class="flex flex-wrap justify-start items-center space-x-2">
                        <Span_btn_date date={props.data.created_at} />
                        <Span_btn_article_new toggle={props.data.is_new} />
                        <Span_btn_article_secret toggle={props.data.is_secret} />
                    </div>
                </a>
            </div>
        )
    }


	function Col(props) {
		const articleList = Object.keys(props.data).map((article) =>
			<Div_new_notice_list data={props.data[article]} />
		)

		return (
			<div class="w-full">
				<h6 class="mb-3 text-base font-semibold text-gray-900">공지사항</h6>
				<div class="rounded-lg bg-white">
                    {articleList}
				</div>
			</div>
		)
	}

	const data = await fetch("/ajax_index_notice/")
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

	ReactDOM.render(<Col data={data} title="공지사항"/>, document.getElementById("div_main_board_notice"));
}