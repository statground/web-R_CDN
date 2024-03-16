// 비밀번호 형식 확인 - 형식이 맞으면 true / 틀리면 false
function password_form_check(id="txt_password", max_len = 8) {
	// 텍스트박스에 입력한 값 (이메일)
	let passwd = document.getElementById(id).value.trim()

	// 값이 입력되지 않음
	if (passwd == "" || passwd == null) {
		return "NOT EXIST"

	// 비
	} else if (passwd.length < max_len) {
		return "FAILED"

	// 이메일 형식 체크 성공
	} else {
		return "SUCCESS"

	}
}