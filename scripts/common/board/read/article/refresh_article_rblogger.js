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

        // 필요하면 여기서 data_article 갱신 + 다시 그리기
        // data_article = refreshed_article;
        // set_article();

    } catch (err) {
        console.error("[refresh_article_rblogger] error:", err);
    }
}