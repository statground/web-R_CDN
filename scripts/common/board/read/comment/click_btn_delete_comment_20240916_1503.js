// 댓글 삭제
async function click_btn_delete_comment(uuid_comment) {
	if (confirm("정말로 삭제할까요?")) {
		if (data_comment_upper.map(item => item.uuid).includes(uuid_comment)) {
			ReactDOM.render(<Div_comment_depth1_button_list_loading uuid_comment={uuid_comment} />, document.getElementById("div_comment_footer_" + uuid_comment))
		} else {
			ReactDOM.render(<Div_comment_depth2_button_list_loading uuid_comment={uuid_comment} />, document.getElementById("div_comment_footer_" + uuid_comment))
		}

		const request_data = new FormData();
		request_data.append('uuid', uuid_comment);
		
		await fetch("/blank/ajax_board/delete_comment/", {
					method: "post", 
					headers: { "X-CSRFToken": getCookie("csrftoken"), },
					body: request_data
					})
					.then(res=> { get_read_article_comment(orderID); })
					.then(res=> { return res; });
	}
}