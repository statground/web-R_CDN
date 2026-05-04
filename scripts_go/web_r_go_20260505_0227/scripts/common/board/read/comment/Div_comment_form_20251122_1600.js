function Div_comment_form(props) {
  const isNewComment = props.uuid_comment == null;
  const commentId = isNewComment ? "new" : props.uuid_comment;
  return /* @__PURE__ */ React.createElement("div", { class: props.class }, /* @__PURE__ */ React.createElement("p", { class: "flex flex-row underline" }, props.title), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_community_read_comment_new_" + (isNewComment ? "form" : commentId + "_form"),
      class: "w-full"
    }
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      class: "w-full",
      id: "div_comment_editor_footer_button_" + commentId
    },
    /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-between items-center w-full space-x-2 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "file",
        name: "id_file_upload_" + commentId,
        id: "id_file_upload_" + commentId,
        accept: "*",
        class: "hidden",
        onChange: () => comment_file_action("upload", commentId)
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        class: "flex flex-row justify-center items-center py-1.5 px-5 text-white \n                     bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto\n                     hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
        onClick: () => document.getElementById("id_file_upload_" + commentId).click()
      },
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/file_upload.svg",
          class: "w-4 h-4 mr-2 md:mr-0"
        }
      ),
      /* @__PURE__ */ React.createElement("p", { class: "block md:hidden" }, "\uD30C\uC77C \uCCA8\uBD80\uD558\uAE30")
    ), /* @__PURE__ */ React.createElement("p", { id: "txt_filename_" + commentId }), /* @__PURE__ */ React.createElement(
      "p",
      {
        id: "txt_file_delete_" + commentId,
        class: "hidden",
        onClick: () => comment_file_action("delete", commentId)
      },
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/trash.svg",
          class: "w-4 h-4"
        }
      )
    )), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-end items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "chk_secret_" + commentId,
        type: "checkbox",
        value: "",
        class: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
      }
    ), /* @__PURE__ */ React.createElement(
      "label",
      {
        for: "chk_secret_" + commentId,
        class: "ms-2 text-sm font-medium text-gray-900"
      },
      /* @__PURE__ */ React.createElement("p", null, "\uBE44\uBC00 \uB313\uAE00", /* @__PURE__ */ React.createElement("span", null, "\uB85C \uC791\uC131\uD558\uAE30 (\uBCF8\uC778\uACFC \uAE00 \uC791\uC131\uC790, \uAD00\uB9AC\uC790\uB9CC \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.)"))
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        class: "w-fit",
        id: "btn_comment_editor_footer_button" + (isNewComment ? "" : "_" + commentId)
      },
      /* @__PURE__ */ React.createElement(
        Div_btn_comment_editor_footer_button,
        {
          uuid_comment: commentId,
          function: () => comment_action("submit", commentId)
        }
      )
    )))
  ));
}
