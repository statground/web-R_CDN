async function get_myinfo_connection() {
	function Div_tab_connection_content() {
		return (
			<div class="flex flex-col justify-center items-center w-full space-y-4 p-4 md:space-y-0 md:p-0">
				<div id="div_tab_connection_content_cnt_table_shinyapps" class="flex flex-row justify-center items-center w-full"></div>
				<div id="div_tab_connection_content_cnt_table_visit" class="flex flex-row justify-center items-center w-full"></div>
			</div>
		)
	}

	const tempdata = await fetch("/account/ajax_get_myinfo_connection/")
							.then(res=> { return res.json(); })
							.then(res=> { return res; });
	let tempdata_cnt_table_shinyapp = tempdata.cnt_table_shinyapp   // Shinyapp 실행 기록
	for (var i = 0 ; i < Object.keys(tempdata_cnt_table_shinyapp).length ; i++) {
		let var_date = tempdata_cnt_table_shinyapp[Object.keys(tempdata_cnt_table_shinyapp)[i]].date
		let var_cnt = tempdata_cnt_table_shinyapp[Object.keys(tempdata_cnt_table_shinyapp)[i]].cnt
		
		data_cnt_table_shinyapp.push([new Date(Number(var_date.substr(0, 4)), Number(var_date.substr(5, 2)), Number(var_date.substr(8, 2))), Number(var_cnt)])
	}

	let tempdata_cnt_table_visit = tempdata.cnt_table_visit         // 웹사이트 접속 기록
	for (var i = 0 ; i < Object.keys(tempdata_cnt_table_visit).length ; i++) {
		let var_date = tempdata_cnt_table_visit[Object.keys(tempdata_cnt_table_visit)[i]].date
		let var_cnt = tempdata_cnt_table_visit[Object.keys(tempdata_cnt_table_visit)[i]].cnt
		
		data_cnt_table_visit.push([new Date(Number(var_date.substr(0, 4)), Number(var_date.substr(5, 2)), Number(var_date.substr(8, 2))), Number(var_cnt)])
	}

	ReactDOM.render(<Div_tab_connection_content />, document.getElementById("div_tab_connection_content"))
	

	google.charts.load("current", {packages:["calendar"]});
	google.charts.setOnLoadCallback(drawChart_data_cnt_table_shinyapp);

	google.charts.load("current", {packages:["calendar"]});
	google.charts.setOnLoadCallback(drawChart_data_cnt_table_visit);
}