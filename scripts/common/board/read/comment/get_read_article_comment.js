async function get_read_article_comment(orderID) {
	const request_data = new FormData();
	request_data.append('orderID', orderID);
	
	data_comment = await fetch("/blank/ajax_board/get_read_article_comment/", {
				method: "post", 
				headers: { "X-CSRFToken": getCookie("csrftoken"), },
				body: request_data
				})
				.then(res=> { return res.json(); })
				.then(res=> { return res; });
	
	set_comment()
}