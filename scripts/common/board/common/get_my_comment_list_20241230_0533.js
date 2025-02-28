// 내가 쓴 댓글
async function get_my_comment_list() {
	const Div_not_login = () => (
		<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
			<Div_box_header title="내가 쓴 댓글" />
			<span>로그인이 필요합니다.</span>
		</div>
	);

	const Div_comment_list = ({data}) => (
		<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
			<Div_box_header title="내가 쓴 댓글" />
			<div className="flex flex-col justify-center items-start w-full space-y-2">
				{Object.values(data).map(comment => (
					<Div_new_comment key={comment.id} data={comment} />
				))}
			</div>
		</div>
	);

	if (!gv_username) {
		ReactDOM.render(<Div_not_login />, document.getElementById("div_my_comment_list"));
		return;
	}

	const request_data = new FormData();
	request_data.append('tag', url);

	const data = await fetch("/blank/ajax_board/get_my_comment_list/", {
		method: "POST", 
		headers: { "X-CSRFToken": getCookie("csrftoken") },
		body: request_data
	}).then(res => res.json());

	ReactDOM.render(<Div_comment_list data={data} />, document.getElementById("div_my_comment_list"));
}