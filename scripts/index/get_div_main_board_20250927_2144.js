async function get_div_main_board(){
	function Col(props) {
		const articleList = Object.keys(props.data).map((article) =>
			<Div_new_article_list data={props.data[article]} />
		)

		return (
			<div class="w-full">
				<h5 class="mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900">커뮤니티</h5>
				<div class="rounded-lg border bg-white">
					<table class="w-full text-sm text-left text-gray-500">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50">
						<tr><th class="px-6 py-3">{/* header space */}</th></tr>
					</thead>
					<tbody>
						{articleList}
					</tbody>
					</table>
				</div>
			</div>
		)
	}

	const data = await fetch("/ajax_index_board/")
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

	ReactDOM.render(<Col data={data} title="커뮤니티"/>, document.getElementById("div_main_board_free"));
}