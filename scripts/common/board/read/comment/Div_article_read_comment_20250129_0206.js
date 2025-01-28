function Div_article_read_comment(props) {
	function Div_comment_header(props) {
		return (
			<div class="flex flex-row justify-start items-center space-x-2">
				<Span_btn_user user_nickname={props.data.user_nickname} role={props.data.user_role} />
				<Span_btn_date date={props.data.created_at} />
				<Span_btn_comment_secret toggle={props.data.is_secret} />
				<Span_btn_my_comment toggle={props.data.check_comment_reader} />
			</div>
		)
	}

	function Div_comment(props) {
		const isDepth2 = props.depth === 2;
		const bgColorClass = props.data.user_writer == 1
			? isDepth2 ? "bg-blue-100 border border-blue-700" : "bg-blue-50"
			: isDepth2 ? "bg-gray-200 border border-gray-700" : "bg-gray-100";

		const comment_depth2_list = !isDepth2 && Object.keys(props.data.rereply || {}).map((btn_data) =>  
			<Div_comment data={props.data.rereply[btn_data]} depth={2} />
		);

		return (
			<article class={`p-6 ${isDepth2 ? 'ml-4' : ''} text-base ${bgColorClass} rounded-xl w-full space-y-2`}>
				<div class="flex justify-between items-center space-x-2">
					<Div_comment_header data={props.data} />
				</div>
				<div class="text-gray-500" id={"div_comment_" + props.data.uuid}></div>

				{props.data.file_url != null && 
					<div class="flex flex-row justify-start items-center space-x-2 text-sm hover:underline">
						<p>
							<svg class="size-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="48" height="48" fill="white" fill-opacity="0.01"></rect> <path d="M41 4H7C5.34315 4 4 5.34315 4 7V41C4 42.6569 5.34315 44 7 44H41C42.6569 44 44 42.6569 44 41V7C44 5.34315 42.6569 4 41 4Z" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linejoin="round"></path> <path d="M34 4V22H15V4H34Z" fill="#43CCF8" stroke="white" stroke-width="4" stroke-linejoin="round"></path> <path d="M29 11V15" stroke="white" stroke-width="4" stroke-linecap="round"></path> <path d="M11.9969 4H36.9985" stroke="#000000" stroke-width="4" stroke-linecap="round"></path> </g></svg>
						</p>
						<a href={window.location.protocol + "//" + window.location.host + "/" + props.data.file_url} target="_blank">{props.data.file_name}</a>
					</div>
				}

				<div class="w-full" id={"div_comment_footer_" + props.data.uuid}>
					{isDepth2 
						? <Div_comment_depth2_button_list data={props.data} />
						: <Div_comment_depth1_button_list data={props.data} is_secret={props.is_secret} check_reader={props.check_reader} />
					}
				</div>
				
				{comment_depth2_list}
				
				{!isDepth2 && 
					<div id={"div_community_read_comment_new_" + props.data.uuid} class="hidden">
						<Div_comment_form title={"대댓글 쓰기"} class={"mt-4 p-4 bg-white rounded-lg w-full space-y-2"} uuid_comment={props.data.uuid} />
					</div>
				}
			</article>
		)
	}

	const comment_list = Object.keys(props.data).map((btn_data) =>  
		<Div_comment data={props.data[btn_data]} depth={1} is_secret={props.is_secret} check_reader={props.check_reader} />
	)

	return (
		<section class="bg-white py-8 lg:py-16 antialiased">
			<div class="w-full mx-auto px-4 space-y-2">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-lg lg:text-2xl font-bold text-gray-900">댓글 ({props.data.length})</h2>
				</div>
				<form class="mb-6">
					<div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200">
						<div id="div_comment_new" class="w-full"></div>
					</div>
				</form>
				<div class="flex flex-col justify-center items-end w-full space-y-2">
					{comment_list}
				</div>

				{gv_username !== '' &&
					<div class="flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full" id="div_community_read_comment_new">
						<Div_comment_form title={"댓글 쓰기"} class={"w-full space-y-2"} uuid_comment={null} />
					</div>
				}
			</div>
		</section>
	)
}