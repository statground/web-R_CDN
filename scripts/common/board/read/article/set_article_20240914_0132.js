function set_article() {
	// 헤더
	ReactDOM.render(<Div_article_read_header data={data_article} />, document.getElementById("div_community_read_header"))
	ReactDOM.render(<Div_article_read_buttons data={data_article} />, document.getElementById("div_article_read_buttons"))

	const viewer = toastui.Editor.factory({
		el: document.querySelector('#div_community_read_content'),
		viewer: true,
		initialValue: data_article.content
	  });	
}