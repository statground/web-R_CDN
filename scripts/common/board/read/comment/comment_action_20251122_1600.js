async function comment_action(action, uuid_comment) {
  const isNew = uuid_comment === "new";

  if (action === "delete") {
    if (!confirm("정말로 삭제할까요?")) return;

    const isUpper = data_comment_upper
      .map((item) => item.uuid)
      .includes(uuid_comment);

    const target = Object.values(data_comment).find(
      (item) => item.uuid === uuid_comment
    );

    ReactDOM.render(
      <Div_comment_button_list
        data={target || { active: 1, check_comment_reader: "" }}
        depth={isUpper ? 1 : 2}
        loading={true}
      />,
      document.getElementById(
        "div_comment_footer_" + uuid_comment
      )
    );

    const request_data = new FormData();
    request_data.append("uuid", uuid_comment);

    await fetch("/blank/ajax_board/delete_comment/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data,
    })
      .then((res) => {
        get_read_article_comment(orderID);
      })
      .then((res) => res);

    return;
  }

  const editorKey = isNew ? "new" : uuid_comment;
  const currentEditor = editor[editorKey];

  if (!currentEditor) {
    alert("에디터가 초기화되지 않았습니다. 새로고침 후 다시 시도해주세요.");
    return;
  }

  const txt_content = currentEditor.getHTML();

  const chk_id = isNew
    ? "chk_secret_new"
    : "chk_secret_" + uuid_comment;
  const secretEl = document.getElementById(chk_id);
  const chk_secret = secretEl ? secretEl.checked : false;

  if (
    txt_content == null ||
    txt_content === "" ||
    txt_content === "<p><br></p>"
  ) {
    alert("내용을 입력해주세요.");
    return;
  }

  const btnId = isNew
    ? "btn_comment_editor_footer_button"
    : "btn_comment_editor_footer_button_" + uuid_comment;

  const btnEl = document.getElementById(btnId);
  if (btnEl) {
    ReactDOM.render(
      <Div_btn_comment_editor_footer_button_loading />,
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
    body: request_data,
  })
    .then((res) => {
      get_read_article_comment(orderID);

      const btnElAfter = document.getElementById(btnId);
      if (btnElAfter) {
        ReactDOM.render(
          <Div_btn_comment_editor_footer_button
            uuid_comment={uuid_comment}
            function={() =>
              comment_action(action, uuid_comment)
            }
          />,
          btnElAfter
        );
      }
    })
    .then((res) => res);
}
