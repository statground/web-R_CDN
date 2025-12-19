// 최신 글
async function get_article_list(mode) {

    function TabButton({ active, onClick, children }) {
        const base = "px-3 py-1.5 text-xs font-bold rounded-full transition-all select-none";
        const activeCls = " bg-blue-600 text-white shadow-sm";
        const inActiveCls = " bg-gray-100 text-gray-700 hover:bg-gray-200";

        return (
            <button type="button" onClick={onClick} class={base + (active ? activeCls : inActiveCls)}>
                {children}
            </button>
        );
    }

    // 공통 컴포넌트 추출
    const ArticleList = ({ data, isMain = false, activeTab = "all", onChangeTab = null }) => {
        const article_list = Object.keys(data).map(key =>
            <Div_new_article_list key={key} data={data[key]} />
        );

        const listContent = (
            <div class="flex flex-col justify-center items-start w-full">
                {article_list}
                <div id={`div_article_list_${page_num + 1}`} class="w-full"></div>
            </div>
        );

        if (!isMain) return listContent;

        return (
            <div class="rounded-lg bg-white shadow-sm overflow-hidden w-full">
                <div class="flex flex-col px-8 pt-8 pb-4 space-y-3 md:px-4">
                    <Div_box_header title="최신 글" />
                    {/* Tabs (index 메인과 유사한 pill UI) */}
                    <div class="flex flex-wrap items-center gap-2">
                        <TabButton
                            active={activeTab === "all"}
                            onClick={() => onChangeTab && onChangeTab("all")}
                        >
                            전체보기
                        </TabButton>
                        <TabButton
                            active={activeTab === "free"}
                            onClick={() => onChangeTab && onChangeTab("free")}
                        >
                            자유게시판
                        </TabButton>
                        <TabButton
                            active={activeTab === "rblogger"}
                            onClick={() => onChangeTab && onChangeTab("rblogger")}
                        >
                            R-Blogger
                        </TabButton>
                        <TabButton
                            active={activeTab === "notebook"}
                            onClick={() => onChangeTab && onChangeTab("notebook")}
                        >
                            Web-R Notebook
                        </TabButton>
                    </div>
                </div>

                <div class="pb-6 md:pb-4">
                    {listContent}
                </div>
            </div>
        );
    }

    // 토글 ON
    toggle_page = true;

    // 검색 버튼 클릭 시 페이지 번호 초기화
    const request_data = new FormData();
    request_data.append('tag', url);
    request_data.append('tag_sub', sub);

    // 페이지 번호 및 검색어 처리
    if (mode === "init" || mode === "search") {
        page_num = 1;
        ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list"));

        if (mode === "search") {
            request_data.append('txt_search', document.getElementById("txt_search").value.trim());
        }
    } else {
        page_num += 1;
        ReactDOM.render(
            <Div_article_list_skeleton />,
            document.getElementById(`div_article_list_${page_num}`)
        );
    }

    request_data.append('page', page_num);

    // 데이터 가져오기
    const data = await fetch("/blank/ajax_board/get_article_list/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
    }).then(res => res.json());

    // 결과 렌더링
    article_counter = data["count"].cnt;

    // 탭 상태: url 기반
    const activeTab =
        (url === "rblogger" || url === "notebook") ? url : "all";

    const handleChangeTab = (tab) => {
        if (toggle_page) return;

        // all = 기존 free 동작(= free/rblogger/notebook 혼합)
        if (tab === "all" || tab === "free") {
            url = "free";
        } else {
            url = tab;
        }

        // 서브 카테고리는 탭 바꿀 때 초기화
        sub = "None";

        // 다시 초기 로딩
        get_article_list("init");
    };

    const targetId = mode === "init" || mode === "search"
        ? "div_article_list"
        : `div_article_list_${page_num}`;

    ReactDOM.render(
        <ArticleList
            data={data.list}
            isMain={mode === "init" || mode === "search"}
            activeTab={activeTab}
            onChangeTab={handleChangeTab}
        />,
        document.getElementById(targetId)
    );

    // 토글 OFF
    toggle_page = false;
}
