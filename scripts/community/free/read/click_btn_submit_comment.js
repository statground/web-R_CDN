// 댓글 등록
async function click_btn_submit_comment(uuid_comment) {
	let uuid_article = data.article.uuid
	let txt_content = null
	let chk_secret = null

	if (uuid_comment == null) {
		txt_content = editor["new"].getHTML()
		chk_secret = document.getElementById("chk_secret_new").checked      // true / false
	} else {
		txt_content = editor[uuid_comment].getHTML()
		chk_secret = document.getElementById("chk_secret_" + uuid_comment).checked      // true / false
	}
	
	const request_data = new FormData();
	request_data.append('uuid_article', uuid_article);
	request_data.append('uuid_comment', uuid_comment);
	request_data.append('txt_content', txt_content);
	request_data.append('chk_secret', chk_secret);
	
	await fetch("/community/ajax_insert_comment/", {
			method: "post", 
			headers: { "X-CSRFToken": getCookie("csrftoken"), },
			body: request_data
			})
			.then(res=> { get_read_article("comment"); })
			.then(res=> { return res; });
}