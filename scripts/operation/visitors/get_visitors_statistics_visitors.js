async function get_visitors_statistics_visitors() {
	function Div_statistics_visitors(props){
		return(
			<div class="p-4 bg-white rounded-lg text-center md:p-8">
				<Div_sub_title title={"방문자 수"} />
			
				<div class="w-full bg-white rounded-lg shadow">
					<dl class="grid grid-cols-4 w-full gap-8 p-4 mx-auto text-gray-900 md:grid-cols-1 md:p-8">
						<Div_card title={"방문자 수/일"} value={props.data.avg_total} unit={"명"} />
						<Div_card title={"올해 방문자 수/일"} value={props.data.avg_current_year} unit={"명"} sub={"작년"} value_last={props.data.avg_last_year} />
						<Div_card title={"이번 달 방문자 수/일"} value={props.data.avg_current_month} unit={"명"} sub={"지난 달"} value_last={props.data.avg_last_month} />
						<Div_card title={"오늘 방문자 수"} value={props.data.avg_today} unit={"명"} sub={"지난 달"} value_last={props.data.avg_yesterday} />
					</dl>
				</div>
			</div>
		)
	}

	const data = await fetch("/operation/ajax_visitors_statistics_visitors")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	ReactDOM.render(<Div_statistics_visitors data={data} />, document.getElementById("div_statistics_vistors"))
}