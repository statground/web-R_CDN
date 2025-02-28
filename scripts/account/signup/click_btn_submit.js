async function click_btn_submit() {
	if (!toggle_signup_btn_submit) {
		// 토글 ON
		toggle_signup_btn_submit = true

		// Spinner
		ReactDOM.render(<Div_btn_submit_spinner class={class_btn_enabled + " cursor-not-allowed"} function={null} text={"회원 가입"} />, document.getElementById("btn_submit"))

		// 텍스트박스에 입력한 값
		const inputData = new FormData();
		inputData.append('txt_email', document.getElementById("txt_email").value.trim());
		inputData.append('txt_password', document.getElementById("txt_password").value.trim());
		inputData.append('txt_name', document.getElementById("txt_name").value.trim());
		inputData.append('sel_gender', document.getElementById("sel_gender").value.trim());
		inputData.append('txt_affiliation', document.getElementById("txt_affiliation").value.trim());
		inputData.append('txt_title', document.getElementById("txt_title").value.trim());

		const data = await fetch("/account/ajax_signup/", {
							method: "post", 
							headers: {
								"X-CSRFToken": getCookie("csrftoken"),
							},
							body: inputData
						})
						.then(res=> { return res.json(); })
						.then(res=> { return res; });
		
		if (data.checker == "EXIST") {
			alert("You have already signed up using that email.")

			// Spinner 제거
			ReactDOM.render(<Div_btn_submit class={class_btn_enabled} function={() => click_btn_submit()} text={"Sign Up"} />, document.getElementById("btn_submit"))

		} else {
			location.href="/account/welcome/"

		}
		
		
		// 토글 ON
		toggle_signup_btn_submit = false
	}
	
}