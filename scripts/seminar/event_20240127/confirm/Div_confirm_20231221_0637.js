function Div_confirm() {
	let class_txt = "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-primary-500 focus:border-primary-500"

	function Btn_confirm_check_enabled_loading(props) {
		return(
			<button type="button" id="btn_confirm_check" class={class_btn_enabled + " cursor-not-allowed"}>
				<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
				</svg>
				수강신청 확인
			</button>
		)
	}

	function check_input_confirm_check() {
		txt_email = document.getElementById("txt_confirm_email").value.trim()
		txt_name = document.getElementById("txt_confirm_name").value.trim()
		txt_phone = document.getElementById("txt_confirm_phone").value.trim()
	
		// 이메일을 입력하지 않음
		if (email_form_check("txt_confirm_email") == "NOT EXIST") {
			document.getElementById("alert_txt_confirm_email").innerHTML = "이메일을 입력해주세요."
			document.getElementById("alert_txt_confirm_email").className = class_alert_txt
			document.getElementById("alert_txt_confirm_name").className = "hidden"
			document.getElementById("alert_txt_confirm_phone").className = "hidden"
			ReactDOM.render(<Btn_confirm_check_disabled />, document.getElementById("div_confirm_btn_list"))
	
		// 이메일 형식이 잘못됨
		} else if (email_form_check("txt_confirm_email") == "FAILED") {
			document.getElementById("alert_txt_confirm_email").innerHTML = "이메일 형식에 맞게 입력해주세요."
			document.getElementById("alert_txt_confirm_email").className = class_alert_txt
			document.getElementById("alert_txt_confirm_name").className = "hidden"
			document.getElementById("alert_txt_confirm_phone").className = "hidden"
			ReactDOM.render(<Btn_confirm_check_disabled />, document.getElementById("div_confirm_btn_list"))
	
		// 이름
		} else if (txt_name == null || txt_name == "") {
			document.getElementById("alert_txt_confirm_email").className = "hidden"
			document.getElementById("alert_txt_confirm_name").innerHTML = "이름을 입력해주세요."
			document.getElementById("alert_txt_confirm_name").className = class_alert_txt
			document.getElementById("alert_txt_confirm_phone").className = "hidden"
			ReactDOM.render(<Btn_confirm_check_disabled />, document.getElementById("div_confirm_btn_list"))
	
		// 전화번호를 입력하지 않음
		} else if (number_form_check("txt_confirm_phone") == "NOT EXIST") {
			document.getElementById("alert_txt_confirm_email").className = "hidden"
			document.getElementById("alert_txt_confirm_name").className = "hidden"
			document.getElementById("alert_txt_confirm_phone").innerHTML = "전화번호를 입력해주세요."
			document.getElementById("alert_txt_confirm_phone").className = class_alert_txt
			ReactDOM.render(<Btn_confirm_check_disabled />, document.getElementById("div_confirm_btn_list"))
	
		// 전화번호에 숫자가 아닌 값이 입력됨
		} else if (number_form_check("txt_confirm_phone") == "FAILED") {
			document.getElementById("alert_txt_confirm_email").className = "hidden"
			document.getElementById("alert_txt_confirm_name").className = "hidden"
			document.getElementById("alert_txt_confirm_phone").innerHTML = "전화번호에는 숫자만 입력해주세요."
			document.getElementById("alert_txt_confirm_phone").className = class_alert_txt
			ReactDOM.render(<Btn_confirm_check_disabled />, document.getElementById("div_confirm_btn_list"))
	
		// 
		} else {
			document.getElementById("alert_txt_confirm_email").className = "hidden"
			document.getElementById("alert_txt_confirm_name").className = "hidden"
			document.getElementById("alert_txt_confirm_phone").className = "hidden"
			ReactDOM.render(<Btn_confirm_check_enabled />, document.getElementById("div_confirm_btn_list"))
	
		}
	}

	return (
		<div>
			<div class="flex flex-col py-8 px-4 mx-auto w-full lg:py-16 z-1 space-y-4 md:space-y-12">
				<h2 class="text-4xl tracking-tight font-extrabold text-center text-gray-900">
					수강신청 확인
				</h2>

				<div class="flex flex-col justify-center items-center py-8 lg:py-16 px-4 mx-auto w-full space-y-4">
					<div class="w-1/3 md:w-full">
						<label for="txt_confirm_email" class={class_label}>이메일</label>
						<input type="email" id="txt_confirm_email" placeholder="email@example.com" class={class_txt} 
							   onChange={() => check_input_confirm_check()} onKeyUp={() => check_input_confirm_check()} />
						<p id="alert_txt_confirm_email" class="hidden"></p>
					</div>
					<div class="w-1/3 md:w-full">
						<label for="txt_confirm_name" class={class_label}>이름</label>
						<input type="text" id="txt_confirm_name" placeholder="홍길동" class={class_txt} 
							   onChange={() => check_input_confirm_check()} onKeyUp={() => check_input_confirm_check()} />
						<p id="alert_txt_confirm_name" class="hidden"></p>
					</div>
					<div class="w-1/3 md:w-full">
						<label for="txt_confirm_phone" class={class_label}>전화번호</label>
						<input type="text" id="txt_confirm_phone" placeholder="숫자만 입력해주세요." class={class_txt} 
							   onChange={() => check_input_confirm_check()} onKeyUp={() => check_input_confirm_check()} />
						<p id="alert_txt_confirm_phone" class="hidden"></p>
					</div>
				</div>

				<div class="w-full" id="div_confirm_checker"></div>

				<div class="flex flex-col justify-center items-center px-4 mx-auto w-full space-y-4" id="div_confirm_btn_list">
					<button type="button" id="btn_confirm_check" class={class_btn_disabled}>
						수강신청 확인
					</button>
				</div>
			</div>
		</div>
	)
}