function myInfoText(value) {
  if (value === null || value === void 0)
    return "";
  return String(value);
}
function myInfoNumber(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
function myInfoBool(value) {
  if (typeof value === "boolean")
    return value;
  const text = myInfoText(value).trim().toLowerCase();
  return text === "1" || text === "true" || text === "yes" || text === "on";
}
function myInfoRows(value) {
  return Object.values(value || {});
}
const myInfoDefaultGenderOptions = [
  { name: "Male", label: "\uB0A8\uC131" },
  { name: "Female", label: "\uC5EC\uC131" },
  { name: "\uAE30\uD0C0", label: "\uAE30\uD0C0" },
  { name: "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C", label: "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C" }
];
function myInfoResolvedGenderOptions(options) {
  return Array.isArray(options) && options.length ? options : myInfoDefaultGenderOptions;
}
function myInfoMoney(value) {
  return myInfoNumber(value).toLocaleString("ko-KR") + "\uC6D0";
}
function myInfoDate(value) {
  const text = myInfoText(value).trim();
  return text || "-";
}
function myInfoGenderLabel(value, options) {
  const text = myInfoText(value).trim();
  const found = myInfoResolvedGenderOptions(options).find((option) => option.name === text);
  if (found && found.label)
    return found.label;
  if (text === "Male")
    return "\uB0A8\uC131";
  if (text === "Female")
    return "\uC5EC\uC131";
  return text || "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C";
}
function myInfoArticleHref(row) {
  const direct = myInfoText(row.url).trim();
  if (direct)
    return direct;
  const category = myInfoText(row.category_url).trim() || "free";
  const uuid = myInfoText(row.uuid).trim();
  return uuid ? `/community/${category}/read/${uuid}/` : "/community/";
}
function myInfoCommentHref(row) {
  const uuid = myInfoText(row.uuid_article).trim();
  return uuid ? `/community/read/${uuid}/` : "/community/";
}
function myInfoStatusText(status) {
  const text = myInfoText(status).trim();
  if (text === "DONE")
    return "\uC644\uB8CC";
  if (text === "WAITING")
    return "\uB300\uAE30";
  if (text === "CANCELED")
    return "\uCDE8\uC18C";
  return text || "-";
}
function myInfoFetchJSON(url, options) {
  return fetch(url, { credentials: "same-origin", ...options || {} }).then((res) => res.json()).catch(() => ({}));
}
function myInfoGlobals() {
  return window.__webr_globals__ || {};
}
function myInfoTrim(value) {
  return myInfoText(value).trim();
}
function myInfoGoogleMessage(checker) {
  const messages = {
    GOOGLE_DISABLED: "\uAD6C\uAE00 \uB85C\uADF8\uC778\uC774 \uC544\uC9C1 \uC124\uC815\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.",
    CSRF_FAILED: "\uC5F0\uB3D9 \uC694\uCCAD\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.",
    NONCE_FAILED: "Google \uC751\uB2F5\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.",
    INVALID_GOOGLE_TOKEN: "Google \uACC4\uC815 \uC815\uBCF4\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
    GOOGLE_EMAIL_UNVERIFIED: "\uC778\uC99D\uB418\uC9C0 \uC54A\uC740 Google \uC774\uBA54\uC77C\uC785\uB2C8\uB2E4.",
    DOMAIN_NOT_ALLOWED: "\uD5C8\uC6A9\uB418\uC9C0 \uC54A\uC740 Google \uACC4\uC815 \uB3C4\uBA54\uC778\uC785\uB2C8\uB2E4.",
    GOOGLE_ALREADY_LINKED: "\uC774\uBBF8 \uB2E4\uB978 Google \uACC4\uC815\uC774 \uC5F0\uACB0\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.",
    GOOGLE_ALREADY_LINKED_OTHER: "\uC774\uBBF8 \uB2E4\uB978 Web-R \uACC4\uC815\uC5D0 \uC5F0\uACB0\uB41C Google \uACC4\uC815\uC785\uB2C8\uB2E4.",
    GOOGLE_EMAIL_OWNED_BY_OTHER_ACCOUNT: "\uD574\uB2F9 Google \uC774\uBA54\uC77C\uC744 \uC0AC\uC6A9\uD558\uB294 \uB2E4\uB978 Web-R \uACC4\uC815\uC774 \uC788\uC2B5\uB2C8\uB2E4.",
    GOOGLE_NOT_LINKED: "\uC5F0\uACB0\uB41C Google \uACC4\uC815\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
    PASSWORD_REQUIRED: "Google\uB85C \uAC00\uC785\uD55C \uACC4\uC815\uC740 \uBE44\uBC00\uBC88\uD638\uB97C \uBA3C\uC800 \uC124\uC815\uD55C \uB4A4 \uC5F0\uACB0\uC744 \uD574\uC81C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    INACTIVE: "\uBE44\uD65C\uC131 \uACC4\uC815\uC785\uB2C8\uB2E4.",
    NOTEXIST: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4."
  };
  return messages[checker] || "Google \uACC4\uC815 \uC5F0\uB3D9\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.";
}
function myInfoEscapeHTML(value) {
  return myInfoText(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}
function myInfoIsSafeURL(value, allowDataImage) {
  const text = myInfoText(value).trim();
  if (!text)
    return false;
  const compact = text.replace(/[\u0000-\u001f\s]+/g, "").toLowerCase();
  if (compact.startsWith("javascript:") || compact.startsWith("vbscript:") || compact.startsWith("data:text/html")) {
    return false;
  }
  return compact.startsWith("http://") || compact.startsWith("https://") || compact.startsWith("mailto:") || compact.startsWith("tel:") || compact.startsWith("/") || compact.startsWith("#") || allowDataImage && compact.startsWith("data:image/");
}
function myInfoSanitizeHTML(value) {
  const source = myInfoText(value).trim();
  if (!source)
    return "";
  if (!source.includes("<"))
    return myInfoEscapeHTML(source);
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${source}</div>`, "text/html");
  const allowedTags = /* @__PURE__ */ new Set([
    "a",
    "b",
    "blockquote",
    "br",
    "code",
    "del",
    "div",
    "em",
    "figcaption",
    "figure",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "i",
    "img",
    "li",
    "ol",
    "p",
    "pre",
    "s",
    "span",
    "strong",
    "sub",
    "sup",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "u",
    "ul"
  ]);
  const removedTags = /* @__PURE__ */ new Set([
    "base",
    "button",
    "embed",
    "form",
    "iframe",
    "input",
    "link",
    "meta",
    "object",
    "script",
    "select",
    "style",
    "textarea"
  ]);
  const globalAttrs = /* @__PURE__ */ new Set(["title"]);
  const tableAttrs = /* @__PURE__ */ new Set(["colspan", "rowspan"]);
  const sanitizeNode = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3)
        return;
      if (child.nodeType !== 1) {
        child.remove();
        return;
      }
      const tag = child.tagName.toLowerCase();
      if (removedTags.has(tag)) {
        child.remove();
        return;
      }
      if (!allowedTags.has(tag)) {
        const fragment = doc.createDocumentFragment();
        while (child.firstChild)
          fragment.appendChild(child.firstChild);
        child.replaceWith(fragment);
        sanitizeNode(node);
        return;
      }
      Array.from(child.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const valueText = attr.value;
        if (name.startsWith("on")) {
          child.removeAttribute(attr.name);
          return;
        }
        if (name === "href" && tag === "a") {
          if (!myInfoIsSafeURL(valueText, false))
            child.removeAttribute(attr.name);
          return;
        }
        if (name === "src" && tag === "img") {
          if (!myInfoIsSafeURL(valueText, true))
            child.removeAttribute(attr.name);
          return;
        }
        if (tag === "img" && ["alt", "width", "height"].includes(name) || globalAttrs.has(name) || ["td", "th"].includes(tag) && tableAttrs.has(name)) {
          return;
        }
        child.removeAttribute(attr.name);
      });
      if (tag === "a" && child.getAttribute("href")) {
        child.setAttribute("rel", "noopener noreferrer");
      }
      sanitizeNode(child);
    });
  };
  sanitizeNode(doc.body);
  return doc.body.firstElementChild ? doc.body.firstElementChild.innerHTML : "";
}
function myInfoAppendUserForm(form, user, nextEmail, nextGender, nextEmailSubscription) {
  const gender = myInfoText(nextGender || user.gender).trim() || "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C";
  const subscription = !!nextEmailSubscription;
  form.append("txt_email", myInfoText(nextEmail || user.email));
  form.append("txt_name", myInfoText(user.name));
  form.append("txt_realname", myInfoText(user.realname));
  form.append("sel_gender", gender);
  form.append("rad_gender", gender);
  if (subscription)
    form.append("chk_email_subscription", "on");
  form.append("rad_email_subscription", subscription ? "1" : "0");
}
function myInfoDateKey(value) {
  const text = myInfoText(value).trim();
  return text.length >= 10 ? text.slice(0, 10) : "";
}
function myInfoMonthKey(value) {
  const date = myInfoDateKey(value);
  return date.length >= 7 ? date.slice(0, 7) : "";
}
function myInfoYearKey(value) {
  const date = myInfoDateKey(value);
  return date.length >= 4 ? date.slice(0, 4) : "";
}
function myInfoUnitKey(value, granularity) {
  const unit = myInfoNormalizeGranularity(granularity);
  if (unit === "year")
    return myInfoYearKey(value);
  if (unit === "month")
    return myInfoMonthKey(value);
  return myInfoDateKey(value);
}
function myInfoNormalizeGranularity(value, fallback) {
  const text = myInfoText(value).trim();
  if (text === "day" || text === "month" || text === "year")
    return text;
  return fallback || "day";
}
function myInfoUnitLabel(granularity) {
  const unit = myInfoNormalizeGranularity(granularity);
  if (unit === "year")
    return "\uC5F0\uBCC4";
  if (unit === "month")
    return "\uC6D4\uBCC4";
  return "\uC77C\uBCC4";
}
function myInfoNextUnitKey(key, granularity) {
  const unit = myInfoNormalizeGranularity(granularity);
  if (unit === "year")
    return String(Number(key) + 1);
  if (unit === "month") {
    const parts = key.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    if (!year || !month)
      return "";
    const next = new Date(year, month, 1);
    return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
  }
  const date = /* @__PURE__ */ new Date(`${key}T00:00:00`);
  if (Number.isNaN(date.getTime()))
    return "";
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function myInfoFillSeries(series, granularity) {
  if (!series || series.length === 0)
    return [];
  const sorted = [...series].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  const byKey = Object.fromEntries(sorted.map((item) => [item[0], myInfoNumber(item[1])]));
  const end = sorted[sorted.length - 1][0];
  const filled = [];
  let key = sorted[0][0];
  let guard = 0;
  while (key && key <= end && guard < 5e3) {
    filled.push([key, byKey[key] || 0]);
    key = myInfoNextUnitKey(key, granularity);
    guard += 1;
  }
  return filled;
}
function myInfoAggregateSeries(rows, granularity, valueGetter) {
  const unit = myInfoNormalizeGranularity(granularity);
  const values = {};
  (rows || []).forEach((row) => {
    const key = myInfoUnitKey(row.date || row.created_at, unit);
    if (!key)
      return;
    values[key] = (values[key] || 0) + myInfoNumber(valueGetter(row));
  });
  const series = Object.keys(values).sort().map((key) => [key, values[key]]);
  return myInfoFillSeries(series, unit);
}
function myInfoFilledKeys(seriesList, granularity) {
  const keys = (seriesList || []).flatMap((series) => series || []).map((item) => item[0]).filter(Boolean).sort();
  if (keys.length === 0)
    return [];
  return myInfoFillSeries([[keys[0], 0], [keys[keys.length - 1], 0]], granularity).map((item) => item[0]);
}
function myInfoDailySeries(rows) {
  const counts = {};
  (rows || []).forEach((row) => {
    const date = myInfoDateKey(row.date || row.created_at);
    if (!date)
      return;
    counts[date] = (counts[date] || 0) + myInfoNumber(row.cnt || 1);
  });
  return Object.keys(counts).sort().map((date) => [date, counts[date]]);
}
function myInfoSeriesRange(series) {
  if (!series || series.length === 0)
    return [];
  return [series[0][0], series[series.length - 1][0]];
}
function myInfoMaxSeriesValue(series) {
  return Math.max(1, ...(series || []).map((item) => myInfoNumber(item[1])));
}
function myInfoActivitySummaryOption(articleCount, commentCount, paymentCount) {
  return {
    grid: { top: 24, right: 18, bottom: 34, left: 42 },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["\uC4F4 \uAE00", "\uC4F4 \uB313\uAE00", "\uACB0\uC81C"],
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#cbd5e1" } }
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      splitLine: { lineStyle: { color: "#e2e8f0" } }
    },
    series: [{
      type: "bar",
      data: [articleCount, commentCount, paymentCount],
      barWidth: 34,
      itemStyle: { borderRadius: [6, 6, 0, 0], color: "#0f172a" }
    }]
  };
}
function myInfoPaymentAmountOption(rows, granularity) {
  const unit = myInfoNormalizeGranularity(granularity, "month");
  const series = myInfoAggregateSeries(rows, unit, (row) => row.amount);
  if (series.length === 0)
    return null;
  return {
    grid: { top: 24, right: 18, bottom: 34, left: 64 },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => myInfoMoney(value)
    },
    xAxis: {
      type: "category",
      data: series.map((item) => item[0]),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      axisLabel: { hideOverlap: true }
    },
    yAxis: {
      type: "value",
      axisLabel: { formatter: (value) => `${Math.round(value / 1e4)}\uB9CC` },
      splitLine: { lineStyle: { color: "#e2e8f0" } }
    },
    series: [{
      type: "bar",
      data: series.map((item) => item[1]),
      barMaxWidth: 28,
      itemStyle: { borderRadius: [6, 6, 0, 0], color: "#0284c7" }
    }]
  };
}
function myInfoCalendarOption(rows, title) {
  const allSeries = myInfoDailySeries(rows);
  if (allSeries.length === 0)
    return null;
  const lastDate = /* @__PURE__ */ new Date(`${allSeries[allSeries.length - 1][0]}T00:00:00`);
  const firstAllowed = new Date(lastDate);
  firstAllowed.setDate(firstAllowed.getDate() - 364);
  const series = allSeries.filter((item) => /* @__PURE__ */ new Date(`${item[0]}T00:00:00`) >= firstAllowed);
  if (series.length === 0)
    return null;
  const range = myInfoSeriesRange(series);
  const max = myInfoMaxSeriesValue(series);
  return {
    title: { text: title, left: 0, top: 0, textStyle: { color: "#0f172a", fontSize: 15, fontWeight: 700 } },
    tooltip: {
      formatter: (params) => `${params.value[0]}<br/>${myInfoNumber(params.value[1]).toLocaleString("ko-KR")}\uD68C`
    },
    visualMap: {
      min: 0,
      max,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      inRange: { color: ["#f8fafc", "#bae6fd", "#0ea5e9", "#0f172a"] },
      textStyle: { color: "#64748b" }
    },
    calendar: {
      top: 48,
      left: 34,
      right: 20,
      bottom: 42,
      range,
      cellSize: ["auto", 16],
      itemStyle: { borderColor: "#ffffff", borderWidth: 2 },
      splitLine: { lineStyle: { color: "#cbd5e1", width: 1 } },
      dayLabel: { color: "#64748b" },
      monthLabel: { color: "#64748b" },
      yearLabel: { show: false }
    },
    series: [{ type: "heatmap", coordinateSystem: "calendar", data: series }]
  };
}
function myInfoConnectionTrendOption(visitRows, shinyRows, granularity) {
  const unit = myInfoNormalizeGranularity(granularity);
  const visitSeries = myInfoAggregateSeries(visitRows, unit, (row) => row.cnt || 1);
  const shinySeries = myInfoAggregateSeries(shinyRows, unit, (row) => row.cnt || 1);
  const keys = myInfoFilledKeys([visitSeries, shinySeries], unit);
  if (keys.length === 0)
    return null;
  const visitByKey = Object.fromEntries(visitSeries);
  const shinyByKey = Object.fromEntries(shinySeries);
  return {
    legend: { top: 0, right: 0, textStyle: { color: "#475569" } },
    grid: { top: 42, right: 20, bottom: 34, left: 42 },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: keys,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      axisLabel: { hideOverlap: true }
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      splitLine: { lineStyle: { color: "#e2e8f0" } }
    },
    series: [
      { name: "\uBC29\uBB38", type: "line", smooth: true, showSymbol: false, data: keys.map((key) => visitByKey[key] || 0), symbolSize: 6, lineStyle: { width: 3, color: "#0f172a" }, itemStyle: { color: "#0f172a" }, areaStyle: { color: "rgba(15, 23, 42, 0.08)" } },
      { name: "\uC571 \uC811\uC18D", type: "line", smooth: true, showSymbol: false, data: keys.map((key) => shinyByKey[key] || 0), symbolSize: 6, lineStyle: { width: 3, color: "#0284c7" }, itemStyle: { color: "#0284c7" }, areaStyle: { color: "rgba(2, 132, 199, 0.08)" } }
    ]
  };
}
const myInfoGranularityOptions = [
  { key: "day", label: "\uC77C\uBCC4" },
  { key: "month", label: "\uC6D4\uBCC4" },
  { key: "year", label: "\uC5F0\uBCC4" }
];
function MyInfoGranularityControl(props) {
  const value = myInfoNormalizeGranularity(props.value, props.defaultValue || "day");
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1" }, myInfoGranularityOptions.map((option) => {
    const selected = option.key === value;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: option.key,
        type: "button",
        className: `rounded-md px-3 py-1.5 text-xs font-bold transition ${selected ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950"}`,
        "aria-pressed": selected,
        onClick: () => props.onChange(option.key)
      },
      option.label
    );
  }));
}
function MyInfoChart(props) {
  const ref = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setReady(false);
    if (!ref.current || !window.echarts || !props.option)
      return void 0;
    let canceled = false;
    const chart = window.echarts.init(ref.current);
    chart.setOption(props.option);
    window.requestAnimationFrame(() => {
      if (!canceled)
        setReady(true);
    });
    const resize = () => chart.resize();
    window.addEventListener("resize", resize);
    return () => {
      canceled = true;
      window.removeEventListener("resize", resize);
      chart.dispose();
    };
  }, [props.option]);
  const className = props.className || "h-[260px] w-full";
  if (props.loading) {
    return /* @__PURE__ */ React.createElement(MyInfoChartSkeleton, { className });
  }
  if (!props.option) {
    return /* @__PURE__ */ React.createElement(MyInfoTableEmpty, null, props.empty || "\uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
  }
  return /* @__PURE__ */ React.createElement("div", { className: `relative ${className}` }, /* @__PURE__ */ React.createElement("div", { ref, className: "h-full w-full" }), !ready ? /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 rounded-lg border border-slate-200 bg-white p-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex h-full animate-pulse flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 w-1/3 rounded-full bg-slate-200" }), /* @__PURE__ */ React.createElement("div", { className: "h-3 w-1/2 rounded-full bg-slate-100" })), /* @__PURE__ */ React.createElement("div", { className: "grid h-2/3 grid-cols-12 items-end gap-2" }, [35, 60, 44, 76, 52, 88, 63, 48, 72, 55, 81, 66].map((height, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "rounded-t bg-slate-200", style: { height: `${height}%` } }))), /* @__PURE__ */ React.createElement("div", { className: "h-3 w-2/3 rounded-full bg-slate-100" }))) : null);
}
function MyInfoChartSkeleton(props) {
  return /* @__PURE__ */ React.createElement("div", { className: `rounded-lg border border-slate-200 bg-white p-5 ${props.className || "h-[260px] w-full"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex h-full animate-pulse flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 w-1/3 rounded-full bg-slate-200" }), /* @__PURE__ */ React.createElement("div", { className: "h-3 w-1/2 rounded-full bg-slate-100" })), /* @__PURE__ */ React.createElement("div", { className: "grid h-2/3 grid-cols-12 items-end gap-2" }, [35, 60, 44, 76, 52, 88, 63, 48, 72, 55, 81, 66].map((height, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "rounded-t bg-slate-200", style: { height: `${height}%` } }))), /* @__PURE__ */ React.createElement("div", { className: "h-3 w-2/3 rounded-full bg-slate-100" })));
}
function MyInfoField(props) {
  return /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 bg-white px-5 py-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-semibold text-slate-500" }, props.label), /* @__PURE__ */ React.createElement("div", { className: "mt-3 break-words text-lg text-slate-900" }, props.value || "-"));
}
function MyInfoPanel(props) {
  return /* @__PURE__ */ React.createElement("section", { className: "rounded-lg border border-slate-200 bg-white p-7 shadow-sm sm:p-5" }, /* @__PURE__ */ React.createElement("div", { className: "mb-5 flex flex-row items-end justify-between gap-2 sm:flex-col sm:items-start" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold text-slate-950" }, props.title), props.subtitle ? /* @__PURE__ */ React.createElement("p", { className: "mt-2 text-sm text-slate-500" }, props.subtitle) : null), props.action), props.children);
}
function MyInfoMessage(props) {
  if (!props.children)
    return null;
  const tone = props.tone || "blue";
  const classes = tone === "red" ? "border-rose-200 bg-rose-50 text-rose-700" : tone === "green" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-sky-200 bg-sky-50 text-sky-700";
  return /* @__PURE__ */ React.createElement("div", { className: `rounded-lg border px-4 py-3 text-sm ${classes}` }, props.children);
}
function MyInfoTableEmpty(props) {
  return /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500" }, props.children);
}
function MyInfoHTMLPreview(props) {
  const html = React.useMemo(() => myInfoSanitizeHTML(props.html), [props.html]);
  if (!html) {
    return /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-sm text-slate-500" }, "-");
  }
  return /* @__PURE__ */ React.createElement("div", { className: "mt-3 line-clamp-3 text-sm leading-6 text-slate-600", dangerouslySetInnerHTML: { __html: html } });
}
function MyInfoOverview(props) {
  const user = props.user || {};
  const google2 = props.googleIdentity || {};
  const [paymentGranularity, setPaymentGranularity] = React.useState("month");
  const articleCount = myInfoRows((props.articles || {}).list).length;
  const commentCount = myInfoRows((props.comments || {}).list).length;
  const paymentRows = myInfoRows((props.payments || {}).list);
  const paymentCount = paymentRows.length;
  const activityLoading = props.loadingArticles || props.loadingComments || props.loadingPayments;
  const summaryOption = myInfoActivitySummaryOption(articleCount, commentCount, paymentCount);
  const paymentOption = myInfoPaymentAmountOption(paymentRows, paymentGranularity);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-7" }, /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uC800\uC7A5\uB41C \uAC1C\uC778\uC815\uBCF4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1" }, /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uC774\uBA54\uC77C", value: user.email }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uB2C9\uB124\uC784", value: user.name }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uC774\uB984", value: user.realname }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uD68C\uC6D0 \uB4F1\uAE09", value: user.role }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uC131\uBCC4", value: myInfoGenderLabel(user.gender, props.genderOptions) }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uD68C\uC6D0\uB4F1\uAE09 \uB9CC\uB8CC\uC77C", value: user.expired_at || "\uBB34\uC81C\uD55C" }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uAC00\uC785 \uC77C\uC790", value: user.date_joined }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uCD5C\uADFC \uC218\uC815\uC77C", value: user.updated_at }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uC774\uBA54\uC77C \uC218\uC2E0", value: myInfoNumber(user.email_subscription) === 1 ? "\uD5C8\uC6A9" : "\uAC70\uBD80" }))), /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uC5F0\uB3D9\uB41C \uB85C\uADF8\uC778 \uBC29\uC2DD" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-1" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 bg-white px-5 py-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-semibold text-slate-500" }, "\uC774\uBA54\uC77C \uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-base font-semibold text-slate-950" }, "\uC0AC\uC6A9 \uAC00\uB2A5"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 break-words text-sm text-slate-500" }, user.email || "-")), /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 bg-white px-5 py-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-semibold text-slate-500" }, "Google \uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("div", { className: "mt-3 text-base font-semibold text-slate-950" }, google2.connected ? "\uC5F0\uB3D9\uB428" : "\uBBF8\uC5F0\uB3D9"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 break-words text-sm text-slate-500" }, google2.connected ? google2.email || google2.name || "-" : "\uD558\uC704 \uBA54\uB274\uC5D0\uC11C Google \uACC4\uC815\uC744 \uC5F0\uACB0\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-4 sm:grid-cols-1" }, /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uB0B4\uAC00 \uC4F4 \uAE00", value: props.loadingArticles ? "\uBD88\uB7EC\uC624\uB294 \uC911" : `${articleCount.toLocaleString("ko-KR")}\uAC1C` }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uB0B4\uAC00 \uC4F4 \uB313\uAE00", value: props.loadingComments ? "\uBD88\uB7EC\uC624\uB294 \uC911" : `${commentCount.toLocaleString("ko-KR")}\uAC1C` }), /* @__PURE__ */ React.createElement(MyInfoField, { label: "\uACB0\uC81C \uB0B4\uC5ED", value: props.loadingPayments ? "\uBD88\uB7EC\uC624\uB294 \uC911" : `${paymentCount.toLocaleString("ko-KR")}\uAC74` })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-7 md:grid-cols-1" }, /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uB098\uC758 \uD65C\uB3D9 \uC694\uC57D" }, /* @__PURE__ */ React.createElement(MyInfoChart, { option: summaryOption, loading: activityLoading, className: "h-[260px] w-full" })), /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uACB0\uC81C \uAE08\uC561", action: /* @__PURE__ */ React.createElement(MyInfoGranularityControl, { value: paymentGranularity, defaultValue: "month", onChange: setPaymentGranularity }) }, /* @__PURE__ */ React.createElement(MyInfoChart, { option: paymentOption, loading: props.loadingPayments, className: "h-[260px] w-full", empty: "\uACB0\uC81C \uCC28\uD2B8\uB97C \uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }))));
}
function MyInfoEmailForm(props) {
  const [email, setEmail] = React.useState(myInfoText((props.user || {}).email));
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [tone, setTone] = React.useState("blue");
  React.useEffect(() => setEmail(myInfoText((props.user || {}).email)), [props.user]);
  function submit(event) {
    event.preventDefault();
    const nextEmail = email.trim().toLowerCase();
    if (!nextEmail || !nextEmail.includes("@")) {
      setTone("red");
      setMessage("\uC774\uBA54\uC77C \uD615\uC2DD\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694.");
      return;
    }
    const user = props.user || {};
    const currentEmail = myInfoText(user.email).trim().toLowerCase();
    const willChangeEmail = nextEmail !== currentEmail;
    if (willChangeEmail && !window.confirm("\uC774\uBA54\uC77C\uC744 \uBCC0\uACBD\uD558\uBA74 \uD604\uC7AC \uB85C\uADF8\uC778 \uC138\uC158\uC774 \uC885\uB8CC\uB429\uB2C8\uB2E4. \uC0C8 \uC774\uBA54\uC77C\uB85C \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574\uC57C \uD569\uB2C8\uB2E4. \uACC4\uC18D\uD560\uAE4C\uC694?")) {
      return;
    }
    const form = new FormData();
    myInfoAppendUserForm(
      form,
      user,
      nextEmail,
      myInfoText(user.gender) || "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C",
      myInfoNumber(user.email_subscription) === 1
    );
    let redirecting = false;
    setSaving(true);
    myInfoFetchJSON("/account/ajax_update_userinfo/", { method: "POST", body: form }).then((payload) => {
      const checker = myInfoText(payload.checker);
      const requiresRelogin = myInfoBool(payload.requires_relogin) || myInfoBool(payload.email_changed);
      if (checker === "SUCCESS" || checker === "NOTEXIST") {
        if (requiresRelogin) {
          redirecting = true;
          setTone("green");
          setMessage(myInfoText(payload.message) || "\uC774\uBA54\uC77C\uC774 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB85C\uADF8\uC778 \uD654\uBA74\uC73C\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.");
          window.setTimeout(() => {
            window.location.href = myInfoText(payload.redirect) || "/account/?next=/account/myinfo/";
          }, 1800);
          return;
        }
        setTone("green");
        setMessage("\uC774\uBA54\uC77C\uC774 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uB2E4\uC74C \uB85C\uADF8\uC778\uBD80\uD130 \uC0C8 \uC774\uBA54\uC77C\uC744 \uC0AC\uC6A9\uD558\uC138\uC694.");
        props.reload();
        return;
      }
      setTone("red");
      setMessage(checker === "EXIST" ? "\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 \uC774\uBA54\uC77C\uC785\uB2C8\uB2E4." : "\uC774\uBA54\uC77C\uC744 \uBCC0\uACBD\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    }).finally(() => {
      if (!redirecting)
        setSaving(false);
    });
  }
  return /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uC774\uBA54\uC77C \uBCC0\uACBD", subtitle: "\uB85C\uADF8\uC778\uACFC \uACB0\uC81C \uC548\uB0B4\uC5D0 \uC0AC\uC6A9\uD560 \uC774\uBA54\uC77C\uC785\uB2C8\uB2E4." }, /* @__PURE__ */ React.createElement("form", { onSubmit: submit, className: "space-y-5" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-slate-600" }, "\uC0C8 \uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      className: "mt-2 w-full rounded-lg border-slate-300 text-base focus:border-slate-900 focus:ring-slate-900",
      value: email,
      onChange: (event) => setEmail(event.target.value),
      autoComplete: "email"
    }
  )), /* @__PURE__ */ React.createElement(MyInfoMessage, { tone }, message), /* @__PURE__ */ React.createElement("button", { type: "submit", disabled: saving, className: "rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400" }, saving ? "\uC800\uC7A5 \uC911" : "\uC774\uBA54\uC77C \uC800\uC7A5")));
}
function MyInfoPasswordForm() {
  const [draft, setDraft] = React.useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [tone, setTone] = React.useState("blue");
  function patch(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }
  function submit(event) {
    event.preventDefault();
    if (!draft.current || !draft.next) {
      setTone("red");
      setMessage("\uD604\uC7AC \uBE44\uBC00\uBC88\uD638\uC640 \uC0C8 \uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      return;
    }
    if (draft.next.length < 8) {
      setTone("red");
      setMessage("\uC0C8 \uBE44\uBC00\uBC88\uD638\uB294 8\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.");
      return;
    }
    if (draft.next !== draft.confirm) {
      setTone("red");
      setMessage("\uC0C8 \uBE44\uBC00\uBC88\uD638\uAC00 \uC11C\uB85C \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
      return;
    }
    const form = new FormData();
    form.append("current_password", draft.current);
    form.append("new_password", draft.next);
    setSaving(true);
    myInfoFetchJSON("/account/ajax_change_my_password/", { method: "POST", body: form }).then((payload) => {
      const checker = myInfoText(payload.checker);
      if (checker === "SUCCESS") {
        setTone("green");
        setMessage("\uBE44\uBC00\uBC88\uD638\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
        setDraft({ current: "", next: "", confirm: "" });
        return;
      }
      setTone("red");
      setMessage(checker === "WRONGPASSWORD" ? "\uD604\uC7AC \uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." : "\uBE44\uBC00\uBC88\uD638\uB97C \uBCC0\uACBD\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    }).finally(() => setSaving(false));
  }
  return /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD", subtitle: "\uD604\uC7AC \uBE44\uBC00\uBC88\uD638\uB97C \uD655\uC778\uD55C \uB4A4 \uC0C8 \uBE44\uBC00\uBC88\uD638\uB85C \uBCC0\uACBD\uD569\uB2C8\uB2E4." }, /* @__PURE__ */ React.createElement("form", { onSubmit: submit, className: "space-y-5" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-slate-600" }, "\uD604\uC7AC \uBE44\uBC00\uBC88\uD638"), /* @__PURE__ */ React.createElement("input", { type: "password", className: "mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900", value: draft.current, onChange: (event) => patch("current", event.target.value), autoComplete: "current-password" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-1" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-slate-600" }, "\uC0C8 \uBE44\uBC00\uBC88\uD638"), /* @__PURE__ */ React.createElement("input", { type: "password", className: "mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900", value: draft.next, onChange: (event) => patch("next", event.target.value), autoComplete: "new-password" })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-slate-600" }, "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uD655\uC778"), /* @__PURE__ */ React.createElement("input", { type: "password", className: "mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900", value: draft.confirm, onChange: (event) => patch("confirm", event.target.value), autoComplete: "new-password" }))), /* @__PURE__ */ React.createElement(MyInfoMessage, { tone }, message), /* @__PURE__ */ React.createElement("button", { type: "submit", disabled: saving, className: "rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400" }, saving ? "\uBCC0\uACBD \uC911" : "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD")));
}
function MyInfoProfileForm(props) {
  const user = props.user || {};
  const [draft, setDraft] = React.useState({
    name: "",
    realname: "",
    gender: "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C",
    emailSubscription: true
  });
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [tone, setTone] = React.useState("blue");
  React.useEffect(() => {
    setDraft({
      name: myInfoText(user.name),
      realname: myInfoText(user.realname),
      gender: myInfoText(user.gender) || "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C",
      emailSubscription: myInfoNumber(user.email_subscription) === 1
    });
  }, [props.user]);
  function patch(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }
  function submit(event) {
    event.preventDefault();
    if (!draft.name.trim()) {
      setTone("red");
      setMessage("\uB2C9\uB124\uC784\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      return;
    }
    const form = new FormData();
    myInfoAppendUserForm(
      form,
      { ...user, name: draft.name.trim(), realname: draft.realname.trim(), gender: draft.gender },
      myInfoText(user.email),
      draft.gender || "\uC751\uB2F5\uD558\uACE0 \uC2F6\uC9C0 \uC54A\uC74C",
      draft.emailSubscription
    );
    setSaving(true);
    myInfoFetchJSON("/account/ajax_update_userinfo/", { method: "POST", body: form }).then((payload) => {
      if (myInfoText(payload.checker) === "SUCCESS") {
        setTone("green");
        setMessage("\uAC1C\uC778\uC815\uBCF4\uAC00 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
        props.reload();
        return;
      }
      setTone("red");
      setMessage("\uAC1C\uC778\uC815\uBCF4\uB97C \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    }).finally(() => setSaving(false));
  }
  return /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uAC1C\uC778\uC815\uBCF4 \uBCC0\uACBD", subtitle: "\uD504\uB85C\uD544\uC5D0 \uD45C\uC2DC\uB418\uB294 \uC815\uBCF4\uC640 \uC774\uBA54\uC77C \uC218\uC2E0 \uC5EC\uBD80\uC785\uB2C8\uB2E4." }, /* @__PURE__ */ React.createElement("form", { onSubmit: submit, className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-1" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-slate-600" }, "\uB2C9\uB124\uC784"), /* @__PURE__ */ React.createElement("input", { className: "mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900", value: draft.name, onChange: (event) => patch("name", event.target.value) })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-slate-600" }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("input", { className: "mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900", value: draft.realname, onChange: (event) => patch("realname", event.target.value) }))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-1" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-slate-600" }, "\uC131\uBCC4"), /* @__PURE__ */ React.createElement("select", { className: "mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900", value: draft.gender, onChange: (event) => patch("gender", event.target.value) }, myInfoResolvedGenderOptions(props.genderOptions).map((option) => /* @__PURE__ */ React.createElement("option", { key: option.name, value: option.name }, option.label || option.name)))), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-3 self-end rounded-lg border border-slate-200 px-4 py-3" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", className: "rounded border-slate-300 text-slate-950 focus:ring-slate-900", checked: draft.emailSubscription, onChange: (event) => patch("emailSubscription", event.target.checked) }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-slate-700" }, "\uC774\uBA54\uC77C \uC218\uC2E0 \uD5C8\uC6A9"))), /* @__PURE__ */ React.createElement(MyInfoMessage, { tone }, message), /* @__PURE__ */ React.createElement("button", { type: "submit", disabled: saving, className: "rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400" }, saving ? "\uC800\uC7A5 \uC911" : "\uAC1C\uC778\uC815\uBCF4 \uC800\uC7A5")));
}
function MyInfoArticles(props) {
  const rows = myInfoRows((props.data || {}).list);
  const chartOption = myInfoCalendarOption(rows, "\uAE00 \uC791\uC131 \uCE98\uB9B0\uB354");
  return /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uB0B4\uAC00 \uC4F4 \uAE00" }, props.loading ? /* @__PURE__ */ React.createElement(MyInfoChartSkeleton, { className: "h-[290px] w-full" }) : rows.length === 0 ? /* @__PURE__ */ React.createElement(MyInfoTableEmpty, null, "\uC791\uC131\uD55C \uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(MyInfoChart, { option: chartOption, className: "h-[290px] w-full" })), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full min-w-[720px] text-left text-sm" }, /* @__PURE__ */ React.createElement("thead", { className: "border-b border-slate-200 text-xs font-semibold uppercase text-slate-500" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3" }, "\uC81C\uBAA9"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3" }, "\uAC8C\uC2DC\uD310"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3" }, "\uC791\uC131\uC77C"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3 text-right" }, "\uC870\uD68C"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3 text-right" }, "\uB313\uAE00"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-100" }, rows.map((row) => /* @__PURE__ */ React.createElement("tr", { key: myInfoText(row.uuid), className: "hover:bg-slate-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 font-semibold text-slate-950" }, /* @__PURE__ */ React.createElement("a", { className: "hover:text-sky-700", href: myInfoArticleHref(row) }, myInfoText(row.title) || "-")), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 text-slate-600" }, myInfoText(row.category) || myInfoText(row.category_url) || "-"), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 text-slate-600" }, myInfoDate(row.created_at)), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 text-right text-slate-600" }, myInfoNumber(row.cnt_read).toLocaleString("ko-KR")), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 text-right text-slate-600" }, myInfoNumber(row.cnt_comment).toLocaleString("ko-KR")))))))));
}
function MyInfoComments(props) {
  const rows = myInfoRows((props.data || {}).list);
  const chartOption = myInfoCalendarOption(rows, "\uB313\uAE00 \uC791\uC131 \uCE98\uB9B0\uB354");
  return /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uB0B4\uAC00 \uC4F4 \uB313\uAE00" }, props.loading ? /* @__PURE__ */ React.createElement(MyInfoChartSkeleton, { className: "h-[290px] w-full" }) : rows.length === 0 ? /* @__PURE__ */ React.createElement(MyInfoTableEmpty, null, "\uC791\uC131\uD55C \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(MyInfoChart, { option: chartOption, className: "h-[290px] w-full" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, rows.map((row) => /* @__PURE__ */ React.createElement("div", { key: myInfoText(row.uuid), className: "rounded-lg border border-slate-200 bg-white px-5 py-4 hover:border-sky-300 hover:bg-sky-50" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-start" }, /* @__PURE__ */ React.createElement("a", { className: "font-semibold text-slate-950 hover:text-sky-700", href: myInfoCommentHref(row) }, myInfoText(row.article_title) || "\uAC8C\uC2DC\uAE00"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-500" }, myInfoDate(row.created_at))), /* @__PURE__ */ React.createElement(MyInfoHTMLPreview, { html: row.content }))))));
}
function MyInfoPayments(props) {
  const [paymentGranularity, setPaymentGranularity] = React.useState("month");
  const rows = myInfoRows((props.data || {}).list);
  const chartOption = myInfoPaymentAmountOption(rows, paymentGranularity);
  return /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uACB0\uC81C \uB0B4\uC5ED", action: /* @__PURE__ */ React.createElement(MyInfoGranularityControl, { value: paymentGranularity, defaultValue: "month", onChange: setPaymentGranularity }) }, props.loading ? /* @__PURE__ */ React.createElement(MyInfoChartSkeleton, { className: "h-[280px] w-full" }) : rows.length === 0 ? /* @__PURE__ */ React.createElement(MyInfoTableEmpty, null, "\uACB0\uC81C \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(MyInfoChart, { option: chartOption, className: "h-[280px] w-full", empty: "\uACB0\uC81C \uCC28\uD2B8\uB97C \uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." })), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full min-w-[760px] text-left text-sm" }, /* @__PURE__ */ React.createElement("thead", { className: "border-b border-slate-200 text-xs font-semibold uppercase text-slate-500" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3" }, "\uC0C1\uD488"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3" }, "\uC8FC\uBB38\uBC88\uD638"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3" }, "\uC77C\uC2DC"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3" }, "\uBC29\uC2DD"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3" }, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-3 text-right" }, "\uAE08\uC561"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-100" }, rows.map((row, idx) => /* @__PURE__ */ React.createElement("tr", { key: myInfoText(row.order_id) || idx, className: "hover:bg-slate-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 font-semibold text-slate-950" }, myInfoText(row.product_name) || "-"), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 text-slate-600" }, myInfoText(row.order_id) || "-"), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 text-slate-600" }, myInfoDate(row.created_at)), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 text-slate-600" }, myInfoText(row.method) || "-"), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3" }, /* @__PURE__ */ React.createElement("span", { className: "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700" }, myInfoStatusText(row.status))), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-3 text-right font-semibold text-slate-950" }, myInfoMoney(row.amount)))))))));
}
function renderMyInfoGoogleButton(onLinked, setMessage, attempt = 0) {
  const globals = myInfoGlobals();
  const clientId = myInfoTrim(globals.google_client_id);
  const nonce = myInfoTrim(globals.google_login_nonce);
  const endpoint = myInfoTrim(globals.google_link_endpoint) || "/account/ajax_link_google/";
  const target = document.getElementById("myInfoGoogleButton");
  if (!clientId || !nonce || !target) {
    return;
  }
  if (!window.google || !google.accounts || !google.accounts.id) {
    if (attempt < 120) {
      window.setTimeout(() => renderMyInfoGoogleButton(onLinked, setMessage, attempt + 1), 50);
    } else {
      setMessage({ tone: "red", text: "Google \uB85C\uADF8\uC778 \uC2A4\uD06C\uB9BD\uD2B8\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4." });
    }
    return;
  }
  if (target.dataset.rendered === "1") {
    return;
  }
  target.dataset.rendered = "1";
  google.accounts.id.initialize({
    client_id: clientId,
    nonce,
    auto_select: false,
    cancel_on_tap_outside: true,
    use_fedcm_for_prompt: true,
    callback: async (response) => {
      const credential = myInfoTrim(response && response.credential);
      if (!credential) {
        setMessage({ tone: "red", text: "Google \uACC4\uC815 \uC751\uB2F5\uC774 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4." });
        return;
      }
      const form = new FormData();
      form.append("credential", credential);
      form.append("nonce", nonce);
      const payload = await myInfoFetchJSON(endpoint, { method: "POST", body: form });
      if (myInfoText(payload.checker) === "SUCCESS") {
        setMessage({ tone: "green", text: "Google \uACC4\uC815\uC774 \uC5F0\uACB0\uB418\uC5C8\uC2B5\uB2C8\uB2E4." });
        if (typeof onLinked === "function")
          onLinked(payload.identity || {});
        return;
      }
      setMessage({ tone: "red", text: myInfoGoogleMessage(payload.checker) });
    }
  });
  google.accounts.id.renderButton(target, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    logo_alignment: "left",
    width: Math.min(420, Math.max(260, target.offsetWidth || 420)),
    locale: "ko"
  });
}
function MyInfoGooglePanel(props) {
  const identity = props.identity || {};
  const googleEnabled = !!myInfoTrim(myInfoGlobals().google_client_id);
  const [message, setMessage] = React.useState({ tone: "blue", text: "" });
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => {
    if (googleEnabled && !identity.connected) {
      renderMyInfoGoogleButton((nextIdentity) => props.onLinked(nextIdentity), setMessage);
    }
  }, [googleEnabled, identity.connected]);
  function unlinkGoogle() {
    if (saving || !identity.connected)
      return;
    if (!identity.can_unlink) {
      setMessage({ tone: "red", text: myInfoGoogleMessage(identity.unlink_block_code || "PASSWORD_REQUIRED") });
      return;
    }
    if (!window.confirm("Google \uACC4\uC815 \uC5F0\uB3D9\uC744 \uD574\uC81C\uD560\uAE4C\uC694?")) {
      return;
    }
    setSaving(true);
    const endpoint = myInfoTrim(myInfoGlobals().google_unlink_endpoint) || "/account/ajax_unlink_google/";
    myInfoFetchJSON(endpoint, { method: "POST", body: new FormData() }).then((payload) => {
      if (myInfoText(payload.checker) === "SUCCESS") {
        setMessage({ tone: "green", text: "Google \uACC4\uC815 \uC5F0\uB3D9\uC744 \uD574\uC81C\uD588\uC2B5\uB2C8\uB2E4." });
        props.reload();
        return;
      }
      setMessage({ tone: "red", text: myInfoGoogleMessage(payload.checker) });
    }).finally(() => setSaving(false));
  }
  return /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "Google \uACC4\uC815 \uC5F0\uB3D9" }, !googleEnabled ? /* @__PURE__ */ React.createElement(MyInfoMessage, { tone: "red" }, "Google \uB85C\uADF8\uC778\uC774 \uC544\uC9C1 \uC124\uC815\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.") : identity.connected ? /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-row items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 sm:flex-col sm:items-start" }, identity.picture_url && /* @__PURE__ */ React.createElement("img", { src: identity.picture_url, alt: "", className: "h-14 w-14 rounded-full border border-slate-200" }), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-base font-bold text-slate-950" }, identity.name || "Google \uACC4\uC815"), /* @__PURE__ */ React.createElement("div", { className: "mt-1 break-words text-sm text-slate-500" }, identity.email || "-"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-xs font-semibold text-emerald-700" }, "\uC5F0\uB3D9\uB428")), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: saving || !identity.can_unlink, onClick: unlinkGoogle, className: "rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400" }, saving ? "\uCC98\uB9AC \uC911" : "\uC5F0\uB3D9 \uD574\uC81C")), !identity.can_unlink && /* @__PURE__ */ React.createElement(MyInfoMessage, { tone: "blue" }, myInfoGoogleMessage(identity.unlink_block_code || "PASSWORD_REQUIRED")), message.text && /* @__PURE__ */ React.createElement(MyInfoMessage, { tone: message.tone }, message.text)) : /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { id: "myInfoGoogleButton", className: "flex h-[44px] w-full max-w-[420px] items-center justify-center" }), message.text && /* @__PURE__ */ React.createElement(MyInfoMessage, { tone: message.tone }, message.text)));
}
function MyInfoConnection(props) {
  const [trendGranularity, setTrendGranularity] = React.useState("day");
  const shinyRows = myInfoRows((props.data || {}).cnt_table_shinyapp);
  const visitRows = myInfoRows((props.data || {}).cnt_table_visit);
  const visitCalendarOption = myInfoCalendarOption(visitRows, "\uBC29\uBB38 \uCE98\uB9B0\uB354");
  const appCalendarOption = myInfoCalendarOption(shinyRows, "\uC571 \uC811\uC18D \uCE98\uB9B0\uB354");
  const trendOption = myInfoConnectionTrendOption(visitRows, shinyRows, trendGranularity);
  return /* @__PURE__ */ React.createElement(MyInfoPanel, { title: "\uACC4\uC815 \uD65C\uB3D9" }, /* @__PURE__ */ React.createElement("div", { className: "mb-7 grid grid-cols-1 gap-5" }, /* @__PURE__ */ React.createElement(MyInfoChart, { option: visitCalendarOption, loading: props.loading, className: "h-[290px] w-full", empty: "\uBC29\uBB38 \uCE98\uB9B0\uB354\uB97C \uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }), /* @__PURE__ */ React.createElement(MyInfoChart, { option: appCalendarOption, loading: props.loading, className: "h-[290px] w-full", empty: "\uC571 \uC811\uC18D \uCE98\uB9B0\uB354\uB97C \uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." })), /* @__PURE__ */ React.createElement("div", { className: "mb-3 flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-start" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-slate-950" }, "\uD65C\uB3D9 \uCD94\uC774"), /* @__PURE__ */ React.createElement(MyInfoGranularityControl, { value: trendGranularity, onChange: setTrendGranularity })), /* @__PURE__ */ React.createElement("div", { className: "mb-7" }, /* @__PURE__ */ React.createElement(MyInfoChart, { option: trendOption, loading: props.loading, className: "h-[300px] w-full", empty: "\uD65C\uB3D9 \uCD94\uC774\uB97C \uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." })));
}
function MyInfoApp() {
  const menuGroups = [
    {
      title: "\uBCF4\uAE30",
      items: [
        { key: "overview", label: "\uB0B4 \uC815\uBCF4 \uBCF4\uAE30" },
        { key: "articles", label: "\uB0B4\uAC00 \uC4F4 \uAE00" },
        { key: "comments", label: "\uB0B4\uAC00 \uC4F4 \uB313\uAE00" },
        { key: "payments", label: "\uACB0\uC81C \uB0B4\uC5ED" },
        { key: "connection", label: "\uACC4\uC815 \uD65C\uB3D9" },
        { key: "team", label: "\uAE30\uAD00/\uD300 \uAD00\uB9AC", href: "/account/team/" }
      ]
    },
    {
      title: "\uBCC0\uACBD",
      items: [
        { key: "email", label: "\uC774\uBA54\uC77C \uBCC0\uACBD" },
        { key: "password", label: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD" },
        { key: "profile", label: "\uAC1C\uC778\uC815\uBCF4 \uBCC0\uACBD" },
        { key: "google", label: "Google \uC5F0\uB3D9" }
      ]
    }
  ];
  const menuItems = menuGroups.flatMap((group) => group.items);
  const initialKey = (window.location.hash || "#overview").replace("#", "");
  const [active, setActive] = React.useState(menuItems.some((item) => item.key === initialKey && !item.href) ? initialKey : "overview");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [dataLoading, setDataLoading] = React.useState({
    articles: true,
    comments: true,
    payments: true,
    connection: true
  });
  const [user, setUser] = React.useState({});
  const [googleIdentity, setGoogleIdentity] = React.useState({});
  const [genderOptions, setGenderOptions] = React.useState([]);
  const [articles, setArticles] = React.useState({});
  const [comments, setComments] = React.useState({});
  const [payments, setPayments] = React.useState({});
  const [connection, setConnection] = React.useState({});
  function patchDataLoading(key, value) {
    setDataLoading((prev) => ({ ...prev, [key]: value }));
  }
  function loadAccount() {
    setLoading(true);
    Promise.all([
      myInfoFetchJSON("/account/ajax_get_myinfo/"),
      myInfoFetchJSON("/account/ajax_get_gender_options/"),
      myInfoFetchJSON("/account/ajax_get_google_identity/")
    ]).then(([nextUser, genderPayload, googlePayload]) => {
      setUser(nextUser || {});
      setGenderOptions(myInfoResolvedGenderOptions((genderPayload || {}).options));
      setGoogleIdentity(googlePayload || {});
    }).finally(() => setLoading(false));
  }
  function loadPanelData(key, url, setter) {
    patchDataLoading(key, true);
    myInfoFetchJSON(url).then((payload) => {
      setter(payload || {});
    }).finally(() => patchDataLoading(key, false));
  }
  function loadActivityData() {
    loadPanelData("articles", "/account/ajax_get_myinfo_article/", setArticles);
    loadPanelData("comments", "/account/ajax_get_myinfo_comment/", setComments);
    loadPanelData("payments", "/account/ajax_get_myinfo_payment/", setPayments);
    loadPanelData("connection", "/account/ajax_get_myinfo_connection/", setConnection);
  }
  function load() {
    loadAccount();
    loadActivityData();
  }
  React.useEffect(() => {
    load();
    const onHash = () => {
      const key = (window.location.hash || "#overview").replace("#", "");
      if (menuItems.some((item) => item.key === key && !item.href))
        setActive(key);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  function activate(key) {
    setActive(key);
    setMenuOpen(false);
    window.history.replaceState(null, "", `#${key}`);
  }
  const activeItem = menuItems.find((item) => item.key === active);
  const content = {
    overview: /* @__PURE__ */ React.createElement(MyInfoOverview, { user, googleIdentity, genderOptions, articles, comments, payments, loadingArticles: dataLoading.articles, loadingComments: dataLoading.comments, loadingPayments: dataLoading.payments }),
    email: /* @__PURE__ */ React.createElement(MyInfoEmailForm, { user, reload: loadAccount }),
    password: /* @__PURE__ */ React.createElement(MyInfoPasswordForm, null),
    profile: /* @__PURE__ */ React.createElement(MyInfoProfileForm, { user, genderOptions, reload: loadAccount }),
    google: /* @__PURE__ */ React.createElement(MyInfoGooglePanel, { identity: googleIdentity, onLinked: (identity) => setGoogleIdentity(identity), reload: loadAccount }),
    articles: /* @__PURE__ */ React.createElement(MyInfoArticles, { data: articles, loading: dataLoading.articles }),
    comments: /* @__PURE__ */ React.createElement(MyInfoComments, { data: comments, loading: dataLoading.comments }),
    payments: /* @__PURE__ */ React.createElement(MyInfoPayments, { data: payments, loading: dataLoading.payments }),
    connection: /* @__PURE__ */ React.createElement(MyInfoConnection, { data: connection, loading: dataLoading.connection })
  }[active];
  return /* @__PURE__ */ React.createElement("main", { className: "mx-auto w-full max-w-[1480px] px-8 py-10 text-slate-950 lg:px-6 sm:px-4" }, /* @__PURE__ */ React.createElement("header", { className: "mb-10" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-normal text-slate-950" }, "\uB0B4 \uC815\uBCF4"), /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-base text-slate-500" }, "\uACC4\uC815 \uC815\uBCF4\uC640 \uD65C\uB3D9 \uB0B4\uC5ED\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-[280px_minmax(0,1fr)] gap-7 lg:grid-cols-[248px_minmax(0,1fr)] md:grid-cols-1" }, /* @__PURE__ */ React.createElement("aside", { className: "sticky top-6 h-fit rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:static" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "hidden w-full items-center justify-between rounded-lg bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white md:flex",
      "aria-expanded": menuOpen,
      "aria-controls": "myinfo-account-menu",
      onClick: () => setMenuOpen((open) => !open)
    },
    /* @__PURE__ */ React.createElement("span", null, activeItem ? activeItem.label : "\uB0B4 \uC815\uBCF4 \uBCF4\uAE30"),
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, menuOpen ? "-" : "+")
  ), /* @__PURE__ */ React.createElement("nav", { id: "myinfo-account-menu", className: `${menuOpen ? "block" : "block md:hidden"} space-y-5 md:mt-3` }, menuGroups.map((group) => /* @__PURE__ */ React.createElement("section", { key: group.title, className: "space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "px-3 pb-2 text-xs font-bold uppercase tracking-normal text-slate-400" }, group.title), group.items.map((item) => {
    const selected = item.key === active;
    if (item.href) {
      return /* @__PURE__ */ React.createElement("a", { key: item.key, href: item.href, className: "block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100" }, item.label);
    }
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: item.key,
        type: "button",
        onClick: () => activate(item.key),
        className: `w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${selected ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"}`
      },
      item.label
    );
  }))))), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, loading ? /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500" }, "\uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.") : content)));
}
function set_main() {
  const container = document.getElementById("div_main");
  if (!container)
    return;
  if (!window.__webrMyInfoRoot) {
    window.__webrMyInfoRoot = ReactDOM.createRoot(container);
  }
  window.__webrMyInfoRoot.render(/* @__PURE__ */ React.createElement(MyInfoApp, null));
}
