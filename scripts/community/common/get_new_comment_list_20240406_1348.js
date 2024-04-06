// 최근 댓글
async function get_new_comment_list() {
	function Div_comment_list(props) {
		const comment_list = Object.keys(props.data).map((btn_data) =>  
			<Div_comment data={props.data[btn_data]} />
		)

		return (
			<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
				<Div_box_header title={"최신 댓글"} />

				<div class="flex flex-col justify-center items-start w-full space-y-2">
					{comment_list}
				</div>
			</div>
		)
	}

	const request_data = new FormData();
	request_data.append('tag', url);

	const data = await fetch("/community/ajax_get_new_comment_list/", {
							method: "post", 
							headers: { "X-CSRFToken": getCookie("csrftoken"), },
							body: request_data
							})
							.then(res=> { return res.json(); })
							.then(res=> { return res; });

	ReactDOM.render(<Div_comment_list data={data} />, document.getElementById("div_new_comment_list"))
}