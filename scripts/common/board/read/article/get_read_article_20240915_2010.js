async function get_read_article(mode) {
	const request_data = new FormData();
	request_data.append('orderID', orderID);
	
	data_article = await fetch("/blank/ajax_board/get_read_article/", {
				method: "post", 
				headers: { "X-CSRFToken": getCookie("csrftoken"), },
				body: request_data
				})
				.then(res=> { return res.json(); })
				.then(res=> { return res; });
	
	if (mode == "init") {
		set_article()
	}
	
	get_read_article_comment(orderID)
}