function Div_new_article_list(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "bg-white border-b w-full" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: init_url + "read/" + props.data.uuid + "/",
      class: "flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full"
    },
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement("span", { class: "font-bold text-sm w-fit max-w-9/12 truncate ..." }, props.data.title), /* @__PURE__ */ React.createElement(Span_btn_article_new, { toggle: props.data.is_new }), /* @__PURE__ */ React.createElement(Span_btn_article_secret, { toggle: props.data.is_secret }), /* @__PURE__ */ React.createElement(Span_btn_my_article, { toggle: props.data.check_reader })),
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap justify-start items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_user, { user_nickname: props.data.user_nickname, role: props.data.user_role }), /* @__PURE__ */ React.createElement(Span_btn_date, { date: props.data.created_at }), /* @__PURE__ */ React.createElement(Span_btn_article_read, { cnt_read: props.data.cnt_read }), /* @__PURE__ */ React.createElement(Span_btn_article_comment, { cnt_comment: props.data.cnt_comment }))
  ));
}
