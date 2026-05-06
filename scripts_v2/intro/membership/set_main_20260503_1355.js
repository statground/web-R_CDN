const MembershipPage = (() => {
  let userinfo = null;
  let products = [];
  let selectedProduct = null;
  let teamQuantity = 1;
  let busyKey = "";

  const money = (n) => (Number(n) || 0).toLocaleString("ko-KR");
  const cleanRole = (role) => String(role || "").replace(/\s+/g, "");
  const paidRoles = ["정회원", "VIP회원", "기관회원", "기관/팀회원", "기업회원"];
  const noExpiryRoles = ["준회원", "게스트", "관리자"];

  function canSelectProduct() {
    return userinfo != null && cleanRole(userinfo.role) !== "관리자";
  }

  function parseDateTime(value) {
    if (!value) return null;
    const text = String(value).trim();
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4] || 0), Number(match[5] || 0), Number(match[6] || 0));
    }
    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function formatDateTime(date) {
    const pad = (v) => String(v).padStart(2, "0");
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
  }

  function expectedExpiredAt(product) {
    const grantDays = Number(product && product.grant_days) || 365;
    const now = new Date();
    const current = parseDateTime(userinfo && userinfo.expired_at);
    const role = cleanRole(userinfo && userinfo.role);
    const base = paidRoles.includes(role) && current && current.getTime() >= now.getTime() ? current : now;
    const next = new Date(base.getTime());
    next.setDate(next.getDate() + grantDays);
    return next;
  }

  function isSeatPriced(product) {
    return !!(product && product.seat_priced);
  }

  function normalizeQuantity(product, value) {
    const min = Number(product && product.min_quantity) || 1;
    const max = Number(product && product.max_quantity) || 500;
    const parsed = Math.floor(Number(value) || min);
    return Math.max(min, Math.min(max, parsed));
  }

  function displayAmount(product) {
    if (!product) return 0;
    if (!isSeatPriced(product)) return Number(product.price) || 0;
    return (Number(product.unit_price || product.price) || 0) * normalizeQuantity(product, teamQuantity);
  }

  function membershipSortRank(product) {
    const title = cleanRole(product && product.title);
    if (title === "정회원") return 10;
    if (title === "VIP회원") return 20;
    if (isSeatPriced(product)) {
      const teamRole = cleanRole(product && product.team_member_role);
      if (teamRole === "VIP회원") return 91;
      return 90;
    }
    if (title === "기관회원" || title === "기관/팀회원" || title === "기업회원" || isSeatPriced(product)) return 90;
    return 50;
  }

  function sortProducts(list) {
    return [...(Array.isArray(list) ? list : [])].sort((left, right) => {
      const rankDiff = membershipSortRank(left) - membershipSortRank(right);
      if (rankDiff !== 0) return rankDiff;
      return String(left.title || "").localeCompare(String(right.title || ""), "ko-KR", { numeric: true, sensitivity: "base" });
    });
  }

  function teamProducts() {
    return products.filter(isSeatPriced);
  }

  function nonTeamProducts() {
    return products.filter((product) => !isSeatPriced(product));
  }

  function selectedTeamProduct() {
    const list = teamProducts();
    if (selectedProduct && isSeatPriced(selectedProduct)) return selectedProduct;
    return list[0] || null;
  }

  function teamOptionLabel(product) {
    return cleanRole(product && product.team_member_role) === "VIP회원" ? "VIP회원 팀" : "정회원 팀";
  }

  function getQueryValue(name) {
    return new URL(window.location.href).searchParams.get(name) || "";
  }

  function globalValue(name) {
    if (typeof window[name] === "undefined" || window[name] == null) return "";
    const value = String(window[name]);
    return value.includes("{{") ? "" : value;
  }

  const PageHeader = ({ title }) => (
    <div className="mb-8 flex w-full flex-row items-end justify-start text-start">
      <h1 className="mb-4 mr-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-3xl">
        <span className="underline decoration-blue-400 decoration-8 underline-offset-3">{title}</span>
      </h1>
    </div>
  );

  const Loading = ({ text }) => (
    <div className="flex w-full flex-col items-center justify-center py-16 text-gray-600">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700"></div>
      <p>{text || "불러오는 중입니다."}</p>
    </div>
  );

  const UserInfoPanel = () => {
    if (!userinfo) {
      return (
        <div className="flex h-[200px] flex-row items-center justify-center">
          <p>로그인이 필요합니다.</p>
        </div>
      );
    }

    const role = cleanRole(userinfo.role);
    const showCurrentExpiry = !noExpiryRoles.includes(role) && userinfo.expired_at;
    const nextExpiry = selectedProduct ? formatDateTime(expectedExpiredAt(selectedProduct)) : "";

    return (
      <div className="flex w-full flex-col items-center justify-center space-y-2 rounded-xl border border-blue-100 bg-gray-100 px-4 py-8">
        <p className="font-extrabold underline">회원 정보</p>
        <div className="py-1"></div>
        <p className="text-sm">{userinfo.email}</p>
        <p className="text-2xl font-extrabold">{userinfo.name}</p>
        <p className="text-sm">{userinfo.realname}　|　{userinfo.gender}</p>
        <div className="py-4"></div>
        <p className="text-lg font-extrabold">
          {selectedProduct && userinfo.role !== selectedProduct.title ? (
            <>{userinfo.role} → <span className="text-green-700">{selectedProduct.title}</span></>
          ) : (
            selectedProduct ? <span className="text-green-700">{selectedProduct.title}</span> : userinfo.role
          )}
        </p>
        <p className="text-sm">가입 일자: {userinfo.date_joined}</p>
        {showCurrentExpiry && <p className="text-sm">회원등급 만료일: {userinfo.expired_at}</p>}
        {selectedProduct && <p className="text-sm font-extrabold text-red-700">예상 만료일: {nextExpiry}</p>}
        {selectedProduct && isSeatPriced(selectedProduct) && (
          <>
            <p className="text-sm font-extrabold text-red-700">추가 팀원: {Math.max(normalizeQuantity(selectedProduct, teamQuantity) - 1, 0)}명</p>
            <p className="text-sm font-extrabold text-red-700">전체 좌석(본인 포함): {normalizeQuantity(selectedProduct, teamQuantity)}석</p>
          </>
        )}
        {selectedProduct && <p className="text-sm font-extrabold text-red-700">예상 결제 금액: {money(displayAmount(selectedProduct))}원</p>}
        <div className="py-4"></div>
        <PaymentButtons />
      </div>
    );
  };

  const PaymentButtons = () => {
    if (!userinfo) return <p className="text-red-500">로그인이 필요합니다.</p>;
    if (!canSelectProduct()) return <p className="text-sm text-gray-500">관리자 계정은 멤버십 결제가 필요하지 않습니다.</p>;
    if (!selectedProduct) return <p className="text-red-500">결제 방법을 선택해주세요.</p>;

    const buttonClass = "w-full rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60";
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-2">
        {["카드", "가상계좌", "계좌이체"].map((method) => (
          <button key={method} type="button" className={buttonClass} disabled={busyKey !== ""} onClick={() => requestOrder(selectedProduct, method)}>
            {busyKey === method ? "결제 준비 중..." : method + (method === "카드" ? "결제" : " 결제")}
          </button>
        ))}
      </div>
    );
  };

  const ProductCard = ({ product }) => {
    const disabled = !canSelectProduct();
    const isSelected = selectedProduct && selectedProduct.uuid === product.uuid;
    const quantity = normalizeQuantity(product, isSeatPriced(product) ? teamQuantity : (product.quantity || 1));
    const extraMembers = Math.max(quantity - 1, 0);
    return (
      <div className={"mx-auto flex w-full max-w-lg flex-col items-center justify-center rounded-lg border bg-white p-6 text-center text-gray-900 shadow " + (isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100")}>
        <div className="w-full">
          <h3 className="mb-4 text-2xl font-semibold">{product.title}</h3>
          <p className="text-md font-light text-gray-500">{product.description}</p>
          <div className="my-8 flex items-baseline justify-center">
            <span className="mr-2 text-2xl font-extrabold">￦{money(product.unit_price || product.price)}</span>
            <span className="text-gray-500">{isSeatPriced(product) ? "/명/년" : "/년"}</span>
          </div>
        </div>
        {isSeatPriced(product) && (
          <label className="mb-6 flex w-full flex-col items-start gap-2 text-left text-sm font-semibold text-slate-700">
            <span>팀원 등급: {product.team_member_role || "정회원"}</span>
            추가 팀원 수
            <input
              type="number"
              min="0"
              max={Math.max((product.max_quantity || 500) - 1, 0)}
              value={extraMembers}
              onChange={(event) => {
                teamQuantity = normalizeQuantity(product, (Math.floor(Number(event.target.value) || 0) + 1));
                renderMain();
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-950"
            />
            <span className="text-xs font-normal text-slate-500">본인 포함 전체 {quantity}석, 총 {money((product.unit_price || product.price) * quantity)}원</span>
          </label>
        )}
        {(product.features || []).length > 0 && (
          <ul role="list" className="mb-8 space-y-4 text-left">
            {product.features.map((text, i) => (
              <li key={i} className="flex items-center space-x-3">
                <span className="h-5 w-5 flex-shrink-0 text-green-500">✓</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        )}
        <button type="button" disabled={disabled} onClick={() => selectProduct(product)}
          className={disabled ? "mb-2 me-2 w-full cursor-not-allowed rounded-lg bg-gray-400 px-5 py-2.5 text-sm font-medium text-white opacity-60" : "mb-2 me-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"}>
          선택
        </button>
      </div>
    );
  };

  const TeamMembershipCard = () => {
    const options = teamProducts();
    const product = selectedTeamProduct();
    if (!product) return null;
    const disabled = !canSelectProduct();
    const isSelected = selectedProduct && isSeatPriced(selectedProduct);
    const quantity = normalizeQuantity(product, teamQuantity);
    const extraMembers = Math.max(quantity - 1, 0);

    return (
      <div className={"mx-auto flex w-full max-w-lg flex-col items-center justify-center rounded-lg border bg-white p-6 text-center text-gray-900 shadow " + (isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100")}>
        <div className="w-full">
          <h3 className="mb-4 text-2xl font-semibold">기관/팀 회원</h3>
          <p className="text-md font-light text-gray-500">{product.description}</p>
          <div className="my-8 flex items-baseline justify-center">
            <span className="mr-2 text-2xl font-extrabold">￦{money(product.unit_price || product.price)}</span>
            <span className="text-gray-500">/명/년</span>
          </div>
        </div>
        <fieldset className="mb-6 flex w-full flex-col gap-2 text-left text-sm font-semibold text-slate-700">
          <legend className="mb-1">팀원 등급</legend>
          {options.map((option) => (
            <label key={option.uuid} className={"flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 " + (product.uuid === option.uuid ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-700")}>
              <input
                type="radio"
                name="team_member_role"
                checked={product.uuid === option.uuid}
                disabled={disabled}
                onChange={() => selectProduct(option)}
                className="h-4 w-4"
              />
              <span>{teamOptionLabel(option)}</span>
              <span className="ml-auto text-xs font-normal text-slate-500">￦{money(option.unit_price || option.price)}/명</span>
            </label>
          ))}
        </fieldset>
        <label className="mb-6 flex w-full flex-col items-start gap-2 text-left text-sm font-semibold text-slate-700">
          추가 팀원 수
          <input
            type="number"
            min="0"
            max={Math.max((product.max_quantity || 500) - 1, 0)}
            value={extraMembers}
            onChange={(event) => {
              selectedProduct = product;
              teamQuantity = normalizeQuantity(product, (Math.floor(Number(event.target.value) || 0) + 1));
              renderMain();
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-950"
          />
          <span className="text-xs font-normal text-slate-500">본인 포함 전체 {quantity}석, 총 {money((product.unit_price || product.price) * quantity)}원</span>
        </label>
        {(product.features || []).length > 0 && (
          <ul role="list" className="mb-8 space-y-4 text-left">
            {product.features.map((text, i) => (
              <li key={i} className="flex items-center space-x-3">
                <span className="h-5 w-5 flex-shrink-0 text-green-500">✓</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        )}
        <button type="button" disabled={disabled} onClick={() => selectProduct(product)}
          className={disabled ? "mb-2 me-2 w-full cursor-not-allowed rounded-lg bg-gray-400 px-5 py-2.5 text-sm font-medium text-white opacity-60" : "mb-2 me-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"}>
          {isSelected ? "선택됨" : "선택"}
        </button>
      </div>
    );
  };

  function Main() {
    return (
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center px-20 py-8 md:px-8">
        <PageHeader title="정회원 가입" />
        <div className="grid w-full grid-cols-4 items-start justify-center gap-4 md:flex md:flex-col md:gap-0 md:space-y-4">
          <div className="flex w-full flex-col items-center justify-center">
            <UserInfoPanel />
          </div>
          {nonTeamProducts().map((product) => <ProductCard key={product.uuid} product={product} />)}
          <TeamMembershipCard />
        </div>
      </div>
    );
  }

  function renderMain() {
    ReactDOM.render(<Main />, document.getElementById("div_main"));
  }

  function selectProduct(product) {
    selectedProduct = product;
    if (isSeatPriced(product)) {
      teamQuantity = normalizeQuantity(product, teamQuantity || product.quantity || 1);
    }
    renderMain();
  }

  async function loadMain() {
    ReactDOM.render(<Loading text="멤버십 정보를 불러오는 중입니다." />, document.getElementById("div_main"));
    const productData = await fetch("/ajax_membership_products/").then((res) => res.json());
    if (productData.error) {
      alert(productData.message || "상품 정보를 불러올 수 없습니다.");
      products = [];
    } else {
      products = sortProducts(productData.products);
    }

    if (window.gv_username !== "") {
      userinfo = await fetch("/account/ajax_get_userinfo/").then((res) => res.json());
    }
    renderMain();
  }

  async function requestOrder(product, method) {
    if (!product || !product.uuid) {
      alert("상품 정보가 올바르지 않습니다.");
      return;
    }
    busyKey = method;
    renderMain();
    try {
      const resultURL = window.location.origin + "/intro/membership/result/";
      const query = new URLSearchParams({
        product_id: product.uuid,
        type: "membership",
        method: method,
        quantity: isSeatPriced(product) ? String(normalizeQuantity(product, teamQuantity)) : "1",
      });
      const tempdata = await fetch("/ajax_request_order_id/?" + query.toString()).then((res) => res.json());
      if (tempdata.error) {
        alert(tempdata.message || "결제 요청을 준비할 수 없습니다.");
        return;
      }
      const tossPayments = TossPayments(tempdata.client_key);
      const options = {
        amount: Number(tempdata.amount),
        orderId: tempdata.orderID,
        orderName: tempdata.product_name,
        customerName: userinfo.realname || userinfo.name,
        customerEmail: userinfo.email,
        successUrl: resultURL,
        failUrl: resultURL,
      };
      if (method === "가상계좌") {
        options.validHours = 24;
        options.cashReceipt = { type: "소득공제" };
      }
      await tossPayments.requestPayment(method, options);
    } catch (err) {
      alert((err && err.message) ? err.message : "결제를 시작할 수 없습니다.");
    } finally {
      busyKey = "";
      renderMain();
    }
  }

  const ResultShell = ({ children }) => (
    <div className="mx-auto flex w-full max-w-screen-sm flex-col items-center justify-center px-20 py-8 md:px-8">
      <div className="mx-auto mb-4 w-full max-w-screen-sm text-center">
        <h1 className="text-2xl font-extrabold">정회원 가입</h1>
        <p className="text-sm text-gray-600">결제 결과를 확인해주세요.</p>
      </div>
      {children}
    </div>
  );

  const ResultSummary = ({ result }) => (
    <div className="mb-6 grid w-full grid-cols-3 items-center justify-center gap-4 md:grid-cols-1">
      <div className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-500 p-4">
        <p className="text-xl font-extrabold">결제 상품</p>
        <p>{result.productName || "-"}</p>
      </div>
      <div className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-500 p-4">
        <p className="text-xl font-extrabold">결제 금액</p>
        <p>{money(result.amount)}원</p>
      </div>
      <div className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-500 p-4">
        <p className="text-xl font-extrabold">결과</p>
        <p className={result.color + " font-extrabold"}>{result.label}</p>
      </div>
    </div>
  );

  const ResultDetail = ({ result }) => (
    <ResultShell>
      <ResultSummary result={result} />
      <div className="flex w-full max-w-screen-sm flex-col items-start justify-center rounded-xl border border-green-700 bg-gray-100 p-4">
        <p className="mb-4 text-xl font-extrabold">결제 상세</p>
        <p><span className="font-bold">주문 번호:</span> {result.orderId || "-"}</p>
        <p><span className="font-bold">결제 계정:</span> {result.email || "-"}</p>
        <p><span className="font-bold">결제 상품:</span> {result.productName || "-"}</p>
        <p><span className="font-bold">결제 방법:</span> {result.method || "-"}</p>
        {result.message && <p className="mt-3 text-sm text-red-700">{result.message}</p>}
        {result.receiptUrl && result.type === "success" && (
          <a href={result.receiptUrl} target="_blank" className="mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800">영수증 보기</a>
        )}
        {result.type !== "success" && (
          <a href="/intro/membership/" className="mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800">다시 시도하기</a>
        )}
      </div>
    </ResultShell>
  );

  function normalizeResult(raw) {
    const log = raw.log || {};
    const req = log.request_order_id || {};
    const finish = log.finish_order_id || ((log.webhook && log.webhook.data) ? log.webhook.data : {});
    const status = raw.status || finish.status || log.status || "ABORTED";
    const type = status === "DONE" ? "success" : (status === "WAITING_FOR_DEPOSIT" ? "waiting" : "failed");
    return {
      type: type,
      label: type === "success" ? "결제 완료" : (type === "waiting" ? "입금 대기" : "결제 실패"),
      color: type === "success" ? "text-green-700" : (type === "waiting" ? "text-blue-700" : "text-red-700"),
      productName: log.product_name || req.product_name || finish.orderName || "[상품명 없음]",
      amount: raw.amount || finish.totalAmount || log.amount || req.amount || globalValue("amount") || getQueryValue("amount"),
      orderId: raw.orderID || raw.orderId || finish.orderId || getQueryValue("orderId") || getQueryValue("orderID"),
      email: log.email || req.email || finish.customerEmail || "",
      method: finish.method || log.payment_method || req.payment_method || "",
      receiptUrl: (finish.receipt && finish.receipt.url) || (finish.card && finish.card.receiptUrl) || "",
      message: raw.message || log.finish_order_error || finish.message || "",
    };
  }

  async function loadResult() {
    ReactDOM.render(<Loading text="결제 결과를 확인하는 중입니다." />, document.getElementById("div_main"));
    const paymentKey = globalValue("payment_key") || getQueryValue("paymentKey") || getQueryValue("payment_key");
    const orderId = globalValue("orderID") || getQueryValue("orderId") || getQueryValue("orderID");
    const amount = globalValue("amount") || getQueryValue("amount");
    const failMessage = globalValue("message") || getQueryValue("message");
    const failCode = globalValue("code") || getQueryValue("code");

    if (!paymentKey) {
      ReactDOM.render(<ResultDetail result={{
        type: "failed",
        label: "결제 실패",
        color: "text-red-700",
        productName: "[상품명 없음]",
        amount: amount,
        orderId: orderId,
        message: failMessage || failCode || "결제가 완료되지 않았습니다.",
      }} />, document.getElementById("div_main"));
      return;
    }

    const query = new URLSearchParams({ paymentKey: paymentKey, orderID: orderId, amount: amount });
    const raw = await fetch("/ajax_finish_order_id/?" + query.toString()).then((res) => res.json());
    ReactDOM.render(<ResultDetail result={normalizeResult(raw)} />, document.getElementById("div_main"));
  }

  return {
    set_main: () => {
      const currentMode = String(typeof mode === "undefined" ? "" : mode || "").trim().toLowerCase();
      if (currentMode === "result") {
        loadResult();
      } else {
        loadMain();
      }
    },
  };
})();

function set_main() {
  MembershipPage.set_main();
}
