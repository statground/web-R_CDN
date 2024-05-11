function Div_main(props) {
	let class_span_btn_default = "flex flex-row justify-center items-center w-fit text-xs font-medium px-2.5 py-0.5 rounded-full"

	const payment_list = Object.keys(props.data.table).map((btn_data) =>  
		<div class="bg-white border-b w-full">
			<div class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
				<div class="flex flex-row justify-start items-center space-x-2">
					<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
						{props.data.table[btn_data].product_name}
					</span>
				</div>
				<div class="flex flex-wrap justify-start items-center w-full space-x-2">
					<span class={class_span_btn_default + " bg-green-100 text-green-800"}>
						<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
						{props.data.table[btn_data].username}
					</span>

					<span class={class_span_btn_default + " bg-gray-100 text-gray-800"}>
						{props.data.table[btn_data].email}
					</span>

					<span class={class_span_btn_default + " bg-yellow-100 text-yellow-800"}>
						{props.data.table[btn_data].amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")}원
					</span>

					<span class={class_span_btn_default + " bg-blue-100 text-blue-800"}>
						<img src={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_" + Number(props.data.table[btn_data].updated_at.split("-")[2].substr(0, 2)).toString() + ".svg"} class="w-3 h-3 mr-1" />
						{props.data.table[btn_data].updated_at}
					</span>
				</div>
			</div>
		</div>
	)

	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

			<div class="col-span-10 md:grid-cols-1 justify-center item-center space-y-4">
				<div class="w-full" id="div_select" name="div_select">
					<div class="flex flex-row justify-start items-center w-full space-x-2">

						<div class="flex flex-col">
							<label for="sel_year" class="block text-sm font-medium text-gray-900 dark:text-white">Year</label>
							<select id="sel_year" class="block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
							</select>
						</div>

						<div class="flex flex-col">
							<label for="sel_momth" class="block text-sm font-medium text-gray-900 dark:text-white">Month</label>
							<select id="sel_momth" class="block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
								<option value="1">01</option>
								<option value="2">02</option>
								<option value="3">03</option>
								<option value="4">04</option>
								<option value="5">05</option>
								<option value="6">06</option>
								<option value="7">07</option>
								<option value="8">08</option>
								<option value="9">09</option>
								<option value="10">10</option>
								<option value="11">11</option>
								<option value="12">12</option>
							</select>
						</div>

						<button type="button" 
								onClick={() => location.href="/admin/balance_account/?year=" + document.getElementById("sel_year").value + "&month=" + document.getElementById("sel_momth").value}
								class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-fit
									   hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
							선택
						</button>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"결제 현황"} />
						<dl class="grid grid-cols-3 w-full gap-8 p-4 mx-auto text-gray-900 md:p-8">
							<Div_sub_card title={"총 회원 업그레이드 결제"} value={props.data.count.amt_total['0']} unit={"원"} />
							<Div_sub_card title={"부가세 (10%)"} value={props.data.count.amt_tax['0']} unit={"원"} />
							<Div_sub_card title={"토스페이먼츠 수수료 (3.63%)"} value={props.data.count.amt_toss['0']} unit={"원"} />
							<Div_sub_card title={"통계마당 수수료 (10%)"} value={props.data.count.amt_statground['0']} unit={"원"} />
							<Div_sub_card title={"기타소득 세금 (8.8%)"} value={props.data.count.amt_benefit_tax['0']} unit={"원"} />
							<Div_sub_card title={"정산액"} value={props.data.count.amt_result['0']} unit={"원"} />
						</dl>
					</div>
				</div>

				<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
					<div class="p-4 bg-white rounded-lg md:p-8 text-center">
						<Div_sub_title title={"결제 목록"} />

						<dl class="flex flex-col justify-center items-center w-full p-4 mx-auto text-gray-900">
							{payment_list}
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}