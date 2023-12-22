async function get_table_visitors(type){
	let columns = null;
	let chartData = null;
	let div_table_daily = document.getElementById("table_daily");
	let div_table_monthly = document.getElementById("table_monthly");
	let div_table_yearly = document.getElementById("table_yearly");
	let class_div_graph = "p-4 rounded-lg bg-gray-50 w-full"

	let table_visitors_options = {
		"dom": 'Bfrtip',
		"buttons": ['copy', 'csv', 'excel', 'pdf', 'print'],
		"ordering": true,
		"bDestroy": true,
		"lengthChange": true,
		"searching": true,
		"scrollX": true,
		"scrollCollapse": true,
		"lengthChange": true,
		"lengthMenu":[5, 10, 20, 30, 40, 50],
		"pageLength": 10,
		columns: columns,
		columnDefs: [{"target":0, "className": "font-normal text-sm w-full"},
					{"target":1, "className": "font-normal text-sm w-full"},
					{"target":2, "className": "font-normal text-sm w-full"}],
		data: chartData,
		"order": [[ 0, 'desc' ]],
		"oLanguage": { "sInfo" : "_TOTAL_페이지 중 _START_ ~ _END_번째" },
		"language": { "lengthMenu": "페이지당 _MENU_ 개씩 보기" }
	}

	function Div_table(props)
	{
		return (
			<div class="w-full max-w-full">
				<div class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
					<div class="table-responsive w-full mx-auto">
						<table id={props.id} class="w-fit text-xm text-right text-gray-500 px-2">
							<thead class="text-xs text-gray-700 uppercase bg-gray-100"></thead>
						</table>
					</div>
				</div>
			</div>
		)
	}


	if (type == "daily") {
		div_table_daily.className = class_div_graph
		div_table_monthly.className = "hidden"
		div_table_yearly.className = "hidden"
		ReactDOM.render(<Div_table_skeleton />, document.getElementById("table_daily"))

		const data = await fetch("/operation/ajax_visitors_table")
		.then(res=> { return res.json(); })
		.then(res=> { return res; });

		table_visitors_options['columns'] = data.daily.columns;
		table_visitors_options['data'] = data.daily.data;

		ReactDOM.render(<Div_table id="div_table_daily" />, document.getElementById("table_daily"))
		$('#div_table_daily').DataTable(table_visitors_options);
		

	} else if (type == "monthly") {
		div_table_daily.className = "hidden"
		div_table_monthly.className = class_div_graph
		div_table_yearly.className = "hidden"
		ReactDOM.render(<Div_table_skeleton />, document.getElementById("table_monthly"))

		const data = await fetch("/operation/ajax_visitors_table")
		.then(res=> { return res.json(); })
		.then(res=> { return res; });

		table_visitors_options['columns'] = data.monthly.columns;
		table_visitors_options['data'] = data.monthly.data;

		ReactDOM.render(<Div_table id="div_table_monthly" />, document.getElementById("table_monthly"))
		$('#div_table_monthly').DataTable(table_visitors_options);
		

	} else if (type == "yearly") {
		div_table_daily.className = "hidden"
		div_table_monthly.className = "hidden"
		div_table_yearly.className = class_div_graph
		ReactDOM.render(<Div_table_skeleton />, document.getElementById("table_yearly"))

		const data = await fetch("/operation/ajax_visitors_table")
		.then(res=> { return res.json(); })
		.then(res=> { return res; });

		table_visitors_options['columns'] = data.yearly.columns;
		table_visitors_options['data'] = data.yearly.data;

		ReactDOM.render(<Div_table id="div_table_yearly" />, document.getElementById("table_yearly"))
		$('#div_table_yearly').DataTable(table_visitors_options);
	}

	document.getElementById("div_table_visitors_container").className = "p-4 bg-white rounded-lg md:p-8 text-center"
}