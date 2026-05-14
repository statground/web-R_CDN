async function click_btn_search() {
  let search_text = document.getElementById("txt_search").value.trim();
  if (search_text == null || search_text == "") {
    alert("\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD558\uC138\uC694.");
  } else {
    get_article_list("search");
  }
}
