// 세미나 등록을 했는지 확인 - 맞으면 true, 틀리면 false
function check_seminar_user(inputdata) {
	if (Object.keys(inputdata.seminar).length == 0) {
		return false
	} else {
		return true
	}
}