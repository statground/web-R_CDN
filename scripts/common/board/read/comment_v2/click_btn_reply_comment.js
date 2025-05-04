// Show reply form for a given comment, hide others
function click_btn_reply_comment(uuid_comment) {
    // Show the selected comment's reply form
    const target = document.getElementById("div_community_read_comment_new_" + uuid_comment);
    if (target) target.className = "w-full";
    // Hide all other reply forms
    data_comment_upper.forEach(comment => {
        if (comment.uuid !== uuid_comment) {
            const otherForm = document.getElementById("div_community_read_comment_new_" + comment.uuid);
            if (otherForm) otherForm.className = "hidden";
        }
    });
}
