async function click_btn_submit() {
	let txt_name = document.getElementById("txt_name").value.trim()
	let txt_realname = document.getElementById("txt_realname").value.trim()
	let txt_email = document.getElementById("txt_email").value.trim()
	
	let rad_gender = null
	if (document.getElementById("rad_gender_male").value) {
		rad_gender = "Male"
	} else {
		rad_gender = "Female"
	}

	let rad_email_subscription = null
	if (document.getElementById("rad_email_subscription_deny").value) {
		rad_email_subscription = 0
	} else {
		rad_email_subscription = 1
	}
	

	if (!toggle_click_submit) {
		// 토글 ON
		toggle_click_submit = true
		ReactDOM.render(<Div_buttons_loading />, document.getElementById("div_buttons"));


		// 닉네임을 입력하지 않음
		if (txt_name == null || txt_name == "") {
			alert("닉네임을 입력해주세요.");

		// 본명을 입력하지 않음
		} else if (txt_realname == null || txt_realname == "") {
			alert("본명을 입력해주세요.");

		// 이메일을 입력하지 않음
		} else if (txt_email == null || txt_email == "") {
			alert("이메일을 입력해주세요.");

			
		// 게시글 등록
		} else {
			const request_data = new FormData();
			request_data.append('txt_name', txt_name);
			request_data.append('txt_realname', txt_realname);
			request_data.append('txt_email', txt_email);
			request_data.append('rad_gender', rad_gender);
			request_data.append('rad_email_subscription', rad_email_subscription);
			

			const data = await fetch("/account/ajax_update_userinfo/", {
								method: "post", 
								headers: { "X-CSRFToken": getCookie("csrftoken"), },
								body: request_data
								})
								.then(res=> { return res.json(); })
								.then(res=> { return res; });

			location.href="/account/myinfo/"
		}


		// 토글 OFF
		toggle_click_submit = false
		ReactDOM.render(<Div_buttons />, document.getElementById("div_buttons"));
	}   
}