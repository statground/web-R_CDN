// 이메일 형식 확인 - 이메일 형식이 맞으면 true / 틀리면 false
function email_form_check(id="txt_email") {
	// 텍스트박스에 입력한 값 (이메일)
	let email = document.getElementById(id).value.trim()

	// 이메일 체크 정규식
	let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i

	// 값이 입력되지 않음
	if (email == "" || email == null) {
		return "NOT EXIST"

	// 이메일 형식 체크 실패
	} else if (!regExp.test(email)) {
		return "FAILED"

	// 이메일 형식 체크 성공
	} else {
		return "SUCCESS"

	}
}