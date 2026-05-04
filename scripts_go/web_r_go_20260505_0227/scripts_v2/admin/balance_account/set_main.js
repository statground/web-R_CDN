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
  return /* @__PURE__ */ React.createElement("div", { class: "col-span-2 md:grid-cols-1 justify-center item-center" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col md:flex-row lg:w-48 md:w-full item-center" }, /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uCCAB \uD654\uBA74", url: "/admin/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uD65C\uC131 \uC0AC\uC6A9\uC790", url: "/admin/active_users/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "Web-R \uC811\uC18D \uD604\uD669", url: "/admin/webr/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uBC29\uBB38 \uD604\uD669", url: "/admin/visitors/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uD68C\uC6D0 \uD604\uD669", url: "/admin/members/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uACB0\uC81C \uD604\uD669", url: "/admin/payments/" }), /* @__PURE__ */ React.createElement(Div_menu_button, { name: "\uC815\uC0B0\uC561 \uC870\uD68C", url: "/admin/balance_account/?year=" + date.getFullYear().toString() + "&month=" + (date.getMonth() + 1).toString() })));
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
function Div_main_skeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { class: "col-span-10 space-y-4 md:grid-cols-1 justify-center item-center" }, /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_select", name: "div_select" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center w-full space-x-2 animate-pulse" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col" }, /* @__PURE__ */ React.createElement("label", { for: "small", class: "block text-sm font-medium text-gray-900 dark:text-white" }, "Year"), /* @__PURE__ */ React.createElement("select", { id: "small", class: "block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col" }, /* @__PURE__ */ React.createElement("label", { for: "small", class: "block text-sm font-medium text-gray-900 dark:text-white" }, "Month"), /* @__PURE__ */ React.createElement("select", { id: "small", class: "block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" })), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-fit\n									   hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
    },
    "\uC120\uD0DD"
  ))), /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "div_statistics_payments",
      name: "div_statistics_payments",
      class: "w-full bg-white border border-gray-200 rounded-lg shadow"
    },
    /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uACB0\uC81C \uD604\uD669" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-3 w-full md:grid-cols-1 gap-8 pt-8 mx-auto text-gray-900 md:pt-4" }, /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uCD1D \uD68C\uC6D0 \uC5C5\uADF8\uB808\uC774\uB4DC \uACB0\uC81C" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uBD80\uAC00\uC138 (10%)" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20 \uC218\uC218\uB8CC (3.63%)" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uD1B5\uACC4\uB9C8\uB2F9 \uC218\uC218\uB8CC (10%)" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uAE30\uD0C0\uC18C\uB4DD \uC138\uAE08 (8.8%)" }), /* @__PURE__ */ React.createElement(Div_sub_card_skeleton, { title: "\uC815\uC0B0\uC561" })))
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
  const class_span_btn_default = "flex flex-row justify-center items-center w-fit text-xs font-medium px-2.5 py-0.5 rounded-full";
  const payment_list = Object.keys(props.data.table).map(
    (btn_data) => /* @__PURE__ */ React.createElement("div", { key: btn_data, class: "bg-white border-b w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col px-6 py-4 space-y-1 cursor-pointer hover:bg-gray-100 w-full" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement("span", { class: "font-bold text-sm w-fit max-w-9/12 truncate ..." }, props.data.table[btn_data].product_name)), /* @__PURE__ */ React.createElement("div", { class: "flex flex-wrap justify-start items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " bg-green-100 text-green-800" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/board_user.svg", class: "w-3 h-3 mr-1" }), props.data.table[btn_data].username), /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " bg-gray-100 text-gray-800" }, props.data.table[btn_data].email), /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " bg-yellow-100 text-yellow-800" }, props.data.table[btn_data].amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","), "\uC6D0"), /* @__PURE__ */ React.createElement("span", { class: class_span_btn_default + " bg-blue-100 text-blue-800" }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/calendar_" + Number(props.data.table[btn_data].updated_at.split("-")[2].substr(0, 2)).toString() + ".svg", class: "w-3 h-3 mr-1" }), props.data.table[btn_data].updated_at))))
  );
  return /* @__PURE__ */ React.createElement("div", { class: "grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { class: "col-span-10 md:grid-cols-1 justify-center item-center space-y-4" }, /* @__PURE__ */ React.createElement("div", { class: "w-full", id: "div_select", name: "div_select" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center w-full space-x-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col" }, /* @__PURE__ */ React.createElement("label", { for: "sel_year", class: "block text-sm font-medium text-gray-900 dark:text-white" }, "Year"), /* @__PURE__ */ React.createElement("select", { id: "sel_year", class: "block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col" }, /* @__PURE__ */ React.createElement("label", { for: "sel_momth", class: "block text-sm font-medium text-gray-900 dark:text-white" }, "Month"), /* @__PURE__ */ React.createElement("select", { id: "sel_momth", class: "block w-fit min-w-[100px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" }, /* @__PURE__ */ React.createElement("option", { value: "1" }, "01"), /* @__PURE__ */ React.createElement("option", { value: "2" }, "02"), /* @__PURE__ */ React.createElement("option", { value: "3" }, "03"), /* @__PURE__ */ React.createElement("option", { value: "4" }, "04"), /* @__PURE__ */ React.createElement("option", { value: "5" }, "05"), /* @__PURE__ */ React.createElement("option", { value: "6" }, "06"), /* @__PURE__ */ React.createElement("option", { value: "7" }, "07"), /* @__PURE__ */ React.createElement("option", { value: "8" }, "08"), /* @__PURE__ */ React.createElement("option", { value: "9" }, "09"), /* @__PURE__ */ React.createElement("option", { value: "10" }, "10"), /* @__PURE__ */ React.createElement("option", { value: "11" }, "11"), /* @__PURE__ */ React.createElement("option", { value: "12" }, "12"))), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => location.href = "/admin/balance_account/?year=" + document.getElementById("sel_year").value + "&month=" + document.getElementById("sel_momth").value,
      class: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-fit\n									   hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
    },
    "\uC120\uD0DD"
  ))), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uACB0\uC81C \uD604\uD669" }), /* @__PURE__ */ React.createElement("dl", { class: "grid grid-cols-3 w-full gap-8 p-4 mx-auto text-gray-900 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uCD1D \uD68C\uC6D0 \uC5C5\uADF8\uB808\uC774\uB4DC \uACB0\uC81C", value: props.data.count.amt_total["0"], unit: "\uC6D0" }), /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uBD80\uAC00\uC138 (10%)", value: props.data.count.amt_tax["0"], unit: "\uC6D0" }), /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20 \uC218\uC218\uB8CC (3.63%)", value: props.data.count.amt_toss["0"], unit: "\uC6D0" }), /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uD1B5\uACC4\uB9C8\uB2F9 \uC218\uC218\uB8CC (10%)", value: props.data.count.amt_statground["0"], unit: "\uC6D0" }), /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uAE30\uD0C0\uC18C\uB4DD \uC138\uAE08 (8.8%)", value: props.data.count.amt_benefit_tax["0"], unit: "\uC6D0" }), /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uC815\uC0B0\uC561", value: props.data.count.amt_result["0"], unit: "\uC6D0" })))), /* @__PURE__ */ React.createElement("div", { class: "w-full bg-white border border-gray-200 rounded-lg shadow" }, /* @__PURE__ */ React.createElement("div", { class: "p-4 bg-white rounded-lg md:p-8 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uACB0\uC81C \uBAA9\uB85D" }), /* @__PURE__ */ React.createElement("dl", { class: "flex flex-col justify-center items-center w-full p-4 mx-auto text-gray-900" }, payment_list)))));
}
async function get_main() {
  const data = await fetch("/admin/ajax_get_admin_balance_account/?year=" + year + "&month=" + month).then((res) => {
    return res.json();
  }).then((res) => {
    return res;
  });
  ReactDOM.render(/* @__PURE__ */ React.createElement(Div_main, { data }), document.getElementById("div_main"));
  var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  for (var tempyear = 2015; tempyear <= currentYear; tempyear++) {
    var option = document.createElement("option");
    option.text = tempyear;
    option.value = tempyear;
    document.getElementById("sel_year").appendChild(option);
    ;
  }
  var select_year = document.getElementById("sel_year");
  for (var i = 0; i < select_year.options.length; i++) {
    if (select_year.options[i].value == year) {
      select_year.selectedIndex = i;
      break;
    }
  }
  var select_month = document.getElementById("sel_momth");
  for (var i = 0; i < select_month.options.length; i++) {
    if (select_month.options[i].value == month) {
      select_month.selectedIndex = i;
      break;
    }
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
    const headerData = await fetch("/ajax_get_menu_header/").then((res) => res.json());
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
