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
function Div_sub_card(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "flex flex-col items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("dt", { class: "text-3xl font-extrabold" }, props.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","), props.unit), /* @__PURE__ */ React.createElement("dd", { class: "font-light text-gray-500" }, props.title), props.subvalue != null ? /* @__PURE__ */ React.createElement("dd", { class: "font-light text-gray-500" }, "(", props.subtitle, ": ", props.subvalue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","), props.subunit == null ? props.unit : props.subunit, ")") : null);
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
      id: "div_statistics_usage",
      name: "div_statistics_usage",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "Web-R \uC811\uC18D \uD69F\uC218" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-4 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uCD1D \uC811\uC18D \uD69F\uC218" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC62C\uD574 \uC811\uC18D \uD69F\uC218" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC774\uBC88 \uB2EC \uC811\uC18D \uD69F\uC218" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC624\uB298 \uC811\uC18D \uD69F\uC218" })))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_table_webr",
      name: "div_statistics_table_webr",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "App\uBCC4 \uC811\uC18D \uD1B5\uACC4" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-2 justify-center items-center w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement(Div_table_skeleton, null), /* @__PURE__ */ React.createElement(Div_table_skeleton, null)))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_graph",
      name: "div_statistics_graph",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "Web-R \uC811\uC18D \uCD94\uC774 \uADF8\uB798\uD504" }), /* @__PURE__ */ React.createElement("dl", { class: "flex flex-row justify-center items-center w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement(Div_graph_skeleton, null)))
  )));
}
function Div_main(props) {
  const data = props.data || {};
  const fmt = (n) => (n != null ? n : 0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  const count = data.count || {};
  const countValue = (key) => count[key] && count[key]["0"] != null ? count[key]["0"] : 0;
  const list_app = Object.values(data.list_app || {});
  const list_app_legacy = list_app.filter((x) => (x.app_group || "ShinyApp") === "ShinyApp");
  const list_app_webr2 = list_app.filter((x) => (x.app_group || "ShinyApp") === "Web-R 2.0");
  const appGroupRows = Object.values(data.list_app_group || {});
  const appGroupMap = appGroupRows.reduce((acc, row) => {
    acc[row.app_group || "ShinyApp"] = row;
    return acc;
  }, {});
  const legacySummary = appGroupMap["ShinyApp"] || { cnt_connect: 0, cnt_user: 0 };
  const webr2Summary = appGroupMap["Web-R 2.0"] || { cnt_connect: 0, cnt_user: 0 };
  function Div_generation_card({ title, row }) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center border border-gray-200 rounded-lg p-6" }, /* @__PURE__ */ React.createElement("dt", { className: "text-xl font-bold text-gray-900" }, title), /* @__PURE__ */ React.createElement("dd", { className: "mt-3 text-3xl font-extrabold text-gray-900" }, fmt(row.cnt_connect), "\uD68C"), /* @__PURE__ */ React.createElement("dd", { className: "font-light text-gray-500" }, "\uC774\uC6A9\uC790 ", fmt(row.cnt_user), "\uBA85"));
  }
  function Div_app_list({ title, data: data2 }) {
    const items = Object.values(data2 || {});
    const total = items.reduce((sum, row) => sum + (Number(row.cnt_connect) || 0), 0);
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-start items-center rounded-xl space-y-4 w-full p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-row justify-between items-center w-full border-b border-gray-200 pb-3" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-gray-900" }, title), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, fmt(total), "\uD68C")), items.length > 0 ? items.map((item, k) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-row justify-between items-center w-full gap-4", key: k }, /* @__PURE__ */ React.createElement("p", { className: "text-left" }, item.name_app || "-"), /* @__PURE__ */ React.createElement("p", { className: "shrink-0" }, fmt(item.cnt_connect), "\uD68C (", fmt(item.cnt_user), "\uBA85)"))) : /* @__PURE__ */ React.createElement("p", { className: "py-6 text-gray-500" }, "\uD45C\uC2DC\uD560 \uC811\uC18D \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { className: "col-span-10 md:grid-cols-1 justify-center item-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "Web-R \uC811\uC18D \uD69F\uC218" }), /* @__PURE__ */ React.createElement("dl", { className: "grid grid-cols-4 w-full md:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uCD1D \uC811\uC18D \uD69F\uC218",
      value: countValue("val_connect_app_total"),
      unit: "\uD68C",
      subtitle: "\uCD1D \uC774\uC6A9\uC790 \uC218",
      subvalue: countValue("val_user_total"),
      subunit: "\uBA85"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC62C\uD574 \uC811\uC18D \uD69F\uC218",
      value: countValue("val_connect_app_yearly"),
      unit: "\uD68C",
      subtitle: "\uC62C\uD574 \uC774\uC6A9\uC790 \uC218",
      subvalue: countValue("val_user_yearly"),
      subunit: "\uBA85"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC774\uBC88 \uB2EC \uC811\uC18D \uD69F\uC218",
      value: countValue("val_connect_app_monthly"),
      unit: "\uD68C",
      subtitle: "\uC774\uBC88 \uB2EC \uC774\uC6A9\uC790 \uC218",
      subvalue: countValue("val_user_monthly"),
      subunit: "\uBA85"
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC624\uB298 \uC811\uC18D \uD69F\uC218",
      value: countValue("val_connect_app_daily"),
      unit: "\uD68C",
      subtitle: "\uC624\uB298 \uC774\uC6A9\uC790 \uC218",
      subvalue: countValue("val_user_daily"),
      subunit: "\uBA85"
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "ShinyApp / Web-R 2.0 \uC811\uC18D \uD1B5\uACC4" }), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500" }, "(\uC774\uBC88 \uB2EC \uAE30\uC900)"), /* @__PURE__ */ React.createElement("dl", { className: "grid grid-cols-2 md:grid-cols-1 gap-6 w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement(Div_generation_card, { title: "ShinyApp", row: legacySummary }), /* @__PURE__ */ React.createElement(Div_generation_card, { title: "Web-R 2.0", row: webr2Summary })))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "App\uBCC4 \uC811\uC18D \uD1B5\uACC4" }), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500" }, "(\uC774\uBC88 \uB2EC \uAE30\uC900)"), /* @__PURE__ */ React.createElement("dl", { className: "grid grid-cols-2 md:grid-cols-1 justify-center items-start w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement(Div_app_list, { title: "ShinyApp", data: list_app_legacy }), /* @__PURE__ */ React.createElement(Div_app_list, { title: "Web-R 2.0", data: list_app_webr2 })))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement("dl", { className: "flex flex-col justify-center items-start w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement("ul", { className: "flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full" }, /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart(data.list_daily, "graph_tab_daily", data.list_group_daily) }, /* @__PURE__ */ React.createElement("div", { className: class_tab_inactive, id: "graph_tab_daily" }, "\uC77C")), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart(data.list_monthly, "graph_tab_monthly", data.list_group_monthly) }, /* @__PURE__ */ React.createElement("div", { className: class_tab_active, id: "graph_tab_monthly" }, "\uC6D4")), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart(data.list_yearly, "graph_tab_yearly", data.list_group_yearly) }, /* @__PURE__ */ React.createElement("div", { className: class_tab_inactive, id: "graph_tab_yearly" }, "\uB144"))), /* @__PURE__ */ React.createElement("div", { id: "div_statistics_graph", name: "div_statistics_graph", className: "w-full h-[500px] p-8" }))))));
}
const GRAPH_TAB_IDS = ["graph_tab_daily", "graph_tab_monthly", "graph_tab_yearly"];
function draw_chart(inputData, activeTabId, groupedData) {
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
  const rows = Object.values(inputData || {});
  const groupRows = Object.values(groupedData || {});
  const categories = Array.from(new Set(rows.concat(groupRows).map((d) => d.date).filter(Boolean))).sort();
  const totalByDate = rows.reduce((acc, row) => {
    acc[row.date] = row;
    return acc;
  }, {});
  const groupByNameDate = groupRows.reduce((acc, row) => {
    const group = row.app_group || "ShinyApp";
    if (!acc[group])
      acc[group] = {};
    acc[group][row.date] = row;
    return acc;
  }, {});
  const users = categories.map((date) => totalByDate[date] ? totalByDate[date].cnt_user || 0 : 0);
  const hasGroupedRows = groupRows.length > 0;
  const connects = categories.map((date) => totalByDate[date] ? totalByDate[date].cnt_connect || 0 : 0);
  const legacyConnects = categories.map((date) => groupByNameDate["ShinyApp"] && groupByNameDate["ShinyApp"][date] ? groupByNameDate["ShinyApp"][date].cnt_connect || 0 : 0);
  const webr2Connects = categories.map((date) => groupByNameDate["Web-R 2.0"] && groupByNameDate["Web-R 2.0"][date] ? groupByNameDate["Web-R 2.0"][date].cnt_connect || 0 : 0);
  const legend = hasGroupedRows ? ["ShinyApp \uC811\uC18D", "Web-R 2.0 \uC811\uC18D", "\uC804\uCCB4 \uC774\uC6A9\uC790 \uC218"] : ["\uC811\uC18D \uD69F\uC218", "\uC774\uC6A9\uC790 \uC218"];
  const series = hasGroupedRows ? [
    { name: "ShinyApp \uC811\uC18D", type: "bar", stack: "connect", yAxisIndex: 0, data: legacyConnects, barMaxWidth: 24 },
    { name: "Web-R 2.0 \uC811\uC18D", type: "bar", stack: "connect", yAxisIndex: 0, data: webr2Connects, barMaxWidth: 24 },
    { name: "\uC804\uCCB4 \uC774\uC6A9\uC790 \uC218", type: "line", yAxisIndex: 1, data: users, smooth: true }
  ] : [
    { name: "\uC811\uC18D \uD69F\uC218", type: "bar", yAxisIndex: 0, data: connects, barMaxWidth: 20 },
    { name: "\uC774\uC6A9\uC790 \uC218", type: "bar", yAxisIndex: 1, data: users, barMaxWidth: 20 }
  ];
  const option = {
    title: { text: "ShinyApp / Web-R 2.0 \uC774\uC6A9 \uCD94\uC774 \uADF8\uB798\uD504", left: "center", top: 0, textStyle: { fontSize: 24, fontWeight: "700" } },
    legend: { data: legend, top: 36 },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    toolbox: { right: 10, feature: { dataZoom: { yAxisIndex: "none" }, restore: {}, saveAsImage: {} } },
    grid: { left: 60, right: 60, top: 80, bottom: 60 },
    xAxis: { type: "category", data: categories },
    yAxis: [{ type: "value", name: "\uC811\uC18D \uD69F\uC218" }, { type: "value", name: "\uC774\uC6A9\uC790 \uC218" }],
    dataZoom: [{ type: "inside", xAxisIndex: 0 }, { type: "slider", xAxisIndex: 0 }],
    series
  };
  chart.setOption(option);
  requestAnimationFrame(() => chart.resize());
  window.addEventListener("resize", () => chart.resize(), { passive: true });
}
async function get_main() {
  const data = await fetch("/admin/ajax_get_admin_webr/", { method: "POST" }).then((r) => r.json());
  ReactDOM.render(
    /* @__PURE__ */ React.createElement(Div_main, { data }),
    document.getElementById("div_main"),
    () => {
      requestAnimationFrame(() => {
        draw_chart(data.list_monthly, "graph_tab_monthly", data.list_group_monthly);
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
