async function get_read_article(mode) {
  const request_data = new FormData();
  request_data.append("orderID", orderID);
  try {
    const res = await fetch("/blank/ajax_board/get_read_article/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data
    });
    if (!res.ok) {
      throw new Error(`get_read_article HTTP error: ${res.status}`);
    }
    data_article = await res.json();
    if (mode === "init") {
      try {
        set_article();
      } catch (e) {
      }
    }
    try {
      get_read_article_comment(orderID);
    } catch (e) {
    }
    let normalizedCategory = null;
    if (data_article && typeof data_article.category_url === "string") {
      normalizedCategory = data_article.category_url.trim().toLowerCase();
    }
    if (normalizedCategory === "rblogger") {
      refresh_article_rblogger(orderID);
    }
  } catch (err) {
    console.error("[get_read_article] fetch or JSON error:", err);
  }
}
