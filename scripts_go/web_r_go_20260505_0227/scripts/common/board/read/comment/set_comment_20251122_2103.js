function set_comment() {
  if (!data_comment) {
    console.warn("[set_comment] data_comment is null or undefined");
    const container = document.getElementById("div_community_read_comment");
    if (container) {
      container.innerHTML = `
				<div class="w-full py-4 text-sm text-gray-500">
					\uC544\uC9C1 \uB4F1\uB85D\uB41C \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.
				</div>
			`;
    }
    return;
  }
  const allComments = Object.values(data_comment).filter((c) => !!c);
  const data_comment_upper = allComments.filter((item) => !item.uuid_upper);
  const list_comment = data_comment_upper.map((comment) => {
    return {
      ...comment,
      rereply: allComments.filter((item) => item.uuid_upper === comment.uuid)
    };
  });
  const commentContainer = document.getElementById("div_community_read_comment");
  if (!commentContainer) {
    console.warn("[set_comment] div_community_read_comment not found");
    return;
  }
  let uuid_article = null;
  let is_secret = 0;
  let check_reader = "guest";
  if (!data_article) {
    console.warn("[set_comment] data_article is undefined; using fallback values");
  } else {
    uuid_article = data_article.uuid;
    is_secret = data_article.is_secret;
    check_reader = data_article.check_reader;
  }
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(
      Div_article_read_comment,
      {
        data: list_comment,
        uuid_article,
        is_secret,
        check_reader
      }
    ),
    commentContainer
  );
  allComments.forEach((comment) => {
    if (!comment || !comment.uuid)
      return;
    const el = document.querySelector("#div_comment_" + comment.uuid);
    if (!el) {
      return;
    }
    WebRSolidEdit.renderContent(el, comment.content || "");
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
  if (!window.editor) {
    window.editor = {};
  }
  const editor = window.editor;
  const newFormEl = document.querySelector("#div_community_read_comment_new_form");
  if (newFormEl) {
    editor["new"] = WebRSolidEdit.mountEditor(newFormEl, { height: "250px", placeholder: "내용을 입력해주세요." });
    editor["new"].setHTML();
  } else {
    console.warn("[set_comment] #div_community_read_comment_new_form not found");
  }
  data_comment_upper.forEach((comment) => {
    if (!comment || !comment.uuid)
      return;
    const replyEl = document.querySelector(
      "#div_community_read_comment_new_" + comment.uuid + "_form"
    );
    if (!replyEl) {
      return;
    }
    editor[comment.uuid] = WebRSolidEdit.mountEditor(replyEl, { height: "250px", placeholder: "내용을 입력해주세요." });
    editor[comment.uuid].setHTML();
  });
}
