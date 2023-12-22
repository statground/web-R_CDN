async function get_members_statistics_count() {
	function Div_statistics_count(props){
		return(
			<div class="p-4 bg-white rounded-lg text-center md:p-8">
				<Div_sub_title title={"가입자 수"} />
			
				<div class="w-full bg-white rounded-lg shadow">
					<dl class="grid grid-cols-4 w-full gap-8 p-4 mx-auto text-gray-900 md:grid-cols-1 md:p-8">
						<Div_card title={"총 가입자 수"} value={props.data.cnt_total} unit={"명"} />
						<Div_card title={"올해 가입자 수"} value={props.data.cnt_current_year} unit={"명"} sub={"작년"} value_last={props.data.cnt_last_year} />
						<Div_card title={"이번 달 가입자 수"} value={props.data.cnt_current_month} unit={"명"} sub={"지난 달"} value_last={props.data.cnt_last_month} />
						<Div_card title={"오늘 가입자 수"} value={props.data.cnt_current_day} unit={"명"} sub={"지난 달"} value_last={props.data.cnt_last_day} />
					</dl>
				</div>
			</div>
		)
	}

	const data = await fetch("/operation/ajax_members_statistics_count")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	ReactDOM.render(<Div_statistics_count data={data} />, document.getElementById("div_statistics_count"))
}