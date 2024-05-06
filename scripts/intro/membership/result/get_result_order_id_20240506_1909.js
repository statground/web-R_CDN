async function get_result_order_id() {
	let class_card_result = "flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r"

	function Div_sub_header(props) {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={"정회원 가입"} />

				<div class="grid grid-cols-3 justify-center items-center w-full gap-4 md:grid-cols-1">
					<div class="flex flex-col justify-center items-center w-full border border-gray-500 rounded-lg p-4">
						<p class="text-xl font-extrabold">결제 상품</p>
						<p>{props.product_name}</p>
					</div>

					<div class="flex flex-col justify-center items-center w-full border border-gray-500 rounded-lg p-4">
						<p class="text-xl font-extrabold">결제 금액</p>
						<p>{props.amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
					</div>

					<div class="flex flex-col justify-center items-center w-full border border-gray-500 rounded-lg p-4">
						<p class="text-xl font-extrabold">결과</p>
						<p class={props.color + " font-extrabold"}>{props.result}</p>
					</div>
				</div>
			</div>
		)
	}

	function Div_result_failed(props) {
		return (
			<figure class={class_card_result}>
				<Div_sub_header result={"결제 실패"} color={"text-red-500"}
								product_name={props.data.log.request_order_id.product_name} amount={props.data.amount}/>

				<hr class="h-[1px] my-2 w-full bg-gray-500 border-gray-500 border-0" />

				<div class="flex flex-col justify-center items-center w-full">
					<p class="text-sm text-red-700">{props.data.log.finish_order_id.message}</p>
				</div>

				<div class="p-2"></div>

				<div class="grid grid-cols-2 justify-center items-center w-full md:grid-cols-1">
					<a href={"/intro/membership/"}
					   class="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
							  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none">
						다시 시도하기
					</a>
					<a href={"/"}
					   class="text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
							  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
						메인 화면으로
					</a>
				</div>
			</figure>
		)
	}

	function Div_result_waiting(props) {
		return (
			<figure class={class_card_result}>
				<Div_sub_header result={"결제 대기"} color={"text-blue-500"}
								product_name={props.data.log.request_order_id.product_name} amount={props.data.amount}/>
				<div class="flex flex-col justify-center items-start w-full max-w-screen-sm border border border-green-700 bg-gray-100 p-4 rounded-xl">
					<p class="text-xl font-extrabold mb-4">결제 상세</p>

					<p><span class="font-bold">주문 번호:</span> {props.data.orderID}</p>
					<p><span class="font-bold">결제 계정:</span> {props.data.log.request_order_id.email}</p>
					<p><span class="font-bold">결제 상품:</span> {props.data.log.request_order_id.product_name}</p>
					
					<hr class="h-[1px] my-2 w-full bg-gray-500 border-gray-500 border-0" />

					<div class="flex flex-col justify-center items-center w-full">
						<p><span class="font-bold">은행:</span> {props.data.log.finish_order_id.virtualAccount.bank}</p>
						<p><span class="font-bold">계좌번호:</span> {props.data.log.finish_order_id.virtualAccount.accountNumber}</p>
						<p><span class="font-bold">만료 시각:</span> {props.data.log.finish_order_id.virtualAccount.dueDate.replace('T', ' ').replace('+09:00', ' ')}</p>

						<p><span class="font-bold">최종 금액:</span> {(props.data.log.finish_order_id.totalAmount).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
						
						<p class="text-blue-500">위 계좌로 입금하면, 자동으로 결제가 완료됩니다.</p>
					</div>

					<div class="p-2"></div>

					<a href={"/"}
					   class="text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full
							  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
						메인 화면으로
					</a>
				</div>
			</figure>
		)
	}

	function Div_result_success(props) {
		return (
			<figure class={class_card_result}>
				<Div_sub_header result={"결제 성공"} color={"text-green-500"}
								product_name={props.data.log.request_order_id.product_name} amount={props.data.amount}/>
				<div class="flex flex-col justify-center items-start w-full max-w-screen-sm border border border-green-700 bg-gray-100 p-4 rounded-xl">
					<p class="text-xl font-extrabold mb-4">결제 상세</p>

					<p><span class="font-bold">주문 번호:</span> {props.data.orderID}</p>
					<p><span class="font-bold">결제 계정:</span> {props.data.log.request_order_id.email}</p>
					<p><span class="font-bold">결제 상품:</span> {props.data.log.request_order_id.product_name}</p>
					<p><span class="font-bold">결제 일시:</span> {props.data.log.finish_order_id.approvedAt.replace('T', ' ').replace('+09:00', ' ')}</p>
					<p><span class="font-bold">결제 방법:</span> {props.data.log.finish_order_id.method}</p>
					
					<hr class="h-[1px] my-2 w-full bg-gray-500 border-gray-500 border-0" />

					<div class="flex flex-col justify-center items-end w-full">
						<p><span class="font-bold">가격:</span> {(props.data.log.finish_order_id.suppliedAmount).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
						<p><span class="font-bold">부가세 (10%):</span> {(props.data.log.finish_order_id.vat).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
						<p><span class="font-bold">최종 금액:</span> {(props.data.log.finish_order_id.totalAmount).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원</p>
					</div>

					<div class="p-2"></div>

					<div class="grid grid-cols-2 justify-center items-center w-full md:grid-cols-1">
						<a href={props.data.log.finish_order_id.receipt.url} target="_blank"
						   class="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
								  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none">
							영수증 보기
						</a>
						<a href={"/"}
						   class="text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
								  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
							메인 화면으로
						</a>
					</div>
				</div>
			</figure>
		)
	}

	const data = await fetch("/ajax_finish_order_id/?paymentKey=" + payment_key + "&orderID=" + orderID + "&amount=" + amount)
	.then(res=> { return res.json(); })
	.then(res=> { return res; });

	// 결제 실패
	if (data.log.status == "ABORTED"){
		ReactDOM.render(<Div_result_failed data={data} />, document.getElementById("div_main"))
		
	// 가상 계좌 - 결제 대기
	} else if (data.log.status == "WAITING_FOR_DEPOSIT") {
		ReactDOM.render(<Div_result_waiting data={data} />, document.getElementById("div_main"))
		
	// 결제 완료
	} else {
		ReactDOM.render(<Div_result_success data={data} />, document.getElementById("div_main"))

	}
}