// 랜덤으로 n개 항목 선택
function getRandomItems(array, n) {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

// CSRF 토큰 가져오기 (GET 요청에서는 불필요)
function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
	  const cookies = document.cookie.split(';');
	  for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.substring(0, name.length + 1) === (name + '=')) {
		  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		  break;
		}
	  }
	}
	return cookieValue;
}


function Div_RecommendedBooks({ books }) {
	return (
	  <div className="bd-card my-4">
		<div className="bd-row">
		  <h2 className="font-semibold text-lg">함께 보면 좋은 책</h2>
		</div>
		<div className="grid grid-cols-4 gap-3 mt-3">
		  {books.map((book, idx) => (
			<a className="bd-book" href={`/book/?sub=${book.uuid_board_category}`} key={idx} style={{textDecoration:'none',color:'inherit'}}>
			  <div className="bd-aspect">
				<img className="w-full rounded-lg" src={book.cover} alt={book.alt} />
			  </div>
			  <div className="mt-2 text-sm font-semibold leading-snug">{book.title}</div>
			  <div className="bd-small mt-0.5 text-gray-400 text-xs">{book.author}</div>
			</a>
		  ))}
		</div>
	  </div>
	);
}


// Div_PriceCompare 컴포넌트
function Div_PriceCompare({ stores }) {
	const logoMap = {
	  "교보문고": "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/kyobobook2.png",
	  "Yes24": "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/yes24.png",
	  "영풍문고": "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/ypbooks.png",
	  "쿠팡": "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/coupang.png",
	  "LeanPub": "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/LeanPub.png",
	  "Bookdown": "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/bookdown.png",
	  "default": "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/icon_default.png"
	};

	const purchaseMarkets = ["교보문고", "쿠팡", "영풍문고", "Yes24"];

	return (
	  <div className="bd-card my-4">
		<h2 className="mb-3 font-semibold text-lg">마켓플레이스</h2>
		<div className="grid grid-cols-3 gap-3">
		  {stores.map((store, idx) => (
			<div className="bd-soft border border-gray-200 rounded-lg p-3" key={idx}>
			  <div className="bd-row flex justify-center items-center">
				<img src={logoMap[store.name] || logoMap["default"]} alt={store.name} className="w-10 h-10 mr-2" />
				<div className="font-semibold">{store.name}</div>
			  </div>
			  <div className="flex justify-center mt-3">
				<a href={store.link} target="_blank" className="bd-btn inline-block bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200">
				  {purchaseMarkets.includes(store.name) ? "구매하러 가기" : "보러가기"}
				</a>
			  </div>
			</div>
		  ))}
		</div>
	  </div>
	);
}



function Div_BookMeta({ title, subtitle }) {
	return (
	  <div className="bd-card">
		<div className="bd-row flex items-start">
		  <div>
			<h1 className="bd-title text-2xl font-bold mb-1.5">{title}</h1>
			<p className="bd-sub text-gray-500">{subtitle}</p>
		  </div>
		</div>
	  </div>
	);
}


function Div_BookCover({ coverSrc, alt }) {
	return (
	  <aside className="bd-aside">
		<div className="bd-card">
		  <img className="bd-cover w-full rounded-lg" src={coverSrc} alt={alt} />
		</div>
	  </aside>
	);
}


  function Div_BookDescription({ content }) {
	if (!content) return null;
	return (
	  <div className="bd-card">
		<h3 className="m-0 mb-2 font-semibold">책 소개</h3>
		<p className="leading-8 m-0">{content}</p>
	  </div>
	);
  }

  function Div_PublisherReview({ content }) {
	if (!content) return null;
	return (
	  <div className="bd-card">
		<h3 className="m-0 mb-2 font-semibold">출판사 리뷰</h3>
		<p className="leading-8 m-0">{content}</p>
	  </div>
	);
  }

  function Div_ProductInfo({ published_at, page_cnt, size, publisher }) {
	if (!published_at && !page_cnt && !size && !publisher) return null;
	return (
	  <div className="bd-card">
		<h3 className="m-0 mb-2 font-semibold">책 정보</h3>
		<table className="w-full" style={{fontSize:"14px"}}>
		  <tbody>
			{published_at && (
			  <tr>
				<th className="text-left px-4 py-2 font-medium">출간</th>
				<td className="py-2">{published_at}</td>
			  </tr>
			)}
			{page_cnt && (
			  <tr>
				<th className="text-left px-4 py-2 font-medium">페이지 수</th>
				<td className="py-2">{page_cnt}</td>
			  </tr>
			)}
			{size && (
			  <tr>
				<th className="text-left px-4 py-2 font-medium">크기</th>
				<td className="py-2">{size}</td>
			  </tr>
			)}
			{publisher && (
			  <tr>
				<th className="text-left px-4 py-2 font-medium">출판사</th>
				<td className="py-2">{publisher}</td>
			  </tr>
			)}
		  </tbody>
		</table>
	  </div>
	);
  }