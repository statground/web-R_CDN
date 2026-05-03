function adminMemberText(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function adminMemberNumber(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function adminMemberDateOnly(value) {
  const text = adminMemberText(value).trim();
  return text.length >= 10 ? text.slice(0, 10) : "";
}

function adminMemberFormatNumber(value) {
  return adminMemberNumber(value).toLocaleString("ko-KR");
}

function adminMemberMetric(data, key) {
  return adminMemberNumber((((data || {}).count_joined || {})[key] || {})["0"]);
}

function adminMemberRoleRequiresExpiry(roleMetaByName, roleName) {
  const role = adminMemberText(roleName).trim();
  return adminMemberNumber((roleMetaByName[role] || {}).requires_expiry) === 1;
}

function adminMemberDefaultExpiry() {
  const now = new Date();
  const next = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const y = next.getFullYear();
  const m = String(next.getMonth() + 1).padStart(2, "0");
  const d = String(next.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function adminMemberRoleBadgeClass(roleName) {
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function adminMemberStatusBadgeClass(member) {
  if (adminMemberNumber(member.blocked) === 1) return "border-rose-200 bg-rose-50 text-rose-700";
  if (adminMemberNumber(member.is_active) === 0) return "border-orange-200 bg-orange-50 text-orange-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function adminMemberStatusText(member) {
  if (adminMemberNumber(member.blocked) === 1) return "차단";
  if (adminMemberNumber(member.is_active) === 0) return "비활성";
  return "정상";
}

function adminMemberSortValue(member, key, idx) {
  switch (key) {
  case "no":
    return idx;
  case "date_joined":
    return Date.parse(adminMemberText(member.date_joined).replace(" ", "T")) || 0;
  case "email":
    return adminMemberText(member.email).toLowerCase();
  case "nickname":
    return adminMemberText(member.nickname).toLowerCase();
  case "realname":
    return adminMemberText(member.realname).toLowerCase();
  case "role":
    return adminMemberText(member.role_name || member.role).toLowerCase();
  case "expired_at":
    return Date.parse(adminMemberText(member.expired_at).replace(" ", "T")) || 0;
  case "status":
    return adminMemberStatusText(member);
  case "email_subscription":
    return adminMemberNumber(member.email_subscription);
  case "gender":
    return adminMemberText(member.gender).toLowerCase();
  default:
    return "";
  }
}

function adminMemberCompareValues(left, right) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  return adminMemberText(left).localeCompare(adminMemberText(right), "ko-KR", { numeric: true, sensitivity: "base" });
}

function AdminMembersManageMain(props) {
  const [data, setData] = React.useState(props.data || {});
  const [search, setSearch] = React.useState("");
  const [roleFilters, setRoleFilters] = React.useState([]);
  const [statusFilters, setStatusFilters] = React.useState([]);
  const [sortState, setSortState] = React.useState({ key: "date_joined", direction: "desc" });
  const [page, setPage] = React.useState(1);
  const [editingUUID, setEditingUUID] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createDraft, setCreateDraft] = React.useState({
    email: "",
    password: "",
    nickname: "",
    realname: "",
    gender: "",
    role_name: "",
    membership_expires_at: "",
    blocked: false,
    email_subscription: true,
  });
  const [drafts, setDrafts] = React.useState({});
  const [savingUUID, setSavingUUID] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const pageSize = 20;

  const membersRaw = React.useMemo(() => Object.values((data || {}).list_members || {}), [data]);
  const roleRows = React.useMemo(() => Object.values((data || {}).role_options || (data || {}).count_role || {}).filter((row) => adminMemberText(row && row.name).trim()), [data]);
  const roleMetaByName = React.useMemo(() => {
    const meta = {};
    roleRows.forEach((row) => {
      const name = adminMemberText(row && row.name).trim();
      if (name) meta[name] = row;
    });
    return meta;
  }, [roleRows]);
  const editableRoles = React.useMemo(() => roleRows.map((row) => adminMemberText(row.name).trim()).filter(Boolean), [roleRows]);
  const roleCounts = roleRows;
  const statusCounts = React.useMemo(() => Object.values((data || {}).count_status || {}), [data]);
  const statusFilterOptions = React.useMemo(() => [
    { value: "active", label: "정상" },
    { value: "blocked", label: "차단" },
    { value: "inactive", label: "비활성" },
  ], []);

  const filteredMembers = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return membersRaw.filter((member) => {
      if (q) {
        const haystack = [
          member.email,
          member.nickname,
          member.realname,
          member.role,
          member.role_name,
          member.gender,
          adminMemberStatusText(member),
        ].map((value) => adminMemberText(value).toLowerCase()).join(" ");
        if (!haystack.includes(q)) return false;
      }
      const memberRole = adminMemberText(member.role_name || member.role).trim();
      if (roleFilters.length > 0 && !roleFilters.includes(memberRole)) return false;
      const blocked = adminMemberNumber(member.blocked) === 1;
      const inactive = adminMemberNumber(member.is_active) === 0;
      const memberStatus = blocked ? "blocked" : (inactive ? "inactive" : "active");
      if (statusFilters.length > 0 && !statusFilters.includes(memberStatus)) return false;
      return true;
    });
  }, [membersRaw, search, roleFilters, statusFilters]);

  const sortedMembers = React.useMemo(() => {
    const rows = filteredMembers.map((member, idx) => ({ member, idx }));
    rows.sort((a, b) => {
      const left = adminMemberSortValue(a.member, sortState.key, a.idx);
      const right = adminMemberSortValue(b.member, sortState.key, b.idx);
      const result = adminMemberCompareValues(left, right);
      return sortState.direction === "desc" ? -result : result;
    });
    return rows.map((row) => row.member);
  }, [filteredMembers, sortState]);

  React.useEffect(() => setPage(1), [search, roleFilters, statusFilters, sortState]);
  React.useEffect(() => {
    requestAnimationFrame(() => {
      if (typeof draw_chart === "function") draw_chart((data || {}).list_monthly || {}, "graph_tab_monthly");
    });
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(sortedMembers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pagedMembers = sortedMembers.slice(startIdx, startIdx + pageSize);

  function reloadMembers() {
    return fetch("/admin/ajax_get_admin_members/", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((payload) => {
        setData(payload || {});
        return payload;
      });
  }

  function beginEdit(member) {
    const uuid = adminMemberText(member.uuid);
    const role = adminMemberText(member.role_name || member.role).trim() || (editableRoles[0] || "");
    const requiresExpiry = adminMemberRoleRequiresExpiry(roleMetaByName, role);
    setMessage("");
    setEditingUUID(uuid);
    setDrafts((prev) => ({
      ...prev,
      [uuid]: {
        role_name: role,
        blocked: adminMemberNumber(member.blocked) === 1,
        membership_expires_at: adminMemberDateOnly(member.expired_at) || (requiresExpiry ? adminMemberDefaultExpiry() : ""),
      },
    }));
  }

  function updateDraft(uuid, patch) {
    setDrafts((prev) => {
      const current = prev[uuid] || {};
      const next = { ...current, ...patch };
      if (Object.prototype.hasOwnProperty.call(patch, "role_name")) {
        if (adminMemberRoleRequiresExpiry(roleMetaByName, next.role_name) && !next.membership_expires_at) {
          next.membership_expires_at = adminMemberDefaultExpiry();
        }
        if (!adminMemberRoleRequiresExpiry(roleMetaByName, next.role_name)) {
          next.membership_expires_at = "";
        }
      }
      return { ...prev, [uuid]: next };
    });
  }

  function defaultCreateDraft() {
    const role = editableRoles[0] || "";
    const requiresExpiry = adminMemberRoleRequiresExpiry(roleMetaByName, role);
    return {
      email: "",
      password: "",
      nickname: "",
      realname: "",
      gender: "",
      role_name: role,
      membership_expires_at: requiresExpiry ? adminMemberDefaultExpiry() : "",
      blocked: false,
      email_subscription: true,
    };
  }

  function beginCreate() {
    setMessage("");
    setEditingUUID("");
    setCreateDraft(defaultCreateDraft());
    setCreateOpen(true);
  }

  function updateCreateDraft(patch) {
    setCreateDraft((prev) => {
      const next = { ...prev, ...patch };
      if (Object.prototype.hasOwnProperty.call(patch, "role_name")) {
        if (adminMemberRoleRequiresExpiry(roleMetaByName, next.role_name) && !next.membership_expires_at) {
          next.membership_expires_at = adminMemberDefaultExpiry();
        }
        if (!adminMemberRoleRequiresExpiry(roleMetaByName, next.role_name)) {
          next.membership_expires_at = "";
        }
      }
      return next;
    });
  }

  function toggleRoleFilter(role) {
    setRoleFilters((prev) => (
      prev.includes(role)
        ? prev.filter((item) => item !== role)
        : [...prev, role]
    ));
  }

  function toggleStatusFilter(status) {
    setStatusFilters((prev) => (
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    ));
  }

  async function createMember() {
    const draft = createDraft || {};
    if (!adminMemberText(draft.email).trim() || !adminMemberText(draft.password) || !adminMemberText(draft.nickname).trim()) {
      setMessage("이메일, 비밀번호, 닉네임은 필수입니다.");
      return;
    }
    if (!adminMemberText(draft.role_name).trim()) {
      setMessage("생성할 회원 등급을 선택해야 합니다.");
      return;
    }
    if (adminMemberRoleRequiresExpiry(roleMetaByName, draft.role_name) && !adminMemberDateOnly(draft.membership_expires_at)) {
      setMessage("선택한 회원 등급은 만료일을 선택해야 합니다.");
      return;
    }
    setCreating(true);
    setMessage("");
    try {
      const form = new FormData();
      form.append("email", adminMemberText(draft.email).trim());
      form.append("password", adminMemberText(draft.password));
      form.append("nickname", adminMemberText(draft.nickname).trim());
      form.append("realname", adminMemberText(draft.realname).trim());
      form.append("gender", adminMemberText(draft.gender).trim());
      form.append("role_name", adminMemberText(draft.role_name).trim());
      form.append("blocked", draft.blocked ? "1" : "0");
      form.append("email_subscription", draft.email_subscription ? "1" : "0");
      form.append("membership_expires_at", adminMemberDateOnly(draft.membership_expires_at));
      const res = await fetch("/admin/ajax_create_admin_member/", {
        method: "POST",
        credentials: "same-origin",
        body: form,
      });
      const payload = await res.json();
      if (!payload || payload.ok === false) throw new Error((payload && payload.error) || "회원 생성에 실패했습니다.");
      await reloadMembers();
      setCreateOpen(false);
      setCreateDraft(defaultCreateDraft());
      setPage(1);
      setMessage("회원이 생성되었습니다.");
    } catch (error) {
      console.error(error);
      setMessage((error && error.message) ? error.message : "회원 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  }

  async function saveMember(member) {
    const uuid = adminMemberText(member.uuid);
    const draft = drafts[uuid] || {};
    if (!uuid) return;
    if (!adminMemberText(draft.role_name).trim()) {
      setMessage("변경할 회원 등급을 선택해야 합니다.");
      return;
    }
    if (adminMemberRoleRequiresExpiry(roleMetaByName, draft.role_name) && !adminMemberDateOnly(draft.membership_expires_at)) {
      setMessage("선택한 회원 등급은 만료일을 선택해야 합니다.");
      return;
    }
    setSavingUUID(uuid);
    setMessage("");
    try {
      const form = new FormData();
      form.append("uuid", uuid);
      form.append("role_name", adminMemberText(draft.role_name).trim());
      form.append("blocked", draft.blocked ? "1" : "0");
      form.append("membership_expires_at", adminMemberDateOnly(draft.membership_expires_at));
      const res = await fetch("/admin/ajax_update_admin_member/", {
        method: "POST",
        credentials: "same-origin",
        body: form,
      });
      const payload = await res.json();
      if (!payload || payload.ok === false) throw new Error((payload && payload.error) || "저장에 실패했습니다.");
      await reloadMembers();
      setEditingUUID("");
      setMessage("저장되었습니다.");
    } catch (error) {
      console.error(error);
      setMessage((error && error.message) ? error.message : "저장에 실패했습니다.");
    } finally {
      setSavingUUID("");
    }
  }

  function renderRoleCountCard(row, idx) {
    const title = adminMemberText(row && row.name) || "-";
    const count = adminMemberNumber(row && row.cnt);
    return (
      <div key={`${title}_${idx}`} className="basis-[220px] shrink-0 text-center">
        <Div_sub_card title={title} value={count} unit={"명"} />
      </div>
    );
  }

  function renderStatusCountCard(row, idx) {
    const title = adminMemberText(row && row.name) || "-";
    const count = adminMemberNumber(row && row.cnt);
    return (
      <div key={`status_${title}_${idx}`} className="basis-[220px] shrink-0 text-center">
        <Div_sub_card title={title} value={count} unit={"명"} />
      </div>
    );
  }

  function toggleSort(key) {
    setSortState((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  function renderSortHeader(label, key, alignClass) {
    const active = sortState.key === key;
    const icon = active ? (sortState.direction === "asc" ? "▲" : "▼") : "↕";
    return (
      <th className={"px-3 py-2 whitespace-nowrap " + (alignClass || "")} aria-sort={active ? (sortState.direction === "asc" ? "ascending" : "descending") : "none"}>
        <button
          type="button"
          className={"inline-flex w-full items-center gap-1 font-semibold hover:text-blue-700 " + (alignClass === "text-right" ? "justify-end" : "justify-start")}
          onClick={() => toggleSort(key)}>
          <span>{label}</span>
          <span className="text-[10px] text-slate-400">{icon}</span>
        </button>
      </th>
    );
  }

  function renderCreatePanel() {
    if (!createOpen) return null;
    const roleSelectOptions = editableRoles;
    const paidRole = adminMemberRoleRequiresExpiry(roleMetaByName, createDraft.role_name);
    return (
      <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <label className="flex flex-col gap-1 lg:col-span-3">
            <span className="text-xs font-semibold text-slate-600">이메일</span>
            <input
              type="email"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              disabled={creating}
              value={createDraft.email}
              onChange={(event) => updateCreateDraft({ email: event.target.value })} />
          </label>
          <label className="flex flex-col gap-1 lg:col-span-3">
            <span className="text-xs font-semibold text-slate-600">임시 비밀번호</span>
            <input
              type="password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              disabled={creating}
              value={createDraft.password}
              onChange={(event) => updateCreateDraft({ password: event.target.value })} />
          </label>
          <label className="flex flex-col gap-1 lg:col-span-2">
            <span className="text-xs font-semibold text-slate-600">닉네임</span>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              disabled={creating}
              value={createDraft.nickname}
              onChange={(event) => updateCreateDraft({ nickname: event.target.value })} />
          </label>
          <label className="flex flex-col gap-1 lg:col-span-2">
            <span className="text-xs font-semibold text-slate-600">이름</span>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              disabled={creating}
              value={createDraft.realname}
              onChange={(event) => updateCreateDraft({ realname: event.target.value })} />
          </label>
          <label className="flex flex-col gap-1 lg:col-span-2">
            <span className="text-xs font-semibold text-slate-600">성별</span>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              disabled={creating}
              value={createDraft.gender}
              onChange={(event) => updateCreateDraft({ gender: event.target.value })} />
          </label>
          <label className="flex flex-col gap-1 lg:col-span-3">
            <span className="text-xs font-semibold text-slate-600">회원 등급</span>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              disabled={creating || roleSelectOptions.length === 0}
              value={createDraft.role_name}
              onChange={(event) => updateCreateDraft({ role_name: event.target.value })}>
              {roleSelectOptions.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 lg:col-span-3">
            <span className="text-xs font-semibold text-slate-600">만료일</span>
            <input
              type="date"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
              disabled={!paidRole || creating}
              value={paidRole ? (createDraft.membership_expires_at || adminMemberDefaultExpiry()) : ""}
              onChange={(event) => updateCreateDraft({ membership_expires_at: event.target.value })} />
          </label>
          <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 lg:col-span-2">
            <input
              type="checkbox"
              className="rounded border-slate-300"
              disabled={creating}
              checked={!!createDraft.email_subscription}
              onChange={(event) => updateCreateDraft({ email_subscription: event.target.checked })} />
            <span className="text-sm font-medium text-slate-700">메일수신</span>
          </label>
          <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 lg:col-span-2">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-rose-600"
              disabled={creating}
              checked={!!createDraft.blocked}
              onChange={(event) => updateCreateDraft({ blocked: event.target.checked })} />
            <span className="text-sm font-medium text-slate-700">회원 차단</span>
          </label>
          <div className="flex flex-wrap justify-end gap-2 lg:col-span-2">
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              disabled={creating}
              onClick={() => setCreateOpen(false)}>
              취소
            </button>
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={creating || roleSelectOptions.length === 0}
              onClick={createMember}>
              {creating ? "생성 중" : "생성"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderEditor(member) {
    const uuid = adminMemberText(member.uuid);
    const draft = drafts[uuid] || {};
    const lockedAdmin = adminMemberNumber(member.is_staff) === 1 || adminMemberNumber(member.is_superuser) === 1;
    const paidRole = adminMemberRoleRequiresExpiry(roleMetaByName, draft.role_name);
    const currentRole = adminMemberText(draft.role_name || member.role_name || member.role).trim();
    const roleSelectOptions = lockedAdmin ? [currentRole].filter(Boolean) : editableRoles;
    if (editingUUID !== uuid) return null;
    return (
      <tr className="border-b bg-slate-50">
        <td colSpan="11" className="px-4 py-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
            <label className="flex flex-col gap-1 lg:col-span-3">
              <span className="text-xs font-semibold text-slate-600">회원 등급</span>
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                disabled={lockedAdmin || savingUUID === uuid || roleSelectOptions.length === 0}
                value={currentRole}
                onChange={(event) => updateDraft(uuid, { role_name: event.target.value })}>
                {roleSelectOptions.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 lg:col-span-3">
              <span className="text-xs font-semibold text-slate-600">만료일</span>
              <input
                type="date"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
                disabled={!paidRole || lockedAdmin || savingUUID === uuid}
                value={paidRole ? (draft.membership_expires_at || adminMemberDefaultExpiry()) : ""}
                onChange={(event) => updateDraft(uuid, { membership_expires_at: event.target.value })} />
            </label>
            <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 lg:col-span-2">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-rose-600"
                disabled={lockedAdmin || savingUUID === uuid}
                checked={!!draft.blocked}
                onChange={(event) => updateDraft(uuid, { blocked: event.target.checked })} />
              <span className="text-sm font-medium text-slate-700">회원 차단</span>
            </label>
            <div className="flex flex-wrap justify-end gap-2 lg:col-span-4">
              <button
                type="button"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                disabled={savingUUID === uuid}
                onClick={() => setEditingUUID("")}>
                취소
              </button>
              <button
                type="button"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={lockedAdmin || savingUUID === uuid}
                onClick={() => saveMember(member)}>
                {savingUUID === uuid ? "저장 중" : "저장"}
              </button>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="grid w-full grid-cols-12 justify-center px-[100px] py-[20px] md:grid-cols-1 md:px-[10px]">
      <Div_operation_menu />
      <div className="col-span-10 space-y-4">
        <div className="w-full rounded-lg border border-gray-200 bg-white shadow">
          <div className="rounded-lg bg-white p-4 text-center md:p-8">
            <Div_sub_title title={"가입자 수"} />
            <dl className="mx-auto grid w-full grid-cols-4 gap-8 p-4 text-gray-900 md:grid-cols-2 md:p-8">
              <Div_sub_card title={"총 가입자 수"} value={adminMemberMetric(data, "val_member_total")} unit={"명"} />
              <Div_sub_card title={"올해 가입자 수"} value={adminMemberMetric(data, "val_member_yearly")} unit={"명"} subtitle={"작년"} subvalue={adminMemberMetric(data, "val_member_yearly_last")} />
              <Div_sub_card title={"이번 달 가입자 수"} value={adminMemberMetric(data, "val_member_monthly")} unit={"명"} subtitle={"지난 달"} subvalue={adminMemberMetric(data, "val_member_monthly_last")} />
              <Div_sub_card title={"오늘 가입자 수"} value={adminMemberMetric(data, "val_member_daily")} unit={"명"} subtitle={"어제"} subvalue={adminMemberMetric(data, "val_member_daily_last")} />
            </dl>
          </div>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white shadow">
          <div className="rounded-lg bg-white p-4 text-center md:p-8">
            <Div_sub_title title={"등급별 멤버 수"} />
            <dl className="mx-auto flex w-full flex-wrap justify-center gap-x-16 gap-y-8 p-4 text-gray-900 md:gap-x-8 md:p-8">
              {roleCounts.map(renderRoleCountCard)}
            </dl>
          </div>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white shadow">
          <div className="rounded-lg bg-white p-4 text-center md:p-8">
            <Div_sub_title title={"회원 상태"} />
            <dl className="mx-auto flex w-full flex-wrap justify-center gap-x-16 gap-y-8 p-4 text-gray-900 md:gap-x-8 md:p-8">
              {statusCounts.map(renderStatusCountCard)}
            </dl>
          </div>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white shadow">
          <div className="rounded-lg bg-white p-4 text-center md:p-8">
            <dl className="mx-auto flex w-full flex-col items-start justify-center p-4 text-gray-900">
              <ul className="flex w-full flex-wrap border-b border-gray-200 text-center text-sm font-medium text-gray-500">
                <li className="me-2" onClick={() => draw_chart((data || {}).list_daily || {}, "graph_tab_daily")}><div className={class_tab_inactive} id="graph_tab_daily">일</div></li>
                <li className="me-2" onClick={() => draw_chart((data || {}).list_monthly || {}, "graph_tab_monthly")}><div className={class_tab_active} id="graph_tab_monthly">월</div></li>
                <li className="me-2" onClick={() => draw_chart((data || {}).list_yearly || {}, "graph_tab_yearly")}><div className={class_tab_inactive} id="graph_tab_yearly">년</div></li>
              </ul>
              <div id="div_statistics_graph" className="h-[500px] w-full p-8"></div>
            </dl>
          </div>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white shadow">
          <div className="rounded-lg bg-white p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Div_sub_title title={"회원 목록"} />
              <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="text-sm text-slate-500">
                  총 {adminMemberFormatNumber(filteredMembers.length)}명 중 {pagedMembers.length > 0 ? `${adminMemberFormatNumber(startIdx + 1)}-${adminMemberFormatNumber(startIdx + pagedMembers.length)}` : 0}명 표시
                </div>
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  onClick={() => createOpen ? setCreateOpen(false) : beginCreate()}>
                  {createOpen ? "추가 닫기" : "회원 추가"}
                </button>
              </div>
            </div>

            {renderCreatePanel()}

            <div className="mb-4 flex flex-col gap-3">
              <input
                type="text"
                className="w-full max-w-[390px] rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="이메일 / 닉네임 / 이름 검색"
                value={search}
                onChange={(event) => setSearch(event.target.value)} />
              <div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-xs font-semibold text-slate-600">등급</span>
                  <label className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                    <input type="checkbox" className="rounded border-slate-300" checked={roleFilters.length === 0} onChange={() => setRoleFilters([])} />
                    <span>전체</span>
                  </label>
                  {editableRoles.map((role) => (
                    <label key={role} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                      <input type="checkbox" className="rounded border-slate-300" checked={roleFilters.includes(role)} onChange={() => toggleRoleFilter(role)} />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-xs font-semibold text-slate-600">상태</span>
                  <label className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                    <input type="checkbox" className="rounded border-slate-300" checked={statusFilters.length === 0} onChange={() => setStatusFilters([])} />
                    <span>전체</span>
                  </label>
                  {statusFilterOptions.map((status) => (
                    <label key={status.value} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                      <input type="checkbox" className="rounded border-slate-300" checked={statusFilters.includes(status.value)} onChange={() => toggleStatusFilter(status.value)} />
                      <span>{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {message ? <p className="text-sm font-medium text-blue-700">{message}</p> : null}
            </div>

	            <div className="w-full overflow-x-auto">
	              <table className="min-w-full text-left text-xs text-gray-600 md:text-sm">
	                <thead className="border-b bg-gray-50">
	                  <tr>
	                    {renderSortHeader("No", "no")}
	                    {renderSortHeader("가입일", "date_joined")}
	                    {renderSortHeader("이메일", "email")}
	                    {renderSortHeader("닉네임", "nickname")}
	                    {renderSortHeader("이름", "realname")}
	                    {renderSortHeader("등급", "role")}
	                    {renderSortHeader("만료일", "expired_at")}
	                    {renderSortHeader("상태", "status")}
	                    {renderSortHeader("메일수신", "email_subscription")}
	                    {renderSortHeader("성별", "gender")}
	                    <th className="px-3 py-2 text-right whitespace-nowrap">관리</th>
	                  </tr>
	                </thead>
                <tbody>
                  {pagedMembers.length === 0 ? (
                    <tr><td colSpan="11" className="px-3 py-6 text-center text-gray-400">조건에 해당하는 회원이 없습니다.</td></tr>
                  ) : null}
                  {pagedMembers.map((member, idx) => (
                    <React.Fragment key={member.uuid || member.email || idx}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">{startIdx + idx + 1}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{member.date_joined}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{member.email}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{member.nickname}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{member.realname}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={"inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold " + adminMemberRoleBadgeClass(member.role)}>{member.role || "-"}</span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">{adminMemberDateOnly(member.expired_at) || "-"}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={"inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold " + adminMemberStatusBadgeClass(member)}>{adminMemberStatusText(member)}</span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">{adminMemberNumber(member.email_subscription) === 1 ? "Y" : "N"}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{member.gender || "-"}</td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100" onClick={() => editingUUID === adminMemberText(member.uuid) ? setEditingUUID("") : beginEdit(member)}>
                            {editingUUID === adminMemberText(member.uuid) ? "닫기" : "편집"}
                          </button>
                        </td>
                      </tr>
                      {renderEditor(member)}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs md:text-sm">
              <div>페이지 {currentPage} / {totalPages}</div>
              <div className="flex gap-2">
                <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>이전</button>
                <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>다음</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

get_main = async function () {
  const data = await fetch("/admin/ajax_get_admin_members/", { credentials: "same-origin" }).then((res) => res.json());
  ReactDOM.render(<AdminMembersManageMain data={data} />, document.getElementById("div_main"));
};
