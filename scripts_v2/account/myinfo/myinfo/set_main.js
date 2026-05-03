function myInfoText(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function myInfoNumber(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
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

function myInfoDailySeries(rows) {
  const counts = {};
  (rows || []).forEach((row) => {
    const date = myInfoDateKey(row.date || row.created_at);
    if (!date) return;
    counts[date] = (counts[date] || 0) + myInfoNumber(row.cnt || 1);
  });
  return Object.keys(counts).sort().map((date) => [date, counts[date]]);
}

function myInfoMonthlyAmountSeries(rows) {
  const amounts = {};
  (rows || []).forEach((row) => {
    const month = myInfoMonthKey(row.created_at);
    if (!month) return;
    amounts[month] = (amounts[month] || 0) + myInfoNumber(row.amount);
  });
  return Object.keys(amounts).sort().map((month) => [month, amounts[month]]);
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

function myInfoPaymentMonthlyOption(rows) {
  const series = myInfoMonthlyAmountSeries(rows);
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
    },
    yAxis: {
      type: "value",
      axisLabel: { formatter: (value) => `${Math.round(value / 10000)}만` },
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [{
      type: "bar",
      data: series.map((item) => item[1]),
      barWidth: 28,
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

function myInfoConnectionTrendOption(visitRows, shinyRows) {
  const visitSeries = myInfoDailySeries(visitRows);
  const shinySeries = myInfoDailySeries(shinyRows);
  const dates = Array.from(new Set([...visitSeries, ...shinySeries].map((item) => item[0]))).sort();
  if (dates.length === 0) return null;
  const visitByDate = Object.fromEntries(visitSeries);
  const shinyByDate = Object.fromEntries(shinySeries);
  return {
    legend: { top: 0, right: 0, textStyle: { color: "#475569" } },
    grid: { top: 42, right: 20, bottom: 34, left: 42 },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: dates,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [
      { name: "방문", type: "line", smooth: true, data: dates.map((date) => visitByDate[date] || 0), symbolSize: 6, lineStyle: { width: 3, color: "#0f172a" }, itemStyle: { color: "#0f172a" }, areaStyle: { color: "rgba(15, 23, 42, 0.08)" } },
      { name: "앱 접속", type: "line", smooth: true, data: dates.map((date) => shinyByDate[date] || 0), symbolSize: 6, lineStyle: { width: 3, color: "#0284c7" }, itemStyle: { color: "#0284c7" }, areaStyle: { color: "rgba(2, 132, 199, 0.08)" } },
    ],
  };
}

function MyInfoChart(props) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current || !window.echarts || !props.option) return undefined;
    const chart = window.echarts.init(ref.current);
    chart.setOption(props.option);
    const resize = () => chart.resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.dispose();
    };
  }, [props.option]);

  if (!props.option) {
    return <MyInfoTableEmpty>{props.empty || "표시할 데이터가 없습니다."}</MyInfoTableEmpty>;
  }
  return <div ref={ref} className={props.className || "h-[260px] w-full"} />;
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
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

function MyInfoOverview(props) {
  const user = props.user || {};
  const articleCount = myInfoRows((props.articles || {}).list).length;
  const commentCount = myInfoRows((props.comments || {}).list).length;
  const paymentRows = myInfoRows((props.payments || {}).list);
  const paymentCount = paymentRows.length;
  const summaryOption = myInfoActivitySummaryOption(articleCount, commentCount, paymentCount);
  const paymentOption = myInfoPaymentMonthlyOption(paymentRows);
  return (
    <div className="space-y-7">
      <MyInfoPanel title="저장된 개인정보">
        <div className="grid gap-4 lg:grid-cols-3">
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
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-semibold text-slate-500">이메일 로그인</div>
            <div className="mt-3 text-base font-semibold text-slate-950">사용 가능</div>
            <div className="mt-2 break-words text-sm text-slate-500">{user.email || "-"}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-semibold text-slate-500">Google 로그인</div>
            <div className="mt-3 text-base font-semibold text-slate-950">미연동</div>
            <div className="mt-2 text-sm text-slate-500">StatKISS 계정 기준으로 표시됩니다.</div>
          </div>
        </div>
      </MyInfoPanel>

      <div className="grid gap-4 md:grid-cols-3">
        <MyInfoField label="내가 쓴 글" value={`${articleCount.toLocaleString("ko-KR")}개`} />
        <MyInfoField label="내가 쓴 댓글" value={`${commentCount.toLocaleString("ko-KR")}개`} />
        <MyInfoField label="결제 내역" value={`${paymentCount.toLocaleString("ko-KR")}건`} />
      </div>

      <div className="grid gap-7 xl:grid-cols-2">
        <MyInfoPanel title="나의 활동 요약">
          <MyInfoChart option={summaryOption} className="h-[260px] w-full" />
        </MyInfoPanel>
        <MyInfoPanel title="월별 결제 금액">
          <MyInfoChart option={paymentOption} className="h-[260px] w-full" empty="결제 차트를 표시할 데이터가 없습니다." />
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
    const form = new FormData();
    myInfoAppendUserForm(
      form,
      user,
      nextEmail,
      myInfoText(user.gender) || "응답하고 싶지 않음",
      myInfoNumber(user.email_subscription) === 1
    );
    setSaving(true);
    myInfoFetchJSON("/account/ajax_update_userinfo/", { method: "POST", body: form })
      .then((payload) => {
        const checker = myInfoText(payload.checker);
        if (checker === "SUCCESS" || checker === "NOTEXIST") {
          setTone("green");
          setMessage("이메일이 변경되었습니다. 다음 로그인부터 새 이메일을 사용하세요.");
          props.reload();
          return;
        }
        setTone("red");
        setMessage(checker === "EXIST" ? "이미 사용 중인 이메일입니다." : "이메일을 변경하지 못했습니다.");
      })
      .finally(() => setSaving(false));
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
        <div className="grid gap-4 md:grid-cols-2">
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
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">닉네임</span>
            <input className="mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900" value={draft.name} onChange={(event) => patch("name", event.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">이름</span>
            <input className="mt-2 w-full rounded-lg border-slate-300 focus:border-slate-900 focus:ring-slate-900" value={draft.realname} onChange={(event) => patch("realname", event.target.value)} />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
      {rows.length === 0 ? <MyInfoTableEmpty>작성한 글이 없습니다.</MyInfoTableEmpty> : (
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
      {rows.length === 0 ? <MyInfoTableEmpty>작성한 댓글이 없습니다.</MyInfoTableEmpty> : (
        <div>
          <div className="mb-6">
            <MyInfoChart option={chartOption} className="h-[290px] w-full" />
          </div>
          <div className="space-y-3">
            {rows.map((row) => (
              <a key={myInfoText(row.uuid)} href={myInfoCommentHref(row)} className="block rounded-lg border border-slate-200 bg-white px-5 py-4 hover:border-sky-300 hover:bg-sky-50">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="font-semibold text-slate-950">{myInfoText(row.article_title) || "게시글"}</div>
                  <div className="text-sm text-slate-500">{myInfoDate(row.created_at)}</div>
                </div>
                <div className="mt-3 line-clamp-2 text-sm text-slate-600">{myInfoText(row.content) || "-"}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </MyInfoPanel>
  );
}

function MyInfoPayments(props) {
  const rows = myInfoRows((props.data || {}).list);
  const chartOption = myInfoPaymentMonthlyOption(rows);
  return (
    <MyInfoPanel title="결제 내역">
      {rows.length === 0 ? <MyInfoTableEmpty>결제 내역이 없습니다.</MyInfoTableEmpty> : (
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

function MyInfoConnection(props) {
  const shinyRows = myInfoRows((props.data || {}).cnt_table_shinyapp);
  const visitRows = myInfoRows((props.data || {}).cnt_table_visit);
  const visitCalendarOption = myInfoCalendarOption(visitRows, "방문 캘린더");
  const appCalendarOption = myInfoCalendarOption(shinyRows, "앱 접속 캘린더");
  const trendOption = myInfoConnectionTrendOption(visitRows, shinyRows);
  const renderRows = (rows) => rows.length === 0 ? (
    <MyInfoTableEmpty>기록이 없습니다.</MyInfoTableEmpty>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
          <tr><th className="px-3 py-3">일자</th><th className="px-3 py-3 text-right">횟수</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, idx) => <tr key={`${row.date}-${idx}`}><td className="px-3 py-3 text-slate-700">{row.date}</td><td className="px-3 py-3 text-right font-semibold text-slate-950">{myInfoNumber(row.cnt).toLocaleString("ko-KR")}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
  return (
    <MyInfoPanel title="계정 활동">
      <div className="mb-7 grid gap-5 xl:grid-cols-2">
        <MyInfoChart option={visitCalendarOption} className="h-[290px] w-full" empty="방문 캘린더를 표시할 데이터가 없습니다." />
        <MyInfoChart option={appCalendarOption} className="h-[290px] w-full" empty="앱 접속 캘린더를 표시할 데이터가 없습니다." />
      </div>
      <div className="mb-7">
        <MyInfoChart option={trendOption} className="h-[300px] w-full" empty="활동 추이를 표시할 데이터가 없습니다." />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section>
          <h3 className="mb-3 text-base font-bold text-slate-950">Web-R 앱 접속</h3>
          {renderRows(shinyRows)}
        </section>
        <section>
          <h3 className="mb-3 text-base font-bold text-slate-950">페이지 방문</h3>
          {renderRows(visitRows)}
        </section>
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
      ],
    },
    {
      title: "변경",
      items: [
        { key: "email", label: "이메일 변경" },
        { key: "password", label: "비밀번호 변경" },
        { key: "profile", label: "개인정보 변경" },
      ],
    },
  ];
  const menuItems = menuGroups.flatMap((group) => group.items);
  const initialKey = (window.location.hash || "#overview").replace("#", "");
  const [active, setActive] = React.useState(menuItems.some((item) => item.key === initialKey) ? initialKey : "overview");
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState({});
  const [genderOptions, setGenderOptions] = React.useState([]);
  const [articles, setArticles] = React.useState({});
  const [comments, setComments] = React.useState({});
  const [payments, setPayments] = React.useState({});
  const [connection, setConnection] = React.useState({});

  function load() {
    setLoading(true);
    Promise.all([
      myInfoFetchJSON("/account/ajax_get_myinfo/"),
      myInfoFetchJSON("/account/ajax_get_gender_options/"),
      myInfoFetchJSON("/account/ajax_get_myinfo_article/"),
      myInfoFetchJSON("/account/ajax_get_myinfo_comment/"),
      myInfoFetchJSON("/account/ajax_get_myinfo_payment/"),
      myInfoFetchJSON("/account/ajax_get_myinfo_connection/"),
    ]).then(([nextUser, genderPayload, nextArticles, nextComments, nextPayments, nextConnection]) => {
      setUser(nextUser || {});
      setGenderOptions(myInfoResolvedGenderOptions((genderPayload || {}).options));
      setArticles(nextArticles || {});
      setComments(nextComments || {});
      setPayments(nextPayments || {});
      setConnection(nextConnection || {});
    }).finally(() => setLoading(false));
  }

  React.useEffect(() => {
    load();
    const onHash = () => {
      const key = (window.location.hash || "#overview").replace("#", "");
      if (menuItems.some((item) => item.key === key)) setActive(key);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function activate(key) {
    setActive(key);
    window.history.replaceState(null, "", `#${key}`);
  }

  const content = {
    overview: <MyInfoOverview user={user} genderOptions={genderOptions} articles={articles} comments={comments} payments={payments} />,
    email: <MyInfoEmailForm user={user} reload={load} />,
    password: <MyInfoPasswordForm />,
    profile: <MyInfoProfileForm user={user} genderOptions={genderOptions} reload={load} />,
    articles: <MyInfoArticles data={articles} />,
    comments: <MyInfoComments data={comments} />,
    payments: <MyInfoPayments data={payments} />,
    connection: <MyInfoConnection data={connection} />,
  }[active];

  return (
    <main className="mx-auto w-full max-w-[1480px] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-normal text-slate-950">내 정보</h1>
        <p className="mt-3 text-base text-slate-500">계정 정보와 활동 내역을 확인합니다.</p>
      </header>
      <div className="grid gap-7 md:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:sticky md:top-6">
          <nav className="space-y-5">
            {menuGroups.map((group) => (
              <section key={group.title} className="space-y-1">
                <div className="px-3 pb-2 text-xs font-bold uppercase tracking-normal text-slate-400">{group.title}</div>
                {group.items.map((item) => {
                  const selected = item.key === active;
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
