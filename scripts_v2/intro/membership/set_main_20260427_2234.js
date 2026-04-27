// scripts/intro/membership/set_main.js
// /intro/membership/ 메인 + result 를 하나의 route-aware set_main.js 로 통합한 버전

function getIntroMembershipMode() {
    if (typeof mode === "undefined" || mode == null || mode === "None") {
        return "";
    }
    return String(mode).trim().toLowerCase();
}

const IntroMembershipMain = (() => {
// ===== scripts/common/div/Div_page_header.js =====
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

// ===== scripts/intro/membership/main/init_variables.js =====
let data = null

const MEMBERSHIP_EXTENDABLE_ROLES = ["정회원", "VIP회원", "기관회원", "기업회원"];
const MEMBERSHIP_NO_EXPIRE_DISPLAY_ROLES = ["준회원", "게스트", "관리자"];

function normalizeMembershipRole(role) {
	return String(role || "").replace(/\s+/g, "");
}

function isAdministratorMembershipRole(role) {
	return normalizeMembershipRole(role) === "관리자";
}

function isExtendableMembershipRole(role) {
	return MEMBERSHIP_EXTENDABLE_ROLES.includes(normalizeMembershipRole(role));
}

function shouldShowMembershipExpiredAt(userinfo) {
	if (userinfo == null) {
		return false;
	}

	const normalizedRole = normalizeMembershipRole(userinfo.role);
	if (MEMBERSHIP_NO_EXPIRE_DISPLAY_ROLES.includes(normalizedRole)) {
		return false;
	}

	return isExtendableMembershipRole(normalizedRole) && userinfo.expired_at != null && userinfo.expired_at !== "";
}

function canSelectMembershipProduct(userinfo) {
	return userinfo != null && !isAdministratorMembershipRole(userinfo.role);
}

function parseMembershipDateTime(value) {
	if (value == null || value === "") {
		return null;
	}

	const text = String(value).trim();
	const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?/);

	if (match) {
		const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;
		return new Date(
			Number(year),
			Number(month) - 1,
			Number(day),
			Number(hour),
			Number(minute),
			Number(second)
		);
	}

	const parsed = new Date(text);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function addOneYearLocal(baseDate) {
	const result = new Date(baseDate.getTime());
	result.setFullYear(result.getFullYear() + 1);
	return result;
}

function formatMembershipDateTime(date) {
	const pad = (value) => String(value).padStart(2, "0");
	return [
		date.getFullYear(),
		pad(date.getMonth() + 1),
		pad(date.getDate())
	].join("-") + " " + [
		pad(date.getHours()),
		pad(date.getMinutes()),
		pad(date.getSeconds())
	].join(":");
}

function getExpectedMembershipExpiredAt(userinfo) {
	const now = new Date();
	const currentExpiredAt = parseMembershipDateTime(userinfo && userinfo.expired_at);
	const canExtendCurrentExpiry =
		isExtendableMembershipRole(userinfo && userinfo.role) &&
		currentExpiredAt != null &&
		currentExpiredAt.getTime() >= now.getTime();

	const baseDate = canExtendCurrentExpiry ? currentExpiredAt : now;
	return addOneYearLocal(baseDate);
}

function getDisabledMembershipSelectMessage(userinfo) {
	if (isAdministratorMembershipRole(userinfo && userinfo.role)) {
		return "관리자 계정은 멤버십 결제가 필요하지 않습니다.";
	}
	return "선택할 수 없습니다.";
}

// ===== scripts/intro/membership/main/get_user_membership_info_20250127_0029.js =====
async function get_user_membership_info() {
	const Div_membership_userinfo_not_login = () => {
		return (
			<div class="flex flex-row justify-center items-center h-[200px]">
				<p>로그인이 필요합니다.</p>
			</div>
		)
	}

	const Div_membership_userinfo = (props) => {
		return (
			<div class="flex flex-col justify-center items-center border border-blue-100 bg-gray-100 rounded-xl w-full px-4 py-8 space-y-2">
				<p class="font-extrabold underline">회원 정보</p>

				<div class="py-1"></div>

				<p class="text-sm">{data.email}</p>
				<p class="text-2xl font-extrabold">{data.name}</p>
				<p class="text-sm">{data.realname}　|　{data.gender}</p>
				
				<div class="py-4"></div>

				<p class="text-lg font-extrabold" id="div_membership_p_role">{data.role}</p>
				<p class="text-sm">가입 일자: {data.date_joined}</p>

				{
					shouldShowMembershipExpiredAt(data) && (
						<p class="text-sm">회원등급 만료일: {data.expired_at}</p>
					)
				}
				<p class="hidden" id="div_membership_p_expect_expired_at"></p>
				<p class="hidden" id="div_membership_p_expect_price"></p>

				<div class="py-4"></div>

				<div id="div_membership_payment_button_list" class="flex flex-col justify-center items-center w-full">
					<p class="text-red-500">결제 방법을 선택해주세요.</p>
				</div>
			</div>
		)
	}

	
	const Div_card_button = (props) => {
		const disabled = props.disabled === true;
		const class_button = disabled
			? "text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full cursor-not-allowed opacity-60"
			: "text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full hover:bg-blue-800 focus:ring-4 focus:ring-blue-300";

		return (
			<button type="button" disabled={disabled}
					onClick={() => { if (!disabled) click_card_button(props.select_role, props.price); }}
					class={class_button}
					aria-disabled={disabled ? "true" : "false"}
					title={disabled ? getDisabledMembershipSelectMessage(data) : ""}>
				선택
			</button>
		)
	}


	const Div_payment_button = (props) => {
		let class_button = "text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"

		return (
			<div class="flex flex-col justify-center items-center w-full space-y-2">
				<button type="button" class={class_button} onClick={() => request_order_id(props.select_role, "카드")}>
					카드결제
				</button>
				<button type="button" class={class_button} onClick={() => request_order_id(props.select_role, "가상계좌")}>
					가상계좌 결제
				</button>
				<button type="button" class={class_button} onClick={() => request_order_id(props.select_role, "계좌이체")}>
					계좌 이체
				</button>
			</div>
		)
	}
	
	function click_card_button(select_role, price) {
		if (!canSelectMembershipProduct(data)) {
			document.getElementById("div_membership_payment_button_list").innerHTML = "<p class='text-sm text-gray-500'>" + getDisabledMembershipSelectMessage(data) + "</p>";
			return;
		}

		// 바뀌게 될 등급
		if (data.role != select_role) {
			document.getElementById("div_membership_p_role").innerHTML = data.role + " → " + "<span class='text-green-700'>" + select_role + "</span>"
		} else {
			document.getElementById("div_membership_p_role").innerHTML = "<span class='text-green-700'>" + select_role + "</span>"
		}


		// 만료일 계산
		// - 정회원/VIP회원/기관회원이고 현재 만료일이 아직 지나지 않았으면: 현재 만료일 + 1년
		// - 준회원/게스트/만료회원이면: 오늘 + 1년
		const expectedExpiredAt = getExpectedMembershipExpiredAt(data);

		document.getElementById("div_membership_p_expect_expired_at").innerHTML = "<span class='text-red-700 font-extrabold'>" + "예상 만료일: " + formatMembershipDateTime(expectedExpiredAt) + "</span>"
		document.getElementById("div_membership_p_expect_expired_at").className = "text-sm"


		// 결제 금액 계산
		document.getElementById("div_membership_p_expect_price").innerHTML = "<span class='text-red-700 font-extrabold'>" + "예상 결제 금액: " + price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "원</span>"
		document.getElementById("div_membership_p_expect_price").className = "text-sm"


		// 결제 버튼
		ReactDOM.render(<Div_payment_button select_role={select_role} />, document.getElementById("div_membership_payment_button_list"))
	}


	if (gv_username == "") {
		ReactDOM.render(<Div_membership_userinfo_not_login />, document.getElementById("div_membership_userinfo"))

	} else {         
		data = await fetch("/account/ajax_get_userinfo/")
			.then(res=> { return res.json(); })
			.then(res=> { return res; });

		ReactDOM.render(<Div_membership_userinfo />, document.getElementById("div_membership_userinfo"))

		const disableMembershipSelect = !canSelectMembershipProduct(data);
		ReactDOM.render(<Div_card_button select_role={"정회원"} price={100000} disabled={disableMembershipSelect} />, document.getElementById("div_membership_card_button_regular"))
		ReactDOM.render(<Div_card_button select_role={"VIP회원"} price={1000000} disabled={disableMembershipSelect} />, document.getElementById("div_membership_card_button_vip"))
		ReactDOM.render(<Div_card_button select_role={"기관회원"} price={2000000} disabled={disableMembershipSelect} />, document.getElementById("div_membership_card_button_corp"))

		if (disableMembershipSelect) {
			document.getElementById("div_membership_payment_button_list").innerHTML = "<p class='text-sm text-gray-500'>" + getDisabledMembershipSelectMessage(data) + "</p>";
		}
	}
}

// ===== scripts/intro/membership/main/request_order_id_20251004_0147.js =====
async function request_order_id(product_name = "", method = "") {
	const productIds = {
		"정회원": "3fe38b90-6cf9-45de-b732-2933ef100347",
		"VIP회원": "ac3d82de-e6a5-4a48-8029-5f59d22749fa", 
		"기관회원": "356e84f3-211c-4ac7-8aee-ca6f75017134"
	};

	const result_url = "https://" + window.location.host + "/intro/membership/result/";
	const product_id = productIds[product_name];

	const paymentMethods = {
		'카드': {
			options: {
				amount: null, orderId: null, orderName: null, customerName: data.realname, successUrl: result_url, failUrl: result_url
			}
		},
		'가상계좌': {
			options: {
				amount: null, orderId: null, orderName: null, customerName: data.realname, successUrl: result_url, failUrl: result_url, validHours: 24, cashReceipt: {type: '소득공제'}
			}
		},
		'계좌이체': {
			options: {
				amount: null, orderId: null, orderName: null, customerName: data.realname, successUrl: result_url, failUrl: result_url
			}
		}
	};

	const tempdata = await fetch("/ajax_request_order_id/?product_id=" + product_id + "&type=membership")
						   .then(res => res.json());

	if (tempdata.error) {
		alert(tempdata.message || "결제 요청을 준비할 수 없습니다.");
		return;
	}

	if (method in paymentMethods) {
		const tossPayments = TossPayments(tempdata.client_key);
		const options = paymentMethods[method].options;
		options.amount = tempdata.amount;
		options.orderId = tempdata.orderID;
		options.orderName = tempdata.product_name;
		
		tossPayments.requestPayment(method, options);
	}
}

// ===== scripts/intro/membership/main/set_main_20241225_1014.js =====
function intro_membership_main_set_main() {
	const Div_card_header = ({name, description, price}) => (
		<div class="w-full">
			<h3 class="mb-4 text-2xl font-semibold">{name}</h3>
			<p class="font-light text-md text-gray-500">{description}</p>
			<div class="flex justify-center items-baseline my-8">
				<span class="mr-2 text-2xl font-extrabold">￦{price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span>
				<span class="text-gray-500">/년</span>
			</div>
		</div>
	)

	const Div_card_li = ({text}) => (
		<li class="flex items-center space-x-3">
			<svg class="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
			</svg>
			<span>{text}</span>
		</li>                
	)

	const MembershipCard = ({name, description, price, features = [], buttonId}) => (
		<div class="flex flex-col justify-center items-center p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow w-full">
			<Div_card_header name={name} description={description} price={price} />
			{features.length > 0 && (
				<ul role="list" class="mb-8 space-y-4 text-left">
					{features.map((text, i) => <Div_card_li key={i} text={text} />)}
				</ul>
			)}
			<div class="w-full" id={buttonId}></div>
		</div>
	)

	function Div_main() {
		return (
			<div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
				<Div_page_header title={"정회원 가입"} />

				<div class="grid grid-cols-4 justify-center items-start gap-4 w-full md:flex md:flex-col md:space-y-4 md:gap-0">
					<div class="flex flex-col justify-center items-center w-full" id="div_membership_userinfo">
						<div class="flex flex-col justify-center items-center w-full space-y-4 mb-4 animate-pulse">
							<div class="flex flex-row justify-center items-center space-x-2">
								<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
								</svg>
								<p>회원 정보를 불러오는 중입니다.</p>
							</div>
							{[1/4, 1/2, 1/3, 1/2].map((width, i) => (
								<div key={i} class={`h-2.5 mx-auto bg-gray-300 rounded-full w-${width}`}></div>
							))}
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

					<MembershipCard 
						name="정회원"
						description="정회원용 프로그램을 이용하실 수 있습니다."
						price={100000}
						buttonId="div_membership_card_button_regular"
					/>

					<MembershipCard 
						name="VIP회원"
						description="원하실 경우 private 앱을 만들어 드립니다."
						price={1000000}
						features={[
							"Private 앱은 특별회원님만 접속 가능하며 다른 분들은 접속할 수 없습니다.",
							"Private 앱에는 데이터의 저장 기능이 있어 자신의 데이터를 저장해 놓을 수 있습니다."
						]}
						buttonId="div_membership_card_button_vip"
					/>

					<MembershipCard 
						name="기관회원"
						description="원하실 경우 전용 앱을 만들어드립니다."
						price={2000000}
						features={[
							"원하실 경우 전용 앱을 만들어드립니다.",
							"데이터의 저장 기능이 있으며 데이터를 저장해 놓을 경우 같은 단체의 회원들은 데이터를 공유하실 수 있습니다."
						]}
						buttonId="div_membership_card_button_corp"
					/>
				</div>
			</div>
		)
	}

	ReactDOM.render(<Div_main />, document.getElementById("div_main"))
	get_user_membership_info()
}

    return {
        set_main: intro_membership_main_set_main
    };
})();

const IntroMembershipResult = (() => {
// ===== scripts/intro/membership/result/get_result_order_id_20251004_0344.js =====
/** =========================================================
 * 결제 결과 화면 (경량화/통합 + 유연 JSON 대응 + 중복실행 방지)
 * - 공통 레이아웃 컴포넌트로 중복 제거
 * - deep getter + 키이름 딥서치로 JSON 변경 대응
 * - "이미 처리된 결제입니다" 문구는 미표시(필터링)
 * - window.__main_loaded__ 플래그로 set_main 중복 실행 방지
 * =========================================================**/

/* ---------- 유틸 ---------- */
const fmt = (n) => (Number(n) || 0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

const deepGet = (obj, path) => {
  if (!obj || !path) return undefined;
  const parts = Array.isArray(path) ? path : String(path).split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
    else return undefined;
  }
  return cur;
};

const tryGet = (obj, candidatePaths = [], fallback = undefined) => {
  for (const p of candidatePaths) {
    const v = deepGet(obj, p);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
};

// 첫 매칭을 반환하는 딥서치
const deepFindFirst = (obj, predicate, path = []) => {
  if (obj && typeof obj === "object") {
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      const p = path.concat(k);
      if (predicate(k, v, p)) return { value: v, path: p };
      if (v && typeof v === "object") {
        const found = deepFindFirst(v, predicate, p);
        if (found) return found;
      }
    }
  }
  return null;
};

// 키이름 후보(부분일치)로 탐색
const findByKeyNames = (obj, keyCandidates = []) => {
  const lc = keyCandidates.map((s) => s.toLowerCase());
  const found = deepFindFirst(obj, (k) => lc.some((cand) => k.toLowerCase().includes(cand)));
  return found ? found.value : undefined;
};

// 템플릿/URL 파라미터 병합
let payment_key = "{{payment_key}}";
let amount = "{{amount}}";
let orderID = "{{orderID}}";
(() => {
  const url = new URL(window.location.href);
  const qp = (k) => url.searchParams.get(k);
  if (!payment_key || payment_key.includes("{{")) payment_key = qp("paymentKey") || qp("payment_key") || "";
  if (!amount || amount.includes("{{")) amount = qp("amount") || "";
  if (!orderID || orderID.includes("{{")) orderID = qp("orderId") || qp("orderID") || "";
})();

/* ---------- JSON 정규화 ---------- */
function normalizePaymentData(raw) {
  const log = tryGet(raw, ["log"], {});
  // webhook 덮어쓰기
  const webhookData = tryGet(log, ["webhook.data"], undefined);
  let finish = tryGet(log, ["finish_order_id"], undefined);
  if (webhookData) finish = webhookData;

  // 상태
  const statusRaw =
    tryGet(log, ["status"]) ??
    findByKeyNames(raw, ["status"]) ??
    "UNKNOWN";

  // 상태 → 타입 매핑
  const normType =
    statusRaw === "ABORTED" ? "failed" :
    statusRaw === "WAITING_FOR_DEPOSIT" ? "waiting" : "success";

  // 공통 필드
  const productName =
    tryGet(log, ["product_name", "request_order_id.product_name"]) ??
    tryGet(finish, ["orderName"]) ??
    findByKeyNames(raw, ["product_name", "ordername", "title"]) ??
    "[상품명 없음]";

  const orderIdNorm =
    tryGet(raw, ["orderID", "orderId"]) ??
    tryGet(finish, ["orderId"]) ??
    findByKeyNames(raw, ["orderid"]) ??
    orderID;

  const email =
    tryGet(log, ["request_order_id.email"]) ??
    tryGet(finish, ["customerEmail"]) ??
    tryGet(raw, ["email"]) ??
    findByKeyNames(raw, ["email"]) ??
    "(이메일 정보 없음)";

  const approvedAt =
    tryGet(finish, ["approvedAt"]) ??
    findByKeyNames(raw, ["approvedat", "approved"]) ??
    "";

  const method =
    tryGet(finish, ["method"]) ??
    findByKeyNames(raw, ["method", "paymethod"]) ??
    "-";

  const receiptUrl =
    tryGet(finish, ["receipt.url"]) ??
    tryGet(finish, ["card.receiptUrl"]) ??
    findByKeyNames(raw, ["receipturl", "receipt"]) ??
    "#";

  // 금액
  const totalAmount =
    tryGet(finish, ["totalAmount"]) ??
    tryGet(log, ["totalAmount"]) ??
    tryGet(raw, ["amount"]) ??
    findByKeyNames(raw, ["totalamount", "amount"]);

  const suppliedAmount =
    tryGet(finish, ["suppliedAmount"]) ??
    findByKeyNames(raw, ["suppliedamount", "supplied"]);

  const vat =
    tryGet(finish, ["vat"]) ??
    findByKeyNames(raw, ["vat", "tax"]);

  // 가상계좌
  const virtualAccount =
    tryGet(finish, ["virtualAccount"]) ??
    findByKeyNames(raw, ["virtualaccount"]) ??
    {};

  // 실패 메시지(필터링 적용)
  const rawFailMsg =
    tryGet(raw, ["log.finish_order_id.message"]) ??
    tryGet(raw, ["message"]) ??
    findByKeyNames(raw, ["error", "fail", "message"]) ??
    "";

  const filteredFailMsg = String(rawFailMsg || "")
    .replace(/이미 처리된 결제입니다/gi, "") // ❌ 표시하지 않음
    .trim();

  return {
    type: normType,          // 'success' | 'waiting' | 'failed'
    status: statusRaw,
    productName,
    orderId: orderIdNorm,
    email,
    approvedAt,
    method,
    receiptUrl,
    totals: {
      suppliedAmount,
      vat,
      totalAmount: totalAmount ?? amount
    },
    virtualAccount: {
      bank: tryGet(virtualAccount, ["bank"], "-"),
      accountNumber: tryGet(virtualAccount, ["accountNumber"], "-"),
      dueDate: tryGet(virtualAccount, ["dueDate"], "-")
    },
    viewAmount: totalAmount ?? amount,
    failMessage: filteredFailMsg || "결제가 실패했습니다.",
    raw
  };
}

/* ---------- 공통 레이아웃 ---------- */
const Card = ({ children }) => (
  <figure className="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 rounded-lg">
    {children}
  </figure>
);

const PageHeader = ({ title }) => (
  <div className="w-full max-w-screen-sm mx-auto text-center mb-4">
    <h1 className="text-2xl font-extrabold">{title}</h1>
    <p className="text-sm text-gray-600">결제 결과를 확인해주세요.</p>
  </div>
);

const SubHeader = ({ result, color, productName, amount }) => (
  <div className="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8">
    <PageHeader title="정회원 가입" />
    <div className="grid grid-cols-3 justify-center items-center w-full gap-4 md:grid-cols-1">
      <div className="flex flex-col justify-center items-center w-full border border-gray-500 rounded-lg p-4">
        <p className="text-xl font-extrabold">결제 상품</p>
        <p>{productName}</p>
      </div>
      <div className="flex flex-col justify-center items-center w-full border border-gray-500 rounded-lg p-4">
        <p className="text-xl font-extrabold">결제 금액</p>
        <p>{fmt(amount)}원</p>
      </div>
      <div className="flex flex-col justify-center items-center w-full border border-gray-500 rounded-lg p-4">
        <p className="text-xl font-extrabold">결과</p>
        <p className={`${color} font-extrabold`}>{result}</p>
      </div>
    </div>
  </div>
);

const BtnRow = ({ leftHref, leftText, rightHref = "/", rightText = "메인 화면으로" }) => (
  <div className="grid grid-cols-2 justify-center items-center w-full md:grid-cols-1">
    <a
      href={leftHref}
      target={leftHref?.startsWith("http") ? "_blank" : undefined}
      className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
    >
      {leftText}
    </a>
    <a
      href={rightHref}
      className="text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
    >
      {rightText}
    </a>
  </div>
);

// 디테일 블록만 타입별로 다름
const DetailBlock = ({ type, n }) => {
  if (type === "failed") {
    return (
      <>
        <hr className="h-[1px] my-2 w-full bg-gray-500 border-0" />
        <div className="flex flex-col justify-center items-center w-full">
          <p className="text-sm text-red-700">{n.failMessage}</p>
        </div>
        <div className="p-2" />
        <BtnRow leftHref="/intro/membership/" leftText="다시 시도하기" />
      </>
    );
  }

  if (type === "waiting") {
    const due = (n.virtualAccount.dueDate || "").replace("T", " ").replace("+09:00", " ");
    return (
      <div className="flex flex-col justify-center items-start w-full max-w-screen-sm border border-green-700 bg-gray-100 p-4 rounded-xl">
        <p className="text-xl font-extrabold mb-4">결제 상세</p>
        <p><span className="font-bold">주문 번호:</span> {n.orderId || "-"}</p>
        <p><span className="font-bold">결제 상품:</span> {n.productName}</p>
        <hr className="h-[1px] my-2 w-full bg-gray-500 border-0" />
        <div className="flex flex-col justify-center items-center w-full">
          <p><span className="font-bold">은행:</span> {n.virtualAccount.bank}</p>
          <p><span className="font-bold">계좌번호:</span> {n.virtualAccount.accountNumber}</p>
          <p><span className="font-bold">만료 시각:</span> {due || "-"}</p>
          <p><span className="font-bold">최종 금액:</span> {fmt(n.totals.totalAmount)}원</p>
          <p className="text-blue-500">위 계좌로 입금하면, 자동으로 결제가 완료됩니다.</p>
        </div>
        <div className="p-2" />
        <BtnRow leftHref="/" leftText="메인 화면으로" />
      </div>
    );
  }

  // success (기본)
  const approved = (n.approvedAt || "").replace("T", " ").replace("+09:00", " ");
  return (
    <div className="flex flex-col justify-center items-start w-full max-w-screen-sm border border-green-700 bg-gray-100 p-4 rounded-xl">
      <p className="text-xl font-extrabold mb-4">결제 상세</p>
      <p><span className="font-bold">주문 번호:</span> {n.orderId || "-"}</p>
      <p><span className="font-bold">결제 계정:</span> {n.email}</p>
      <p><span className="font-bold">결제 상품:</span> {n.productName}</p>
      <p><span className="font-bold">결제 일시:</span> {approved || "-"}</p>
      <p><span className="font-bold">결제 방법:</span> {n.method}</p>
      <hr className="h-[1px] my-2 w-full bg-gray-500 border-0" />
      <div className="flex flex-col justify-center items-end w-full">
        <p><span className="font-bold">가격:</span> {fmt(n.totals.suppliedAmount)}원</p>
        <p><span className="font-bold">부가세 (10%):</span> {fmt(n.totals.vat)}원</p>
        <p><span className="font-bold">최종 금액:</span> {fmt(n.totals.totalAmount)}원</p>
      </div>
      <div className="p-2" />
      <BtnRow leftHref={n.receiptUrl || "#"} leftText="영수증 보기" />
    </div>
  );
};

// 최상위 결과 카드(공통 뼈대 + 타입별 디테일)
const ResultCard = ({ n }) => {
  const type = n.type; // 'success' | 'waiting' | 'failed'
  const headerMap = {
    success: { text: "결제 성공", color: "text-green-500" },
    waiting: { text: "결제 대기", color: "text-blue-500" },
    failed:  { text: "결제 실패", color: "text-red-500" }
  };
  const h = headerMap[type] || headerMap.success;

  return (
    <Card>
      <SubHeader result={h.text} color={h.color} productName={n.productName} amount={n.viewAmount} />
      <DetailBlock type={type} n={n} />
    </Card>
  );
};

/* ---------- 데이터 로딩 & 렌더 ---------- */
async function get_result_order_id() {
  const url = `/ajax_finish_order_id/?paymentKey=${encodeURIComponent(payment_key)}&orderID=${encodeURIComponent(orderID)}&amount=${encodeURIComponent(amount)}`;
  const data = await fetch(url).then((r) => r.json());
  //console.log("raw data:", data);

  const n = normalizePaymentData(data);
  //console.log("normalized:", n);

  ReactDOM.render(<ResultCard n={n} />, document.getElementById("div_main"));
}

// ===== scripts/intro/membership/result/set_main_20251004_0344.js =====
function intro_membership_result_set_main() {
  // ✅ 중복 실행 방지
  if (window.__main_loaded__) return;
  window.__main_loaded__ = true;

  const Loading = () => (
    <div className="max-w-screen-xl px-6 py-12 mx-auto space-y-4">
      <div className="flex flex-col justify-center items-center w-full space-y-4">
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <p>결제 창을 불러오고 있습니다.</p>
      </div>
    </div>
  );

  ReactDOM.render(<Loading />, document.getElementById("div_main"));
  get_result_order_id();
}

    return {
        set_main: intro_membership_result_set_main
    };
})();

function set_main() {
    const currentMode = getIntroMembershipMode();
    if (currentMode === "result") {
        return IntroMembershipResult.set_main();
    }
    return IntroMembershipMain.set_main();
}

window.set_main = set_main;
