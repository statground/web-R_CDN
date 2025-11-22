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

        // 1) 기본 기사 데이터 먼저 세팅 (이걸로만 화면 렌더)
        data_article = await res.json();
        //console.log("[get_read_article] fetched data_article =", data_article);

        // 2) init 모드면 화면에 뿌리기
        if (mode === "init") {
            try {
                set_article();
            } catch (e) {
                //console.error("[get_read_article] set_article() error:", e);
            }
        }

        // 3) 댓글 불러오기
        try {
            get_read_article_comment(orderID);
        } catch (e) {
            //console.error("[get_read_article] get_read_article_comment() error:", e);
        }

        // 4) category_url 확인 후, rblogger면 백그라운드로 refresh 실행
        let normalizedCategory = null;
        if (data_article && typeof data_article.category_url === "string") {
            normalizedCategory = data_article.category_url.trim().toLowerCase();
            //console.log("[get_read_article] category_url(normalized) =", normalizedCategory);
        }

        if (normalizedCategory === "rblogger") {
            //console.log("[get_read_article] rblogger article detected. start refresh. orderID =", orderID);
            // 🔹 화면에는 기존 data_article을 그대로 쓰고,
            //    refresh는 서버 DB 갱신용으로만 사용
            refresh_article_rblogger(orderID);  // 굳이 await 안 해도 됨
        }

    } catch (err) {
        console.error("[get_read_article] fetch or JSON error:", err);
    }
}
