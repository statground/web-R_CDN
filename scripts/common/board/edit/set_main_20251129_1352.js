async function set_main() {
    // 작성자 여부 확인 중일 때 화면
    function Div_check_writer() {
        return (
            <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
                <div class="flex flex-col justify-center items-center w-full space-y-4">
                    {/* 간단 로딩 스피너 */}
                    <svg aria-hidden="true" class="w-8 h-8 animate-spin text-gray-200 fill-blue-600" viewBox="0 0 100 101">
                        <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="10" fill="none"></circle>
                        <path d="M95 50a45 45 0 0 1-45 45" stroke="currentColor" stroke-width="10"></path>
                    </svg>
                    <p>작성자 여부를 확인하고 있습니다.</p>
                </div>
            </div>
        );
    }

    // 작성자가 아닐 때 화면
    function Div_main_stop() {
        return (
            <div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4">
                <div class="flex flex-col justify-center items-center w-full space-y-4">
                    <img
                        src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/stop.svg"
                        class="size-16"
                    />
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

    // 로그인 안 되어 있으면 목록으로 이동
    if (!gv_username) {
        location.href = init_url;
        return;
    }

    // 우선 "작성자 확인중" 화면 렌더
    ReactDOM.render(<Div_check_writer />, document.getElementById("div_main"));

    // ✅ FormData 생성
    const fd = new FormData();
    fd.append("orderID", orderID);

    // 게시글 내용/작성자 확인 (전역 data 에 저장)
    data = await fetch("/blank/ajax_board/get_read_article/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: fd
    }).then((res) => res.json());

    // 작성자가 아니면 수정 불가
    if (data.check_reader === "user") {
        ReactDOM.render(<Div_main_stop />, document.getElementById("div_main"));
        return;
    }

    // 메인 편집 화면 렌더 (Div_main 은 이미 다른 JS에서 정의됨)
    ReactDOM.render(<Div_main />, document.getElementById("div_main"));

    // ✅ toastui Editor 생성 (전역 editor 사용)
    editor = new toastui.Editor({
        el: document.querySelector("#div_editor"),
        previewStyle: "vertical",
        height: "500px",
        initialEditType: "wysiwyg",
        plugins: [
            toastui.Editor.plugin.colorSyntax,
            toastui.Editor.plugin.tableMergedCell,
        ],
        hooks: {
            // 이미지 업로드 시 자동 압축 + 품질 조정
            addImageBlobHook: async (blob, callback) => {
                try {
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
            },
        },
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
