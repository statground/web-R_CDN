function Div_comment_form(props) {
  const isNewComment = props.uuid_comment == null;
  const commentId = isNewComment ? "new" : props.uuid_comment;

  return (
    <div class={props.class}>
      <p class="flex flex-row underline">{props.title}</p>

      {/* editor mount */}
      <div
        id={`div_community_read_comment_new_${isNewComment ? "form" : commentId + "_form"}`}
        class="w-full"
      ></div>

      <div
        class="w-full"
        id={`div_comment_editor_footer_button_${commentId}`}
      >
        <div class="flex flex-col justify-between items-center w-full space-x-2 space-y-2">
          {/* 파일첨부 */}
          <div class="flex flex-row justify-start items-center w-full space-x-2">
            <input
              type="file"
              name={"id_file_upload_" + commentId}
              id={"id_file_upload_" + commentId}
              accept="*"
              class="hidden"
              onChange={() => check_file_upload(commentId)}
            />

            <button
              type="button"
              class="flex flex-row justify-center items-center py-1.5 px-5 text-white 
                     bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto
                     hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              onClick={() =>
                document
                  .getElementById("id_file_upload_" + commentId)
                  .click()
              }
            >
              <img
                src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/file_upload.svg"
                class="w-4 h-4 mr-2 md:mr-0"
              />
              <p class="block md:hidden">파일 첨부하기</p>
            </button>

            <p id={"txt_filename_" + commentId}></p>
            <p
              id={"txt_file_delete_" + commentId}
              class="hidden"
              onClick={() => click_delete_file(commentId)}
            >
              <img
                src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/trash.svg"
                class="w-4 h-4"
              />
            </p>
          </div>

          {/* 비밀댓글 + 등록 */}
          <div class="flex flex-row justify-end items-center w-full space-x-2">
            <input
              id={`chk_secret_${commentId}`}
              type="checkbox"
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              for={`chk_secret_${commentId}`}
              class="ms-2 text-sm font-medium text-gray-900"
            >
              <p>
                비밀 댓글
                <span>
                  로 작성하기 (본인과 글 작성자, 관리자만 읽을 수 있습니다.)
                </span>
              </p>
            </label>

            <div
              class="w-fit"
              id={`btn_comment_editor_footer_button${isNewComment ? "" : "_" + commentId}`}
            >
              <Div_btn_comment_editor_footer_button
                uuid_comment={commentId}
                function={() => click_btn_submit_comment(commentId)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}