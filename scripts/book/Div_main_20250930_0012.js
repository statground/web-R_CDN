/**********************
* 유틸
**********************/
// 랜덤 N개
function getRandomItems(array, n) {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

// (GET에는 불필요하지만 유지)
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

// 간단 Sanitizer (script 태그, on* 핸들러 제거)
function sanitizeHtml(html = "") {
	return (html || "")
	  .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
	  .replace(/\s(on\w+)=(".*?"|'.*?'|[^\s>]+)/gi, "");
}


/**********************
* 공용 HTML 섹션
**********************/
const HtmlSection = ({ title, html }) => (
	<section className="prose max-w-none prose-neutral">
	  {title ? <h3 className="m-0 mb-2 font-semibold">{title}</h3> : null}
	  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
	</section>
);


/**********************
* 프레젠테이션 컴포넌트
**********************/
function Div_RecommendedBooks({ books, gridCols = "grid-cols-4" }) {
	return (
	  <div className="bd-card my-4">
		<div className="bd-row">
		  <h2 className="font-semibold text-xl">함께 보면 좋은 책</h2>
		</div>
		<div className={`grid ${gridCols} gap-3 mt-3`}>
		  {books.map((book, idx) => (
			<a
			  className="bd-book"
			  href={`/book/?sub=${book.uuid_board_category}`}
			  key={idx}
			  style={{ textDecoration: 'none', color: 'inherit' }}
			>
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

function Div_PriceCompare({ stores, gridCols = "grid-cols-3" }) {
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
		<div className={`grid ${gridCols} gap-3`}>
		  {stores.map((store, idx) => (
			<div className="bd-soft border border-gray-200 rounded-lg p-3" key={idx}>
			  <div className="bd-row flex justify-center items-center">
				<img
				  src={logoMap[store.name] || logoMap["default"]}
				  alt={store.name}
				  className="w-10 h-10 mr-2"
				/>
				<div className="font-semibold">{store.name}</div>
			  </div>
			  <div className="flex justify-center mt-3">
				<a
				  href={store.link}
				  target="_blank"
				  rel="noreferrer"
				  className="bd-btn inline-block bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
				>
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

// 커버는 스켈레톤과 동일한 레이아웃 로직을 본문에도 반영하기 때문에
// 별도 단순 컴포넌트 대신 Div_BookDetail에서 직접 렌더링

const Div_BookDescription = ({ content }) =>
content ? <HtmlSection title="책 소개" html={content} /> : null;

const Div_PublisherReview = ({ content }) =>
content ? <HtmlSection title="출판사 리뷰" html={content} /> : null;

function Div_ProductInfo({ published_at, page_cnt, size, publisher }) {
	if (!published_at && !page_cnt && !size && !publisher) return null;
	return (
	  <div className="bd-card">
		<h3 className="m-0 mb-2 font-semibold text-xl">책 정보</h3>
		<table className="w-full" style={{ fontSize: "14px" }}>
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


/**********************
* 본 화면 (스켈레톤과 동일 반응형 레이아웃)
**********************/
function Div_BookDetail({ bookData, stores, recommendedBooks }) {
	// 스켈레톤과 동일한 반응형 로직
	const [isDesktop, setIsDesktop] = React.useState(
	  typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
	);

	React.useEffect(() => {
	  let rafId = null;
	  const onResize = () => {
		if (rafId) cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(() => {
		  setIsDesktop(window.innerWidth >= 1024);
		});
	  };
	  window.addEventListener('resize', onResize, { passive: true });
	  return () => {
		if (rafId) cancelAnimationFrame(rafId);
		window.removeEventListener('resize', onResize);
	  };
	}, []);

	// 레이아웃 값 (스켈레톤과 동일)
	const coverWidthDesktop = '320px';
	const coverMaxHeightDesktop = 520;         // 데스크탑에서 최대 높이
	const priceGridCols = isDesktop ? 'grid-cols-3' : 'grid-cols-2';
	const recoGridCols  = isDesktop ? 'grid-cols-4' : 'grid-cols-2';

	// 표지 클릭 시 이동할 랜덤 마켓 링크 (렌더마다 1회 고정)
	const randomStoreLink =
	  stores && stores.length > 0
		? stores[Math.floor(Math.random() * stores.length)].link
		: '#';

	return (
	  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
		<Div_page_header title={header_title} subtitle={bookData.title} />

		<section id="book-detail" className="w-full">
		  <div className={isDesktop ? 'flex gap-6 items-start' : 'flex flex-col gap-4 items-stretch'}>

			{/* Cover */}
			<aside
			  className={isDesktop ? 'shrink-0' : 'w-full flex justify-center'}
			  style={{ width: isDesktop ? coverWidthDesktop : '100%' }}
			>
			  <div
				className="rounded-lg overflow-hidden relative"
				style={{
				  width: isDesktop ? coverWidthDesktop : '50%',   // 모바일: 화면 절반
				  maxWidth: isDesktop ? coverWidthDesktop : '360px'
				}}
			  >
				<a href={randomStoreLink} target="_blank" rel="noreferrer">
				  <img
					className="w-full rounded-lg block object-contain"
					src={bookData.url_image}
					alt={bookData.title}
					style={{
					  height: 'auto',
					  maxHeight: isDesktop ? coverMaxHeightDesktop : 'none'
					}}
				  />
				</a>
			  </div>
			</aside>

			{/* Right section */}
			<section className={isDesktop ? 'flex-1 flex flex-col gap-4' : 'w-full flex flex-col gap-4'}>
			  <div className="my-4">
				<Div_BookMeta title={bookData.title} subtitle={bookData.subtitle} />
			  </div>

			  <div className="my-4">
				<Div_PriceCompare stores={stores} gridCols={priceGridCols} />
			  </div>

			  {/* HTML 섹션 */}
			  <Div_BookDescription content={bookData.introduction} />
			  <Div_PublisherReview content={bookData.publisher_review} />

			  <Div_ProductInfo
				published_at={bookData.published_at}
				page_cnt={bookData.page_cnt}
				size={bookData.size}
				publisher={bookData.publisher}
			  />

			  <div className="my-4">
				<Div_RecommendedBooks books={recommendedBooks} gridCols={recoGridCols} />
			  </div>
			</section>
		  </div>
		</section>
	  </main>
	);
}