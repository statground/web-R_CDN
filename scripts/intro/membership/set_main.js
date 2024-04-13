function set_main() {
	function Div_card_header(props) {
		return (
			<div class="w-full">
				<h3 class="mb-4 text-2xl font-semibold">{props.name}</h3>
				<p class="font-light text-md text-gray-500">{props.description}</p>
				<div class="flex justify-center items-baseline my-8">
					<span class="mr-2 text-2xl font-extrabold">￦{props.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span>
					<span class="text-gray-500">/년</span>
				</div>
			</div>
		)
	}

	function Div_card_li(props) {
		return (
			<li class="flex items-center space-x-3">
				<svg class="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
				<span>{props.text}</span>
			</li>                
		)
	}

	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={"정회원 가입"} />

				<div class="grid grid-cols-5 justify-center items-start gap-4 w-full
							md:flex md:flex-col md:space-y-4 md:gap-0">

					<div class="col-span-2 flex flex-col justify-center items-center w-full" id="div_membership_userinfo">
						<div class="flex flex-col justify-center items-center w-full space-y-4 mb-4 animate-pulse">
							<div class="flex flex-row justify-center items-center space-x-2">
								<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
								</svg>
								<p>회원 정보를 불러오는 중입니다.</p>
							</div>
							<div class="h-2.5 mx-auto bg-gray-300 rounded-full w-1/4"></div>
							<div class="h-2.5 mx-auto bg-gray-300 rounded-full w-1/2"></div>
							<div class="h-2.5 mx-auto bg-gray-300 rounded-full w-1/3"></div>
							<div class="h-2.5 mx-auto bg-gray-300 rounded-full w-1/2"></div>
							<div class="flex items-center justify-center mt-4">
								<svg class="w-8 h-8 text-gray-200 me-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
									<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
								</svg>
								<div class="w-20 h-2.5 bg-gray-200 rounded-full me-3"></div>
								<div class="w-24 h-2 bg-gray-200 rounded-full"></div>
							</div>
							<span class="sr-only">Loading...</span>
						</div>                        
					</div>

					<div class="flex flex-col justify-center items-center p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow w-full">
						<Div_card_header name={"정회원"} description={"정회원용 프로그램을 이용하실 수 있습니다."} price={100000} />
						<ul role="list" class="mb-8 space-y-4 text-left"></ul>
						<div class="w-full" id="div_membership_card_button_regular"></div>
					</div>

					<div class="flex flex-col justify-center items-center p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow w-full">
						<Div_card_header name={"VIP회원"} description={"원하실 경우 private 앱을 만들어 드립니다."} price={1000000} />
						<ul role="list" class="mb-8 space-y-4 text-left">
							<Div_card_li text={"Private 앱은 특별회원님만 접속 가능하며 다른 분들은 접속할 수 없습니다."} />
							<Div_card_li text={"Private 앱에는 데이터의 저장 기능이 있어 자신의 데이터를 저장해 놓을 수 있습니다."} />
						</ul>
						<div class="w-full" id="div_membership_card_button_vip"></div>
					</div>

					<div class="flex flex-col justify-center items-center p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow w-full">
						<Div_card_header name={"기관 회원"} description={"원하실 경우 전용 앱을 만들어드립니다."} price={2000000} />
						<ul role="list" class="mb-8 space-y-4 text-left">
							<Div_card_li text={"원하실 경우 전용 앱을 만들어드립니다."} />
							<Div_card_li text={"데이터의 저장 기능이 있으며 데이터를 저장해 놓을 경우 같은 단체의 회원들은 데이터를 공유하실 수 있습니다."} />
						</ul>
						<div class="w-full" id="div_membership_card_button_corp"></div>
					</div>
				</div>
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	get_user_membership_info()
}