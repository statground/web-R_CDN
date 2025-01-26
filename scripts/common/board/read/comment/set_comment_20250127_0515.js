function set_comment() {
	// 댓글 Depth 1 필터링
	data_comment_upper = Object.values(data_comment).filter(item => !item.uuid_upper)
	let list_comment = data_comment_upper
	list_comment.forEach(comment => {
		comment.rereply = Object.values(data_comment).filter(item => item.uuid_upper === comment.uuid)
	})
	
	// 댓글 렌더링
	ReactDOM.render(<Div_article_read_comment 
		data={list_comment} 
		uuid_article={data_article.uuid}
		is_secret={data_article.is_secret}
		check_reader={data_article.check_reader} 
	/>, document.getElementById("div_community_read_comment"))
	
	// 댓글 뷰어 설정
	Object.values(data_comment).forEach(comment => {
		new toastui.Editor.factory({
			el: document.querySelector('#div_comment_' + comment.uuid),
			viewer: true,
			initialValue: comment.content
		})
	})

	// 에디터 플러그인 설정
	const { Editor } = toastui
	const { colorSyntax, tableMergedCell } = Editor.plugin
	const editorConfig = {
		previewStyle: 'vertical',
		height: '250px', 
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
	}

	// 새 댓글 에디터
	editor["new"] = new toastui.Editor({
		el: document.querySelector('#div_community_read_comment_new_form'),
		...editorConfig
	})
	editor["new"].setHTML()
	
	// 대댓글 에디터
	data_comment_upper.forEach(comment => {
		editor[comment.uuid] = new toastui.Editor({
			el: document.querySelector('#div_community_read_comment_new_' + comment.uuid + "_form"),
			...editorConfig
		})
		editor[comment.uuid].setHTML()
	})
}