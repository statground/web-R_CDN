async function get_result_order_id(paymentKey, orderID) {
	function Div_sub_header(props) {
		return (
			<div class="flex flex-col justify-content-center">
				<h5 class="text-primary font-secondary">{props.title}</h5>
				<p class="text-red-500">{props.msg}</p>
				<br/>
				<p id="email" class="text-sm">E-mail: {props.email}</p>
				<p id="username" class="text-sm">이름: {props.username}</p>
			</div>
		)
	}

	function Div_result_failed(props) {
		return (
			<figure class="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 rounded-t-lg
						   md:rounded-t-none md:rounded-tl-lg md:border-r">
				<Div_sub_header title={"결제 실패(3/3)"} msg={"수강 신청이 실패하였습니다."} email={props.data.email} username={props.data.username}/>
				<br/>
				<p class="text-sm text-red-700">{props.data.log.result.message}</p>
			</figure>
		)
	}

	function Div_result_waiting(props) {
		return (
			<figure class="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 rounded-t-lg
						   md:rounded-t-none md:rounded-tl-lg md:border-r">
				<Div_sub_header title={"결제 대기(3/3)"} msg={"결제를 완료하면, 업그레이드가 완료됩니다."} email={props.data.email} username={props.data.username}/>
				<br/>
				<p class="text-sm"><b>주문 번호: {props.data.order_id}</b></p>
				<p>{props.data.log.result.orderName}</p>
				<br/>
				<p class="text-sm">은행: {props.data.log.result.virtualAccount.bank}</p>
				<p class="text-sm">계좌번호: {props.data.log.result.virtualAccount.accountNumber}</p>
				<p class="text-sm">만료 시각: {props.data.log.result.virtualAccount.dueDate.replace('T', ' ')}</p>
				<p class="text-sm text-red-500">결제가 완료되면 Web-R 홈페이지 로그아웃 후 다시 로그인해 주세요.</p>
			</figure>
		)
	}

	function Div_result_success(props) {
		return (
			<figure class="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 rounded-t-lg
						   md:rounded-t-none md:rounded-tl-lg md:border-r">
				<Div_sub_header title={"결제 성공(3/3)"} msg={"결제가 완료되었습니다."} email={props.data.email} username={props.data.username} />
				<br/>
				<p class="text-sm">주문 번호: {props.data.order_id}</p>
				<p>{props.data.log.result.orderName}</p>
				<p class="text-blue-700">회원 등급 만료일: {props.data.web_r_product.expired_at}</p>
				<p class="text-sm text-red-500">Web-R 홈페이지 로그아웃 후 다시 로그인해 주세요.</p>'
			</figure>
		)
	}

	
	const data = await fetch("/ajax_finish_order_id/?paymentKey=" + paymentKey + "&orderID=" + orderID)
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	// 결제 실패
	if ("result" in data.log && "message" in data.log.result){
		ReactDOM.render(<Div_result_failed data={data} />, document.getElementById("div_result"))
		
	// 가상 계좌 - 결제 대기
	} else if (data.status == "WAITING_FOR_DEPOSIT") {
		ReactDOM.render(<Div_result_waiting data={data} />, document.getElementById("div_result"))
		
	// 결제 완료
	} else {
		ReactDOM.render(<Div_result_success data={data} />, document.getElementById("div_result"))

	}

	document.getElementById("button_waiting").className = "hidden"
	document.getElementById("button_init").className = "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
	document.getElementById("button_webr").className = "text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300"

}