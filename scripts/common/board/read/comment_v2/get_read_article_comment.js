// Fetch comments data from server and render the comment section
async function get_read_article_comment(orderID) {
    const request_data = new FormData();
    request_data.append('orderID', orderID);
    const response = await fetch("/blank/ajax_board/get_read_article_comment/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
    });
    data_comment = await response.json();
    set_comment();
}
