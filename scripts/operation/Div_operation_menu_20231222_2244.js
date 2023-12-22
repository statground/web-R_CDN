function Div_operation_menu() {
	function Div_menu_button(props) {
		return (
			<button type="button" onClick={() => location.href=props.url}
					class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200
						focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
				{props.name}
			</button>
		)
	}

	return (
		<div class="col-span-2 md:grid-cols-1 justify-center item-center">
			<div class="flex flex-col md:flex-row lg:w-48 md:w-full item-center">
				<Div_menu_button name={"첫 화면"} url={'/operation/'} />
				<Div_menu_button name={"방문 현황"} url={'/operation/visitors/'} />
				<Div_menu_button name={"회원 현황"} url={'/operation/members/'} />
				<Div_menu_button name={"결제 현황"} url={'/operation/payments/'} />
				<Div_menu_button name={"정산액 조회(작업중)"} url={'#'} />
			</div>
		</div>
	)
}