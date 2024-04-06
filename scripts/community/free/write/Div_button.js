function Div_button() {
	return (
		<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
			<button type="button" onClick={() => click_btn_submit()}
					class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
				완료
			</button>
			<button type="button" onClick={() => location.href=init_url}
					class="text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5
						   focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
				목록으로
			</button>
		</div>
	)
}