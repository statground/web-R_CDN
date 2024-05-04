function drawChart_data_cnt_table_shinyapp() {
	var dataTable = new google.visualization.DataTable();
	dataTable.addColumn({ type: 'date', id: 'Date' });
	dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
	dataTable.addRows(data_cnt_table_shinyapp);

	var options = {
		title: "Web-R 실행 기록",
		calendar: { cellSize: window.innerWidth / 100 + 2 },
	};

	var chart = new google.visualization.Calendar(document.getElementById('div_tab_connection_content_cnt_table_shinyapps'));

	chart.draw(dataTable, options);
}