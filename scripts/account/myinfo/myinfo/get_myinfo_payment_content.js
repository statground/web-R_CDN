async function get_myinfo_payment_content() {
	//div_tab_payment_content

	function Div_new_payment_list(props) {
		let class_span_btn_default = "flex flex-row justify-center items-center w-fit text-xs font-medium px-2.5 py-0.5 rounded-full"

		return (
			<div class="bg-white border-b w-full">
				<a href={
							props.data.status != "ABORTED"
							?   '/intro/membership/result/?paymentKey=' + props.data.log.finish_order_id.paymentKey + '&orderId=' + props.data.order_id + '&amount=' + props.data.amount
							:   '#'
						} target="_blank"
				   class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
					<div class="flex flex-row justify-start items-center space-x-2">
						<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
							{props.data.log.request_order_id.product_name}
						</span>
					</div>
					<div class="flex flex-wrap justify-start items-center space-x-2">
						<span class={class_span_btn_default + " bg-gray-200 text-gray-900"}>
							결제 일시: {props.data.log.finish_order_id.requestedAt.replace('T', ' ').replace('+09:00', ' ')}
						</span>

						{
							props.data.status == "DONE"
							?   <span class={class_span_btn_default + " bg-green-100 text-green-700"}>
									결제 성공
								</span>
							:   null
						}

						{
							props.data.status == "WAITING_FOR_DEPOSIT"
							?   <span class={class_span_btn_default + " bg-blue-100 text-blue-700"}>
									결제 대기
								</span>
							:   null
						}

						{
							props.data.status == "ABORTED"
							?   <span class={class_span_btn_default + " bg-red-100 text-red-700"}>
									결제 실패
								</span>
							:   null
						}
					</div>
				</a>
			</div>
		)
	}

	function Col(props) {
		const paymentList = Object.keys(props.data).map((article) =>
			<Div_new_payment_list data={props.data[article]} />
		)

		return (
			<div class="flex flex-col justify-center text-center content-center w-full space-y-2">
				<table class="flex flex-col justify-center items-center text-sm text-left text-gray-500">
					{paymentList}
				</table>
			</div>
		)
	}


	function Col_nothing(props) {
		return (
			<div class="flex flex-col justify-center text-center content-center w-full space-y-2 p-12">
				<p>결제 내역이 없습니다.</p>
			</div>
		)
	}

	const tempdata = await fetch("/account/ajax_get_myinfo_payment/")
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

	
	if (tempdata.count['0'].cnt == 0) {
		ReactDOM.render(<Col_nothing />, document.getElementById("div_tab_payment_content"));
	} else {
		ReactDOM.render(<Col data={tempdata.list} />, document.getElementById("div_tab_payment_content"));
	}
}