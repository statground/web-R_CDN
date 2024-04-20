// 댓글 수정
async function click_btn_edit_comment(uuid_comment) {
	const { Editor } = toastui;
	const { colorSyntax } = Editor.plugin;
	const { tableMergedCell } = Editor.plugin;

	editor[uuid_comment] = new toastui.Editor({
		el: document.querySelector('#div_comment_' + uuid_comment),
		previewStyle: 'vertical',
		height: '250px',
		initialEditType: 'wysiwyg',
		plugins: [colorSyntax, tableMergedCell]
	});

	ReactDOM.render(<Div_comment_editor_footer text={"수정"} uuid_comment={uuid_comment}
											   function={() => click_btn_submit_edit_comment(uuid_comment)} />, document.getElementById("div_comment_footer_" + uuid_comment))
}