let class_tab_active = "inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active cursor-pointer";
let class_tab_inactive = "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 cursor-pointer";
function Div_operation_menu() {
  function Div_menu_button(props) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => location.href = props.url,
        class: "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200\n						focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
      },
      props.name
    );
  }
  var date = /* @__PURE__ */ new Date();
  return /* @__PURE__ */ React.createElement("div", { class: "col-span-2 md:grid-cols-1 justify-center item-center" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col md:flex-row lg:w-48 md:w-full item-center" }, /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uCCAB \uD654\uBA74", url: "/admin/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uD65C\uC131 \uC0AC\uC6A9\uC790", url: "/admin/active_users/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "Web-R \uC811\uC18D \uD604\uD669", url: "/admin/webr/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uBC29\uBB38 \uD604\uD669", url: "/admin/visitors/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uD68C\uC6D0 \uD604\uD669", url: "/admin/members/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uACB0\uC81C \uD604\uD669", url: "/admin/payments/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uC815\uC0B0\uC561 \uC870\uD68C", url: "/admin/balance_account/" + date.getFullYear().toString() + "/" + (date.getMonth() + 1).toString() + "/" })));
}
function Div_sub_title(props) {
  return /* @__PURE__ */ React.createElement("h5", { class: "mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900" }, /* @__PURE__ */ React.createElement("span", { class: "text-blue-600" }, props.title));
}
function Div_sub_card_skeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col items-center justify-center" }, /* @__PURE__ */ React.createElement("dt", { class: "text-3xl font-extrabold" }, /* @__PURE__ */ React.createElement("div", { class: "h-5 bg-gray-300 rounded-full w-48 mb-4" })), /* @__PURE__ */ React.createElement("dd", { class: "font-light text-gray-500" }, props.title));
}
function Div_table_skeleton() {
  function Div_row() {
    return /* @__PURE__ */ React.createElement("div", { class: "flex items-center justify-between w-full" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-300 rounded-full w-24 mb-2.5" }), /* @__PURE__ */ React.createElement("div", { class: "w-32 h-2 bg-gray-200 rounded-full" })), /* @__PURE__ */ React.createElement("div", { class: "h-2.5 bg-gray-300 rounded-full w-12" }));
  }
  return /* @__PURE__ */ React.createElement("div", { role: "status", class: "w-full p-4 space-y-4 divide-y divide-gray-200 rounded animate-pulse md:p-6" }, /* @__PURE__ */ React.createElement(Div_row, null), /* @__PURE__ */ React.createElement(Div_row, null), /* @__PURE__ */ React.createElement(Div_row, null), /* @__PURE__ */ React.createElement(Div_row, null), /* @__PURE__ */ React.createElement(Div_row, null));
}
function Div_graph_skeleton() {
  return /* @__PURE__ */ React.createElement("div", { class: "w-full p-4 rounded animate-pulse md:p-6" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-baseline mt-4 space-x-6" }, /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-72" }), /* @__PURE__ */ React.createElement("div", { class: "w-full h-56 bg-gray-200 rounded-t-lg" }), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-72" }), /* @__PURE__ */ React.createElement("div", { class: "w-full h-64 bg-gray-200 rounded-t-lg" }), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-80" }), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-72" }), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-80" })));
}
function Div_main_skeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { class: "col-span-10 md:grid-cols-1 justify-center item-center" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_amount",
      name: "div_statistics_amount",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uACB0\uC81C\uC561" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-4 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uCD1D \uACB0\uC81C\uC561" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC62C\uD574 \uACB0\uC81C\uC561" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC774\uBC88 \uB2EC \uACB0\uC81C\uC561" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC624\uB298 \uACB0\uC81C\uC561" })))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_payment",
      name: "div_statistics_payment",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uACB0\uC81C \uD56D\uBAA9" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-2 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uD68C\uC6D0 \uC5C5\uADF8\uB808\uC774\uB4DC \uACB0\uC81C" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC138\uBBF8\uB098 \uACB0\uC81C" })))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_graph",
      name: "div_statistics_graph",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uACB0\uC81C \uCD94\uC774 \uADF8\uB798\uD504" }), /* @__PURE__ */ React.createElement("dl", { class: "flex flex-row justify-center items-center w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement(Div_graph_skeleton, null)))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_table",
      name: "div_statistics_table",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uACB0\uC81C \uBAA9\uB85D" }), /* @__PURE__ */ React.createElement("dl", { class: "flex flex-row justify-center items-center w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement(Div_table_skeleton, null)))
  )));
}
function Div_main(props) {
  const data = props.data;
  const list_product_membership = Object.values(data.list_product).filter((x) => x.product === "webr");
  const list_product_workshop = Object.values(data.list_product).filter((x) => x.product === "seminar");
  function Div_payment_list({ data: data2, title }) {
    const payment_list = Object.keys(data2).map((k) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-row justify-between items-center w-full", key: k }, /* @__PURE__ */ React.createElement("p", null, data2[k].product_name), /* @__PURE__ */ React.createElement("p", null, data2[k].amt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","), "\uC6D0", " ", "(", data2[k].cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","), "\uAC74)")));
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center rounded-xl border border-gray-200 space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement("p", { className: "font-extrabold underline" }, title), payment_list.length > 0 ? payment_list : /* @__PURE__ */ React.createElement("p", { className: "text-gray-400" }, "\uD45C\uC2DC\uD560 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."));
  }
  function Div_sub_title2(props2) {
    return /* @__PURE__ */ React.createElement("div", { className: "w-full flex justify-center items-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-extrabold" }, props2.title));
  }
  function Div_sub_card(props2) {
    let value = props2.value;
    let subvalue = props2.subvalue;
    const unit = props2.unit ? props2.unit : "";
    const subunit = props2.subunit ? props2.subunit : "";
    if (value === void 0 || value === null || value === "")
      value = 0;
    if (subvalue === void 0 || subvalue === null || subvalue === "")
      subvalue = 0;
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center rounded-xl space-y-2 w-full p-6" }, /* @__PURE__ */ React.createElement("dt", { className: "mb-2 text-3xl md:text-3xl font-extrabold" }, value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","), unit), /* @__PURE__ */ React.createElement("dd", { className: "text-gray-500" }, props2.title, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-xs" }, "(", props2.subtitle, " : ", subvalue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","), subunit, ")")));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-12 md:grid-cols-1 justify-center items-start w-full px-[100px] py-[20px] md:px-[10px]" }, /* @__PURE__ */ React.createElement("div", { className: "col-span-2 self-start" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null)), /* @__PURE__ */ React.createElement("div", { className: "col-span-10 md:grid-cols-1 justify-center item-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_title2, { title: "\uACB0\uC81C\uC561" }), /* @__PURE__ */ React.createElement("dl", { className: "grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uCD1D \uACB0\uC81C\uC561",
      value: data.count.sum_amount_total["0"],
      unit: "\uC6D0",
      subtitle: "\uCD1D \uACB0\uC81C \uAC74 \uC218",
      subvalue: data.count.cnt_amount_total["0"],
      subunit: "\uAC74"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC62C\uD574 \uACB0\uC81C\uC561",
      value: data.count.sum_amount_yearly["0"],
      unit: "\uC6D0",
      subtitle: "\uC62C\uD574 \uACB0\uC81C \uAC74 \uC218",
      subvalue: data.count.cnt_amount_yearly["0"],
      subunit: "\uAC74"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC774\uBC88 \uB2EC \uACB0\uC81C\uC561",
      value: data.count.sum_amount_monthly["0"],
      unit: "\uC6D0",
      subtitle: "\uC774\uBC88 \uB2EC \uACB0\uC81C \uAC74 \uC218",
      subvalue: data.count.cnt_amount_monthly["0"],
      subunit: "\uAC74"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC624\uB298 \uACB0\uC81C\uC561",
      value: data.count.sum_amount_daily["0"],
      unit: "\uC6D0",
      subtitle: "\uC624\uB298 \uACB0\uC81C \uAC74 \uC218",
      subvalue: data.count.cnt_amount_daily["0"],
      subunit: "\uAC74"
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_title2, { title: "\uACB0\uC81C \uD56D\uBAA9" }), /* @__PURE__ */ React.createElement("p", null, "(\uC774\uBC88 \uB2EC \uAE30\uC900)"), /* @__PURE__ */ React.createElement("dl", { className: "grid grid-cols-2 justify-center items-start w-full gap-4 p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement(Div_payment_list, { data: list_product_membership, title: "\uD68C\uC6D0 \uB4F1\uAE09 \uC5C5\uADF8\uB808\uC774\uB4DC \uACB0\uC81C" }), /* @__PURE__ */ React.createElement(Div_payment_list, { data: list_product_workshop, title: "\uC6CC\uD06C\uC0F5 \uACB0\uC81C" })))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement("dl", { className: "flex flex-col justify-center items-start w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement("ul", { className: "flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full" }, /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart(data.list_daily, "graph_tab_daily") }, /* @__PURE__ */ React.createElement("div", { className: class_tab_inactive, id: "graph_tab_daily" }, "\uC77C")), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart(data.list_monthly, "graph_tab_monthly") }, /* @__PURE__ */ React.createElement("div", { className: class_tab_active, id: "graph_tab_monthly" }, "\uC6D4")), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart(data.list_yearly, "graph_tab_yearly") }, /* @__PURE__ */ React.createElement("div", { className: class_tab_inactive, id: "graph_tab_yearly" }, "\uB144"))), /* @__PURE__ */ React.createElement("div", { id: "div_statistics_graph", name: "div_statistics_graph", className: "w-full h-[500px] p-8" }))))));
}
const GRAPH_TAB_IDS = ["graph_tab_daily", "graph_tab_monthly", "graph_tab_yearly"];
function draw_chart(inputData, activeTabId) {
  GRAPH_TAB_IDS.forEach((id) => {
    const el2 = document.getElementById(id);
    if (el2)
      el2.className = id === activeTabId ? class_tab_active : class_tab_inactive;
  });
  const el = document.getElementById("div_statistics_graph");
  if (!el)
    return;
  const prev = echarts.getInstanceByDom(el);
  if (prev)
    prev.dispose();
  const chart = echarts.init(el, null, { renderer: "canvas" });
  const rows = Object.values(inputData || {}).sort((a, b) => new Date(a.date) - new Date(b.date));
  const categories = rows.map((d) => d.date);
  const amounts = rows.map((d) => d.amt || 0);
  const counts = rows.map((d) => d.cnt || 0);
  const option = {
    title: { text: "\uACB0\uC81C \uCD94\uC774 \uADF8\uB798\uD504", left: "center", top: 0, textStyle: { fontSize: 24, fontWeight: "700" } },
    legend: { data: ["\uACB0\uC81C\uC561", "\uACB0\uC81C \uAC74 \uC218"], top: 36 },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    toolbox: { right: 10, feature: { dataZoom: { yAxisIndex: "none" }, restore: {}, saveAsImage: {} } },
    grid: { left: 60, right: 60, top: 80, bottom: 60 },
    xAxis: { type: "category", data: categories, axisLabel: { interval: "auto" } },
    yAxis: [
      { type: "value", name: "\uACB0\uC81C\uC561" },
      { type: "value", name: "\uACB0\uC81C \uAC74 \uC218" }
    ],
    dataZoom: [
      { type: "inside", xAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseMove: true },
      { type: "slider", xAxisIndex: 0 }
    ],
    series: [
      { name: "\uACB0\uC81C\uC561", type: "bar", yAxisIndex: 0, data: amounts, barMaxWidth: 28 },
      { name: "\uACB0\uC81C \uAC74 \uC218", type: "bar", yAxisIndex: 1, data: counts, barMaxWidth: 28 }
    ]
  };
  chart.setOption(option);
  requestAnimationFrame(() => chart.resize());
  window.addEventListener("resize", () => chart.resize(), { passive: true });
  if (el.offsetWidth === 0 || el.offsetHeight === 0) {
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        ro.disconnect();
        chart.resize();
      }
    });
    ro.observe(el);
  }
}
async function get_main() {
  const data = await fetch("/admin/ajax_get_admin_payments/", { method: "POST" }).then((res) => res.json());
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Div_main, { data }),
    document.getElementById("div_main"),
    () => {
      requestAnimationFrame(() => {
        draw_chart(data.list_monthly, "graph_tab_monthly");
      });
    }
  );
}
async function set_main() {
  function Div_check_admin() {
    return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4 md" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", class: "w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentFill" })), /* @__PURE__ */ React.createElement("p", null, "\uAD00\uB9AC\uC790 \uC5EC\uBD80\uB97C \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.")));
  }
  function Div_main_stop() {
    return /* @__PURE__ */ React.createElement("div", { class: "max-w-screen-xl px-6 py-8 mx-auto space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-4" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/stop.svg", class: "size-16" }), /* @__PURE__ */ React.createElement("p", null, "\uAD00\uB9AC\uC790\uB97C \uC704\uD55C \uBA54\uB274\uC785\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(
      "a",
      {
        href: "/",
        class: "text-gray-900 text-center bg-white border border-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 w-[150px]\n							  focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
      },
      "\uCCAB \uD654\uBA74\uC73C\uB85C"
    )));
  }
  const username = window.gv_username || "";
  if (!username) {
    location.href = "/";
    return;
  }
  const mount = document.getElementById("div_main");
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_check_admin, null), mount);
  try {
    const headerData = await fetch("/ajax_get_menu_header/", { method: "POST" }).then((res) => res.json());
    const role = headerData && headerData.role ? headerData.role : "";
    window.gv_role = role;
    if (role === "\uAD00\uB9AC\uC790") {
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_skeleton, null), mount);
      await get_main();
    } else {
      ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_stop, null), mount);
    }
  } catch (error) {
    console.error(error);
    mount.innerHTML = '<div class="text-center text-gray-500 py-10">\uAD00\uB9AC\uC790 \uC5EC\uBD80\uB97C \uD655\uC778\uD558\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.</div>';
  }
}
