async function get_graph_visitors(type)
{
	let div_graph_monthly = document.getElementById("graph_monthly");
	let div_graph_yearly = document.getElementById("graph_yearly");
	let class_div_graph = "p-4 rounded-lg bg-gray-50 w-full"

	let options = {
		title: "일 평균 방문자 수(왼쪽, 파란색) / 페이지 뷰 합계(오른쪽, 빨간색)",
		series: {   0: {targetAxisIndex: 0},    1: {targetAxisIndex: 1} },
		width: '100%',
		legend: { position: 'none' },
		crosshair: {orientation: 'vertical', trigger: 'focus'},
		focusTarget: 'category',
		hAxis: { textStyle: { color: 'green' }, format: 'yy-MM-dd' },
		explorer: { actions: ['dragToZoom', 'rightClickToReset'], axis: 'horizontal' },
		bar: { groupWidth: "90%" } 
	};

	if (type == "daily") {
		bar(data.daily, 'graph_daily', options);

	} else if (type == "monthly") {
		div_graph_monthly.className = class_div_graph
		div_graph_yearly.className = "hidden"
		ReactDOM.render(<Div_graph_skeleton />, document.getElementById("graph_monthly"))

		const data = await fetch("/operation/ajax_visitors_graph")
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

		bar(data.monthly, 'graph_monthly', options);
		
	} else if (type == "yearly") {
		div_graph_monthly.className = "hidden"
		div_graph_yearly.className = class_div_graph
		ReactDOM.render(<Div_graph_skeleton />, document.getElementById("graph_yearly"))

		const data = await fetch("/operation/ajax_visitors_graph")
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

		bar(data.yearly, 'graph_yearly', options);
	}

	document.getElementById("div_graph_visitors_container").className = "p-4 bg-white rounded-lg md:p-8 text-center"
}