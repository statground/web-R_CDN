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
		headers: {
		  "Content-Type": "application/json",
		},
	  });

	  if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
	  }

	  const data_list = await response.json();

	  // sub 값으로 책 데이터 필터링 (첫 번째 매칭된 것 사용, 중복 가정 안 함)
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

	  // subtitle 동적 생성
	  const subtitleParts = [];
	  if (bookData.publisher) subtitleParts.push(bookData.publisher);
	  if (bookData.published_at) subtitleParts.push(bookData.published_at);
	  if (bookData.isbn) subtitleParts.push(`ISBN ${bookData.isbn}`);
	  bookData.subtitle = subtitleParts.join(' · ') || '';

	  // Div_PriceCompare를 위한 마켓플레이스 목록
	  const stores = Object.values(data_list)
		.filter((item) => item.uuid_board_category === sub)
		.map((item) => ({
		  name: item.marketplace,
		  link: item.url || '#',
		}))
		.filter((store, index, self) =>
		  index === self.findIndex((s) => s.name === store.name)
		);

	  // Div_RecommendedBooks를 위한 추천 책 목록 (sub와 다른 책 4개 랜덤, 중복 제거)
	  const uniqueRecommended = [...new Map(Object.values(data_list)
		.filter((item) => item.uuid_board_category !== sub)
		.map(item => [item.uuid_board_category, item]))
		.values()];
	  const recommendedBooks = getRandomItems(uniqueRecommended, 4).map((item) => ({
		cover: item.url_image,
		alt: item.title,
		title: item.title,
		author: item.publisher,
		link: `/book/?sub=${item.uuid_board_category}`,
		uuid_board_category: item.uuid_board_category
	  }));

	  // 전체 UI 렌der링
	  ReactDOM.render(
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
		  <section id="book-detail">
			<div className="grid grid-cols-[320px_1fr] gap-6">
			  <aside className="bd-aside">
				<Div_BookCover coverSrc={bookData.url_image} alt={bookData.title} />
			  </aside>
			  <section className="bd-right flex flex-col gap-4">
				<div className="my-4"><Div_BookMeta title={bookData.title} subtitle={bookData.subtitle} /></div>
				<div className="my-4"><Div_PriceCompare stores={stores} /></div>
				<div>{Div_BookDescription({ content: bookData.introduction })}</div>
				<div>{Div_PublisherReview({ content: bookData.publisher_review })}</div>
				<div>{Div_ProductInfo({ published_at: bookData.published_at, page_cnt: bookData.page_cnt, size: bookData.size, publisher: bookData.publisher })}</div>
				<div className="my-4"><Div_RecommendedBooks books={recommendedBooks} /></div>
			  </section>
			</div>
		  </section>
		</main>,
		document.getElementById("div_main")
	  );
	} catch (error) {
	  ReactDOM.render(
		<div className="error-message p-4 text-red-500">책 정보를 불러오는 데 실패했습니다. 에러: {error.message}</div>,
		document.getElementById("div_main")
	  );
	}
}