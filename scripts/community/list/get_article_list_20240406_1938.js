// 최신 글
async function get_article_list(mode) {
	function Div_article_list(props) {
		const article_list = Object.keys(props.data).map((btn_data) =>  
			<Div_new_article_list data={props.data[btn_data]} />
		)

		return (
			<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
				<Div_box_header title={"최신 글"} />

				<div class="flex flex-col justify-center items-start w-full space-y-2">
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
	
	const data = await fetch("/community/ajax_get_article_list/", {
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