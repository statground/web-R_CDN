function set_comment() {
  data_comment_upper = Object.values(data_comment).filter((item) => !item.uuid_upper);
  let list_comment = data_comment_upper;
  list_comment.forEach((comment) => {
    comment.rereply = Object.values(data_comment).filter((item) => item.uuid_upper === comment.uuid);
  });
  ReactDOM.render(/* @__PURE__ */ React.createElement(
    Div_article_read_comment,
    {
      data: list_comment,
      uuid_article: data_article.uuid,
      is_secret: data_article.is_secret,
      check_reader: data_article.check_reader
    }
  ), document.getElementById("div_community_read_comment"));
  Object.values(data_comment).forEach((comment) => {
    WebRSolidEdit.renderContent(document.querySelector("#div_comment_" + comment.uuid), comment.content);
  });
const editorConfig = {
    previewStyle: "vertical",
    height: "250px",
    initialEditType: "wysiwyg",
    hooks: {
      addImageBlobHook: async (blob, callback) => {
        try {
          const compressedBase64 = await compressImage(blob);
          callback(compressedBase64, blob.name);
        } catch (error) {
          alert("\uC774\uBBF8\uC9C0 \uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
        }
      }
    }
  };
  editor["new"] = WebRSolidEdit.mountEditor(document.querySelector("#div_community_read_comment_new_form"), { height: "250px", placeholder: "내용을 입력해주세요." });
  editor["new"].setHTML();
  data_comment_upper.forEach((comment) => {
    editor[comment.uuid] = WebRSolidEdit.mountEditor(document.querySelector("#div_community_read_comment_new_" + comment.uuid + "_form"), { height: "250px", placeholder: "내용을 입력해주세요." });
    editor[comment.uuid].setHTML();
  });
}
