async function get_read_article(mode) {
    const request_data = new FormData();
    request_data.append('orderID', orderID);

    try {
        const res = await fetch("/blank/ajax_board/get_read_article/", {
            method: "post",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data
        });

        if (!res.ok) {
            throw new Error(`get_read_article HTTP error: ${res.status}`);
        }

        // 서버에서 내려준 기사 데이터
        data_article = await res.json();
        console.log("[get_read_article] data_article =", data_article);

        // 1) init 모드면 화면에 먼저 뿌려줌
        if (mode === "init") {
            try {
                set_article();
            } catch (e) {
                console.error("[get_read_article] set_article() error:", e);
            }
        }

        // 2) 댓글 불러오기
        try {
            get_read_article_comment(orderID);
        } catch (e) {
            console.error("[get_read_article] get_read_article_comment() error:", e);
        }

        // 3) R-Blogger 글이면 백그라운드에서 새로고침
        if (
            data_article &&
            typeof data_article.category_url === "string" &&
            data_article.category_url.trim().toLowerCase() === "rblogger"
        ) {
            console.log("[get_read_article] rblogger article detected. refresh start. orderID =", orderID);
            refresh_article_rblogger(orderID); // 필요하면 await 붙여도 됨
        }

    } catch (err) {
        console.error("[get_read_article] fetch or JSON error:", err);
    }
}
