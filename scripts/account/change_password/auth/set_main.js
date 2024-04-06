function set_main() {
	// 스켈레톤
	ReactDOM.render(<Div_main_skeleton />, document.getElementById("div_main"))

	// 인증 코드 확인
	check_auth_code()
}