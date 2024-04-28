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
				<select id="sel_book" 
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5
							   focus:ring-blue-500 focus:border-blue-500">
				  {book_List}
				</select>
			  </form>
		)
	}

	// 프로필 데이터 가져오기
	const data_book = await fetch("/book/ajax_get_book_list/")
					.then(res=> { return res.json(); })
					.then(res=> { return res; });

	ReactDOM.render(<Div_book_list data={data_book} />, document.getElementById("div_sel_book"));

	const sel_book = document.getElementById('sel_book')
	for (let i=0; i<Object.keys(data_book).length; i++){  
		if(data_book[Object.keys(data_book)[i]].uuid_board_category == data.article.category_uuid){
			sel_book.options[i].selected = true;
		}
	}
}