function Div_article_read_header(props) {
	return (
		<div class="flex flex-col justify-center items-start py-4 border-t border-b border-gray-200 w-full">
			<div class="flex flex-row justify-start items-end w-full">
				<span class="flex flex-row justify-start items-center text-lg font-normal w-full">
					{props.data.title}
				</span>
			</div>

			<div class="flex flex-row justify-end items-center w-full">
				<span class="flex flex-row justify-end items-center text-md font-normal w-full">
					<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
					<Span_btn_date date={props.data.created_at} />
					<Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
					<Span_btn_article_new toggle={props.data.is_new} />
					<Span_btn_article_secret toggle={props.data.is_secret} />
				</span>
			</div>
		</div>
	)
}