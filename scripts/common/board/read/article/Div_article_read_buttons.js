function Div_article_read_buttons(props) {
	let init_url = "/community/"
	if (url != "free") {init_url += url + "/"}

	return (
		<div class="flex flex-col justify-center items-center w-full space-y-2">
			<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
				<button type="button" onClick={
												gv_username == ""
												?   () => alert("로그인이 필요합니다.")
												:   () => location.href=init_url + 'write/'}
						class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
								hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
					새 글 쓰기
				</button>
				<button type="button" onClick={() => location.href=init_url}
						class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
							hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300">
					목록으로
				</button>
			</div>
			{
				props.data.check_reader != "user"
				?   <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">

						<button type="button" onClick={() => location.href=init_url + "edit/" + orderID + "/"}
								class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 font-medium rounded-lg text-sm px-5 py-1.5 text-center
									   hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200">
							수정
						</button>
						<button type="button" onClick={() => click_btn_delete()}
								class="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 font-medium rounded-lg text-sm px-5 py-1.5 text-center
									   hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100">
							삭제
						</button>
					</div>
				:   ""
			}
		</div>
	)
}