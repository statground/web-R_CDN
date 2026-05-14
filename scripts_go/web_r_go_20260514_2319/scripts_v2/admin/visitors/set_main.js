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
  return /* @__PURE__ */ React.createElement("div", { class: "md:col-span-2 justify-center item-center" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row flex-wrap w-full md:flex-col md:w-48 item-center" }, /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uCCAB \uD654\uBA74", url: "/admin/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uD65C\uC131 \uC0AC\uC6A9\uC790", url: "/admin/active_users/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "Web-R \uC811\uC18D \uD604\uD669", url: "/admin/webr/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uBC29\uBB38 \uD604\uD669", url: "/admin/visitors/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uD68C\uC6D0 \uD604\uD669", url: "/admin/members/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uACB0\uC81C \uD604\uD669", url: "/admin/payments/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uC815\uC0B0\uC561 \uC870\uD68C", url: "/admin/balance_account/" + date.getFullYear().toString() + "/" + (date.getMonth() + 1).toString() + "/" })));
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
function Div_graph_skeleton() {
  return /* @__PURE__ */ React.createElement("div", { class: "w-full p-4 rounded animate-pulse md:p-6" }, /* @__PURE__ */ React.createElement("div", { class: "flex items-baseline mt-4 space-x-6" }, /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-72" }), /* @__PURE__ */ React.createElement("div", { class: "w-full h-56 bg-gray-200 rounded-t-lg" }), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-72" }), /* @__PURE__ */ React.createElement("div", { class: "w-full h-64 bg-gray-200 rounded-t-lg" }), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-80" }), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-72" }), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-200 rounded-t-lg h-80" })));
}
function Div_main_skeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-1 md:grid-cols-12 justify-center item-center w-full px-[10px] py-[20px] md:px-[100px]" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { class: "md:col-span-10 justify-center item-center" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_visitors",
      name: "div_statistics_visitors",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uBC29\uBB38\uC790 \uC218" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-1 w-full md:grid-cols-4 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uCD1D \uBC29\uBB38\uC790 \uC218" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC62C\uD574 \uBC29\uBB38\uC790 \uC218" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC774\uBC88 \uB2EC \uBC29\uBB38\uC790 \uC218" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC624\uB298 \uBC29\uBB38\uC790 \uC218" })))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_pageview",
      name: "div_statistics_pageview",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uD398\uC774\uC9C0 \uBDF0" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-1 w-full md:grid-cols-4 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uCD1D \uD398\uC774\uC9C0 \uBDF0" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC62C\uD574 \uD398\uC774\uC9C0 \uBDF0" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC774\uBC88 \uB2EC \uD398\uC774\uC9C0 \uBDF0" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC624\uB298 \uD398\uC774\uC9C0 \uBDF0" })))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_graph",
      name: "div_statistics_graph",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uBC29\uBB38 \uCD94\uC774 \uADF8\uB798\uD504" }), /* @__PURE__ */ React.createElement("dl", { class: "flex flex-row justify-center items-center w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement(Div_graph_skeleton, null)))
  )));
}
function Div_main(props) {
  const data = props.data;
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-12 justify-center item-center w-full px-[10px] py-[20px] md:px-[100px]" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { className: "md:col-span-10 justify-center item-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uBC29\uBB38\uC790 \uC218" }), /* @__PURE__ */ React.createElement("dl", { className: "grid grid-cols-1 w-full md:grid-cols-4 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uCD1D \uBC29\uBB38\uC790 \uC218", value: data.count.val_visitor_total["0"], unit: "\uBA85" }), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC62C\uD574 \uBC29\uBB38\uC790 \uC218",
      value: data.count.val_visitor_yearly["0"],
      unit: "\uBA85",
      subtitle: "\uC791\uB144",
      subvalue: data.count.val_visitor_yearly_last["0"]
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC774\uBC88 \uB2EC \uBC29\uBB38\uC790 \uC218",
      value: data.count.val_visitor_monthly["0"],
      unit: "\uBA85",
      subtitle: "\uC9C0\uB09C \uB2EC",
      subvalue: data.count.val_visitor_monthly_last["0"]
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC624\uB298 \uBC29\uBB38\uC790 \uC218",
      value: data.count.val_visitor_daily["0"],
      unit: "\uBA85",
      subtitle: "\uC5B4\uC81C",
      subvalue: data.count.val_visitor_daily_last["0"]
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uD398\uC774\uC9C0 \uBDF0" }), /* @__PURE__ */ React.createElement("dl", { className: "grid grid-cols-1 w-full md:grid-cols-4 gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uCD1D \uD398\uC774\uC9C0 \uBDF0", value: data.count.val_pageview_total["0"], unit: "\uAC74" }), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC62C\uD574 \uD398\uC774\uC9C0 \uBDF0",
      value: data.count.val_pageview_yearly["0"],
      unit: "\uAC74",
      subtitle: "\uC791\uB144",
      subvalue: data.count.val_pageview_yearly_last["0"]
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC774\uBC88 \uB2EC \uD398\uC774\uC9C0 \uBDF0",
      value: data.count.val_pageview_monthly["0"],
      unit: "\uAC74",
      subtitle: "\uC9C0\uB09C \uB2EC",
      subvalue: data.count.val_pageview_monthly_last["0"]
    }
  ), /* @__PURE__ */ React.createElement(
    Div_sub_card,
    {
      title: "\uC624\uB298 \uD398\uC774\uC9C0 \uBDF0",
      value: data.count.val_pageview_daily["0"],
      unit: "\uAC74",
      subtitle: "\uC5B4\uC81C",
      subvalue: data.count.val_pageview_daily_last["0"]
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement("dl", { className: "flex flex-col justify-center items-start w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement("ul", { className: "flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 w-full" }, /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart(data.list_daily, "graph_tab_daily") }, /* @__PURE__ */ React.createElement("div", { className: class_tab_inactive, id: "graph_tab_daily" }, "\uC77C")), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart(data.list_monthly, "graph_tab_monthly") }, /* @__PURE__ */ React.createElement("div", { className: class_tab_active, id: "graph_tab_monthly" }, "\uC6D4")), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart(data.list_yearly, "graph_tab_yearly") }, /* @__PURE__ */ React.createElement("div", { className: class_tab_inactive, id: "graph_tab_yearly" }, "\uB144"))), /* @__PURE__ */ React.createElement("div", { id: "div_statistics_graph", name: "div_statistics_graph", className: "w-full h-[500px] p-8" }))))));
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
  const rows = Object.values(inputData || {}).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const categories = rows.map((d) => d.date);
  const visitors = rows.map((d) => d.avg_visitor || 0);
  const pageviews = rows.map((d) => d.cnt_pageview || 0);
  const option = {
    title: {
      text: "\uBC29\uBB38 \uCD94\uC774 \uADF8\uB798\uD504",
      left: "center",
      top: 0,
      textStyle: { fontSize: 24, fontWeight: "700" }
    },
    legend: { data: ["\uBC29\uBB38\uC790 \uC218", "\uD398\uC774\uC9C0 \uBDF0"], top: 36 },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    toolbox: {
      right: 10,
      feature: { dataZoom: { yAxisIndex: "none" }, restore: {}, saveAsImage: {} }
    },
    grid: { left: 60, right: 60, top: 80, bottom: 60 },
    xAxis: { type: "category", data: categories, axisLabel: { interval: "auto" } },
    yAxis: [
      { type: "value", name: "\uBC29\uBB38\uC790 \uC218" },
      { type: "value", name: "\uD398\uC774\uC9C0 \uBDF0" }
    ],
    dataZoom: [
      { type: "inside", xAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseMove: true },
      { type: "slider", xAxisIndex: 0 }
    ],
    series: [
      { name: "\uBC29\uBB38\uC790 \uC218", type: "bar", yAxisIndex: 0, data: visitors, barMaxWidth: 28 },
      { name: "\uD398\uC774\uC9C0 \uBDF0", type: "bar", yAxisIndex: 1, data: pageviews, barMaxWidth: 28 }
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
  const data = await fetch("/admin/ajax_get_admin_visitors/", { method: "POST" }).then((res) => res.json());
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
