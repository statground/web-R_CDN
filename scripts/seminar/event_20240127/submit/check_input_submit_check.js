function check_input_submit_check() {
	txt_email = document.getElementById("txt_submit_email").value.trim()
	txt_name = document.getElementById("txt_submit_name").value.trim()
	txt_phone = document.getElementById("txt_submit_phone").value.trim()

	// 이메일을 입력하지 않음
	if (email_form_check("txt_submit_email") == "NOT EXIST") {
		document.getElementById("alert_txt_submit_email").innerHTML = "이메일을 입력해주세요."
		document.getElementById("alert_txt_submit_email").className = class_alert_txt
		document.getElementById("alert_txt_submit_name").className = "hidden"
		document.getElementById("alert_txt_submit_phone").className = "hidden"
		ReactDOM.render(<Btn_submit_check_disabled />, document.getElementById("div_submit_btn_list"))

	// 이메일 형식이 잘못됨
	} else if (email_form_check("txt_submit_email") == "FAILED") {
		document.getElementById("alert_txt_submit_email").innerHTML = "이메일 형식에 맞게 입력해주세요."
		document.getElementById("alert_txt_submit_email").className = class_alert_txt
		document.getElementById("alert_txt_submit_name").className = "hidden"
		document.getElementById("alert_txt_submit_phone").className = "hidden"
		ReactDOM.render(<Btn_submit_check_disabled />, document.getElementById("div_submit_btn_list"))

	// 이름
	} else if (txt_name == null || txt_name == "") {
		document.getElementById("alert_txt_submit_email").className = "hidden"
		document.getElementById("alert_txt_submit_name").innerHTML = "이름을 입력해주세요."
		document.getElementById("alert_txt_submit_name").className = class_alert_txt
		document.getElementById("alert_txt_submit_phone").className = "hidden"
		ReactDOM.render(<Btn_submit_check_disabled />, document.getElementById("div_submit_btn_list"))

	// 전화번호를 입력하지 않음
	} else if (number_form_check("txt_submit_phone") == "NOT EXIST") {
		document.getElementById("alert_txt_submit_email").className = "hidden"
		document.getElementById("alert_txt_submit_name").className = "hidden"
		document.getElementById("alert_txt_submit_phone").innerHTML = "전화번호를 입력해주세요."
		document.getElementById("alert_txt_submit_phone").className = class_alert_txt
		ReactDOM.render(<Btn_submit_check_disabled />, document.getElementById("div_submit_btn_list"))

	// 전화번호에 숫자가 아닌 값이 입력됨
	} else if (number_form_check("txt_submit_phone") == "FAILED") {
		document.getElementById("alert_txt_submit_email").className = "hidden"
		document.getElementById("alert_txt_submit_name").className = "hidden"
		document.getElementById("alert_txt_submit_phone").innerHTML = "전화번호에는 숫자만 입력해주세요."
		document.getElementById("alert_txt_submit_phone").className = class_alert_txt
		ReactDOM.render(<Btn_submit_check_disabled />, document.getElementById("div_submit_btn_list"))

	// 
	} else {
		document.getElementById("alert_txt_submit_email").className = "hidden"
		document.getElementById("alert_txt_submit_name").className = "hidden"
		document.getElementById("alert_txt_submit_phone").className = "hidden"
		ReactDOM.render(<Btn_submit_check_enabled />, document.getElementById("div_submit_btn_list"))

	}
}