function Div_page_header(props) {
    return (
        <div className="flex flex-row w-full justify-start items-end text-start mb-8">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
                <span className="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
            </h1>
            {
                props.subtitle
                ?   <p className="text-lg font-normal text-gray-500 sm:text-md pb-2">{props.subtitle}</p>
                :   null
            }
        </div>
    );
}

function getCookieValue(name) {
    if (typeof document === "undefined" || !document.cookie) {
        return "";
    }

    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }

    return "";
}

function buildPostInit(body) {
    const csrfToken = getCookieValue("csrftoken");
    const headers = {};

    if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
    }

    return {
        method: "post",
        headers,
        body,
    };
}

async function copyTextSafely(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (e) {
        // fall through to textarea fallback
    }

    try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "readonly");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        return ok;
    } catch (e) {
        return false;
    }
}

function set_main() {
    const api = (typeof window !== "undefined" && window.WEBR_NOTEBOOK_API) ? window.WEBR_NOTEBOOK_API : null;

    if (!api || !api.list || !api.toggle_favoriate || !api.delete) {
        ReactDOM.render(
            <div className="max-w-screen-sm mx-auto px-4 py-10 text-sm text-rose-600">
                <div className="font-semibold mb-2">설정 오류</div>
                <div className="text-slate-600 text-xs leading-5">
                    Notebook 목록 API URL이 주입되지 않았습니다.<br />
                    index.html에서 <code>window.WEBR_NOTEBOOK_API</code>를 먼저 선언한 뒤 set_main.js를 로드해야 합니다.
                </div>
            </div>,
            document.getElementById("div_main")
        );
        return;
    }

    function pad2(value) {
        return String(value).padStart(2, "0");
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) {
            return String(dateValue);
        }

        return [
            date.getFullYear(),
            "-",
            pad2(date.getMonth() + 1),
            "-",
            pad2(date.getDate()),
            " ",
            pad2(date.getHours()),
            ":",
            pad2(date.getMinutes()),
        ].join("");
    }

    function FilterChip(props) {
        return (
            <button
                onClick={props.onClick}
                className={
                    "px-2.5 py-1 rounded-full border text-[11px] transition " +
                    (props.active
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-300 text-slate-600 hover:border-slate-400")
                }
            >
                {props.label}
            </button>
        );
    }

    function NotebookSkeletonRow() {
        return (
            <div className="flex flex-col w-full py-3 border-b border-slate-100 px-2">
                <div className="flex items-start gap-2 w-full">
                    <div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse mt-1"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-44 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-36 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
            </div>
        );
    }

    function NotebookRow(props) {
        const notebook = props.nb;
        const badgeClass = notebook.shareMode === 1
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : notebook.shareMode === 2
                ? "bg-sky-50 text-sky-700 border-sky-200"
                : "bg-slate-100 text-slate-700 border-slate-300";

        const badgeLabel = notebook.shareMode === 1
            ? "커뮤니티 공개"
            : notebook.shareMode === 2
                ? "링크 공개"
                : "비공개";

        return (
            <div className="flex flex-col w-full py-3 border-b border-slate-100 px-2 hover:bg-slate-50">
                <div className="flex items-start gap-2 w-full">
                    <button
                        className={
                            "mt-0.5 text-sm " +
                            (notebook.favorite ? "text-yellow-400" : "text-slate-300 hover:text-slate-500")
                        }
                        onClick={() => props.onToggleFavorite(notebook.id)}
                        title="즐겨찾기"
                    >
                        ★
                    </button>

                    <div className="flex-1 min-w-0">
                        <a
                            href={`/webr/notebook/run/${notebook.id}/`}
                            className="text-sm text-slate-900 font-medium hover:underline break-words"
                        >
                            {notebook.title}
                        </a>

                        {
                            notebook.description
                            ?   <div
                                    className="mt-1 text-[11px] text-slate-600 leading-4"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}
                                >
                                    {notebook.description}
                                </div>
                            :   null
                        }

                        <div className="mt-2 flex flex-row flex-nowrap gap-4 text-[11px] text-slate-600 whitespace-nowrap overflow-x-auto">
                            <span>생성일자: {notebook.createdAt}</span>
                            {
                                notebook.updatedAt
                                ?   <span>수정일자: {notebook.updatedAt}</span>
                                :   null
                            }
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={"inline-flex items-center px-2 py-0.5 text-[10px] rounded-full border " + badgeClass}>
                        {badgeLabel}
                    </span>

                    {
                        notebook.shareMode !== 0
                        ?   <button
                                className="text-[10px] px-2 py-0.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 shrink-0"
                                onClick={() => props.onCopyUrl(notebook.id)}
                            >
                                {props.copied ? "복사됨" : "URL 복사"}
                            </button>
                        :   null
                    }

                    <button
                        className="text-[10px] px-2 py-0.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 shrink-0"
                        onClick={() => props.onDelete(notebook.id)}
                        title="삭제"
                    >
                        삭제
                    </button>
                </div>
            </div>
        );
    }

    function NotebookListPage() {
        const PAGE_SIZE = 20;

        const [notebooks, setNotebooks] = React.useState([]);
        const [myLoading, setMyLoading] = React.useState(true);
        const [isLoadingMore, setIsLoadingMore] = React.useState(false);
        const [hasMore, setHasMore] = React.useState(true);
        const [myQuery, setMyQuery] = React.useState("");
        const [visibilityFilter, setVisibilityFilter] = React.useState("all");
        const [copiedId, setCopiedId] = React.useState(null);
        const [errorMsg, setErrorMsg] = React.useState("");
        const reqSeqRef = React.useRef(0);

        const handleCreateNotebook = () => {
            window.location.href = "/webr/notebook/new/";
        };

        async function fetchNotebookList(options) {
            const reqId = reqSeqRef.current + 1;
            reqSeqRef.current = reqId;

            if (!options.append) {
                setMyLoading(true);
                setErrorMsg("");
            } else {
                setIsLoadingMore(true);
            }

            try {
                const form = new FormData();
                form.append("q", myQuery);

                const visibilityValue = visibilityFilter === "private"
                    ? "private"
                    : visibilityFilter === "all"
                        ? "all"
                        : "public";

                form.append("visibility", visibilityValue);
                if (visibilityFilter === "community") {
                    form.append("share", "1");
                }
                if (visibilityFilter === "link") {
                    form.append("share", "2");
                }
                form.append("limit", String(PAGE_SIZE));
                form.append("offset", String(options.nextOffset));

                const response = await fetch(api.list, buildPostInit(form));
                if (!response.ok) {
                    throw new Error("server_error");
                }

                const data = await response.json();
                if (reqId !== reqSeqRef.current) {
                    return;
                }

                if (data && data.auth === false) {
                    setNotebooks([]);
                    setHasMore(false);
                    setErrorMsg("로그인이 필요합니다.");
                    setMyLoading(false);
                    setIsLoadingMore(false);
                    return;
                }

                const items = (data && Array.isArray(data.items)) ? data.items : [];
                const mapped = items.map((row) => {
                    const shareMode = (row && row.share !== undefined && row.share !== null) ? parseInt(row.share, 10) : 0;
                    return {
                        id: row.uuid || "",
                        uuidShare: row.uuid_share || "",
                        title: row.title || "Untitled Web-R Notebook",
                        description: row.description ? String(row.description).trim() : "",
                        createdAt: formatDate(row.created_at),
                        updatedAt: row.updated_at ? formatDate(row.updated_at) : null,
                        shareMode: (shareMode === 1 || shareMode === 2) ? shareMode : 0,
                        favorite: row.favoriate === 1 || row.favoriate === true,
                    };
                });

                if (!options.append) {
                    setNotebooks(mapped);
                } else {
                    setNotebooks((prev) => prev.concat(mapped));
                }

                setHasMore(mapped.length === PAGE_SIZE);
                setMyLoading(false);
                setIsLoadingMore(false);
            } catch (e) {
                if (reqId !== reqSeqRef.current) {
                    return;
                }

                if (!options.append) {
                    setNotebooks([]);
                    setHasMore(false);
                    setErrorMsg("목록을 불러오지 못했습니다.");
                    setMyLoading(false);
                }
                setIsLoadingMore(false);
            }
        }

        React.useEffect(() => {
            fetchNotebookList({ nextOffset: 0, append: false });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        React.useEffect(() => {
            const timer = setTimeout(() => {
                fetchNotebookList({ nextOffset: 0, append: false });
                window.scrollTo({ top: 0, behavior: "auto" });
            }, 250);

            return () => clearTimeout(timer);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [myQuery, visibilityFilter]);

        React.useEffect(() => {
            function handleScroll() {
                if (myLoading || isLoadingMore || !hasMore) {
                    return;
                }

                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
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

        const toggleFavorite = async (id) => {
            try {
                const form = new FormData();
                form.append("notebook_uuid", id);

                const response = await fetch(api.toggle_favoriate, buildPostInit(form));
                if (!response.ok) {
                    throw new Error("server_error");
                }

                const data = await response.json();
                if (!data.ok) {
                    if (data.auth === false) {
                        alert("로그인이 필요합니다.");
                    } else {
                        alert("즐겨찾기 변경에 실패했습니다.");
                    }
                    return;
                }

                fetchNotebookList({ nextOffset: 0, append: false });
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (e) {
                alert("즐겨찾기 변경에 실패했습니다. (네트워크/서버 오류)");
            }
        };

        const copyPublicUrl = async (id) => {
            const target = notebooks.find((item) => item.id === id);
            if (!target || !target.uuidShare) {
                alert("공개 URL을 찾을 수 없습니다.");
                return;
            }

            const origin = window.location && window.location.origin ? window.location.origin : "";
            const notebookUrl = `${origin}/webr/notebook/view/${target.uuidShare}/`;
            const ok = await copyTextSafely(notebookUrl);

            if (ok) {
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 1500);
            } else {
                window.prompt("아래 URL을 복사해서 사용하세요.", notebookUrl);
            }
        };

        const deleteNotebook = async (id) => {
            const ok = window.confirm("이 노트북을 삭제할까요? (복구 불가)");
            if (!ok) {
                return;
            }

            try {
                const form = new FormData();
                form.append("notebook_uuid", id);

                const response = await fetch(api.delete, buildPostInit(form));
                if (!response.ok) {
                    throw new Error("server_error");
                }

                const data = await response.json();
                if (!data.ok) {
                    if (data.auth === false) {
                        alert("로그인이 필요합니다.");
                    } else {
                        alert("삭제에 실패했습니다.");
                    }
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
                <Div_page_header title="Web-R Notebook" />

                <div id="div_notebook_list" className="flex flex-col justify-center items-center w-full mt-4">
                    <div id="div_notebook_main" className="w-full">
                        <div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-6 md:p-4">
                            <div className="flex flex-row justify-between items-center w-full gap-3">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-semibold text-slate-900">내 노트북</h2>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                                        {notebooks.length}개
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCreateNotebook}
                                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-full text-xs px-4 py-1.5 text-center hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
                                >
                                    새 Notebook 만들기
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full">
                                <div className="relative flex-1 sm:flex-none">
                                    <input
                                        type="text"
                                        className="bg-white border border-slate-300 rounded-full px-3 py-1.5 text-xs text-slate-900 w-full sm:w-56 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        placeholder="내 노트북 제목 검색…"
                                        value={myQuery}
                                        onChange={(event) => setMyQuery(event.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-1 text-[11px] flex-wrap">
                                    <FilterChip label="전체" active={visibilityFilter === "all"} onClick={() => setVisibilityFilter("all")} />
                                    <FilterChip label="커뮤니티 공개" active={visibilityFilter === "community"} onClick={() => setVisibilityFilter("community")} />
                                    <FilterChip label="링크 공개" active={visibilityFilter === "link"} onClick={() => setVisibilityFilter("link")} />
                                    <FilterChip label="비공개" active={visibilityFilter === "private"} onClick={() => setVisibilityFilter("private")} />
                                </div>
                            </div>

                            {
                                !myLoading && errorMsg
                                ?   <div className="w-full py-8 text-center text-slate-500 text-xs">{errorMsg}</div>
                                :   null
                            }

                            {
                                !errorMsg
                                ?   <div className="w-full text-xs">
                                        {
                                            myLoading
                                            ?   Array.from({ length: 6 }).map((_, index) => <NotebookSkeletonRow key={index} />)
                                            :   notebooks.map((notebook) => (
                                                    <NotebookRow
                                                        key={notebook.id}
                                                        nb={notebook}
                                                        onToggleFavorite={toggleFavorite}
                                                        onCopyUrl={copyPublicUrl}
                                                        copied={copiedId === notebook.id}
                                                        onDelete={deleteNotebook}
                                                    />
                                                ))
                                        }

                                        {
                                            !myLoading && notebooks.length === 0
                                            ?   <div className="py-8 text-center text-slate-500 text-xs">조건에 맞는 노트북이 없습니다.</div>
                                            :   null
                                        }
                                    </div>
                                :   null
                            }

                            {
                                !myLoading && !errorMsg && hasMore
                                ?   <div className="pt-1 text-center text-[11px] text-slate-500 w-full">스크롤을 내리면 더 많은 노트북이 로드됩니다…</div>
                                :   null
                            }
                            {
                                isLoadingMore
                                ?   <div className="pt-1 text-center text-[11px] text-slate-500 w-full">더 불러오는 중…</div>
                                :   null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    ReactDOM.render(<NotebookListPage />, document.getElementById("div_main"));
}
