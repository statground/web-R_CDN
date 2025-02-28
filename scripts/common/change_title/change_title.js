// Change Title
function change_title(inputTitle) {
	let title = inputTitle + " / 웹에서 하는 R 통계"

	// 메타 태그 변경
	document.title = title

	// og:title 메타 태그 선택
	let newMeta = document.createElement('meta');
	let ogTitle = document.querySelector('meta[property="og:title"]');

	if (ogTitle) {      // 존재하는 경우, content 속성 변경
		ogTitle.setAttribute("content", title);
	} else {        // og:title 메타 태그가 없는 경우, 새로 생성하여 추가
		ogTitle = document.createElement('meta');
		ogTitle.setAttribute("property", "og:title");
		ogTitle.setAttribute("content", title);
		document.getElementsByTagName('head')[0].appendChild(ogTitle);
	}
}