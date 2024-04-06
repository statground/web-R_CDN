async function set_main() {
	function Div_main(props) {
		let init_url = "/community/"
		if (url != "free") {init_url += url + "/"}

		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-2 md">
				<div id="div_title" class="w-full">
					<input type="text" placeholder="제목을 입력해주세요." id="txt_title" name="txt_title"
						   class="w-full h-[48px] rounded-lg resize-none scroll-hide 
								  text-start text-[14px] font-[500] border-gray-500
								  focus:ring-gray-700 focus:border-gray-700" />
				</div>
				<div id="div_editor" class="w-full"></div>
				<div class="w-full" id="div_button_list">
					<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
						<button type="button" onClick={() => click_btn_submit()}
								class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
										hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
							완료
						</button>
						<button type="button" onClick={() => location.href=init_url}
								class="text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5
									   focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
							목록으로
						</button>
					</div>
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

		let editor = new toastui.Editor({
			el: document.querySelector('#div_editor'),
			previewStyle: 'vertical',
			height: '500px',
			initialEditType: 'wysiwyg',
			plugins: [colorSyntax, tableMergedCell]
			});

	} else {
		let category_url = url
		if (category_url == "free") {
			category_url = ""
		} else {
			category_url = url + "/"
		}

		location.href="/community/" + category_url
		
	}
}