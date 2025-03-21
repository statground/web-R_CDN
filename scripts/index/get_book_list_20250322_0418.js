async function get_book_list() {
    let book_list = []
    let sub = "None"

    let class_book_card_active = "flex flex-col justify-center items-center w-[175px] min-w-[175px] max-w-[175px] px-2 rounded-xl space-y-2 border border-gray-500 bg-blue-100 cursor-pointer hover:border hover:border-gray-900"
    let class_book_card_deactive = "flex flex-col justify-center items-center w-[175px] min-w-[175px] max-w-[175px] px-2 rounded-xl space-y-2 cursor-pointer hover:border hover:border-gray-900"

    function Div_book_list({data}) {
        const renderBookCard = (btn_data) => {
            const handleClick = () => {
                document.querySelectorAll('.purchase-buttons').forEach(btn => btn.style.display = 'none');
                const purchaseBtns = document.getElementById(`purchase-btns-${btn_data}`);
                if (purchaseBtns) purchaseBtns.style.display = 'flex';
                click_book_card(data[btn_data].board_url_sub);
            };

            return (
                <div class={data[btn_data].board_url_sub == sub || (sub == "None" && data[btn_data].board_url_sub == null) 
                            ? class_book_card_active 
                            : class_book_card_deactive}
                    onClick={handleClick}
                    id={data[btn_data].board_url_sub == null ? "book_card_default" : "book_card_" + data[btn_data].board_url_sub}>
                    <img src={data[btn_data].url_image} 
                        class="w-[85px] min-w-[85px] max-w-[85px] h-[100px] min-h-[100px] max-h-[100px]" />
                    <p class="text-sm text-center">{data[btn_data].title}</p>
                    <div id={`purchase-btns-${btn_data}`} 
                            class="flex flex-row justify-center items-center purchase-buttons hidden space-x-2 w-full">
                        {data[btn_data].url_market_coupang && 
                            <button onClick={() => window.open(data[btn_data].url_market_coupang, '_blank')} 
                                    class="flex flex-row justify-center items-center text-sm bg-transparent text-white font-bold w-10 h-10 rounded hover:bg-white hover:border hover:border-black">
                                <img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/coupang.png`} class="w-[36px] h-[36px]" />
                            </button>
                        }
                        {data[btn_data].url_market_yes24 && 
                            <button onClick={() => window.open(data[btn_data].url_market_yes24, '_blank')} 
                                    class="flex flex-row justify-center items-center text-sm bg-transparent text-white font-bold w-10 h-10 rounded hover:bg-white hover:border hover:border-black">
                                <img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/yes24.png`} class="w-[36px] h-[36px]" />
                            </button>
                        }
                        {data[btn_data].url_market_kyobo && 
                            <button onClick={() => window.open(data[btn_data].url_market_kyobo, '_blank')} 
                                    class="flex flex-row justify-center items-center text-sm bg-transparent text-white font-bold w-10 h-10 rounded hover:bg-white hover:border hover:border-black">
                                <img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/kyobobook2.png`} class="w-[36px] h-[36px]" />
                            </button>
                        }
                        {data[btn_data].url_view && 
                            <button onClick={() => window.open(data[btn_data].url_view, '_blank')} 
                                    class="flex flex-row justify-center items-center text-sm bg-transparent text-white font-bold w-10 h-10 rounded hover:bg-white hover:border hover:border-black">
                                    <img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/book_view.svg`} class="w-[36px] h-[36px]" />
                            </button>
                        }
                        
                        <button onClick={() => window.location.href = `/book/?sub=${data[btn_data].board_url_sub}`}
                                class="flex flex-row justify-center items-center text-sm bg-transparent text-white font-bold w-10 h-10 rounded hover:bg-white hover:border hover:border-black">
                            <img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_free.svg`} class="w-[36px] h-[36px]" />
                        </button>
                    </div>
                </div>
            );
        };

        const ScrollButton = ({id, direction, className}) => (
            <div id={id} class={className}>
                <img src={`https://cdn.jsdelivr.net/gh/Ignite-Official/CDN/web/image/svg/main_scroll_${direction}.svg`} 
                    class="w-[36px] h-[36px]" />
            </div>
        );

        return (
            <div class="flex flex-col w-full h-fit border space-y-2 border-gray-300 rounded-xl p-4 mb-4 relative" id="div_book_list_sub">
                <div class="flex flex-nowrap space-x-8 overflow-x-scroll scroll-smooth scroll-hide" id="div_book_list_slider">
                    {Object.keys(data).map(renderBookCard)}
                </div>
                <ScrollButton 
                    id="div_book_list_prev"
                    direction="left"
                    className="absolute left-[-5px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:rounded-full hover:text-blue-700 focus:z-10 focus:ring-8 focus:ring-gray-200"
                />
                <ScrollButton
                    id="div_book_list_next"
                    direction="right" 
                    className="absolute right-[5px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:rounded-full hover:text-blue-700 focus:z-10 focus:ring-8 focus:ring-gray-200"
                />
            </div>
        );
    }

    // 데이터 가져오기
    book_list = await fetch("/book/ajax_get_book_list/").then(res => res.json());
    book_list = Object.fromEntries(Object.entries(book_list).filter(([key]) => key !== "0"));
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