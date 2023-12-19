function Div_sub() {
	function Div_title(props) {
		return (
			<h5 class="mb-4 text-xl font-medium text-gray-500">{props.title}</h5>
		)
	}

	function Div_price(props) {
		return (
			<div class="flex items-baseline text-gray-900">
				<span class="text-3xl font-semibold">￦</span>
				<span class="text-4xl font-extrabold tracking-tight">{props.price}</span>
				<span class="ml-1 text-xl font-normal text-gray-500">/년</span>
			</div>                    
		)
	}

	function Div_description(props) {
		return (
			<li><p>{props.text}</p></li>
		)
	}

	function Div_description_check(props) {
		return (
			<li class="flex space-x-3">
				<svg aria-hidden="true" class="flex-shrink-0 w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Check icon</title><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>                                    
				<span class="text-base font-normal leading-tight text-gray-500">
					{props.text}
				</span>
			</li>
		)
	}

	
	function Div_button_paymnets(props) {
		function Div_button(props) {
			return (
				<button type="button"
						class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full"
						onClick={props.function}
						>
					{props.text}
				</button>                        
			)
		}
		return (
			<div>
				<Div_button text={"카드 결제"}
							function={() => request_order_id(props.product_id, "13381046-8486-11ed-a1eb-0242ac120002", "card", email, name)} />
				<Div_button text={"가상계좌 결제"}
							function={() => request_order_id(props.product_id, "13381046-8486-11ed-a1eb-0242ac120002", "va", email, name)} />
				<Div_button text={"계좌 이체"}
							function={() => request_order_id(props.product_id, "13381046-8486-11ed-a1eb-0242ac120002", "account", email, name)} />
			</div>
		)
	}

	let class_btn_upgrade = "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"

	function click_btn_payments(number) {
		if (number == 1) {
			document.getElementById("div_btn_default_1").className = "hidden"
			document.getElementById("div_btn_default_2").className = class_btn_upgrade
			document.getElementById("div_btn_default_3").className = class_btn_upgrade

			document.getElementById("div_btn_payment_1").className = ""
			document.getElementById("div_btn_payment_2").className = "hidden"
			document.getElementById("div_btn_payment_3").className = "hidden"

		} else if (number == 2) {
			document.getElementById("div_btn_default_1").className = class_btn_upgrade
			document.getElementById("div_btn_default_2").className = "hidden"
			document.getElementById("div_btn_default_3").className = class_btn_upgrade

			document.getElementById("div_btn_payment_1").className = "hidden"
			document.getElementById("div_btn_payment_2").className = ""
			document.getElementById("div_btn_payment_3").className = "hidden"

		} else if (number == 3) {
			document.getElementById("div_btn_default_1").className = class_btn_upgrade
			document.getElementById("div_btn_default_2").className = class_btn_upgrade
			document.getElementById("div_btn_default_3").className = "hidden"

			document.getElementById("div_btn_payment_1").className = "hidden"
			document.getElementById("div_btn_payment_2").className = "hidden"
			document.getElementById("div_btn_payment_3").className = ""
		}
	}


	return (
		<div class="flex flex-row w-full pt-12 justify-center items-center">
			<div class="flex flex-row justify-center items-start space-x-8 md:flex-col md:space-x-0 md:space-y-4">

				<div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
					<Div_title title={"정회원"} />
					<Div_price price={"100,000"} />
					<ul role="list" class="space-y-5 my-7">
						<Div_description text={"정회원용 프로그램을 이용하실 수 있습니다."} />
					</ul>
					<button type="button" id="div_btn_default_1" onClick={() => click_btn_payments(1)} class={class_btn_upgrade}>
						업그레이드
					</button>
					<div id="div_btn_payment_1" class="hidden">
						<Div_button_paymnets product_id={"e2a47288-7384-11ed-a1eb-0242ac120002"}/>
					</div>
				</div>
	
				<div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
					<Div_title title={"VIP 회원"} />
					<Div_price price={"1,000,000"} />
					<ul role="list" class="space-y-5 my-7">
						<Div_description text={"원하실 경우 전용 private 앱을 만들어드립니다."} />
					</ul>
					<ul role="list" class="space-y-5 my-7">
						<Div_description_check text={"Private 앱은 특별회원님만 접속 가능하며 다른 분들은 접속할 수 없습니다."} />
						<Div_description_check text={"Private 앱에는 데이터의 저장 기능이 있어 자신의 데이터를 저장해 놓을 수 있습니다."} />
					</ul>
					<button type="button" id="div_btn_default_2" onClick={() => click_btn_payments(2)} class={class_btn_upgrade}>
						업그레이드
					</button>
					<div id="div_btn_payment_2" class="hidden">
						<Div_button_paymnets product_id={"f24deb88-7384-11ed-a1eb-0242ac120002"}/>
					</div>
				</div>
	
				<div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
					<Div_title title={"기관 회원"} />
					<Div_price price={"2,000,000"} />
					<ul role="list" class="space-y-5 my-7">
						<Div_description text={"원하실 경우 전용 앱을 만들어드립니다."} />
					</ul>
					<ul role="list" class="space-y-5 my-7">
						<Div_description_check text={"기관 전용 앱에는 단체에 속한 10명의 회원을 등록하여 사용하실 수 있습니다."} />
						<Div_description_check text={"데이터의 저장 기능이 있으며 데이터를 저장해 놓을 경우 같은 단체의 회원들은 데이터를 공유하실 수 있습니다."} />
					</ul>
					<button type="button" id="div_btn_default_3" onClick={() => click_btn_payments(3)} class={class_btn_upgrade}>
						업그레이드
					</button>
					<div id="div_btn_payment_3" class="hidden">
						<Div_button_paymnets product_id={"247d7ba0-7385-11ed-a1eb-0242ac120002"}/>
					</div>
				</div>
	
			</div>
		</div>
	)
}