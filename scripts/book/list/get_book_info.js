async function get_book_info() {
	function Div_book_info(props) {
		function Div_button_write(props) {
			return (
				<button type="button" onClick={() =>
													gv_username == ""
													?   alert("로그인이 필요합니다.")
													:   location.href=props.url
													}
						class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
								hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
					글쓰기
				</button>
			)
		}


		if (Object.keys(props.data).includes('NULL')) {
			return (
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<Div_button_write url={'/book/write/'} />
				</div>
			)
		} else {
			return (
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<Div_button_write url={'/book/write/?sub=' + props.data.board_url_sub} />

					<br/>

					<img src={props.data.url_image} class="w-[125px] min-w-[125px] max-w-[125px] border border-gray-300 rounded-lg" />
					<p class="text-md font-extrabold">{props.data.title}</p>
					<p class="text-sm font-normal">{props.data.publisher}　|　{props.data.published_at}</p>

					<div class="flex flex-col justify-center items-center w-full space-y-2">
						{
							props.data.url_view != null
							?   <a href={props.data.url_view} target="_blank"
								   class="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 font-medium rounded-lg text-sm px-5 py-1.5 text-center w-[150px]
										  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300">
									무료로 보기
								</a>
							:   null
						}

						{
							props.data.url_market != null
							?   <a href={props.data.url_market} target="_blank"
								   class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 font-medium rounded-lg text-sm px-5 py-1.5 text-center w-[150px]
										  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300">
									구매하기
								</a>
							:   null
						}
					</div>
				</div>
			)
		}
	}
	
	// 토글 ON
	const request_data = new FormData();
	request_data.append('tag_sub', sub);
	
	const data = await fetch("/book/ajax_get_book_info/", {
					method: "post", 
					headers: { "X-CSRFToken": getCookie("csrftoken"), },
					body: request_data
					})
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	ReactDOM.render(<Div_book_info data={data} />, document.getElementById("div_book_info"))
}