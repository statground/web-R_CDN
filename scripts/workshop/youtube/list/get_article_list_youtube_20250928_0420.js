// 최신 글
async function get_article_list_youtube(mode) {
    function Div_new_article_list_youtube(props) {
	return (
		<div class="bg-white border-b w-full">
			<a href={init_url + 'read/' + props.data.uuid + '/'}
			class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
				<div class="flex justify-center items-center w-full">
					<img src={props.data.youtube_thumbnail} alt="YouTube Thumbnail" class="w-full h-auto object-cover" />
				</div>
				<div class="flex flex-row justify-start items-center space-x-2">
					<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
						{props.data.title}
					</span>

					<Span_btn_article_read cnt_read={props.data.cnt_read} />
					<Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
                    <Span_btn_date date={props.data.created_at} />
				</div>
			</a>
		</div>
	)
}


	function Div_article_list(props) {
		const article_list = Object.keys(props.data).map((btn_data) =>  
			<Div_new_article_list_youtube data={props.data[btn_data]} />
		)

		return (
			<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
				<Div_box_header title={"최신 글"} />

				<div class="grid grid-cols-3 justify-center items-start w-full space-y-2 md:grid-cols-1">
					{article_list}
					<div id={"div_article_list_" + (page_num + 1).toString()} class="w-full"></div>
				</div>
			</div>
		)
	}

	function Div_article_list_next(props) {
		const article_list = Object.keys(props.data).map((btn_data) =>  
			<Div_new_article_list data={props.data[btn_data]} />
		)

		return (
			<div class="flex flex-col justify-center items-start w-full space-y-2">
				{article_list}
				<div id={"div_article_list_" + (page_num + 1).toString()} class="w-full"></div>
			</div>
		)
	}


	// 토글 ON
	toggle_page = true
	const request_data = new FormData();
	request_data.append('tag', url);
	request_data.append('tag_sub', sub);

	if (mode == "init") { 
		page_num = 1 
		ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list"))

	} else if (mode =="search") {
		page_num = 1 
		ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list"))

		request_data.append('txt_search', document.getElementById("txt_search").value.trim());
	} else {
		page_num += 1
		ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list_" + page_num.toString()))
	}

	request_data.append('page', page_num);
	
	const data = await fetch("/blank/ajax_board/get_article_list/", {
					method: "post", 
					headers: { "X-CSRFToken": getCookie("csrftoken"), },
					body: request_data
					})
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

		
	article_counter = data["count"].cnt
	if (mode == "init" || mode == "search") {
		ReactDOM.render(<Div_article_list data={data.list} />, document.getElementById("div_article_list"))
	} else {
		ReactDOM.render(<Div_article_list_next data={data.list} />, document.getElementById("div_article_list_" + page_num.toString()))
	}


	// 토글 OFF
	toggle_page = false
}