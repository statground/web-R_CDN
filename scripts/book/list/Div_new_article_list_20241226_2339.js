function Div_new_article_list({data}) {
	const {
		uuid, title, is_new, is_secret, check_reader,
		user_nickname, user_role, created_at,
		category_sub_title, cnt_read, cnt_comment
	} = data;

	return (
		<div class="bg-white border-b w-full">
			<div class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full" 
				onClick={() => location.href=`/book/read/${uuid}/`}>
				<div class="flex flex-row justify-start items-center space-x-2">
					<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">{title}</span>
					<Span_btn_article_new toggle={is_new} />
					<Span_btn_article_secret toggle={is_secret} />
					<Span_btn_my_article toggle={check_reader} />
				</div>
				<div class="flex flex-wrap justify-start items-center w-full space-x-2">
					<Span_btn_user user_nickname={user_nickname} role={user_role} />
					<Span_btn_date date={created_at} />
					<Span_btn_book title={category_sub_title} />
					<Span_btn_article_read cnt_read={cnt_read} />
					<Span_btn_article_comment cnt_comment={cnt_comment} />
				</div>
			</div>
		</div>
	)
}