async function set_main() {
	function Div_check_admin(props) {
		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<p>관리자 여부를 확인하고 있습니다.</p>
				</div>
			</div>
		)
	}

	function Div_main_stop(props) {
		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg" class="size-16" />
					<p>유튜브 게시판은 관리자만 작성할 수 있습니다.</p>
					<a href={init_url}
					   class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px]
							  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
						목록으로
					</a>
				</div>
			</div>
		)
	}

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
		ReactDOM.render(<Div_check_admin />, document.getElementById("div_main"))
	
		const data = await fetch("/ajax_get_menu_header/")
			.then(res=> { return res.json(); })
			.then(res=> { return res; });

		gv_role = data['role']
		
		if (gv_role == "관리자") {
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
			ReactDOM.render(<Div_main_stop />, document.getElementById("div_main"))
		}
			
	} else {
		location.href=init_url
		
	}
}