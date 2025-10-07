async function get_div_main_youtube() {
    // 유튜브 항목 하나를 표시하는 컴포넌트
    function Div_main_youtube(props) {
        const { uuid, title, youtube_thumbnail } = props.data;

        return (
            <div class="w-full">
                <h6 class="mb-3 text-base font-semibold text-gray-900">유튜브</h6>
                <div class="rounded-lg bg-white overflow-hidden cursor-pointer hover:bg-gray-50 transition"
                     onClick={() => window.location.href = `/workshop/youtube/read/${uuid}/`}>
                    <div class="flex flex-col items-center">
                        {/* 썸네일 */}
                        <img
                            src={youtube_thumbnail}
                            alt="YouTube Thumbnail"
                            class="w-full object-cover"
                        />
                        {/* 제목 */}
                        <div class="px-4 py-3 text-sm text-gray-800 text-center font-medium truncate w-full">
                            {title}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // AJAX로 랜덤 유튜브 데이터 불러오기
    const data = await fetch("/ajax_index_youtube/")
        .then(res => res.json())
        .catch(err => {
            console.error("YouTube fetch error:", err);
            return null;
        });

    if (!data) return;

    ReactDOM.render(
        <Div_main_youtube data={data[0]} />,
        document.getElementById("div_main_youtube")
    );
}
