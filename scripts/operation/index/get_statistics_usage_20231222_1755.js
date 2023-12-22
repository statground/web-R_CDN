async function get_statistics_usage() {
	function Div_statistics_usage(props) {
		return (
			<div class="p-4 bg-white rounded-lg md:p-8 text-center">
				<Div_sub_title title="이용 현황" />
				<dl class="grid grid-cols-3 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8">
					<Div_card title={"일 평균 페이지 뷰"} value={props.data.avg_pageview} unit={"건"} sub={"지난 달"} value_last={props.data.avg_pageview_lm} />
					<Div_card title={"일 평균 접속자 수"} value={props.data.avg_visitor} unit={"명"} sub={"지난 달"} value_last={props.data.avg_visitor_lm} />
					<Div_card title={"이번 달 가입자 수"} value={props.data.join_member} unit={"명"} sub={"지난 달"} value_last={props.data.join_member_lm} />
				</dl>
			</div>
		)    
	}

	const data = await fetch("/operation/ajax_index_statistics_usage")
					  .then(res=> { return res.json(); })
					  .then(res=> { return res; });

	ReactDOM.render(<Div_statistics_usage data={data} />, document.getElementById("div_statistics_usage"))
}