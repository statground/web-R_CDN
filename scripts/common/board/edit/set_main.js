async function set_main() {
	function Div_main(props) {    
		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
				<div id="div_title" class="w-full">
					<input type="text" placeholder="제목을 입력해주세요." id="txt_title" name="txt_title"
						   class="w-full h-[48px] rounded-lg resize-none scroll-hide 
								  text-start text-[14px] font-[500] border-gray-500
								  focus:ring-gray-700 focus:border-gray-700" />
				</div>

				<div id="div_checker" class="flex flex-row justify-end items-center w-full">
					<div class="flex items-center mb-4">
						<input id="chk_secret" type="checkbox" value="" 
							   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
									  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2" />
						<label for="chk_secret" class="ms-2 text-sm font-medium text-gray-900">비밀글로 작성하기 (본인과 관리자만 읽을 수 있습니다.)</label>
					</div>
				</div>

				<div id="div_editor" class="w-full"></div>
				
				<div class="w-full" id="div_button_list">
					<Div_button />
				</div>
			</div>
		)
	}
	
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

		get_article_read()

	} else {
		location.href=init_url
		
	}
}