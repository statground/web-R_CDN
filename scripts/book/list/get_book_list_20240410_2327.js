async function get_book_list() {
	function Div_book_list(props) {
		const book_List = Object.keys(props.data).map((btn_data) =>                    
			<div class={
							props.data[btn_data].board_url_sub == sub || (sub == "None" && props.data[btn_data].board_url_sub == null)
							? class_book_card_active
							: class_book_card_deactive
					   }
			   onClick={() => click_book_card(props.data[btn_data].board_url_sub)}
					id={
							props.data[btn_data].board_url_sub == null
							?   "book_card_default"
							:   "book_card_" + props.data[btn_data].board_url_sub
					   }>
				<img src={props.data[btn_data].url_image} class="w-[85px] min-w-[85px] max-w-[85px] h-[100px] min-h-[100px] max-h-[100px]" />
				<p class="text-sm text-center">{props.data[btn_data].title}</p>
			</div>
		)

		return (
			<div class="flex flex-col w-full h-fit border space-y-2 border-gray-300 rounded-xl p-4 mb-4" id="div_book_list_sub">
				<p class="font-extrabold underline">도서 선택</p>
				<div class="flex flex-nowrap space-x-8 overflow-x-scroll scroll-smooth scroll-hide" id="div_book_list_slider">
					{book_List}
					<div id="div_book_list_prev"
						 class="absolute top-[300px] left-[-5px] z-10 sm:left-[-5px] cursor-pointer
								hover:rounded-full hover:text-blue-700 focus:z-10 focus:ring-8 focus:ring-gray-200">
						<img src="https://cdn.jsdelivr.net/gh/Ignite-Official/CDN/web/image/svg/main_scroll_left.svg" class="w-[36px] h-[36px]" />
					</div>

					<div id="div_book_list_next"
						 class="absolute top-[300px] right-[5px] z-10 sm:right-[5px] cursor-pointer
								hover:rounded-full hover:text-blue-700 focus:z-10 focus:ring-8 focus:ring-gray-200">
						<img src="https://cdn.jsdelivr.net/gh/Ignite-Official/CDN/web/image/svg/main_scroll_right.svg" class="w-[36px] h-[36px]" />
					</div>
				</div>
			</div>
		)
	}

	// 프로필 데이터 가져오기
	book_list = await fetch("/book/ajax_get_book_list/")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });
	ReactDOM.render(<Div_book_list data={book_list} />, document.getElementById("div_book_list"));


	// 스크롤 이벤트 추가
	const next = document.querySelectorAll('#div_book_list_next');
	const prev = document.querySelectorAll('#div_book_list_prev');
	const slider = document.querySelectorAll('#div_book_list_slider')

	for(let i = 0 ; i < slider.length ; i++){
		makeSlider(slider[i], prev[i], next[i]);
	}

	function makeSlider(element, prev, next){
		next.addEventListener('click',()=>{
			const offsetX = element.offsetWidth;
			element.scrollBy(offsetX,0)
		})
		prev.addEventListener('click',()=>{
			const offsetX = element.offsetWidth;
			element.scrollBy(-offsetX,0)
		})
	}
}