async function comment_action(action, uuid_comment) {
  const isNew = uuid_comment === "new";
  if (action === "delete") {
    if (!confirm("\uC815\uB9D0\uB85C \uC0AD\uC81C\uD560\uAE4C\uC694?"))
      return;
    const isUpper = data_comment_upper.map((item) => item.uuid).includes(uuid_comment);
    const target = Object.values(data_comment).find(
      (item) => item.uuid === uuid_comment
    );
    ReactDOM.render(
      /* @__PURE__ */ React.createElement(
        Div_comment_button_list,
        {
          data: target || { active: 1, check_comment_reader: "" },
          depth: isUpper ? 1 : 2,
          loading: true
        }
      ),
      document.getElementById(
        "div_comment_footer_" + uuid_comment
      )
    );
    const request_data2 = new FormData();
    request_data2.append("uuid", uuid_comment);
    await fetch("/blank/ajax_board/delete_comment/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data2
    }).then((res) => {
      get_read_article_comment(orderID);
    }).then((res) => res);
    return;
  }
  const editorKey = isNew ? "new" : uuid_comment;
  const currentEditor = editor[editorKey];
  if (!currentEditor) {
    alert("\uC5D0\uB514\uD130\uAC00 \uCD08\uAE30\uD654\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
    return;
  }
  const txt_content = currentEditor.getHTML();
  const chk_id = isNew ? "chk_secret_new" : "chk_secret_" + uuid_comment;
  const secretEl = document.getElementById(chk_id);
  const chk_secret = secretEl ? secretEl.checked : false;
  if (txt_content == null || txt_content === "" || txt_content === "<p><br></p>") {
    alert("\uB0B4\uC6A9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
    return;
  }
  const btnId = isNew ? "btn_comment_editor_footer_button" : "btn_comment_editor_footer_button_" + uuid_comment;
  const btnEl = document.getElementById(btnId);
  if (btnEl) {
    ReactDOM.render(
      /* @__PURE__ */ React.createElement(Div_btn_comment_editor_footer_button_loading, null),
      btnEl
    );
  }
  const request_data = new FormData();
  let url = "";
  if (action === "submit") {
    url = "/blank/ajax_board/insert_comment/";
    request_data.append("uuid_article", orderID);
    if (!isNew) {
      request_data.append("uuid_comment", uuid_comment);
    }
  } else if (action === "edit") {
    url = "/blank/ajax_board/update_comment/";
    request_data.append("uuid_comment", uuid_comment);
  } else {
    console.error("Unknown comment_action:", action);
    return;
  }
  request_data.append("txt_content", txt_content);
  request_data.append("chk_secret", chk_secret);
  if (action === "submit") {
    const fileIdx = data_file.findIndex(
      (item) => item.uuid_comment === uuid_comment
    );
    if (fileIdx !== -1) {
      request_data.append(
        "attached_file",
        data_file[fileIdx].uuid
      );
    }
  }
  await fetch(url, {
    method: "post",
    headers: { "X-CSRFToken": getCookie("csrftoken") },
    body: request_data
  }).then((res) => {
    get_read_article_comment(orderID);
    const btnElAfter = document.getElementById(btnId);
    if (btnElAfter) {
      ReactDOM.render(
        /* @__PURE__ */ React.createElement(
          Div_btn_comment_editor_footer_button,
          {
            uuid_comment,
            function: () => comment_action(action, uuid_comment)
          }
        ),
        btnElAfter
      );
    }
  }).then((res) => res);
}
