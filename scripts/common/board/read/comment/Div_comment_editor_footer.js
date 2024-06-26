function Div_comment_editor_footer(props) {
	return (
		<div class="flex flex-row justify-end items-center w-full space-x-2">
			<input id={
						props.uuid_comment == null
						?   "chk_secret_new"
						:   "chk_secret_" + props.uuid_comment
						}
					type="checkbox" value="" 
					class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded 
							focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2" />
				<label for={
								props.uuid_comment == null
								?   "chk_secret_new"
								:   "chk_secret_" + props.uuid_comment
						}
					class="ms-2 text-sm font-medium text-gray-900">비밀 댓글로 작성하기 (본인과 글 작성자, 관리자만 읽을 수 있습니다.)</label>
			<button type="button" onClick={props.function}
				class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center
						hover:bg-gradient-to-bl hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-cyan-300">
				{props.text}
			</button>
		</div>
	)
}