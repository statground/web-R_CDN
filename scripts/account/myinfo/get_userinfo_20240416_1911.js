async function get_userinfo() {
	let class_tab_active = "inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active cursor-pointer"
	let class_tab_deactive = "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
	let class_tab_active_content = "flex flex-col justify-center items-center w-full"

	function click_tab(id) {
		if (id == "connection") {
			document.getElementById("div_tab_connection").className = class_tab_active
			document.getElementById("div_tab_connection_content").className = class_tab_active_content
		} else {
			document.getElementById("div_tab_connection").className = class_tab_deactive
			document.getElementById("div_tab_connection_content").className = "hidden"
		}

		if (id == "article") {
			document.getElementById("div_tab_article").className = class_tab_active
			document.getElementById("div_tab_article_content").className = class_tab_active_content
		} else {
			document.getElementById("div_tab_article").className = class_tab_deactive
			document.getElementById("div_tab_article_content").className = "hidden"
		}

		if (id == "payment") {
			document.getElementById("div_tab_payment").className = class_tab_active
			document.getElementById("div_tab_payment_content").className = class_tab_active_content
		} else {
			document.getElementById("div_tab_payment").className = class_tab_deactive
			document.getElementById("div_tab_payment_content").className = "hidden"
		}
	}

	function Div_main_userinfo(props) {
		return (
			<div class="grid grid-cols-5 justify-center items-start gap-8 w-full">
				<div class="flex flex-col justify-center items-center border border-blue-100 rounded-xl w-full px-4 py-8 space-y-2">
					<p class="text-sm">{props.data.email}</p>
					<p class="text-2xl font-extrabold">{props.data.name}</p>
					<p class="text-sm">{props.data.realname}　|　{props.data.gender}</p>
					

					<div class="py-4"></div>

					<p class="text-lg font-extrabold">{props.data.role}</p>
					<p class="text-sm">가입 일자: {props.data.date_joined}</p>

					{
						props.data.expired_at == null
						?   <p class="text-sm">회원등급 만료일: 무제한</p>
						:   <p class="text-sm">회원등급 만료일: {props.data.expired_at}</p>
					}

					<div class="py-4"></div>

					{
						props.data.email_subscription == 1
						?   <p class="text-sm text-green-500">이메일 수신 허용</p>
						:   <p class="text-sm text-gray-500">이메일 수신 거부</p>
					}

					<div class="py-4"></div>

					<button type="button" onClick={() => location.href="/account/myinfo/edit/"}
							class="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full
								   hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
						회원정보 수정하기
					</button>
					<button type="button" onClick={() => location.href="/account/change_password/"}
						class="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full
							   hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
						비밀번호 변경하기
					</button>
				</div>


				<div class="col-span-4 flex flex-col justify-start items-start rounded-xl w-full">

					<ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full">
						<li class="me-2">
							<p class={class_tab_active} id="div_tab_connection" onClick={() => click_tab("connection")}>내 접속 기록</p>
						</li>
						<li class="me-2">
							<p class={class_tab_deactive} id="div_tab_article" onClick={() => click_tab("article")}>내가 쓴 글/댓글</p>
						</li>
						<li class="me-2">
							<p class={class_tab_deactive} id="div_tab_payment" onClick={() => click_tab("payment")}>결제 내역</p>
						</li>
					</ul>

					<div class={class_tab_active_content} id="div_tab_connection_content">
						<div class="bg-gray-200 w-full h-[500px] animate-pulse"></div>
					</div>
					<div class="hidden" id="div_tab_article_content">
						<div class="bg-gray-200 w-full h-[500px] animate-pulse"></div>
					</div>
					<div class="hidden" id="div_tab_payment_content">
						<div class="bg-gray-200 w-full h-[500px] animate-pulse"></div>
					</div>
				</div>
			</div>
		)
	}


	data = await fetch("/account/ajax_get_myinfo/")
				.then(res=> { return res.json(); })
				.then(res=> { return res; });

	ReactDOM.render(<Div_main_userinfo data={data} />, document.getElementById("div_main_userinfo"))

	get_connection()
	get_article_content()
	get_payment_content()
}