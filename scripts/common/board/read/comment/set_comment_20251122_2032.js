function set_comment() {
	// 0) 댓글 데이터가 아예 없거나 비정상이면 바로 종료
	if (!data_comment) {
		console.warn("[set_comment] data_comment is null or undefined");
		const container = document.getElementById("div_community_read_comment");
		if (container) {
			container.innerHTML = `
				<div class="w-full py-4 text-sm text-gray-500">
					아직 등록된 댓글이 없습니다.
				</div>
			`;
		}
		return;
	}

	// 1) 전체 댓글에서 null/undefined 제거
	const allComments = Object.values(data_comment).filter(c => !!c);

	// 2) Depth 1 필터링 (상위 댓글만)
	const data_comment_upper = allComments.filter(item => !item.uuid_upper);

	// 3) 대댓글 묶기
	const list_comment = data_comment_upper.map(comment => {
		return {
			...comment,
			rereply: allComments.filter(item => item.uuid_upper === comment.uuid)
		};
	});

	// 4) React로 댓글 렌더링
	const commentContainer = document.getElementById("div_community_read_comment");
	if (!commentContainer) {
		console.warn("[set_comment] div_community_read_comment not found");
		return;
	}

	if (!data_article) {
		console.warn("[set_comment] data_article is undefined");
		return;
	}

	ReactDOM.render(
		<Div_article_read_comment
			data={list_comment}
			uuid_article={data_article.uuid}
			is_secret={data_article.is_secret}
			check_reader={data_article.check_reader}
		/>,
		commentContainer
	);

	// 5) 댓글 뷰어 설정 (본문 보기)
	allComments.forEach(comment => {
		if (!comment || !comment.uuid) return;
		const el = document.querySelector('#div_comment_' + comment.uuid);
		if (!el) {
			// console.warn(`[set_comment] #div_comment_${comment.uuid} not found`);
			return;
		}
		new toastui.Editor.factory({
			el: el,
			viewer: true,
			initialValue: comment.content || ""
		});
	});

	// 6) 에디터 플러그인 설정
	const { Editor } = toastui;
	const { colorSyntax, tableMergedCell } = Editor.plugin;
	const editorConfig = {
		previewStyle: 'vertical',
		height: '250px',
		initialEditType: 'wysiwyg',
		plugins: [colorSyntax, tableMergedCell],
		hooks: {
			addImageBlobHook: async (blob, callback) => {
				try {
					const compressedBase64 = await compressImage(blob);
					callback(compressedBase64, blob.name);
				} catch (error) {
					alert("이미지 처리에 실패했습니다. 다시 시도해 주세요.");
				}
			},
		},
	};

	// 7) editor 전역 객체 보장
	if (!window.editor) {
		window.editor = {};
	}
	const editor = window.editor;

	// 8) 새 댓글 에디터
	const newFormEl = document.querySelector('#div_community_read_comment_new_form');
	if (newFormEl) {
		editor["new"] = new toastui.Editor({
			el: newFormEl,
			...editorConfig,
		});
		editor["new"].setHTML();
	} else {
		console.warn("[set_comment] #div_community_read_comment_new_form not found");
	}

	// 9) 대댓글 에디터
	data_comment_upper.forEach(comment => {
		if (!comment || !comment.uuid) return;
		const replyEl = document.querySelector(
			'#div_community_read_comment_new_' + comment.uuid + "_form"
		);
		if (!replyEl) {
			// console.warn(`[set_comment] reply form for ${comment.uuid} not found`);
			return;
		}
		editor[comment.uuid] = new toastui.Editor({
			el: replyEl,
			...editorConfig,
		});
		editor[comment.uuid].setHTML();
	});
}