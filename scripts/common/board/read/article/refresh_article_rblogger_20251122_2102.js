// R-Blogger 글 새로 크롤링 / 갱신
async function refresh_article_rblogger(orderID) {
    const request_data = new FormData();
    request_data.append('uuid', orderID);

    try {
        const res = await fetch("/blank/ajax_board/refresh_article_rblogger/", {
            method: "post",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data
        });

        if (!res.ok) {
            throw new Error(`refresh_article_rblogger HTTP error: ${res.status}`);
        }

        const refreshed_article = await res.json();
        console.log("[refresh_article_rblogger] refreshed_article =", refreshed_article);

        // ✅ 여기서 갱신된 기사 객체를 반환해서 get_read_article 쪽에서 data_article을 교체하게 함
        return refreshed_article;

    } catch (err) {
        console.error("[refresh_article_rblogger] error:", err);
        // 실패하더라도 기존 data_article을 그대로 쓰게 하기 위해 null 반환
        return null;
    }
}