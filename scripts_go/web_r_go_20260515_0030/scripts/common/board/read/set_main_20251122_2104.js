async function set_main() {
  function Div_main() {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center py-8 px-6 w-full max-w-6xl mx-auto md:px-20" }, /* @__PURE__ */ React.createElement(Div_page_header, { title: header_title, subtitle: header_subtitle }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-1 justify-center items-start w-full gap-4 md:grid-cols-3" }, /* @__PURE__ */ React.createElement("div", { class: "md:col-span-2 w-full" }, /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_header" }, /* @__PURE__ */ React.createElement("div", { class: "w-full h-12 bg-gray-300 mb-4 animate-pulse" })), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_content" }, /* @__PURE__ */ React.createElement("div", { class: "w-full h-48 bg-gray-300 mb-4 animate-pulse" })), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_file" }, /* @__PURE__ */ React.createElement("div", { class: "w-full h-12 bg-gray-300 mb-4 animate-pulse" })), /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_community_read_comment" }, /* @__PURE__ */ React.createElement("div", { class: "w-full h-24 bg-gray-300 animate-pulse" }))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-start w-full space-y-4" }, /* @__PURE__ */ React.createElement("div", { id: "div_article_read_buttons", class: "w-full" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_article_famous_list", title: "\uCD5C\uADFC \uC778\uAE30 \uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_new_comment_list", title: "\uCD5C\uADFC \uB313\uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_my_article_list", title: "\uB0B4\uAC00 \uC4F4 \uAE00" }), /* @__PURE__ */ React.createElement(Div_sidelist_skeleton, { id: "div_my_comment_list", title: "\uB0B4\uAC00 \uC4F4 \uB313\uAE00" })))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, null), document.getElementById("div_main"));
  try {
    await get_read_article("init");
  } catch (e) {
    console.error("[set_main] get_read_article error:", e);
  }
  get_article_famous_list();
  get_new_comment_list();
  get_my_article_list();
  get_my_comment_list();
}
