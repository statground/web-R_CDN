function Div_new_comment(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "bg-white border-b w-full" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: init_url + "read/" + props.data.uuid_article + "/",
      class: "flex flex-col px-6 py-4 space-y-2 cursor-pointer hover:bg-gray-100 w-full"
    },
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center" }, /* @__PURE__ */ React.createElement("span", { class: "font-normal text-sm w-fit max-w-full truncate ..." }, props.data.content.replace(/<[^>]*>?/g, ""))),
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center border border-gray-300 rounded-lg" }, /* @__PURE__ */ React.createElement("span", { class: "font-normal text-xs text-gray-500 w-full mr-2 truncate ..." }, /* @__PURE__ */ React.createElement("span", { class: "bg-gray-300 px-2 py-1 mr-1" }, "\uC6D0\uAE00:"), props.data.article_title)),
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement(Span_btn_user, { user_nickname: props.data.user_nickname, role: props.data.user_role }), /* @__PURE__ */ React.createElement(Span_btn_date, { date: props.data.created_at }))
  ));
}
