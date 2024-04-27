function Div_new_comment(props) {
	return (
		<div class="bg-white border-b w-full">
			<a href={init_url + 'read/' + props.data.uuid_article + '/'}
				class="flex flex-col px-6 py-4 space-y-2 cursor-pointer hover:bg-gray-100 w-full">
				<div class="flex flex-row justify-start items-center">
					<span class="font-normal text-sm w-fit max-w-full truncate ...">
						{props.data.content.replace(/<[^>]*>?/g, '')}
					</span>
				</div>

				<div class="flex flex-row justify-start items-center border border-gray-300 rounded-lg">
					<span class="font-normal text-xs text-gray-500 w-full mr-2 truncate ...">
						<span class="bg-gray-300 px-2 py-1 mr-1">
							원글: 
						</span>

						{props.data.article_title}
					</span>
				</div>

				<div class="flex flex-wrap justify-start items-center space-x-2">
					<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
					<Span_btn_date date={props.data.created_at} />
				</div>
			</a>
		</div>
	)
}