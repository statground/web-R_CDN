async function get_new_comment_list() {
  const Div_comment_list = ({ data: data2 }) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement(Div_box_header, { title: "\uCD5C\uC2E0 \uB313\uAE00" }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-start w-full space-y-2" }, Object.values(data2).map((comment) => /* @__PURE__ */ React.createElement(Div_new_comment, { key: comment.id, data: comment }))));
  const request_data = new FormData();
  request_data.append("tag", url);
  const data = await fetch("/blank/ajax_board/get_new_comment_list/", {
    method: "POST",
    headers: { "X-CSRFToken": getCookie("csrftoken") },
    body: request_data
  }).then((res) => res.json());
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_comment_list, { data }), document.getElementById("div_new_comment_list"));
}
