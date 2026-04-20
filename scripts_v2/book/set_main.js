/* book unified set_main.js */

(function () {
  const query = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const parts = pathname.split('/').filter(Boolean);

  let route = 'list';
  let sub = query.get('sub') || '';
  let orderID = query.get('orderID') || '';

  if (parts[0] === 'book') {
    if (parts.length === 1) {
      route = sub ? 'detail' : 'list';
    } else {
      switch (parts[1]) {
        case 'list':
          route = 'list';
          sub = parts[2] || sub;
          break;
        case 'detail':
          route = 'detail';
          sub = parts[2] || sub;
          break;
        case 'write':
          route = 'write';
          sub = parts[2] || sub;
          break;
        case 'edit':
          route = 'edit';
          orderID = parts[2] || orderID;
          break;
        case 'read':
          route = 'read';
          orderID = parts[2] || orderID;
          break;
        default:
          route = 'detail';
          sub = parts[1] || sub;
          break;
      }
    }
  }

  window.WebRBookRouteContext = {
    route,
    sub,
    orderID,
    pathname,
    search: window.location.search,
  };
  window.WebRBookPages = window.WebRBookPages || {};
})();

(function () {
  window.WebRBookPages = window.WebRBookPages || {};

  window.WebRBookPages.detail = async function set_main_detail() {
    const ctx = window.WebRBookRouteContext || {};
    const sub = ctx.sub || '';
    const root = document.getElementById('div_main');
    const header_title = '도서';
    const header_subtitle = '';

    function Div_page_header(props) {
      return (
        <div class="flex flex-row w-full justify-start items-end text-start mb-8">
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
            <span class="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
          </h1>
          <p class="text-lg font-normal text-gray-500 sm:text-md pb-2">{props.subtitle}</p>
        </div>
      );
    }

    const SkelLine = ({ w = '100%', h = 12, r = 8, style = {} }) => (
      <div className="bg-gray-200 animate-pulse" style={{ width: w, height: h, borderRadius: r, ...style }} />
    );

    const SkelBox = ({ w = '100%', h = 120, r = 12, style = {} }) => (
      <div className="bg-gray-200 animate-pulse" style={{ width: w, height: h, borderRadius: r, ...style }} />
    );

    function Div_BookDetailSkeleton() {
      const [isDesktop, setIsDesktop] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

      React.useEffect(() => {
        let rafId = null;
        const onResize = () => {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => setIsDesktop(window.innerWidth >= 1024));
        };
        window.addEventListener('resize', onResize, { passive: true });
        return () => {
          if (rafId) cancelAnimationFrame(rafId);
          window.removeEventListener('resize', onResize);
        };
      }, []);

      const coverWidth = isDesktop ? '320px' : '100%';
      const coverHeight = isDesktop ? 520 : '0';
      const coverPaddingBottom = isDesktop ? '0' : '150%';
      const priceGridCols = isDesktop ? 'grid-cols-3' : 'grid-cols-2';
      const recoGridCols = isDesktop ? 'grid-cols-4' : 'grid-cols-2';
      const metaWidth1 = isDesktop ? '60%' : '65%';
      const metaWidth2 = isDesktop ? '85%' : '92%';
      const tabWidths = isDesktop ? ['84px', '92px', '102px', '86px'] : ['90px', '98px', '106px', '92px'];
      const contentWidth1 = isDesktop ? '45%' : '60%';
      const contentWidth2 = isDesktop ? '95%' : '100%';
      const contentWidth3 = isDesktop ? '88%' : '92%';
      const contentWidth4 = isDesktop ? '70%' : '80%';
      const priceLineWidth = isDesktop ? '45%' : '55%';
      const recoLineWidth1 = isDesktop ? '90%' : '95%';
      const recoLineWidth2 = isDesktop ? '65%' : '70%';

      return (
        <main id="page-books-skeleton" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
          <Div_page_header title={header_title} subtitle={header_subtitle} />
          <section id="book-detail-skeleton" className="w-full">
            <div className={isDesktop ? 'flex gap-6 items-start' : 'flex flex-col gap-4 items-stretch'}>
              <aside className={isDesktop ? 'shrink-0' : 'w-full'} style={{ width: coverWidth }}>
                <div className="rounded-lg overflow-hidden">
                  <SkelBox h={coverHeight} style={{ paddingBottom: coverPaddingBottom }} />
                </div>
              </aside>
              <section className={isDesktop ? 'flex-1 flex flex-col gap-4' : 'w-full'}>
                <div className="rounded-lg p-4 border border-gray-100">
                  <SkelLine w={metaWidth1} h={26} style={{ marginBottom: 10 }} />
                  <SkelLine w={metaWidth2} h={14} />
                </div>
                <div className="rounded-lg p-4 border border-gray-100">
                  <SkelLine w="120px" h={18} style={{ marginBottom: 14 }} />
                  <div className={`grid ${priceGridCols} gap-3`}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-3">
                        <SkelLine w={priceLineWidth} h={14} />
                        <SkelLine w="100%" h={36} style={{ marginTop: 14, borderRadius: 10 }} />
                      </div>
                    ))}
                  </div>
                  <SkelLine w={isDesktop ? '60%' : '75%'} h={12} style={{ marginTop: 14 }} />
                </div>
                <div className="rounded-lg p-4 border border-gray-100">
                  <div className="flex gap-2 flex-wrap mb-3">
                    {tabWidths.map((width, i) => <SkelLine key={i} w={width} h={30} />)}
                  </div>
                  <SkelLine w={contentWidth1} h={16} style={{ marginBottom: 10 }} />
                  <SkelLine w={contentWidth2} h={12} style={{ marginBottom: 8 }} />
                  <SkelLine w={contentWidth3} h={12} style={{ marginBottom: 8 }} />
                  <SkelLine w={contentWidth4} h={12} />
                </div>
                <div className="rounded-lg p-4 border border-gray-100">
                  <SkelLine w={isDesktop ? '180px' : '190px'} h={18} style={{ marginBottom: 14 }} />
                  <div className={`grid ${recoGridCols} gap-3`}>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="w-full h-0 pb-[133%] bg-gray-200 rounded-lg animate-pulse"></div>
                        <SkelLine w={recoLineWidth1} h={14} style={{ marginTop: 8, marginBottom: 6 }} />
                        <SkelLine w={recoLineWidth2} h={12} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </section>
        </main>
      );
    }

    function sanitizeHtml(html) {
      return (html || '')
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/\s(on\w+)=(".*?"|'.*?'|[^\s>]+)/gi, '');
    }

    function getRandomItems(array, n) {
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    }

    const HtmlSection = ({ title, html }) => (
      <section className="prose max-w-none prose-neutral">
        {title ? <h3 className="m-0 mb-2 font-semibold text-xl">{title}</h3> : null}
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
      </section>
    );

    function Div_RecommendedBooks({ books, gridCols = 'grid-cols-4' }) {
      return (
        <div className="bd-card my-4">
          <div className="bd-row">
            <h2 className="font-semibold text-xl">함께 보면 좋은 책</h2>
          </div>
          <div className={`grid ${gridCols} gap-3 mt-3`}>
            {books.map((book) => (
              <a
                className="bd-book"
                href={`/book/${book.uuid_board_category}/`}
                key={book.uuid_board_category}
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

    function Div_PriceCompare({ stores, gridCols = 'grid-cols-3' }) {
      const logoMap = {
        '교보문고': 'https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/kyobobook2.png',
        'Yes24': 'https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/yes24.png',
        '영풍문고': 'https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/ypbooks.png',
        '쿠팡': 'https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/coupang.png',
        'LeanPub': 'https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/LeanPub.png',
        'Bookdown': 'https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/bookdown.png',
        default: 'https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/icon_default.png',
      };
      const purchaseMarkets = ['교보문고', '쿠팡', '영풍문고', 'Yes24'];

      return (
        <div className="bd-card my-4">
          <h2 className="mb-3 font-semibold text-xl">마켓플레이스</h2>
          <div className={`grid ${gridCols} gap-3`}>
            {stores.map((store, idx) => (
              <div className="bd-soft border border-gray-200 rounded-lg p-3" key={`${store.name}-${idx}`}>
                <div className="bd-row flex justify-center items-center">
                  <img src={logoMap[store.name] || logoMap.default} alt={store.name} className="w-10 h-10 mr-2" />
                  <div className="font-semibold">{store.name}</div>
                </div>
                <div className="flex justify-center mt-3">
                  <a
                    href={store.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bd-btn inline-block bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
                  >
                    {purchaseMarkets.includes(store.name) ? '구매하러 가기' : '보러가기'}
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

    const Div_BookDescription = ({ content }) => (content ? <HtmlSection title="책 소개" html={content} /> : null);
    const Div_BookContents = ({ content }) => (content ? <HtmlSection title="목차" html={content} /> : null);
    const Div_PublisherReview = ({ content }) => (content ? <HtmlSection title="출판사 리뷰" html={content} /> : null);

    function Div_ProductInfo({ published_at, page_cnt, size, publisher }) {
      if (!published_at && !page_cnt && !size && !publisher) return null;
      return (
        <div className="bd-card">
          <h3 className="m-0 mb-2 font-semibold text-xl">책 정보</h3>
          <table className="w-full" style={{ fontSize: '14px' }}>
            <tbody>
              {published_at ? <tr><th className="text-left px-4 py-2 font-medium">출간</th><td className="py-2">{published_at}</td></tr> : null}
              {page_cnt ? <tr><th className="text-left px-4 py-2 font-medium">페이지 수</th><td className="py-2">{page_cnt}</td></tr> : null}
              {size ? <tr><th className="text-left px-4 py-2 font-medium">크기</th><td className="py-2">{size}</td></tr> : null}
              {publisher ? <tr><th className="text-left px-4 py-2 font-medium">출판사</th><td className="py-2">{publisher}</td></tr> : null}
            </tbody>
          </table>
        </div>
      );
    }

    function Div_BookDetail({ bookData, stores, recommendedBooks }) {
      const [isDesktop, setIsDesktop] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
      React.useEffect(() => {
        let rafId = null;
        const onResize = () => {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => setIsDesktop(window.innerWidth >= 1024));
        };
        window.addEventListener('resize', onResize, { passive: true });
        return () => {
          if (rafId) cancelAnimationFrame(rafId);
          window.removeEventListener('resize', onResize);
        };
      }, []);

      const coverWidthDesktop = '320px';
      const coverMaxHeightDesktop = 520;
      const priceGridCols = isDesktop ? 'grid-cols-3' : 'grid-cols-2';
      const recoGridCols = isDesktop ? 'grid-cols-4' : 'grid-cols-2';
      const randomStoreLink = stores && stores.length > 0
        ? stores[Math.floor(Math.random() * stores.length)].link
        : '#';

      return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
          <Div_page_header title={header_title} subtitle={bookData.title} />
          <section id="book-detail" className="w-full">
            <div className={isDesktop ? 'flex gap-6 items-start' : 'flex flex-col gap-4 items-stretch'}>
              <aside className={isDesktop ? 'shrink-0' : 'w-full flex justify-center'} style={{ width: isDesktop ? coverWidthDesktop : '100%' }}>
                <div className="rounded-lg overflow-hidden relative" style={{ width: isDesktop ? coverWidthDesktop : '50%', maxWidth: isDesktop ? coverWidthDesktop : '360px' }}>
                  <a href={randomStoreLink} target="_blank" rel="noreferrer noopener">
                    <img
                      className="w-full rounded-lg block object-contain"
                      src={bookData.url_image}
                      alt={bookData.title}
                      style={{ height: 'auto', maxHeight: isDesktop ? coverMaxHeightDesktop : 'none' }}
                    />
                  </a>
                </div>
              </aside>
              <section className={isDesktop ? 'flex-1 flex flex-col gap-4' : 'w-full flex flex-col gap-4'}>
                <div className="my-4"><Div_BookMeta title={bookData.title} subtitle={bookData.subtitle} /></div>
                <div className="my-4"><Div_PriceCompare stores={stores} gridCols={priceGridCols} /></div>
                <Div_BookDescription content={bookData.introduction} />
                <Div_BookContents content={bookData.contents} />
                <Div_PublisherReview content={bookData.publisher_review} />
                <Div_ProductInfo
                  published_at={bookData.published_at}
                  page_cnt={bookData.page_cnt}
                  size={bookData.size}
                  publisher={bookData.publisher}
                />
                <div className="my-4"><Div_RecommendedBooks books={recommendedBooks} gridCols={recoGridCols} /></div>
              </section>
            </div>
          </section>
        </main>
      );
    }

    if (!root) return;
    ReactDOM.render(<Div_BookDetailSkeleton />, root);

    if (!sub) {
      ReactDOM.render(
        <div className="max-w-screen-xl mx-auto px-6 py-8 text-red-600">잘못된 요청입니다. URL에 책 식별자(sub)가 필요합니다.</div>,
        root,
      );
      return;
    }

    try {
      const response = await fetch('/book/ajax_get_book_list/', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data_list = await response.json();
      const values = Object.values(data_list || {});

      const bookData = values.find((item) => item.uuid_board_category === sub);
      if (!bookData) {
        ReactDOM.render(
          <div className="max-w-screen-xl mx-auto px-6 py-8 text-red-600">해당 ID의 책을 찾을 수 없습니다. (sub: {sub})</div>,
          root,
        );
        return;
      }

      const subtitleParts = [];
      if (bookData.publisher) subtitleParts.push(bookData.publisher);
      if (bookData.published_at) subtitleParts.push(bookData.published_at);
      if (bookData.isbn) subtitleParts.push(`ISBN ${bookData.isbn}`);
      bookData.subtitle = subtitleParts.join(' · ');

      const stores = values
        .filter((item) => item.uuid_board_category === sub)
        .map((item) => ({ name: item.marketplace, link: item.url || '#' }))
        .filter((store, index, self) => index === self.findIndex((s) => s.name === store.name));

      const uniqueRecommended = [...new Map(
        values
          .filter((item) => item.uuid_board_category !== sub)
          .map((item) => [item.uuid_board_category, item]),
      ).values()];

      const recommendedBooks = getRandomItems(uniqueRecommended, 4).map((item) => ({
        cover: item.url_image,
        alt: item.title,
        title: item.title,
        author: item.publisher,
        uuid_board_category: item.uuid_board_category,
      }));

      ReactDOM.render(<Div_BookDetail bookData={bookData} stores={stores} recommendedBooks={recommendedBooks} />, root);
    } catch (error) {
      ReactDOM.render(
        <div className="max-w-screen-xl mx-auto px-6 py-8 text-red-600">책 정보를 불러오는 데 실패했습니다. 에러: {error.message}</div>,
        root,
      );
    }
  };
})();

(function () {
  window.WebRBookPages = window.WebRBookPages || {};

  window.WebRBookPages.list = async function set_main_list() {
    const ctx = window.WebRBookRouteContext || {};
    const root = document.getElementById('div_main');
    const header_title = '도서';
    const header_subtitle = '도서 소개와 관련 글을 함께 확인할 수 있습니다.';
    const boardTag = 'book';

    let currentSub = ctx.sub || null;
    let pageNum = 1;
    let articleCounter = 0;
    let togglePage = false;
    let cachedList = null;

    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i += 1) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === `${name}=`) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    function Div_page_header(props) {
      return (
        <div class="flex flex-row w-full justify-start items-end text-start mb-8">
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
            <span class="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
          </h1>
          <p class="text-lg font-normal text-gray-500 sm:text-md pb-2">{props.subtitle}</p>
        </div>
      );
    }

    function Div_box_header(props) {
      return <p class="flex flex-row text-start w-full font-extrabold underline">{props.title}</p>;
    }

    function Div_book_content_skeleton() {
      return <div class="flex flex-row justify-center items-center w-full h-[260px] bg-gray-300 rounded-xl animate-pulse"></div>;
    }

    function Div_article_list_skeleton() {
      return (
        <div class="flex flex-col justify-center items-center w-full space-y-2 animate-pulse">
          <div class="h-5 bg-gray-200 rounded-full w-full"></div>
          <div class="h-5 bg-gray-200 rounded-full w-full"></div>
          <div class="h-5 bg-gray-200 rounded-full w-full"></div>
          <div class="h-5 bg-gray-200 rounded-full w-full"></div>
          <div class="h-5 bg-gray-200 rounded-full w-full"></div>
        </div>
      );
    }

    const classSpanBtnDefault = 'flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl';
    function Span_btn_user(props) {
      const roleClassMap = {
        '관리자': 'bg-yellow-100 text-yellow-800',
        '기업회원': 'bg-red-100 text-red-800',
        'VIP회원': 'bg-blue-100 text-blue-800',
        '정회원': 'bg-green-100 text-green-800',
        '준회원': 'bg-gray-100 text-gray-800',
      };
      const roleClass = roleClassMap[props.role] || 'bg-gray-100 text-gray-800';
      return (
        <span class={`${classSpanBtnDefault} text-xs ${roleClass}`}>
          <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
          {props.user_nickname}
        </span>
      );
    }
    function Span_btn_date(props) {
      return (
        <span class={`${classSpanBtnDefault} text-xs bg-blue-100 text-blue-800`}>
          <img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_${Number((props.date || '').split('-')[2]?.substr(0, 2) || '1')}.svg`} class="w-3 h-3 mr-1" />
          {props.date}
        </span>
      );
    }
    function Span_btn_article_read(props) {
      return props.cnt_read > 0 ? (
        <span class={`${classSpanBtnDefault} text-xs bg-gray-100 text-blue-800`}>
          <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/eye.svg" class="w-3 h-3 mr-1" />
          {String(props.cnt_read).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </span>
      ) : null;
    }
    function Span_btn_article_comment(props) {
      return props.cnt_comment > 0 ? (
        <span class={`${classSpanBtnDefault} text-xs bg-purple-100 text-blue-800`}>
          <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment.svg" class="w-3 h-3 mr-1" />
          {String(props.cnt_comment).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </span>
      ) : null;
    }
    function Span_btn_book(props) {
      return props.title ? (
        <span class={`${classSpanBtnDefault} text-xs bg-green-100 text-green-800`}>
          <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/book.svg" class="w-3 h-3 mr-1" />
          {props.title}
        </span>
      ) : null;
    }
    function Span_btn_article_new(props) {
      return props.toggle === 1 ? <span class={`${classSpanBtnDefault} text-[10px] bg-red-500 text-white animate-pulse`}>NEW</span> : null;
    }
    function Span_btn_article_secret(props) {
      return props.toggle === 1 ? <span class={`${classSpanBtnDefault} text-[10px] bg-gray-500 text-white animate-pulse`}>SECRET</span> : null;
    }
    function Span_btn_my_article(props) {
      return props.toggle === 'writer' ? <span class={`${classSpanBtnDefault} text-[10px] bg-blue-500 text-white animate-pulse`}>MY</span> : null;
    }

    function ArticleRow({ data }) {
      return (
        <div class="bg-white border-b w-full">
          <div class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full" onClick={() => (location.href = `/book/read/${data.uuid}/`)}>
            <div class="flex flex-row justify-start items-center space-x-2">
              <span class="font-bold text-sm w-fit max-w-9/12 truncate ...">{data.title}</span>
              <Span_btn_article_new toggle={data.is_new} />
              <Span_btn_article_secret toggle={data.is_secret} />
              <Span_btn_my_article toggle={data.check_reader} />
            </div>
            <div class="flex flex-wrap justify-start items-center w-full space-x-2">
              <Span_btn_user user_nickname={data.user_nickname} role={data.user_role} />
              <Span_btn_date date={data.created_at} />
              <Span_btn_book title={data.category_sub_title} />
              <Span_btn_article_read cnt_read={data.cnt_read} />
              <Span_btn_article_comment cnt_comment={data.cnt_comment} />
            </div>
          </div>
        </div>
      );
    }

    function BookCardScroller({ books, activeSub, onSelect }) {
      const activeCls = 'flex flex-col justify-center items-center w-[175px] min-w-[175px] max-w-[175px] px-2 rounded-xl space-y-2 border border-gray-500 bg-blue-100 cursor-pointer hover:border hover:border-gray-900';
      const inactiveCls = 'flex flex-col justify-center items-center w-[175px] min-w-[175px] max-w-[175px] px-2 rounded-xl space-y-2 cursor-pointer hover:border hover:border-gray-900';
      return (
        <div class="flex flex-col w-full h-fit border space-y-2 border-gray-300 rounded-xl p-4 mb-4 relative">
          <p class="font-extrabold underline">도서 선택</p>
          <div class="flex flex-nowrap space-x-8 overflow-x-scroll scroll-smooth scroll-hide" id="div_book_list_slider">
            {books.map((book) => (
              <div key={book.uuid_board_category} class={activeSub === book.uuid_board_category ? activeCls : inactiveCls} onClick={() => onSelect(book.uuid_board_category)}>
                <img src={book.url_image} class="w-[85px] min-w-[85px] max-w-[85px] h-[100px] min-h-[100px] max-h-[100px] object-cover rounded" />
                <p class="text-sm text-center">{book.title}</p>
              </div>
            ))}
            <div id="div_book_list_prev" class="absolute top-[110px] left-[8px] z-10 cursor-pointer hover:rounded-full hover:text-blue-700 focus:z-10 focus:ring-8 focus:ring-gray-200">
              <img src="https://cdn.jsdelivr.net/gh/Ignite-Official/CDN/web/image/svg/main_scroll_left.svg" class="w-[36px] h-[36px]" />
            </div>
            <div id="div_book_list_next" class="absolute top-[110px] right-[8px] z-10 cursor-pointer hover:rounded-full hover:text-blue-700 focus:z-10 focus:ring-8 focus:ring-gray-200">
              <img src="https://cdn.jsdelivr.net/gh/Ignite-Official/CDN/web/image/svg/main_scroll_right.svg" class="w-[36px] h-[36px]" />
            </div>
          </div>
        </div>
      );
    }

    function MarketButtons({ stores }) {
      if (!stores || stores.length === 0) return null;
      return (
        <div class="flex flex-wrap gap-2 w-full">
          {stores.map((store) => (
            <a
              key={store.name}
              href={store.link}
              target="_blank"
              rel="noreferrer noopener"
              class="text-gray-700 bg-gray-100 border border-gray-300 rounded-lg text-sm px-4 py-2 hover:bg-gray-200"
            >
              {store.name}
            </a>
          ))}
        </div>
      );
    }

    function BookInfoPanel({ bookData, stores }) {
      if (!bookData) {
        return (
          <div class="flex flex-col justify-center items-center w-full space-y-4 text-center">
            <p class="text-gray-600">도서를 선택하면 책 정보와 관련 글을 함께 볼 수 있습니다.</p>
            <a href="/book/write/" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">글쓰기</a>
          </div>
        );
      }

      return (
        <div class="flex flex-col justify-center items-center w-full space-y-4">
          <a href={`/book/${bookData.uuid_board_category}/`} class="w-full flex justify-center">
            <img src={bookData.url_image} class="w-[140px] min-w-[140px] max-w-[140px] border border-gray-300 rounded-lg" />
          </a>
          <div class="text-center space-y-1">
            <p class="text-md font-extrabold">{bookData.title}</p>
            <p class="text-sm font-normal text-gray-600">{[bookData.publisher, bookData.published_at].filter(Boolean).join(' | ')}</p>
            {bookData.page_cnt ? <p class="text-xs text-gray-500">{bookData.page_cnt} pages</p> : null}
          </div>
          <a href={`/book/write/?sub=${bookData.uuid_board_category}`} class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">이 책으로 글쓰기</a>
          <MarketButtons stores={stores} />
        </div>
      );
    }

    function Shell() {
      return (
        <div class="flex flex-col justify-center items-center py-8 px-4 w-full max-w-screen-xl mx-auto md:px-8">
          <Div_page_header title={header_title} subtitle={header_subtitle} />
          <div class="w-full" id="div_book_list">
            <div class="flex flex-row justify-center items-center w-full h-[150px] mb-4 bg-gray-300 rounded-xl animate-pulse"></div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-4 w-full gap-4">
            <div class="col-span-1 w-full" id="div_book_info"><Div_book_content_skeleton /></div>
            <div class="col-span-1 lg:col-span-3 w-full" id="div_article_list"><Div_article_list_skeleton /></div>
          </div>
        </div>
      );
    }

    async function ensureBookList() {
      if (cachedList) return cachedList;
      const data = await fetch('/book/ajax_get_book_list/').then((res) => res.json());
      const deduped = [...new Map(Object.values(data || {}).map((item) => [item.uuid_board_category, item])).values()];
      cachedList = { raw: Object.values(data || {}), books: deduped };
      return cachedList;
    }

    async function renderBookCards() {
      const listData = await ensureBookList();
      ReactDOM.render(<BookCardScroller books={listData.books} activeSub={currentSub} onSelect={handleSelectBook} />, document.getElementById('div_book_list'));
      const slider = document.getElementById('div_book_list_slider');
      const prev = document.getElementById('div_book_list_prev');
      const next = document.getElementById('div_book_list_next');
      if (slider && prev && next) {
        next.onclick = () => slider.scrollBy(slider.offsetWidth, 0);
        prev.onclick = () => slider.scrollBy(-slider.offsetWidth, 0);
      }
    }

    async function renderBookInfo() {
      if (!currentSub) {
        ReactDOM.render(<BookInfoPanel bookData={null} stores={[]} />, document.getElementById('div_book_info'));
        return;
      }

      const requestData = new FormData();
      requestData.append('tag_sub', currentSub || 'null');
      const bookData = await fetch('/book/ajax_get_book_info/', {
        method: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        body: requestData,
      }).then((res) => res.json());

      const listData = await ensureBookList();
      const stores = listData.raw
        .filter((item) => item.uuid_board_category === currentSub)
        .map((item) => ({ name: item.marketplace, link: item.url || '#' }))
        .filter((store, index, self) => index === self.findIndex((s) => s.name === store.name));

      ReactDOM.render(<BookInfoPanel bookData={bookData} stores={stores} />, document.getElementById('div_book_info'));
    }

    function renderArticleList(data, mode) {
      const items = Object.values(data || {}).map((item) => <ArticleRow key={item.uuid} data={item} />);
      const container = (
        <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
          <Div_box_header title={currentSub ? '관련 글' : '전체 도서 글'} />
          <div class="flex flex-col justify-center items-start w-full space-y-2">
            {items}
            <div id={`div_article_list_${pageNum + 1}`} class="w-full"></div>
          </div>
        </div>
      );
      const nextContainer = (
        <div class="flex flex-col justify-center items-start w-full space-y-2">
          {items}
          <div id={`div_article_list_${pageNum + 1}`} class="w-full"></div>
        </div>
      );

      const targetId = mode === 'next' ? `div_article_list_${pageNum}` : 'div_article_list';
      ReactDOM.render(mode === 'next' ? nextContainer : container, document.getElementById(targetId));
    }

    async function getArticleList(mode) {
      if (togglePage) return;
      togglePage = true;

      const requestData = new FormData();
      requestData.append('tag', boardTag);
      requestData.append('tag_sub', currentSub || 'null');

      if (mode === 'init') {
        pageNum = 1;
        ReactDOM.render(<Div_article_list_skeleton />, document.getElementById('div_article_list'));
      } else {
        pageNum += 1;
        const nextTarget = document.getElementById(`div_article_list_${pageNum}`);
        if (nextTarget) ReactDOM.render(<Div_article_list_skeleton />, nextTarget);
      }

      requestData.append('page', pageNum);

      const data = await fetch('/blank/ajax_board/get_article_list/', {
        method: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        body: requestData,
      }).then((res) => res.json());

      articleCounter = Number(data?.count?.cnt || 0);
      renderArticleList(data?.list || {}, mode);
      togglePage = false;
    }

    async function handleSelectBook(nextSub) {
      currentSub = currentSub === nextSub ? null : nextSub;
      await renderBookCards();
      await renderBookInfo();
      await getArticleList('init');
    }

    function bindInfiniteScroll() {
      if (window.__webrBookListScrollBound) return;
      window.__webrBookListScrollBound = true;
      window.addEventListener('scroll', () => {
        const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
        if (isScrollEnded && !togglePage && ((pageNum * 20) < articleCounter)) {
          getArticleList('next');
        }
      });
    }

    if (!root) return;
    ReactDOM.render(<Shell />, root);
    await renderBookCards();
    await renderBookInfo();
    await getArticleList('init');
    bindInfiniteScroll();
  };
})();

(function () {
  window.WebRBookPages = window.WebRBookPages || {};

  window.WebRBookPages.write = async function set_main_write() {
    const ctx = window.WebRBookRouteContext || {};
    const root = document.getElementById('div_main');
    const preselectedSub = ctx.sub || '';
    const initUrl = '/book/';

    let toggleClickSubmit = false;
    let editor = null;
    let bookOptions = [];

    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i += 1) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === `${name}=`) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    function Div_page_header(props) {
      return (
        <div class="flex flex-row w-full justify-start items-end text-start mb-8">
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
            <span class="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
          </h1>
          <p class="text-lg font-normal text-gray-500 sm:text-md pb-2">{props.subtitle}</p>
        </div>
      );
    }

    function Div_button() {
      return (
        <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
          <button type="button" onClick={() => click_btn_submit()} class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">완료</button>
          <a href={initUrl} class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">목록으로</a>
        </div>
      );
    }

    function Div_button_loading() {
      return (
        <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
          <button type="button" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed">
            <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/></svg>
            완료
          </button>
          <button type="button" class="text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed">목록으로</button>
        </div>
      );
    }

    function Form() {
      return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
          <Div_page_header title="도서 글쓰기" subtitle="도서별 글을 등록합니다." />
          <div id="div_title" class="w-full">
            <input type="text" placeholder="제목을 입력해주세요." id="txt_title" name="txt_title" class="w-full h-[48px] rounded-lg resize-none scroll-hide text-start text-[14px] font-[500] border-gray-500 focus:ring-gray-700 focus:border-gray-700" />
          </div>
          <div id="div_sel_book" class="flex flex-row justify-end items-center w-full">
            <div class="flex items-center justify-center w-full h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div id="div_checker" class="flex flex-row justify-end items-center w-full">
            <div class="flex items-center mb-4">
              <input id="chk_secret" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
              <label for="chk_secret" class="ms-2 text-sm font-medium text-gray-900">비밀글로 작성하기 (본인과 관리자만 읽을 수 있습니다.)</label>
            </div>
          </div>
          <div id="div_editor" class="w-full"></div>
          <div class="w-full" id="div_button_list"><Div_button /></div>
        </div>
      );
    }

    function BookSelect({ options, selectedSub }) {
      return (
        <form class="w-full">
          <select id="sel_book" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500" defaultValue={selectedSub || ''}>
            <option value="">어떤 책에 관해 이야기 하실건가요?</option>
            {options.map((item) => (
              <option key={item.uuid_board_category} value={item.uuid}>{item.title}</option>
            ))}
          </select>
        </form>
      );
    }

    async function loadBookOptions() {
      const data = await fetch('/book/ajax_get_book_list/').then((res) => res.json());
      bookOptions = [...new Map(Object.values(data || {}).map((item) => [item.uuid_board_category, item])).values()];
      const selected = bookOptions.find((item) => item.uuid_board_category === preselectedSub);
      ReactDOM.render(<BookSelect options={bookOptions} selectedSub={selected ? selected.uuid : ''} />, document.getElementById('div_sel_book'));
    }

    async function click_btn_submit() {
      const txtTitle = document.getElementById('txt_title').value.trim();
      const selBook = document.getElementById('sel_book').value;
      const txtContent = editor.getHTML();
      const chkSecret = document.getElementById('chk_secret').checked;

      if (toggleClickSubmit) return;
      toggleClickSubmit = true;
      ReactDOM.render(<Div_button_loading />, document.getElementById('div_button_list'));

      try {
        if (!txtTitle) {
          alert('제목을 입력해주세요.');
          return;
        }
        if (!selBook) {
          alert('도서를 선택해주세요.');
          return;
        }
        if (!txtContent || txtContent === '<p><br></p>') {
          alert('내용을 입력해주세요.');
          return;
        }

        const requestData = new FormData();
        requestData.append('tag', selBook);
        requestData.append('txt_title', txtTitle);
        requestData.append('txt_content', txtContent);
        requestData.append('chk_secret', chkSecret);

        const data = await fetch('/book/ajax_insert_article/', {
          method: 'post',
          headers: { 'X-CSRFToken': getCookie('csrftoken') },
          body: requestData,
        }).then((res) => res.json());

        location.href = `${initUrl}read/${data.uuid}/`;
      } finally {
        toggleClickSubmit = false;
        ReactDOM.render(<Div_button />, document.getElementById('div_button_list'));
      }
    }

    if (!root) return;
    if ((window.gv_username || '') === '') {
      location.href = preselectedSub ? `/book/${preselectedSub}/` : initUrl;
      return;
    }

    ReactDOM.render(<Form />, root);
    const { Editor } = toastui;
    const { colorSyntax } = Editor.plugin;
    const { tableMergedCell } = Editor.plugin;

    editor = new toastui.Editor({
      el: document.querySelector('#div_editor'),
      previewStyle: 'vertical',
      height: '500px',
      initialEditType: 'wysiwyg',
      plugins: [colorSyntax, tableMergedCell],
    });

    await loadBookOptions();
  };
})();

(function () {
  window.WebRBookPages = window.WebRBookPages || {};

  window.WebRBookPages.edit = async function set_main_edit() {
    const ctx = window.WebRBookRouteContext || {};
    const root = document.getElementById('div_main');
    const orderID = ctx.orderID || '';
    const initUrl = '/book/';

    let toggleClickSubmit = false;
    let editor = null;
    let articleData = null;
    let bookOptions = [];

    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i += 1) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === `${name}=`) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    function Div_page_header(props) {
      return (
        <div class="flex flex-row w-full justify-start items-end text-start mb-8">
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
            <span class="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
          </h1>
          <p class="text-lg font-normal text-gray-500 sm:text-md pb-2">{props.subtitle}</p>
        </div>
      );
    }

    function Div_button() {
      return (
        <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
          <button type="button" onClick={() => click_btn_submit()} class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">완료</button>
          <a href={initUrl} class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">목록으로</a>
        </div>
      );
    }

    function Div_button_loading() {
      return (
        <div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
          <button type="button" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed">완료</button>
          <button type="button" class="text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed">목록으로</button>
        </div>
      );
    }

    function Div_check_writer() {
      return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
          <Div_page_header title="도서 글 수정" subtitle="작성자 여부를 확인하고 있습니다." />
          <div class="flex flex-col justify-center items-center w-full space-y-4">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
            <p>작성자 여부를 확인하고 있습니다.</p>
          </div>
        </div>
      );
    }

    function Div_main_stop() {
      return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
          <Div_page_header title="도서 글 수정" subtitle="작성자만 수정할 수 있습니다." />
          <div class="flex flex-col justify-center items-center w-full space-y-4">
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg" class="size-16" />
            <p>작성자만 글을 수정할 수 있습니다.</p>
            <a href={initUrl} class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">목록으로</a>
          </div>
        </div>
      );
    }

    function Form() {
      return (
        <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
          <Div_page_header title="도서 글 수정" subtitle="도서 글 내용을 수정합니다." />
          <div id="div_title" class="w-full">
            <input type="text" placeholder="제목을 입력해주세요." id="txt_title" name="txt_title" class="w-full h-[48px] rounded-lg resize-none scroll-hide text-start text-[14px] font-[500] border-gray-500 focus:ring-gray-700 focus:border-gray-700" />
          </div>
          <div id="div_sel_book" class="flex flex-row justify-end items-center w-full">
            <div class="flex items-center justify-center w-full h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div id="div_checker" class="flex flex-row justify-end items-center w-full">
            <div class="flex items-center mb-4">
              <input id="chk_secret" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
              <label for="chk_secret" class="ms-2 text-sm font-medium text-gray-900">비밀글로 작성하기 (본인과 관리자만 읽을 수 있습니다.)</label>
            </div>
          </div>
          <div id="div_editor" class="w-full"></div>
          <div class="w-full" id="div_button_list"><Div_button /></div>
        </div>
      );
    }

    function BookSelect({ options, selectedCategoryUUID }) {
      const selected = options.find((item) => item.uuid_board_category === selectedCategoryUUID);
      return (
        <form class="w-full">
          <select id="sel_book" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500" defaultValue={selected ? selected.uuid : ''}>
            {options.map((item) => <option key={item.uuid_board_category} value={item.uuid}>{item.title}</option>)}
          </select>
        </form>
      );
    }

    async function loadBookOptions() {
      const data = await fetch('/book/ajax_get_book_list/').then((res) => res.json());
      bookOptions = [...new Map(Object.values(data || {}).map((item) => [item.uuid_board_category, item])).values()];
      ReactDOM.render(<BookSelect options={bookOptions} selectedCategoryUUID={articleData?.article?.category_uuid} />, document.getElementById('div_sel_book'));
    }

    async function click_btn_submit() {
      const txtTitle = document.getElementById('txt_title').value.trim();
      const selBook = document.getElementById('sel_book').value;
      const txtContent = editor.getHTML();
      const chkSecret = document.getElementById('chk_secret').checked;

      if (toggleClickSubmit) return;
      toggleClickSubmit = true;
      ReactDOM.render(<Div_button_loading />, document.getElementById('div_button_list'));

      try {
        if (!txtTitle) {
          alert('제목을 입력해주세요.');
          return;
        }
        if (!txtContent || txtContent === '<p><br></p>') {
          alert('내용을 입력해주세요.');
          return;
        }

        const requestData = new FormData();
        requestData.append('tag', selBook);
        requestData.append('uuid_article', orderID);
        requestData.append('txt_title', txtTitle);
        requestData.append('txt_content', txtContent);
        requestData.append('chk_secret', chkSecret);

        const data = await fetch('/book/ajax_update_article/', {
          method: 'post',
          headers: { 'X-CSRFToken': getCookie('csrftoken') },
          body: requestData,
        }).then((res) => res.json());

        location.href = `${initUrl}read/${data.uuid}/`;
      } finally {
        toggleClickSubmit = false;
        ReactDOM.render(<Div_button />, document.getElementById('div_button_list'));
      }
    }

    if (!root) return;
    if ((window.gv_username || '') === '' || !orderID) {
      location.href = initUrl;
      return;
    }

    ReactDOM.render(<Div_check_writer />, root);

    const requestData = new FormData();
    requestData.append('orderID', orderID);
    articleData = await fetch('/blank/ajax_board/get_read_article/', {
      method: 'post',
      headers: { 'X-CSRFToken': getCookie('csrftoken') },
      body: requestData,
    }).then((res) => res.json());

    if (articleData?.article?.check_reader === 'user') {
      ReactDOM.render(<Div_main_stop />, root);
      return;
    }

    ReactDOM.render(<Form />, root);

    const { Editor } = toastui;
    const { colorSyntax } = Editor.plugin;
    const { tableMergedCell } = Editor.plugin;
    editor = new toastui.Editor({
      el: document.querySelector('#div_editor'),
      previewStyle: 'vertical',
      height: '500px',
      initialEditType: 'wysiwyg',
      plugins: [colorSyntax, tableMergedCell],
    });

    document.getElementById('txt_title').value = articleData?.article?.title || '';
    editor.setHTML(articleData?.article?.content || '');
    if (articleData?.article?.is_secret === 1) {
      document.getElementById('chk_secret').checked = true;
    }

    await loadBookOptions();
  };
})();

(function () {
  window.WebRBookPages = window.WebRBookPages || {};

  window.WebRBookPages.read = async function set_main_read_stub() {
    const root = document.getElementById('div_main');
    if (!root) return;
    ReactDOM.render(
      <div class="max-w-screen-xl mx-auto px-6 py-8 text-gray-600">
        /book/read/ 글 읽기 화면은 공용 board/read 흐름을 사용하므로 이 템플릿의 book set_main 라우터 대상이 아닙니다.
      </div>,
      root,
    );
  };
})();

(function () {
  window.set_main = async function set_main() {
    const ctx = window.WebRBookRouteContext || {};
    const pages = window.WebRBookPages || {};
    const pageMain = pages[ctx.route] || pages.detail;

    if (typeof pageMain === 'function') {
      await pageMain();
      return;
    }

    const root = document.getElementById('div_main');
    if (root) {
      ReactDOM.render(
        <div class="max-w-screen-xl mx-auto px-6 py-8 text-red-600">
          book set_main router error
        </div>,
        root,
      );
    }
  };
})();

