function Div_buttons() {
	return (
		<div class="flex flex-col justify-center items-center w-full">
			<button type="button" onClick={() => click_btn_submit()}
					class="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full
						hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
				수정 완료
			</button>
			<a href="/account/myinfo/"
			class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 w-full overflow-hidden text-sm font-medium text-gray-900 rounded-lg 
					group bg-gradient-to-br from-cyan-500 to-blue-500 
					group-hover:from-cyan-500 group-hover:to-blue-500 
					hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200">
				<span class="relative text-center px-5 py-2.5 w-full transition-all ease-in duration-75 bg-white rounded-lg group-hover:bg-opacity-0">
					돌아가기
				</span>
			</a>
		</div>
	)
}