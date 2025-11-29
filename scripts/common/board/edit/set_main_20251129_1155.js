async function set_main() {
    function Div_check_writer() {
        return (
            <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
                <div class="flex flex-col justify-center items-center w-full space-y-4">
                    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <p>작성자 여부를 확인하고 있습니다.</p>
                </div>
            </div>
        );
    }

    function Div_main_stop() {
        return (
            <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
                <div class="flex flex-col justify-center items-center w-full space-y-4">
                    <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg" class="size-16" />
                    <p>작성자만 글을 수정할 수 있습니다.</p>
                    <a
                        href={init_url}
                        class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
                    >
                        목록으로
                    </a>
                </div>
            </div>
        );
    }

    // 로그인 안 되어 있으면 목록으로
    if (!gv_username) {
        location.href = init_url;
        return;
    }

    // 우선 "작성자 확인중" 표시
    ReactDOM.render(<Div_check_writer />, document.getElementById("div_main"));

    // ✅ FormData 제대로 생성
    const fd = new FormData();
    fd.append("orderID", orderID);

    // 게시글 내용/작성자 확인
    const data = await fetch("/blank/ajax_board/get_read_article/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: fd
    }).then(res => res.json());

    // 작성자가 아니면 수정 불가
    if (data.check_reader === "user") {
        ReactDOM.render(<Div_main_stop />, document.getElementById("div_main"));
        return;
    }

    // 메인 레이아웃 렌더링
    ReactDOM.render(<Div_main />, document.getElementById("div_main"));

    // ✅ 전역 editor 사용 (init_variables에서 let editor 선언해둠)
    editor = new toastui.Editor({
        el: document.querySelector('#div_editor'),
        previewStyle: 'vertical',
        height: '500px',
        initialEditType: 'wysiwyg',
        plugins: [
            toastui.Editor.plugin.colorSyntax,
            toastui.Editor.plugin.tableMergedCell
        ],
        hooks: {
            addImageBlobHook: async (blob, callback) => {
                try {
                    // blob → 리사이즈 + 압축 + (용량 초과 시) 품질 낮추기
                    const compressedBase64 = await compressImage(
                        blob,
                        1200,  // maxWidth
                        1200,  // maxHeight
                        0.8,   // 초기 quality
                        500    // 목표 최대 용량(KB)
                    );

                    callback(compressedBase64, blob.name || "image");
                } catch (error) {
                    alert("이미지 처리에 실패했습니다. 다시 시도해 주세요.");
                }
            }
        }
    });

    // 기존 데이터 세팅
    document.getElementById("txt_title").value = data.title;
    editor.setHTML(data.content);
    document.getElementById("chk_secret").checked = data.is_secret == 1;

    if (data.file_name) {
        document.getElementById("txt_filename").innerHTML = data.file_name;
        document.getElementById("txt_file_delete").className = class_txt_file_delete;
    }
}
