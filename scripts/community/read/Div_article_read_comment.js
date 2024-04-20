function Div_article_read_comment(props) {
	const comment_list = Object.keys(props.data).map((btn_data) =>  
		<article class="p-6 text-base bg-gray-50 rounded-lg w-full">
			<footer class="flex justify-between items-center mb-2">
				<div class="flex items-center">
					<Span_btn_user user_nickname = {props.data[btn_data].user_nickname} role = {props.data[btn_data].user_role} />
					<Span_btn_date date={props.data[btn_data].created_at} />
				</div>
			</footer>
			<div class="text-gray-500" id={"div_comment_" + props.data[btn_data].uuid}></div>
			<div class="flex items-center mt-4 space-x-4">
				<button type="button" class="flex items-center text-sm text-gray-500 hover:underline font-medium">
					<svg class="w-3 h-3 mr-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
						<path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z"/>
					</svg>
					Reply
				</button>
			</div>
		</article>
	)


	return (
		<section class="bg-white py-8 lg:py-16 antialiased">
			<div class="w-full mx-auto px-4">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-lg lg:text-2xl font-bold text-gray-900">댓글 ({props.cnt_comment})</h2>
				</div>
				<form class="mb-6">
					<div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200">
						<div id="div_comment_new" class="w-full"></div>
					</div>
				</form>
				<div class="flex flex-col justify-center items-center w-full space-y-0">
					{comment_list}
				</div>
			</div>
		</section>
	)
}