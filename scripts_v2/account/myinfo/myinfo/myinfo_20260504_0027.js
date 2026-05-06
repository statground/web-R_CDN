function myInfoText(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function myInfoNumber(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function myInfoBool(value) {
  if (typeof value === "boolean") return value;
  const text = myInfoText(value).trim().toLowerCase();
  return text === "1" || text === "true" || text === "yes" || text === "on";
}

function myInfoRows(value) {
  return Object.values(value || {});
}

const myInfoDefaultGenderOptions = [
  { name: "Male", label: "남성" },
  { name: "Female", label: "여성" },
  { name: "기타", label: "기타" },
  { name: "응답하고 싶지 않음", label: "응답하고 싶지 않음" },
];

function myInfoResolvedGenderOptions(options) {
  return Array.isArray(options) && options.length ? options : myInfoDefaultGenderOptions;
}

function myInfoMoney(value) {
  return myInfoNumber(value).toLocaleString("ko-KR") + "원";
}

function myInfoDate(value) {
  const text = myInfoText(value).trim();
  return text || "-";
}

function myInfoGenderLabel(value, options) {
  const text = myInfoText(value).trim();
  const found = myInfoResolvedGenderOptions(options).find((option) => option.name === text);
  if (found && found.label) return found.label;
  if (text === "Male") return "남성";
  if (text === "Female") return "여성";
  return text || "응답하고 싶지 않음";
}

function myInfoArticleHref(row) {
  const direct = myInfoText(row.url).trim();
  if (direct) return direct;
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
  if (text === "DONE") return "완료";
  if (text === "WAITING") return "대기";
  if (text === "CANCELED") return "취소";
  return text || "-";
}

function myInfoFetchJSON(url, options) {
  return fetch(url, { credentials: "same-origin", ...(options || {}) })
    .then((res) => res.json())
    .catch(() => ({}));
}

function myInfoGlobals() {
  return window.__webr_globals__ || {};
}

function myInfoTrim(value) {
  return myInfoText(value).trim();
}

function myInfoGoogleMessage(checker) {
  const messages = {
    GOOGLE_DISABLED: "구글 로그인이 아직 설정되지 않았습니다.",
    CSRF_FAILED: "연동 요청을 확인하지 못했습니다. 새로고침 후 다시 시도해주세요.",
    NONCE_FAILED: "Google 응답을 확인하지 못했습니다. 새로고침 후 다시 시도해주세요.",
    INVALID_GOOGLE_TOKEN: "Google 계정 정보를 확인하지 못했습니다.",
    GOOGLE_EMAIL_UNVERIFIED: "인증되지 않은 Google 이메일입니다.",
    DOMAIN_NOT_ALLOWED: "허용되지 않은 Google 계정 도메인입니다.",
    GOOGLE_ALREADY_LINKED: "이미 다른 Google 계정이 연결되어 있습니다.",
    GOOGLE_ALREADY_LINKED_OTHER: "이미 다른 Web-R 계정에 연결된 Google 계정입니다.",
    GOOGLE_EMAIL_OWNED_BY_OTHER_ACCOUNT: "해당 Google 이메일을 사용하는 다른 Web-R 계정이 있습니다.",
    GOOGLE_NOT_LINKED: "연결된 Google 계정이 없습니다.",
    PASSWORD_REQUIRED: "Google로 가입한 계정은 비밀번호를 먼저 설정한 뒤 연결을 해제할 수 있습니다.",
    INACTIVE: "비활성 계정입니다.",
    NOTEXIST: "로그인이 필요합니다."
  };
  return messages[checker] || "Google 계정 연동을 처리하지 못했습니다.";
}

function myInfoEscapeHTML(value) {
  return myInfoText(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function myInfoIsSafeURL(value, allowDataImage) {
  const text = myInfoText(value).trim();
  if (!text) return false;
  const compact = text.replace(/[\u0000-\u001f\s]+/g, "").toLowerCase();
  if (compact.startsWith("javascript:") || compact.startsWith("vbscript:") || compact.startsWith("data:text/html")) {
    return false;
  }
  return compact.startsWith("http://")
    || compact.startsWith("https://")
    || compact.startsWith("mailto:")
    || compact.startsWith("tel:")
    || compact.startsWith("/")
    || compact.startsWith("#")
    || (allowDataImage && compact.startsWith("data:image/"));
}

function myInfoSanitizeHTML(value) {
  const source = myInfoText(value).trim();
  if (!source) return "";
  if (!source.includes("<")) return myInfoEscapeHTML(source);
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${source}</div>`, "text/html");
  const allowedTags = new Set([
    "a", "b", "blockquote", "br", "code", "del", "div", "em", "figcaption", "figure",
    "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "li", "ol", "p", "pre",
    "s", "span", "strong", "sub", "sup", "table", "tbody", "td", "th", "thead", "tr",
    "u", "ul",
  ]);
  const removedTags = new Set([
    "base", "button", "embed", "form", "iframe", "input", "link", "meta", "object",
    "script", "select", "style", "textarea",
  ]);
  const globalAttrs = new Set(["title"]);
  const tableAttrs = new Set(["colspan", "rowspan"]);
  const sanitizeNode = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) return;
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
        while (child.firstChild) fragment.appendChild(child.firstChild);
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
          if (!myInfoIsSafeURL(valueText, false)) child.removeAttribute(attr.name);
          return;
        }
        if (name === "src" && tag === "img") {
          if (!myInfoIsSafeURL(valueText, true)) child.removeAttribute(attr.name);
          return;
        }
        if ((tag === "img" && ["alt", "width", "height"].includes(name)) || globalAttrs.has(name) || (["td", "th"].includes(tag) && tableAttrs.has(name))) {
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
  const gender = myInfoText(nextGender || user.gender).trim() || "응답하고 싶지 않음";
  const subscription = !!nextEmailSubscription;
  form.append("txt_email", myInfoText(nextEmail || user.email));
  form.append("txt_name", myInfoText(user.name));
  form.append("txt_realname", myInfoText(user.realname));
  form.append("sel_gender", gender);
  form.append("rad_gender", gender);
  if (subscription) form.append("chk_email_subscription", "on");
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
  if (unit === "year") return myInfoYearKey(value);
  if (unit === "month") return myInfoMonthKey(value);
  return myInfoDateKey(value);
}

function myInfoNormalizeGranularity(value, fallback) {
  const text = myInfoText(value).trim();
  if (text === "day" || text === "month" || text === "year") return text;
  return fallback || "day";
}

function myInfoUnitLabel(granularity) {
  const unit = myInfoNormalizeGranularity(granularity);
  if (unit === "year") return "연별";
  if (unit === "month") return "월별";
  return "일별";
}

function myInfoNextUnitKey(key, granularity) {
  const unit = myInfoNormalizeGranularity(granularity);
  if (unit === "year") return String(Number(key) + 1);
  if (unit === "month") {
    const parts = key.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    if (!year || !month) return "";
    const next = new Date(year, month, 1);
    return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
  }
  const date = new Date(`${key}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function myInfoFillSeries(series, granularity) {
  if (!series || series.length === 0) return [];
  const sorted = [...series].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  const byKey = Object.fromEntries(sorted.map((item) => [item[0], myInfoNumber(item[1])]));
  const end = sorted[sorted.length - 1][0];
  const filled = [];
  let key = sorted[0][0];
  let guard = 0;
  while (key && key <= end && guard < 5000) {
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
    if (!key) return;
    values[key] = (values[key] || 0) + myInfoNumber(valueGetter(row));
  });
  const series = Object.keys(values).sort().map((key) => [key, values[key]]);
  return myInfoFillSeries(series, unit);
}

function myInfoFilledKeys(seriesList, granularity) {
  const keys = (seriesList || [])
    .flatMap((series) => series || [])
    .map((item) => item[0])
    .filter(Boolean)
    .sort();
  if (keys.length === 0) return [];
  return myInfoFillSeries([[keys[0], 0], [keys[keys.length - 1], 0]], granularity).map((item) => item[0]);
}

function myInfoDailySeries(rows) {
  const counts = {};
  (rows || []).forEach((row) => {
    const date = myInfoDateKey(row.date || row.created_at);
    if (!date) return;
    counts[date] = (counts[date] || 0) + myInfoNumber(row.cnt || 1);
  });
  return Object.keys(counts).sort().map((date) => [date, counts[date]]);
}

function myInfoSeriesRange(series) {
  if (!series || series.length === 0) return [];
  return [series[0][0], series[series.length - 1][0]];
}

function myInfoMaxSeriesValue(series) {
  return Math.max(1, ...((series || []).map((item) => myInfoNumber(item[1]))));
}

function myInfoActivitySummaryOption(articleCount, commentCount, paymentCount) {
  return {
    grid: { top: 24, right: 18, bottom: 34, left: 42 },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["쓴 글", "쓴 댓글", "결제"],
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [{
      type: "bar",
      data: [articleCount, commentCount, paymentCount],
      barWidth: 34,
      itemStyle: { borderRadius: [6, 6, 0, 0], color: "#0f172a" },
    }],
  };
}

function myInfoPaymentAmountOption(rows, granularity) {
  const unit = myInfoNormalizeGranularity(granularity, "month");
  const series = myInfoAggregateSeries(rows, unit, (row) => row.amount);
  if (series.length === 0) return null;
  return {
    grid: { top: 24, right: 18, bottom: 34, left: 64 },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => myInfoMoney(value),
    },
    xAxis: {
      type: "category",
      data: series.map((item) => item[0]),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#cbd5e1" } },
      axisLabel: { hideOverlap: true },
    },
    yAxis: {
      type: "value",
      axisLabel: { formatter: (value) => `${Math.round(value / 10000)}만` },
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [{
      type: "bar",
      data: series.map((item) => item[1]),
      barMaxWidth: 28,
      itemStyle: { borderRadius: [6, 6, 0, 0], color: "#0284c7" },
    }],
  };
}

function myInfoCalendarOption(rows, title) {
  const allSeries = myInfoDailySeries(rows);
  if (allSeries.length === 0) return null;
  const lastDate = new Date(`${allSeries[allSeries.length - 1][0]}T00:00:00`);
  const firstAllowed = new Date(lastDate);
  firstAllowed.setDate(firstAllowed.getDate() - 364);
  const series = allSeries.filter((item) => new Date(`${item[0]}T00:00:00`) >= firstAllowed);
  if (series.length === 0) return null;
  const range = myInfoSeriesRange(series);
  const max = myInfoMaxSeriesValue(series);
  return {
    title: { text: title, left: 0, top: 0, textStyle: { color: "#0f172a", fontSize: 15, fontWeight: 700 } },
    tooltip: {
      formatter: (params) => `${params.value[0]}<br/>${myInfoNumber(params.value[1]).toLocaleString("ko-KR")}회`,
    },
    visualMap: {
      min: 0,
      max,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      inRange: { color: ["#f8fafc", "#bae6fd", "#0ea5e9", "#0f172a"] },
      textStyle: { color: "#64748b" },
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
      yearLabel: { show: false },
    },
    series: [{ type: "heatmap", coordinateSystem: "calendar", data: series }],
  };
}

function myInfoConnectionTrendOption(visitRows, shinyRows, granularity) {
  const unit = myInfoNormalizeGranularity(granularity);
  const visitSeries = myInfoAggregateSeries(visitRows, unit, (row) => row.cnt || 1);
  const shinySeries = myInfoAggregateSeries(shinyRows, unit, (row) => row.cnt || 1);
  const keys = myInfoFilledKeys([visitSeries, shinySeries], unit);
  if (keys.length === 0) return null;
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
      axisLabel: { hideOverlap: true },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [
      { name: "방문", type: "line", smooth: true, showSymbol: false, data: keys.map((key) => visitByKey[key] || 0), symbolSize: 6, lineStyle: { width: 3, color: "#0f172a" }, itemStyle: { color: "#0f172a" }, areaStyle: { color: "rgba(15, 23, 42, 0.08)" } },
      { name: "앱 접속", type: "line", smooth: true, showSymbol: false, data: keys.map((key) => shinyByKey[key] || 0), symbolSize: 6, lineStyle: { width: 3, color: "#0284c7" }, itemStyle: { color: "#0284c7" }, areaStyle: { color: "rgba(2, 132, 199, 0.08)" } },
    ],
  };
}

const myInfoGranularityOptions = [
  { key: "day", label: "일별" },
  { key: "month", label: "월별" },
  { key: "year", label: "연별" },
];

function MyInfoGranularityControl(props) {
  const value = myInfoNormalizeGranularity(props.value, props.defaultValue || "day");
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
      {myInfoGranularityOptions.map((option) => {
        const selected = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${selected ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950"}`}
            aria-pressed={selected}
            onClick={() => props.onChange(option.key)}>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function MyInfoChart(props) {
  const ref = React.useRef(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setReady(false);
    if (!ref.current || !window.echarts || !props.option) return undefined;
    let canceled = false;
    const chart = window.echarts.init(ref.current);
    chart.setOption(props.option);
    window.requestAnimationFrame(() => {
      if (!canceled) setReady(true);
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
    return <MyInfoChartSkeleton className={className} />;
  }
  if (!props.option) {
    return <MyInfoTableEmpty>{props.empty || "표시할 데이터가 없습니다."}</MyInfoTableEmpty>;
  }
  return (
    <div className={`relative ${className}`}>
      <div ref={ref} className="h-full w-full" />
      {!ready ? (
        <div className="absolute inset-0 rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex h-full animate-pulse flex-col justify-between">
            <div className="space-y-3">
              <div className="h-4 w-1/3 rounded-full bg-slate-200"></div>
              <div className="h-3 w-1/2 rounded-full bg-slate-100"></div>
            </div>
            <div className="grid h-2/3 grid-cols-12 items-end gap-2">
              {[35, 60, 44, 76, 52, 88, 63, 48, 72, 55, 81, 66].map((height, index) => (
                <div key={index} className="rounded-t bg-slate-200" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className="h-3 w-2/3 rounded-full bg-slate-100"></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MyInfoChartSkeleton(props) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-5 ${props.className || "h-[260px] w-full"}`}>
      <div className="flex h-full animate-pulse flex-col justify-between">
        <div className="space-y-3">
          <div className="h-4 w-1/3 rounded-full bg-slate-200"></div>
          <div className="h-3 w-1/2 rounded-full bg-slate-100"></div>
        </div>
        <div className="grid h-2/3 grid-cols-12 items-end gap-2">
          {[35, 60, 44, 76, 52, 88, 63, 48, 72, 55, 81, 66].map((height, index) => (
            <div key={index} className="rounded-t bg-slate-200" style={{ height: `${height}%` }}></div>
          ))}
        </div>
        <div className="h-3 w-2/3 rounded-full bg-slate-100"></div>
      </div>
    </div>
  );
}

function MyInfoField(props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
      <div className="text-sm font-semibold text-slate-500">{props.label}</div>
      <div className="mt-3 break-words text-lg text-slate-900">{props.value || "-"}</div>
    </div>
  );
}

function MyInfoPanel(props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-row items-end justify-between gap-2 sm:flex-col sm:items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-950">{props.title}</h2>
          {props.subtitle ? <p className="mt-2 text-sm text-slate-500">{props.subtitle}</p> : null}
        </div>
        {props.action}
      </div>
      {props.children}
    </section>
  );
}

function MyInfoMessage(props) {
  if (!props.children) return null;
  const tone = props.tone || "blue";
  const classes = tone === "red"
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-sky-200 bg-sky-50 text-sky-700";
  return <div className={`rounded-lg border px-4 py-3 text-sm ${classes}`}>{props.children}</div>;
}

function MyInfoTableEmpty(props) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
      {props.children}
    </div>
  );
}

function MyInfoHTMLPreview(props) {
  const html = React.useMemo(() => myInfoSanitizeHTML(props.html), [props.html]);
  if (!html) {
    return <div className="mt-3 text-sm text-slate-500">-</div>;
  }
  return <div className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600" dangerouslySetInnerHTML={{ __html: html }} />;
}

function MyInfoOverview(props) {
  const user = props.user || {};
  const google = props.googleIdentity || {};
  const [paymentGranularity, setPaymentGranularity] = React.useState("month");
  const articleCount = myInfoRows((props.articles || {}).list).length;
  const commentCount = myInfoRows((props.comments || {}).list).length;
  const paymentRows = myInfoRows((props.payments || {}).list);
  const paymentCount = paymentRows.length;
  const activityLoading = props.loadingArticles || props.loadingComments || props.loadingPayments;
  const summaryOption = myInfoActivitySummaryOption(articleCount, commentCount, paymentCount);
  const paymentOption = myInfoPaymentAmountOption(paymentRows, paymentGranularity);
  return (
    <div className="space-y-7">
      <MyInfoPanel title="저장된 개인정보">
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
          <MyInfoField label="이메일" value={user.email} />
          <MyInfoField label="닉네임" value={user.name} />
          <MyInfoField label="이름" value={user.realname} />
          <MyInfoField label="회원 등급" value={user.role} />
          <MyInfoField label="성별" value={myInfoGenderLabel(user.gender, props.genderOptions)} />
          <MyInfoField label="회원등급 만료일" value={user.expired_at || "무제한"} />
          <MyInfoField label="가입 일자" value={user.date_joined} />
          <MyInfoField label="최근 수정일" value={user.updated_at} />
          <MyInfoField label="이메일 수신" value={myInfoNumber(user.email_subscription) === 1 ? "허용" : "거부"} />
        </div>
      </MyInfoPanel>

      <MyInfoPanel title="연동된 로그인 방식">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-semibold text-slate-500">이메일 로그인</div>
            <div className="mt-3 text-base font-semibold text-slate-950">사용 가능</div>
            <div className="mt-2 break-words text-sm text-slate-500">{user.email || "-"}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-semibold text-slate-500">Google 로그인</div>
            <div className="mt-3 text-base font-semibold text-slate-950">{google.connected ? "연동됨" : "미연동"}</div>
            <div className="mt-2 break-words text-sm text-slate-500">{google.connected ? (google.email || google.name || "-") : "하위 메뉴에서 Google 계정을 연결할 수 있습니다."}</div>
          </div>
        </div>
      </MyInfoPanel>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-1">
        <MyInfoField label="내가 쓴 글" value={props.loadingArticles ? "불러오는 중" : `${articleCount.toLocaleString("ko-KR")}개`} />
        <MyInfoField label="내가 쓴 댓글" value={props.loadingComments ? "불러오는 중" : `${commentCount.toLocaleString("ko-KR")}개`} />
        <MyInfoField label="결제 내역" value={props.loadingPayments ? "불러오는 중" : `${paymentCount.toLocaleString("ko-KR")}건`} />
      </div>

      <div className="grid grid-cols-2 gap-7 md:grid-cols-1">
        <MyInfoPanel title="나의 활동 요약">
          <MyInfoChart option={summaryOption} loading={activityLoading} className="h-[260px] w-full" />
        </MyInfoPanel>
        <MyInfoPanel title="결제 금액" action={<MyInfoGranularityControl value={paymentGranularity} defaultValue="month" onChange={setPaymentGranularity} />}>
          <MyInfoChart option={paymentOption} loading={props.loadingPayments} className="h-[260px] w-full" empty="결제 차트를 표시할 데이터가 없습니다." />
        </MyInfoPanel>
      </div>
    </div>
  );
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
      setMessage("이메일 형식을 확인해주세요.");
      return;
    }
    const user = props.user || {};
    const currentEmail = myInfoText(user.email).trim().toLowerCase();
    const willChangeEmail = nextEmail !== currentEmail;
    if (willChangeEmail && !window.confirm("이메일을 변경하면 현재 로그인 세션이 종료됩니다. 새 이메일로 다시 로그인해야 합니다. 계속할까요?")) {
      return;
    }
    const form = new FormData();
    myInfoAppendUserForm(
      form,
      user,
      nextEmail,
      myInfoText(user.gender) || "응답하고 싶지 않음",
      myInfoNumber(user.email_subscription) === 1
    );
    let redirecting = false;
    setSaving(true);
    myInfoFetchJSON("/account/ajax_update_userinfo/", { method: "POST", body: form })
      .then((payload) => {
        const checker = myInfoText(payload.checker);
        const requiresRelogin = myInfoBool(payload.requires_relogin) || myInfoBool(payload.email_changed);
        if (checker === "SUCCESS" || checker === "NOTEXIST") {
          if (requiresRelogin) {
            redirecting = true;
            setTone("green");
            setMessage(myInfoText(payload.message) || "이메일이 변경되었습니다. 잠시 후 로그인 화면으로 이동합니다.");
            window.setTimeout(() => {
              window.location.href = myInfoText(payload.redirect) || "/account/?next=/account/myinfo/";
            }, 1800);
            return;
          }
          setTone("green");
          setMessage("이메일이 변경되었습니다. 다음 로그인부터 새 이메일을 사용하세요.");
          props.reload();
          return;
        }
        setTone("red");
        setMessage(checker === "EXIST" ? "이미 사용 중인 이메일입니다." : "이메일을 변경하지 못했습니다.");
      })
      .finally(() => {
        if (!redirecting) setSaving(false);
      });
  }

  return (
    <MyInfoPanel title="이메일 변경" subtitle="로그인과 결제 안내에 사용할 이메일입니다.">
      <form onSubmit={submit} className="space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-600">새 이메일</span>
          <input
            type="email"
            className="mt-2 w-full rounded-lg border-slate-300 text-base focus:border-slate-900 focus:ring-slate-900"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email" />
        </label>
        <MyInfoMessage tone={tone}>{message}</MyInfoMessage>
        <button type="submit" disabled={saving} className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400">
          {saving ? "저장 중" : "이메일 저장"}
        </button>
      </form>
    </MyInfoPanel>
  );
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
      setMessage("현재 비밀번호와 새 비밀번호를 입력해주세요.");
      return;
    }
    if (draft.next.length < 8) {
      setTone("red");
      setMessage("새 비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (draft.next !== draft.confirm) {
      setTone("red");
      setMessage("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }
    const form = new FormData();
    form.append("current_password", draft.current);
    form.append("new_password", draft.next);
    setSaving(true);
    myInfoFetchJSON("/account/ajax_change_my_password/", { method: "POST", body: form })
      .then((payload) => {
        const checker = myInfoText(payload.checker);
        if (checker === "SUCCESS") {
          setTone("green");
          setMessage("비밀번호가 변경되었습니다.");
          setDraft({ current: "", next: "", confirm: "" });
          return;
        }
        setTone("red");
        setMessage(checker === "WRONGPASSWORD" ? "현재 비밀번호가 일치하지 않습니다." : "비밀번호를 변경하지 못했습니다.");
      })
      .finally(() => setSaving(false));
  }

  return (
    <MyInfoPanel title="비밀번호 변경" subtitle="현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.">
      <form onSubmit={submit} className="space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-600">현재 비밀번호</span>
          <input type="password" className="mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900" value={draft.current} onChange={(event) => patch("current", event.target.value)} autoComplete="current-password" />
        </label>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">새 비밀번호</span>
            <input type="password" className="mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900" value={draft.next} onChange={(event) => patch("next", event.target.value)} autoComplete="new-password" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">새 비밀번호 확인</span>
            <input type="password" className="mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900" value={draft.confirm} onChange={(event) => patch("confirm", event.target.value)} autoComplete="new-password" />
          </label>
        </div>
        <MyInfoMessage tone={tone}>{message}</MyInfoMessage>
        <button type="submit" disabled={saving} className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400">
          {saving ? "변경 중" : "비밀번호 변경"}
        </button>
      </form>
    </MyInfoPanel>
  );
}

function MyInfoProfileForm(props) {
  const user = props.user || {};
  const [draft, setDraft] = React.useState({
    name: "",
    realname: "",
    gender: "응답하고 싶지 않음",
    emailSubscription: true,
  });
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [tone, setTone] = React.useState("blue");

  React.useEffect(() => {
    setDraft({
      name: myInfoText(user.name),
      realname: myInfoText(user.realname),
      gender: myInfoText(user.gender) || "응답하고 싶지 않음",
      emailSubscription: myInfoNumber(user.email_subscription) === 1,
    });
  }, [props.user]);

  function patch(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!draft.name.trim()) {
      setTone("red");
      setMessage("닉네임을 입력해주세요.");
      return;
    }
    const form = new FormData();
    myInfoAppendUserForm(
      form,
      { ...user, name: draft.name.trim(), realname: draft.realname.trim(), gender: draft.gender },
      myInfoText(user.email),
      draft.gender || "응답하고 싶지 않음",
      draft.emailSubscription
    );
    setSaving(true);
    myInfoFetchJSON("/account/ajax_update_userinfo/", { method: "POST", body: form })
      .then((payload) => {
        if (myInfoText(payload.checker) === "SUCCESS") {
          setTone("green");
          setMessage("개인정보가 저장되었습니다.");
          props.reload();
          return;
        }
        setTone("red");
        setMessage("개인정보를 저장하지 못했습니다.");
      })
      .finally(() => setSaving(false));
  }

  return (
    <MyInfoPanel title="개인정보 변경" subtitle="프로필에 표시되는 정보와 이메일 수신 여부입니다.">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">닉네임</span>
            <input className="mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900" value={draft.name} onChange={(event) => patch("name", event.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">이름</span>
            <input className="mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900" value={draft.realname} onChange={(event) => patch("realname", event.target.value)} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">성별</span>
            <select className="mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900" value={draft.gender} onChange={(event) => patch("gender", event.target.value)}>
              {myInfoResolvedGenderOptions(props.genderOptions).map((option) => <option key={option.name} value={option.name}>{option.label || option.name}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-3 self-end rounded-lg border border-slate-200 px-4 py-3">
            <input type="checkbox" className="rounded border-slate-300 text-slate-950 focus:ring-slate-900" checked={draft.emailSubscription} onChange={(event) => patch("emailSubscription", event.target.checked)} />
            <span className="text-sm font-semibold text-slate-700">이메일 수신 허용</span>
          </label>
        </div>
        <MyInfoMessage tone={tone}>{message}</MyInfoMessage>
        <button type="submit" disabled={saving} className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400">
          {saving ? "저장 중" : "개인정보 저장"}
        </button>
      </form>
    </MyInfoPanel>
  );
}

function MyInfoArticles(props) {
  const rows = myInfoRows((props.data || {}).list);
  const chartOption = myInfoCalendarOption(rows, "글 작성 캘린더");
  return (
    <MyInfoPanel title="내가 쓴 글">
      {props.loading ? <MyInfoChartSkeleton className="h-[290px] w-full" /> : rows.length === 0 ? <MyInfoTableEmpty>작성한 글이 없습니다.</MyInfoTableEmpty> : (
        <div>
          <div className="mb-6">
            <MyInfoChart option={chartOption} className="h-[290px] w-full" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">제목</th>
                  <th className="px-3 py-3">게시판</th>
                  <th className="px-3 py-3">작성일</th>
                  <th className="px-3 py-3 text-right">조회</th>
                  <th className="px-3 py-3 text-right">댓글</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={myInfoText(row.uuid)} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-semibold text-slate-950"><a className="hover:text-sky-700" href={myInfoArticleHref(row)}>{myInfoText(row.title) || "-"}</a></td>
                    <td className="px-3 py-3 text-slate-600">{myInfoText(row.category) || myInfoText(row.category_url) || "-"}</td>
                    <td className="px-3 py-3 text-slate-600">{myInfoDate(row.created_at)}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{myInfoNumber(row.cnt_read).toLocaleString("ko-KR")}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{myInfoNumber(row.cnt_comment).toLocaleString("ko-KR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MyInfoPanel>
  );
}

function MyInfoComments(props) {
  const rows = myInfoRows((props.data || {}).list);
  const chartOption = myInfoCalendarOption(rows, "댓글 작성 캘린더");
  return (
    <MyInfoPanel title="내가 쓴 댓글">
      {props.loading ? <MyInfoChartSkeleton className="h-[290px] w-full" /> : rows.length === 0 ? <MyInfoTableEmpty>작성한 댓글이 없습니다.</MyInfoTableEmpty> : (
        <div>
          <div className="mb-6">
            <MyInfoChart option={chartOption} className="h-[290px] w-full" />
          </div>
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={myInfoText(row.uuid)} className="rounded-lg border border-slate-200 bg-white px-5 py-4 hover:border-sky-300 hover:bg-sky-50">
                <div className="flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-start">
                  <a className="font-semibold text-slate-950 hover:text-sky-700" href={myInfoCommentHref(row)}>{myInfoText(row.article_title) || "게시글"}</a>
                  <div className="text-sm text-slate-500">{myInfoDate(row.created_at)}</div>
                </div>
                <MyInfoHTMLPreview html={row.content} />
              </div>
            ))}
          </div>
        </div>
      )}
    </MyInfoPanel>
  );
}

function MyInfoPayments(props) {
  const [paymentGranularity, setPaymentGranularity] = React.useState("month");
  const rows = myInfoRows((props.data || {}).list);
  const chartOption = myInfoPaymentAmountOption(rows, paymentGranularity);
  return (
    <MyInfoPanel title="결제 내역" action={<MyInfoGranularityControl value={paymentGranularity} defaultValue="month" onChange={setPaymentGranularity} />}>
      {props.loading ? <MyInfoChartSkeleton className="h-[280px] w-full" /> : rows.length === 0 ? <MyInfoTableEmpty>결제 내역이 없습니다.</MyInfoTableEmpty> : (
        <div>
          <div className="mb-6">
            <MyInfoChart option={chartOption} className="h-[280px] w-full" empty="결제 차트를 표시할 데이터가 없습니다." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">상품</th>
                  <th className="px-3 py-3">주문번호</th>
                  <th className="px-3 py-3">일시</th>
                  <th className="px-3 py-3">방식</th>
                  <th className="px-3 py-3">상태</th>
                  <th className="px-3 py-3 text-right">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, idx) => (
                  <tr key={myInfoText(row.order_id) || idx} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-semibold text-slate-950">{myInfoText(row.product_name) || "-"}</td>
                    <td className="px-3 py-3 text-slate-600">{myInfoText(row.order_id) || "-"}</td>
                    <td className="px-3 py-3 text-slate-600">{myInfoDate(row.created_at)}</td>
                    <td className="px-3 py-3 text-slate-600">{myInfoText(row.method) || "-"}</td>
                    <td className="px-3 py-3"><span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{myInfoStatusText(row.status)}</span></td>
                    <td className="px-3 py-3 text-right font-semibold text-slate-950">{myInfoMoney(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MyInfoPanel>
  );
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
      setMessage({ tone: "red", text: "Google 로그인 스크립트를 불러오지 못했습니다." });
    }
    return;
  }
  if (target.dataset.rendered === "1") {
    return;
  }
  target.dataset.rendered = "1";
  google.accounts.id.initialize({
    client_id: clientId,
    nonce: nonce,
    auto_select: false,
    cancel_on_tap_outside: true,
    use_fedcm_for_prompt: true,
    callback: async (response) => {
      const credential = myInfoTrim(response && response.credential);
      if (!credential) {
        setMessage({ tone: "red", text: "Google 계정 응답이 비어 있습니다." });
        return;
      }
      const form = new FormData();
      form.append("credential", credential);
      form.append("nonce", nonce);
      const payload = await myInfoFetchJSON(endpoint, { method: "POST", body: form });
      if (myInfoText(payload.checker) === "SUCCESS") {
        setMessage({ tone: "green", text: "Google 계정이 연결되었습니다." });
        if (typeof onLinked === "function") onLinked(payload.identity || {});
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
    if (saving || !identity.connected) return;
    if (!identity.can_unlink) {
      setMessage({ tone: "red", text: myInfoGoogleMessage(identity.unlink_block_code || "PASSWORD_REQUIRED") });
      return;
    }
    if (!window.confirm("Google 계정 연동을 해제할까요?")) {
      return;
    }
    setSaving(true);
    const endpoint = myInfoTrim(myInfoGlobals().google_unlink_endpoint) || "/account/ajax_unlink_google/";
    myInfoFetchJSON(endpoint, { method: "POST", body: new FormData() })
      .then((payload) => {
        if (myInfoText(payload.checker) === "SUCCESS") {
          setMessage({ tone: "green", text: "Google 계정 연동을 해제했습니다." });
          props.reload();
          return;
        }
        setMessage({ tone: "red", text: myInfoGoogleMessage(payload.checker) });
      })
      .finally(() => setSaving(false));
  }

  return (
    <MyInfoPanel title="Google 계정 연동">
      {!googleEnabled ? (
        <MyInfoMessage tone="red">Google 로그인이 아직 설정되지 않았습니다.</MyInfoMessage>
      ) : identity.connected ? (
        <div className="space-y-5">
          <div className="flex flex-row items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 sm:flex-col sm:items-start">
            {identity.picture_url && <img src={identity.picture_url} alt="" className="h-14 w-14 rounded-full border border-slate-200" />}
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold text-slate-950">{identity.name || "Google 계정"}</div>
              <div className="mt-1 break-words text-sm text-slate-500">{identity.email || "-"}</div>
              <div className="mt-2 text-xs font-semibold text-emerald-700">연동됨</div>
            </div>
            <button type="button" disabled={saving || !identity.can_unlink} onClick={unlinkGoogle} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400">
              {saving ? "처리 중" : "연동 해제"}
            </button>
          </div>
          {!identity.can_unlink && <MyInfoMessage tone="blue">{myInfoGoogleMessage(identity.unlink_block_code || "PASSWORD_REQUIRED")}</MyInfoMessage>}
          {message.text && <MyInfoMessage tone={message.tone}>{message.text}</MyInfoMessage>}
        </div>
      ) : (
        <div className="space-y-4">
          <div id="myInfoGoogleButton" className="flex h-[44px] w-full max-w-[420px] items-center justify-center"></div>
          {message.text && <MyInfoMessage tone={message.tone}>{message.text}</MyInfoMessage>}
        </div>
      )}
    </MyInfoPanel>
  );
}

function MyInfoConnection(props) {
  const [trendGranularity, setTrendGranularity] = React.useState("day");
  const shinyRows = myInfoRows((props.data || {}).cnt_table_shinyapp);
  const visitRows = myInfoRows((props.data || {}).cnt_table_visit);
  const visitCalendarOption = myInfoCalendarOption(visitRows, "방문 캘린더");
  const appCalendarOption = myInfoCalendarOption(shinyRows, "앱 접속 캘린더");
  const trendOption = myInfoConnectionTrendOption(visitRows, shinyRows, trendGranularity);
  return (
    <MyInfoPanel title="계정 활동">
      <div className="mb-7 grid grid-cols-1 gap-5">
        <MyInfoChart option={visitCalendarOption} loading={props.loading} className="h-[290px] w-full" empty="방문 캘린더를 표시할 데이터가 없습니다." />
        <MyInfoChart option={appCalendarOption} loading={props.loading} className="h-[290px] w-full" empty="앱 접속 캘린더를 표시할 데이터가 없습니다." />
      </div>
      <div className="mb-3 flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-start">
        <h3 className="text-base font-bold text-slate-950">활동 추이</h3>
        <MyInfoGranularityControl value={trendGranularity} onChange={setTrendGranularity} />
      </div>
      <div className="mb-7">
        <MyInfoChart option={trendOption} loading={props.loading} className="h-[300px] w-full" empty="활동 추이를 표시할 데이터가 없습니다." />
      </div>
    </MyInfoPanel>
  );
}

function MyInfoApp() {
  const menuGroups = [
    {
      title: "보기",
      items: [
        { key: "overview", label: "내 정보 보기" },
        { key: "articles", label: "내가 쓴 글" },
        { key: "comments", label: "내가 쓴 댓글" },
        { key: "payments", label: "결제 내역" },
        { key: "connection", label: "계정 활동" },
        { key: "team", label: "기관/팀 관리", href: "/account/team/" },
      ],
    },
    {
      title: "변경",
      items: [
        { key: "email", label: "이메일 변경" },
        { key: "password", label: "비밀번호 변경" },
        { key: "profile", label: "개인정보 변경" },
        { key: "google", label: "Google 연동" },
      ],
    },
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
    connection: true,
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
      myInfoFetchJSON("/account/ajax_get_google_identity/"),
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
      if (menuItems.some((item) => item.key === key && !item.href)) setActive(key);
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
    overview: <MyInfoOverview user={user} googleIdentity={googleIdentity} genderOptions={genderOptions} articles={articles} comments={comments} payments={payments} loadingArticles={dataLoading.articles} loadingComments={dataLoading.comments} loadingPayments={dataLoading.payments} />,
    email: <MyInfoEmailForm user={user} reload={loadAccount} />,
    password: <MyInfoPasswordForm />,
    profile: <MyInfoProfileForm user={user} genderOptions={genderOptions} reload={loadAccount} />,
    google: <MyInfoGooglePanel identity={googleIdentity} onLinked={(identity) => setGoogleIdentity(identity)} reload={loadAccount} />,
    articles: <MyInfoArticles data={articles} loading={dataLoading.articles} />,
    comments: <MyInfoComments data={comments} loading={dataLoading.comments} />,
    payments: <MyInfoPayments data={payments} loading={dataLoading.payments} />,
    connection: <MyInfoConnection data={connection} loading={dataLoading.connection} />,
  }[active];

  return (
    <main className="mx-auto w-full max-w-[1480px] px-8 py-10 text-slate-950 lg:px-6 sm:px-4">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-normal text-slate-950">내 정보</h1>
        <p className="mt-3 text-base text-slate-500">계정 정보와 활동 내역을 확인합니다.</p>
      </header>
      <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-7 lg:grid-cols-[248px_minmax(0,1fr)] md:grid-cols-1">
        <aside className="sticky top-6 h-fit rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:static">
          <button
            type="button"
            className="hidden w-full items-center justify-between rounded-lg bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white md:flex"
            aria-expanded={menuOpen}
            aria-controls="myinfo-account-menu"
            onClick={() => setMenuOpen((open) => !open)}>
            <span>{activeItem ? activeItem.label : "내 정보 보기"}</span>
            <span aria-hidden="true">{menuOpen ? "-" : "+"}</span>
          </button>
          <nav id="myinfo-account-menu" className={`${menuOpen ? "block" : "block md:hidden"} space-y-5 md:mt-3`}>
            {menuGroups.map((group) => (
              <section key={group.title} className="space-y-1">
                <div className="px-3 pb-2 text-xs font-bold uppercase tracking-normal text-slate-400">{group.title}</div>
                {group.items.map((item) => {
                  const selected = item.key === active;
                  if (item.href) {
                    return (
                      <a
                        key={item.key}
                        href={item.href}
                        className="block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        {item.label}
                      </a>
                    );
                  }
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => activate(item.key)}
                      className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${selected ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
                      {item.label}
                    </button>
                  );
                })}
              </section>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          {loading ? (
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">불러오는 중입니다.</div>
          ) : content}
        </div>
      </div>
    </main>
  );
}

function set_main() {
  const container = document.getElementById("div_main");
  if (!container) return;
  if (!window.__webrMyInfoRoot) {
    window.__webrMyInfoRoot = ReactDOM.createRoot(container);
  }
  window.__webrMyInfoRoot.render(<MyInfoApp />);
}
