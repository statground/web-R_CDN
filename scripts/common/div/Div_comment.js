function Div_comment(props) {
	let category_menu = "community"
	
	let article_category_url = "/" + props.data.article_category_url
	if (article_category_url == "/free") {article_category_url = ""}

	return (
		<div class="bg-white border-b w-full">
			<div class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full"
				onClick={() => location.href='/' + category_menu + article_category_url + '/read/' + props.data.uuid_article + '/'}>
				<div class="flex flex-row justify-start items-center">
					<span class="font-normal text-sm w-fit max-w-9/12 mr-2 truncate ...">
						{props.data.content.replace(/<[^>]*>?/g, '')}
					</span>

					<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
				</div>
				<div class="flex flex-row justify-start items-center border border-gray-300 rounded-lg">
					<span class="font-normal text-xs w-full mr-2 truncate ...">
						<span class="bg-gray-300 px-2 mr-1">
							원글: 
						</span>

						{props.data.article_title}
					</span>
				</div>
			</div>
		</div>
	)
}