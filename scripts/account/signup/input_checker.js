function input_checker() {
	let class_desc_msg = "flex flex-row justify-start items-center w-full"
	
	// 메시지 초기화
	document.getElementById("desc_email_msg").className = "hidden"
	document.getElementById("desc_password_msg").className = "hidden"
	document.getElementById("desc_password_confirm_msg").className = "hidden"
	document.getElementById("desc_name_msg").className = "hidden"
	document.getElementById("desc_affiliation_msg").className = "hidden"
	document.getElementById("desc_title_msg").className = "hidden"
	ReactDOM.render(<Div_btn_submit id={"btn_submit"} class={class_btn_disabled} function={null} text={"Sign Up"} />, document.getElementById("btn_submit"))

	// 이메일을 입력하지 않음
	if (email_form_check("txt_email") == "NOT EXIST") {
		document.getElementById("desc_email_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Please enter your email."/>, document.getElementById("desc_email_msg"))

	// 이메일 형식이 올바르지 않음
	} else if(email_form_check("txt_email") == "FAILED") {
		document.getElementById("desc_email_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Email format is invalid."/>, document.getElementById("desc_email_msg"))


	// 비밀번호를 입력하지 않음
	} else if(password_form_check("txt_password") == "NOT EXIST") {
		document.getElementById("desc_password_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Please enter your password."/>, document.getElementById("desc_password_msg"))

	// 비밀번호의 길이가 8자 미만으로 입력되었음
	} else if(password_form_check("txt_password") == "FAILED") {
		document.getElementById("desc_password_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Password must be at least 8 characters long."/>, document.getElementById("desc_password_msg"))


	// 비밀번호 확인을 입력하지 않음
	} else if(password_form_check("txt_password_confirm") == "NOT EXIST") {
		document.getElementById("desc_password_confirm_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Please enter your password confirm."/>, document.getElementById("desc_password_confirm_msg"))

	// 비밀번호 확인의 길이가 8자 미만으로 입력되었음
	} else if(password_form_check("txt_password_confirm") == "FAILED") {
		document.getElementById("desc_password_confirm_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Password confirm must be at least 8 characters long."/>, document.getElementById("desc_password_confirm_msg"))

	// 비밀번호 확인의 길이가 8자 미만으로 입력되었음
	} else if(document.getElementById("txt_password").value.trim() != document.getElementById("txt_password_confirm").value.trim()) {
		document.getElementById("desc_password_confirm_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Password confirm does not match password."/>, document.getElementById("desc_password_confirm_msg"))


	// 이름이 입력되지 않음
	} else if(document.getElementById("txt_name").value.trim().length <= 0) {
		document.getElementById("desc_name_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Please enter your name."/>, document.getElementById("desc_name_msg"))

	// 소속이 입력되지 않음
	} else if(document.getElementById("txt_affiliation").value.trim().length <= 0) {
		document.getElementById("desc_affiliation_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Please enter your affiliation."/>, document.getElementById("desc_affiliation_msg"))

	// 직위가 입력되지 않음
	} else if(document.getElementById("txt_title").value.trim().length <= 0) {
		document.getElementById("desc_title_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Please enter your title."/>, document.getElementById("desc_title_msg"))

	} else {
		ReactDOM.render(<Div_btn_submit class={class_btn_enabled} function={() => click_btn_submit()} text={"회원 가입"} />, document.getElementById("btn_submit"))
		
	}
}