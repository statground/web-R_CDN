// 댓글/게시글 링크 생성 함수
function buildArticleUrlFromComment(d) {
    let url = "/community/";
    if (d.article_category_url) {
        url += d.article_category_url + "/";
    }
    if (d.article_category_url_sub) {
        url += d.article_category_url_sub + "/";
    }
    url += d.uuid_article + "/";
    return url;
}

async function get_myinfo_comment_content() {
    function stripHtml(str) {
        if (!str) return '';
        return str.replace(/<[^>]+>/g, '');
    }

    function CommentItem(props) {
        const d = props.data;
        const text = stripHtml(d.content);
        const href = buildArticleUrlFromComment(d);

        return (
            <div class="flex flex-col w-full py-2 border-b border-gray-100 last:border-b-0">
                <a href={href} class="group flex flex-col w-full">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-[11px] text-emerald-700">
                            {d.category_name || '게시판'}
                        </span>
                        <span class="text-xs text-gray-500 group-hover:text-blue-600">
                            {d.article_title}
                        </span>
                    </div>
                    <div class="text-sm text-gray-900 mb-1 group-hover:text-blue-600">
                        {text}
                    </div>
                    <div class="flex items-center gap-3 text-[11px] text-gray-500">
                        <span>{d.created_at}</span>
                    </div>
                </a>
            </div>
        );
    }

    function CommentList(props) {
        const listAll = Object.values(props.data || {});
        const [expanded, setExpanded] = React.useState(false);

        if (!listAll.length) {
            return (
                <div class="flex flex-col justify-center items-start w-full py-4 text-sm text-gray-500">
                    <p>작성한 댓글이 없습니다.</p>
                </div>
            );
        }

        const visibleList = expanded ? listAll : listAll.slice(0, 3);

        return (
            <div class="flex flex-col w-full">
                <div class="flex flex-col">
                    {visibleList.map(function (row, idx) {
                        return <CommentItem key={idx} data={row} />;
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

    const tempdata = await fetch("/account/ajax_get_myinfo_comment/")
        .then(function (res) { return res.json(); });

    ReactDOM.render(
        <CommentList data={tempdata.list} />,
        document.getElementById("div_tab_comment_content")
    );
}