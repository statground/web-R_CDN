function set_comment() {
	// 댓글 Depth 1
	let list_comment = Object.values(data_comment).filter(item => item.uuid_upper == null)
	data_comment_upper = Object.values(data_comment).filter(item => item.uuid_upper == null)
	Object.keys(list_comment).map(function(i){
		list_comment[i]['rereply'] = Object.values(data_comment).filter(item => item.uuid_upper == list_comment[i]["uuid"])
	})
	
	
	ReactDOM.render(<Div_article_read_comment data={list_comment} 
											  uuid_article={data_article.uuid}
											  is_secret={data_article.is_secret}
											  check_reader={data_article.check_reader} />, document.getElementById("div_community_read_comment"))
	
	Object.keys(data_comment).map(function(i){
		let viewer = toastui.Editor.factory({
			el: document.querySelector('#div_comment_' + data_comment[i].uuid),
			viewer: true,
			initialValue: data_comment[i].content
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
	editor["new"].setHTML()

	Object.keys(data_comment_upper).map(function(i){
		editor[data_comment_upper[i].uuid] = new toastui.Editor({
						el: document.querySelector('#div_community_read_comment_new_' + data_comment_upper[i].uuid + "_form"),
						previewStyle: 'vertical',
						height: '250px',
						initialEditType: 'wysiwyg',
						plugins: [colorSyntax, tableMergedCell]
					});    
		editor[data_comment_upper[i].uuid].setHTML()
	})
}