async function click_btn_edit_comment(uuid_comment) {
  function Div_comment_editor_form(props) {
    return /* @__PURE__ */ React.createElement("div", { class: "w-full" }, /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_comment_editor_main_" + props.uuid_comment }), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: props.uuid_comment == null ? "chk_secret_new" : "chk_secret_" + props.uuid_comment,
        type: "checkbox",
        value: "",
        class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded \n									focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
      }
    ), /* @__PURE__ */ React.createElement(
      "label",
      {
        for: props.uuid_comment == null ? "chk_secret_new" : "chk_secret_" + props.uuid_comment,
        class: "ms-2 text-sm font-medium text-gray-900"
      },
      "\uBE44\uBC00 \uB313\uAE00\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAE00 \uC791\uC131\uC790, \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"
    ), /* @__PURE__ */ React.createElement("div", { class: "w-fit", id: "btn_comment_editor_footer_button_" + props.uuid_comment }, /* @__PURE__ */ React.createElement(
      Div_btn_comment_editor_footer_button,
      {
        uuid_comment: props.uuid_comment,
        function: () => click_btn_submit_edit_comment(props.uuid_comment)
      }
    ))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_comment_editor_form, { uuid_comment }), document.getElementById("div_comment_" + uuid_comment));
editor[uuid_comment] = WebRSolidEdit.mountEditor(document.querySelector("#div_comment_editor_main_" + uuid_comment), { height: "250px", placeholder: "내용을 입력해주세요." });
  editor[uuid_comment].setHTML(Object.values(data_comment).find((item) => item.uuid === uuid_comment).content);
}
