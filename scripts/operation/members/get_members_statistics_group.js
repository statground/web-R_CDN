async function get_members_statistics_group() {
	function Div_statistics_group(props){
		return(
			<div class="p-4 bg-white rounded-lg text-center md:p-8">
				<Div_sub_title title={"등급별 멤버 수"} />
			
				<div class="w-full bg-white rounded-lg shadow">
					<dl class="grid grid-cols-4 w-full gap-8 p-4 mx-auto text-gray-900 md:grid-cols-1 md:p-8">
						<Div_card title={"기관회원"} value={props.data.cnt_44064} unit={"명"} />
						<Div_card title={"VIP회원"} value={props.data.cnt_254} unit={"명"} />
						<Div_card title={"정회원"} value={props.data.cnt_3} unit={"명"} />
						<Div_card title={"준회원"} value={props.data.cnt_2} unit={"명"} />
					</dl>
				</div>
			</div>
		)
	}

	const data = await fetch("/operation/ajax_members_statistics_group")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	ReactDOM.render(<Div_statistics_group data={data} />, document.getElementById("div_statistics_group"))
}
