function Div_article(props) {
	return (
		<div class="bg-white border-b w-full">
			<div class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full"
				onClick={() => window.open(props.data.category_url)}>
				<div class="flex flex-row justify-start items-center">
					<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
						{props.data.title}
					</span>

					<Span_btn_article_new toggle={props.data.is_new} />
					<Span_btn_article_secret toggle={props.data.is_secret} />

				</div>
				<div class="flex flex-row justify-start items-center">
					<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
					<Span_btn_date date={props.data.created_at} />
					
				</div>
			</div>
		</div>
	)
}