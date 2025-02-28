async function click_btn_submit_check() {
	// Web-R 유저인지 확인 - 맞으면 true, 틀리면 false
	function check_webr_user(inputdata) {
		if (Object.keys(inputdata.webr).length == 0) {
			return false
		} else {
			return true
		}
	}

	// 세미나 등록을 했는지 확인 - 맞으면 true, 틀리면 false
	function check_seminar_user(inputdata) {
		if (Object.keys(inputdata.seminar).length == 0) {
			return false
		} else {
			return true
		}
	}

	if (!toggle_click_btn_submit_check) {
		// 토글 ON
		toggle_click_btn_submit_check = true
		ReactDOM.render(<Btn_submit_check_enabled_loading />, document.getElementById("div_submit_btn_list"))

		
		// 데이터 가져오기
		const request_data = new FormData();
		request_data.append('txt_email', txt_email);
		request_data.append('txt_name', txt_name);
		request_data.append('txt_phone', txt_phone);

		const data = await fetch("/seminar/ajax_check_registrator/", {
							method: "post", 
							headers: { "X-CSRFToken": getCookie("csrftoken"), },
							body: request_data
							})
							.then(res=> { return res.json(); })
							.then(res=> { return res; });
		console.log(data)

		// 세미나 등록을 하지 않은 경우
		if (!check_seminar_user(data)) {
			ReactDOM.render(<Div_submit_step2 toggle_webr_user={check_webr_user(data)} />, document.getElementById("div_content"))

		
		// 이미 세미나 등록을 한 경우
		} else {
			alert("이미 수강신청이 완료되었습니다.");
			ReactDOM.render(<Btn_submit_check_enabled />, document.getElementById("div_submit_btn_list"))

		}


		// 토글 OFF
		toggle_click_btn_submit_check = false
	}        
}