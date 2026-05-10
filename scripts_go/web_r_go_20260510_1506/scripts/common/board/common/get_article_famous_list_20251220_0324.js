async function get_article_famous_list() {
  const Div_article_list = ({ data: data2 }) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uCD5C\uC2E0 \uC778\uAE30 \uAE00" }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-start w-full space-y-2" }, Object.values(data2).map((article) => /* @__PURE__ */ React.createElement(Div_new_article_list, { key: article.id, data: article }))));
  const request_data = new FormData();
  const _tag = typeof url !== "undefined" && url === "all" ? "free" : url;
  request_data.append("tag", _tag);
  const data = await fetch("/blank/ajax_board/get_article_famous_list/", {
    method: "POST",
    headers: { "X-CSRFToken": getCookie("csrftoken") },
    body: request_data
  }).then((res) => res.json());
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_list, { data }), document.getElementById("div_article_famous_list"));
}
