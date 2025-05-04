// Delete a comment
async function click_btn_delete_comment(uuid_comment) {
    if (!confirm("정말로 삭제할까요?")) {
        return;
    }
    // Determine if this is a top-level comment or a reply
    const commentData = Object.values(data_comment).find(item => item.uuid === uuid_comment);
    const isDepth1 = commentData && !commentData.uuid_upper;
    // Show loading state for the comment's action buttons
    ReactDOM.render(
        <Div_comment_button_list data={commentData || {uuid: uuid_comment, check_comment_reader: "", active: 1}} depth={isDepth1 ? 1 : 2} loading={true} />,
        document.getElementById("div_comment_footer_" + uuid_comment)
    );
    // Prepare request data
    const request_data = new FormData();
    request_data.append('uuid_article', orderID);
    request_data.append('uuid_comment', uuid_comment);
    // Send delete request
    await fetch("/blank/ajax_board/delete_comment/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
    });
    // Refresh the comment list after deletion
    get_read_article_comment(orderID);
}