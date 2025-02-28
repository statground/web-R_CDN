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
				<Div_sub_header title={"결제 실패"} msg={"수강 신청이 실패하였습니다."} email={props.data.email} username={props.data.username}/>
				<br/>
				<p class="text-sm text-red-700">{props.data.log.result.message}</p>
			</figure>
		)
	}

	function Div_result_waiting(props) {
		return (
			<figure class="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 rounded-t-lg
						   md:rounded-t-none md:rounded-tl-lg md:border-r">
				<Div_sub_header title={"결제 대기"} msg={"결제를 완료하면, 업그레이드가 완료됩니다."} email={props.data.email} username={props.data.username}/>
				<br/>
				<p class="text-sm"><b>주문 번호: {props.data.order_id}</b></p>
				<p>{props.data.log.result.orderName}</p>
				<br/>
				<p class="text-sm">은행: {props.data.log.result.virtualAccount.bank}</p>
				<p class="text-sm">계좌번호: {props.data.log.result.virtualAccount.accountNumber}</p>
				<p class="text-sm">만료 시각: {props.data.log.result.virtualAccount.dueDate.replace('T', ' ')}</p>
			</figure>
		)
	}

	function Div_result_success(props) {
		return (
			<figure class="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 rounded-t-lg
						   md:rounded-t-none md:rounded-tl-lg md:border-r">
				<Div_sub_header title={"결제 성공"} msg={"결제가 완료되었습니다."} email={props.data.email} username={props.data.username} />
				<br/>
				<p class="text-sm">주문 번호: {props.data.order_id}</p>
				<p>{props.data.log.result.orderName}</p>
			</figure>
		)
	}

	function Div_submit_step3(props) {
		return (
			<div class="flex flex-col py-8 px-4 mx-auto w-full lg:py-16 z-1 space-y-4 md:space-y-12">
				<h2 class="text-4xl tracking-tight font-extrabold text-center text-gray-900">
					수강신청하기 (3/3)
				</h2>

				{
					props.result == "success"
					?   <Div_result_success data={props.data} />
					:   ""
				}
				{
					props.result == "waiting"
					?   <Div_result_waiting data={props.data} />
					:   ""
				}
				{
					props.result == "failed"
					?   <Div_result_failed data={props.data} />
					:   ""
				}
			</div>
		)
	}

	
	const data = await fetch("/ajax_finish_order_id/?paymentKey=" + paymentKey + "&orderID=" + orderID)
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	// 결제 실패
	if ("result" in data.log && "message" in data.log.result){
		ReactDOM.render(<Div_submit_step3 result={"failed"} data={data} />, document.getElementById("div_content"))
		
	// 가상 계좌 - 결제 대기
	} else if (data.log.result.status == "WAITING_FOR_DEPOSIT") {
		ReactDOM.render(<Div_submit_step3 result={"waiting"} data={data} />, document.getElementById("div_content"))
		
	// 결제 완료
	} else {
		ReactDOM.render(<Div_submit_step3 result={"success"} data={data} />, document.getElementById("div_content"))

	}

}