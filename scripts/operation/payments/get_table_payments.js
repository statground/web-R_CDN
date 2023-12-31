async function get_table_payments(){
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

	const data = await fetch("/operation/ajax_payments_table_payments")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

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
		columns: data.columns,
		columnDefs: data.columnDefs,
		data: data.data,
		"order": [[ 10, 'desc' ]],
		"oLanguage": { "sInfo" : "_TOTAL_건의 결제 중 _START_ ~ _END_번째" },
		"language": { "lengthMenu": "페이지당 _MENU_ 개씩 보기" }
	}
				
	ReactDOM.render(<Div_table id="table_payments_result" />, document.getElementById("table_payments"))
	$('#table_payments_result').DataTable(table_visitors_options);

	document.getElementById("div_table_payments_container").className = "p-4 bg-white rounded-lg md:p-8 text-center"
}