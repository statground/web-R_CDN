const MembershipPage = /* @__PURE__ */ (() => {
  let userinfo = null;
  let products = [];
  let selectedProduct = null;
  let teamQuantity = 1;
  let busyKey = "";
  const money = (n) => (Number(n) || 0).toLocaleString("ko-KR");
  const cleanRole = (role) => String(role || "").replace(/\s+/g, "");
  const paidRoles = ["\uC815\uD68C\uC6D0", "VIP\uD68C\uC6D0", "\uAE30\uAD00\uD68C\uC6D0", "\uAE30\uAD00/\uD300\uD68C\uC6D0", "\uAE30\uC5C5\uD68C\uC6D0"];
  const noExpiryRoles = ["\uC900\uD68C\uC6D0", "\uAC8C\uC2A4\uD2B8", "\uAD00\uB9AC\uC790"];
  function canSelectProduct() {
    return userinfo != null && cleanRole(userinfo.role) !== "\uAD00\uB9AC\uC790";
  }
  function parseDateTime(value) {
    if (!value)
      return null;
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
    const now = /* @__PURE__ */ new Date();
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
  function getQueryValue(name) {
    return new URL(window.location.href).searchParams.get(name) || "";
  }
  function globalValue(name) {
    if (typeof window[name] === "undefined" || window[name] == null)
      return "";
    const value = String(window[name]);
    return value.includes("{{") ? "" : value;
  }
  const PageHeader = ({ title }) => /* @__PURE__ */ React.createElement("div", { className: "mb-8 flex w-full flex-row items-end justify-start text-start" }, /* @__PURE__ */ React.createElement("h1", { className: "mb-4 mr-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-3xl" }, /* @__PURE__ */ React.createElement("span", { className: "underline decoration-blue-400 decoration-8 underline-offset-3" }, title)));
  const Loading = ({ text }) => /* @__PURE__ */ React.createElement("div", { className: "flex w-full flex-col items-center justify-center py-16 text-gray-600" }, /* @__PURE__ */ React.createElement("div", { className: "mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" }), /* @__PURE__ */ React.createElement("p", null, text || "\uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4."));
  const UserInfoPanel = () => {
    if (!userinfo) {
      return /* @__PURE__ */ React.createElement("div", { className: "flex h-[200px] flex-row items-center justify-center" }, /* @__PURE__ */ React.createElement("p", null, "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4."));
    }
    const role = cleanRole(userinfo.role);
    const showCurrentExpiry = !noExpiryRoles.includes(role) && userinfo.expired_at;
    const nextExpiry = selectedProduct ? formatDateTime(expectedExpiredAt(selectedProduct)) : "";
    return /* @__PURE__ */ React.createElement("div", { className: "flex w-full flex-col items-center justify-center space-y-2 rounded-xl border border-blue-100 bg-gray-100 px-4 py-8" }, /* @__PURE__ */ React.createElement("p", { className: "font-extrabold underline" }, "\uD68C\uC6D0 \uC815\uBCF4"), /* @__PURE__ */ React.createElement("div", { className: "py-1" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, userinfo.email), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-extrabold" }, userinfo.name), /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, userinfo.realname, "\u3000|\u3000", userinfo.gender), /* @__PURE__ */ React.createElement("div", { className: "py-4" }), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-extrabold" }, selectedProduct && userinfo.role !== selectedProduct.title ? /* @__PURE__ */ React.createElement(React.Fragment, null, userinfo.role, " \u2192 ", /* @__PURE__ */ React.createElement("span", { className: "text-green-700" }, selectedProduct.title)) : selectedProduct ? /* @__PURE__ */ React.createElement("span", { className: "text-green-700" }, selectedProduct.title) : userinfo.role), /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, "\uAC00\uC785 \uC77C\uC790: ", userinfo.date_joined), showCurrentExpiry && /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, "\uD68C\uC6D0\uB4F1\uAE09 \uB9CC\uB8CC\uC77C: ", userinfo.expired_at), selectedProduct && /* @__PURE__ */ React.createElement("p", { className: "text-sm font-extrabold text-red-700" }, "\uC608\uC0C1 \uB9CC\uB8CC\uC77C: ", nextExpiry), selectedProduct && isSeatPriced(selectedProduct) && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-extrabold text-red-700" }, "\uCD94\uAC00 \uD300\uC6D0: ", Math.max(normalizeQuantity(selectedProduct, teamQuantity) - 1, 0), "\uBA85"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-extrabold text-red-700" }, "\uC804\uCCB4 \uC88C\uC11D(\uBCF8\uC778 \uD3EC\uD568): ", normalizeQuantity(selectedProduct, teamQuantity), "\uC11D")), selectedProduct && /* @__PURE__ */ React.createElement("p", { className: "text-sm font-extrabold text-red-700" }, "\uC608\uC0C1 \uACB0\uC81C \uAE08\uC561: ", money(displayAmount(selectedProduct)), "\uC6D0"), /* @__PURE__ */ React.createElement("div", { className: "py-4" }), /* @__PURE__ */ React.createElement(PaymentButtons, null));
  };
  const PaymentButtons = () => {
    if (!userinfo)
      return /* @__PURE__ */ React.createElement("p", { className: "text-red-500" }, "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.");
    if (!canSelectProduct())
      return /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, "\uAD00\uB9AC\uC790 \uACC4\uC815\uC740 \uBA64\uBC84\uC2ED \uACB0\uC81C\uAC00 \uD544\uC694\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
    if (!selectedProduct)
      return /* @__PURE__ */ React.createElement("p", { className: "text-red-500" }, "\uACB0\uC81C \uBC29\uBC95\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");
    const buttonClass = "w-full rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60";
    return /* @__PURE__ */ React.createElement("div", { className: "flex w-full flex-col items-center justify-center space-y-2" }, ["\uCE74\uB4DC", "\uAC00\uC0C1\uACC4\uC88C", "\uACC4\uC88C\uC774\uCCB4"].map((method) => /* @__PURE__ */ React.createElement("button", { key: method, type: "button", className: buttonClass, disabled: busyKey !== "", onClick: () => requestOrder(selectedProduct, method) }, busyKey === method ? "\uACB0\uC81C \uC900\uBE44 \uC911..." : method + (method === "\uCE74\uB4DC" ? "\uACB0\uC81C" : " \uACB0\uC81C"))));
  };
  const ProductCard = ({ product }) => {
    const disabled = !canSelectProduct();
    const isSelected = selectedProduct && selectedProduct.uuid === product.uuid;
    const quantity = normalizeQuantity(product, isSeatPriced(product) ? teamQuantity : product.quantity || 1);
    const extraMembers = Math.max(quantity - 1, 0);
    return /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-lg flex-col items-center justify-center rounded-lg border bg-white p-6 text-center text-gray-900 shadow " + (isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100") }, /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement("h3", { className: "mb-4 text-2xl font-semibold" }, product.title), /* @__PURE__ */ React.createElement("p", { className: "text-md font-light text-gray-500" }, product.description), /* @__PURE__ */ React.createElement("div", { className: "my-8 flex items-baseline justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "mr-2 text-2xl font-extrabold" }, "\uFFE6", money(product.unit_price || product.price)), /* @__PURE__ */ React.createElement("span", { className: "text-gray-500" }, isSeatPriced(product) ? "/\uBA85/\uB144" : "/\uB144"))), isSeatPriced(product) && /* @__PURE__ */ React.createElement("label", { className: "mb-6 flex w-full flex-col items-start gap-2 text-left text-sm font-semibold text-slate-700" }, /* @__PURE__ */ React.createElement("span", null, "\uD300\uC6D0 \uB4F1\uAE09: ", product.team_member_role || "\uC815\uD68C\uC6D0"), "\uCD94\uAC00 \uD300\uC6D0 \uC218", /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", max: Math.max((product.max_quantity || 500) - 1, 0), value: extraMembers, onChange: (event) => {
      teamQuantity = normalizeQuantity(product, Math.floor(Number(event.target.value) || 0) + 1);
      renderMain();
    }, className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-950" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-500" }, "\uBCF8\uC778 \uD3EC\uD568 \uC804\uCCB4 ", quantity, "\uC11D, \uCD1D ", money((product.unit_price || product.price) * quantity), "\uC6D0")), (product.features || []).length > 0 && /* @__PURE__ */ React.createElement("ul", { role: "list", className: "mb-8 space-y-4 text-left" }, product.features.map((text, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement("span", { className: "h-5 w-5 flex-shrink-0 text-green-500" }, "\u2713"), /* @__PURE__ */ React.createElement("span", null, text)))), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        disabled,
        onClick: () => selectProduct(product),
        className: disabled ? "mb-2 me-2 w-full cursor-not-allowed rounded-lg bg-gray-400 px-5 py-2.5 text-sm font-medium text-white opacity-60" : "mb-2 me-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
      },
      "\uC120\uD0DD"
    ));
  };
  const TeamMembershipCard = () => {
    const options = teamProducts();
    const product = selectedTeamProduct();
    if (!product) return null;
    const disabled = !canSelectProduct();
    const isSelected = selectedProduct && isSeatPriced(selectedProduct);
    const quantity = normalizeQuantity(product, teamQuantity);
    const extraMembers = Math.max(quantity - 1, 0);
    return /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-lg flex-col items-center justify-center rounded-lg border bg-white p-6 text-center text-gray-900 shadow " + (isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100") }, /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement("h3", { className: "mb-4 text-2xl font-semibold" }, "기관/팀 회원"), /* @__PURE__ */ React.createElement("p", { className: "text-md font-light text-gray-500" }, product.description), /* @__PURE__ */ React.createElement("div", { className: "my-8 flex items-baseline justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "mr-2 text-2xl font-extrabold" }, "\uFFE6", money(product.unit_price || product.price)), /* @__PURE__ */ React.createElement("span", { className: "text-gray-500" }, "/\uBA85/\uB144"))), /* @__PURE__ */ React.createElement("fieldset", { className: "mb-6 flex w-full flex-col gap-2 text-left text-sm font-semibold text-slate-700" }, /* @__PURE__ */ React.createElement("legend", { className: "mb-1" }, "\uD300\uC6D0 \uB4F1\uAE09"), options.map((option) => /* @__PURE__ */ React.createElement("label", { key: option.uuid, className: "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 " + (product.uuid === option.uuid ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-700") }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: "team_member_role", checked: product.uuid === option.uuid, disabled, onChange: () => selectProduct(option), className: "h-4 w-4" }), /* @__PURE__ */ React.createElement("span", null, teamOptionLabel(option)), /* @__PURE__ */ React.createElement("span", { className: "ml-auto text-xs font-normal text-slate-500" }, "\uFFE6", money(option.unit_price || option.price), "/\uBA85")))), /* @__PURE__ */ React.createElement("label", { className: "mb-6 flex w-full flex-col items-start gap-2 text-left text-sm font-semibold text-slate-700" }, "\uCD94\uAC00 \uD300\uC6D0 \uC218", /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", max: Math.max((product.max_quantity || 500) - 1, 0), value: extraMembers, onChange: (event) => {
      selectedProduct = product;
      teamQuantity = normalizeQuantity(product, Math.floor(Number(event.target.value) || 0) + 1);
      renderMain();
    }, className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-950" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-500" }, "\uBCF8\uC778 \uD3EC\uD568 \uC804\uCCB4 ", quantity, "\uC11D, \uCD1D ", money((product.unit_price || product.price) * quantity), "\uC6D0")), (product.features || []).length > 0 && /* @__PURE__ */ React.createElement("ul", { role: "list", className: "mb-8 space-y-4 text-left" }, product.features.map((text, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "flex items-center space-x-3" }, /* @__PURE__ */ React.createElement("span", { className: "h-5 w-5 flex-shrink-0 text-green-500" }, "\u2713"), /* @__PURE__ */ React.createElement("span", null, text)))), /* @__PURE__ */ React.createElement("button", { type: "button", disabled, onClick: () => selectProduct(product), className: disabled ? "mb-2 me-2 w-full cursor-not-allowed rounded-lg bg-gray-400 px-5 py-2.5 text-sm font-medium text-white opacity-60" : "mb-2 me-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300" }, isSelected ? "\uC120\uD0DD\uB428" : "\uC120\uD0DD"));
  };
  function Main() {
    return /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center px-20 py-8 md:px-8" }, /* @__PURE__ */ React.createElement(PageHeader, { title: "\uC815\uD68C\uC6D0 \uAC00\uC785" }), /* @__PURE__ */ React.createElement("div", { className: "grid w-full grid-cols-4 items-start justify-center gap-4 md:flex md:flex-col md:gap-0 md:space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex w-full flex-col items-center justify-center" }, /* @__PURE__ */ React.createElement(UserInfoPanel, null)), nonTeamProducts().map((product) => /* @__PURE__ */ React.createElement(ProductCard, { key: product.uuid, product })), /* @__PURE__ */ React.createElement(TeamMembershipCard, null)));
  }
  function renderMain() {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Main, null), document.getElementById("div_main"));
  }
  function selectProduct(product) {
    selectedProduct = product;
    if (isSeatPriced(product)) {
      teamQuantity = normalizeQuantity(product, teamQuantity || product.quantity || 1);
    }
    renderMain();
  }
  async function loadMain() {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Loading, { text: "\uBA64\uBC84\uC2ED \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4." }), document.getElementById("div_main"));
    const productData = await fetch("/ajax_membership_products/").then((res) => res.json());
    if (productData.error) {
      alert(productData.message || "\uC0C1\uD488 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
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
      alert("\uC0C1\uD488 \uC815\uBCF4\uAC00 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
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
      const tempdata = await fetch("/ajax_request_order_id/?" + query.toString()).then((res) => res.json());
      if (tempdata.error) {
        alert(tempdata.message || "\uACB0\uC81C \uC694\uCCAD\uC744 \uC900\uBE44\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
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
      if (method === "\uAC00\uC0C1\uACC4\uC88C") {
        options.validHours = 24;
        options.cashReceipt = { type: "\uC18C\uB4DD\uACF5\uC81C" };
      }
      await tossPayments.requestPayment(method, options);
    } catch (err) {
      alert(err && err.message ? err.message : "\uACB0\uC81C\uB97C \uC2DC\uC791\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    } finally {
      busyKey = "";
      renderMain();
    }
  }
  const ResultShell = ({ children }) => /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-screen-sm flex-col items-center justify-center px-20 py-8 md:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto mb-4 w-full max-w-screen-sm text-center" }, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-extrabold" }, "\uC815\uD68C\uC6D0 \uAC00\uC785"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, "\uACB0\uC81C \uACB0\uACFC\uB97C \uD655\uC778\uD574\uC8FC\uC138\uC694.")), children);
  const ResultSummary = ({ result }) => /* @__PURE__ */ React.createElement("div", { className: "mb-6 grid w-full grid-cols-3 items-center justify-center gap-4 md:grid-cols-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex w-full flex-col items-center justify-center rounded-lg border border-gray-500 p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl font-extrabold" }, "\uACB0\uC81C \uC0C1\uD488"), /* @__PURE__ */ React.createElement("p", null, result.productName || "-")), /* @__PURE__ */ React.createElement("div", { className: "flex w-full flex-col items-center justify-center rounded-lg border border-gray-500 p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl font-extrabold" }, "\uACB0\uC81C \uAE08\uC561"), /* @__PURE__ */ React.createElement("p", null, money(result.amount), "\uC6D0")), /* @__PURE__ */ React.createElement("div", { className: "flex w-full flex-col items-center justify-center rounded-lg border border-gray-500 p-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl font-extrabold" }, "\uACB0\uACFC"), /* @__PURE__ */ React.createElement("p", { className: result.color + " font-extrabold" }, result.label)));
  const ResultDetail = ({ result }) => /* @__PURE__ */ React.createElement(ResultShell, null, /* @__PURE__ */ React.createElement(ResultSummary, { result }), /* @__PURE__ */ React.createElement("div", { className: "flex w-full max-w-screen-sm flex-col items-start justify-center rounded-xl border border-green-700 bg-gray-100 p-4" }, /* @__PURE__ */ React.createElement("p", { className: "mb-4 text-xl font-extrabold" }, "\uACB0\uC81C \uC0C1\uC138"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "\uC8FC\uBB38 \uBC88\uD638:"), " ", result.orderId || "-"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "\uACB0\uC81C \uACC4\uC815:"), " ", result.email || "-"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "\uACB0\uC81C \uC0C1\uD488:"), " ", result.productName || "-"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "\uACB0\uC81C \uBC29\uBC95:"), " ", result.method || "-"), result.message && /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-sm text-red-700" }, result.message), result.receiptUrl && result.type === "success" && /* @__PURE__ */ React.createElement("a", { href: result.receiptUrl, target: "_blank", className: "mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800" }, "\uC601\uC218\uC99D \uBCF4\uAE30"), result.type !== "success" && /* @__PURE__ */ React.createElement("a", { href: "/intro/membership/", className: "mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800" }, "\uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAE30")));
  function normalizeResult(raw) {
    const log = raw.log || {};
    const req = log.request_order_id || {};
    const finish = log.finish_order_id || (log.webhook && log.webhook.data ? log.webhook.data : {});
    const status = raw.status || finish.status || log.status || "ABORTED";
    const type = status === "DONE" ? "success" : status === "WAITING_FOR_DEPOSIT" ? "waiting" : "failed";
    return {
      type,
      label: type === "success" ? "\uACB0\uC81C \uC644\uB8CC" : type === "waiting" ? "\uC785\uAE08 \uB300\uAE30" : "\uACB0\uC81C \uC2E4\uD328",
      color: type === "success" ? "text-green-700" : type === "waiting" ? "text-blue-700" : "text-red-700",
      productName: log.product_name || req.product_name || finish.orderName || "[\uC0C1\uD488\uBA85 \uC5C6\uC74C]",
      amount: raw.amount || finish.totalAmount || log.amount || req.amount || globalValue("amount") || getQueryValue("amount"),
      orderId: raw.orderID || raw.orderId || finish.orderId || getQueryValue("orderId") || getQueryValue("orderID"),
      email: log.email || req.email || finish.customerEmail || "",
      method: finish.method || log.payment_method || req.payment_method || "",
      receiptUrl: finish.receipt && finish.receipt.url || finish.card && finish.card.receiptUrl || "",
      message: raw.message || log.finish_order_error || finish.message || ""
    };
  }
  async function loadResult() {
    ReactDOM.render(/* @__PURE__ */ React.createElement(Loading, { text: "\uACB0\uC81C \uACB0\uACFC\uB97C \uD655\uC778\uD558\uB294 \uC911\uC785\uB2C8\uB2E4." }), document.getElementById("div_main"));
    const paymentKey = globalValue("payment_key") || getQueryValue("paymentKey") || getQueryValue("payment_key");
    const orderId = globalValue("orderID") || getQueryValue("orderId") || getQueryValue("orderID");
    const amount = globalValue("amount") || getQueryValue("amount");
    const failMessage = globalValue("message") || getQueryValue("message");
    const failCode = globalValue("code") || getQueryValue("code");
    if (!paymentKey) {
      ReactDOM.render(/* @__PURE__ */ React.createElement(ResultDetail, { result: {
        type: "failed",
        label: "\uACB0\uC81C \uC2E4\uD328",
        color: "text-red-700",
        productName: "[\uC0C1\uD488\uBA85 \uC5C6\uC74C]",
        amount,
        orderId,
        message: failMessage || failCode || "\uACB0\uC81C\uAC00 \uC644\uB8CC\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4."
      } }), document.getElementById("div_main"));
      return;
    }
    const query = new URLSearchParams({ paymentKey, orderID: orderId, amount });
    const raw = await fetch("/ajax_finish_order_id/?" + query.toString()).then((res) => res.json());
    ReactDOM.render(/* @__PURE__ */ React.createElement(ResultDetail, { result: normalizeResult(raw) }), document.getElementById("div_main"));
  }
  return {
    set_main: () => {
      const currentMode = String(typeof mode === "undefined" ? "" : mode || "").trim().toLowerCase();
      if (currentMode === "result") {
        loadResult();
      } else {
        loadMain();
      }
    }
  };
})();
function set_main() {
  MembershipPage.set_main();
}
