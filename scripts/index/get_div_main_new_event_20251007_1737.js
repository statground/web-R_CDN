async function get_div_main_new_event() {
	// 이벤트 → 문구 생성기
	function makeEventMessage(event, nickname) {
		switch (event) {
			case "회원가입":
				return `${nickname}님이 가입하였습니다.`;
			case "접속중":
				return `${nickname}님이 접속중입니다.`;
			case "게시판 - youtube":
				return `유튜브에 새로운 영상이 업로드 되었습니다.`;
			case "게시판 - notice":
				return `새로운 공지사항이 등록되었습니다.`;
			case "댓글":
				return `${nickname}님이 게시물에 댓글을 달았습니다`;
			default:
				if (typeof event === "string") {
					// 게시판 - 로 시작할 경우
					if (event.startsWith("게시판 - ")) {
						return `${nickname}님이 커뮤니티에 새 글을 게시하였습니다.`;
					}
					// Web-R - 로 시작할 경우
					else if (event.startsWith("Web-R - ")) {
						const appName = event.replace("Web-R - ", "");
						return `${nickname}님이 ${appName}을(를) 실행하고 있습니다.`;
					}
				}
				return `${nickname}님의 활동이 있습니다.`;
		}
	}

	function Div_new_event_list(props) {
		const { event, created_at, nickname } = props.data;
		const message = makeEventMessage(event, nickname ?? "회원");

		return (
			<div class="bg-white w-full border-b last:border-b-0">
				<div class="flex flex-col px-6 py-4 space-y-1">
					<div class="text-sm text-gray-800 truncate">{message}</div>
					<div class="flex items-center space-x-2">
						<Span_btn_date date={created_at} />
					</div>
				</div>
			</div>
		);
	}

	function Col(props) {
		// 데이터 배열로 변환 후 created_at 기준으로 정렬 (최신순)
		const sortedData = Object.values(props.data).sort((a, b) => {
			return new Date(b.created_at) - new Date(a.created_at);
		});

		const items = sortedData.map((item, idx) => (
			<Div_new_event_list key={idx} data={item} />
		));

		return (
			<div class="w-full">
				<h5 class="mb-2 text-xl pb-4 font-bold tracking-tight text-gray-900">
					{props.title ?? "최근 활동"}
				</h5>
				<div class="rounded-lg bg-white overflow-hidden">{items}</div>
			</div>
		);
	}

	const data = await fetch("/ajax_index_event/").then((res) => res.json());

	ReactDOM.render(
		<Col data={data} title="최근 활동" />,
		document.getElementById("div_main_new_members")
	);
}