function Div_submit() {
	let class_txt = "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-primary-500 focus:border-primary-500"

	return (
		<div>
			<div class="flex flex-col py-8 px-4 mx-auto w-full lg:py-16 z-1 space-y-4 md:space-y-12">
				<h2 class="text-4xl tracking-tight font-extrabold text-center text-gray-900">
					수강신청하기
				</h2>
				<p class="mb-8 lg:mb-16 font-light text-center text-gray-500 md:text-md">
					이메일에 Web-R 계정을 입력할 경우, 할인된 수강료가 적용됩니다.
					<br/>
					<span onClick={() => window.open("https://web-r.org/index.php?mid=home&act=dispMemberSignUpForm")}
						class="flex flex-row justify-center items-center text-center w-full text-md font-semibold text-blue-500 hover:underline cursor-pointer">
						Web-R 회원가입
						<svg class="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
					</span>
				</p>

				<div class="flex flex-col justify-center items-center py-8 lg:py-16 px-4 mx-auto w-full space-y-4">
					<div class="w-1/3 md:w-full">
						<label for="txt_submit_email" class={class_label}>이메일</label>
						<input type="email" id="txt_submit_email" placeholder="email@example.com" class={class_txt} 
							   onChange={() => check_input_submit_check()} onKeyUp={() => check_input_submit_check()} />
						<p id="alert_txt_submit_email" class="hidden"></p>
					</div>
					<div class="w-1/3 md:w-full">
						<label for="txt_submit_name" class={class_label}>이름</label>
						<input type="text" id="txt_submit_name" placeholder="홍길동" class={class_txt} 
							   onChange={() => check_input_submit_check()} onKeyUp={() => check_input_submit_check()} />
						<p id="alert_txt_submit_name" class="hidden"></p>
					</div>
					<div class="w-1/3 md:w-full">
						<label for="txt_submit_phone" class={class_label}>전화번호</label>
						<input type="text" id="txt_submit_phone" placeholder="숫자만 입력해주세요." class={class_txt} 
							   onChange={() => check_input_submit_check()} onKeyUp={() => check_input_submit_check()} />
						<p id="alert_txt_submit_phone" class="hidden"></p>
					</div>
				</div>

				<div class="w-full" id="div_submit_checker"></div>

				<div class="flex flex-col justify-center items-center px-4 mx-auto w-full space-y-4" id="div_submit_btn_list">
					<button type="button" id="btn_submit_check" class={class_btn_disabled}>
						수강신청
					</button>
				</div>
			</div>
		</div>
	)
}