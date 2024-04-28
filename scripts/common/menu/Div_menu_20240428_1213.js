function Div_menu() {
	// 햄버거 버튼 클릭
	function click_hamburger() {
		if (toggle_hamburger) {
			document.getElementById("div_menu_mobile").className = "hidden"
			toggle_hamburger = false
		} else {
			document.getElementById("div_menu_mobile").className = "hidden md:flex md:flex md:flex-col md:visible md:mt-[20px]"
			toggle_hamburger = true
		}
	}

	// 햄버거
	function Div_sub_hamburger() {
		return (
			<div class="flex items-center hidden md:flex md:visible" onClick={() => click_hamburger()}>
				<button type="button"
						class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg 
							hover:bg-gray-100 
							focus:outline-none focus:ring-2 focus:ring-gray-200">
					<span class="sr-only">Open main menu</span>
					<img src="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/menu_hamburger.svg" class="w-8 h-8" />
				</button>
			</div>
		)
	}

	// 메뉴 - Depth 1 - PC
	function Div_sub_menu_pc() {
		function Div_sub_menu_pc_sub(props) {
			return (
				<span class="flex flex-row justify-center items-center w-fit px-[24px] h-4/6 text-sm rounded-lg cursor-pointer
							hover:bg-blue-100"
					  onClick={props.function}>
					{props.name}
				</span>
			)
		}

		return (
			<div class="flex flex-row justify-cetner items-center visible md:hidden">
				<Div_sub_menu_pc_sub name={"Web-R 접속"} function={() => click_dropdown("webr")} />
				<Div_sub_menu_pc_sub name={"커뮤니티"}  function={() => click_dropdown("community")} />
				<Div_sub_menu_pc_sub name={"도서"}  function={() => click_dropdown("book")} />
				<Div_sub_menu_pc_sub name={"워크샵"}  function={() => click_dropdown("workshop")} />
				<Div_sub_menu_pc_sub name={"Web-R 소개"}  function={() => click_dropdown("intro")} />
			</div>
		)
	}

	function Div_sub_menu_pc_title(props) {
		return (
			<div class="flex flex-row justify-center items-center bg-gray-100 border-b border-gray-300 shadow">
				<p class="text-xs text-gray-700">{props.title}</p>
			</div>
		)
	}

	function Div_sub_menu_pc_li(props) {
		return (
			<li class="flex flex-row justify-center items-center w-full">
				<a href={props.url} target={props.target} class="px-4 py-2 hover:bg-blue-100">
					{props.title}
				</a>
			</li>
		)
	}

	function Div_sub_menu_pc_li_img(props) {
		return (
			<li>
				<a href={props.url} class="flex flex-col justify-center items-center px-4 py-2 w-full hover:border hover:border-blue-300 hover:bg-blue-100">
					<img src={props.img_url} class={"object-scale-down h-[80px] mb-2"} />
					{props.title}
				</a>
			</li>
		)
	}

	function Div_sub_menu_pc_img(props) {
		return (
			<div class={"p-8 text-left bg-gray-300 bg-cover bg-center bg-no-repeat bg-cover rounded-lg bg-blend-multiply h-[150px] "
						+ "bg-[url(" + props.url + ")]"}>
			</div>
		)
	}

	function Div_sub_menu_mobile_title(props) {
		return (
			<div class="flex flex-col justify-center items-start w-full h-[50px] px-[20px] cursor-pointer hover:bg-blue-200"
				 onClick={props.function}>
				<span class="flex flex-row justify-center items-center">
					<img src={props.img_url} class="w-4 h-4 mr-2" />
					{props.title}
				</span>
			</div>
		)
	}

	function Div_sub_menu_mobile_li(props) {
		return (
			<div class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100" onClick={() => location.href=props.url}>
				<span class="flex flex-row w-full">
					- {props.title}
				</span>
			</div>
		)
	}

	function Div_sub_menu_mobile_li_img(props) {
		return (
			<div class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100" onClick={() => location.href=props.url}>
				<span class="flex flex-row w-full">
					<img src={props.img_url} class="w-4 h-4 mr-2" />
					{props.title}
				</span>
			</div>
		)
	}


	return (
		<div class="flex flex-col">

			<div onClick={() => click_dropdown()} id="div_menu_sub_header" class="w-full"></div>
		
			<nav class="flex flex-row justify-between bg-white border-gray-200 h-[50px] px-[200px] sm:px-[50px]">
				<a href="/" class="flex items-center text-xl font-bold">
					<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/logo/logo.png" class="object-scale-down h-10" alt="Statground Logo" />
				</a>
				<Div_sub_hamburger />
				<Div_sub_menu_pc />
			</nav>
			<div id="div_megamenu_webr" class="hidden"> 
				<div class="grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600">
					<ul class="my-4 space-y-4"></ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/webr/"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo_black.svg"}
												title={"무료 서버 접속"} />
					</ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/webr/member/"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo.svg"}
												title={"정회원 서버 접속"} />
					</ul>
				</div>
				<Div_sub_menu_pc_title title={"Web-R 접속"} />
			</div>

			<div id="div_megamenu_community" class="hidden">
				<div class="grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600">
					<ul class="my-4 space-y-4"></ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/community/"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_free.svg"}
												title={"자유 게시판 / 묻고 답하기"} />
						
					</ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/community/visitor/"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_visitor.svg"}
												title={"가입 인사 / 방명록"} />
					</ul>
					<ul class="my-4 space-y-4"></ul>
				</div>
				<Div_sub_menu_pc_title title={"커뮤니티"} />
			</div>

			<div id="div_megamenu_book" class="hidden"> 
				<div class="grid grid-cols-5 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600">
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/book/"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_book.svg"}
												title={"도서 게시판"} />
					</ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/book/?sub=001"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_001.jpg"}
												title={"의학논문 작성을 위한 R통계와 그래프"} />
						<Div_sub_menu_pc_li_img url={"/book/?sub=005"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_005.jpg"}
												title={"일반화가법모형 소개"} />
					</ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/book/?sub=002"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_002.jpg"}
												title={"R을 이용한 조건부과정분석"} />
						<Div_sub_menu_pc_li_img url={"/book/?sub=006"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_006.jpg"}
												title={"밑바닥부터 시작하는 ROC 커브 분석"} />
					</ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/book/?sub=003"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_003.jpg"}
												title={"웹에서 클릭만으로 하는 R통계분석"} />
						<Div_sub_menu_pc_li_img url={"/book/?sub=007"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_007.jpg"}
												title={"웹R을 이용한 통계분석"} />
					</ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/book/?sub=004"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_004.jpg"}
												title={"Learning ggplot2 Using Shiny App"} />
						<Div_sub_menu_pc_li_img url={"/book/?sub=008"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_008.jpg"}
												title={"의료인을 위한 R 생존분석"} />
					</ul>
				</div>
				<Div_sub_menu_pc_title title={"도서"} />
			</div>

			<div id="div_megamenu_workshop" class="hidden">
				<div class="grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600">
					<ul class="my-4 space-y-4"></ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/workshop/"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_workshop.svg"}
												title={"워크샵"} />
						
					</ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/workshop/youtube/"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_youtube.svg"}
												title={"유튜브"} />
					</ul>
					<ul class="my-4 space-y-4"></ul>
				</div>
			</div>
			<div id="div_megamenu_workshop" class="hidden"></div>

			<div id="div_megamenu_intro" class="hidden"> 
				<div class="grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600">
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/intro/notice/"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_notice.svg"}
												title={"공지사항"} />
					</ul>
					<ul class="my-4 space-y-4">
						<Div_sub_menu_pc_li_img url={"/intro/membership/"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_membership.svg"}
												title={"정회원 가입"} />
					</ul>
					<ul class="my-4">
						<Div_sub_menu_pc_li title={"이용 약관"} url={"/intro/terms/"} target={"_self"} />
						<Div_sub_menu_pc_li title={"개인정보 보호 방침"} url={"/intro/privates/"} target={"_self"} />
						<Div_sub_menu_pc_li title={"환불 규정"} url={"/intro/refund/"} target={"_self"} />
					</ul>
					<ul class="my-4">
						<Div_sub_menu_pc_li title={"다음 카페 Biometrika"} url={"https://cafe.daum.net/biometrika"} target={"_blank"} />
						<Div_sub_menu_pc_li title={"통계마당"} url={"https://www.statground.net"} target={"_blank"} />
						<Div_sub_menu_pc_li title={"통계마당 페이스북 그룹"} url={"https://www.facebook.com/groups/statground"} target={"_blank"} />
						<Div_sub_menu_pc_li title={"Futuredu"} url={"https://www.futuredu.kr"} target={"_blank"} />
					</ul>
				</div>
				<Div_sub_menu_pc_title title={"Web-R 소개"} />
			</div>


			<div id="div_menu_mobile" class="hidden">
				<Div_sub_menu_mobile_title title={"Web-R 접속"} function={() => click_dropdown("webr")}
										   img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo.svg"} />
				<div id="div_menu_mobile_webr" class="hidden">
					<Div_sub_menu_mobile_li title={"무료 서버 접속"} url={"/webr/"} />
					<Div_sub_menu_mobile_li title={"정회원 서버 접속"} url={"/webr/member/"} />
					
				</div>

				<Div_sub_menu_mobile_title title={"커뮤니티"} function={() => click_dropdown("community")} 
										   img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_free.svg"} />
				<div id="div_menu_mobile_community" class="hidden">
					<Div_sub_menu_mobile_li title={"자유 게시판 / 묻고 답하기"} url={"/community/"} />
					<Div_sub_menu_mobile_li title={"가입 인사 / 방명록"} url={"/community/visitor/"} />
				</div>

				<Div_sub_menu_mobile_title title={"도서"} function={() => click_dropdown("book")}
										   img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_book.svg"} />
				<div id="div_menu_mobile_book" class="hidden">
					<Div_sub_menu_mobile_li_img title={"도서 게시판"} url={"/book/"} 
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_book.svg"} />
					<br/>
					<Div_sub_menu_mobile_li_img title={"의학논문 작성을 위한 R통계와 그래프"} url={"/book/?sub=001"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_001.jpg"} />
					<Div_sub_menu_mobile_li_img title={"R을 이용한 조건부과정분석"} url={"/book/?sub=002"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_002.jpg"} />
					<Div_sub_menu_mobile_li_img title={"웹에서 클릭만으로 하는 R통계분석"} url={"/book/?sub=003"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_003.jpg"} />
					<Div_sub_menu_mobile_li_img title={"Learning ggplot2 Using Shiny App"} url={"/book/?sub=004"} 
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_004.jpg"} />
					<Div_sub_menu_mobile_li_img title={"일반화가법모형 소개"} url={"/book/?sub=005"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_005.jpg"} />
					<Div_sub_menu_mobile_li_img title={"밑바닥부터 시작하는 ROC 커브 분석"} url={"/book/?sub=006"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_006.jpg"} />
					<Div_sub_menu_mobile_li_img title={"웹R을 이용한 통계분석"} url={"/book/?sub=007"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_007.jpg"} />
					<Div_sub_menu_mobile_li_img title={"의료인을 위한 R 생존분석"} url={"/book/?sub=008"}
												img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_008.jpg"} />
				</div>

				<Div_sub_menu_mobile_title title={"워크샵"} function={() => click_dropdown("workshop")} 
					img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_workshop.svg"} />
				<div id="div_menu_mobile_workshop" class="hidden">
				<Div_sub_menu_mobile_li title={"워크샵"} url={"/workshop/"} />
				<Div_sub_menu_mobile_li title={"유튜브"} url={"/workshop/youtube/"} />
				</div>

				<Div_sub_menu_mobile_title title={"Web-R 소개"} function={() => click_dropdown("intro")} 
										   img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_notice.svg"} />
				<div id="div_menu_mobile_intro" class="hidden">
					<Div_sub_menu_mobile_li title={"공지사항"} url={"/intro/notice/"} />
					<Div_sub_menu_mobile_li title={"정회원 가입"} url={"/intro/membership/"} />

					<br/>

					<Div_sub_menu_mobile_li title={"이용 약관"} url={"/intro/terms/"} />
					<Div_sub_menu_mobile_li title={"개인정보 보호 방침"} url={"/intro/privates/"} />
					<Div_sub_menu_mobile_li title={"환불 규정"} url={"/intro/refund/"} />

					<br/>
					<div class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
						 onClick={() => window.open('https://cafe.daum.net/biometrika')}>
						<span class="flex flex-row w-full">
							- 다음 카페 Biometrika
						</span>
					</div>
					<div class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
						 onClick={() => window.open('https://www.statground.net')}>
						<span class="flex flex-row w-full">
							- 통계마당
						</span>
					</div>
					<div class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
						 onClick={() => window.open('https://www.facebook.com/groups/statground')}>
						<span class="flex flex-row w-full">
							- 통계마당 페이스북 그룹
						</span>
					</div>
					<div class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
						 onClick={() => window.open('https://www.futuredu.kr')}>
						<span class="flex flex-row w-full">
							- Futuredu
						</span>
					</div>
				</div>

			</div>
		</div>
	)
}