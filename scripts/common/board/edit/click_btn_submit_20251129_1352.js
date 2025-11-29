async function click_btn_submit() {
    let txt_title = document.getElementById("txt_title").value.trim();
    let txt_content = editor.getHTML();
    let chk_secret = document.getElementById("chk_secret").checked; // true / false

    if (!toggle_click_submit) {
        // 토글 ON
        toggle_click_submit = true;
        ReactDOM.render(<Div_button_loading />, document.getElementById("div_button_list"));

        // 제목을 입력하지 않음
        if (txt_title == null || txt_title == "") {
            alert("제목을 입력해주세요.");

        // 내용을 입력하지 않음
        } else if (
            txt_content == null ||
            txt_content == "" ||
            txt_content == "<p><br></p>"
        ) {
            alert("내용을 입력해주세요.");

        // 게시글 수정
        } else {
            const request_data = new FormData();
            request_data.append("tag", url);
            request_data.append("tag_sub", sub);
            request_data.append("uuid_article", orderID);
            request_data.append("txt_title", txt_title);
            request_data.append("txt_content", txt_content);
            request_data.append("chk_secret", chk_secret);

            // ✅ 새 파일이 있으면 그걸 사용
            if (data_file != null) {
                request_data.append("attached_file", data_file.file_name);

            // ✅ 없으면 이전에 저장되어 있던 파일 정보 사용 (data가 null인지 체크)
            } else if (data && data.file_url != null) {
                request_data.append("attached_file", data.file_url);
            }

            const response_data = await fetch("/blank/ajax_board/update_article/", {
                method: "post",
                headers: { "X-CSRFToken": getCookie("csrftoken") },
                body: request_data,
            })
                .then((res) => res.json())
                .then((res) => res);

            location.href = init_url + "read/" + response_data.uuid + "/";
        }

        // 토글 OFF
        toggle_click_submit = false;
        ReactDOM.render(<Div_button />, document.getElementById("div_button_list"));
    }
}
