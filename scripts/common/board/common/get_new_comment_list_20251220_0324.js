// 최근 댓글
async function get_new_comment_list() {
	const Div_comment_list = ({data}) => (
		<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
			<Div_box_header title="최신 댓글" />
			<div className="flex flex-col justify-center items-start w-full space-y-2">
				{Object.values(data).map(comment => (
					<Div_new_comment key={comment.id} data={comment} />
				))}
			</div>
		</div>
	);

	const request_data = new FormData();
	// PATCH: sidebar widgets - backend may not support tag='all'
	const _tag = (typeof url !== 'undefined' && url === 'all') ? 'free' : url;
	request_data.append('tag', _tag);
	const data = await fetch("/blank/ajax_board/get_new_comment_list/", {
		method: "POST",
		headers: { "X-CSRFToken": getCookie("csrftoken") },
		body: request_data
	}).then(res => res.json());

	ReactDOM.render(<Div_comment_list data={data} />, document.getElementById("div_new_comment_list"));
}