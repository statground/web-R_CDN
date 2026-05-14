async function click_btn_delete() {
  if (confirm("\uC815\uB9D0\uB85C \uC0AD\uC81C\uD560\uAE4C\uC694?")) {
    const request_data = new FormData();
    request_data.append("uuid", orderID);
    const data = await fetch("/blank/ajax_board/delete_article/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data
    }).then((res) => {
      return res.json();
    }).then((res) => {
      return res;
    });
    location.href = init_url;
  }
}
