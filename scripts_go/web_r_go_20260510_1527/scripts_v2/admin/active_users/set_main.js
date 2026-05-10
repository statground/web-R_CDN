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
function Div_main_skeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { className: "col-span-10 flex flex-col space-y-8" }, Array.from({ length: 4 }).map((_, idx) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: idx,
      className: "w-full bg-white border border-gray-200 rounded-lg shadow animate-pulse"
    },
    /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "h-6 w-40 bg-gray-200 rounded mb-6" }), /* @__PURE__ */ React.createElement("div", { className: "h-[350px] w-full bg-gray-100 rounded" }))
  ))));
}
function Div_main(props) {
  const data = props.data || {};
  const getSortedRows = (list) => {
    const arr = Array.isArray(list) ? list.slice() : Object.values(list || {});
    arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    return arr;
  };
  const dailyRows = getSortedRows(data.list_daily);
  const monthlyRows = getSortedRows(data.list_monthly);
  const yearlyRows = getSortedRows(data.list_yearly);
  const totalRows = getSortedRows(data.list_total);
  const [activeTab, setActiveTab] = React.useState("monthly");
  const [selectedDates, setSelectedDates] = React.useState(() => ({
    daily: dailyRows.length ? dailyRows[dailyRows.length - 1].date : "",
    monthly: monthlyRows.length ? monthlyRows[monthlyRows.length - 1].date : "",
    yearly: yearlyRows.length ? yearlyRows[yearlyRows.length - 1].date : ""
  }));
  const tabIdMap = {
    daily: "graph_tab_daily",
    monthly: "graph_tab_monthly",
    yearly: "graph_tab_yearly",
    total: "graph_tab_total"
  };
  const getActiveRows = () => {
    if (activeTab === "daily") {
      if (!dailyRows.length)
        return [];
      const sel = selectedDates.daily || dailyRows[dailyRows.length - 1].date;
      return dailyRows.filter((r) => r.date <= sel);
    }
    if (activeTab === "monthly") {
      if (!monthlyRows.length)
        return [];
      const sel = selectedDates.monthly || monthlyRows[monthlyRows.length - 1].date;
      return monthlyRows.filter((r) => r.date <= sel);
    }
    if (activeTab === "yearly") {
      if (!yearlyRows.length)
        return [];
      const sel = selectedDates.yearly || yearlyRows[yearlyRows.length - 1].date;
      return yearlyRows.filter((r) => r.date <= sel);
    }
    return totalRows;
  };
  React.useEffect(() => {
    const rows = getActiveRows();
    if (!rows.length)
      return;
    draw_chart(rows, tabIdMap[activeTab]);
  }, [activeTab, selectedDates, data]);
  const classCard = "w-full bg-white border border-gray-200 rounded-lg shadow";
  const classWrap = "p-4 bg-white rounded-lg md:p-8 text-center";
  const Kpi = ({ title, idVal, subTop, subBottom, idRate }) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-4xl font-extrabold" }, /* @__PURE__ */ React.createElement("span", { id: idVal }, "0"), "\uBA85"), /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-xl font-semibold" }, title), /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-slate-500 text-sm leading-snug text-center" }, subTop && /* @__PURE__ */ React.createElement(React.Fragment, null, subTop, /* @__PURE__ */ React.createElement("br", null)), subBottom, idRate && /* @__PURE__ */ React.createElement(React.Fragment, null, " ", /* @__PURE__ */ React.createElement("span", { id: idRate }, "0.0%"))));
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };
  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDates((prev) => {
      const next = { ...prev };
      if (activeTab === "daily") {
        next.daily = value;
      } else if (activeTab === "monthly") {
        next.monthly = value;
      } else if (activeTab === "yearly") {
        next.yearly = value;
      }
      return next;
    });
  };
  let currentValue = "";
  let minValue = "";
  let maxValue = "";
  if (activeTab === "daily") {
    currentValue = selectedDates.daily || (dailyRows.length ? dailyRows[dailyRows.length - 1].date : "");
    minValue = dailyRows.length ? dailyRows[0].date : "";
    maxValue = dailyRows.length ? dailyRows[dailyRows.length - 1].date : "";
  } else if (activeTab === "monthly") {
    currentValue = selectedDates.monthly || (monthlyRows.length ? monthlyRows[monthlyRows.length - 1].date : "");
    minValue = monthlyRows.length ? monthlyRows[0].date : "";
    maxValue = monthlyRows.length ? monthlyRows[monthlyRows.length - 1].date : "";
  } else if (activeTab === "yearly") {
    currentValue = selectedDates.yearly || (yearlyRows.length ? yearlyRows[yearlyRows.length - 1].date : "");
    minValue = yearlyRows.length ? yearlyRows[0].date : "";
    maxValue = yearlyRows.length ? yearlyRows[yearlyRows.length - 1].date : "";
  }
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-12 md:grid-cols-1 justify-center items-top w-full px-[100px] py-[20px] md:px-[10px]" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { className: "col-span-10 md:grid-cols-1 justify-center items-center" }, /* @__PURE__ */ React.createElement("div", { className: classCard }, /* @__PURE__ */ React.createElement("div", { className: classWrap }, /* @__PURE__ */ React.createElement("dl", { className: "flex flex-col justify-center items-start w-full p-4 mx-auto text-gray-900" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between w-full mb-4 gap-3" }, /* @__PURE__ */ React.createElement("ul", { className: "flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 flex-1" }, /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => handleTabClick("daily") }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: activeTab === "daily" ? class_tab_active : class_tab_inactive,
      id: "graph_tab_daily"
    },
    "\uC77C"
  )), /* @__PURE__ */ React.createElement(
    "li",
    {
      className: "me-2",
      onClick: () => handleTabClick("monthly")
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: activeTab === "monthly" ? class_tab_active : class_tab_inactive,
        id: "graph_tab_monthly"
      },
      "\uC6D4"
    )
  ), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => handleTabClick("yearly") }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: activeTab === "yearly" ? class_tab_active : class_tab_inactive,
      id: "graph_tab_yearly"
    },
    "\uB144"
  )), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => handleTabClick("total") }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: activeTab === "total" ? class_tab_active : class_tab_inactive,
      id: "graph_tab_total"
    },
    "\uC804\uCCB4"
  ))), activeTab !== "total" && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-700" }, /* @__PURE__ */ React.createElement("span", null, activeTab === "daily" ? "\uB0A0\uC9DC \uC120\uD0DD" : activeTab === "monthly" ? "\uB144\uC6D4 \uC120\uD0DD" : "\uC5F0\uB3C4 \uC120\uD0DD", ":"), activeTab === "daily" && /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "date",
      className: "border border-gray-300 rounded-lg p-2 text-sm",
      min: minValue,
      max: maxValue,
      value: currentValue,
      onChange: handleDateChange
    }
  ), activeTab === "monthly" && /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "month",
      className: "border border-gray-300 rounded-lg p-2 text-sm",
      min: minValue,
      max: maxValue,
      value: currentValue,
      onChange: handleDateChange
    }
  ), activeTab === "yearly" && /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      className: "border border-gray-300 rounded-lg p-2 w-24 text-sm",
      min: minValue || void 0,
      max: maxValue || void 0,
      value: currentValue,
      onChange: handleDateChange
    }
  ))), /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uD37C\uB110 \uC694\uC57D" }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-5 gap-8 md:grid-cols-1 p-4 w-full" }, /* @__PURE__ */ React.createElement(
    Kpi,
    {
      title: "\uBC29\uBB38\uC790",
      idVal: "kpi_visit_val",
      subTop: "",
      subBottom: "(\uCD5C\uC0C1\uB2E8 \uBAA8\uC218)",
      idRate: ""
    }
  ), /* @__PURE__ */ React.createElement(
    Kpi,
    {
      title: "\uAC00\uC785\uC790",
      idVal: "kpi_signup_val",
      subTop: /* @__PURE__ */ React.createElement(React.Fragment, null, "(\uB204\uC801", " ", /* @__PURE__ */ React.createElement("span", { id: "kpi_cum_signup_val" }, "0"), "\uBA85)"),
      subBottom: "\uBC29\uBB38\u2192\uAC00\uC785 \uC804\uD658:",
      idRate: "kpi_cr1"
    }
  ), /* @__PURE__ */ React.createElement(
    Kpi,
    {
      title: "\uB85C\uADF8\uC778",
      idVal: "kpi_login_val",
      subTop: "",
      subBottom: "\uAC00\uC785\u2192\uB85C\uADF8\uC778 \uC804\uD658:",
      idRate: "kpi_cr2"
    }
  ), /* @__PURE__ */ React.createElement(
    Kpi,
    {
      title: "\uAC8C\uC2DC\uD310 \uC774\uC6A9",
      idVal: "kpi_board_val",
      subTop: "",
      subBottom: "\uB85C\uADF8\uC778\u2192\uAC8C\uC2DC\uD310 \uC804\uD658:",
      idRate: "kpi_cr3"
    }
  ), /* @__PURE__ */ React.createElement(
    Kpi,
    {
      title: "\uC571 \uC0AC\uC6A9",
      idVal: "kpi_app_val",
      subTop: "",
      subBottom: "\uB85C\uADF8\uC778\u2192\uC571 \uC804\uD658:",
      idRate: "kpi_cr4"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "w-full mt-6 space-y-6" }, /* @__PURE__ */ React.createElement("div", { id: "div_funnel_graph", className: "w-full h-[420px] p-2" }), /* @__PURE__ */ React.createElement("div", { id: "div_conv_graph", className: "w-full h-[380px] p-2" }), /* @__PURE__ */ React.createElement("div", { id: "div_trend_graph", className: "w-full h-[420px] p-2" })))))));
}
const GRAPH_TAB_IDS = [
  "graph_tab_daily",
  "graph_tab_monthly",
  "graph_tab_yearly",
  "graph_tab_total"
];
function draw_chart(inputData, activeTabId) {
  GRAPH_TAB_IDS.forEach(function(id) {
    const el = document.getElementById(id);
    if (!el)
      return;
    el.className = id === activeTabId ? class_tab_active : class_tab_inactive;
  });
  let rows;
  if (Array.isArray(inputData)) {
    rows = inputData.slice();
  } else {
    rows = Object.values(inputData || {});
  }
  rows.sort(function(a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  const n = function(x) {
    return +x || 0;
  };
  const fmt = function(x) {
    return n(x).toLocaleString();
  };
  const rate = function(a, b) {
    return b > 0 ? (+a || 0) / (+b || 0) * 100 : 0;
  };
  if (!rows.length) {
    ["kpi_visit_val", "kpi_signup_val", "kpi_login_val", "kpi_board_val", "kpi_app_val"].forEach(function(id) {
      const el = document.getElementById(id);
      if (el)
        el.innerText = "0";
    });
    ["kpi_cr1", "kpi_cr2", "kpi_cr3", "kpi_cr4"].forEach(function(id) {
      const el = document.getElementById(id);
      if (el)
        el.innerText = "0.0%";
    });
    const cumEl0 = document.getElementById("kpi_cum_signup_val");
    if (cumEl0)
      cumEl0.innerText = "0";
    return;
  }
  const last = rows[rows.length - 1] || {};
  const isMonthly = activeTabId === "graph_tab_monthly" || last.type === "monthly";
  let cumSignup;
  if (typeof last.cum_signup !== "undefined") {
    cumSignup = n(last.cum_signup);
  } else {
    cumSignup = rows.reduce(function(sum, r) {
      return sum + n(r.cnt_signup);
    }, 0);
  }
  let cumVisit = 0;
  if (isMonthly) {
    cumVisit = rows.reduce(function(sum, r) {
      return sum + n(r.cnt_visit);
    }, 0);
  }
  const visit = n(last.cnt_visit);
  const signup = n(last.cnt_signup);
  const login = n(last.cnt_login);
  const board = n(last.cnt_board);
  const app = n(last.cnt_app);
  let cr1, cr2, cr3, cr4;
  if (isMonthly) {
    cr1 = rate(cumSignup, cumVisit);
    cr2 = rate(login, cumSignup);
  } else {
    cr1 = rate(signup, visit);
    cr2 = rate(login, signup);
  }
  cr3 = rate(board, login);
  cr4 = rate(app, login);
  const setText = function(id, val) {
    const el = document.getElementById(id);
    if (el)
      el.innerText = val;
  };
  setText("kpi_cum_signup_val", fmt(cumSignup));
  setText("kpi_visit_val", fmt(visit));
  setText("kpi_signup_val", fmt(signup));
  setText("kpi_login_val", fmt(login));
  setText("kpi_board_val", fmt(board));
  setText("kpi_app_val", fmt(app));
  setText("kpi_cr1", (isNaN(cr1) ? 0 : cr1).toFixed(1) + "%");
  setText("kpi_cr2", (isNaN(cr2) ? 0 : cr2).toFixed(1) + "%");
  setText("kpi_cr3", (isNaN(cr3) ? 0 : cr3).toFixed(1) + "%");
  setText("kpi_cr4", (isNaN(cr4) ? 0 : cr4).toFixed(1) + "%");
  const ensureChart = function(domId) {
    const el = document.getElementById(domId);
    if (!el)
      return null;
    const prev = echarts.getInstanceByDom(el);
    if (prev)
      prev.dispose();
    return echarts.init(el, null, { renderer: "canvas" });
  };
  const chartFunnel = ensureChart("div_funnel_graph");
  if (chartFunnel) {
    const funnelData = [
      { name: "\uBC29\uBB38\uC790", value: visit },
      { name: "\uAC00\uC785\uC790", value: signup },
      { name: "\uB85C\uADF8\uC778", value: login },
      { name: "\uAC8C\uC2DC\uD310 \uC774\uC6A9", value: board },
      { name: "\uC571 \uC0AC\uC6A9", value: app }
    ];
    chartFunnel.setOption({
      title: {
        text: "\uD37C\uB110 \uC2A4\uB0C5\uC0F7",
        left: "center",
        top: 10
      },
      tooltip: {
        trigger: "item",
        formatter: function(p) {
          return p.name + ": " + (+p.value || 0).toLocaleString() + "\uBA85";
        }
      },
      series: [
        {
          type: "funnel",
          left: "10%",
          width: "80%",
          top: 80,
          bottom: 20,
          sort: "descending",
          gap: 4,
          label: {
            show: true,
            position: "inside",
            formatter: "{b}\n{c}"
          },
          itemStyle: {
            borderColor: "#ffffff",
            borderWidth: 1
          },
          data: funnelData
        }
      ]
    });
  }
  const chartConv = ensureChart("div_conv_graph");
  if (chartConv) {
    const cats = ["\uBC29\uBB38\u2192\uAC00\uC785", "\uAC00\uC785\u2192\uB85C\uADF8\uC778", "\uB85C\uADF8\uC778\u2192\uAC8C\uC2DC\uD310", "\uB85C\uADF8\uC778\u2192\uC571"];
    const vals = [
      isNaN(cr1) ? 0 : cr1,
      isNaN(cr2) ? 0 : cr2,
      isNaN(cr3) ? 0 : cr3,
      isNaN(cr4) ? 0 : cr4
    ].map(function(v) {
      return +v.toFixed(1);
    });
    const maxRate = Math.max.apply(null, [0].concat(vals));
    const yMax = Math.max(100, Math.ceil(maxRate / 10) * 10);
    chartConv.setOption({
      title: {
        text: "\uB2E8\uACC4\uBCC4 \uC804\uD658\uC728(%)",
        left: "center",
        top: 10
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" }
      },
      grid: {
        top: 80,
        left: 60,
        right: 30,
        bottom: 40
      },
      xAxis: {
        type: "category",
        data: cats
      },
      yAxis: {
        type: "value",
        max: yMax,
        axisLabel: { formatter: "{value}%" }
      },
      series: [
        {
          type: "bar",
          data: vals,
          barMaxWidth: 32,
          label: {
            show: true,
            position: "top",
            formatter: "{c}%"
          }
        }
      ]
    });
  }
  const chartTrend = ensureChart("div_trend_graph");
  if (chartTrend) {
    const labels = rows.map(function(r) {
      return r.date;
    });
    const sVisit = rows.map(function(r) {
      return n(r.cnt_visit);
    });
    const sSignup = rows.map(function(r) {
      return n(r.cnt_signup);
    });
    const sLogin = rows.map(function(r) {
      return n(r.cnt_login);
    });
    const sBoard = rows.map(function(r) {
      return n(r.cnt_board);
    });
    const sApp = rows.map(function(r) {
      return n(r.cnt_app);
    });
    chartTrend.setOption({
      title: {
        text: "\uD65C\uB3D9 \uCD94\uC774",
        left: "center",
        top: 10
      },
      tooltip: { trigger: "axis" },
      legend: {
        top: 40,
        data: ["\uBC29\uBB38", "\uAC00\uC785", "\uB85C\uADF8\uC778", "\uAC8C\uC2DC\uD310", "\uC571"]
      },
      grid: {
        top: 90,
        left: 60,
        right: 30,
        bottom: 40
      },
      xAxis: {
        type: "category",
        data: labels
      },
      yAxis: {
        type: "value"
      },
      dataZoom: [
        { type: "inside" },
        { type: "slider" }
      ],
      series: [
        { name: "\uBC29\uBB38", type: "line", data: sVisit, smooth: true },
        { name: "\uAC00\uC785", type: "line", data: sSignup, smooth: true },
        { name: "\uB85C\uADF8\uC778", type: "line", data: sLogin, smooth: true },
        { name: "\uAC8C\uC2DC\uD310", type: "line", data: sBoard, smooth: true },
        { name: "\uC571", type: "line", data: sApp, smooth: true }
      ]
    });
  }
  const onResize = function() {
    [chartFunnel, chartConv, chartTrend].forEach(function(c) {
      if (c)
        c.resize();
    });
  };
  window.addEventListener("resize", onResize, { passive: true });
}
async function get_main() {
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main_skeleton, null), document.getElementById("div_main"));
  try {
    const data = await fetch("/admin/ajax_get_admin_active_users/", { method: "POST" }).then(function(r) {
      return r.json();
    });
    const mount = document.getElementById("div_main");
    ReactDOM.render(
      /* @__PURE__ */ React.createElement(Div_main, { data }),
      mount
    );
  } catch (e) {
    console.error(e);
    document.getElementById("div_main").innerHTML = '<div class="text-center text-gray-500 py-10">\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.</div>';
  }
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
