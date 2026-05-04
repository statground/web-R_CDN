function set_article() {
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_header, { data: data_article }), document.getElementById("div_community_read_header"));
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_buttons, { data: data_article }), document.getElementById("div_article_read_buttons"));
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_article_read_file, { data: data_article }), document.getElementById("div_community_read_file"));
  const viewer = WebRSolidEdit.renderContent(document.querySelector("#div_community_read_content"), data_article.content);
}
