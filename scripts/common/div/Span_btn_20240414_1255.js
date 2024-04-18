let class_span_btn_default = "flex flex-row justify-center items-center w-fit text-xs font-medium px-2.5 py-0.5 rounded-full"


function Span_btn_user(props) {
	if (props.role == "관리자") {
		return (
			<span class={class_span_btn_default + " bg-yellow-100 text-yellow-800"}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
				{props.user_nickname}
			</span>
		)
	} else if (props.role == "기업회원") {
		return (
			<span class={class_span_btn_default + " bg-red-100 text-red-800"}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
				{props.user_nickname}
			</span>
		)
	} else if (props.role == "VIP회원") {
		return (
			<span class={class_span_btn_default + " bg-blue-100 text-blue-800"}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
				{props.user_nickname}
			</span>
		)
	} else if (props.role == "정회원") {
		return (
			<span class={class_span_btn_default + " bg-green-100 text-green-800"}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
				{props.user_nickname}
			</span>
		)
	} else if (props.role == "준회원") {
		return (
			<span class={class_span_btn_default + " bg-gray-100 text-gray-800"}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
				{props.user_nickname}
			</span>
		)
	}

}


function Span_btn_date(props) {
	return (
		<span class={class_span_btn_default + " bg-blue-100 text-blue-800"}>
			<img src={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_" + Number(props.date.split("-")[2].substr(0, 2)).toString() + ".svg"} class="w-3 h-3 mr-1" />
			{props.date}
		</span>
	)
}


function Span_btn_article_read(props) {
	if (props.cnt_read > 0) {
		return (
			<span class={class_span_btn_default + " bg-gray-100 text-blue-800"}>
				<img src={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/eye.svg"} class="w-3 h-3 mr-1" />
				{props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
			</span>
		)
	}
}

function Span_btn_article_comment(props) {
	if (props.cnt_comment > 0) {
		return (
			<span class={class_span_btn_default + " bg-purple-100 text-blue-800"}>
				<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment.svg" class="w-3 h-3 mr-1" />
				{props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
			</span>
		)
	}
}


function Span_btn_article_new(props) {
	if (props.toggle == 1) {
		return (
			<span class={class_span_btn_default + " bg-yellow-500 text-white animate-pulse"}>
				최신글
			</span>
		)
	}
}

function Span_btn_article_secret(props) {
	if (props.toggle == 1) {
		return (
			<span class={class_span_btn_default + " bg-gray-500 text-white animate-pulse"}>
				비밀글
			</span>
		)
	}
}

function Span_btn_comment_secret(props) {
	if (props.toggle == 1) {
		return (
			<span class={class_span_btn_default + " bg-gray-500 text-white animate-pulse"}>
				비밀댓글
			</span>
		)
	}
}

function Span_btn_my_article(props) {
	if (props.toggle == "writer") {
		return (
			<span class={class_span_btn_default + " bg-red-500 text-white animate-pulse"}>
				내가 쓴 글
			</span>
		)
	}
}

function Span_btn_my_comment(props) {
	if (props.toggle == "writer") {
		return (
			<span class={class_span_btn_default + " bg-red-500 text-white animate-pulse"}>
				내가 쓴 댓글
			</span>
		)
	}
}