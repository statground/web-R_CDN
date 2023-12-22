async function get_visitors_statistics_pageview() {
	function Div_statistics_pageview(props){
		return(
			<div class="p-4 bg-white rounded-lg text-center md:p-8">
				<Div_sub_title title={"페이지 뷰"} />
			
				<div class="w-full bg-white rounded-lg shadow">
					<dl class="grid grid-cols-4 w-full gap-8 p-4 mx-auto text-gray-900 md:grid-cols-1 md:p-8">
						<Div_card title={"총 페이지 뷰"} value={props.data.sum_total} unit={"건"} />
						<Div_card title={"올해 페이지 뷰"} value={props.data.sum_current_year} unit={"건"} sub={"작년"} value_last={props.data.sum_last_year} />
						<Div_card title={"이번 달 페이지 뷰"} value={props.data.sum_current_month} unit={"건"} sub={"지난 달"} value_last={props.data.sum_last_month} />
						<Div_card title={"오늘 페이지 뷰"} value={props.data.sum_today} unit={"건"} sub={"어제"} value_last={props.data.sum_yesterday} />
					</dl>
				</div>
			</div>
		)
	}

	const data = await fetch("/operation/ajax_visitors_statistics_pageview")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	ReactDOM.render(<Div_statistics_pageview data={data} />, document.getElementById("div_statistics_pageview"))
}