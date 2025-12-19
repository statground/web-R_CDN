async function get_div_main_board() {

	function Div_new_article_list(props) {
		const cu = props.data.category_url;

		// free, rblogger → /community/read/<uuid>/
		// notebook → wbvda.url
		let href = '/community/read/' + props.data.uuid + '/';
		if (cu === 'notebook') {
			href = props.data.url;
		}

		// 카테고리 라벨
		let category_title = '커뮤니티';
		let category_title_color = ' bg-blue-100 text-blue-700 border-blue-300';

		if (cu === 'free') {
			category_title = '자유게시판';
			category_title_color = ' bg-blue-100 text-blue-700 border-blue-300';
		} else if (cu === 'rblogger') {
			category_title = 'R-Blogger';
			category_title_color = ' bg-purple-100 text-purple-700 border-purple-300';
		} else if (cu === 'notebook') {
			category_title = 'Web-R Notebook';
			category_title_color = ' bg-emerald-100 text-emerald-700 border-emerald-300';
		}

		return (
			<div class="bg-white w-full">
				<a
					href={href}
					class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-50 rounded-lg mx-3 my-2"
				>
					<div class="flex flex-row items-center space-x-2">
						{/* 🔽 타이틀 옆 알약 사이즈 축소 */}
						<span
							class={
								"px-2 py-0.5 border rounded-full text-xs font-semibold w-fit max-w-9/12" +
								category_title_color
							}
						>
							{category_title}
						</span>

						<span class="font-bold text-sm truncate">
							{props.data.title}
						</span>

						<Span_btn_article_new toggle={props.data.is_new} />
						<Span_btn_article_secret toggle={props.data.is_secret} />
						<Span_btn_my_article toggle={props.data.check_reader} />
					</div>

					<div class="flex flex-wrap items-center space-x-2">
						<Span_btn_user user_nickname={props.data.user_nickname} role={props.data.user_role} />
						<Span_btn_date date={props.data.created_at} />
						<Span_btn_article_read cnt_read={props.data.cnt_read} />
						<Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
					</div>
				</a>
			</div>
		);
	}


	function TabButton({ active, onClick, children }) {
		const base =
			"px-3 py-1.5 text-xs font-bold rounded-full transition-all select-none";
		const activeCls =
			" bg-blue-600 text-white shadow-sm";
		const inActiveCls =
			" bg-gray-100 text-gray-700 hover:bg-gray-200";

		return (
			<button
				type="button"
				onClick={onClick}
				class={base + (active ? activeCls : inActiveCls)}
			>
				{children}
			</button>
		);
	}


	function Col(props) {
		const [activeTab, setActiveTab] = React.useState('all');

		const arr = Object.keys(props.data || {}).map(k => props.data[k]);

		const sortByCreatedAtDesc = (a, b) => {
			const da = new Date(String(a.created_at).replace(" ", "T"));
			const db = new Date(String(b.created_at).replace(" ", "T"));
			return db - da;
		};

		const freeList = arr.filter(x => x.category_url === 'free').sort(sortByCreatedAtDesc);
		const rbloggerList = arr.filter(x => x.category_url === 'rblogger').sort(sortByCreatedAtDesc);
		const notebookList = arr.filter(x => x.category_url === 'notebook').sort(sortByCreatedAtDesc);

		// 전체보기: 각 카테고리 최신 1개씩 → 다시 최신순
		const pick = [];
		if (freeList.length) pick.push(freeList[0]);
		if (rbloggerList.length) pick.push(rbloggerList[0]);
		if (notebookList.length) pick.push(notebookList[0]);

		const allList = pick.sort(sortByCreatedAtDesc);

		let current = allList;
		if (activeTab === 'free') current = freeList;
		if (activeTab === 'rblogger') current = rbloggerList;
		if (activeTab === 'notebook') current = notebookList;

		return (
			<div class="w-full">
				<h5 class="mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900">
					커뮤니티
				</h5>

				<div class="rounded-lg bg-white shadow-sm overflow-hidden">
					{/* Tabs */}
					<div class="flex flex-wrap items-center gap-2 px-4 pt-4 pb-3 bg-white">
						<TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
							전체보기
						</TabButton>
						<TabButton active={activeTab === 'free'} onClick={() => setActiveTab('free')}>
							자유게시판
						</TabButton>
						<TabButton active={activeTab === 'rblogger'} onClick={() => setActiveTab('rblogger')}>
							R-Blogger
						</TabButton>
						<TabButton active={activeTab === 'notebook'} onClick={() => setActiveTab('notebook')}>
							Web-R Notebook
						</TabButton>
					</div>

					{/* List */}
					<div>
						{current.length > 0 ? current.map(article =>
							<Div_new_article_list data={article} />
						) : (
							<div class="px-6 py-6 text-sm text-gray-500">
								표시할 글이 없습니다.
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}


	const data = await fetch("/ajax_index_board/")
		.then(res => res.json());

	ReactDOM.render(<Col data={data} />, document.getElementById("div_main_board_free"));
}