function draw_chart(inputData, tab_id_active, tab_id_inactive) {
	google.charts.load('current', {'packages':['bar']});
	google.charts.setOnLoadCallback(drawChart);

	document.getElementById(tab_id_active).className = class_tab_active
	document.getElementById(tab_id_inactive).className = class_tab_inactive
	
	let chart_data = []
	chart_data.push(['Time', '접속 횟수', '이용자 수'])
	for (var i = 0 ; i < Object.keys(inputData).length ; i++) {
		chart_data.push([inputData[Object.keys(inputData)[i]].date
					   , inputData[Object.keys(inputData)[i]].cnt_connect
					   , inputData[Object.keys(inputData)[i]].cnt_user])
	}


	function drawChart() {
		var resdata = google.visualization.arrayToDataTable(chart_data);

		var options = {
			series: {
				0: {targetAxisIndex: 0},
				1: {targetAxisIndex: 1}
			},
			vAxes: {
				0: {title: '접속 횟수'},
				1: {title: '이용자 수'}
			},
			width: '100%',
			crosshair: {orientation: 'vertical', trigger: 'focus'},
			focusTarget: 'category',
			hAxis: { textStyle: { color: 'green' }, format: 'yy-MM-dd' },
			explorer: { actions: ['dragToZoom', 'rightClickToReset'], axis: 'horizontal' },
			bar: { groupWidth: "90%" } 
		};

		var chart = new google.charts.Bar(document.getElementById('div_statistics_graph'));
		chart.draw(resdata, google.charts.Bar.convertOptions(options));
		$(window).smartresize(function () {
			chart.draw(resdata, google.charts.Bar.convertOptions(options));
		});
	}
}