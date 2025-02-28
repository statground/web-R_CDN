function Div_main() {
	return (
		<div class="flex flex-col justify-center items-center w-full">
			<div class="flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px]
						sm:w-[380px] sm:p-[16px]">
	
				<Div_main_header />
	
				<div class="flex flex-col justify-center items-center text-start w-full space-y-[12px]">
					<div class="w-full space-y-[8px]">
						<span class="font-[500] text-[14px] w-full text-start">
							비밀번호
						</span>
						<input type="password" id="txt_password"
							   class="bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full
									  focus:ring-gray-200 focus:border-gray-200" placeholder=""
									  onkeydown={() => input_checker()} onKeyUp={() => input_checker()} required />
					</div>
					<div class="w-full space-y-[8px]">
						<span class="font-[500] text-[14px] w-full text-start">
							비밀번호 확인
						</span>
						<input type="password" id="txt_password_confirm"
							   class="bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full
									  focus:ring-gray-200 focus:border-gray-200" placeholder=""
									  onkeydown={() => input_checker()} onKeyUp={() => input_checker()} required />
					</div>
	
					<div id="desc_password_msg" class="hidden"></div>
					
					<div id="btn_submit" class="w-full">
						<Div_btn_submit class={class_btn_disabled} function={() => click_btn_submit()} text={"비밀번호 변경"} />
					</div>
				</div>
	
				<div class="flex justify-center items-center w-full">
					<svg width="420" height="2" viewBox="0 0 420 2" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 1H420" stroke="#262626"/>
					</svg>
				</div>
			</div>
		</div>
	)
}