function Div_new_article_list_youtube(props) {
	return (
		<div class="bg-white border-b w-full">
			<a href={init_url + 'read/' + props.data.uuid + '/'}
			class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
				<div class="flex justify-center items-center w-full">
					<img src={props.data.youtube_thumbnail} alt="YouTube Thumbnail" class="w-full h-auto object-cover" />
				</div>
				<div class="flex flex-row justify-start items-center space-x-2">
					<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
						{props.data.title}
					</span>

					<Span_btn_article_new toggle={props.data.is_new} />
					<Span_btn_article_secret toggle={props.data.is_secret} />
					<Span_btn_my_article toggle={props.data.check_reader} />
				</div>
				<div class="flex flex-wrap justify-start items-center w-full space-x-2">
					<Span_btn_user user_nickname={props.data.user_nickname} role={props.data.user_role} />
					<Span_btn_date date={props.data.created_at} />
					<Span_btn_article_read cnt_read={props.data.cnt_read} />
					<Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
				</div>
			</a>
		</div>
	)
}