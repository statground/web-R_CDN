async function click_btn_submit() {
	let txt_title = document.getElementById("txt_title").value.trim()
	let sel_book = document.getElementById("sel_book").value
	let txt_content = editor.getHTML()
	let chk_secret = document.getElementById("chk_secret").checked      // true / false

	if (!toggle_click_submit) {
		// 토글 ON
		toggle_click_submit = true
		ReactDOM.render(<Div_button_loading />, document.getElementById("div_button_list"));


		// 제목을 입력하지 않음
		if (txt_title == null || txt_title == "") {
			alert("제목을 입력해주세요.");


		// 도서를 선택하지 않음
		} else if (sel_book == null || sel_book == "" || sel_book == '어떤 책에 관해 이야기 하실건가요?') {
			alert("도서를 선택해주세요.");


		// 내용을 입력하지 않음
		} else if (txt_content == null || txt_content == "" || txt_content == "<p><br></p>") {
			alert("내용을 입력해주세요.");

			
		// 게시글 등록
		} else {
			const request_data = new FormData();
			request_data.append('tag', sel_book);
			request_data.append('txt_title', txt_title);
			request_data.append('txt_content', txt_content);
			request_data.append('chk_secret', chk_secret);
			

			const data = await fetch("/book/ajax_insert_article/", {
								method: "post", 
								headers: { "X-CSRFToken": getCookie("csrftoken"), },
								body: request_data
								})
								.then(res=> { return res.json(); })
								.then(res=> { return res; });

			location.href=init_url + "read/" + data.uuid + "/"
		}


		// 토글 OFF
		toggle_click_submit = false
		ReactDOM.render(<Div_button />, document.getElementById("div_button_list"));
	}
}