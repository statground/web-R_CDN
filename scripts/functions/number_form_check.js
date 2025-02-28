// 번호 입력 형식 확인
function number_form_check(id="txt_number") {
	// 텍스트박스에 입력한 값 (이메일)
	let number = document.getElementById(id).value.trim()

	// 이메일 체크 정규식
	let regExp = /[^0-9]/g

	// 값이 입력되지 않음
	if (number == "" || number == null) {
		return "NOT EXIST"

	// 이메일 형식 체크 실패
	} else if (regExp.test(number)) {
		return "FAILED"

	// 이메일 형식 체크 성공
	} else {
		return "SUCCESS"

	}
}