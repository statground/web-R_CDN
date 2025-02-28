async function get_userinfo() {
	let class_tab_active = "inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active cursor-pointer"

	function Div_main_userinfo(props) {
		return (
			<div class="grid grid-cols-5 justify-center items-start gap-8 w-full md:grid-cols-1">
				<div class="flex flex-col justify-center items-center border border-blue-100 rounded-xl w-full px-4 py-8 space-y-2">
					<p class="text-sm">{props.data.email}</p>
					<p class="text-2xl font-extrabold">{props.data.name}</p>
					<p class="text-sm">{props.data.realname}　|　{props.data.gender}</p>
					

					<div class="py-4"></div>

					<p class="text-lg font-extrabold">{props.data.role}</p>
					<p class="text-sm">가입 일자: {props.data.date_joined}</p>

					{
						props.data.expired_at == null
						?   <p class="text-sm">회원등급 만료일: 무제한</p>
						:   <p class="text-sm">회원등급 만료일: {props.data.expired_at}</p>
					}

					<div class="py-4"></div>

					{
						props.data.email_subscription == 1
						?   <p class="text-sm text-green-500">이메일 수신 허용</p>
						:   <p class="text-sm text-gray-500">이메일 수신 거부</p>
					}

					<div class="py-4"></div>

					<div class="w-full" id="div_buttons">
						<Div_buttons />
					</div>
				</div>

				
				<div class="col-span-4 flex flex-col justify-start items-start rounded-xl w-full md:col-span-1">
					<ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full">
						<li class="me-2">
							<p class={class_tab_active}>내 정보 수정</p>
						</li>
					</ul>

					<div class="grid grid-cols-2 gap-4 justify-center items-center w-full p-4">
						<div class="flex flex-col w-full">
							<label for="txt_name" class="block mb-2 text-sm font-medium text-gray-900">닉네임</label>
							<input type="text" id="txt_name"
								   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500" />
						</div>
						<div class="flex flex-col w-full">
							<label for="txt_realname" class="block mb-2 text-sm font-medium text-gray-900">본명</label>
							<input type="text" id="txt_realname"
								   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500" />
						</div>
						<div class="col-span-2 flex flex-col w-full">
							<label for="txt_email" class="block mb-2 text-sm font-medium text-gray-900">이메일 (로그인 할 때 계정이 함께 변경됩니다.)</label>
							<input type="text" id="txt_email"
								   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500" />
						</div>

						<div class="col-span-2 flex flex-col w-full">
							<h3 class="block mb-2 text-sm font-medium text-gray-900">성별</h3>
							<ul class="flex flex-row justify-center items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg space-x-4">
								<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
									<div class="flex items-center ps-3">
										<input id="rad_gender_male" type="radio" value="Male" name="rad_gender" 
											   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
										<label for="rad_gender_male" 
											   class="w-full py-3 ms-2 text-sm font-medium text-gray-900">남성</label>
									</div>
								</li>
								<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
									<div class="flex items-center ps-3">
										<input id="rad_gender_female" type="radio" value="Female" name="rad_gender" 
											   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
										<label for="rad_gender_female" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">여성</label>
									</div>
								</li>
							</ul>
						</div>

						<div class="col-span-2 flex flex-col w-full">
							<h3 class="block mb-2 text-sm font-medium text-gray-900">이메일 수신 허용</h3>
							<ul class="flex flex-row justify-center items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg space-x-4">
								<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
									<div class="flex items-center ps-3">
										<input id="rad_email_subscription_agree" type="radio" value={1} name="rad_email_subscription" 
											   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
										<label for="rad_email_subscription_agree" 
											   class="w-full py-3 ms-2 text-sm font-medium text-gray-900">허용</label>
									</div>
								</li>
								<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
									<div class="flex items-center ps-3">
										<input id="rad_email_subscription_deny" type="radio" value={0} name="rad_email_subscription" 
											   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
										<label for="rad_email_subscription_deny" class="w-full py-3 ms-2 text-sm font-medium text-gray-900">거부</label>
									</div>
								</li>
							</ul>
						</div>
						
					</div>
				</div>
			</div>
		)
	}

	data = await fetch("/account/ajax_get_myinfo/")
				.then(res=> { return res.json(); })
				.then(res=> { return res; });

	ReactDOM.render(<Div_main_userinfo data={data} />, document.getElementById("div_main_userinfo"))

	document.getElementById("txt_name").value = data.name
	document.getElementById("txt_realname").value = data.realname
	document.getElementById("txt_email").value = data.email

	if (data.gender == "Male") {
		document.getElementById("rad_gender_male").checked = true
	} else if (data.gender == "Female") {
		document.getElementById("rad_gender_female").checked = true
	}

	if (data.email_subscription == 0) {
		document.getElementById("rad_email_subscription_deny").checked = true
	} else {
		document.getElementById("rad_email_subscription_agree").checked = true
	}
}