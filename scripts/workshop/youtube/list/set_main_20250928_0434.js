async function set_main() {
    const data = await fetch("/ajax_get_menu_header/")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

    let username = data['username']
	let role = data['role']

	// 2) 렌더 함수 (데이터를 props로 전달)
	function Div_main({ username, role }) {
		const isLoggedIn = username !== "";

		// 관리자 판별을 안전하게(영문/한글/대소문자/앞뒤 공백 대응)
		const norm = (s) => (typeof s === "string" ? s.trim().toLowerCase() : "");
		const adminAliases = new Set(["admin", "관리자"]);
		const isAdmin = adminAliases.has(norm(role));

		const showWriteButton = isLoggedIn && isAdmin;

		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={header_title} subtitle={header_subtitle} />

				<div id="div_community_list" class="flex flex-col justify-center items-center w-full space-y-4">
					<div class="flex flex-col justify-center items-start w-full gap-4 md:grid-cols-1">
						<div id="div_article_list" class="col-span-2 w-full">
							<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
								<Div_box_header title={"최신 글"} />
							</div>
						</div>

						{showWriteButton && (
							<div class="flex flex-col justify-center items-start w-full space-y-4">
								<button
									type="button"
									onClick={() => (location.href = init_url + "write/")}
									class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                           w-1/6 ml-auto md:w-full
                                           hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
									글쓰기
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	// 3) 데이터 로드 후 렌더
	ReactDOM.render(<Div_main username={username} role={role} />, document.getElementById("div_main"));

	// 4) 초기 리스트/무한스크롤
	get_article_list_youtube("init");
	window.addEventListener("scroll", () => {
		const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
		if (isScrollEnded && !toggle_page && page_num * 20 < article_counter) {
			get_article_list("next");
		}
	});
}
