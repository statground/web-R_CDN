function click_book_card(url_sub) {
	sub = url_sub

	let book_list_notnull = Object.values(book_list).filter(item => item.board_url_sub != null)

	if (url_sub == null) {
		document.getElementById("book_card_default").className = class_book_card_active
		document.getElementById("div_article_list").className = "col-span-4 w-full"
		document.getElementById("div_book_info").className = "hidden"
		

		Object.keys(book_list_notnull).map(function(i){
			document.getElementById("book_card_" + book_list_notnull[i].board_url_sub).className = class_book_card_deactive
		})

	} else {
		document.getElementById("book_card_default").className = class_book_card_deactive
		document.getElementById("div_article_list").className = "col-span-3 w-full"
		document.getElementById("div_book_info").className = "w-full"

	}


	if (url_sub != null) {
		Object.keys(book_list_notnull).map(function(i){
			if ((book_list_notnull[i].board_url_sub == url_sub)) {
				document.getElementById("book_card_" + book_list_notnull[i].board_url_sub).className = class_book_card_active
			} else {
				document.getElementById("book_card_" + book_list_notnull[i].board_url_sub).className = class_book_card_deactive
			}
		})
	}

	
	get_article_list("init")
}