// 검색 버튼 클릭
async function click_btn_search() {
	let search_text = document.getElementById("txt_search").value.trim()

	if (search_text == null || search_text == "") {
		alert("검색어를 입력하세요.");
	} else {
		get_article_list("search")
	}
}