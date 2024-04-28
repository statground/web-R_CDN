// 댓글 삭제
async function click_btn_delete_comment(uuid_comment) {
	if (confirm("정말로 삭제할까요?")) {    
		const request_data = new FormData();
		request_data.append('uuid', uuid_comment);
		
		await fetch("/blank/ajax_board/delete_comment/", {
					method: "post", 
					headers: { "X-CSRFToken": getCookie("csrftoken"), },
					body: request_data
					})
					.then(res=> { get_read_article("comment"); })
					.then(res=> { return res; });
	}
}