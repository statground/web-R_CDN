// 내가 쓴 글
async function get_my_article_list() {
	function Div_not_login(props) {
		return (
			<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
				<Div_box_header title={"내가 쓴 글"} />

				<span>
					로그인이 필요합니다.
				</span>
			</div>
		)
	}

	function Div_article_list(props) {
		const article_list = Object.keys(props.data).map((btn_data) =>  
			<Div_new_article_list data={props.data[btn_data]} />
		)

		return (
			<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
				<Div_box_header title={"내가 쓴 글"} />

				<div class="flex flex-col justify-center items-start w-full space-y-2">
					{article_list}
				</div>
			</div>
		)
	}

	if (gv_username == "") {
		ReactDOM.render(<Div_not_login />, document.getElementById("div_my_article_list"))
	} else {
		const request_data = new FormData();
		request_data.append('tag', url);
	
		const data = await fetch("/blank/ajax_board/get_my_article_list/", {
								method: "post", 
								headers: { "X-CSRFToken": getCookie("csrftoken"), },
								body: request_data
								})
								.then(res=> { return res.json(); })
								.then(res=> { return res; });
	
		ReactDOM.render(<Div_article_list data={data} />, document.getElementById("div_my_article_list"))
	}
}