async function check_auth_code() {
	// 인증 코드
	const inputData = new FormData();
	inputData.append('auth_code', auth_code);

	data_user = await fetch("/account/ajax_check_auth_code/", {
							method: "post", 
							headers: {"X-CSRFToken": getCookie("csrftoken"),},
							body: inputData
						})
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

	if (data_user.status == "EXPIRED" || data_user.checker == "EXPIRED") {
		ReactDOM.render(<Div_main_Error text={"인증 코드가 만료되었습니다."} />, document.getElementById("div_main"))
	} else {
		ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	}
}