let class_span_btn_default = "flex flex-row justify-center items-center w-fit text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full"


function Span_btn_user(props) {
	return (
		<div>
			{
				props.role == "관리자"
				?	<span class={class_span_btn_default + " bg-purple-100 text-purple-800"}>
						<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
						{props.user_nickname}
					</span>
				:	<span class={class_span_btn_default + " bg-green-100 text-green-800"}>
						<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
						{props.user_nickname}
					</span>
			}
		</div>
	)
}


function Span_btn_date(props) {
	return (
		<div>
			<span class={class_span_btn_default + " bg-blue-100 text-blue-800"}>
				<img src={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_" + Number(props.date.split("-")[2].substr(0, 2)).toString() + ".svg"} class="w-3 h-3 mr-1" />
				{props.date}
			</span>
		</div>
	)
}


function Span_btn_article_read(props) {
	return (
		<div>
			{
				props.cnt_read > 0
				?   <span class={class_span_btn_default + " bg-gray-100 text-blue-800"}>
							<img src={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/eye.svg"} class="w-3 h-3 mr-1" />
							{props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
						</span>
				:   ""
			}
		</div>
	)
}

function Span_btn_article_comment(props) {
	return (
		<div>
			{
				props.cnt_comment > 0
				?   <span class={class_span_btn_default + " bg-purple-100 text-blue-800"}>
							<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment.svg" class="w-3 h-3 mr-1" />
							{props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
						</span>
				:   ""
			}
		</div>
	)
}


function Span_btn_article_new(props) {
	return (
		<div>
			{
				props.toggle == 1
				?   <span class={class_span_btn_default + " bg-yellow-500 text-white"}>
						최신글
					</span>
				:   ""
			}
		</div>
	)
}

function Span_btn_article_secret(props) {
	return (
		<div>
			{
				props.toggle == 1
				?   <span class="bg-gray-500 text-white text-xs px-2 py-0.5 ml-2 rounded-xl animate-pulse">
						비밀글
					</span>
				:   ""
			}
		</div>
	)
}