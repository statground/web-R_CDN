async function click_btn_delete() {
	if (confirm("정말로 삭제할까요?")) {
		let init_url = "/community/"
		if (url != "free") {init_url += url + "/"}

		const request_data = new FormData();
		request_data.append('uuid', orderID);
		
		const data = await fetch("/blank/ajax_board/delete_article/", {
							method: "post", 
							headers: { "X-CSRFToken": getCookie("csrftoken"), },
							body: request_data
							})
							.then(res=> { return res.json(); })
							.then(res=> { return res; });
	
		location.href=init_url
	}
}