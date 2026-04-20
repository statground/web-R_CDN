// scripts/intro/notice/set_main.js
// /intro/notice/ 의 list/read/write/edit 를 단일 set_main.js 로 통합
// removed as unused from the original template bundle:
// - Span_btn_category
// - Span_btn_book
// - scripts/common/board/read/comment/init_comment_20251122_1600.js
// - scripts/common/board/read/check_agree_comment.js
// - scripts/common/board/read/article/refresh_article_rblogger_20251122_2102.js
// - scripts/intro/notice/write/set_main.js (template 미참조 구버전)

let header_title = "공지사항";
let header_subtitle = "Web-R 소개";

let toggle_click_submit = false;
let editor = null;
let data = null;
let data_article = null;
let data_comment = null;
let data_comment_upper = [];
let class_txt_file_delete = "rounded-lg hover:bg-red-100 cursor-pointer";

let page_num = 1;
let article_counter = 0;
let toggle_page = false;

let class_span_btn_default = "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl"

function Span_btn_user(props) {
    const roles = {
        "관리자": "yellow",
        "기업회원": "red",
        "VIP회원": "blue",
        "정회원": "green",
        "준회원": "gray"
    };
    const role = roles[props.role] || "gray";
    return (
        <span class={`${class_span_btn_default} text-xs bg-${role}-100 text-${role}-800`}>
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/board_user.svg" class="w-3 h-3 mr-1" />
            {props.user_nickname}
        </span>
    );
}

function Span_btn_date(props) {
    return (
        <span class={`${class_span_btn_default} text-xs bg-blue-100 text-blue-800`}>
            <img src={`https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/calendar_${Number(props.date.split("-")[2].substr(0, 2))}.svg`} class="w-3 h-3 mr-1" />
            {props.date}
        </span>
    );
}

function Span_btn_article_read(props) {
    return props.cnt_read > 0 && (
        <span class={`${class_span_btn_default} text-xs bg-gray-100 text-blue-800`}>
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/eye.svg" class="w-3 h-3 mr-1" />
            {props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
        </span>
    );
}

function Span_btn_article_comment(props) {
    return props.cnt_comment > 0 && (
        <span class={`${class_span_btn_default} text-xs bg-purple-100 text-blue-800`}>
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment.svg" class="w-3 h-3 mr-1" />
            {props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
        </span>
    );
}

function Span_btn_article_new(props) {
    return props.toggle === 1 && (
        <span class={`${class_span_btn_default} text-[10px] bg-red-500 text-white animate-pulse`}>NEW</span>
    );
}

function Span_btn_article_secret(props) {
    return props.toggle === 1 && (
        <span class={`${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse`}>SECRET</span>
    );
}

function Span_btn_comment_secret(props) {
    return props.toggle === 1 && (
        <span class={`${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse`}>SECRET</span>
    );
}

function Span_btn_my_article(props) {
    return props.toggle === "writer" && (
        <span class={`${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse`}>MY</span>
    );
}

function Span_btn_my_comment(props) {
    return props.toggle === "writer" && (
        <span class={`${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse`}>MY</span>
    );
}

function Div_sidelist_skeleton(props) {
	return (
		<div id={props.id} class="w-full">
			 <div class="flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl">
				<Div_box_header title={props.title} />

				<div class="flex flex-col justify-center items-center w-full space-y-2 animate-pulse">
					<div class="h-2.5 bg-gray-200 rounded-full w-full"></div>
					<div class="h-2.5 bg-gray-200 rounded-full w-full"></div>
					<div class="h-2.5 bg-gray-200 rounded-full w-full"></div>
				</div>
			</div>
		</div>
	)
}

function Div_box_header(props) {
	return (
		<p class="flex flex-row text-start w-full font-extrabold underline">{props.title}</p>   
	)
}

function Div_new_article_list(props) {
	return (
		<div class="bg-white border-b w-full">
			<a href={init_url + 'read/' + props.data.uuid + '/'}
			   class="flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full">
				<div class="flex flex-row justify-start items-center space-x-2">
					<span class="font-bold text-sm w-fit max-w-9/12 truncate ...">
						{props.data.title}
					</span>

					<Span_btn_article_new toggle={props.data.is_new} />
					<Span_btn_article_secret toggle={props.data.is_secret} />
					<Span_btn_my_article toggle={props.data.check_reader} />
				</div>
				<div class="flex flex-wrap justify-start items-center w-full space-x-2">
					<Span_btn_user user_nickname={props.data.user_nickname} role={props.data.user_role} />
					<Span_btn_date date={props.data.created_at} />
					<Span_btn_article_read cnt_read={props.data.cnt_read} />
					<Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
				</div>
			</a>
		</div>
	)
}

function Div_new_comment(props) {
	return (
		<div class="bg-white border-b w-full">
			<a href={init_url + 'read/' + props.data.uuid_article + '/'}
				class="flex flex-col px-6 py-4 space-y-2 cursor-pointer hover:bg-gray-100 w-full">
				<div class="flex flex-row justify-start items-center">
					<span class="font-normal text-sm w-fit max-w-full truncate ...">
						{props.data.content.replace(/<[^>]*>?/g, '')}
					</span>
				</div>

				<div class="flex flex-row justify-start items-center border border-gray-300 rounded-lg">
					<span class="font-normal text-xs text-gray-500 w-full mr-2 truncate ...">
						<span class="bg-gray-300 px-2 py-1 mr-1">
							원글: 
						</span>

						{props.data.article_title}
					</span>
				</div>

				<div class="flex flex-wrap justify-start items-center space-x-2">
					<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
					<Span_btn_date date={props.data.created_at} />
				</div>
			</a>
		</div>
	)
}

// 이미지 1회 리사이즈 + 압축해서 dataURL 반환
function _compressImageOnce(blob, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();

                img.onload = function () {
                    let width = img.width;
                    let height = img.height;

                    // 리사이즈 비율 계산
                    const widthRatio = maxWidth / width;
                    const heightRatio = maxHeight / height;
                    const ratio = Math.min(widthRatio, heightRatio, 1); // 1보다 크면 축소하지 않음

                    const targetWidth = Math.round(width * ratio);
                    const targetHeight = Math.round(height * ratio);

                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    ctx.clearRect(0, 0, targetWidth, targetHeight);
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                    // MIME 타입 결정
                    let mimeType = blob.type;
                    if (mimeType !== "image/png" && mimeType !== "image/jpeg") {
                        // 지원하지 않는 포맷은 JPEG로 통일
                        mimeType = "image/jpeg";
                    }

                    let dataUrl;
                    if (mimeType === "image/png") {
                        // PNG는 quality 옵션이 무시되므로 리사이즈만 적용
                        dataUrl = canvas.toDataURL("image/png");
                    } else {
                        // JPEG는 quality로 용량 줄이기 가능
                        dataUrl = canvas.toDataURL("image/jpeg", quality);
                    }

                    resolve(dataUrl);
                };

                img.onerror = function (err) {
                    reject(err);
                };

                img.src = e.target.result;
            };

            reader.onerror = function (err) {
                reject(err);
            };

            reader.readAsDataURL(blob);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * compressImage
 * - blob 이미지를 최대 가로/세로 제한 + JPEG 품질로 압축
 * - 결과 dataURL의 예상 용량이 maxSizeKB를 넘으면 quality를 조금씩 낮추며 재시도
 *
 * @param {Blob} blob
 * @param {number} maxWidth   최대 가로(px)
 * @param {number} maxHeight  최대 세로(px)
 * @param {number} quality    초기 JPEG 압축률 (0 ~ 1)
 * @param {number} maxSizeKB  목표 최대 용량(KB) (대략적인 기준)
 *
 * @returns {Promise<string>} dataURL (data:image/...;base64,...)
 */
async function compressImage(
    blob,
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    maxSizeKB = 500
) {
    let currentQuality = quality;
    let dataUrl = await _compressImageOnce(blob, maxWidth, maxHeight, currentQuality);

    // base64 길이로 대략적인 byte 수 추정 (4/3 배)
    const calcSizeKB = (base64) => {
        const commaIndex = base64.indexOf(",");
        const base64Str = commaIndex >= 0 ? base64.substring(commaIndex + 1) : base64;
        const byteLength = Math.ceil(base64Str.length * 3 / 4);
        return byteLength / 1024;
    };

    let sizeKB = calcSizeKB(dataUrl);

    // 용량이 너무 크면 품질을 조금씩 낮추면서 재시도 (하한선 0.3)
    while (sizeKB > maxSizeKB && currentQuality > 0.3) {
        currentQuality = parseFloat((currentQuality - 0.1).toFixed(2)); // 0.1씩 감소
        if (currentQuality <= 0.3) {
            currentQuality = 0.3;
        }

        dataUrl = await _compressImageOnce(blob, maxWidth, maxHeight, currentQuality);
        sizeKB = calcSizeKB(dataUrl);
    }

    return dataUrl;
}

// 최근 인기 글
async function get_article_famous_list() {
	const Div_article_list = ({data}) => (
		<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
			<Div_box_header title="최신 인기 글" />
			<div className="flex flex-col justify-center items-start w-full space-y-2">
				{Object.values(data).map(article => (
					<Div_new_article_list key={article.id} data={article} />
				))}
			</div>
		</div>
	);

	const request_data = new FormData();
	request_data.append('tag', url);

	const data = await fetch("/blank/ajax_board/get_article_famous_list/", {
		method: "POST",
		headers: { "X-CSRFToken": getCookie("csrftoken") },
		body: request_data
	}).then(res => res.json());

	ReactDOM.render(<Div_article_list data={data} />, document.getElementById("div_article_famous_list"));
}

// 내가 쓴 글 
async function get_my_article_list() {
	const Div_not_login = () => (
		<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
			<Div_box_header title="내가 쓴 글" />
			<span>로그인이 필요합니다.</span>
		</div>
	);

	const Div_article_list = ({data}) => (
		<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
			<Div_box_header title="내가 쓴 글" />
			<div className="flex flex-col justify-center items-start w-full space-y-2">
				{Object.values(data).map(article => (
					<Div_new_article_list key={article.id} data={article} />
				))}
			</div>
		</div>
	);

	if (!gv_username) {
		ReactDOM.render(<Div_not_login />, document.getElementById("div_my_article_list"));
		return;
	}

	const request_data = new FormData();
	request_data.append('tag', url);

	const data = await fetch("/blank/ajax_board/get_my_article_list/", {
		method: "POST",
		headers: { "X-CSRFToken": getCookie("csrftoken") },
		body: request_data
	}).then(res => res.json());

	ReactDOM.render(<Div_article_list data={data} />, document.getElementById("div_my_article_list"));
}

// 내가 쓴 댓글
async function get_my_comment_list() {
	const Div_not_login = () => (
		<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
			<Div_box_header title="내가 쓴 댓글" />
			<span>로그인이 필요합니다.</span>
		</div>
	);

	const Div_comment_list = ({data}) => (
		<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
			<Div_box_header title="내가 쓴 댓글" />
			<div className="flex flex-col justify-center items-start w-full space-y-2">
				{Object.values(data).map(comment => (
					<Div_new_comment key={comment.id} data={comment} />
				))}
			</div>
		</div>
	);

	if (!gv_username) {
		ReactDOM.render(<Div_not_login />, document.getElementById("div_my_comment_list"));
		return;
	}

	const request_data = new FormData();
	request_data.append('tag', url);

	const data = await fetch("/blank/ajax_board/get_my_comment_list/", {
		method: "POST", 
		headers: { "X-CSRFToken": getCookie("csrftoken") },
		body: request_data
	}).then(res => res.json());

	ReactDOM.render(<Div_comment_list data={data} />, document.getElementById("div_my_comment_list"));
}

// 최근 댓글
async function get_new_comment_list() {
	const Div_comment_list = ({data}) => (
		<div className="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
			<Div_box_header title="최신 댓글" />
			<div className="flex flex-col justify-center items-start w-full space-y-2">
				{Object.values(data).map(comment => (
					<Div_new_comment key={comment.id} data={comment} />
				))}
			</div>
		</div>
	);

	const request_data = new FormData();
	request_data.append('tag', url);

	const data = await fetch("/blank/ajax_board/get_new_comment_list/", {
		method: "POST",
		headers: { "X-CSRFToken": getCookie("csrftoken") },
		body: request_data
	}).then(res => res.json());

	ReactDOM.render(<Div_comment_list data={data} />, document.getElementById("div_new_comment_list"));
}

function Div_article_list_skeleton() {
	return (
		<div class="flex flex-col justify-center items-center w-full space-y-2 animate-pulse">
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
			<div class="h-5 bg-gray-200 rounded-full w-full"></div>
		</div>
	)
}

// 검색 버튼 클릭
async function click_btn_search() {
	let search_text = document.getElementById("txt_search").value.trim()

	if (search_text == null || search_text == "") {
		alert("검색어를 입력하세요.");
	} else {
		get_article_list("search")
	}
}

// 최신 글
async function get_article_list(mode) {
    // 공통 컴포넌트 추출
    const ArticleList = ({ data, isMain = false }) => {
        const article_list = Object.keys(data).map(key => 
            <Div_new_article_list key={key} data={data[key]} />
        );

        const listContent = (
            <div class="flex flex-col justify-center items-start w-full space-y-2">
                {article_list}
                <div id={`div_article_list_${page_num + 1}`} class="w-full"></div>
            </div>
        );

        if (!isMain) return listContent;

        return (
            <div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
                <Div_box_header title="최신 글" />
                {listContent}
            </div>
        );
    }

    // 토글 ON
    toggle_page = true;

    // FormData 설정
    const request_data = new FormData();
    request_data.append('tag', url);
    request_data.append('tag_sub', sub);

    // 페이지 번호 및 검색어 처리
    if (mode === "init" || mode === "search") {
        page_num = 1;
        ReactDOM.render(<Div_article_list_skeleton />, document.getElementById("div_article_list"));
        
        if (mode === "search") {
            request_data.append('txt_search', document.getElementById("txt_search").value.trim());
        }
    } else {
        page_num += 1;
        ReactDOM.render(
            <Div_article_list_skeleton />, 
            document.getElementById(`div_article_list_${page_num}`)
        );
    }

    request_data.append('page', page_num);
    
    // 데이터 가져오기
    const data = await fetch("/blank/ajax_board/get_article_list/", {
        method: "post",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: request_data
    }).then(res => res.json());

    // 결과 렌더링
    article_counter = data["count"].cnt;
    const targetId = mode === "init" || mode === "search" 
        ? "div_article_list"
        : `div_article_list_${page_num}`;

    ReactDOM.render(
        <ArticleList 
            data={data.list} 
            isMain={mode === "init" || mode === "search"}
        />,
        document.getElementById(targetId)
    );

    // 토글 OFF
    toggle_page = false;
}

function notice_set_main_list() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={header_title} subtitle={header_subtitle} />
			
				<div id="div_community_list" class="flex flex-col justify-center items-center w-full space-y-4">
					<div class="grid grid-cols-3 justify-center items-start w-full gap-4 md:grid-cols-1">
						<div id="div_article_list" class="col-span-2 w-full">
							<div class="flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-8">
								<Div_box_header title={"최신 글"} />
							</div>
						</div>

						<div class="flex flex-col justify-center items-start w-full space-y-4">
							<button type="button" onClick={() =>
															gv_username == ""
															?   alert("로그인이 필요합니다.")
															:   location.href=init_url + 'write/'
															}
									class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
											hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
								글쓰기
							</button>

							<div class="flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl">
								<p class="flex flex-row text-start w-full">검색</p>
								<input type="text" id="txt_search" 
									   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5
											  focus:ring-blue-500 focus:border-blue-500" />

								<div class="flex flex-row justify-end items-center w-full">
									<button type="button" onClick={() => click_btn_search()}
											class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-sm px-5 py-1 text-center me-2 mb-2
												   hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300">
										검색
									</button>
								</div>
							</div>
							
							<Div_sidelist_skeleton id={"div_article_famous_list"} title={"최근 인기 글"} />
							<Div_sidelist_skeleton id={"div_new_comment_list"} title={"최근 댓글"} />
							<Div_sidelist_skeleton id={"div_my_article_list"} title={"내가 쓴 글"} />
							<Div_sidelist_skeleton id={"div_my_comment_list"} title={"내가 쓴 댓글"} />

						</div>
					</div>
				</div>
				
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	get_article_list("init")
	get_article_famous_list()
	get_new_comment_list()
	get_my_article_list()
	get_my_comment_list()

	if (!window.__intro_notice_list_scroll_bound__) {
		window.__intro_notice_list_scroll_bound__ = true;
		window.addEventListener("scroll", () => {
		// 100을 더하면 스크롤을 끝까지 내리기 100px 전에 데이터를 받아올 수 있다.
		const isScrollEnded = window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight;
	  
		if (isScrollEnded && !toggle_page && ((page_num * 20) < article_counter)) {
			get_article_list("next")
		}
		});
	}
}

async function get_read_article(mode) {
    const request_data = new FormData();
    request_data.append('orderID', orderID);

    try {
        const res = await fetch("/blank/ajax_board/get_read_article/", {
            method: "post",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            body: request_data
        });

        if (!res.ok) {
            throw new Error(`get_read_article HTTP error: ${res.status}`);
        }

        data_article = await res.json();

        if (mode === "init") {
            set_article();
        }

        get_read_article_comment(orderID);
    } catch (err) {
        console.error("[get_read_article] fetch or JSON error:", err);
    }
}

async function click_btn_delete() {
	if (confirm("정말로 삭제할까요?")) {
		const request_data = new FormData();
		request_data.append('uuid', orderID);
		
		const data = await fetch("/blank/ajax_board/delete_article/", {
							method: "post", 
							headers: { "X-CSRFToken": getCookie("csrftoken"), },
							body: request_data
							})
							.then(res=> { return res.json(); })
							.then(res=> { return res; });
	
		location.href=init_url
	}
}

function Div_article_read_header(props) {
	return (
		<div class="flex flex-col justify-center items-start py-4 border-t border-b border-gray-200 w-full">
			<div class="flex flex-row justify-start items-end w-full">
				<span class="flex flex-row justify-start items-center text-lg font-extrabold w-full space-x-2">
					{props.data.title}
					<div></div>
					<Span_btn_article_new toggle={props.data.is_new} />
					<Span_btn_article_secret toggle={props.data.is_secret} />
					<Span_btn_my_article toggle={props.data.check_reader} />
				</span>
			</div>

			<div class="flex flex-row justify-end items-center w-full">
				<span class="flex flex-row justify-end items-center text-md font-normal w-full space-x-2">
					<Span_btn_user user_nickname = {props.data.user_nickname} role = {props.data.user_role} />
					<Span_btn_date date={props.data.created_at} />
					<Span_btn_article_read cnt_read={props.data.cnt_read} />
					<Span_btn_article_comment cnt_comment={props.data.cnt_comment} />
				</span>
			</div>
		</div>
	)
}

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

function set_article() {
	// 헤더
	ReactDOM.render(<Div_article_read_header data={data_article} />, document.getElementById("div_community_read_header"))
	ReactDOM.render(<Div_article_read_buttons data={data_article} />, document.getElementById("div_article_read_buttons"))
	ReactDOM.render(<Div_article_read_file data={data_article} />, document.getElementById("div_community_read_file"))

	const viewer = toastui.Editor.factory({
		el: document.querySelector('#div_community_read_content'),
		viewer: true,
		initialValue: data_article.content
	  });	
}

function Div_btn_comment_editor_footer_button(props) {
  return (
    <button
      type="button"
      onClick={props.function}
      class="flex flex-row justify-center items-center
             text-white bg-gradient-to-r from-cyan-500 to-blue-500
             font-medium rounded-lg text-sm px-5 py-1 text-center
             hover:bg-gradient-to-bl hover:bg-gray-300
             focus:ring-4 focus:outline-none focus:ring-cyan-300"
    >
      등록
    </button>
  );
}

function Div_btn_comment_editor_footer_button_loading(props) {
  return (
    <button
      type="button"
      class="flex flex-row justify-center items-center
             text-white bg-gradient-to-r from-cyan-500 to-blue-500
             font-medium rounded-lg text-sm px-5 py-1 text-center
             hover:bg-gradient-to-bl hover:bg-gray-300
             focus:ring-4 focus:outline-none focus:ring-cyan-300
             cursor-not-allowed"
    >
      <svg
        aria-hidden="true"
        role="status"
        class="inline w-4 h-4 mr-2 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858
             100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50
             0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116
             97.0079 33.5539C95.2932 28.8227 92.871 24.3692
             89.8167 20.348C85.8452 15.1192 80.8826 10.7238
             75.2124 7.41289C69.5422 4.10194 63.2754 1.94025
             56.7698 1.05124C51.7666 0.367541 46.6976 0.446843
             41.7345 1.27873C39.2613 1.69328 37.813 4.19778
             38.4501 6.62326C39.0873 9.04874 41.5694 10.4717
             44.0505 10.1071C47.8511 9.54855 51.7191 9.52689
             55.5402 10.0491C60.8642 10.7766 65.9928 12.5457
             70.6331 15.2552C75.2735 17.9648 79.3347 21.5619
             82.5849 25.841C84.9175 28.9121 86.7997 32.2913
             88.1811 35.8758C89.083 38.2158 91.5421 39.6781
             93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      등록
    </button>
  );
}

function Div_btn_comment_footer(props) {
  return (
    <button
      type="button"
      class="flex justify-center items-center text-sm text-gray-500 hover:underline font-medium"
      onClick={props.function}
    >
      {props.url_image && (
        <img src={props.url_image} class="w-4 h-4 mr-2" />
      )}
      {props.text}
    </button>
  );
}

function Div_btn_comment_footer_loading(props) {
  return (
    <button
      type="button"
      class="flex justify-center items-center text-sm text-gray-400 font-medium cursor-not-allowed"
    >
      <svg
        aria-hidden="true"
        class="inline w-4 h-4 text-gray-200 animate-spin mr-2"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858
             100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50
             0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116
             97.0079 33.5539C95.2932 28.8227 92.871 24.3692
             89.8167 20.348C85.8452 15.1192 80.8826 10.7238
             75.2124 7.41289C69.5422 4.10194 63.2754 1.94025
             56.7698 1.05124C51.7666 0.367541 46.6976 0.446843
             41.7345 1.27873C39.2613 1.69328 37.813 4.19778
             38.4501 6.62326C39.0873 9.04874 41.5694 10.4717
             44.0505 10.1071C47.8511 9.54855 51.7191 9.52689
             55.5402 10.0491C60.8642 10.7766 65.9928 12.5457
             70.6331 15.2552C75.2735 17.9648 79.3347 21.5619
             82.5849 25.841C84.9175 28.9121 86.7997 32.2913
             88.1811 35.8758C89.083 38.2158 91.5421 39.6781
             93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      {props.text}
    </button>
  );
}

function Div_comment_button_list(props) {
  const { data, depth, loading } = props;
  const isDepth1 = depth === 1;

  const ButtonComp = loading
    ? Div_btn_comment_footer_loading
    : Div_btn_comment_footer;

  return (
    <div class="flex items-center space-x-4">
      {/* depth1: 대댓글 버튼 */}
      {isDepth1 &&
        !loading &&
        gv_username !== "" && (
          <ButtonComp
            text={"대댓글"}
            function={() => click_btn_reply_comment(data.uuid)}
            url_image="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_re_reply.svg"
          />
        )}

      {/* 수정 버튼 */}
      {data &&
        data.check_comment_reader !== "user" &&
        data.active === 1 && (
          <ButtonComp
            text={"수정"}
            function={
              !loading
                ? () => click_btn_edit_comment(data.uuid)
                : undefined
            }
            url_image={
              !loading
                ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg"
                : null
            }
          />
        )}

      {/* 삭제 버튼 */}
      {data &&
        data.check_comment_reader !== "user" &&
        data.active === 1 && (
          <ButtonComp
            text={"삭제"}
            function={
              !loading
                ? () => comment_action("delete", data.uuid)
                : undefined
            }
            url_image={
              !loading
                ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg"
                : null
            }
          />
        )}
    </div>
  );
}

function Div_comment_form(props) {
  const isNewComment = props.uuid_comment == null;
  const commentId = isNewComment ? "new" : props.uuid_comment;

  return (
    <div class={props.class}>
      <p class="flex flex-row underline">{props.title}</p>

      <div
        id={"div_community_read_comment_new_" + (isNewComment ? "form" : commentId + "_form")}
        class="w-full"
      ></div>

      <div
        class="w-full"
        id={"div_comment_editor_footer_button_" + commentId}
      >
        <div class="flex flex-col justify-between items-center w-full space-x-2 space-y-2">
          <div class="flex flex-row justify-start items-center w-full space-x-2">
            <input
              type="file"
              name={"id_file_upload_" + commentId}
              id={"id_file_upload_" + commentId}
              accept="*"
              class="hidden"
              onChange={() =>
                comment_file_action("upload", commentId)
              }
            />

            <button
              type="button"
              class="flex flex-row justify-center items-center py-1.5 px-5 text-white 
                     bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto
                     hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              onClick={() =>
                document
                  .getElementById("id_file_upload_" + commentId)
                  .click()
              }
            >
              <img
                src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/file_upload.svg"
                class="w-4 h-4 mr-2 md:mr-0"
              />
              <p class="block md:hidden">파일 첨부하기</p>
            </button>

            <p id={"txt_filename_" + commentId}></p>
            <p
              id={"txt_file_delete_" + commentId}
              class="hidden"
              onClick={() =>
                comment_file_action("delete", commentId)
              }
            >
              <img
                src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/trash.svg"
                class="w-4 h-4"
              />
            </p>
          </div>

          <div class="flex flex-row justify-end items-center w-full space-x-2">
            <input
              id={"chk_secret_" + commentId}
              type="checkbox"
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              for={"chk_secret_" + commentId}
              class="ms-2 text-sm font-medium text-gray-900"
            >
              <p>
                비밀 댓글
                <span>
                  로 작성하기 (본인과 글 작성자, 관리자만 읽을 수 있습니다.)
                </span>
              </p>
            </label>

            <div
              class="w-fit"
              id={
                "btn_comment_editor_footer_button" +
                (isNewComment ? "" : "_" + commentId)
              }
            >
              <Div_btn_comment_editor_footer_button
                uuid_comment={commentId}
                function={() =>
                  comment_action("submit", commentId)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Div_article_read_comment(props) {
  function Div_comment_header(propsHeader) {
    return (
      <div class="flex flex-row justify-start items-center space-x-2">
        <Span_btn_user
          user_nickname={propsHeader.data.user_nickname}
          role={propsHeader.data.user_role}
        />
        <Span_btn_date date={propsHeader.data.created_at} />
        <Span_btn_comment_secret toggle={propsHeader.data.is_secret} />
        <Span_btn_my_comment toggle={propsHeader.data.check_comment_reader} />
      </div>
    );
  }

  function Div_comment(propsComment) {
    const isDepth2 = propsComment.depth === 2;
    const depthValue = isDepth2 ? 2 : 1;

    const bgColorClass =
      propsComment.data.user_writer == 1
        ? isDepth2
          ? "bg-blue-100 border border-blue-700"
          : "bg-blue-50"
        : isDepth2
        ? "bg-gray-50"
        : "bg-white";

    const comment_depth2_list =
      !isDepth2 &&
      Object.keys(propsComment.data.rereply || {}).map((key) => (
        <Div_comment
          key={propsComment.data.rereply[key].uuid}
          data={propsComment.data.rereply[key]}
          depth={2}
        />
      ));

    let fileHref = "";
    if (propsComment.data.file_url) {
      const raw = propsComment.data.file_url;
      if (
        raw.startsWith("http://") ||
        raw.startsWith("https://")
      ) {
        fileHref = raw;
      } else {
        const normalizedPath = raw.startsWith("/")
          ? raw
          : "/" + raw;
        fileHref =
          window.location.protocol +
          "//" +
          window.location.host +
          normalizedPath;
      }
    }

    return (
      <article
        class={
          "px-6 py-3 " +
          (isDepth2 ? "ml-4 " : "") +
          "text-base " +
          bgColorClass +
          " rounded-xl w-full space-y-2"
        }
      >
        <div class="flex justify-between items-center space-x-2">
          <Div_comment_header data={propsComment.data} />
        </div>

        <div
          class="text-gray-500"
          id={"div_comment_" + propsComment.data.uuid}
        ></div>

        {propsComment.data.file_url != null && (
          <div class="flex flex-row justify-start items-center space-x-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="w-4 h-4 text-gray-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v12a2 2 0 01-2 2z"
              />
            </svg>
            <a
              href={fileHref}
              target="_blank"
              class="hover:underline"
            >
              {propsComment.data.file_name}
            </a>
          </div>
        )}

        <div
          class="w-full"
          id={"div_comment_footer_" + propsComment.data.uuid}
        >
          <Div_comment_button_list
            data={propsComment.data}
            depth={depthValue}
            loading={false}
          />
        </div>

        {comment_depth2_list}

        {!isDepth2 && (
          <div
            id={
              "div_community_read_comment_new_" +
              propsComment.data.uuid
            }
            class="hidden"
          >
            <Div_comment_form
              title={"대댓글 쓰기"}
              class={"mt-4 p-4 bg-white rounded-lg w-full space-y-2"}
              uuid_comment={propsComment.data.uuid}
            />
          </div>
        )}
      </article>
    );
  }

  const comment_list = Object.keys(props.data).map((key) => (
    <Div_comment
      key={props.data[key].uuid}
      data={props.data[key]}
      depth={1}
      is_secret={props.is_secret}
      check_reader={props.check_reader}
    />
  ));

  return (
    <section class="bg-white py-8 lg:py-16 antialiased">
      <div class="w-full mx-auto px-4 space-y-2">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg lg:text-2xl font-bold text-gray-900">
            댓글 ({props.data.length})
          </h2>
        </div>

        <form class="mb-6">
          <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200">
            <div id="div_comment_new" class="w-full"></div>
          </div>
        </form>

        <div class="flex flex-col justify-center items-end w-full space-y-0">
          {comment_list}
        </div>

        {gv_username !== "" && (
          <div
            class="flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full"
            id="div_community_read_comment_new"
          >
            <Div_comment_form
              title={"댓글 쓰기"}
              class={"w-full space-y-2"}
              uuid_comment={null}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function click_btn_reply_comment(uuid_comment) {
  if (!Array.isArray(data_comment_upper)) return;
  data_comment_upper.forEach((c) => {
    const el = document.getElementById(
      "div_community_read_comment_new_" + c.uuid
    );
    if (!el) return;
    if (c.uuid === uuid_comment) {
      el.className =
        "mt-4 p-4 bg-white rounded-lg w-full space-y-2";
    } else {
      el.className = "hidden";
    }
  });
}

async function click_btn_edit_comment(uuid_comment) {
  function Div_comment_editor_form(props) {
    return (
      <div class="w-full">
        <div
          class="w-full"
          id={"div_comment_editor_main_" + props.uuid_comment}
        ></div>
        <div class="flex flex-row justify-end items-center w-full space-x-2 mt-2">
          <input
            id={"chk_secret_" + props.uuid_comment}
            type="checkbox"
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 rounded 
                   focus:ring-blue-500 focus:ring-2"
          />
          <label
            for={"chk_secret_" + props.uuid_comment}
            class="ms-2 text-sm font-medium text-gray-900"
          >
            비밀 댓글로 작성하기 (본인과 글 작성자, 관리자만 읽을 수 있습니다.)
          </label>
          <div
            class="w-fit"
            id={
              "btn_comment_editor_footer_button_" +
              props.uuid_comment
            }
          >
            <Div_btn_comment_editor_footer_button
              uuid_comment={props.uuid_comment}
              function={() =>
                comment_action("edit", props.uuid_comment)
              }
            />
          </div>
        </div>
      </div>
    );
  }

  ReactDOM.render(
    <Div_comment_editor_form uuid_comment={uuid_comment} />,
    document.getElementById("div_comment_" + uuid_comment)
  );

  const { Editor } = toastui;
  const { colorSyntax, tableMergedCell } = Editor.plugin;

  editor[uuid_comment] = new toastui.Editor({
    el: document.querySelector(
      "#div_comment_editor_main_" + uuid_comment
    ),
    previewStyle: "vertical",
    height: "250px",
    initialEditType: "wysiwyg",
    plugins: [colorSyntax, tableMergedCell],
  });

  const target = Object.values(data_comment).find(
    (item) => item.uuid === uuid_comment
  );
  if (target) {
    editor[uuid_comment].setHTML(target.content);
    const chkSecret = document.getElementById("chk_secret_" + uuid_comment);
    if (chkSecret) {
      chkSecret.checked = target.is_secret == 1;
    }
  }
}

async function comment_action(action, uuid_comment) {
  const isNew = uuid_comment === "new";

  if (action === "delete") {
    if (!confirm("정말로 삭제할까요?")) return;

    const isUpper = data_comment_upper
      .map((item) => item.uuid)
      .includes(uuid_comment);

    const target = Object.values(data_comment).find(
      (item) => item.uuid === uuid_comment
    );

    ReactDOM.render(
      <Div_comment_button_list
        data={target || { active: 1, check_comment_reader: "" }}
        depth={isUpper ? 1 : 2}
        loading={true}
      />,
      document.getElementById(
        "div_comment_footer_" + uuid_comment
      )
    );

    const request_data = new FormData();
    request_data.append("uuid", uuid_comment);

    await fetch("/blank/ajax_board/delete_comment/", {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data,
    })
      .then((res) => {
        get_read_article_comment(orderID);
      })
      .then((res) => res);

    return;
  }

  const editorKey = isNew ? "new" : uuid_comment;
  const currentEditor = editor[editorKey];

  if (!currentEditor) {
    alert("에디터가 초기화되지 않았습니다. 새로고침 후 다시 시도해주세요.");
    return;
  }

  const txt_content = currentEditor.getHTML();

  const chk_id = isNew
    ? "chk_secret_new"
    : "chk_secret_" + uuid_comment;
  const secretEl = document.getElementById(chk_id);
  const chk_secret = secretEl ? secretEl.checked : false;

  if (
    txt_content == null ||
    txt_content === "" ||
    txt_content === "<p><br></p>"
  ) {
    alert("내용을 입력해주세요.");
    return;
  }

  const btnId = isNew
    ? "btn_comment_editor_footer_button"
    : "btn_comment_editor_footer_button_" + uuid_comment;

  const btnEl = document.getElementById(btnId);
  if (btnEl) {
    ReactDOM.render(
      <Div_btn_comment_editor_footer_button_loading />,
      btnEl
    );
  }

  const request_data = new FormData();
  let url = "";

  if (action === "submit") {
    url = "/blank/ajax_board/insert_comment/";
    request_data.append("uuid_article", orderID);
    if (!isNew) {
      request_data.append("uuid_comment", uuid_comment);
    }
  } else if (action === "edit") {
    url = "/blank/ajax_board/update_comment/";
    request_data.append("uuid_comment", uuid_comment);
  } else {
    console.error("Unknown comment_action:", action);
    return;
  }

  request_data.append("txt_content", txt_content);
  request_data.append("chk_secret", chk_secret);

  if (action === "submit") {
    const fileIdx = data_file.findIndex(
      (item) => item.uuid_comment === uuid_comment
    );
    if (fileIdx !== -1) {
      request_data.append(
        "attached_file",
        data_file[fileIdx].uuid
      );
    }
  }

  await fetch(url, {
    method: "post",
    headers: { "X-CSRFToken": getCookie("csrftoken") },
    body: request_data,
  })
    .then((res) => {
      get_read_article_comment(orderID);

      const btnElAfter = document.getElementById(btnId);
      if (btnElAfter) {
        ReactDOM.render(
          <Div_btn_comment_editor_footer_button
            uuid_comment={uuid_comment}
            function={() =>
              comment_action(action, uuid_comment)
            }
          />,
          btnElAfter
        );
      }
    })
    .then((res) => res);
}

function comment_file_action(action, uuid_comment) {
  if (action === "delete") {
    const idx = data_file.findIndex(
      (item) => item.uuid_comment === uuid_comment
    );
    if (idx !== -1) data_file.splice(idx, 1);

    const inputEl = document.getElementById(
      "id_file_upload_" + uuid_comment
    );
    if (inputEl) inputEl.value = "";

    const nameEl = document.getElementById(
      "txt_filename_" + uuid_comment
    );
    if (nameEl) nameEl.innerHTML = "";

    const delEl = document.getElementById(
      "txt_file_delete_" + uuid_comment
    );
    if (delEl) delEl.className = "hidden";

    return;
  }

  if (action === "upload") {
    const inputEl = document.getElementById(
      "id_file_upload_" + uuid_comment
    );
    if (!inputEl || !inputEl.files || !inputEl.files[0]) return;

    const formData = new FormData();
    formData.append("file_input", inputEl.files[0]);
    formData.append("host", window.location.href.toString());
    formData.append("note", "Comment");
    formData.append("active", 1);

    $.ajax({
      type: "POST",
      enctype: "multipart/form-data",
      url: "/blank/ajax_file_upload/",
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
      timeout: 600000,
      success: function (filedata) {
        filedata["uuid_comment"] = uuid_comment;

        const existingIndex = data_file.findIndex(
          (item) => item.uuid_comment === uuid_comment
        );
        if (existingIndex !== -1) {
          data_file[existingIndex] = filedata;
        } else {
          data_file.push(filedata);
        }

        const nameEl = document.getElementById(
          "txt_filename_" + uuid_comment
        );
        if (nameEl)
          nameEl.innerHTML = filedata.origin_file_name;

        const delEl = document.getElementById(
          "txt_file_delete_" + uuid_comment
        );
        if (delEl) delEl.className = class_txt_file_delete;
      },
      error: function (e) {
        console.error("File upload error:", e);
      },
    });
  }
}

async function get_read_article_comment(orderID_param) {
  const request_data = new FormData();
  request_data.append("orderID", orderID_param);

  data_comment = await fetch(
    "/blank/ajax_board/get_read_article_comment/",
    {
      method: "post",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: request_data,
    }
  )
    .then((res) => res.json())
    .then((res) => res);

  set_comment();
}

function set_comment() {
	// 0) 댓글 데이터가 아예 없거나 비정상이면 바로 종료
	if (!data_comment) {
		console.warn("[set_comment] data_comment is null or undefined");
		const container = document.getElementById("div_community_read_comment");
		if (container) {
			container.innerHTML = `
				<div class="w-full py-4 text-sm text-gray-500">
					아직 등록된 댓글이 없습니다.
				</div>
			`;
		}
		return;
	}

	// 1) 전체 댓글에서 null/undefined 제거
	const allComments = Object.values(data_comment).filter(c => !!c);

	// 2) Depth 1 필터링 (상위 댓글만)
	data_comment_upper = allComments.filter(item => !item.uuid_upper);

	// 3) 대댓글 묶기
	const list_comment = data_comment_upper.map(comment => {
		return {
			...comment,
			rereply: allComments.filter(item => item.uuid_upper === comment.uuid)
		};
	});

	// 4) React로 댓글 렌더링
	const commentContainer = document.getElementById("div_community_read_comment");
	if (!commentContainer) {
		console.warn("[set_comment] div_community_read_comment not found");
		return;
	}

	// data_article이 아직 없더라도 기본값으로 처리 (타이밍 이슈 방어)
	let uuid_article = null;
	let is_secret = 0;
	let check_reader = "guest";

	if (!data_article) {
		console.warn("[set_comment] data_article is undefined; using fallback values");
	} else {
		uuid_article = data_article.uuid;
		is_secret = data_article.is_secret;
		check_reader = data_article.check_reader;
	}

	ReactDOM.render(
		<Div_article_read_comment
			data={list_comment}
			uuid_article={uuid_article}
			is_secret={is_secret}
			check_reader={check_reader}
		/>,
		commentContainer
	);

	// 5) 댓글 뷰어 설정 (본문 보기)
	allComments.forEach(comment => {
		if (!comment || !comment.uuid) return;
		const el = document.querySelector('#div_comment_' + comment.uuid);
		if (!el) {
			// console.warn(`[set_comment] #div_comment_${comment.uuid} not found`);
			return;
		}
		new toastui.Editor.factory({
			el: el,
			viewer: true,
			initialValue: comment.content || ""
		});
	});

	// 6) 에디터 플러그인 설정
	const { Editor } = toastui;
	const { colorSyntax, tableMergedCell } = Editor.plugin;
	const editorConfig = {
		previewStyle: 'vertical',
		height: '250px',
		initialEditType: 'wysiwyg',
		plugins: [colorSyntax, tableMergedCell],
		hooks: {
			addImageBlobHook: async (blob, callback) => {
				try {
					const compressedBase64 = await compressImage(blob);
					callback(compressedBase64, blob.name);
				} catch (error) {
					alert("이미지 처리에 실패했습니다. 다시 시도해 주세요.");
				}
			},
		},
	};

	// 7) editor 전역 객체 보장
	if (!window.editor) {
		window.editor = {};
	}
	const editor = window.editor;

	// 8) 새 댓글 에디터
	const newFormEl = document.querySelector('#div_community_read_comment_new_form');
	if (newFormEl) {
		editor["new"] = new toastui.Editor({
			el: newFormEl,
			...editorConfig,
		});
		editor["new"].setHTML();
	} else {
		console.warn("[set_comment] #div_community_read_comment_new_form not found");
	}

	// 9) 대댓글 에디터
	data_comment_upper.forEach(comment => {
		if (!comment || !comment.uuid) return;
		const replyEl = document.querySelector(
			'#div_community_read_comment_new_' + comment.uuid + "_form"
		);
		if (!replyEl) {
			// console.warn(`[set_comment] reply form for ${comment.uuid} not found`);
			return;
		}
		editor[comment.uuid] = new toastui.Editor({
			el: replyEl,
			...editorConfig,
		});
		editor[comment.uuid].setHTML();
	});
}

function Div_article_read_buttons(props) {
	const btnClass = "font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
	const writeBtn = `text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 ${btnClass} 
					  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300`
	const listBtn = `text-gray-900 bg-white border border-gray-900 ${btnClass}
					 focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100`
	const editBtn = `text-green-700 border border-green-700 ${btnClass} py-1
					 hover:text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300`
	const deleteBtn = `text-red-700 border border-red-700 ${btnClass} py-1
					   hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300`

	return (
		<div class="flex flex-col justify-center items-center w-full space-y-2">
			<div class="flex flex-col justify-center items-center space-y-2 w-full">
				<button type="button" 
						onClick={() => gv_username ? location.href=init_url+'write/' : alert("로그인이 필요합니다.")}
						class={writeBtn}>
					새 글 쓰기
				</button>
				<a href={init_url} class={listBtn}>목록으로</a>
			</div>
			{props.data.check_reader != "user" && (
				<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
					<button onClick={() => location.href=init_url+"edit/"+orderID+"/"} class={editBtn}>수정</button>
					<button onClick={click_btn_delete} class={deleteBtn}>삭제</button>
				</div>
			)}
		</div>
	)
}

async function notice_set_main_read() {
	function Div_main() {    
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto
						md:px-8">
				<Div_page_header title={header_title} subtitle={header_subtitle} />
			
				<div class="flex flex-col justify-center items-center w-full space-y-4">
					<div class="grid grid-cols-3 justify-center items-start w-full gap-4 md:grid-cols-1">
						<div class="col-span-2 w-full">
							<div class="w-full" id="div_community_read_header">
								<div class="w-full h-12 bg-gray-300 mb-4 animate-pulse"></div>
							</div>
							<div class="w-full" id="div_community_read_content">
								<div class="w-full h-48 bg-gray-300 mb-4 animate-pulse"></div>
							</div>
							<div class="w-full" id="div_community_read_file">
								<div class="w-full h-12 bg-gray-300 mb-4 animate-pulse"></div>
							</div>
							<div class="w-full" id="div_community_read_comment">
								<div class="w-full h-24 bg-gray-300 animate-pulse"></div>
							</div>
						</div>

						<div class="flex flex-col justify-center items-start w-full space-y-4">
							<div id="div_article_read_buttons" class="w-full"></div>
							
							<Div_sidelist_skeleton id={"div_article_famous_list"} title={"최근 인기 글"} />
							<Div_sidelist_skeleton id={"div_new_comment_list"} title={"최근 댓글"} />
							<Div_sidelist_skeleton id={"div_my_article_list"} title={"내가 쓴 글"} />
							<Div_sidelist_skeleton id={"div_my_comment_list"} title={"내가 쓴 댓글"} />

						</div>
					</div>
				</div>
				
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))

	// 기사 + 댓글 로딩
	try {
		await get_read_article("init")
	} catch (e) {
		console.error("[set_main] get_read_article error:", e)
	}

	// 사이드 리스트들은 독립적으로 불러도 됨
	get_article_famous_list()
	get_new_comment_list()
	get_my_article_list()
	get_my_comment_list()
}

function Div_main(props) {    
	return (
		<div class="max-w-screen-xl px-6 py-8 mx-auto space-y-4 md">
			<div id="div_title" class="w-full">
				<input type="text" placeholder="제목을 입력해주세요." id="txt_title" name="txt_title"
					   class="w-full h-[48px] rounded-lg resize-none scroll-hide 
							  text-start text-[14px] font-[500] border-gray-500
							  focus:ring-gray-700 focus:border-gray-700" />
			</div>

			<div id="div_checker" class="flex flex-row justify-end items-center w-full">
				<div class="flex items-center mb-4">
					<input id="chk_secret" type="checkbox" value="" 
						   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
								  focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2" />
					<label for="chk_secret" class="ms-2 text-sm font-medium text-gray-900">비밀글로 작성하기 (본인과 관리자만 읽을 수 있습니다.)</label>
				</div>
			</div>

			<div id="div_editor" class="w-full"></div>

			<div class="flex flex-row justify-start items-center space-x-4">
				<button class="flex flex-row justify-center items-center py-1.5 px-5 text-white 
							bg-blue-700 font-medium rounded-lg text-center text-sm w-fit md:w-auto
							hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
						onClick={() => document.getElementById('id_file_upload').click()} >
					<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/file_upload.svg" class="w-4 h-4 mr-2" />
					파일 첨부하기
				</button>
				<p id="txt_filename"></p>
				<p id="txt_file_delete" class="hidden" onClick={() => click_delete_file()}>
					<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/trash.svg" class="w-4 h-4" />
				</p>
				
			</div>
			
			<div class="w-full" id="div_button_list">
				<Div_button />
			</div>
		</div>
	)
}

function Div_button() {
	return (
		<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
			<button type="button" onClick={() => click_btn_submit()}
					class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full
							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
				완료
			</button>
			<a href={init_url}
			   class="text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5
					  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
				목록으로
			</a>
		</div>
	)
}

function Div_button_loading() {
	return (
		<div class="grid grid-cols-2 justify-center items-center gap-2 w-full">
			<button type="button"
					class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-not-allowed
							hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300">
				<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
				</svg>
				완료
			</button>
			<button type="button"
					class="text-gray-900 bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 cursor-not-allowed
						   focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
				<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
				</svg>
				목록으로
			</button>
		</div>
	)
}

// 프로필 사진 - 새 파일 업로드
function check_file_upload() {
	var formData = new FormData();
	formData.append('file_input', document.getElementById('id_file_upload').files[0]);
	formData.append('host', window.location.href.toString());
	formData.append('note', "Article");
	formData.append('active', 1);

	$.ajax({
		type: "POST",
		enctype: 'multipart/form-data',
		url: "/blank/ajax_file_upload/",
		data: formData,
		processData: false,
		contentType: false,
		cache: false,
		timeout: 600000,
		success: function (filedata) {
			data_file = filedata
			document.getElementById("txt_filename").innerHTML = data_file.origin_file_name
			document.getElementById("txt_file_delete").className = class_txt_file_delete
		},
		error: function (e) {}
	});
}

function click_delete_file_write_impl() {
	data_file = null
	document.getElementById('id_file_upload').value = "";
	document.getElementById("txt_filename").innerHTML = null
	document.getElementById("txt_file_delete").className = "hidden"
}

async function click_btn_submit_write_impl() {
	let txt_title = document.getElementById("txt_title").value.trim()
	let txt_content = editor.getHTML()
	let chk_secret = document.getElementById("chk_secret").checked      // true / false

	if (!toggle_click_submit) {
		// 토글 ON
		toggle_click_submit = true
		ReactDOM.render(<Div_button_loading />, document.getElementById("div_button_list"));


		// 제목을 입력하지 않음
		if (txt_title == null || txt_title == "") {
			alert("제목을 입력해주세요.");


		// 내용을 입력하지 않음
		} else if (txt_content == null || txt_content == "" || txt_content == "<p><br></p>") {
			alert("내용을 입력해주세요.");

			
		// 게시글 등록
		} else {
			const request_data = new FormData();
			request_data.append('tag', url);
			request_data.append('tag_sub', sub);
			request_data.append('txt_title', txt_title);
			request_data.append('txt_content', txt_content);
			request_data.append('chk_secret', chk_secret);
			if (data_file != null) {
				request_data.append('attached_file', data_file.uuid);
			}
			
			const data = await fetch("/blank/ajax_board/insert_article/", {
								method: "post", 
								headers: { "X-CSRFToken": getCookie("csrftoken"), },
								body: request_data
								})
								.then(res=> { return res.json(); })
								.then(res=> { return res; });

			location.href=init_url + "read/" + data.uuid + "/"
		}


		// 토글 OFF
		toggle_click_submit = false
		ReactDOM.render(<Div_button />, document.getElementById("div_button_list"));
	}
}

// ===============================
// 게시판 메인 셋업
// ===============================
async function notice_set_main_write_impl() {        
	// Menu
	if (gv_username != "") {
		ReactDOM.render(<Div_main />, document.getElementById("div_main"))

		const { Editor } = toastui;
		const { colorSyntax } = Editor.plugin;
		const { tableMergedCell } = Editor.plugin;

		editor = new toastui.Editor({
			el: document.querySelector('#div_editor'),
			previewStyle: 'vertical',
			height: '500px',
			initialEditType: 'wysiwyg',
			plugins: [colorSyntax, tableMergedCell],
			hooks: {
				addImageBlobHook: async (blob, callback) => {
					try {
						// console.log("이미지 처리 시작:", blob);

						// blob → 리사이즈 + 압축 + (용량 초과 시) 품질 낮추기
						// 필요하면 여기 숫자만 조절해서 정책 바꾸면 됨
						const compressedBase64 = await compressImage(
							blob,
							1200,   // maxWidth
							1200,   // maxHeight
							0.8,    // 초기 quality
							500     // 목표 최대 용량(KB) (대략 0.5MB)
						);

						// console.log("이미지 압축 및 변환 성공!");

						// 압축된 Base64 데이터를 에디터에 삽입
						callback(compressedBase64, blob.name || "image");
					} catch (error) {
						// console.error("이미지 처리 중 오류 발생:", error);
						alert("이미지 처리에 실패했습니다. 다시 시도해 주세요.");
					}
				},
			}
		});

	} else {
		location.href = init_url
	}
}

function click_delete_file_edit_impl() {
	data_file = null
	data.file_url = null
	data.file_name = null
	document.getElementById('id_file_upload').value = "";
	document.getElementById("txt_filename").innerHTML = null
	document.getElementById("txt_file_delete").className = "hidden"
}

async function click_btn_submit_edit_impl() {
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

async function notice_set_main_edit_impl() {
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

function get_notice_mode() {
    if (mode == null || mode === "" || mode === "None") {
        return "";
    }
    return String(mode).trim().toLowerCase();
}

let click_btn_submit = function () {};
let click_delete_file = function () {};

async function set_main() {
    const currentMode = get_notice_mode();

    if (currentMode === "read") {
        data_article = null;
        data_comment = null;
        data_comment_upper = [];
        class_txt_file_delete = "size-4 min-size-4 max-size-4 rounded-lg hover:bg-red-100 cursor-pointer";
        editor = {};
        window.editor = editor;
        data_file = [];
        return notice_set_main_read();
    }

    if (currentMode === "edit") {
        class_txt_file_delete = "rounded-lg hover:bg-red-100 cursor-pointer";
        toggle_click_submit = false;
        editor = null;
        window.editor = null;
        data = null;
        data_file = null;
        click_btn_submit = click_btn_submit_edit_impl;
        click_delete_file = click_delete_file_edit_impl;
        return notice_set_main_edit_impl();
    }

    if (currentMode === "write") {
        class_txt_file_delete = "rounded-lg hover:bg-red-100 cursor-pointer";
        toggle_click_submit = false;
        editor = null;
        window.editor = null;
        data = null;
        data_file = null;
        click_btn_submit = click_btn_submit_write_impl;
        click_delete_file = click_delete_file_write_impl;
        return notice_set_main_write_impl();
    }

    page_num = 1;
    article_counter = 0;
    toggle_page = false;
    return notice_set_main_list();
}
