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
						<a href="/account/change_password/" class="font-[500] text-[14px] cursor-pointer
														hover:underline">
							비밀번호 찾기
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