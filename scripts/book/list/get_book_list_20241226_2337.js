async function get_book_list() {
    function Div_book_list({data}) {
        const renderBookCard = (btn_data) => (
            <div class={data[btn_data].board_url_sub == sub || (sub == "None" && data[btn_data].board_url_sub == null) 
                        ? class_book_card_active 
                        : class_book_card_deactive}
                 onClick={() => click_book_card(data[btn_data].board_url_sub)}
                 id={data[btn_data].board_url_sub == null ? "book_card_default" : "book_card_" + data[btn_data].board_url_sub}>
                <img src={data[btn_data].url_image} 
                     class="w-[85px] min-w-[85px] max-w-[85px] h-[100px] min-h-[100px] max-h-[100px]" />
                <p class="text-sm text-center">{data[btn_data].title}</p>
            </div>
        );

        const ScrollButton = ({id, direction, className}) => (
            <div id={id} class={className}>
                <img src={`https://cdn.jsdelivr.net/gh/Ignite-Official/CDN/web/image/svg/main_scroll_${direction}.svg`} 
                     class="w-[36px] h-[36px]" />
            </div>
        );

        return (
            <div class="flex flex-col w-full h-fit border space-y-2 border-gray-300 rounded-xl p-4 mb-4" id="div_book_list_sub">
                <p class="font-extrabold underline">도서 선택</p>
                <div class="flex flex-nowrap space-x-8 overflow-x-scroll scroll-smooth scroll-hide" id="div_book_list_slider">
                    {Object.keys(data).map(renderBookCard)}
                    <ScrollButton 
                        id="div_book_list_prev"
                        direction="left"
                        className="absolute top-[300px] left-[-5px] z-10 sm:left-[-5px] cursor-pointer hover:rounded-full hover:text-blue-700 focus:z-10 focus:ring-8 focus:ring-gray-200"
                    />
                    <ScrollButton
                        id="div_book_list_next"
                        direction="right" 
                        className="absolute top-[300px] right-[5px] z-10 sm:right-[5px] cursor-pointer hover:rounded-full hover:text-blue-700 focus:z-10 focus:ring-8 focus:ring-gray-200"
                    />
                </div>
            </div>
        );
    }

    // 데이터 가져오기
    book_list = await fetch("/book/ajax_get_book_list/").then(res => res.json());
    ReactDOM.render(<Div_book_list data={book_list} />, document.getElementById("div_book_list"));

    // 스크롤 이벤트
    const elements = ['next', 'prev', 'slider'].map(id => 
        document.querySelectorAll(`#div_book_list_${id}`)
    );
    
    elements[2].forEach((slider, i) => {
        elements[0][i].addEventListener('click', () => slider.scrollBy(slider.offsetWidth, 0));
        elements[1][i].addEventListener('click', () => slider.scrollBy(-slider.offsetWidth, 0));
    });
}