function set_main() {
	let header_subtitle = "Web-R Notebook";

	/********************************************************************
	 * 0) API URL 주입 체크 (중요)
	 * - 이 JS는 jsdelivr(CDN)에서 내려오므로 Django 템플릿 태그를 사용할 수 없음.
	 * - HTML 템플릿에서 window.WEBR_NOTEBOOK_API 로 URL을 주입해야 한다.
	 ********************************************************************/
	const API = (window && window.WEBR_NOTEBOOK_API) ? window.WEBR_NOTEBOOK_API : null;

	if (!API || !API.list || !API.toggle_favoriate || !API.delete) {
		console.error("[Web-R Notebook] WEBR_NOTEBOOK_API is missing.", API);
		ReactDOM.render(
			<div className="max-w-screen-sm mx-auto px-4 py-10 text-sm text-rose-600">
				<div className="font-semibold mb-2">설정 오류</div>
				<div className="text-slate-600 text-xs leading-5">
					Notebook 목록 API URL이 주입되지 않았습니다.<br />
					index.html에서 <code>window.WEBR_NOTEBOOK_API</code>를 먼저 선언한 후 set_main.js를 로드해야 합니다.
				</div>
			</div>,
			document.getElementById("div_main")
		);
		return;
	}

	/********************************************************************
	 * 1) 유틸 함수
	 ********************************************************************/
	const pad2 = (n) => String(n).padStart(2, "0");

	const formatDate = (dt) => {
		if (!dt) return "-";
		const d = new Date(dt);
		if (Number.isNaN(d.getTime())) return String(dt);
		return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
	};

	async function safeCopyToClipboard(text) {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text);
				return true;
			}
			return false;
		} catch (e) {
			return false;
		}
	}

	/********************************************************************
	 * 2) 컴포넌트
	 ********************************************************************/
	function FilterChip({ label, active, onClick }) {
		return (
			<button
				onClick={onClick}
				className={
					"px-2.5 py-1 rounded-full border text-[11px] transition " +
					(active
						? "border-sky-500 bg-sky-50 text-sky-700"
						: "border-slate-300 text-slate-600 hover:border-slate-400")
				}
			>
				{label}
			</button>
		);
	}

	function SkeletonRow() {
		return (
			<div className="flex flex-col w-full py-3 border-b border-slate-100 px-2">
				<div className="flex items-start gap-2 w-full">
					<div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse mt-1"></div>
					<div className="flex-1 space-y-2">
						<div className="h-3 w-44 bg-slate-200 rounded animate-pulse"></div>
						<div className="h-3 w-36 bg-slate-200 rounded animate-pulse"></div>
					</div>
				</div>

				{/* 버튼 영역: 항상 아래에 고정 */}
				<div className="flex items-center gap-2 mt-3">
					<div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
					<div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
					<div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
				</div>
			</div>
		);
	}

	/**
	 * Notebook Row
	 * - 별 클릭: favoriate 토글(서버 반영)
	 * - 공개 URL 복사: uuid_share 사용
	 * - 삭제: active=0 (서버 반영)
	 *
	 * 표시:
	 * - 생성일자
	 * - 수정일자(값 있을 때만)
	 */
	function NotebookRow({ nb, onToggleFavorite, onCopyUrl, copied, onDelete }) {
		const badgeClass =
			nb.shareMode === 1
				? "bg-emerald-50 text-emerald-700 border-emerald-200"
				: nb.shareMode === 2
					? "bg-sky-50 text-sky-700 border-sky-200"
					: "bg-slate-100 text-slate-700 border-slate-300";

		const badgeLabel =
			nb.shareMode === 1
				? "커뮤니티 공개"
				: nb.shareMode === 2
					? "링크 공개"
					: "비공개";

		return (
			<div className="flex flex-col w-full py-3 border-b border-slate-100 px-2 hover:bg-slate-50">
				{/* 상단: 제목/설명/날짜 */}
				<div className="flex items-start gap-2 w-full">
					<button
						className={
							"mt-0.5 text-sm " +
							(nb.favorite
								? "text-yellow-400"
								: "text-slate-300 hover:text-slate-500")
						}
						onClick={() => onToggleFavorite(nb.id)}
						title="즐겨찾기"
					>
						★
					</button>

					<div className="flex-1 min-w-0">
						<a
							href={`/webr/notebook/run/${nb.id}/`}
							className="text-sm text-slate-900 font-medium hover:underline break-words"
						>
							{nb.title}
						</a>

						{/* description (있을 때만) */}
						{!!nb.description && (
							<div
								className="mt-1 text-[11px] text-slate-600 leading-4"
								style={{
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
								}}
							>
								{nb.description}
							</div>
						)}

						{/* 날짜: 항상 가로 유지(줄바꿈 금지), 좁으면 가로 스크롤 */}
						<div className="mt-2 flex flex-row flex-nowrap gap-4 text-[11px] text-slate-600 whitespace-nowrap overflow-x-auto">
							<span>생성일자: {nb.createdAt}</span>

							{nb.updatedAt && (
								<span>수정일자: {nb.updatedAt}</span>
							)}
						</div>
					</div>
				</div>

				{/* 하단: 버튼은 PC/모바일 모두 항상 아래 */}
				<div className="flex items-center gap-2 mt-3">
					<span
						className={"inline-flex items-center px-2 py-0.5 text-[10px] rounded-full border " + badgeClass}
					>
						{badgeLabel}
					</span>

					{nb.shareMode !== 0 && (
						<button
							className="text-[10px] px-2 py-0.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 shrink-0"
							onClick={() => onCopyUrl(nb.id)}
						>
							{copied ? "복사됨" : "URL 복사"}
						</button>
					)}

					<button
						className="text-[10px] px-2 py-0.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 shrink-0"
						onClick={() => onDelete(nb.id)}
						title="삭제"
					>
						삭제
					</button>
				</div>
			</div>
		);
	}

	/********************************************************************
	 * 3) 메인 (서버 정렬/검색 기반 + offset 페이징)
	 ********************************************************************/
	function Div_main() {
		const PAGE_SIZE = 20;

		const [notebooks, setNotebooks] = React.useState([]);
		const [myLoading, setMyLoading] = React.useState(true);
		const [isLoadingMore, setIsLoadingMore] = React.useState(false);
		const [hasMore, setHasMore] = React.useState(true);

		// 서버에 넘길 필터
		const [myQuery, setMyQuery] = React.useState("");
		const [visibilityFilter, setVisibilityFilter] = React.useState("all");

		const [copiedId, setCopiedId] = React.useState(null);
		const [errorMsg, setErrorMsg] = React.useState("");

		// 요청 경쟁 방지
		const reqSeqRef = React.useRef(0);

		const handleCreateNotebook = () => {
			window.location.href = `/webr/notebook/new/`;
		};

		/**
		 * 서버에서 목록 로드
		 * - append=false: 첫 페이지/필터 변경 시 재로딩
		 * - append=true : 무한 스크롤 로딩(다음 offset)
		 */
		async function fetchNotebookList({ nextOffset, append }) {
			const reqId = ++reqSeqRef.current;

			if (!append) {
				setMyLoading(true);
				setErrorMsg("");
			} else {
				setIsLoadingMore(true);
			}

			try {
				const form = new FormData();
				form.append("q", myQuery);
				// visibilityFilter: all / community / link / private
				const _vis = (visibilityFilter === "private") ? "private" : (visibilityFilter === "all") ? "all" : "public";
				form.append("visibility", _vis);

				// 서버에서 share 모드 필터를 지원하면 share=1/2로 구분 (미지원이면 무시됨)
				if (visibilityFilter === "community") form.append("share", "1");
				if (visibilityFilter === "link") form.append("share", "2");
				form.append("limit", String(PAGE_SIZE));
				form.append("offset", String(nextOffset));

				const res = await fetch(API.list, {
					method: "POST",
					body: form,
				});

				if (!res.ok) throw new Error("server_error");

				const data = await res.json();

				// 최신 요청만 반영
				if (reqId !== reqSeqRef.current) return;

				// 로그인 필요
				if (data && data.auth === false) {
					setNotebooks([]);
					setHasMore(false);
					setErrorMsg("로그인이 필요합니다.");
					setMyLoading(false);
					setIsLoadingMore(false);
					return;
				}

				const items = (data && Array.isArray(data.items)) ? data.items : [];

				// DB row → UI object
				const mapped = items.map((r, idx) => {
					const uuid = r.uuid || "";
					const uuidShare = r.uuid_share || "";
					const shareMode = (r && r.share !== undefined && r.share !== null) ? parseInt(r.share, 10) : 0;
					const isShared = (shareMode === 1 || shareMode === 2);

					const createdRaw = r.created_at;
					const updatedRaw = r.updated_at;

					return {
						id: uuid,
						uuidShare: uuidShare,
						title: r.title || "Untitled Web-R Notebook",

						description: (r.description || "").trim ? (r.description || "").trim() : (r.description || ""),

						createdAt: formatDate(createdRaw),
						createdAtRaw: createdRaw,

						updatedAt: updatedRaw ? formatDate(updatedRaw) : null,
						updatedAtRaw: updatedRaw || null,

						shareMode: (shareMode === 1 || shareMode === 2) ? shareMode : 0,

						visibility: isShared ? "public" : "private",

						// favoriate (오타 유지)
						favorite: (r.favoriate === 1 || r.favoriate === true),
						favoriteAtRaw: r.favoriate_at || null,

						_idx: (nextOffset + idx),
					};
				});

				if (!append) {
					setNotebooks(mapped);
				} else {
					setNotebooks((prev) => prev.concat(mapped));
				}

				// PAGE_SIZE보다 적게 오면 더 없음
				setHasMore(mapped.length === PAGE_SIZE);

				setMyLoading(false);
				setIsLoadingMore(false);

			} catch (e) {
				if (reqId !== reqSeqRef.current) return;

				if (!append) {
					setNotebooks([]);
					setHasMore(false);
					setErrorMsg("목록을 불러오지 못했습니다.");
					setMyLoading(false);
				}
				setIsLoadingMore(false);
			}
		}

		// 최초 로드
		React.useEffect(() => {
			fetchNotebookList({ nextOffset: 0, append: false });
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		// 검색/필터 변경 → 서버 재조회(디바운스)
		React.useEffect(() => {
			const t = setTimeout(() => {
				fetchNotebookList({ nextOffset: 0, append: false });
				// UX: 필터 변경 시 상단으로 이동
				window.scrollTo({ top: 0, behavior: "auto" });
			}, 250);

			return () => clearTimeout(t);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [myQuery, visibilityFilter]);

		// 무한 스크롤
		React.useEffect(() => {
			function handleScroll() {
				if (myLoading || isLoadingMore) return;
				if (!hasMore) return;

				const scrollTop =
					window.pageYOffset || document.documentElement.scrollTop;
				const clientHeight = window.innerHeight;
				const scrollHeight = document.documentElement.scrollHeight;

				if (scrollHeight - (scrollTop + clientHeight) < 200) {
					fetchNotebookList({ nextOffset: notebooks.length, append: true });
				}
			}

			window.addEventListener("scroll", handleScroll);
			return () => window.removeEventListener("scroll", handleScroll);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [myLoading, isLoadingMore, hasMore, notebooks.length, myQuery, visibilityFilter]);

		// favoriate 토글 → 서버 반영 후 1페이지 재조회(서버 정렬 기준 유지)
		const toggleFavorite = async (id) => {
			try {
				const form = new FormData();
				form.append("notebook_uuid", id);

				const res = await fetch(API.toggle_favoriate, {
					method: "POST",
					body: form,
				});

				if (!res.ok) throw new Error("server_error");
				const data = await res.json();

				if (!data.ok) {
					if (data.auth === false) alert("로그인이 필요합니다.");
					else alert("즐겨찾기 변경에 실패했습니다.");
					return;
				}

				fetchNotebookList({ nextOffset: 0, append: false });
				window.scrollTo({ top: 0, behavior: "smooth" });

			} catch (e) {
				alert("즐겨찾기 변경에 실패했습니다. (네트워크/서버 오류)");
			}
		};

		// 공개 URL 복사
		const copyPublicUrl = async (id) => {
			const target = notebooks.find((x) => x.id === id);
			if (!target) return;

			const origin =
				window.location && window.location.origin
					? window.location.origin
					: "";
			const url = `${origin}/webr/notebook/view/${target.uuidShare}/`;

			const ok = await safeCopyToClipboard(url);
			if (ok) {
				setCopiedId(id);
				setTimeout(() => setCopiedId(null), 1500);
			} else {
				window.prompt("아래 URL을 복사해서 사용하세요.", url);
			}
		};

		// 삭제 → 서버 반영 후 1페이지 재조회
		const deleteNotebook = async (id) => {
			const ok = window.confirm("이 노트북을 삭제할까요? (복구 불가)");
			if (!ok) return;

			try {
				const form = new FormData();
				form.append("notebook_uuid", id);

				const res = await fetch(API.delete, {
					method: "POST",
					body: form,
				});

				if (!res.ok) throw new Error("server_error");

				const data = await res.json();

				if (!data.ok) {
					if (data.auth === false) alert("로그인이 필요합니다.");
					else alert("삭제에 실패했습니다.");
					return;
				}

				fetchNotebookList({ nextOffset: 0, append: false });
				window.scrollTo({ top: 0, behavior: "smooth" });

			} catch (e) {
				alert("삭제에 실패했습니다. (네트워크/서버 오류)");
			}
		};

		return (
			<div className="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={header_subtitle} />

				<div id="div_notebook_list" className="flex flex-col justify-center items-center w-full mt-4">
					<div id="div_notebook_main" className="w-full">
						<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-6 md:p-4">

							<div className="flex flex-row justify-between items-center w-full">
								<div className="flex items-center gap-2">
									<h2 className="text-sm font-semibold text-slate-900">
										내 노트북
									</h2>
									<span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
										{notebooks.length}개
									</span>
								</div>

								<button
									type="button"
									onClick={handleCreateNotebook}
									className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
											font-medium rounded-full text-xs px-4 py-1.5 text-center
											hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
								>
									새 Notebook 만들기
								</button>
							</div>

							{/* 검색 / 공개 여부 필터 (서버로 전송됨) */}
							<div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
								<div className="relative flex-1 sm:flex-none">
									<input
										type="text"
										className="bg-white border border-slate-300 rounded-full px-3 py-1.5 text-xs text-slate-900 w-full sm:w-56 focus:outline-none focus:ring-1 focus:ring-sky-500"
										placeholder="내 노트북 제목 검색…"
										value={myQuery}
										onChange={(e) => setMyQuery(e.target.value)}
									/>
								</div>

								<div className="flex items-center gap-1 text-[11px]">
									<FilterChip
										label="전체"
										active={visibilityFilter === "all"}
										onClick={() => setVisibilityFilter("all")}
									/>
									<FilterChip
										label="커뮤니티 공개"
										active={visibilityFilter === "community"}
										onClick={() => setVisibilityFilter("community")}
									/>
									<FilterChip
										label="링크 공개"
										active={visibilityFilter === "link"}
										onClick={() => setVisibilityFilter("link")}
									/>
									<FilterChip
										label="비공개"
										active={visibilityFilter === "private"}
										onClick={() => setVisibilityFilter("private")}
									/>
								</div>
							</div>

							{/* 에러 메시지 */}
							{!myLoading && errorMsg && (
								<div className="w-full py-8 text-center text-slate-500 text-xs">
									{errorMsg}
								</div>
							)}

							{/* 리스트 */}
							{!errorMsg && (
								<div className="w-full text-xs">
									{myLoading ? (
										Array.from({ length: 6 }).map((_, idx) => <SkeletonRow key={idx} />)
									) : (
										notebooks.map((nb) => (
											<NotebookRow
												key={nb.id}
												nb={nb}
												onToggleFavorite={toggleFavorite}
												onCopyUrl={copyPublicUrl}
												copied={copiedId === nb.id}
												onDelete={deleteNotebook}
											/>
										))
									)}

									{!myLoading && notebooks.length === 0 && (
										<div className="py-8 text-center text-slate-500 text-xs">
											조건에 맞는 노트북이 없습니다.
										</div>
									)}
								</div>
							)}

							{!myLoading && !errorMsg && hasMore && (
								<div className="pt-1 text-center text-[11px] text-slate-500 w-full">
									스크롤을 내리면 더 많은 노트북이 로드됩니다…
								</div>
							)}
							{isLoadingMore && (
								<div className="pt-1 text-center text-[11px] text-slate-500 w-full">
									더 불러오는 중…
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"));
}
