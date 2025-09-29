/**********************
* 데이터 로드 & 렌더
**********************/
async function get_book_info() {
	if (!sub) {
	  ReactDOM.render(
		<div className="error-message p-4 text-red-500">잘못된 요청입니다. URL에 'sub' 파라미터가 필요합니다.</div>,
		document.getElementById("div_main")
	  );
	  return;
	}

	try {
	  const response = await fetch("/book/ajax_get_book_list/", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	  });

	  if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
	  }

	  const data_list = await response.json();

	  // sub에 해당하는 책
	  const bookData = Object.values(data_list).find(
		(item) => item.uuid_board_category === sub
	  );

	  if (!bookData) {
		ReactDOM.render(
		  <div className="error-message p-4 text-red-500">해당 ID의 책을 찾을 수 없습니다. (sub: {sub})</div>,
		  document.getElementById("div_main")
		);
		return;
	  }

	  // subtitle 생성
	  const subtitleParts = [];
	  if (bookData.publisher)    subtitleParts.push(bookData.publisher);
	  if (bookData.published_at) subtitleParts.push(bookData.published_at);
	  if (bookData.isbn)         subtitleParts.push(`ISBN ${bookData.isbn}`);
	  bookData.subtitle = subtitleParts.join(' · ') || '';

	  // 마켓플레이스 고유화
	  const stores = Object.values(data_list)
		.filter((item) => item.uuid_board_category === sub)
		.map((item) => ({ name: item.marketplace, link: item.url || '#' }))
		.filter((store, index, self) =>
		  index === self.findIndex((s) => s.name === store.name)
		);

	  // 추천 4개 (sub 제외 + 중복 제거)
	  const uniqueRecommended = [...new Map(
		Object.values(data_list)
		  .filter((item) => item.uuid_board_category !== sub)
		  .map(item => [item.uuid_board_category, item])
	  ).values()];
	  const recommendedBooks = getRandomItems(uniqueRecommended, 4).map((item) => ({
		cover: item.url_image,
		alt: item.title,
		title: item.title,
		author: item.publisher,
		link: `/book/?sub=${item.uuid_board_category}`,
		uuid_board_category: item.uuid_board_category
	  }));

	  // 본 화면 렌더 (스켈레톤과 동일한 반응형 레이아웃 로직 포함)
	  ReactDOM.render(
		<Div_BookDetail
		  bookData={bookData}
		  stores={stores}
		  recommendedBooks={recommendedBooks}
		/>,
		document.getElementById("div_main")
	  );
	} catch (error) {
	  ReactDOM.render(
		<div className="error-message p-4 text-red-500">
		  책 정보를 불러오는 데 실패했습니다. 에러: {error.message}
		</div>,
		document.getElementById("div_main")
	  );
	}
}