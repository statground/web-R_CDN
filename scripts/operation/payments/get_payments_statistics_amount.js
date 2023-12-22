async function get_payments_statistics_amount() {
	function Div_statistics_amount(props){
		return(
			<div class="p-4 bg-white rounded-lg text-center md:p-8">
				<Div_sub_title title={"가입자 수"} />
			
				<div class="w-full bg-white rounded-lg shadow">
					<dl class="grid grid-cols-4 w-full gap-8 p-4 mx-auto text-gray-900 md:grid-cols-1 md:p-8">
						<div class="flex flex-col align-top">
							<dt class="mb-2 text-2xl font-extrabold">{props.data.amount_total}원 / {props.data.cnt_total}건</dt>
							<dd class="font-light text-gray-500">총 결제액</dd>
						</div>
						<div class="flex flex-col align-top">
							<dt class="mb-2 text-2xl font-extrabold">{props.data.amount_current_year}원 / {props.data.cnt_current_year}건</dt>
							<dd class="font-light text-gray-500">올해 결제액</dd>
							<dd class="font-light text-sm text-gray-500">(작년: {props.data.amount_last_year}원 / {props.data.cnt_last_year}건)</dd>
						</div>
						<div class="flex flex-col align-top">
							<dt class="mb-2 text-2xl font-extrabold">{props.data.amount_current_month}원 / {props.data.cnt_current_month}건</dt>
							<dd class="font-light text-gray-500">이번 달 결제액</dd>
							<dd class="font-light text-sm text-gray-500">(지난 달: {props.data.amount_last_month}원 / {props.data.cnt_last_month}건)</dd>
						</div>
						<div class="flex flex-col align-top">
							<dt class="mb-2 text-2xl font-extrabold">{props.data.amount_today}원 / {props.data.cnt_today}건</dt>
							<dd class="font-light text-gray-500">오늘 결제액</dd>
							<dd class="font-light text-sm text-gray-500">(어제: {props.data.amount_yesterday}원 / {props.data.cnt_yesterday}건)</dd>
						</div>
					</dl>
				</div>
			</div>
		)
	}

	const data = await fetch("/operation/ajax_payments_statistics_amount")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	ReactDOM.render(<Div_statistics_amount data={data} />, document.getElementById("div_statistics_amount"))
}