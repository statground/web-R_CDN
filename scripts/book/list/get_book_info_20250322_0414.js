async function get_book_info() {
	function Div_button_write({url}) {
		return (
			<button type="button" 
				onClick={() => gv_username ? location.href=url : alert("로그인이 필요합니다.")}
				class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
						hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
				글쓰기
			</button>
		)
	}

	function MarketButton({url, color, text}) {
		if (!url) return null;
		return (
			<a href={url} target="_blank"
				class={`text-${color.text} bg-gradient-to-r from-${color.from} via-${color.via} to-${color.to} 
						font-medium rounded-lg text-sm px-5 py-1.5 text-center w-[150px]
						hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-${color.ring}`}>
				{text}
			</a>
		)
	}

	function Div_book_info({data}) {
		if (Object.keys(data).includes('NULL')) {
			return (
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<Div_button_write url='/book/write/' />
				</div>
			)
		}

		const buttons = [
			{url: data.url_view, color: {text:'gray-900', from:'lime-200', via:'lime-400', to:'lime-500', ring:'lime-300'}, text:'무료로 보기'},
			{url: data.url_market_kyobo, color: {text:'white', from:'green-400', via:'green-500', to:'green-600', ring:'teal-300'}, text:'구매하기: 교보문고'},
			{url: data.url_market_yes24, color: {text:'white', from:'indigo-400', via:'indigo-500', to:'indigo-600', ring:'teal-300'}, text:'구매하기: Yes24'},
			{url: data.url_market_coupang, color: {text:'white', from:'red-400', via:'red-500', to:'red-600', ring:'teal-300'}, text:'구매하기: 쿠팡'},
			{url: data.url_market, color: {text:'white', from:'gray-400', via:'gray-500', to:'gray-600', ring:'teal-300'}, text:'판매처 확인하기'}
		];

		return (
			<div class="flex flex-col justify-center items-center w-full space-y-4">
				<Div_button_write url={'/book/write/?sub=' + data.board_url_sub} />
				<br/>
				<img src={data.url_image} class="w-[125px] min-w-[125px] max-w-[125px] border border-gray-300 rounded-lg" />
				<p class="text-md font-extrabold">{data.title}</p>
				<p class="text-sm font-normal">{data.publisher}　|　{data.published_at}</p>

				<div class="flex flex-col justify-center items-center w-full space-y-2">
					{buttons.map((btn, i) => (
						<MarketButton key={i} {...btn} />
					))}
				</div>
			</div>
		)
	}
	
	const request_data = new FormData();
	request_data.append('tag_sub', sub);
    

    let data = null
    if (sub == "None") {
        data = {}
    } else {
        data = await fetch("/book/ajax_get_book_info/", {
            method: "post", 
            headers: { "X-CSRFToken": getCookie("csrftoken"), },
            body: request_data
        }).then(res => res.json());
    }
	
	ReactDOM.render(<Div_book_info data={data} />, document.getElementById("div_book_info"))
}