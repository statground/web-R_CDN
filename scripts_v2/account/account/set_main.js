let toggle_btn_submit = false

const class_btn_disabled = "text-gray-100 bg-gray-300 font-medium rounded-xl text-sm w-full h-[48px] hover:bg-gray-200 focus:border focus:border-[#FFFFFF] cursor-not-allowed"
const class_btn_enabled = "text-white bg-blue-500 font-medium rounded-xl text-sm w-full h-[48px] hover:bg-blue-400 focus:border focus:border-[#FFFFFF]"

function email_form_check(id = "txt_email") {
	const email = document.getElementById(id).value.trim()
	const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i

	if (email == "" || email == null) {
		return "NOT EXIST"
	} else if (!regExp.test(email)) {
		return "FAILED"
	} else {
		return "SUCCESS"
	}
}

function password_form_check(id = "txt_password", max_len = 8) {
	const passwd = document.getElementById(id).value.trim()

	if (passwd == "" || passwd == null) {
		return "NOT EXIST"
	} else if (passwd.length < max_len) {
		return "FAILED"
	} else {
		return "SUCCESS"
	}
}

function Div_btn_submit(props) {
	return (
		<button type="button" onClick={props.function}
				class={props.class}>
			{props.text}
		</button>
	)
}

function Div_btn_submit_spinner(props) {
	return (
		<button type="button" onClick={props.function}
				class={props.class}>
			<svg class="inline w-4 h-4 mr-3 text-white animate-spin"
				 aria-hidden="true" role="status" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
				<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
			</svg>
			{props.text}
		</button>
	)
}

function Div_desc_err_msg(props) {
	return (
		<span class="text-[#FA5252] text-[12px] font-[500]">{props.text}</span>
	)
}

function Div_textbox(props) {
	return (
		<div class="w-full space-y-[8px]">
			<span class="font-[500] text-[14px] w-full text-start">
				{props.title}
			</span>

			{
				props.type == "text"
				?   <input type="text" id={"txt_" + props.id}
						class="bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full
								focus:ring-gray-200 focus:border-gray-200" placeholder=""
								onkeydown={props.function} onKeyUp={props.function} required />
				:   <input type="password" id={"txt_" + props.id}
						class="bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full
								focus:ring-gray-200 focus:border-gray-200" placeholder=""
								onkeydown={props.function} onKeyUp={props.function} required />
			}

			<div id={"desc_" + props.id + "_msg"} class="hidden"></div>
		</div>
	)
}

function input_checker() {
	const class_desc_msg = "flex flex-row justify-start items-center w-full"

	document.getElementById("desc_email_msg").className = "hidden"
	document.getElementById("desc_password_msg").className = "hidden"

	ReactDOM.render(
		<Div_btn_submit class={class_btn_disabled} function={null} text={"로그인"} />,
		document.getElementById("btn_submit")
	)

	if (email_form_check("txt_email") == "NOT EXIST") {
		document.getElementById("desc_email_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Please enter your email." />, document.getElementById("desc_email_msg"))
	} else if (email_form_check("txt_email") == "FAILED") {
		document.getElementById("desc_email_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Email format is invalid." />, document.getElementById("desc_email_msg"))
	} else if (password_form_check("txt_password") == "NOT EXIST") {
		document.getElementById("desc_password_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Please enter your password." />, document.getElementById("desc_password_msg"))
	} else if (password_form_check("txt_password") == "FAILED") {
		document.getElementById("desc_password_msg").className = class_desc_msg
		ReactDOM.render(<Div_desc_err_msg text="Password must be at least 8 characters long." />, document.getElementById("desc_password_msg"))
	} else {
		ReactDOM.render(
			<Div_btn_submit class={class_btn_enabled} function={() => click_btn_submit()} text={"로그인"} />,
			document.getElementById("btn_submit")
		)
	}
}

async function click_btn_submit() {
	if (toggle_btn_submit) {
		return
	}

	toggle_btn_submit = true
	ReactDOM.render(
		<Div_btn_submit_spinner class={class_btn_enabled + " cursor-not-allowed"} function={null} text={"로그인"} />,
		document.getElementById("btn_submit")
	)

	try {
		const inputData = new FormData()
		inputData.append("txt_email", document.getElementById("txt_email").value.trim())
		inputData.append("txt_password", document.getElementById("txt_password").value.trim())

		const data = await fetch("/account/ajax_signin_email/", {
			method: "post",
			headers: {
				"X-CSRFToken": getCookie("csrftoken"),
			},
			body: inputData
		})
		.then(res => res.json())

		if (data.checker == "NOTEXIST") {
			alert("계정을 확인할 수 없습니다.")
		} else if (data.checker == "WRONGPASSWORD") {
			alert("비밀번호가 틀렸습니다.")
		} else {
			location.href = "/"
			return
		}
	} catch (e) {
		alert("로그인 중 오류가 발생했습니다.")
	} finally {
		if (document.getElementById("btn_submit")) {
			ReactDOM.render(
				<Div_btn_submit class={class_btn_enabled} function={() => click_btn_submit()} text={"로그인"} />,
				document.getElementById("btn_submit")
			)
		}
		toggle_btn_submit = false
	}
}

function set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center w-full">
				<div class="flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px]
							sm:w-[380px] sm:p-[16px]">

					<div class="text-lg font-bold">
						로그인
					</div>

					<div class="flex flex-col justify-center items-center text-start w-full space-y-[12px]">
						<Div_textbox id="email" type="text" title="E-mail" function={() => input_checker()} />
						<Div_textbox id="password" type="password" title="Password" function={() => input_checker()} />

						<div class="flex flex-row justify-center items-center w-full py-[20px] ">
							<svg class="size-8 mr-2" fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>notice1</title> <path d="M15.5 3c-7.456 0-13.5 6.044-13.5 13.5s6.044 13.5 13.5 13.5 13.5-6.044 13.5-13.5-6.044-13.5-13.5-13.5zM15.5 27c-5.799 0-10.5-4.701-10.5-10.5s4.701-10.5 10.5-10.5 10.5 4.701 10.5 10.5-4.701 10.5-10.5 10.5zM15.5 10c-0.828 0-1.5 0.671-1.5 1.5v5.062c0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5v-5.062c0-0.829-0.672-1.5-1.5-1.5zM15.5 20c-0.828 0-1.5 0.672-1.5 1.5s0.672 1.5 1.5 1.5 1.5-0.672 1.5-1.5-0.672-1.5-1.5-1.5z"></path> </g></svg>
							<p class="text-sm ">기존 홈페이지 회원은, 비밀번호를 1회 변경해야 합니다.</p>
						</div>

						<div id="btn_submit" class="w-full">
							<Div_btn_submit class={class_btn_disabled} function={null} text={"로그인"} />
						</div>
					</div>

					<div class="flex justify-center items-center w-full">
						<svg width="420" height="2" viewBox="0 0 420 2" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 1H420" stroke="#262626"/>
						</svg>
					</div>

					<div class="flex flex-row justify-center items-center space-x-[10px] w-full">
						<a href="/account/change_password/" class="font-[500] text-[14px] cursor-pointer hover:underline">
							비밀번호 찾기
						</a>
						<span class="font-[500] text-[14px]">
							|
						</span>
						<a href="/account/signup/" class="font-[500] text-[14px] cursor-pointer hover:underline">
							회원 가입
						</a>
					</div>
				</div>
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
}
