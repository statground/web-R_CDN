async function get_book_list() {
	function Div_book_list(props) {
		delete props.data['0']
		const book_List = Object.keys(props.data).map((btn_data) =>                    
			<option value={props.data[btn_data].uuid}>
				{props.data[btn_data].title}
			</option>
		)

		return (
			<form class="w-full">
				<select id="sol_book" 
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5
							   focus:ring-blue-500 focus:border-blue-500">
				  <option selected>어떤 책에 관해 이야기 하실건가요?</option>
				  {book_List}
				</select>
			  </form>
		)
	}

	// 프로필 데이터 가져오기
	const data = await fetch("/book/ajax_get_book_list/")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });
	ReactDOM.render(<Div_book_list data={data} />, document.getElementById("div_sel_book"));
}