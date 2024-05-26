function Div_article_read_header(props) {
	return (
		<div class="flex flex-col justify-center items-start py-4 border-t border-b border-gray-200 w-full">
			<div class="flex flex-row justify-start items-end w-full">
				<span class="flex flex-row justify-start items-center text-lg font-extrabold w-full space-x-2">
					{props.data.title}
					<div></div>
					<Span_btn_article_new toggle={props.data.is_new} />
					<Span_btn_article_secret toggle={props.data.is_secret} />
					<Span_btn_my_article toggle={props.data.check_reader} />
				</span>
			</div>

			<div class="flex flex-row justify-end items-center w-full">
				<span class="flex flex-row justify-end items-center text-md font-normal w-full space-x-2">
					<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
					<Span_btn_date date={props.data.created_at} />
					<Span_btn_article_read cnt_read={props.data.cnt_read} />
					<Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
				</span>
			</div>
			
			{
				props.data.file_url != null
				?   <div class="flex flex-row justify-end items-center w-full mt-2">
						<a href={"/" + props.data.file_url} target="_blank" class="flex flex-row justify-end items-center text-xs font-normal w-fit space-x-2 cursor-pointer hover:bg-gray-100">
							첨부파일: {props.data.file_name}
						</a>
					</div>
				:   null
			}
			
		</div>
	)
}