function Div_table_skeleton() {
	function Div_row() {
		return (
			<div class="flex items-center justify-between">
				<div>
					<div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
					<div class="w-32 h-2 bg-gray-200 rounded-full"></div>
				</div>
				<div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
			</div>
		)
	}

	return (
		<div role="status" class="max-w-full p-4 space-y-4 divide-y divide-gray-200 rounded animate-pulse md:p-6">
			<Div_row /><Div_row /><Div_row /><Div_row /><Div_row />
		</div>
	)
}
