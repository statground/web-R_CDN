// ===============================
// 게시판 메인 셋업
// ===============================
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
						// console.log("이미지 처리 시작:", blob);

						// blob → 리사이즈 + 압축 + (용량 초과 시) 품질 낮추기
						// 필요하면 여기 숫자만 조절해서 정책 바꾸면 됨
						const compressedBase64 = await compressImage(
							blob,
							1200,   // maxWidth
							1200,   // maxHeight
							0.8,    // 초기 quality
							500     // 목표 최대 용량(KB) (대략 0.5MB)
						);

						// console.log("이미지 압축 및 변환 성공!");

						// 압축된 Base64 데이터를 에디터에 삽입
						callback(compressedBase64, blob.name || "image");
					} catch (error) {
						// console.error("이미지 처리 중 오류 발생:", error);
						alert("이미지 처리에 실패했습니다. 다시 시도해 주세요.");
					}
				},
			}
		});

	} else {
		location.href = init_url
	}
}