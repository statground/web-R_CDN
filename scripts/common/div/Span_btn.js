function Span_btn_user(props) {
	return (
		<div>
			{
				props.role == "관리자"
				?	<span class="flex flex-row justify-center items-center w-fit bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
						<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
						{props.user_nickname}
					</span>
				:	<span class="flex flex-row justify-center items-center w-fit bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
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
			<span class="flex flex-row justify-center items-center w-fit bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
				<img src={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_" + Number(props.date.split("-")[2].substr(0, 2)).toString() + ".svg"} class="w-3 h-3 mr-1" />
				{props.date}
			</span>
		</div>
	)
}