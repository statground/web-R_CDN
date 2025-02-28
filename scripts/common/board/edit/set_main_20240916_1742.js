async function set_main() {
	function Div_check_writer(props) {
		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<p>작성자 여부를 확인하고 있습니다.</p>
				</div>
			</div>
		)
	}

	function Div_main_stop(props) {
		return (
			<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg" class="size-16" />
					<p>작성자만 글을 수정할 수 있습니다.</p>
					<a href={init_url}
					   class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px]
							  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
						목록으로
					</a>
				</div>
			</div>
		)
	}
		
	// Menu
	if (gv_username != "") {
		ReactDOM.render(<Div_check_writer />, document.getElementById("div_main"))

		const request_data = new FormData();
		request_data.append('orderID', orderID);
		
		data = await fetch("/blank/ajax_board/get_read_article/", {
							method: "post", 
							headers: { "X-CSRFToken": getCookie("csrftoken"), },
							body: request_data
							})
							.then(res=> { return res.json(); })
							.then(res=> { return res; });

		if (data.check_reader == "user") {
			ReactDOM.render(<Div_main_stop />, document.getElementById("div_main"))
			
		} else {
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

			document.getElementById("txt_title").value = data.title
			editor.setHTML(data.content)
			if (data.is_secret == 1) {
				document.getElementById("chk_secret").checked = true
			}

			if (data.file_name != null) {
				document.getElementById("txt_filename").innerHTML = data.file_name
				document.getElementById("txt_file_delete").className = class_txt_file_delete
			}
		}

	} else {
		location.href=init_url
		
	}
}