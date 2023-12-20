// Web-R 유저인지 확인 - 맞으면 true, 틀리면 false
function check_webr_user(inputdata) {
	if (Object.keys(inputdata.webr).length == 0) {
		return false
	} else {
		return true
	}
}