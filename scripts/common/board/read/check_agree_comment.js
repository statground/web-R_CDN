function check_agree_comment(is_secret, check_reader) {
	if (gv_username == "" || (is_secret == 1 && check_reader == "user")) {
		return false
	} else {
		return true
	}
}