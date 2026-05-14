function Div_new_article_list(props) {
  const cu = props.data.category_url;
  let href = "/community/read/" + props.data.uuid + "/";
  if (cu === "notebook") {
    href = props.data.url;
  }
  let category_title = "\uCEE4\uBBA4\uB2C8\uD2F0";
  let category_title_color = " bg-blue-100 text-blue-700 border-blue-300";
  if (cu === "free") {
    category_title = "\uC790\uC720\uAC8C\uC2DC\uD310";
    category_title_color = " bg-blue-100 text-blue-700 border-blue-300";
  } else if (cu === "rblogger") {
    category_title = "R-Blogger";
    category_title_color = " bg-purple-100 text-purple-700 border-purple-300";
  } else if (cu === "notebook") {
    category_title = "Web-R Notebook";
    category_title_color = " bg-emerald-100 text-emerald-700 border-emerald-300";
  }
  return /* @__PURE__ */ React.createElement("div", { class: "bg-white w-full" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href,
      class: "flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-50 rounded-lg mx-3 my-2"
    },
    /* @__PURE__ */ React.createElement("div", { class: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
      "span",
      {
        class: "flex-shrink-0 whitespace-nowrap px-2 py-0.5 border rounded-full text-xs font-semibold" + category_title_color
      },
      category_title
    ), /* @__PURE__ */ React.createElement("span", { class: "min-w-0 flex-1 font-bold text-sm truncate" }, props.data.title), /* @__PURE__ */ React.createElement("div", { class: "flex-shrink-0 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Span_btn_article_new, { toggle: props.data.is_new }), /* @__PURE__ */ React.createElement(Span_btn_article_secret, { toggle: props.data.is_secret }), /* @__PURE__ */ React.createElement(Span_btn_my_article, { toggle: props.data.check_reader }))),
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap items-center space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_user, { user_nickname: props.data.user_nickname, role: props.data.user_role }), /* @__PURE__ */ React.createElement(Span_btn_date, { date: props.data.created_at }), /* @__PURE__ */ React.createElement(Span_btn_article_read, { cnt_read: props.data.cnt_read }), /* @__PURE__ */ React.createElement(Span_btn_article_comment, { cnt_comment: props.data.cnt_comment }))
  ));
}
