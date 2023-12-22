// 결제 목록
function Div_table_payments_skeleton() {
	return (
		<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" id="div_table_payments_container">
			<Div_sub_title title={"결제 목록"} />
		
            <div class="p-4 rounded-lg bg-gray-50 w-full" id="table_payments">
                <Div_table_skeleton />
			</div>
		</div>
	)
}
