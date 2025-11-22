async function get_read_article_comment(orderID_param) {
  const request_data = new FormData();
  request_data.append("orderID", orderID_param);

  data_comment = await fetch(
    "/blank/ajax_board/get_read_article_comment/",
    {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data,
    }
  )
    .then((res) => res.json())
    .then((res) => res);

  set_comment();
}
