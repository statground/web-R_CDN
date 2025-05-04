// Process fetched comment data and initialize UI
function set_comment() {
    // Identify top-level comments and attach their replies
    data_comment_upper = Object.values(data_comment).filter(item => !item.uuid_upper);
    data_comment_upper.forEach(comment => {
        comment.rereply = Object.values(data_comment).filter(item => item.uuid_upper === comment.uuid);
    });
    data_comment_upper.length = data_comment_upper.length;  // preserve count as length property
    // Render the comment list component
    ReactDOM.render(
        <Div_article_read_comment 
            data={data_comment_upper} 
            uuid_article={data_article.uuid}
            is_secret={data_article.is_secret}
            check_reader={data_article.check_reader} 
        />,
        document.getElementById("div_community_read_comment")
    );
    // Initialize ToastUI Editor in viewer mode for each comment's content
    Object.values(data_comment).forEach(comment => {
        new toastui.Editor.factory({
            el: document.querySelector('#div_comment_' + comment.uuid),
            viewer: true,
            initialValue: comment.content
        });
    });
    // Prepare editors for new comment and each reply form (for content input)
    const { Editor } = toastui;
    const { colorSyntax, tableMergedCell } = Editor.plugin;
    const editorConfig = {
        previewStyle: 'vertical',
        height: '250px',
        initialEditType: 'wysiwyg',
        plugins: [colorSyntax, tableMergedCell]
    };
    // New comment editor
    editor["new"] = new toastui.Editor(Object.assign({
        el: document.querySelector('#div_community_read_comment_new_form')
    }, editorConfig));
    editor["new"].setHTML('');
    // Reply editors for each top-level comment
    data_comment_upper.forEach(comment => {
        editor[comment.uuid] = new toastui.Editor(Object.assign({
            el: document.querySelector('#div_community_read_comment_new_' + comment.uuid + '_form')
        }, editorConfig));
        editor[comment.uuid].setHTML('');
    });
}
