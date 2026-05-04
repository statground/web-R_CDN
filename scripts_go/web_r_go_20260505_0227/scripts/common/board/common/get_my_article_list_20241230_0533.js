async function get_my_article_list() {
  const Div_not_login = () => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uB0B4\uAC00 \uC4F4 \uAE00" }), /* @__PURE__ */ React.createElement("span", null, "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4."));
  const Div_article_list = ({ data: data2 }) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uB0B4\uAC00 \uC4F4 \uAE00" }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-start w-full space-y-2" }, Object.values(data2).map((article) => /* @__PURE__ */ React.createElement(Div_new_article_list, { key: article.id, data: article }))));
  if (!gv_username) {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Div_not_login, null), document.getElementById("div_my_article_list"));
    return;
  }
  const request_data = new FormData();
  request_data.append("tag", url);
  const data = await fetch("/blank/ajax_board/get_my_article_list/", {
    method: "POST",
    headers: { "X-CSRFToken": getCookie("csrftoken") },
    body: request_data
  }).then((res) => res.json());
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_list, { data }), document.getElementById("div_my_article_list"));
}
