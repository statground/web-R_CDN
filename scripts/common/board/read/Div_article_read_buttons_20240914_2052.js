function Div_article_read_buttons(props) {
	return (
		<div class="flex flex-col justify-center items-center w-full space-y-2">
			<div class="flex flex-col justify-center items-center space-y-2 w-full">
				<button type="button" onClick={
												gv_username == ""
												?   () => alert("로그인이 필요합니다.")
												:   () => location.href=init_url + 'write/'}
						class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
								hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
					새 글 쓰기
				</button>
				<a href={init_url}
				   class="text-gray-900 bg-white border border-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
						  focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100">
					목록으로
				</a>
			</div>
			{
				props.data.check_reader != "user"
				?   <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
						<button onClick={() => location.href=init_url + "edit/" + orderID + "/"}
								class="text-green-700 border border-green-700 font-medium rounded-lg text-sm px-5 py-1 text-center w-full
									   hover:text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
							수정
						</button>
						<button type="button" onClick={() => click_btn_delete()}
								class="text-red-700 border border-red-700 font-medium rounded-lg text-sm px-5 py-1 text-center w-full
									   hover:text-white hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300">
							삭제
						</button>
					</div>
				:   ""
			}
		</div>
	)
}