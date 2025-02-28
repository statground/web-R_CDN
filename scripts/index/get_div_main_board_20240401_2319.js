async function get_div_main_board(board_url, div_id, title){
	function Col(props) {
		const articleList = Object.keys(props.data).map((article) =>
			<Div_article data={props.data[article]} />
		)

		return (
			<div class="flex flex-col justify-center text-center content-center w-full space-y-2">
				<h5 class="text-xl pb-4 font-bold tracking-tight text-gray-900 dark:text-white">
					{props.title}
				</h5>
				<table class="flex flex-col text-sm text-left text-gray-500">
					<div class="text-xs text-gray-700 uppercase bg-gray-50 w-full">
						<tr></tr>
					</div>
					{articleList}
				</table>
			</div>
		)
	}

	const data = await fetch("/ajax_index_board/?board_url=" + board_url)
						.then(res=> { return res.json(); })
						.then(res=> { return res; });

	ReactDOM.render(<Col data={data} title={title}/>, document.getElementById(div_id));
}