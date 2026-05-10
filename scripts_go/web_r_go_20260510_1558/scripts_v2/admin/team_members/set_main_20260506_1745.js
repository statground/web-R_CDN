function teamAdminText(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function teamAdminNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function teamAdminFormatNumber(value) {
  return teamAdminNumber(value).toLocaleString("ko-KR");
}

function teamAdminMoney(value) {
  return teamAdminFormatNumber(value) + "원";
}

function teamAdminDateOnly(value) {
  const text = teamAdminText(value).trim();
  return text.length >= 10 ? text.slice(0, 10) : text;
}

function teamAdminStatus(member) {
  if (teamAdminNumber(member && member.blocked) === 1) return "차단";
  if (teamAdminNumber(member && member.is_active) === 0) return "비활성";
  return "활성";
}

function teamAdminIsInternal(team) {
  return teamAdminText(team && team.team_kind).indexOf("internal_") === 0;
}

function teamAdminPost(url, body) {
  return fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body: body.toString()
  }).then(function (res) { return res.json(); }).then(function (data) {
    if (data && data.ok === false) {
      throw new Error(data.error || "처리할 수 없습니다.");
    }
    return data;
  });
}

function Div_operation_menu() {
  function Div_menu_button(props) {
    return React.createElement("button", {
      type: "button",
      onClick: function () { location.href = props.url; },
      className: "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
    }, props.name);
  }
  const date = new Date();
  return React.createElement("div", { className: "col-span-2 md:grid-cols-1 justify-center item-center" },
    React.createElement("div", { className: "flex flex-col md:flex-row lg:w-48 md:w-full item-center" },
      React.createElement(Div_menu_button, { name: "첫 화면", url: "/admin/" }),
      React.createElement(Div_menu_button, { name: "활성 사용자", url: "/admin/active_users/" }),
      React.createElement(Div_menu_button, { name: "Web-R 접속 현황", url: "/admin/webr/" }),
      React.createElement(Div_menu_button, { name: "방문 현황", url: "/admin/visitors/" }),
      React.createElement(Div_menu_button, { name: "회원 현황", url: "/admin/members/" }),
      React.createElement(Div_menu_button, { name: "기관/팀 현황", url: "/admin/team_members/" }),
      React.createElement(Div_menu_button, { name: "결제 현황", url: "/admin/payments/" }),
      React.createElement(Div_menu_button, { name: "정산액 조회", url: "/admin/balance_account/" + date.getFullYear().toString() + "/" + (date.getMonth() + 1).toString() + "/" })
    )
  );
}

function TeamMetric(props) {
  return React.createElement("div", { className: "flex flex-col items-center justify-center p-4" },
    React.createElement("dt", { className: "text-3xl font-extrabold" }, props.value),
    React.createElement("dd", { className: "font-light text-gray-500" }, props.title)
  );
}

function TeamMembersApp(props) {
  const [data, setData] = React.useState(props.data || {});
  const [memberEmailByTeam, setMemberEmailByTeam] = React.useState({});
  const [actionError, setActionError] = React.useState("");
  const [loadingAction, setLoadingAction] = React.useState("");
  const teams = Array.isArray(data.teams) ? data.teams : [];
  const summary = data.summary || {};
  const [search, setSearch] = React.useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredTeams = React.useMemo(function () {
    if (!normalizedSearch) return teams;
    return teams.filter(function (team) {
      const members = Array.isArray(team.members) ? team.members : [];
      const ownerTeamMembers = Array.isArray(team.owner_team_members) ? team.owner_team_members : [];
      const haystack = [
        team.team_name,
        team.member_role_name,
        team.team_kind_label,
        team.owner_team_name,
        team.owner_team_kind,
        team.owner_email,
        team.owner_nickname,
        team.owner_realname
      ].concat(members.flatMap(function (member) {
        return [member.email, member.nickname, member.realname, member.role];
      })).concat(ownerTeamMembers.flatMap(function (member) {
        return [member.email, member.nickname, member.realname, member.role];
      })).map(function (value) {
        return teamAdminText(value).toLowerCase();
      }).join(" ");
      return haystack.includes(normalizedSearch);
    });
  }, [teams, normalizedSearch]);

  function submitInternalMember(team, event) {
    event.preventDefault();
    const teamUUID = teamAdminText(team.team_uuid);
    const email = teamAdminText(memberEmailByTeam[teamUUID]).trim();
    if (!email) return;
    const body = new URLSearchParams();
    body.set("team_uuid", teamUUID);
    body.set("email", email);
    setActionError("");
    setLoadingAction("add:" + teamUUID);
    teamAdminPost("/admin/ajax_add_admin_team_member/", body).then(function (nextData) {
      setData(nextData);
      setMemberEmailByTeam(Object.assign({}, memberEmailByTeam, { [teamUUID]: "" }));
    }).catch(function (error) {
      setActionError(error.message || "팀원을 추가할 수 없습니다.");
    }).finally(function () {
      setLoadingAction("");
    });
  }

  function removeInternalMember(team, member) {
    const teamUUID = teamAdminText(team.team_uuid);
    const memberUUID = teamAdminText(member.uuid);
    if (!teamUUID || !memberUUID) return;
    const body = new URLSearchParams();
    body.set("team_uuid", teamUUID);
    body.set("member_uuid", memberUUID);
    setActionError("");
    setLoadingAction("remove:" + teamUUID + ":" + memberUUID);
    teamAdminPost("/admin/ajax_remove_admin_team_member/", body).then(function (nextData) {
      setData(nextData);
    }).catch(function (error) {
      setActionError(error.message || "팀원을 해제할 수 없습니다.");
    }).finally(function () {
      setLoadingAction("");
    });
  }

  function renderOwnerTeamMember(member) {
    return React.createElement("span", {
      key: teamAdminText(member.uuid),
      className: "inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
    }, member.email || "-", " / ", member.nickname || "-");
  }

  function renderMember(team, member) {
    const isOwner = teamAdminNumber(member.is_owner) === 1;
    const isInternal = teamAdminIsInternal(team);
    const canRemove = isInternal && !isOwner;
    const removeKey = "remove:" + teamAdminText(team.team_uuid) + ":" + teamAdminText(member.uuid);
    return React.createElement("tr", { key: teamAdminText(member.uuid) + (isOwner ? "-owner" : ""), className: "border-b last:border-0 hover:bg-slate-50" },
      React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" },
        React.createElement("span", { className: "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold " + (isOwner ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700") }, isOwner ? "팀장" : "팀원")
      ),
      React.createElement("td", { className: "px-3 py-2 font-semibold text-slate-950 whitespace-nowrap" }, member.email || "-"),
      React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, member.nickname || "-"),
      React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, member.realname || "-"),
      React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, member.role || "-"),
      React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, teamAdminDateOnly(member.expired_at) || "-"),
      React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, teamAdminDateOnly(member.joined_at) || "-"),
      React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, teamAdminStatus(member)),
      isInternal ? React.createElement("td", { className: "px-3 py-2 whitespace-nowrap text-right" },
        canRemove ? React.createElement("button", {
          type: "button",
          disabled: loadingAction === removeKey,
          onClick: function () { removeInternalMember(team, member); },
          className: "rounded-md border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
        }, loadingAction === removeKey ? "처리 중" : "해제") : "-"
      ) : null
    );
  }

  function renderTeam(team) {
    const isInternal = teamAdminIsInternal(team);
    const ownerTeamMembers = Array.isArray(team.owner_team_members) ? team.owner_team_members : [];
    const allMembers = Array.isArray(team.members) ? team.members : [];
    const members = allMembers;
    const teamUUID = teamAdminText(team.team_uuid);
    const inputValue = teamAdminText(memberEmailByTeam[teamUUID]);
    const ownerTeamName = teamAdminText(team.owner_team_name).trim();
    const ownerLabel = ownerTeamName
      ? ownerTeamName + " (팀)"
      : (teamAdminText(team.owner_email) || "-") + " / " + (teamAdminText(team.owner_nickname) || "-");
    return React.createElement("section", { key: team.team_uuid, className: "w-full rounded-lg border border-gray-200 bg-white shadow" },
      React.createElement("div", { className: "flex flex-col gap-4 p-4 md:p-6" },
        React.createElement("div", { className: "flex flex-col gap-2 md:flex-row md:items-start md:justify-between" },
          React.createElement("div", null,
            React.createElement("h3", { className: "text-xl font-extrabold text-slate-950" }, team.team_name || "이름 없는 팀"),
            React.createElement("p", { className: "text-sm text-slate-500" }, "팀장: ", ownerLabel)
          ),
          React.createElement("div", { className: "flex flex-wrap gap-2 text-sm" },
            React.createElement("span", { className: "rounded-md border border-slate-200 bg-slate-50 px-3 py-1" }, "좌석 ", teamAdminFormatNumber(team.seat_used), " / ", teamAdminFormatNumber(team.seat_limit)),
            React.createElement("span", { className: "rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-indigo-700" }, "팀원 등급 ", team.member_role_name || "정회원"),
            isInternal ? React.createElement("span", { className: "rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700" }, team.team_kind_label || "내부팀") : null,
            React.createElement("span", { className: "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700" }, "잔여 ", teamAdminFormatNumber(team.remaining)),
            React.createElement("span", { className: "rounded-md border border-slate-200 bg-slate-50 px-3 py-1" }, "만료 ", teamAdminDateOnly(team.expires_at) || "-")
          )
        ),
        React.createElement("div", { className: "grid grid-cols-5 gap-3 md:grid-cols-2" },
          React.createElement("div", { className: "rounded-md bg-slate-50 p-3" }, React.createElement("p", { className: "text-xs text-slate-500" }, "팀원 등급"), React.createElement("p", { className: "text-lg font-bold" }, team.member_role_name || "정회원")),
          React.createElement("div", { className: "rounded-md bg-slate-50 p-3" }, React.createElement("p", { className: "text-xs text-slate-500" }, "구매 좌석"), React.createElement("p", { className: "text-lg font-bold" }, teamAdminFormatNumber(team.ledger_seats), "석")),
          React.createElement("div", { className: "rounded-md bg-slate-50 p-3" }, React.createElement("p", { className: "text-xs text-slate-500" }, "결제 합계"), React.createElement("p", { className: "text-lg font-bold" }, teamAdminMoney(team.ledger_amount))),
          React.createElement("div", { className: "rounded-md bg-slate-50 p-3" }, React.createElement("p", { className: "text-xs text-slate-500" }, "팀원 수"), React.createElement("p", { className: "text-lg font-bold" }, teamAdminFormatNumber(team.active_member_count), "명")),
          React.createElement("div", { className: "rounded-md bg-slate-50 p-3" }, React.createElement("p", { className: "text-xs text-slate-500" }, "최근 결제"), React.createElement("p", { className: "text-lg font-bold" }, teamAdminDateOnly(team.last_payment_at) || "-"))
        ),
        isInternal && ownerTeamMembers.length > 0 ? React.createElement("div", { className: "rounded-md border border-blue-100 bg-blue-50/40 p-3" },
          React.createElement("p", { className: "mb-2 text-xs font-semibold text-blue-900" }, "팀장 팀 구성원"),
          React.createElement("div", { className: "flex flex-wrap gap-2" }, ownerTeamMembers.map(renderOwnerTeamMember))
        ) : null,
        isInternal ? React.createElement("form", { onSubmit: function (event) { submitInternalMember(team, event); }, className: "flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center" },
          React.createElement("input", {
            type: "email",
            value: inputValue,
            onChange: function (event) {
              setMemberEmailByTeam(Object.assign({}, memberEmailByTeam, { [teamUUID]: event.target.value }));
            },
            placeholder: "추가할 계정 이메일",
            className: "min-w-0 flex-1 rounded-md border-slate-300 text-sm"
          }),
          React.createElement("button", {
            type: "submit",
            disabled: loadingAction === "add:" + teamUUID || !inputValue.trim(),
            className: "rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          }, loadingAction === "add:" + teamUUID ? "처리 중" : "팀원 추가")
        ) : null,
        React.createElement("div", { className: "w-full overflow-x-auto" },
          React.createElement("table", { className: "min-w-full text-left text-xs text-gray-600 md:text-sm" },
            React.createElement("thead", { className: "border-b bg-gray-50" },
              React.createElement("tr", null,
                React.createElement("th", { className: "px-3 py-2 whitespace-nowrap" }, "구분"),
                React.createElement("th", { className: "px-3 py-2 whitespace-nowrap" }, "이메일"),
                React.createElement("th", { className: "px-3 py-2 whitespace-nowrap" }, "닉네임"),
                React.createElement("th", { className: "px-3 py-2 whitespace-nowrap" }, "이름"),
                React.createElement("th", { className: "px-3 py-2 whitespace-nowrap" }, "등급"),
                React.createElement("th", { className: "px-3 py-2 whitespace-nowrap" }, "만료일"),
                React.createElement("th", { className: "px-3 py-2 whitespace-nowrap" }, "등록일"),
                React.createElement("th", { className: "px-3 py-2 whitespace-nowrap" }, "상태"),
                isInternal ? React.createElement("th", { className: "px-3 py-2 whitespace-nowrap text-right" }, "관리") : null
              )
            ),
            React.createElement("tbody", null, members.map(function (member) { return renderMember(team, member); }))
          )
        )
      )
    );
  }

  return React.createElement("div", { className: "grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1" },
    React.createElement(Div_operation_menu, null),
    React.createElement("div", { className: "col-span-10 md:grid-cols-1 justify-center item-center" },
      React.createElement("div", { className: "flex w-full flex-col gap-4" },
        React.createElement("div", { className: "w-full rounded-lg border border-gray-200 bg-white shadow" },
          React.createElement("div", { className: "p-4 text-center md:p-8" },
            React.createElement("h2", { className: "mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900" },
              React.createElement("span", { className: "text-blue-600" }, "기관/팀 현황")
            ),
            React.createElement("dl", { className: "grid grid-cols-5 w-full md:grid-cols-1 gap-8 p-4 mx-auto text-gray-900 md:p-8" },
              React.createElement(TeamMetric, { title: "팀 수", value: teamAdminFormatNumber(summary.team_count) + "팀" }),
              React.createElement(TeamMetric, { title: "정회원 팀", value: teamAdminFormatNumber(summary.regular_team_total) + "팀" }),
              React.createElement(TeamMetric, { title: "VIP회원 팀", value: teamAdminFormatNumber(summary.vip_team_total) + "팀" }),
              React.createElement(TeamMetric, { title: "내부팀", value: teamAdminFormatNumber(summary.internal_team_total) + "팀" }),
              React.createElement(TeamMetric, { title: "총 좌석", value: teamAdminFormatNumber(summary.seat_limit_total) + "석" }),
              React.createElement(TeamMetric, { title: "사용 좌석", value: teamAdminFormatNumber(summary.seat_used_total) + "석" }),
              React.createElement(TeamMetric, { title: "잔여 좌석", value: teamAdminFormatNumber(summary.remaining_total) + "석" }),
              React.createElement(TeamMetric, { title: "결제 합계", value: teamAdminMoney(summary.ledger_amount_total) })
            )
          )
        ),
        React.createElement("div", { className: "flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-3" },
          actionError ? React.createElement("p", { className: "rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" }, actionError) : null,
          React.createElement("input", {
            type: "search",
            value: search,
            onChange: function (event) { setSearch(event.target.value); },
            placeholder: "팀명, 팀장, 팀원 검색",
            className: "w-full rounded-md border-slate-300 text-sm"
          }),
          React.createElement("p", { className: "text-sm text-slate-500" }, "총 ", teamAdminFormatNumber(teams.length), "팀 중 ", teamAdminFormatNumber(filteredTeams.length), "팀 표시")
        ),
        filteredTeams.length === 0
          ? React.createElement("div", { className: "rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500" }, "조건에 해당하는 기관/팀이 없습니다.")
          : filteredTeams.map(renderTeam)
      )
    )
  );
}

async function set_main() {
  const mount = document.getElementById("div_main");
  if (!mount) return;
  if (!(window.gv_username || "")) {
    location.href = "/";
    return;
  }
  ReactDOM.render(React.createElement("div", { className: "max-w-screen-xl px-6 py-10 mx-auto text-center text-gray-500" }, "기관/팀 현황을 불러오고 있습니다."), mount);
  try {
    const headerData = await fetch("/ajax_get_menu_header/", { method: "POST", credentials: "same-origin" }).then(function (res) { return res.json(); });
    const role = headerData && headerData.role ? headerData.role : "";
    window.gv_role = role;
    if (role !== "관리자") {
      ReactDOM.render(React.createElement("div", { className: "max-w-screen-xl px-6 py-10 mx-auto text-center text-gray-500" }, "관리자를 위한 메뉴입니다."), mount);
      return;
    }
    const data = await fetch("/admin/ajax_get_admin_team_members/", { method: "POST", credentials: "same-origin" }).then(function (res) { return res.json(); });
    if (data && data.ok === false) {
      throw new Error(data.error || "기관/팀 현황을 불러올 수 없습니다.");
    }
    ReactDOM.render(React.createElement(TeamMembersApp, { data: data }), mount);
  } catch (error) {
    console.error(error);
    ReactDOM.render(React.createElement("div", { className: "max-w-screen-xl px-6 py-10 mx-auto text-center text-red-600" }, error.message || "기관/팀 현황을 불러오는 중 오류가 발생했습니다."), mount);
  }
}
