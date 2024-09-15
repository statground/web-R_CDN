// 댓글 등록
async function click_btn_submit_comment(uuid_comment) {
	if (uuid_comment == null) {
		ReactDOM.render(<Div_btn_comment_editor_footer_button_loading uuid_comment={uuid_comment} />, document.getElementById("btn_comment_editor_footer_button"))
	} else {
		ReactDOM.render(<Div_btn_comment_editor_footer_button_loading uuid_comment={uuid_comment} />, document.getElementById("btn_comment_editor_footer_button_" + uuid_comment))
	}
	

	let txt_content = null
	let chk_secret = null

	if (uuid_comment == null) {
		txt_content = editor["new"].getHTML()
		chk_secret = document.getElementById("chk_secret_new").checked      // true / false
	} else {
		txt_content = editor[uuid_comment].getHTML()
		chk_secret = document.getElementById("chk_secret_" + uuid_comment).checked      // true / false
	}
	
	// 내용을 입력하지 않음
	if (txt_content == null || txt_content == "" || txt_content == "<p><br></p>") {
		alert("내용을 입력해주세요.");

	} else {
		const request_data = new FormData();
		request_data.append('uuid_article', orderID);
		request_data.append('uuid_comment', uuid_comment);
		request_data.append('txt_content', txt_content);
		request_data.append('chk_secret', chk_secret);
		
		await fetch("/blank/ajax_board/insert_comment/", {
				method: "post", 
				headers: { "X-CSRFToken": getCookie("csrftoken"), },
				body: request_data
				})
				.then(res=> { get_read_article_comment(orderID); })
				.then(res=> { return res; });
	}

	if (uuid_comment == null) {
		ReactDOM.render(<Div_btn_comment_editor_footer_button 
							uuid_comment={uuid_comment} 
							function={() => click_btn_submit_comment(uuid_comment)} />, document.getElementById("btn_comment_editor_footer_button"))
	} else {
		ReactDOM.render(<Div_btn_comment_editor_footer_button 
							uuid_comment={uuid_comment} 
							function={() => click_btn_submit_comment(uuid_comment)} />, document.getElementById("btn_comment_editor_footer_button_" + uuid_comment))
	}
}