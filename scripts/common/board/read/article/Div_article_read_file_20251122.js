function Div_article_read_file(props) {
    const data = data_article;
    if (!data) return null;

    const isRblogger = data.category_url === "rblogger";
    const hasUrl = !!data.url;
    const hasFile = !!data.file_url;

    // 🔒 비밀글: admin, writer 외에는 아예 보이지 않게
    if (
        data.is_secret === 1 &&
        data.check_reader !== "admin" &&
        data.check_reader !== "writer"
    ) {
        return null;
    }

    // 🌐 rblogger인데 URL이 없으면 섹션 자체 숨김
    if (isRblogger && !hasUrl) {
        return null;
    }

    // 📎 rblogger가 아니고 첨부파일이 없으면 섹션 자체 숨김
    if (!isRblogger && !hasFile) {
        return null;
    }

    // =========================
    //  rblogger: 원문 링크 출력
    // =========================
    if (isRblogger) {
        return (
            <section class="bg-white py-8 lg:py-16 antialiased">
                <div class="w-full mx-auto px-4 space-y-2">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-md lg:text-lg font-bold text-gray-900">
                            원문 링크
                        </h2>
                    </div>

                    <form class="mb-3">
                        <div class="w-full bg-gray-50 rounded-lg border border-gray-200"></div>
                    </form>

                    <div class="flex flex-row justify-start items-start w-full">
                        <a
                            href={data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-600 underline break-all text-md cursor-pointer hover:text-blue-800 hover:bg-gray-50 px-1 py-0.5 rounded"
                        >
                            {data.url}
                        </a>
                    </div>
                </div>
            </section>
        );
    }


    // =========================
    //  일반 게시글: 첨부파일 출력
    // =========================
    return (
        <section class="bg-white py-8 lg:py-16 antialiased">
            <div class="w-full mx-auto px-4 space-y-2">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-md lg:text-lg font-bold text-gray-900">
                        첨부파일
                    </h2>
                </div>

                <form class="mb-3">
                    <div class="w-full bg-gray-50 rounded-lg border border-gray-200"></div>
                </form>

                <div class="flex flex-row justify-center items-start w-full">
                    <a
                        href={"/" + data.file_url}
                        target="_blank"
                        class="flex flex-row justify-end items-center text-md font-normal w-fit space-x-2 cursor-pointer hover:bg-gray-100"
                    >
                        {data.file_name}
                    </a>
                </div>
            </div>
        </section>
    );
}
