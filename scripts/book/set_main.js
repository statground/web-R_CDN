/**********************
* 진입점
**********************/
function set_main() {
	// 로딩 중에는 스켈레톤 먼저
	if (typeof Div_BookDetailSkeleton === "function") {
	  ReactDOM.render(<Div_BookDetailSkeleton />, document.getElementById("div_main"));
	}
	// 데이터 로드 후 본 화면으로 교체
	get_book_info();
}