function set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center w-full">
				<div class="flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px]
							sm:w-[380px] sm:p-[16px]">
		
					<div class="text-lg font-bold">
						회원 가입
					</div>
		
					<div class="flex flex-col justify-center items-center text-start w-full space-y-[12px]">
						<Div_textbox id="email" type="text" title="E-mail" function={() => input_checker()} />
						<Div_textbox id="password" type="password" title="비밀번호" function={() => input_checker()} />
						<Div_textbox id="password_confirm" type="password" title="비밀번호 확인" function={() => input_checker()} />
		
						<div class="flex justify-center items-center w-full py-[20px]"></div>
		
						<Div_textbox id="name" type="text" title="닉네임" function={() => input_checker()} />
						<Div_textbox id="realname" type="text" title="본명" function={() => input_checker()} />

						<div class="w-full space-y-[8px]">
							<span class="font-[500] text-[14px] w-full text-start">
								성별
							</span>
			
							<select id="sel_gender"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full">
								<option value="Male" selected >남성</option>
								<option value="Female">여성</option>
							</select>
						</div>

						<div class="flex justify-center items-center w-full py-[20px]"></div>

						<Div_textbox id="affiliation" type="text" title="소속" function={() => input_checker()} />
						<Div_textbox id="title" type="text" title="역할, 직책" function={() => input_checker()} />

						<div id="btn_submit" class="w-full">
							<Div_btn_submit class={class_btn_disabled} function={null} text={"회원 가입"} />
						</div>
					</div>
		
					<div class="flex justify-center items-center w-full">
						<svg width="420" height="2" viewBox="0 0 420 2" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 1H420" stroke="#262626"/>
						</svg>
					</div>
					
					<div class="flex flex-row justify-center items-center space-x-[4px] w-full">
						<span class="font-[500] text-[14px]">
							이미 계정이 있으신가요?
						</span>
						<a href="/account/"
						class="font-[500] text-[14px] text-blue-700 cursor-pointer hover:underline">
							로그인
						</a>
					</div>
				</div>
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
}