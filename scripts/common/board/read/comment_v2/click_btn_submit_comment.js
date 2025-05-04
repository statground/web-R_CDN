// Submit a new comment or reply
async function click_btn_submit_comment(uuid_comment) {
    // Get content and secret flag from the appropriate editor
    let contentHTML;
    let isSecret;
    if (uuid_comment == null || uuid_comment === "new") {
        contentHTML = editor["new"].getHTML();
        isSecret = document.getElementById("chk_secret_new").checked;
    } else {
        contentHTML = editor[uuid_comment].getHTML();
        isSecret = document.getElementById("chk_secret_" + uuid_comment).checked;
    }
    // Validate content
    if (contentHTML == null || contentHTML.trim() === "" || contentHTML === "<p><br></p>") {
        alert("내용을 입력해주세요.");
        return;
    }
    // Show loading state on the submit button
    const buttonContainerId = (uuid_comment == null || uuid_comment === "new") ? "btn_comment_editor_footer_button" : "btn_comment_editor_footer_button_" + uuid_comment;
    ReactDOM.render(<Div_comment_editor_footer uuid_comment={uuid_comment} loading={true} />, document.getElementById(buttonContainerId));
    // Prepare request data
    const request_data = new FormData();
    request_data.append('uuid_article', orderID);
    if (uuid_comment && uuid_comment !== "new") {
        request_data.append('uuid_comment', uuid_comment);
    }
    request_data.append('txt_content', contentHTML);
    request_data.append('chk_secret', isSecret ? 1 : 0);
    // Attach file if present
    const fileEntry = data_file.find(item => item.uuid_comment === (uuid_comment || "new"));
    if (fileEntry) {
        request_data.append('attached_file', fileEntry.uuid);
    }
    // Send request to insert comment
    const response = await fetch("/blank/ajax_board/insert_comment/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
    });
    const result = await response.json();
    if (result && result.result === "success") {
        // Refresh comments on success
        get_read_article_comment(orderID);
    } else {
        // Revert button to normal on failure
        ReactDOM.render(<Div_comment_editor_footer uuid_comment={uuid_comment} onSubmit={() => click_btn_submit_comment(uuid_comment)} />, document.getElementById(buttonContainerId));
    }
}
