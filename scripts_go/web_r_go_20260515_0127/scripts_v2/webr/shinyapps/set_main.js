function getCookieValue(name) {
  if (typeof document === "undefined" || !document.cookie) {
    return "";
  }
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return "";
}
function buildPostInit(body) {
  const csrfToken = getCookieValue("csrftoken");
  const headers = {};
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }
  return {
    method: "post",
    headers,
    body
  };
}
function normalizeWebrUrl(rawUrl) {
  if (rawUrl === void 0 || rawUrl === null || rawUrl === "" || rawUrl === "None") {
    return "None";
  }
  return String(rawUrl);
}
function getCurrentWebrUrl() {
  try {
    if (typeof url !== "undefined") {
      return normalizeWebrUrl(url);
    }
  } catch (e) {
  }
  if (typeof window !== "undefined" && window.WEBR_URL !== void 0) {
    return normalizeWebrUrl(window.WEBR_URL);
  }
  return "None";
}
function resolveWebrSubtitle(currentUrl) {
  if (currentUrl === "member") {
    return "\uC815\uD68C\uC6D0 \uC11C\uBC84 \uC811\uC18D";
  }
  if (currentUrl === "None" || currentUrl === "free") {
    return "\uBB34\uB8CC \uC11C\uBC84 \uC811\uC18D";
  }
  return "Web-R \uC811\uC18D";
}
function resolveWebrAccessTag(currentUrl) {
  if (currentUrl === "member") {
    return "Advance";
  }
  return "Free";
}
function getCurrentUsername() {
  try {
    if (typeof gv_username !== "undefined" && gv_username !== null) {
      return String(gv_username);
    }
  } catch (e) {
  }
  if (typeof window !== "undefined" && window.gv_username !== void 0 && window.gv_username !== null) {
    return String(window.gv_username);
  }
  return "";
}
function set_main() {
  const currentUrl = getCurrentWebrUrl();
  async function connectApp(appName, appTag) {
    try {
      const requestData = new FormData();
      requestData.append("name", appName || "");
      requestData.append("tag", appTag || "");
      const response = await fetch("/webr/ajax_connect_shinyapp/", buildPostInit(requestData));
      if (!response.ok) {
        throw new Error("server_error");
      }
      const data = await response.json();
      if (!data || !data.url) {
        throw new Error("invalid_response");
      }
      window.open(data.url, appName || "Web-R");
    } catch (e) {
      alert("\uC571 \uC811\uC18D\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
    }
  }
  function AppSkeletonCard() {
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center w-full h-48 bg-gray-300 rounded" }, /* @__PURE__ */ React.createElement("svg", { className: "w-10 h-10 text-gray-200", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 20 18" }, /* @__PURE__ */ React.createElement("path", { d: "M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" }))), /* @__PURE__ */ React.createElement("div", { className: "h-2.5 bg-gray-200 rounded-full w-48 mb-4" }));
  }
  function AppGrid(props) {
    const username = getCurrentUsername();
    const rows = Object.keys(props.data || {});
    if (rows.length === 0) {
      return /* @__PURE__ */ React.createElement("div", { className: "w-full rounded-lg border border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500" }, "\uD45C\uC2DC\uD560 Web-R \uC571\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
    }
    return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" }, rows.map((rowKey) => {
      const app = props.data[rowKey] || {};
      const authFlag = String(app.auth || "").toUpperCase();
      const showLoginNotice = username === "";
      const showMembershipNotice = username !== "" && authFlag === "NO";
      const showConnectButton = username !== "" && authFlag === "YES";
      return /* @__PURE__ */ React.createElement("div", { key: rowKey, className: "flex flex-col justify-center items-center bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-2" }, app.url_image ? /* @__PURE__ */ React.createElement("img", { className: "w-full rounded-lg", src: app.url_image, alt: app.name || rowKey }) : /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center w-full h-48 rounded-lg bg-slate-100 text-slate-400 text-sm" }, "No image"), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold tracking-tight text-gray-900 text-center break-words w-full" }, app.name || rowKey), showLoginNotice ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-red-500" }, "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.") : null, showMembershipNotice ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-red-500" }, "\uC815\uD68C\uC6D0 \uC774\uC0C1\uB9CC \uC811\uC18D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.") : null, showConnectButton ? /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          onClick: () => connectApp(app.name, app.tag),
          className: "text-gray-900 font-extrabold bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 rounded-lg text-sm px-5 py-1.5 text-center hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300"
        },
        "\uC811\uC18D\uD558\uAE30"
      ) : null);
    }));
  }
  function WebrLandingPage() {
    const [appData, setAppData] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState("");
    React.useEffect(() => {
      let alive = true;
      async function loadAppList() {
        setErrorMsg("");
        try {
          const requestData = new FormData();
          requestData.append("tag", resolveWebrAccessTag(currentUrl));
          const response = await fetch("/webr/ajax_get_shinyapp_list/", buildPostInit(requestData));
          if (!response.ok) {
            throw new Error("server_error");
          }
          const data = await response.json();
          if (!alive) {
            return;
          }
          setAppData(data || {});
        } catch (e) {
          if (!alive) {
            return;
          }
          setAppData({});
          setErrorMsg("\uC571 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
        }
      }
      loadAppList();
      return () => {
        alive = false;
      };
    }, [currentUrl]);
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center py-8 px-6 w-full max-w-5xl mx-auto md:px-20" }, /* @__PURE__ */ React.createElement(Div_page_header, { title: resolveWebrSubtitle(currentUrl), subtitle: "Web-R \uC811\uC18D" }), /* @__PURE__ */ React.createElement("div", { id: "div_app_list", className: "w-full" }, appData === null ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse" }, /* @__PURE__ */ React.createElement(AppSkeletonCard, null), /* @__PURE__ */ React.createElement(AppSkeletonCard, null), /* @__PURE__ */ React.createElement(AppSkeletonCard, null), /* @__PURE__ */ React.createElement(AppSkeletonCard, null), /* @__PURE__ */ React.createElement(AppSkeletonCard, null), /* @__PURE__ */ React.createElement(AppSkeletonCard, null)) : errorMsg ? /* @__PURE__ */ React.createElement("div", { className: "w-full rounded-lg border border-rose-200 bg-rose-50 px-6 py-8 text-center text-sm text-rose-600" }, errorMsg) : /* @__PURE__ */ React.createElement(AppGrid, { data: appData })));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(WebrLandingPage, null), document.getElementById("div_main"));
}
