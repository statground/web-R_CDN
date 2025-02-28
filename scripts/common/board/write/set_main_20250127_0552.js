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
			plugins: [colorSyntax, tableMergedCell],
            hooks: {
                addImageBlobHook: async (blob, callback) => {
                try {
                    //console.log("이미지 처리 시작:", blob); // 처리 시작 로그

                    // 이미지 압축
                    const compressedBase64 = await compressImage(blob);
                    //console.log("이미지 압축 및 변환 성공!"); // 성공 로그

                    // 압축된 Base64 데이터를 에디터에 삽입
                    callback(compressedBase64, blob.name);
                } catch (error) {
                    //console.error("이미지 처리 중 오류 발생:", error); // 에러 로그
                    alert("이미지 처리에 실패했습니다. 다시 시도해 주세요."); // 사용자 알림
                }
                },
            }
        });

	} else {
		location.href=init_url
		
	}
}