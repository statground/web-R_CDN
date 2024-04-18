async function get_div_main_board(){            
	function Col(props) {

		const articleList = Object.keys(props.data).map((article) =>
			<div class="bg-white border-b">
				<div class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100"
					onClick={() => window.open(props.data[article].board_url)}>
					<div class="flex flex-row justify-start items-center">
						<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
							{props.data[article].title}
						</span>
						{
							props.data[article].tag_new == 1
							?   <span class="text-red-500 text-sm ml-2 animate-pulse">
									<img src="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/new.svg" class="w-[20px] min-w-[20px] max-w-[20px] h-[20px] min-h-[20px] max-h-[20px]" />
								</span>
							: ""
						}

						{
							props.data[article].status == "SECRET"
							?   <span class="text-red-500 text-sm ml-2 animate-pulse">
									<img src="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/secret.svg" class="w-[15px] min-w-[15px] max-w-[15px] h-[15px] min-h-[15px] max-h-[15px]" />
								</span>
							: ""
						}
					</div>
					<div class="flex flex-row justify-start items-center">
						{
							props.data[article].nick_name == "맛있는호랑이" || props.data[article].nick_name == "cardiomoon"
							?   <span class="flex flex-row justify-center items-center w-fit bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
									<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
									{props.data[article].nick_name}
								</span>
							:   <span class="flex flex-row w-fit bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
									<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
									{props.data[article].nick_name}
								</span>
						}
	
						<span class="flex flex-row justify-center items-center w-fit bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
							<img src={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_" + Number(props.data[article].regdate.split("-")[2]).toString() + ".svg"} class="w-3 h-3 mr-1" />
							{props.data[article].regdate}
						</span>
					</div>
				</div>
			</div>
		)

		return (
			<div class="flex flex-col justify-center text-center content-center w-full space-y-2">
				<h5 class="text-xl pb-4 font-bold tracking-tight text-gray-900 dark:text-white">
					{props.title}
				</h5>
				<table class="flex flex-col text-sm text-left text-gray-500">
					<div class="text-xs text-gray-700 uppercase bg-gray-50 w-full">
						<tr></tr>
					</div>
					{articleList}
				</table>
			</div>
		)
	}

	function Div_result(props) {
		return (
			<div class="grid grid-cols-3 gap-12 md:grid-cols-1 mx-auto">
				<Col title="자유게시판" data={props.data.free} />
				<Col title="가입인사 / 방명록" data={props.data.guestbook} />
				<Col title="공지사항" data={props.data.notice} />
				<Col title="책 게시판" data={props.data.book} />
				<Col title="워크샵 게시판" data={props.data.workshop} />
				<Col title="유튜브 강의 게시판" data={props.data.youtube} />
			</div>
		)
	}

	const data = await fetch("/ajax_index_board")
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

	ReactDOM.render(<Div_result data={data} />, document.getElementById("div_main_board"));
}