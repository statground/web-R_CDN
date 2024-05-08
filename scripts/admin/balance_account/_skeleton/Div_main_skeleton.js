function Div_main_skeleton(props) {    
	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

			<div class="col-span-10 space-y-4 md:grid-cols-1 justify-center item-center">
				<div class="w-full" id="div_select" name="div_select">
					<div class="flex flex-row justify-start items-center w-full space-x-2 animate-pulse">

						<div class="flex flex-col">
							<label for="small" class="block text-sm font-medium text-gray-900 dark:text-white">Year</label>
							<select id="small" class="block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
							</select>
						</div>

						<div class="flex flex-col">
							<label for="small" class="block text-sm font-medium text-gray-900 dark:text-white">Month</label>
							<select id="small" class="block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
							</select>
						</div>

						<button type="button" 
								class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-fit
									   hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
							선택
						</button>
					</div>
				</div>

				<div id="div_statistics_payments" name="div_statistics_payments"
					 class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"결제 현황"} />
						<dl class="grid grid-cols-3 w-full md:grid-cols-1 gap-8 pt-8 mx-auto text-gray-900 md:pt-4">
							<Div_sub_card_skeleton title={"총 회원 업그레이드 결제"} />
							<Div_sub_card_skeleton title={"부가세 (10%)"} />
							<Div_sub_card_skeleton title={"토스페이먼츠 수수료 (3.63%)"} />
							<Div_sub_card_skeleton title={"통계마당 수수료 (10%)"} />
							<Div_sub_card_skeleton title={"기타소득 세금 (8.8%)"} />
							<Div_sub_card_skeleton title={"정산액"} />
						</dl>
					</div>
				</div>

				<div id="div_statistics_table" name="div_statistics_table"
					class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse">
						<Div_sub_title title={"결제 목록"} />
						<dl class="flex flex-row justify-center items-center w-full p-4 mx-auto text-gray-900">
							<Div_table_skeleton />
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}