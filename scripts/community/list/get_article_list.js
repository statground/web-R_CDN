// 최신 글
async function get_article_list() {
	function Div_article_list(props) {
		const article_list = Object.keys(props.data).map((btn_data) =>  
			<Div_article data={props.data[btn_data]} />
		)

		return (
			<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
				<Div_box_header title={"최신 글"} />

				<div class="flex flex-col justify-center items-start w-full space-y-2">
					{article_list}
				</div>
			</div>
		)
	}

	const request_data = new FormData();
	request_data.append('tag', "free");
	request_data.append('page', 1);
	
	const data = await fetch("/community/ajax_get_article_list/", {
					method: "post", 
					headers: { "X-CSRFToken": getCookie("csrftoken"), },
					body: request_data
					})
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	ReactDOM.render(<Div_article_list data={data} />, document.getElementById("div_article_list"))
}