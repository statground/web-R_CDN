async function set_main() {        
	// Menu
	if (gv_username != "") {
		ReactDOM.render(<Div_main />, document.getElementById("div_main"))

		const { Editor } = toastui;
		const { colorSyntax } = Editor.plugin;
		const { tableMergedCell } = Editor.plugin;

		editor = new toastui.Editor({
			el: document.querySelector('#div_editor'),
			previewStyle: 'vertical',
			height: '500px',
			initialEditType: 'wysiwyg',
			plugins: [colorSyntax, tableMergedCell]
			});

	} else {
		location.href=init_url
		
	}
}