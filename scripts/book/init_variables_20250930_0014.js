let header_title = "도서";  let header_subtitle = "";

let toggle_click_submit = false
let editor = null


/**********************
* URL 파라미터
**********************/
const urlParams = new URLSearchParams(window.location.search);
const sub = urlParams.get('sub') || '';