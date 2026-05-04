function Div_comment_button_list(props) {
  const { data, depth, loading } = props;
  const isDepth1 = depth === 1;
  const ButtonComp = loading ? Div_btn_comment_footer_loading : Div_btn_comment_footer;
  return /* @__PURE__ */ React.createElement("div", { class: "flex items-center space-x-4" }, isDepth1 && !loading && gv_username !== "" && /* @__PURE__ */ React.createElement(
    ButtonComp,
    {
      text: "\uB300\uB313\uAE00",
      function: () => click_btn_reply_comment(data.uuid),
      url_image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment_re_reply.svg"
    }
  ), data && data.check_comment_reader !== "user" && data.active === 1 && /* @__PURE__ */ React.createElement(
    ButtonComp,
    {
      text: "\uC218\uC815",
      function: !loading ? () => click_btn_edit_comment(data.uuid) : void 0,
      url_image: !loading ? "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment_modify.svg" : null
    }
  ), data && data.check_comment_reader !== "user" && data.active === 1 && /* @__PURE__ */ React.createElement(
    ButtonComp,
    {
      text: "\uC0AD\uC81C",
      function: !loading ? () => comment_action("delete", data.uuid) : void 0,
      url_image: !loading ? "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment_delete.svg" : null
    }
  ));
}
