function Div_new_article_list(props) {
	// 링크 규칙:
	// - free / rblogger: /community/read/<uuid>/
	// - notebook: vda.url (props.data.url)
	let href = init_url + 'read/' + props.data.uuid + '/';
	if (props.data.category_url === 'notebook' && props.data.url) {
		href = props.data.url;
	}

	// 카테고리 라벨
	let category_title = '커뮤니티';
	let category_title_color = ' bg-blue-100 text-blue-700 border-blue-300';

	if (props.data.category_url === 'free') {
		category_title = '자유게시판';
		category_title_color = ' bg-blue-100 text-blue-700 border-blue-300';
	} else if (props.data.category_url === 'rblogger') {
		category_title = 'R-Blogger';
		category_title_color = ' bg-purple-100 text-purple-700 border-purple-300';
	} else if (props.data.category_url === 'notebook') {
		category_title = 'Web-R Notebook';
		category_title_color = ' bg-emerald-100 text-emerald-700 border-emerald-300';
	}

	return (
		<div class="bg-white w-full">
			<a href={href}
			   class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-50 rounded-lg mx-3 my-2 w-full">
				<div class="flex flex-row justify-start items-center space-x-2">
					<span class={"px-2 py-0.5 border rounded-full text-xs font-semibold w-fit max-w-9/12" + category_title_color}>
						{category_title}
					</span>

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
