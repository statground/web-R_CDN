const AccountTeamPage = (() => {
  const h = React.createElement;
  const state = { loading: true, data: null, email: "", name: "", busy: "", message: "" };
  const text = (value) => String(value == null ? "" : value).trim();
  function setState(next) {
    Object.assign(state, next || {});
    render();
  }
  function statCard(label, value) {
    return h("div", { className: "rounded-lg border border-slate-200 bg-white p-5 shadow-sm" },
      h("div", { className: "text-sm font-semibold text-slate-500" }, label),
      h("div", { className: "mt-2 text-2xl font-bold text-slate-950" }, value));
  }
  function notice(message) {
    return h("div", { className: "rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-800" }, message);
  }
  async function fetchJSON(url, options) {
    const res = await fetch(url, options || {});
    return res.json();
  }
  async function load() {
    setState({ loading: true, message: "" });
    try {
      const data = await fetchJSON("/account/ajax_get_team/");
      setState({ loading: false, data, name: data && data.team ? text(data.team.name) : "" });
    } catch (err) {
      setState({ loading: false, data: { ok: false, error: err && err.message ? err.message : "팀 정보를 불러올 수 없습니다." } });
    }
  }
  async function addMember(event) {
    event.preventDefault();
    const email = text(state.email).toLowerCase();
    if (!email) {
      setState({ message: "추가할 팀원 이메일을 입력해주세요." });
      return;
    }
    setState({ busy: "add", message: "" });
    try {
      const form = new FormData();
      form.append("email", email);
      const data = await fetchJSON("/account/ajax_add_team_member/", { method: "POST", body: form });
      if (!data.ok) {
        setState({ busy: "", message: data.error || "팀원을 추가할 수 없습니다." });
        return;
      }
      setState({ busy: "", email: "", data, message: "팀원을 추가했습니다." });
    } catch (err) {
      setState({ busy: "", message: err && err.message ? err.message : "팀원을 추가할 수 없습니다." });
    }
  }
  async function updateTeam(event) {
    event.preventDefault();
    setState({ busy: "name", message: "" });
    try {
      const form = new FormData();
      form.append("name", text(state.name));
      const data = await fetchJSON("/account/ajax_update_team/", { method: "POST", body: form });
      if (!data.ok) {
        setState({ busy: "", message: data.error || "팀 이름을 저장할 수 없습니다." });
        return;
      }
      setState({ busy: "", data, name: data && data.team ? text(data.team.name) : "", message: "팀 이름을 저장했습니다." });
    } catch (err) {
      setState({ busy: "", message: err && err.message ? err.message : "팀 이름을 저장할 수 없습니다." });
    }
  }
  async function removeMember(member) {
    const uuid = text(member && member.uuid);
    if (!uuid || !window.confirm("이 팀원을 해제할까요?")) return;
    setState({ busy: uuid, message: "" });
    try {
      const form = new FormData();
      form.append("member_uuid", uuid);
      const data = await fetchJSON("/account/ajax_remove_team_member/", { method: "POST", body: form });
      if (!data.ok) {
        setState({ busy: "", message: data.error || "팀원을 해제할 수 없습니다." });
        return;
      }
      setState({ busy: "", data, message: "팀원을 해제했습니다." });
    } catch (err) {
      setState({ busy: "", message: err && err.message ? err.message : "팀원을 해제할 수 없습니다." });
    }
  }
  function teamTable(members) {
    const rows = Array.isArray(members) ? members : [];
    return h("div", { className: "overflow-x-auto rounded-lg border border-slate-200 bg-white" },
      h("table", { className: "min-w-full text-left text-sm text-slate-700" },
        h("thead", { className: "border-b bg-slate-50 text-xs font-bold uppercase tracking-normal text-slate-500" },
          h("tr", null,
            h("th", { className: "px-4 py-3" }, "이메일"),
            h("th", { className: "px-4 py-3" }, "닉네임"),
            h("th", { className: "px-4 py-3" }, "이름"),
            h("th", { className: "px-4 py-3" }, "만료일"),
            h("th", { className: "px-4 py-3" }, "추가일"),
            h("th", { className: "px-4 py-3 text-right" }, "관리"))),
        h("tbody", null,
          rows.length === 0 ? h("tr", null, h("td", { className: "px-4 py-8 text-center text-slate-400", colSpan: 6 }, "등록된 팀원이 없습니다.")) : null,
          rows.map((member) => h("tr", { key: member.membership_uuid || member.uuid, className: "border-b last:border-0 hover:bg-slate-50" },
            h("td", { className: "px-4 py-3 font-semibold text-slate-950" }, member.email || "-"),
            h("td", { className: "px-4 py-3" }, member.nickname || "-"),
            h("td", { className: "px-4 py-3" }, member.realname || "-"),
            h("td", { className: "px-4 py-3 whitespace-nowrap" }, member.expired_at || "-"),
            h("td", { className: "px-4 py-3 whitespace-nowrap" }, member.joined_at || "-"),
            h("td", { className: "px-4 py-3 text-right" },
              h("button", {
                type: "button",
                disabled: state.busy === member.uuid,
                onClick: () => removeMember(member),
                className: "rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              }, state.busy === member.uuid ? "해제 중" : "해제")))))));
  }
  function ManageView({ data }) {
    const team = data.team || {};
    return h("div", { className: "space-y-6" },
      h("div", { className: "grid grid-cols-5 gap-4 md:grid-cols-2 sm:grid-cols-1" },
        statCard("전체 좌석", team.seat_limit || 0),
        statCard("사용 좌석", `${team.seat_used || 0} (본인 포함)`),
        statCard("남은 좌석", team.remaining || 0),
        statCard("팀원 등급", team.member_role_name || "정회원"),
        statCard("만료일", team.expires_at || "-")),
      h("form", { className: "rounded-lg border border-slate-200 bg-white p-5 shadow-sm", onSubmit: updateTeam },
        h("label", { className: "mb-2 block text-sm font-bold text-slate-700" }, "팀 이름"),
        h("div", { className: "flex gap-2 sm:flex-col" },
          h("input", {
            type: "text",
            maxLength: 150,
            value: state.name,
            onChange: (event) => setState({ name: event.target.value }),
            className: "min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950"
          }),
          h("button", {
            type: "submit",
            disabled: state.busy === "name",
            className: "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          }, state.busy === "name" ? "저장 중" : "저장"))),
      h("form", { className: "rounded-lg border border-slate-200 bg-white p-5 shadow-sm", onSubmit: addMember },
        h("label", { className: "mb-2 block text-sm font-bold text-slate-700" }, "팀원 이메일"),
        h("div", { className: "flex gap-2 sm:flex-col" },
          h("input", {
            type: "email",
            value: state.email,
            onChange: (event) => setState({ email: event.target.value }),
            className: "min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950",
            placeholder: "member@example.com"
          }),
          h("button", {
            type: "submit",
            disabled: state.busy === "add",
            className: "rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
          }, state.busy === "add" ? "추가 중" : "팀원 추가")),
        state.message ? h("p", { className: "mt-3 text-sm font-semibold text-blue-700" }, state.message) : null),
      teamTable(data.members));
  }
  function App() {
    if (state.loading) {
      return h("main", { className: "mx-auto w-full max-w-7xl px-8 py-10 lg:px-6 sm:px-4" },
        h("div", { className: "rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500" }, "불러오는 중입니다."));
    }
    const data = state.data || {};
    return h("main", { className: "mx-auto w-full max-w-7xl px-8 py-10 text-slate-950 lg:px-6 sm:px-4" },
      h("header", { className: "mb-8" },
        h("h1", { className: "text-3xl font-bold tracking-normal text-slate-950" }, "기관/팀 관리"),
        h("p", { className: "mt-3 text-base text-slate-500" }, "기관/팀 회원의 좌석과 팀원을 관리합니다.")),
      !data.ok ? notice(data.error || "팀 정보를 불러올 수 없습니다.") : !data.can_manage ? notice(data.message || "기관/팀 회원 계정만 팀원을 관리할 수 있습니다.") : h(ManageView, { data }));
  }
  function render() {
    const container = document.getElementById("div_main");
    if (!container) return;
    ReactDOM.render(h(App), container);
  }
  return { set_main: load };
})();
function set_main() {
  AccountTeamPage.set_main();
}
