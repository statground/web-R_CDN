async function get_userinfo() {

	/* ---------------------------------------------
	   메인 컴포넌트
	--------------------------------------------- */
	function Div_main_userinfo(props) {
		return (
			<div class="grid grid-cols-5 justify-center items-start gap-8 w-full md:grid-cols-1 p-4">

				{/* -------------------------
					왼쪽 : 프로필 카드
				------------------------- */}
				<div class="flex flex-col justify-center items-center border border-blue-100 rounded-xl w-full px-4 py-8 space-y-2 bg-white shadow-sm">
					<p class="text-sm">{props.data.email}</p>
					<p class="text-2xl font-extrabold">{props.data.name}</p>
					<p class="text-sm">
						{props.data.realname}　|　{props.data.gender}
					</p>

					<div class="py-4"></div>

					<p class="text-lg font-extrabold">{props.data.role}</p>
					<p class="text-sm">가입 일자: {props.data.date_joined}</p>

					{
						props.data.expired_at == null
							? <p class="text-sm">회원등급 만료일: 무제한</p>
							: <p class="text-sm">회원등급 만료일: {props.data.expired_at}</p>
					}

					<div class="py-4"></div>

					{
						props.data.email_subscription == 1
							? <p class="text-sm text-green-500">이메일 수신 허용</p>
							: <p class="text-sm text-gray-500">이메일 수신 거부</p>
					}

					<div class="py-4"></div>

					<a
						href="/account/myinfo/edit/"
						class="text-white bg-blue-700 font-medium rounded-lg text-sm text-center px-5 py-2.5 w-full
							   hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
					>
						회원정보 수정하기
					</a>
					<a
						href="/account/change_password/"
						class="text-white bg-blue-700 font-medium rounded-lg text-sm text-center px-5 py-2.5 w-full
							   hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
					>
						비밀번호 변경하기
					</a>
				</div>

				{/* -------------------------
					오른쪽 : 전체 섹션
				------------------------- */}
				<div class="col-span-4 flex flex-col justify-start items-start rounded-xl w-full bg-white border border-gray-200 shadow-sm">
					<div class="w-full p-6 space-y-10">

						{/* =====================================================
							1. 내 접속 기록 (ECharts 캘린더)
						===================================================== */}
						<section class="space-y-3">
							<div>
								<p class="text-base font-bold text-gray-900">내 접속 기록</p>
								<p class="text-xs text-gray-400 mt-1">
									Web-R 접속 횟수와 Shiny 앱 실행 기록을 캘린더로 확인할 수 있습니다.
								</p>
							</div>

							<div id="div_tab_connection_content" class="w-full">
								<div class="flex flex-col md:flex-row gap-4 w-full">
									<div class="bg-gray-100 w-full h-[260px] rounded-xl animate-pulse"></div>
									<div class="bg-gray-100 w-full h-[260px] rounded-xl animate-pulse"></div>
								</div>
							</div>
						</section>

						<hr class="border-gray-200" />

						{/* =====================================================
							2. 내가 쓴 글 / 내가 쓴 댓글 (PC 2컬럼 / 모바일 세로)
						===================================================== */}
						<section class="space-y-3">
							<div class="flex flex-row md:flex-col md:gap-10 w-full items-start">
								{/* 내가 쓴 글 */}
								<div class="flex-1 space-y-3">
									<div>
										<p class="text-base font-bold text-gray-900">내가 쓴 글</p>
										<p class="text-xs text-gray-400 mt-1">
											커뮤니티, 도서, 워크샵 게시판 등 내가 작성한 글 목록입니다.
										</p>
									</div>

									<div id="div_tab_article_content" class="w-full">
										<div class="bg-gray-100 w-full h-[200px] rounded-xl animate-pulse"></div>
									</div>
								</div>

								{/* 내가 쓴 댓글 */}
								<div class="flex-1 space-y-3 mt-0 md:mt-8">
									<div>
										<p class="text-base font-bold text-gray-900">내가 쓴 댓글</p>
										<p class="text-xs text-gray-400 mt-1">
											질문/답변, 자유 게시판 등에서 남긴 댓글들을 모아 보여줍니다.
										</p>
									</div>

									<div id="div_tab_comment_content" class="w-full">
										<div class="bg-gray-100 w-full h-[200px] rounded-xl animate-pulse"></div>
									</div>
								</div>

							</div>
						</section>

						<hr class="border-gray-200" />

						{/* =====================================================
							3. 결제 내역
						===================================================== */}
						<section class="space-y-3">
							<div class="flex justify-between items-baseline">
								<div>
									<p class="text-base font-bold text-gray-900">결제 내역</p>
									<p class="text-xs text-gray-400 mt-1">멤버십, 강의, 워크샵 등 Web-R에서 결제한 내역입니다.</p>
								</div>
							</div>

							<div id="div_tab_payment_content" class="w-full">
								<div class="bg-gray-100 w-full h-[200px] rounded-xl animate-pulse"></div>
							</div>
						</section>

					</div>
				</div>

			</div>
		)
	}

	/* ---------------------------------------------
	   데이터 fetch → 렌더링
	--------------------------------------------- */

	const data = await fetch("/account/ajax_get_myinfo/")
		.then(res => res.json());

	ReactDOM.render(
		<Div_main_userinfo data={data} />,
		document.getElementById("div_main_userinfo")
	);

	/* ---------------------------------------------
	   각 섹션 내용 로딩
	--------------------------------------------- */
	get_myinfo_connection();        // 접속 기록 (ECharts)
	get_myinfo_article_content();   // 내가 쓴 글 (3개 + 펼치기)
	get_myinfo_comment_content();   // 내가 쓴 댓글 (3개 + 펼치기)
	get_myinfo_payment_content();   // 결제 내역
}