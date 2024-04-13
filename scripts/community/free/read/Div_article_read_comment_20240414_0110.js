function Div_article_read_comment(props) {
	function Div_comment_depth2(props) {
		return (
			<article class={
					 props.data.user_writer == 1
					 ?   "p-6 ml-4 text-base bg-blue-100 border border-blue-700 rounded-xl w-full space-y-2"
					 :   "p-6 ml-4 text-base bg-gray-200 border border-gray-700 rounded-xl w-full space-y-2"
				}>
		
				<div class="flex justify-between items-center space-x-2">
					<div class="flex items-center">
						<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
						<Span_btn_date date={props.data.created_at} />
					</div>
				</div>
				<div class="text-gray-500" id={"div_comment_" + props.data.uuid}></div>
				<div class="flex items-center space-x-4">
					{
						props.check_reader != "user"
						?   <button type="button" class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium"
									onClick={() => click_btn_edit_comment(props.data.uuid)}>
								<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg" class="w-4 h-4 mr-2" />
								수정
							</button>
						:   ""
					}
					{
						props.check_reader != "user"
						?   <button type="button" class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium"
									onClick={() => click_btn_delete_comment(props.data.uuid)}>
								<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg" class="w-4 h-4 mr-2" />
								삭제
							</button>
						:   ""
					}
				</div>
			</article>
		)
	}

	function Div_comment_depth1(props) {
		const comment_depth2_list = Object.keys(props.data.rereply).map((btn_data) =>  
			<Div_comment_depth2 data={props.data.rereply[btn_data]} check_reader={props.check_reader} />
		)

		return (
			<article class={
								props.data.user_writer == 1
								?   "p-6 text-base bg-blue-50 rounded-xl w-full space-y-2"
								:   "p-6 text-base bg-gray-100 rounded-xl w-full space-y-2"
						   }>
					
				<div class="flex justify-between items-center space-x-2">
					<div class="flex items-center">
						<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
						<Span_btn_date date={props.data.created_at} />
					</div>
				</div>
				<div class="text-gray-500" id={"div_comment_" + props.data.uuid}></div>
				<div class="flex items-center space-x-4">
					{
						check_agree_comment(props.is_secret, props.check_reader)
						?   <button type="button" class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium"
									onClick={() => click_reply(props.data.uuid)}>
								<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_re_reply.svg" class="w-4 h-4 mr-2" />
								대댓글
							</button>
						:   ""
					}
					{
						props.check_reader != "user"
						?   <button type="button" class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium"
									onClick={() => click_btn_edit_comment(props.data.uuid)}>
								<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg" class="w-4 h-4 mr-2" />
								수정
							</button>
						:   ""
					}
					{
						props.check_reader != "user"
						?   <button type="button" class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium"
									onClick={() => click_btn_delete_comment(props.data.uuid)}>
								<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg" class="w-4 h-4 mr-2" />
								삭제
							</button>
						:   ""
					}
				</div>
				{comment_depth2_list}
				<div id={"div_community_read_comment_new_" + props.data.uuid} class="w-full"></div>
			</article>
		)
	}

	const comment_list = Object.keys(props.data).map((btn_data) =>  
		<Div_comment_depth1 data={props.data[btn_data]} is_secret={props.is_secret} check_reader={props.check_reader} />
	)

	return (
		<section class="bg-white py-8 lg:py-16 antialiased">
			<div class="w-full mx-auto px-4 space-y-2">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-lg lg:text-2xl font-bold text-gray-900">댓글 ({props.data.length})</h2>
				</div>
				<form class="mb-6">
					<div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200">
						<div id="div_comment_new" class="w-full"></div>
					</div>
				</form>
				<div class="flex flex-col justify-center items-end w-full space-y-2">
					{comment_list}
				</div>

				<div class="flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full" 
					 id="div_community_read_comment_new" onClick={() => click_reply("")}>
					<button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 
								   group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300">
						<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
							댓글 쓰기
						</span>
					</button>
				</div>
			</div>
		</section>
	)
}