let data_cnt_table_shinyapp = []
let data_cnt_table_visit = []

function Div_page_header(props) {
	return (
		<div class="flex flex-row w-full justify-start items-end text-start mb-8">
			<h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
				<span class="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
			</h1>
			<p class="text-lg font-normal text-gray-500 sm:text-md pb-2">
				{props.subtitle}
			</p>
		</div>
	)
}

// 개별 데이터에서 min/max 날짜 가져오기
function getRangeFromData(data) {
	if (!data || data.length === 0) return null

	let minDate = data[0][0]
	let maxDate = data[0][0]

	for (let i = 0; i < data.length; i++) {
		const d = data[i][0]
		if (d < minDate) minDate = d
		if (d > maxDate) maxDate = d
	}
	return { minDate, maxDate }
}

// 두 차트의 전체 날짜 범위 계산
function getGlobalRange() {
	const rangeShiny = getRangeFromData(data_cnt_table_shinyapp)
	const rangeVisit = getRangeFromData(data_cnt_table_visit)

	if (!rangeShiny && !rangeVisit) return null
	if (rangeShiny && !rangeVisit) return rangeShiny
	if (!rangeShiny && rangeVisit) return rangeVisit

	const minDate = (rangeShiny.minDate < rangeVisit.minDate) ? rangeShiny.minDate : rangeVisit.minDate
	const maxDate = (rangeShiny.maxDate > rangeVisit.maxDate) ? rangeShiny.maxDate : rangeVisit.maxDate

	return { minDate, maxDate }
}

function buildCalendarOption(title, data, globalRange) {
	if (!data || data.length === 0) {
		return {
			title: {
				text: title,
				left: "center",
				top: 16,
				textStyle: { fontSize: 13, fontWeight: "bold" }
			},
			graphic: {
				type: "text",
				left: "center",
				top: "middle",
				style: {
					text: "표시할 데이터가 없습니다.",
					fontSize: 12,
					fill: "#9ca3af"
				}
			}
		}
	}

	let maxCnt = 0
	for (let i = 0; i < data.length; i++) {
		const c = Number(data[i][1] || 0)
		if (c > maxCnt) maxCnt = c
	}

	let minDate, maxDate
	if (globalRange) {
		minDate = globalRange.minDate
		maxDate = globalRange.maxDate
	} else {
		const ownRange = getRangeFromData(data)
		minDate = ownRange.minDate
		maxDate = ownRange.maxDate
	}

	return {
		title: {
			text: title,
			left: "center",
			top: 16,
			textStyle: { fontSize: 13, fontWeight: "bold" }
		},
		tooltip: {
			position: "top",
			formatter: function (p) {
				const value = p.value
				return value[0] + "<br/>횟수: " + value[1] + "회"
			}
		},
		visualMap: {
			min: 0,
			max: maxCnt || 1,
			calculable: false,
			orient: "horizontal",
			left: "center",
			top: 26
		},
		calendar: {
			top: 95,
			left: 40,
			right: 20,
			cellSize: ["auto", 16],
			range: [minDate, maxDate],
			itemStyle: {
				borderWidth: 0.5,
				borderColor: "#e5e7eb"
			},
			yearLabel: { show: false },
			monthLabel: { nameMap: "en", margin: 18 },
			dayLabel: { firstDay: 0, nameMap: ["일", "월", "화", "수", "목", "금", "토"] }
		},
		series: [
			{
				name: title,
				type: "heatmap",
				coordinateSystem: "calendar",
				data: data
			}
		]
	}
}

function drawCalendarChart(domId, title, data, globalRange) {
	const dom = document.getElementById(domId)
	if (!dom || typeof echarts === "undefined") {
		return
	}
	const chart = echarts.init(dom)
	const option = buildCalendarOption(title, data, globalRange)
	chart.setOption(option)
	window.addEventListener("resize", function () {
		chart.resize()
	})
}

function drawChart_data_cnt_table_shinyapp() {
	const globalRange = getGlobalRange()
	drawCalendarChart(
		"div_tab_connection_content_cnt_table_shinyapps",
		"Shiny 앱 실행 기록",
		data_cnt_table_shinyapp,
		globalRange
	)
}

function drawChart_data_cnt_table_visit() {
	const globalRange = getGlobalRange()
	drawCalendarChart(
		"div_tab_connection_content_cnt_table_visit",
		"웹사이트 접속 기록",
		data_cnt_table_visit,
		globalRange
	)
}

async function get_myinfo_connection() {
	function Div_tab_connection_content() {
		return (
			<div class="flex flex-col justify-center items-center w-full space-y-4 p-4 md:space-y-0 md:p-0">
				<div id="div_tab_connection_content_cnt_table_shinyapps"
					 class="flex flex-row justify-center items-center w-full h-[260px] md:h-[220px]"></div>
				<div id="div_tab_connection_content_cnt_table_visit"
					 class="flex flex-row justify-center items-center w-full h-[260px] md:h-[220px]"></div>
			</div>
		)
	}

	const tempdata = await fetch("/account/ajax_get_myinfo_connection/")
		.then(res => res.json())

	data_cnt_table_shinyapp = []
	const tempdata_cnt_table_shinyapp = tempdata.cnt_table_shinyapp || {}
	for (let i = 0; i < Object.keys(tempdata_cnt_table_shinyapp).length; i++) {
		const obj = tempdata_cnt_table_shinyapp[Object.keys(tempdata_cnt_table_shinyapp)[i]]
		data_cnt_table_shinyapp.push([obj.date, Number(obj.cnt)])
	}

	data_cnt_table_visit = []
	const tempdata_cnt_table_visit = tempdata.cnt_table_visit || {}
	for (let i = 0; i < Object.keys(tempdata_cnt_table_visit).length; i++) {
		const obj = tempdata_cnt_table_visit[Object.keys(tempdata_cnt_table_visit)[i]]
		data_cnt_table_visit.push([obj.date, Number(obj.cnt)])
	}

	ReactDOM.render(
		<Div_tab_connection_content />,
		document.getElementById("div_tab_connection_content")
	)

	drawChart_data_cnt_table_shinyapp()
	drawChart_data_cnt_table_visit()
}

function buildArticleUrlFromArticle(d) {
	let url = "/community/"
	if (d.category_url) {
		url += d.category_url + "/"
	}
	if (d.category_url_sub) {
		url += d.category_url_sub + "/"
	}
	url += d.uuid + "/"
	return url
}

async function get_myinfo_article_content() {
	function ArticleItem(props) {
		const d = props.data
		const href = buildArticleUrlFromArticle(d)

		return (
			<div class="flex flex-col w-full py-2 border-b border-gray-100 last:border-b-0">
				<a href={href} class="group flex flex-col w-full">
					<div class="flex items-center gap-2 mb-1">
						<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-[11px] text-blue-700">
							{d.category || "게시판"}
						</span>
						<span class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
							{d.title}
						</span>
					</div>
					<div class="flex items-center gap-3 text-[11px] text-gray-500">
						<span>{d.created_at}</span>
						<span>조회 {d.cnt_read}</span>
						<span>댓글 {d.cnt_comment}</span>
					</div>
				</a>
			</div>
		)
	}

	function ArticleList(props) {
		const listAll = Object.values(props.data || {})
		const [expanded, setExpanded] = React.useState(false)

		if (!listAll.length) {
			return (
				<div class="flex flex-col justify-center items-start w-full py-4 text-sm text-gray-500">
					<p>작성한 글이 없습니다.</p>
				</div>
			)
		}

		const visibleList = expanded ? listAll : listAll.slice(0, 3)

		return (
			<div class="flex flex-col w-full">
				<div class="flex flex-col">
					{visibleList.map(function (row, idx) {
						return <ArticleItem key={idx} data={row} />
					})}
				</div>
				{listAll.length > 3 && (
					<div class="flex justify-center mt-3">
						<button
							type="button"
							class="px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
							onClick={function () { setExpanded(!expanded) }}
						>
							{expanded ? "접기" : "펼치기"}
						</button>
					</div>
				)}
			</div>
		)
	}

	const tempdata = await fetch("/account/ajax_get_myinfo_article/")
		.then(function (res) { return res.json() })

	ReactDOM.render(
		<ArticleList data={tempdata.list} />,
		document.getElementById("div_tab_article_content")
	)
}

function buildArticleUrlFromComment(d) {
	let url = "/community/"
	if (d.article_category_url) {
		url += d.article_category_url + "/"
	}
	if (d.article_category_url_sub) {
		url += d.article_category_url_sub + "/"
	}
	url += d.uuid_article + "/"
	return url
}

async function get_myinfo_comment_content() {
	function stripHtml(str) {
		if (!str) return ""
		return str.replace(/<[^>]+>/g, "")
	}

	function CommentItem(props) {
		const d = props.data
		const text = stripHtml(d.content)
		const href = buildArticleUrlFromComment(d)

		return (
			<div class="flex flex-col w-full py-2 border-b border-gray-100 last:border-b-0">
				<a href={href} class="group flex flex-col w-full">
					<div class="flex items-center gap-2 mb-1">
						<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-[11px] text-emerald-700">
							{d.category_name || "게시판"}
						</span>
						<span class="text-xs text-gray-500 group-hover:text-blue-600">
							{d.article_title}
						</span>
					</div>
					<div class="text-sm text-gray-900 mb-1 group-hover:text-blue-600">
						{text}
					</div>
					<div class="flex items-center gap-3 text-[11px] text-gray-500">
						<span>{d.created_at}</span>
					</div>
				</a>
			</div>
		)
	}

	function CommentList(props) {
		const listAll = Object.values(props.data || {})
		const [expanded, setExpanded] = React.useState(false)

		if (!listAll.length) {
			return (
				<div class="flex flex-col justify-center items-start w-full py-4 text-sm text-gray-500">
					<p>작성한 댓글이 없습니다.</p>
				</div>
			)
		}

		const visibleList = expanded ? listAll : listAll.slice(0, 3)

		return (
			<div class="flex flex-col w-full">
				<div class="flex flex-col">
					{visibleList.map(function (row, idx) {
						return <CommentItem key={idx} data={row} />
					})}
				</div>
				{listAll.length > 3 && (
					<div class="flex justify-center mt-3">
						<button
							type="button"
							class="px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
							onClick={function () { setExpanded(!expanded) }}
						>
							{expanded ? "접기" : "펼치기"}
						</button>
					</div>
				)}
			</div>
		)
	}

	const tempdata = await fetch("/account/ajax_get_myinfo_comment/")
		.then(function (res) { return res.json() })

	ReactDOM.render(
		<CommentList data={tempdata.list} />,
		document.getElementById("div_tab_comment_content")
	)
}

async function get_myinfo_payment_content() {
	function formatAmount(amt) {
		if (amt === null || amt === undefined) return ""
		const n = Number(amt) || 0
		return n.toLocaleString("ko-KR") + "원"
	}

	function StatusBadge(props) {
		const status = props.status || ""
		let label = status
		let cls = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium "

		if (status === "DONE") {
			label = "결제 완료"
			cls += "bg-emerald-50 text-emerald-700"
		} else if (status === "ABORTED") {
			label = "결제 취소"
			cls += "bg-red-50 text-red-600"
		} else {
			cls += "bg-gray-100 text-gray-500"
		}

		return <span class={cls}>{label}</span>
	}

	function PaymentItem(props) {
		const d = props.data
		const title = d.product_name || "기타 결제"
		const method = d.method || ""
		const created = d.created_at || ""
		const amountStr = formatAmount(d.amount)

		let href = "#"
		if (d.status === "DONE") {
			href = "/intro/membership/result/?orderId=" +
				   encodeURIComponent(d.order_id || "") +
				   "&amount=" + encodeURIComponent(d.amount || 0)
		}

		return (
			<a href={href}
			   target={href === "#" ? "_self" : "_blank"}
			   class="group flex flex-col w-full border-b border-gray-100 last:border-b-0 py-3">
				<div class="flex items-center justify-between mb-1">
					<div class="flex flex-col">
						<p class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
							{title}
						</p>
						<p class="text-xs text-gray-400 mt-0.5">
							{created} · {method}
						</p>
					</div>
					<div class="flex flex-col items-end gap-1">
						<p class="text-sm font-semibold text-gray-900">{amountStr}</p>
						<StatusBadge status={d.status} />
					</div>
				</div>
			</a>
		)
	}

	function PaymentList(props) {
		const listAll = Object.values(props.data || {})
		if (!listAll.length) {
			return <Col_nothing />
		}

		return (
			<div class="flex flex-col w-full">
				{listAll.map(function (row, idx) {
					return <PaymentItem key={idx} data={row} />
				})}
			</div>
		)
	}

	function Col_nothing() {
		return (
			<div class="flex flex-col justify-center items-start w-full py-4 text-sm text-gray-500">
				<p>결제 내역이 없습니다.</p>
			</div>
		)
	}

	function Col_error() {
		return (
			<div class="flex flex-col justify-center items-start w-full py-4 text-sm text-red-500">
				<p>결제 내역을 불러오는 중 오류가 발생했습니다.</p>
			</div>
		)
	}

	let tempdata = null
	try {
		const res = await fetch("/account/ajax_get_myinfo_payment/")
		if (!res.ok) {
			ReactDOM.render(<Col_error />, document.getElementById("div_tab_payment_content"))
			return
		}
		tempdata = await res.json()
	} catch (e) {
		ReactDOM.render(<Col_error />, document.getElementById("div_tab_payment_content"))
		return
	}

	if (!tempdata || !tempdata.count || !tempdata.count["0"] || tempdata.count["0"].cnt === 0) {
		ReactDOM.render(<Col_nothing />, document.getElementById("div_tab_payment_content"))
	} else {
		ReactDOM.render(
			<PaymentList data={tempdata.list} />,
			document.getElementById("div_tab_payment_content")
		)
	}
}

async function get_userinfo() {
	function Div_main_userinfo(props) {
		return (
			<div class="grid grid-cols-5 justify-center items-start gap-8 w-full md:grid-cols-1 p-4">

				<div class="flex flex-col justify-center items-center border border-blue-100 rounded-xl w-full px-4 py-8 space-y-2 bg-white shadow-sm">
					<p class="text-sm">{props.data.email}</p>
					<p class="text-2xl font-extrabold">{props.data.name}</p>
					<p class="text-sm">
						{props.data.realname}　|　{props.data.gender}
					</p>

					<div class="py-4"></div>

					<p class="text-lg font-extrabold">{props.data.role}</p>
					<p class="text-sm">가입 일자: {props.data.date_joined}</p>

					{
						props.data.expired_at == null
							? <p class="text-sm">회원등급 만료일: 무제한</p>
							: <p class="text-sm">회원등급 만료일: {props.data.expired_at}</p>
					}

					<div class="py-4"></div>

					{
						props.data.email_subscription == 1
							? <p class="text-sm text-green-500">이메일 수신 허용</p>
							: <p class="text-sm text-gray-500">이메일 수신 거부</p>
					}

					<div class="py-4"></div>

					<a
						href="/account/myinfo/edit/"
						class="text-white bg-blue-700 font-medium rounded-lg text-sm text-center px-5 py-2.5 w-full
							   hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
					>
						회원정보 수정하기
					</a>
					<a
						href="/account/change_password/"
						class="text-white bg-blue-700 font-medium rounded-lg text-sm text-center px-5 py-2.5 w-full
							   hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
					>
						비밀번호 변경하기
					</a>
				</div>

				<div class="col-span-4 flex flex-col justify-start items-start rounded-xl w-full bg-white border border-gray-200 shadow-sm">
					<div class="w-full p-6 space-y-10">

						<section class="space-y-3">
							<div>
								<p class="text-base font-bold text-gray-900">내 접속 기록</p>
								<p class="text-xs text-gray-400 mt-1">
									Web-R 접속 횟수와 Shiny 앱 실행 기록을 캘린더로 확인할 수 있습니다.
								</p>
							</div>

							<div id="div_tab_connection_content" class="w-full">
								<div class="flex flex-col md:flex-row gap-4 w-full">
									<div class="bg-gray-100 w-full h-[260px] rounded-xl animate-pulse"></div>
									<div class="bg-gray-100 w-full h-[260px] rounded-xl animate-pulse"></div>
								</div>
							</div>
						</section>

						<hr class="border-gray-200" />

						<section class="space-y-3">
							<div class="flex flex-row md:flex-col md:gap-10 w-full items-start">
								<div class="flex-1 space-y-3">
									<div>
										<p class="text-base font-bold text-gray-900">내가 쓴 글</p>
										<p class="text-xs text-gray-400 mt-1">
											커뮤니티, 도서, 워크샵 게시판 등 내가 작성한 글 목록입니다.
										</p>
									</div>

									<div id="div_tab_article_content" class="w-full">
										<div class="bg-gray-100 w-full h-[200px] rounded-xl animate-pulse"></div>
									</div>
								</div>

								<div class="flex-1 space-y-3 mt-0 md:mt-8">
									<div>
										<p class="text-base font-bold text-gray-900">내가 쓴 댓글</p>
										<p class="text-xs text-gray-400 mt-1">
											질문/답변, 자유 게시판 등에서 남긴 댓글들을 모아 보여줍니다.
										</p>
									</div>

									<div id="div_tab_comment_content" class="w-full">
										<div class="bg-gray-100 w-full h-[200px] rounded-xl animate-pulse"></div>
									</div>
								</div>

							</div>
						</section>

						<hr class="border-gray-200" />

						<section class="space-y-3">
							<div class="flex justify-between items-baseline">
								<div>
									<p class="text-base font-bold text-gray-900">결제 내역</p>
									<p class="text-xs text-gray-400 mt-1">멤버십, 강의, 워크샵 등 Web-R에서 결제한 내역입니다.</p>
								</div>
							</div>

							<div id="div_tab_payment_content" class="w-full">
								<div class="bg-gray-100 w-full h-[200px] rounded-xl animate-pulse"></div>
							</div>
						</section>

					</div>
				</div>

			</div>
		)
	}

	const data = await fetch("/account/ajax_get_myinfo/")
		.then(res => res.json())

	ReactDOM.render(
		<Div_main_userinfo data={data} />,
		document.getElementById("div_main_userinfo")
	)

	get_myinfo_connection()
	get_myinfo_article_content()
	get_myinfo_comment_content()
	get_myinfo_payment_content()
}

function set_main() {
	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={"내 정보"} />

				<div class="flex w-full" id="div_main_userinfo">
					<div class="flex flex-col justify-center items-center w-full space-y-4 mb-4 animate-pulse">
						<div class="flex flex-row justify-center items-center space-x-2">
							<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
							</svg>
							<p>회원 정보를 불러오는 중입니다.</p>
						</div>
						<div class="h-2.5 mx-auto bg-gray-300 rounded-full w-1/4"></div>
						<div class="h-2.5 mx-auto bg-gray-300 rounded-full w-1/2"></div>
						<div class="h-2.5 mx-auto bg-gray-300 rounded-full w-1/3"></div>
						<div class="h-2.5 mx-auto bg-gray-300 rounded-full w-1/2"></div>
						<div class="flex items-center justify-center mt-4">
							<svg class="w-8 h-8 text-gray-200 me-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
							</svg>
							<div class="w-20 h-2.5 bg-gray-200 rounded-full me-3"></div>
							<div class="w-24 h-2 bg-gray-200 rounded-full"></div>
						</div>
						<span class="sr-only">Loading...</span>
					</div>
				</div>
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	get_userinfo()
}
