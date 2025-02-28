function Div_intro(props) {
	function Div_li_step(props) {
		return (
			<li class={
						props.enabled
						?   "flex items-center font-semibold text-blue-600"
						:   "flex items-center"
					  }>
				<span class={
								props.enabled
								?   "flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full shrink-0"
								:   "flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full shrink-0"
							}>
					{props.number}
				</span>
				<span>{props.text}</span>

				{
					props.next
					?   <svg aria-hidden="true" class="w-4 h-4 ml-2 sm:ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
					:   ""
				}
			</li>                    
		)
	}

	return (
		<div class="flex flex-row pt-12 justify-center">
			<div class="container m-auto">
				<div class="grid grid-cols-1 mx-auto">
					<div class="basis text-center justify-center place-content-center content-center m-auto">
						<div>
							<h3 class="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-1xl lg:text-3xl dark:text-white">
								Web-R 정회원 등록/연장
							</h3>
		
							<p class="text-lg font-normal text-gray-500 lg:text-md dark:text-gray-400 pb-4">
								Web-R 계정(이메일 주소)을 입력해주세요.<br/>
								계정이 없을 경우, <a href="https://web-r.org/index.php?mid=home&act=dispMemberSignUpForm" target="_blank">Web-R 회원 가입</a> 후 신청하시기 바랍니다.
							</p>
		
							<ol class="flex justify-center items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
								{
									props.step == 1
									?   <Div_li_step enabled={true} number={"1"} text={"Web-R 계정 정보 입력"} next={true} />
									:   <Div_li_step enabled={false} number={"1"} text={"Web-R 계정 정보 입력"} next={true} />
								}
								{
									props.step == 2
									?   <Div_li_step enabled={true} number={"2"} text={"결제 방법 선택"} next={true} />
									:   <Div_li_step enabled={false} number={"2"} text={"결제 방법 선택"} next={true} />
								}
								{
									props.step == 3
									?   <Div_li_step enabled={true} number={"3"} text={"결제 완료/실패"} next={false} />
									:   <Div_li_step enabled={false} number={"3"} text={"결제 완료/실패"} next={false} />
								}
							</ol>
						</div>
					</div>
				</div>
			</div>
		</div>    
	)
}