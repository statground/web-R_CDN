// 최신 글
async function get_article_list(mode) {
    // 공통 컴포넌트 추출
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