function Div_main_board_skeleton() {
	function Div_board_loading(props) {
		function Div_board_loading_tr() {
			return (
				<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
					<td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white animate-pulse">
						<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full mb-2.5"></div>
						<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</td>
				</tr>
			)
		}

		return (
			<div class="lg:col-span-4 md:col-span-12 mx-4 pb-8 justify-center text-center content-center" id={props.id}>
				<h5 class="mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900">
					{props.title}
				</h5>
				<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr></tr>
					</thead>
					<tbody>
						<Div_board_loading_tr /><Div_board_loading_tr /><Div_board_loading_tr /><Div_board_loading_tr /><Div_board_loading_tr />
					</tbody>
				</table>
			</div>
		)
	}

	return (
		<div class="flex flex-row pt-12 pb-12 justify-center" id="div_board">
			<div class="container mx-auto">
				<div class="grid grid-cols-3 md:grid-cols-1 mx-auto">
					<Div_board_loading title={"자유게시판"} id={"div_main_board_free"}/>
					<Div_board_loading title={"가입인사/방명록"} id={"div_main_board_visitor"}/>
					<Div_board_loading title={"공지사항"} id={"div_main_board_notice"}/>
					<Div_board_loading title={"유튜브 강의 게시판"} id={"div_main_board_book"}/>
					<Div_board_loading title={"워크샵 게시판"} id={"div_main_board_workshop"}/>
					<Div_board_loading title={"책 게시판"} id={"div_main_board_youtube"}/>
				</div>
			</div>
		</div>
	)
}