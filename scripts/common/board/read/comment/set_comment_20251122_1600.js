function set_comment() {
  data_comment_upper = Object.values(data_comment).filter(
    (item) => !item.uuid_upper
  );
  let list_comment = data_comment_upper;
  list_comment.forEach((comment) => {
    comment.rereply = Object.values(data_comment).filter(
      (item) => item.uuid_upper === comment.uuid
    );
  });

  ReactDOM.render(
    <Div_article_read_comment
      data={list_comment}
      uuid_article={data_article.uuid}
      is_secret={data_article.is_secret}
      check_reader={data_article.check_reader}
    />,
    document.getElementById("div_community_read_comment")
  );

  Object.values(data_comment).forEach((comment) => {
    const el = document.querySelector(
      "#div_comment_" + comment.uuid
    );
    if (!el) return;
    toastui.Editor.factory({
      el: el,
      viewer: true,
      initialValue: comment.content,
    });
  });

  const { Editor } = toastui;
  const { colorSyntax, tableMergedCell } = Editor.plugin;
  const editorConfig = {
    previewStyle: "vertical",
    height: "250px",
    initialEditType: "wysiwyg",
    plugins: [colorSyntax, tableMergedCell],
    hooks: {
      addImageBlobHook: async (blob, callback) => {
        try {
          const compressedBase64 = await compressImage(blob);
          callback(compressedBase64, blob.name);
        } catch (error) {
          alert(
            "이미지 처리에 실패했습니다. 다시 시도해 주세요."
          );
        }
      },
    },
  };

  const newEl = document.querySelector(
    "#div_community_read_comment_new_form"
  );
  if (newEl) {
    editor["new"] = new toastui.Editor({
      el: newEl,
      ...editorConfig,
    });
    editor["new"].setHTML();
  }

  data_comment_upper.forEach((comment) => {
    const replyEl = document.querySelector(
      "#div_community_read_comment_new_" +
        comment.uuid +
        "_form"
    );
    if (!replyEl) return;

    editor[comment.uuid] = new toastui.Editor({
      el: replyEl,
      ...editorConfig,
    });
    editor[comment.uuid].setHTML();
  });
}
