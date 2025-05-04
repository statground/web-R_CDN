// Enter edit mode for a comment (replace content with editor)
async function click_btn_edit_comment(uuid_comment) {
    // Render the edit form in place of the comment's content
    ReactDOM.render(<Div_comment_editor_form uuid_comment={uuid_comment} />, document.getElementById("div_comment_" + uuid_comment));
    // Initialize ToastUI Editor for editing (include necessary plugins)
    const { Editor } = toastui;
    const { colorSyntax, tableMergedCell } = Editor.plugin;
    editor[uuid_comment] = new toastui.Editor({
        el: document.querySelector('#div_comment_editor_main_' + uuid_comment),
        previewStyle: 'vertical',
        height: '250px',
        initialEditType: 'wysiwyg',
        plugins: [colorSyntax, tableMergedCell]
    });
    // Load existing comment content into the editor
    const commentData = Object.values(data_comment).find(item => item.uuid === uuid_comment);
    if (commentData) {
        editor[uuid_comment].setHTML(commentData.content);
    }
}
