// 게시글 링크 생성 함수
function buildArticleUrlFromArticle(d) {
    // 기본 경로는 community 기준으로 가정
    let url = "/community/";
    if (d.category_url) {
        url += d.category_url + "/";
    }
    if (d.category_url_sub) {
        url += d.category_url_sub + "/";
    }
    // uuid 기준으로 상세 페이지 이동
    url += d.uuid + "/";
    return url;
}

async function get_myinfo_article_content() {
    function ArticleItem(props) {
        const d = props.data;
        const href = buildArticleUrlFromArticle(d);

        return (
            <div class="flex flex-col w-full py-2 border-b border-gray-100 last:border-b-0">
                <a href={href} class="group flex flex-col w-full">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-[11px] text-blue-700">
                            {d.category || '게시판'}
                        </span>
                        <span class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                            {d.title}
                        </span>
                    </div>
                    <div class="flex items-center gap-3 text-[11px] text-gray-500">
                        <span>{d.created_at}</span>
                        <span>조회 {d.cnt_read}</span>
                        <span>댓글 {d.cnt_comment}</span>
                    </div>
                </a>
            </div>
        );
    }

    function ArticleList(props) {
        const listAll = Object.values(props.data || {});
        const [expanded, setExpanded] = React.useState(false);

        if (!listAll.length) {
            return (
                <div class="flex flex-col justify-center items-start w-full py-4 text-sm text-gray-500">
                    <p>작성한 글이 없습니다.</p>
                </div>
            );
        }

        const visibleList = expanded ? listAll : listAll.slice(0, 3);

        return (
            <div class="flex flex-col w-full">
                <div class="flex flex-col">
                    {visibleList.map(function (row, idx) {
                        return <ArticleItem key={idx} data={row} />;
                    })}
                </div>
                {listAll.length > 3 && (
                    <div class="flex justify-center mt-3">
                        <button
                            type="button"
                            class="px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                            onClick={function () { setExpanded(!expanded); }}
                        >
                            {expanded ? '접기' : '펼치기'}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    const tempdata = await fetch("/account/ajax_get_myinfo_article/")
        .then(function (res) { return res.json(); });

    ReactDOM.render(
        <ArticleList data={tempdata.list} />,
        document.getElementById("div_tab_article_content")
    );
}
