async function click_btn_confirm_check() {    
	if (!toggle_click_btn_confirm_check) {
		// 토글 ON
		toggle_click_btn_confirm_check = true
		ReactDOM.render(<Btn_confirm_check_enabled_loading />, document.getElementById("div_confirm_btn_list"))

		
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

		// 세미나 등록을 하지 않은 경우
		if (!check_seminar_user(data)) {
			alert("신청자 명단에서 확인할 수 없습니다.");
			ReactDOM.render(<Btn_confirm_check_enabled />, document.getElementById("div_confirm_btn_list"))

		
		// 이미 세미나 등록을 한 경우
		} else {
			alert("이미 수강신청이 완료되었습니다.");
			ReactDOM.render(<Btn_confirm_check_enabled />, document.getElementById("div_confirm_btn_list"))

		}


		// 토글 OFF
		toggle_click_btn_confirm_check = false
	}        
}