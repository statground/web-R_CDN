function Div_submit_step2(props) {
	let class_btn_payment = "py-3 px-5 text-sm font-medium text-center rounded-lg bg-green-500 text-white hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-primary-300"
	let class_btn_back = "py-3 px-5 text-sm font-medium text-center rounded-lg bg-gray-500 text-white hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-primary-300"

	let toggle_type = "정회원"
	let price = 0
	
	
	// Web-R 유저가 아닐 경우
	if (!check_webr_user(props.data)) { 
		price = 200000;
		uuid_product_id = "18076e66-9e73-11ee-8c90-0242ac120002"
		toggle_type = "비회원"

	} else if (props.data.webr.group_name == "준회원") {
		price = 200000;
		uuid_product_id = "18076e66-9e73-11ee-8c90-0242ac120002"
		toggle_type = "준회원"

	} else {
		price = 150000; 
		uuid_product_id = "180770be-9e73-11ee-8c90-0242ac120002"

	}    


	function click_return_step1() {
		ReactDOM.render(<Div_submit />, document.getElementById("div_content"))
	}

	
	return (
		<div>
			<div class="flex flex-col py-8 px-4 mx-auto w-full lg:py-16 z-1 space-y-4 md:space-y-12">
				<h2 class="text-4xl tracking-tight font-extrabold text-center text-gray-900">
					수강신청하기 (2/3)
				</h2>
				{   
					toggle_type == "정회원"
					?   <p class="mb-8 lg:mb-16 font-light text-center font-extrabold text-gray-500 md:text-md">
							성향점수분석 워크샵 수강료 (정회원)
							<br/>
							<span class="text-blue-500 font-extrabold">수강료: 150,000원</span>
						</p>
					:   ""
				}
				{
					toggle_type == "준회원"
					?   <p class="mb-8 lg:mb-16 font-light text-center font-extrabold text-gray-500 md:text-md">
							성향점수분석 워크샵 수강료 (준회원)
							<br/>
							<span class="text-blue-500 font-extrabold">수강료: 200,000원</span>
							<br/><br/>
							이메일에 Web-R 정회원 계정을 입력할 경우, 할인된 수강료가 적용됩니다.
							<br/>
							<span onClick={() => window.open("/membership/")}
								class="flex flex-row justify-center items-center text-center text-md font-semibold text-blue-500 hover:underline cursor-pointer">
								Web-R 정회원 업그레이드
								<svg class="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
							</span>
						</p>
					:   ""
				}
				{
					toggle_type == "비회원"
					?   <p class="mb-8 lg:mb-16 font-light text-center font-extrabold text-gray-500 md:text-md">
							성향점수분석 워크샵 수강료 (비회원)
							<br/>
							<span class="text-blue-500 font-extrabold">수강료: 200,000원</span>
							<br/><br/>
							이메일에 Web-R 정회원 계정을 입력할 경우, 할인된 수강료가 적용됩니다.
							<br/>
							<span onClick={() => window.open("https://web-r.org/index.php?mid=home&act=dispMemberSignUpForm")}
								class="flex flex-row justify-center items-center text-center text-md font-semibold text-blue-500 hover:underline cursor-pointer">
								Web-R 회원가입
								<svg class="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
							</span>
						</p>
					:   ""
				}


				<div class="flex flex-col justify-center items-center py-8 lg:py-16 px-4 mx-auto w-full space-y-4">
					<div class="w-1/3 md:w-full">
						<p class={class_label}>이메일: {txt_email}</p>
					</div>
					<div class="w-1/3 md:w-full">
						<p class={class_label}>이름: {txt_name}</p>
					</div>
					<div class="w-1/3 md:w-full">
						<p class={class_label}>전화번호: {txt_phone}</p>
					</div>
				</div>

				<div class="flex flex-col justify-center items-center px-4 mx-auto w-full space-y-4" id="div_submit_btn_list">
					<div class="flex flex-row w-full justify-center items-center space-x-4">
						<button type="button" id="btn_submit_check" class={class_btn_payment} 
								onClick={() => request_order_id(uuid_product_id, "00422de9-bd2b-46ea-91ca-19268a03b375", "card", txt_email, txt_name, txt_phone)}>
							카드 결제
						</button>
						<button type="button" id="btn_submit_check" class={class_btn_payment}
								onClick={() => request_order_id(uuid_product_id, "00422de9-bd2b-46ea-91ca-19268a03b375", "va", txt_email, txt_name, txt_phone)}>
							무통장 입금
						</button>
						<button type="button" id="btn_submit_check" class={class_btn_payment}
								onClick={() => request_order_id(uuid_product_id, "00422de9-bd2b-46ea-91ca-19268a03b375", "account", txt_email, txt_name, txt_phone)}>
							계좌 이체
						</button>
		
						<button type="button" id="btn_submit_check" class={class_btn_back} onClick={() => click_return_step1()}>
							다시 입력하기
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}