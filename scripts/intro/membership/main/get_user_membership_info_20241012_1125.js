async function get_user_membership_info() {
	const Div_membership_userinfo_not_login = () => {
		return (
			<div class="flex flex-row justify-center items-center h-[200px]">
				<p>로그인이 필요합니다.</p>
			</div>
		)
	}

	const Div_membership_userinfo = (props) => {
		return (
			<div class="flex flex-col justify-center items-center border border-blue-100 bg-gray-100 rounded-xl w-full px-4 py-8 space-y-2">
				<p class="font-extrabold underline">회원 정보</p>

				<div class="py-1"></div>

				<p class="text-sm">{data.email}</p>
				<p class="text-2xl font-extrabold">{data.name}</p>
				<p class="text-sm">{data.realname}　|　{data.gender}</p>
				
				<div class="py-4"></div>

				<p class="text-lg font-extrabold" id="div_membership_p_role">{data.role}</p>
				<p class="text-sm">가입 일자: {data.date_joined}</p>

				{
					data.expired_at == null
					?   <p class="text-sm">회원등급 만료일: 무제한</p>
					:   <p class="text-sm">회원등급 만료일: {data.expired_at}</p>
				}
				<p class="hidden" id="div_membership_p_expect_expired_at"></p>
				<p class="hidden" id="div_membership_p_expect_price"></p>

				<div class="py-4"></div>

				<div id="div_membership_payment_button_list" class="flex flex-col justify-center items-center w-full">
					<p class="text-red-500">결제 방법을 선택해주세요.</p>
				</div>
			</div>
		)
	}

	
	const Div_card_button = (props) => {
		return (
			<button type="button" onClick={() => click_card_button(props.select_role, props.price)}
					class="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full
						   hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
				선택
			</button>
		)
	}


	const Div_payment_button = (props) => {
		let class_button = "text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"

		return (
			<div class="flex flex-col justify-center items-center w-full space-y-2">
				<button type="button" class={class_button} onClick={() => request_order_id(props.select_role, "카드")}>
					카드결제
				</button>
				<button type="button" class={class_button} onClick={() => request_order_id(props.select_role, "가상계좌")}>
					가상계좌 결제
				</button>
				<button type="button" class={class_button} onClick={() => request_order_id(props.select_role, "계좌이체")}>
					계좌 이체
				</button>
			</div>
		)
	}
	
	function click_card_button(select_role, price) {
		// 바뀌게 될 등급
		if (data.role != select_role) {
			document.getElementById("div_membership_p_role").innerHTML = data.role + " → " + "<span class='text-green-700'>" + select_role + "</span>"
		} else {
			document.getElementById("div_membership_p_role").innerHTML = "<span class='text-green-700'>" + select_role + "</span>"
		}


		// 만료일 계산
		const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
		let now = null
		if (data.expired_at == null) {
			now = new Date();
		} else {
			now = new Date(data.expired_at);
		}
		const date = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString().split('T')[0];
		const time = now.toTimeString().split(' ')[0];

		document.getElementById("div_membership_p_expect_expired_at").innerHTML = "<span class='text-red-700 font-extrabold'>" + "예상 만료일: " + date + " " + time + "</span>"
		document.getElementById("div_membership_p_expect_expired_at").className = "text-sm"


		// 결제 금액 계산
		document.getElementById("div_membership_p_expect_price").innerHTML = "<span class='text-red-700 font-extrabold'>" + "예상 결제 금액: " + price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "원</span>"
		document.getElementById("div_membership_p_expect_price").className = "text-sm"


		// 결제 버튼
		ReactDOM.render(<Div_payment_button select_role={select_role} />, document.getElementById("div_membership_payment_button_list"))
	}


	if (gv_username == "") {
		ReactDOM.render(<Div_membership_userinfo_not_login />, document.getElementById("div_membership_userinfo"))

	} else {         
		data = await fetch("/account/ajax_get_userinfo/")
			.then(res=> { return res.json(); })
			.then(res=> { return res; });

		ReactDOM.render(<Div_membership_userinfo />, document.getElementById("div_membership_userinfo"))
		ReactDOM.render(<Div_card_button select_role={"정회원"} price={100000} />, document.getElementById("div_membership_card_button_regular"))
		ReactDOM.render(<Div_card_button select_role={"VIP회원"} price={1000000} />, document.getElementById("div_membership_card_button_vip"))
		ReactDOM.render(<Div_card_button select_role={"기관회원"} price={2000000} />, document.getElementById("div_membership_card_button_corp"))
	}
}