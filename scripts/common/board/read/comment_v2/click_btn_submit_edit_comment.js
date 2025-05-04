// Submit an edited comment
async function click_btn_submit_edit_comment(uuid_comment) {
    // Get edited content and secret flag
    const contentHTML = editor[uuid_comment].getHTML();
    const isSecret = document.getElementById("chk_secret_" + uuid_comment).checked;
    if (contentHTML == null || contentHTML.trim() === "" || contentHTML === "<p><br></p>") {
        alert("내용을 입력해주세요.");
        return;
    }
    // Show loading state on the update button
    ReactDOM.render(<Div_comment_editor_footer uuid_comment={uuid_comment} loading={true} />, document.getElementById("btn_comment_editor_footer_button_" + uuid_comment));
    // Prepare request data
    const request_data = new FormData();
    request_data.append('uuid_article', orderID);
    request_data.append('uuid_comment', uuid_comment);
    request_data.append('txt_content', contentHTML);
    request_data.append('chk_secret', isSecret ? 1 : 0);
    // If an attachment exists for this comment, include it (assumes no file change on edit)
    const fileEntry = data_file.find(item => item.uuid_comment === uuid_comment);
    if (fileEntry) {
        request_data.append('attached_file', fileEntry.uuid);
    }
    // Send request to update comment
    const response = await fetch("/blank/ajax_board/update_comment/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
    });
    const result = await response.json();
    if (result && result.result === "success") {
        get_read_article_comment(orderID);
    } else {
        // Revert button to normal on failure
        ReactDOM.render(<Div_comment_editor_footer uuid_comment={uuid_comment} onSubmit={() => click_btn_submit_edit_comment(uuid_comment)} />, document.getElementById("btn_comment_editor_footer_button_" + uuid_comment));
    }
}