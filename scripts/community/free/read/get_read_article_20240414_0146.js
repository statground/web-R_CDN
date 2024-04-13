async function get_read_article() {
	const request_data = new FormData();
	request_data.append('orderID', orderID);
	
	data = await fetch("/community/ajax_get_read_article/", {
				method: "post", 
				headers: { "X-CSRFToken": getCookie("csrftoken"), },
				body: request_data
				})
				.then(res=> { return res.json(); })
				.then(res=> { return res; });
	
	// 헤더
	ReactDOM.render(<Div_article_read_header data={data.article} />, document.getElementById("div_community_read_header"))
	ReactDOM.render(<Div_article_read_buttons data={data.article} />, document.getElementById("div_article_read_buttons"))

	const viewer = toastui.Editor.factory({
		el: document.querySelector('#div_community_read_content'),
		viewer: true,
		initialValue: data.article.content
	  });	


	// 댓글 Depth 1
	let list_comment = Object.values(data.comment).filter(item => item.uuid_upper == null)
	data["comment_upper"] = Object.values(data.comment).filter(item => item.uuid_upper == null)
	Object.keys(list_comment).map(function(i){
		list_comment[i]['rereply'] = Object.values(data.comment).filter(item => item.uuid_upper == list_comment[i]["uuid"])
	})
	
	
	ReactDOM.render(<Div_article_read_comment data={list_comment} 
											  uuid_article={data.article.uuid}
											  is_secret={data.article.is_secret}
											  check_reader={data.article.check_reader} />, document.getElementById("div_community_read_comment"))
	
	Object.keys(data.comment).map(function(i){
		let viewer = toastui.Editor.factory({
			el: document.querySelector('#div_comment_' + data.comment[i].uuid),
			viewer: true,
			initialValue: data.comment[i].content
		  });
	})


	const { Editor } = toastui;
	const { colorSyntax } = Editor.plugin;
	const { tableMergedCell } = Editor.plugin;

	
	editor["new"] = new toastui.Editor({
		el: document.querySelector('#div_community_read_comment_new_form'),
		previewStyle: 'vertical',
		height: '250px',
		initialEditType: 'wysiwyg',
		plugins: [colorSyntax, tableMergedCell]
	});

	Object.keys(data.comment_upper).map(function(i){
		editor[data.comment_upper[i].uuid] = new toastui.Editor({
						el: document.querySelector('#div_community_read_comment_new_' + data.comment_upper[i].uuid + "_form"),
						previewStyle: 'vertical',
						height: '250px',
						initialEditType: 'wysiwyg',
						plugins: [colorSyntax, tableMergedCell]
					});    
	})
}