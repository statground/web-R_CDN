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