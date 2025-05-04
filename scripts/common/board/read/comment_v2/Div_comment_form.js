// Component: Form for new comment or reply (includes file attachment, content editor placeholder, secret checkbox, submit button)
function Div_comment_form(props) {
    const isNewComment = (props.uuid_comment == null);
    const commentId = isNewComment ? "new" : props.uuid_comment;
    return (
        <div class={props.class}>
            <p class="flex flex-row underline">{props.title}</p>
            <div id={"div_community_read_comment_new_" + (isNewComment ? "form" : commentId + "_form")} class="w-full"></div>
            <div class="flex flex-col justify-between items-center w-full space-y-2">
                {/* File attachment input and button */}
                <div class="flex flex-row justify-start items-center w-full space-x-2">
                    <input type="file" name={"id_file_upload_" + commentId} id={"id_file_upload_" + commentId} accept="*" class="hidden" 
                           onChange={() => check_file_upload(commentId)} />
                    <button type="button" class="flex flex-row justify-center items-center py-1.5 px-5 text-white bg-blue-700 font-medium rounded-lg text-center text-sm w-fit hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" 
                            onClick={() => document.getElementById("id_file_upload_" + commentId).click()}>
                        <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/file_upload.svg" class="w-4 h-4 mr-2" alt="" />
                        <p class="block md:hidden">파일 첨부하기</p>
                    </button>
                    <p id={"txt_filename_" + commentId}></p>
                    <p id={"txt_file_delete_" + commentId} class="hidden cursor-pointer" onClick={() => click_delete_file(commentId)}>
                        <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/trash.svg" class="w-4 h-4" alt="삭제" />
                    </p>
                </div>
                {/* Secret checkbox and submit button */}
                <Div_comment_editor_footer uuid_comment={isNewComment ? null : commentId} onSubmit={() => click_btn_submit_comment(commentId)} />
            </div>
        </div>
    );
}
