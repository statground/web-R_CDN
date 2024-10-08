function Div_article_read_comment(props) {
	function Div_btn_comment_footer(props) {
		return (
			<button type="button" class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium" onClick={props.function}>
				<img src={props.url_image} class="w-4 h-4 mr-2" />
				{props.text}
			</button>
		)
	}

	function Div_comment_depth2(props) {
		return (
			<article class={
								props.data.user_writer == 1
								?   "p-6 ml-4 text-base bg-blue-100 border border-blue-700 rounded-xl w-full space-y-2"
								:   "p-6 ml-4 text-base bg-gray-200 border border-gray-700 rounded-xl w-full space-y-2"
							}>
		
				<div class="flex justify-between items-center space-x-2">
					<div class="flex flex-row justify-start items-center space-x-2">
						<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
						<Span_btn_date date={props.data.created_at} />
						<Span_btn_comment_secret toggle={props.data.is_secret} />
						<Span_btn_my_comment toggle={props.data.check_comment_reader} />
					</div>
				</div>
				<div class="text-gray-500" id={"div_comment_" + props.data.uuid}></div>
				<div class="flex items-center space-x-4" id={"div_comment_footer_" + props.data.uuid}>
					{
						props.data.check_comment_reader != "user" && props.data.active == 1
						&&   <Div_btn_comment_footer text={"수정"} function={() => click_btn_edit_comment(props.data.uuid)} url_image={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg"} />
					}
					{
						props.data.check_comment_reader != "user" && props.data.active == 1
						&&  <Div_btn_comment_footer text={"삭제"} function={() => click_btn_delete_comment(props.data.uuid)} url_image={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg"} />
					}
				</div>
			</article>
		)
	}

	function Div_comment_depth1(props) {
		const comment_depth2_list = Object.keys(props.data.rereply).map((btn_data) =>  
			<Div_comment_depth2 data={props.data.rereply[btn_data]} />
		)

		return (
			<article class={
								props.data.user_writer == 1
								?   "p-6 text-base bg-blue-50 rounded-xl w-full space-y-2"
								:   "p-6 text-base bg-gray-100 rounded-xl w-full space-y-2"
						   }>
					
				<div class="flex justify-between items-center space-x-2">
					<div class="flex flex-row justify-start items-center space-x-2">
						<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
						<Span_btn_date date={props.data.created_at} />
						<Span_btn_comment_secret toggle={props.data.is_secret} />
						<Span_btn_my_comment toggle={props.data.check_comment_reader} />
					</div>
				</div>
				<div class="text-gray-500" id={"div_comment_" + props.data.uuid}></div>
				<div class="flex items-center space-x-4" id={"div_comment_footer_" + props.data.uuid}>
					{
						check_agree_comment(props.is_secret, props.check_reader)
						&&   <Div_btn_comment_footer text={"대댓글"} function={() => click_btn_reply_comment(props.data.uuid)} url_image={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_re_reply.svg"} />
					}
					{
						props.data.check_comment_reader != "user" && props.data.active == 1
						&&   <Div_btn_comment_footer text={"수정"} function={() => click_btn_edit_comment(props.data.uuid)} url_image={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg"} />
					}
					{
						props.data.check_comment_reader != "user" && props.data.active == 1
						&&  <Div_btn_comment_footer text={"삭제"} function={() => click_btn_delete_comment(props.data.uuid)} url_image={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg"} />
					}
				</div>
				{comment_depth2_list}
				<div id={"div_community_read_comment_new_" + props.data.uuid} class="hidden">
					{
						check_agree_comment(props.is_secret, props.check_reader)
						&&   <Div_comment_form title={"대댓글 쓰기"} class={"mt-4 p-4 bg-white rounded-lg w-full space-y-2"} uuid_comment={props.data.uuid} />
					}
				</div>
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

				{
					check_agree_comment(props.is_secret, props.check_reader)
					&&   <div class="flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full" id="div_community_read_comment_new">
							<Div_comment_form title={"댓글 쓰기"} class={"w-full space-y-2"} uuid_comment={null} />
						</div>
				}
			</div>
		</section>
	)
}