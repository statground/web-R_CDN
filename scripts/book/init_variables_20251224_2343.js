(function(){
	var urlParams = new URLSearchParams(window.location.search);
	var sub = urlParams.get('sub') || '';
	if (!sub) {
	  var m = window.location.pathname.match(/\/book\/([^\/]+)/);
	  if (m) sub = m[1];
	}
	// 전역 노출 (다른 스크립트들이 전역 변수로 접근함)
	window.sub = sub;
	window.header_title = "도서";
	window.header_subtitle = "";
	window.toggle_click_submit = false;
	window.editor = null;
})();