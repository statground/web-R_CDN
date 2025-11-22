async function click_btn_edit_comment(uuid_comment) {
  function Div_comment_editor_form(props) {
    return (
      <div class="w-full">
        <div
          class="w-full"
          id={"div_comment_editor_main_" + props.uuid_comment}
        ></div>
        <div class="flex flex-row justify-end items-center w-full space-x-2 mt-2">
          <input
            id={"chk_secret_" + props.uuid_comment}
            type="checkbox"
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded 
                   focus:ring-blue-500 focus:ring-2"
          />
          <label
            for={"chk_secret_" + props.uuid_comment}
            class="ms-2 text-sm font-medium text-gray-900"
          >
            비밀 댓글로 작성하기 (본인과 글 작성자, 관리자만 읽을 수 있습니다.)
          </label>
          <div
            class="w-fit"
            id={
              "btn_comment_editor_footer_button_" +
              props.uuid_comment
            }
          >
            <Div_btn_comment_editor_footer_button
              uuid_comment={props.uuid_comment}
              function={() =>
                comment_action("edit", props.uuid_comment)
              }
            />
          </div>
        </div>
      </div>
    );
  }

  ReactDOM.render(
    <Div_comment_editor_form uuid_comment={uuid_comment} />,
    document.getElementById("div_comment_" + uuid_comment)
  );

  const { Editor } = toastui;
  const { colorSyntax, tableMergedCell } = Editor.plugin;

  editor[uuid_comment] = new toastui.Editor({
    el: document.querySelector(
      "#div_comment_editor_main_" + uuid_comment
    ),
    previewStyle: "vertical",
    height: "250px",
    initialEditType: "wysiwyg",
    plugins: [colorSyntax, tableMergedCell],
  });

  const target = Object.values(data_comment).find(
    (item) => item.uuid === uuid_comment
  );
  if (target) editor[uuid_comment].setHTML(target.content);
}
