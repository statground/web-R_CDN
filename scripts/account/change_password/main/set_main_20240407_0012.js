function set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center w-full">
				<div class="flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px]
							sm:w-[380px] sm:p-[16px]">
		
					<div class="text-lg font-bold">
						비밀번호 변경/찾기 (1/2)
					</div>
		
					<div class="flex flex-col justify-center items-center text-start w-full space-y-[12px]">
						<Div_textbox id="email" type="text" title="E-mail" function={() => input_checker()} />
		
						<div id="btn_submit" class="w-full">
							<Div_btn_submit class={class_btn_disabled} function={null} text={"인증 메일 보내기"} />
						</div>
					</div>
		
					<div class="flex justify-center items-center w-full">
						<svg width="420" height="2" viewBox="0 0 420 2" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 1H420" stroke="#262626"/>
						</svg>
					</div>
					
			
					<div class="flex flex-row justify-center items-center space-x-[10px] w-full">
						<a href="/account/" class="font-[500] text-[14px] cursor-pointer
														hover:underline">
							로그인
						</a>
						<span class="font-[500] text-[14px]">
							|
						</span>
						<a href="/account/signup/" class="font-[500] text-[14px] cursor-pointer
														hover:underline">
							회원 가입
						</a>
					</div>
				</div>
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
}