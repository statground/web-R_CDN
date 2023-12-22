async function get_statistics_usage() {
	function Div_sub_card(props) {
		return (
			<div class="flex flex-col items-center justify-center">
				<dt class="mb-2 text-3xl font-extrabold">{props.value}{props.unit}</dt>
				<dd class="font-light text-gray-700 font-extrabold">
					{props.title}
				</dd>
				<dd class="font-light text-sm text-gray-500">(지난 달: {props.value_lm}{props.unit})</dd>
			</div>            
		)
	}

	function Div_statistics_usage(props) {
		return (
			<div class="p-4 bg-white rounded-lg md:p-8 text-center">
				<Div_sub_title title="이용 현황" />
				<dl class="grid grid-cols-3 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8">
					<Div_sub_card title="일 평균 페이지 뷰" unit="건"
								  value={props.data.avg_pageview} value_lm={props.data.avg_pageview_lm} />
					<Div_sub_card title="일 평균 접속자 수" unit="명"
								  value={props.data.avg_visitor} value_lm={props.data.avg_visitor_lm} />
					<Div_sub_card title="이번 달 가입자 수" unit="명"
								  value={props.data.join_member} value_lm={props.data.join_member_lm} />
				</dl>
			</div>
		)    
	}

	const data = await fetch("/operation/ajax_index_statistics_usage")
					  .then(res=> { return res.json(); })
					  .then(res=> { return res; });


	ReactDOM.render(<Div_statistics_usage data={data} />, document.getElementById("div_statistics_usage"))
}