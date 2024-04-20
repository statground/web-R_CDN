async function get_article_read() {
	const request_data = new FormData();
	request_data.append('orderID', orderID);
	
	const data = await fetch("/community/ajax_get_read_article/", {
						method: "post", 
						headers: { "X-CSRFToken": getCookie("csrftoken"), },
						body: request_data
						})
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

	document.getElementById("txt_title").value = data.article.title
	editor.setHTML(data.article.content)
	if (data.article.is_secret == 1) {
		document.getElementById("chk_secret").checked = true
	}
}