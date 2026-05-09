const MembershipPage = (() => {
  let userinfo = null;
  let products = [];
  let selectedProduct = null;
  let teamQuantity = 1;
  let busyKey = "";
  const h = React.createElement;
  const money = (value) => (Number(value) || 0).toLocaleString("ko-KR");
  const cleanRole = (role) => String(role || "").replace(/\s+/g, "");
  const paidRoles = ["정회원", "VIP회원", "기관회원", "기관/팀회원", "기업회원"];
  const noExpiryRoles = ["준회원", "게스트", "관리자"];
  function canSelectProduct() {
    return userinfo != null && cleanRole(userinfo.role) !== "관리자";
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
    if (title === "\uC815\uD68C\uC6D0") return 10;
    if (title === "VIP\uD68C\uC6D0") return 20;
    if (isSeatPriced(product)) {
      const teamRole = cleanRole(product && product.team_member_role);
      if (teamRole === "VIP\uD68C\uC6D0") return 91;
      return 90;
    }
    if (title === "\uAE30\uAD00\uD68C\uC6D0" || title === "\uAE30\uAD00/\uD300\uD68C\uC6D0" || title === "\uAE30\uC5C5\uD68C\uC6D0" || isSeatPriced(product)) return 90;
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
    return cleanRole(product && product.team_member_role) === "VIP\uD68C\uC6D0" ? "VIP회원 팀" : "정회원 팀";
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
    const pad = (value) => String(value).padStart(2, "0");
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
  const PageHeader = ({ title }) => h("div", { className: "mb-8 flex w-full flex-row items-end justify-start text-start" },
    h("h1", { className: "mb-4 mr-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-3xl" },
      h("span", { className: "underline decoration-blue-400 decoration-8 underline-offset-3" }, title)));
  const Loading = ({ text }) => h("div", { className: "flex w-full flex-col items-center justify-center py-16 text-gray-600" },
    h("div", { className: "mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" }),
    h("p", null, text || "불러오는 중입니다."));
  const PaymentButtons = () => {
    if (!userinfo) return h("p", { className: "text-red-500" }, "로그인이 필요합니다.");
    if (!canSelectProduct()) return h("p", { className: "text-sm text-gray-500" }, "관리자 계정은 멤버십 결제가 필요하지 않습니다.");
    if (!selectedProduct) return h("p", { className: "text-red-500" }, "결제 방법을 선택해주세요.");
    const buttonClass = "w-full rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60";
    return h("div", { className: "flex w-full flex-col items-center justify-center space-y-2" },
      ["카드", "가상계좌", "계좌이체"].map((method) => h("button", {
        key: method,
        type: "button",
        className: buttonClass,
        disabled: busyKey !== "",
        onClick: () => requestOrder(selectedProduct, method)
      }, busyKey === method ? "결제 준비 중..." : method + (method === "카드" ? "결제" : " 결제"))));
  };
  const UserInfoPanel = () => {
    if (!userinfo) {
      return h("div", { className: "flex h-[200px] flex-row items-center justify-center" }, h("p", null, "로그인이 필요합니다."));
    }
    const role = cleanRole(userinfo.role);
    const showCurrentExpiry = !noExpiryRoles.includes(role) && userinfo.expired_at;
    const nextExpiry = selectedProduct ? formatDateTime(expectedExpiredAt(selectedProduct)) : "";
    return h("div", { className: "flex w-full flex-col items-center justify-center space-y-2 rounded-xl border border-blue-100 bg-gray-100 px-4 py-8" },
      h("p", { className: "font-extrabold underline" }, "회원 정보"),
      h("div", { className: "py-1" }),
      h("p", { className: "text-sm" }, userinfo.email),
      h("p", { className: "text-2xl font-extrabold" }, userinfo.name),
      h("p", { className: "text-sm" }, userinfo.realname, " | ", userinfo.gender),
      h("div", { className: "py-4" }),
      h("p", { className: "text-lg font-extrabold" }, selectedProduct && userinfo.role !== selectedProduct.title ? [userinfo.role, " -> ", h("span", { key: "next", className: "text-green-700" }, selectedProduct.title)] : selectedProduct ? h("span", { className: "text-green-700" }, selectedProduct.title) : userinfo.role),
      h("p", { className: "text-sm" }, "가입 일자: ", userinfo.date_joined),
      showCurrentExpiry ? h("p", { className: "text-sm" }, "회원등급 만료일: ", userinfo.expired_at) : null,
      selectedProduct ? h("p", { className: "text-sm font-extrabold text-red-700" }, "예상 만료일: ", nextExpiry) : null,
      selectedProduct && isSeatPriced(selectedProduct) ? h(React.Fragment, null,
        h("p", { className: "text-sm font-extrabold text-red-700" }, "추가 팀원: ", Math.max(normalizeQuantity(selectedProduct, teamQuantity) - 1, 0), "명"),
        h("p", { className: "text-sm font-extrabold text-red-700" }, "전체 좌석(본인 포함): ", normalizeQuantity(selectedProduct, teamQuantity), "석")) : null,
      selectedProduct ? h("p", { className: "text-sm font-extrabold text-red-700" }, "예상 결제 금액: ", money(displayAmount(selectedProduct)), "원") : null,
      h("div", { className: "py-4" }),
      h(PaymentButtons));
  };
  const ProductCard = ({ product }) => {
    const disabled = !canSelectProduct();
    const isSelected = selectedProduct && selectedProduct.uuid === product.uuid;
    const quantity = normalizeQuantity(product, isSeatPriced(product) ? teamQuantity : product.quantity || 1);
    const extraMembers = Math.max(quantity - 1, 0);
    return h("div", { className: "mx-auto flex w-full max-w-lg flex-col items-center justify-center rounded-lg border bg-white p-6 text-center text-gray-900 shadow " + (isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100") },
      h("div", { className: "w-full" },
        h("h3", { className: "mb-4 text-2xl font-semibold" }, product.title),
        h("p", { className: "text-md font-light text-gray-500" }, product.description),
        h("div", { className: "my-8 flex items-baseline justify-center" },
          h("span", { className: "mr-2 text-2xl font-extrabold" }, "￦", money(product.unit_price || product.price)),
          h("span", { className: "text-gray-500" }, isSeatPriced(product) ? "/명/년" : "/년"))),
      isSeatPriced(product) ? h("label", { className: "mb-6 flex w-full flex-col items-start gap-2 text-left text-sm font-semibold text-slate-700" },
        h("span", null, "팀원 등급: ", product.team_member_role || "정회원"),
        "추가 팀원 수",
        h("input", {
          type: "number",
          min: "0",
          max: Math.max((product.max_quantity || 500) - 1, 0),
          value: extraMembers,
          onChange: (event) => {
            teamQuantity = normalizeQuantity(product, Math.floor(Number(event.target.value) || 0) + 1);
            renderMain();
          },
          className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-950"
        }),
        h("span", { className: "text-xs font-normal text-slate-500" }, "본인 포함 전체 ", quantity, "석, 총 ", money((product.unit_price || product.price) * quantity), "원")) : null,
      (product.features || []).length > 0 ? h("ul", { role: "list", className: "mb-8 space-y-4 text-left" },
        product.features.map((text, i) => h("li", { key: i, className: "flex items-center space-x-3" },
          h("span", { className: "h-5 w-5 flex-shrink-0 text-green-500" }, "✓"),
          h("span", null, text)))) : null,
      h("button", {
        type: "button",
        disabled: disabled,
        onClick: () => selectProduct(product),
        className: disabled ? "mb-2 me-2 w-full cursor-not-allowed rounded-lg bg-gray-400 px-5 py-2.5 text-sm font-medium text-white opacity-60" : "mb-2 me-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
      }, "선택"));
  };
  const TeamMembershipCard = () => {
    const options = teamProducts();
    const product = selectedTeamProduct();
    if (!product) return null;
    const disabled = !canSelectProduct();
    const isSelected = selectedProduct && isSeatPriced(selectedProduct);
    const quantity = normalizeQuantity(product, teamQuantity);
    const extraMembers = Math.max(quantity - 1, 0);
    return h("div", { className: "mx-auto flex w-full max-w-lg flex-col items-center justify-center rounded-lg border bg-white p-6 text-center text-gray-900 shadow " + (isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100") },
      h("div", { className: "w-full" },
        h("h3", { className: "mb-4 text-2xl font-semibold" }, "기관/팀 회원"),
        h("p", { className: "text-md font-light text-gray-500" }, product.description),
        h("div", { className: "my-8 flex items-baseline justify-center" },
          h("span", { className: "mr-2 text-2xl font-extrabold" }, "￦", money(product.unit_price || product.price)),
          h("span", { className: "text-gray-500" }, "/명/년"))),
      h("fieldset", { className: "mb-6 flex w-full flex-col gap-2 text-left text-sm font-semibold text-slate-700" },
        h("legend", { className: "mb-1" }, "팀원 등급"),
        options.map((option) => h("label", {
          key: option.uuid,
          className: "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 " + (product.uuid === option.uuid ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-700")
        },
          h("input", {
            type: "radio",
            name: "team_member_role",
            checked: product.uuid === option.uuid,
            disabled,
            onChange: () => selectProduct(option),
            className: "h-4 w-4"
          }),
          h("span", null, teamOptionLabel(option)),
          h("span", { className: "ml-auto text-xs font-normal text-slate-500" }, "￦", money(option.unit_price || option.price), "/명")))),
      h("label", { className: "mb-6 flex w-full flex-col items-start gap-2 text-left text-sm font-semibold text-slate-700" },
        "추가 팀원 수",
        h("input", {
          type: "number",
          min: "0",
          max: Math.max((product.max_quantity || 500) - 1, 0),
          value: extraMembers,
          onChange: (event) => {
            selectedProduct = product;
            teamQuantity = normalizeQuantity(product, Math.floor(Number(event.target.value) || 0) + 1);
            renderMain();
          },
          className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-950"
        }),
        h("span", { className: "text-xs font-normal text-slate-500" }, "본인 포함 전체 ", quantity, "석, 총 ", money((product.unit_price || product.price) * quantity), "원")),
      (product.features || []).length > 0 ? h("ul", { role: "list", className: "mb-8 space-y-4 text-left" },
        product.features.map((text, i) => h("li", { key: i, className: "flex items-center space-x-3" },
          h("span", { className: "h-5 w-5 flex-shrink-0 text-green-500" }, "✓"),
          h("span", null, text)))) : null,
      h("button", {
        type: "button",
        disabled,
        onClick: () => selectProduct(product),
        className: disabled ? "mb-2 me-2 w-full cursor-not-allowed rounded-lg bg-gray-400 px-5 py-2.5 text-sm font-medium text-white opacity-60" : "mb-2 me-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
      }, isSelected ? "선택됨" : "선택"));
  };
  function Main() {
    return h("div", { className: "mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center px-20 py-8 md:px-8" },
      h(PageHeader, { title: "정회원 가입" }),
      h("div", { className: "grid w-full grid-cols-4 items-start justify-center gap-4 md:flex md:flex-col md:gap-0 md:space-y-4" },
        h("div", { className: "flex w-full flex-col items-center justify-center" }, h(UserInfoPanel)),
        nonTeamProducts().map((product) => h(ProductCard, { key: product.uuid, product })),
        h(TeamMembershipCard)));
  }
  function renderMain() {
    ReactDOM.render(h(Main), document.getElementById("div_main"));
  }
  function selectProduct(product) {
    selectedProduct = product;
    if (isSeatPriced(product)) {
      teamQuantity = normalizeQuantity(product, teamQuantity || product.quantity || 1);
    }
    renderMain();
  }
  async function loadMain() {
    ReactDOM.render(h(Loading, { text: "멤버십 정보를 불러오는 중입니다." }), document.getElementById("div_main"));
    const productData = await fetch("/ajax_membership_products/", { method: "POST" }).then((res) => res.json());
    if (productData.error) {
      alert(productData.message || "상품 정보를 불러올 수 없습니다.");
      products = [];
    } else {
      products = sortProducts(productData.products);
    }
    if (window.gv_username !== "") {
      userinfo = await fetch("/account/ajax_get_userinfo/", { method: "POST" }).then((res) => res.json());
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
        method,
        quantity: isSeatPriced(product) ? String(normalizeQuantity(product, teamQuantity)) : "1"
      });
      const tempdata = await fetch("/ajax_request_order_id/", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: query
      }).then((res) => res.json());
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
        failUrl: resultURL
      };
      if (method === "가상계좌") {
        options.validHours = 24;
        options.cashReceipt = { type: "소득공제" };
      }
      await tossPayments.requestPayment(method, options);
    } catch (err) {
      alert(err && err.message ? err.message : "결제를 시작할 수 없습니다.");
    } finally {
      busyKey = "";
      renderMain();
    }
  }
  return { set_main: loadMain };
})();
function set_main() {
  MembershipPage.set_main();
}
