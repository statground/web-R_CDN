// ===== PATCH 2025-12-20: Tabs (all/free/rblogger/notebook) =====
// - Backend now supports tag='all' for 전체보기.
// - 'free' means 자유게시판 only.
// - handleChangeTab(tab) updates global url and reloads the list.
// ===============================================================

function handleChangeTab(tab) {
    if (tab === 'all') url = 'all';
    else if (tab === 'free') url = 'free';
    else if (tab === 'rblogger') url = 'rblogger';
    else if (tab === 'notebook') url = 'notebook';
    else url = 'all';

    // 탭 전환 시 목록을 처음부터 다시 로드
    page_num = 1;
    toggle_page = false;
    get_article_list("search");
}

// (호환) 예전엔 url='free'가 전체보기 의미였던 케이스가 있어서, 루트에서 넘어온 값이 'free_all' 같은 경우를 안전하게 처리
if (typeof url !== 'undefined') {
    if (url === 'free_all') url = 'all';
}
// ===== PATCH END =====

// 최신 글
async function get_article_list(mode) {
    // 공통 컴포넌트 추출
    
// ===== UI: Board Tabs (index-style pills) =====
const TabButton = ({ active, onClick, children }) => {
    const base = "px-3 py-1.5 text-xs font-bold rounded-full transition-all select-none";
    const activeCls = " bg-blue-600 text-white shadow-sm";
    const inActiveCls = " bg-gray-100 text-gray-700 hover:bg-gray-200";
    return (
        <button type="button" onClick={onClick} class={base + (active ? activeCls : inActiveCls)}>
            {children}
        </button>
    );
};

const DivBoardTabs = () => {
    const activeTab = (url === "all" || url === "free" || url === "rblogger" || url === "notebook") ? url : "all";
    return (
        <div class="flex flex-wrap items-center gap-2 w-full">
            <TabButton active={activeTab === "all"} onClick={() => handleChangeTab("all")}>전체보기</TabButton>
            <TabButton active={activeTab === "free"} onClick={() => handleChangeTab("free")}>자유게시판</TabButton>
            <TabButton active={activeTab === "rblogger"} onClick={() => handleChangeTab("rblogger")}>R-Blogger</TabButton>
            <TabButton active={activeTab === "notebook"} onClick={() => handleChangeTab("notebook")}>Web-R Notebook</TabButton>
        </div>
    );
};
// ===== UI END =====

const ArticleList = ({ data, isMain = false }) => {
        const article_list = Object.keys(data).map(key => 
            <Div_new_article_list key={key} data={data[key]} />
        );

        const listContent = (
            <div class="flex flex-col justify-center items-start w-full space-y-2">
                {article_list}
                <div id={`div_article_list_${page_num + 1}`} class="w-full"></div>
            </div>
        );

        if (!isMain) return listContent;

        return (
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="최신 글" />
                {isMain ? <DivBoardTabs /> : null}
                {listContent}
            </div>
        );
    }

    // 토글 ON
    toggle_page = true;

    // FormData 설정
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
    const targetId = mode === "init" || mode === "search" 
        ? "div_article_list"
        : `div_article_list_${page_num}`;

    ReactDOM.render(
        <ArticleList 
            data={data.list} 
            isMain={mode === "init" || mode === "search"}
        />,
        document.getElementById(targetId)
    );

    // 토글 OFF
    toggle_page = false;
}