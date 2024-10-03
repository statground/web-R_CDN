let class_span_btn_default = "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl"

// 사용자 역할에 따른 버튼 렌더링
function Span_btn_user(props) {
	const roles = {
		"관리자": "yellow", "기업회원": "red", "VIP회원": "blue",
		"정회원": "green", "준회원": "gray"
	};
	const role = roles[props.role] || "gray";
	return (
		<span class={`${class_span_btn_default} text-xs bg-${role}-100 text-${role}-800`}>
			<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
			{props.user_nickname}
		</span>
	);
}

// 날짜 버튼 렌더링
function Span_btn_date(props) {
	return (
		<span class={`${class_span_btn_default} text-xs bg-blue-100 text-blue-800`}>
			<img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_${Number(props.date.split("-")[2].substr(0, 2))}.svg`} class="w-3 h-3 mr-1" />
			{props.date}
		</span>
	);
}

// 조회수 버튼 렌더링 (0보다 클 때만)
function Span_btn_article_read(props) {
	return props.cnt_read > 0 && (
		<span class={`${class_span_btn_default} text-xs bg-gray-100 text-blue-800`}>
			<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/eye.svg" class="w-3 h-3 mr-1" />
			{props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
		</span>
	);
}

// 댓글 수 버튼 렌더링 (0보다 클 때만)
function Span_btn_article_comment(props) {
	return props.cnt_comment > 0 && (
		<span class={`${class_span_btn_default} text-xs bg-purple-100 text-blue-800`}>
			<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment.svg" class="w-3 h-3 mr-1" />
			{props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
		</span>
	);
}

// 카테고리 버튼 렌더링
function Span_btn_category(props) {
	return (
		<span class={`${class_span_btn_default} text-xs bg-cyan-100 text-cyan-800`}>
			<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/category.svg" class="w-3 h-3 mr-1" />
			{props.category}
		</span>
	);
}

// 새 글 표시 (toggle이 1일 때만)
function Span_btn_article_new(props) {
	return props.toggle === 1 && (
		<span class={`${class_span_btn_default} text-[10px] bg-red-500 text-white animate-pulse`}>NEW</span>
	);
}

// 비밀글 표시 (toggle이 1일 때만)
function Span_btn_article_secret(props) {
	return props.toggle === 1 && (
		<span class={`${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse`}>SECRET</span>
	);
}

// 비밀 댓글 표시 (toggle이 1일 때만)
function Span_btn_comment_secret(props) {
	return props.toggle === 1 && (
		<span class={`${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse`}>SECRET</span>
	);
}

// 내 글 표시 (toggle이 "writer"일 때만)
function Span_btn_my_article(props) {
	return props.toggle === "writer" && (
		<span class={`${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse`}>MY</span>
	);
}

// 내 댓글 표시 (toggle이 "writer"일 때만)
function Span_btn_my_comment(props) {
	return props.toggle === "writer" && (
		<span class={`${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse`}>MY</span>
	);
}

// 책 제목 표시 (title이 null이 아닐 때만)
function Span_btn_book(props) {
	return props.title && (
		<span class={`${class_span_btn_default} text-xs bg-green-100 text-green-800`}>
			<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/book.svg" class="w-3 h-3 mr-1" />
			{props.title}
		</span>
	);
}