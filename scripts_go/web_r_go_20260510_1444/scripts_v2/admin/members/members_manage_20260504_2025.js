function adminMemberText(value) {
  if (value === null || value === void 0)
    return "";
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
  const now = /* @__PURE__ */ new Date();
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
  if (adminMemberNumber(member.blocked) === 1)
    return "border-rose-200 bg-rose-50 text-rose-700";
  if (adminMemberNumber(member.is_active) === 0)
    return "border-orange-200 bg-orange-50 text-orange-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}
function adminMemberStatusText(member) {
  if (adminMemberNumber(member.blocked) === 1)
    return "\uCC28\uB2E8";
  if (adminMemberNumber(member.is_active) === 0)
    return "\uBE44\uD65C\uC131";
  return "\uC815\uC0C1";
}
function adminMemberIsBot(member) {
  return adminMemberText((member || {}).role_name || (member || {}).role).trim().toLowerCase() === "bot";
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
    email_subscription: true
  });
  const [drafts, setDrafts] = React.useState({});
  const [savingUUID, setSavingUUID] = React.useState("");
  const [deletingUUID, setDeletingUUID] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const pageSize = 20;
  const membersRaw = React.useMemo(() => Object.values((data || {}).list_members || {}), [data]);
  const roleRows = React.useMemo(() => Object.values((data || {}).role_options || (data || {}).count_role || {}).filter((row) => adminMemberText(row && row.name).trim()), [data]);
  const roleMetaByName = React.useMemo(() => {
    const meta = {};
    roleRows.forEach((row) => {
      const name = adminMemberText(row && row.name).trim();
      if (name)
        meta[name] = row;
    });
    return meta;
  }, [roleRows]);
  const editableRoles = React.useMemo(() => roleRows.map((row) => adminMemberText(row.name).trim()).filter(Boolean), [roleRows]);
  const roleCounts = roleRows;
  const statusCounts = React.useMemo(() => Object.values((data || {}).count_status || {}), [data]);
  const statusFilterOptions = React.useMemo(() => [
    { value: "active", label: "\uC815\uC0C1" },
    { value: "blocked", label: "\uCC28\uB2E8" },
    { value: "inactive", label: "\uBE44\uD65C\uC131" }
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
          adminMemberStatusText(member)
        ].map((value) => adminMemberText(value).toLowerCase()).join(" ");
        if (!haystack.includes(q))
          return false;
      }
      const memberRole = adminMemberText(member.role_name || member.role).trim();
      if (roleFilters.length > 0 && !roleFilters.includes(memberRole))
        return false;
      const blocked = adminMemberNumber(member.blocked) === 1;
      const inactive = adminMemberNumber(member.is_active) === 0;
      const memberStatus = blocked ? "blocked" : inactive ? "inactive" : "active";
      if (statusFilters.length > 0 && !statusFilters.includes(memberStatus))
        return false;
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
      if (typeof draw_chart === "function")
        draw_chart((data || {}).list_monthly || {}, "graph_tab_monthly");
    });
  }, [data]);
  const totalPages = Math.max(1, Math.ceil(sortedMembers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pagedMembers = sortedMembers.slice(startIdx, startIdx + pageSize);
  function reloadMembers() {
    return fetch("/admin/ajax_get_admin_members/", { method: "POST", credentials: "same-origin" }).then((res) => res.json()).then((payload) => {
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
        membership_expires_at: adminMemberDateOnly(member.expired_at) || (requiresExpiry ? adminMemberDefaultExpiry() : "")
      }
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
      email_subscription: true
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
    setRoleFilters((prev) => prev.includes(role) ? prev.filter((item) => item !== role) : [...prev, role]);
  }
  function toggleStatusFilter(status) {
    setStatusFilters((prev) => prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status]);
  }
  async function createMember() {
    const draft = createDraft || {};
    if (!adminMemberText(draft.email).trim() || !adminMemberText(draft.password) || !adminMemberText(draft.nickname).trim()) {
      setMessage("\uC774\uBA54\uC77C, \uBE44\uBC00\uBC88\uD638, \uB2C9\uB124\uC784\uC740 \uD544\uC218\uC785\uB2C8\uB2E4.");
      return;
    }
    if (!adminMemberText(draft.role_name).trim()) {
      setMessage("\uC0DD\uC131\uD560 \uD68C\uC6D0 \uB4F1\uAE09\uC744 \uC120\uD0DD\uD574\uC57C \uD569\uB2C8\uB2E4.");
      return;
    }
    if (adminMemberRoleRequiresExpiry(roleMetaByName, draft.role_name) && !adminMemberDateOnly(draft.membership_expires_at)) {
      setMessage("\uC120\uD0DD\uD55C \uD68C\uC6D0 \uB4F1\uAE09\uC740 \uB9CC\uB8CC\uC77C\uC744 \uC120\uD0DD\uD574\uC57C \uD569\uB2C8\uB2E4.");
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
        body: form
      });
      const payload = await res.json();
      if (!payload || payload.ok === false)
        throw new Error(payload && payload.error || "\uD68C\uC6D0 \uC0DD\uC131\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
      await reloadMembers();
      setCreateOpen(false);
      setCreateDraft(defaultCreateDraft());
      setPage(1);
      setMessage("\uD68C\uC6D0\uC774 \uC0DD\uC131\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    } catch (error) {
      console.error(error);
      setMessage(error && error.message ? error.message : "\uD68C\uC6D0 \uC0DD\uC131\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
    } finally {
      setCreating(false);
    }
  }
  async function saveMember(member) {
    const uuid = adminMemberText(member.uuid);
    const draft = drafts[uuid] || {};
    if (!uuid)
      return;
    if (!adminMemberText(draft.role_name).trim()) {
      setMessage("\uBCC0\uACBD\uD560 \uD68C\uC6D0 \uB4F1\uAE09\uC744 \uC120\uD0DD\uD574\uC57C \uD569\uB2C8\uB2E4.");
      return;
    }
    if (adminMemberRoleRequiresExpiry(roleMetaByName, draft.role_name) && !adminMemberDateOnly(draft.membership_expires_at)) {
      setMessage("\uC120\uD0DD\uD55C \uD68C\uC6D0 \uB4F1\uAE09\uC740 \uB9CC\uB8CC\uC77C\uC744 \uC120\uD0DD\uD574\uC57C \uD569\uB2C8\uB2E4.");
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
        body: form
      });
      const payload = await res.json();
      if (!payload || payload.ok === false)
        throw new Error(payload && payload.error || "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
      await reloadMembers();
      setEditingUUID("");
      setMessage("\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    } catch (error) {
      console.error(error);
      setMessage(error && error.message ? error.message : "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
    } finally {
      setSavingUUID("");
    }
  }
  async function deleteMember(member) {
    const uuid = adminMemberText(member.uuid);
    if (!uuid || !adminMemberIsBot(member))
      return;
    if (!window.confirm("Bot \uACC4\uC815\uC744 \uC0AD\uC81C \uCC98\uB9AC\uD560\uAE4C\uC694? \uC791\uC131\uC790 \uC774\uB825\uC744 \uBCF4\uC874\uD558\uAE30 \uC704\uD574 \uBE44\uD65C\uC131/\uCC28\uB2E8 \uC0C1\uD0DC\uB85C \uC804\uD658\uB429\uB2C8\uB2E4."))
      return;
    setDeletingUUID(uuid);
    setMessage("");
    try {
      const form = new FormData();
      form.append("uuid", uuid);
      const res = await fetch("/admin/ajax_delete_admin_member/", {
        method: "POST",
        credentials: "same-origin",
        body: form
      });
      const payload = await res.json();
      if (!payload || payload.ok === false)
        throw new Error(payload && payload.error || "\uC0AD\uC81C \uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
      await reloadMembers();
      setEditingUUID("");
      setMessage("Bot \uACC4\uC815\uC774 \uC0AD\uC81C \uCC98\uB9AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    } catch (error) {
      console.error(error);
      setMessage(error && error.message ? error.message : "\uC0AD\uC81C \uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
    } finally {
      setDeletingUUID("");
    }
  }
  function renderRoleCountCard(row, idx) {
    const title = adminMemberText(row && row.name) || "-";
    const count = adminMemberNumber(row && row.cnt);
    return /* @__PURE__ */ React.createElement("div", { key: `${title}_${idx}`, className: "basis-[220px] shrink-0 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_card, { title, value: count, unit: "\uBA85" }));
  }
  function renderStatusCountCard(row, idx) {
    const title = adminMemberText(row && row.name) || "-";
    const count = adminMemberNumber(row && row.cnt);
    return /* @__PURE__ */ React.createElement("div", { key: `status_${title}_${idx}`, className: "basis-[220px] shrink-0 text-center" }, /* @__PURE__ */ React.createElement(Div_sub_card, { title, value: count, unit: "\uBA85" }));
  }
  function toggleSort(key) {
    setSortState((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  }
  function renderSortHeader(label, key, alignClass) {
    const active = sortState.key === key;
    const icon = active ? sortState.direction === "asc" ? "\u25B2" : "\u25BC" : "\u2195";
    return /* @__PURE__ */ React.createElement("th", { className: "px-3 py-2 whitespace-nowrap " + (alignClass || ""), "aria-sort": active ? sortState.direction === "asc" ? "ascending" : "descending" : "none" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "inline-flex w-full items-center gap-1 font-semibold hover:text-blue-700 " + (alignClass === "text-right" ? "justify-end" : "justify-start"),
        onClick: () => toggleSort(key)
      },
      /* @__PURE__ */ React.createElement("span", null, label),
      /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400" }, icon)
    ));
  }
  function renderCreatePanel() {
    if (!createOpen)
      return null;
    const roleSelectOptions = editableRoles;
    const paidRole = adminMemberRoleRequiresExpiry(roleMetaByName, createDraft.role_name);
    return /* @__PURE__ */ React.createElement("div", { className: "mb-4 rounded-lg border border-blue-100 bg-blue-50/50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end" }, /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 lg:col-span-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, "\uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "email",
        className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm",
        disabled: creating,
        value: createDraft.email,
        onChange: (event) => updateCreateDraft({ email: event.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 lg:col-span-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, "\uC784\uC2DC \uBE44\uBC00\uBC88\uD638"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm",
        disabled: creating,
        value: createDraft.password,
        onChange: (event) => updateCreateDraft({ password: event.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 lg:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, "\uB2C9\uB124\uC784"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm",
        disabled: creating,
        value: createDraft.nickname,
        onChange: (event) => updateCreateDraft({ nickname: event.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 lg:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, "\uC774\uB984"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm",
        disabled: creating,
        value: createDraft.realname,
        onChange: (event) => updateCreateDraft({ realname: event.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 lg:col-span-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, "\uC131\uBCC4"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm",
        disabled: creating,
        value: createDraft.gender,
        onChange: (event) => updateCreateDraft({ gender: event.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 lg:col-span-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, "\uD68C\uC6D0 \uB4F1\uAE09"), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm",
        disabled: creating || roleSelectOptions.length === 0,
        value: createDraft.role_name,
        onChange: (event) => updateCreateDraft({ role_name: event.target.value })
      },
      roleSelectOptions.map((role) => /* @__PURE__ */ React.createElement("option", { key: role, value: role }, role))
    )), /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 lg:col-span-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, "\uB9CC\uB8CC\uC77C"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "date",
        className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100",
        disabled: !paidRole || creating,
        value: paidRole ? createDraft.membership_expires_at || adminMemberDefaultExpiry() : "",
        onChange: (event) => updateCreateDraft({ membership_expires_at: event.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 lg:col-span-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        className: "rounded border-slate-300",
        disabled: creating,
        checked: !!createDraft.email_subscription,
        onChange: (event) => updateCreateDraft({ email_subscription: event.target.checked })
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-slate-700" }, "\uBA54\uC77C\uC218\uC2E0")), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 lg:col-span-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        className: "rounded border-slate-300 text-rose-600",
        disabled: creating,
        checked: !!createDraft.blocked,
        onChange: (event) => updateCreateDraft({ blocked: event.target.checked })
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-slate-700" }, "\uD68C\uC6D0 \uCC28\uB2E8")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-end gap-2 lg:col-span-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100",
        disabled: creating,
        onClick: () => setCreateOpen(false)
      },
      "\uCDE8\uC18C"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50",
        disabled: creating || roleSelectOptions.length === 0,
        onClick: createMember
      },
      creating ? "\uC0DD\uC131 \uC911" : "\uC0DD\uC131"
    ))));
  }
  function renderEditor(member) {
    const uuid = adminMemberText(member.uuid);
    const draft = drafts[uuid] || {};
    const lockedAdmin = adminMemberNumber(member.is_staff) === 1 || adminMemberNumber(member.is_superuser) === 1;
    const paidRole = adminMemberRoleRequiresExpiry(roleMetaByName, draft.role_name);
    const currentRole = adminMemberText(draft.role_name || member.role_name || member.role).trim();
    const roleSelectOptions = lockedAdmin ? [currentRole].filter(Boolean) : editableRoles;
    if (editingUUID !== uuid)
      return null;
    return /* @__PURE__ */ React.createElement("tr", { className: "border-b bg-slate-50" }, /* @__PURE__ */ React.createElement("td", { colSpan: "11", className: "px-4 py-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end" }, /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 lg:col-span-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, "\uD68C\uC6D0 \uB4F1\uAE09"), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm",
        disabled: lockedAdmin || savingUUID === uuid || roleSelectOptions.length === 0,
        value: currentRole,
        onChange: (event) => updateDraft(uuid, { role_name: event.target.value })
      },
      roleSelectOptions.map((role) => /* @__PURE__ */ React.createElement("option", { key: role, value: role }, role))
    )), /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 lg:col-span-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, "\uB9CC\uB8CC\uC77C"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "date",
        className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100",
        disabled: !paidRole || lockedAdmin || savingUUID === uuid,
        value: paidRole ? draft.membership_expires_at || adminMemberDefaultExpiry() : "",
        onChange: (event) => updateDraft(uuid, { membership_expires_at: event.target.value })
      }
    )), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 lg:col-span-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        className: "rounded border-slate-300 text-rose-600",
        disabled: lockedAdmin || savingUUID === uuid,
        checked: !!draft.blocked,
        onChange: (event) => updateDraft(uuid, { blocked: event.target.checked })
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium text-slate-700" }, "\uD68C\uC6D0 \uCC28\uB2E8")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-end gap-2 lg:col-span-4" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100",
        disabled: savingUUID === uuid,
        onClick: () => setEditingUUID("")
      },
      "\uCDE8\uC18C"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50",
        disabled: lockedAdmin || savingUUID === uuid,
        onClick: () => saveMember(member)
      },
      savingUUID === uuid ? "\uC800\uC7A5 \uC911" : "\uC800\uC7A5"
    )))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "grid w-full grid-cols-12 justify-center px-[100px] py-[20px] md:grid-cols-1 md:px-[10px]" }, /* @__PURE__ */ React.createElement(Div_operation_menu, null), /* @__PURE__ */ React.createElement("div", { className: "col-span-10 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full rounded-lg border border-gray-200 bg-white shadow" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg bg-white p-4 text-center md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uAC00\uC785\uC790 \uC218" }), /* @__PURE__ */ React.createElement("dl", { className: "mx-auto grid w-full grid-cols-4 gap-8 p-4 text-gray-900 md:grid-cols-2 md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uCD1D \uAC00\uC785\uC790 \uC218", value: adminMemberMetric(data, "val_member_total"), unit: "\uBA85" }), /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uC62C\uD574 \uAC00\uC785\uC790 \uC218", value: adminMemberMetric(data, "val_member_yearly"), unit: "\uBA85", subtitle: "\uC791\uB144", subvalue: adminMemberMetric(data, "val_member_yearly_last") }), /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uC774\uBC88 \uB2EC \uAC00\uC785\uC790 \uC218", value: adminMemberMetric(data, "val_member_monthly"), unit: "\uBA85", subtitle: "\uC9C0\uB09C \uB2EC", subvalue: adminMemberMetric(data, "val_member_monthly_last") }), /* @__PURE__ */ React.createElement(Div_sub_card, { title: "\uC624\uB298 \uAC00\uC785\uC790 \uC218", value: adminMemberMetric(data, "val_member_daily"), unit: "\uBA85", subtitle: "\uC5B4\uC81C", subvalue: adminMemberMetric(data, "val_member_daily_last") })))), /* @__PURE__ */ React.createElement("div", { className: "w-full rounded-lg border border-gray-200 bg-white shadow" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg bg-white p-4 text-center md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uB4F1\uAE09\uBCC4 \uBA64\uBC84 \uC218" }), /* @__PURE__ */ React.createElement("dl", { className: "mx-auto flex w-full flex-wrap justify-center gap-x-16 gap-y-8 p-4 text-gray-900 md:gap-x-8 md:p-8" }, roleCounts.map(renderRoleCountCard)))), /* @__PURE__ */ React.createElement("div", { className: "w-full rounded-lg border border-gray-200 bg-white shadow" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg bg-white p-4 text-center md:p-8" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uD68C\uC6D0 \uC0C1\uD0DC" }), /* @__PURE__ */ React.createElement("dl", { className: "mx-auto flex w-full flex-wrap justify-center gap-x-16 gap-y-8 p-4 text-gray-900 md:gap-x-8 md:p-8" }, statusCounts.map(renderStatusCountCard)))), /* @__PURE__ */ React.createElement("div", { className: "w-full rounded-lg border border-gray-200 bg-white shadow" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg bg-white p-4 text-center md:p-8" }, /* @__PURE__ */ React.createElement("dl", { className: "mx-auto flex w-full flex-col items-start justify-center p-4 text-gray-900" }, /* @__PURE__ */ React.createElement("ul", { className: "flex w-full flex-wrap border-b border-gray-200 text-center text-sm font-medium text-gray-500" }, /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart((data || {}).list_daily || {}, "graph_tab_daily") }, /* @__PURE__ */ React.createElement("div", { className: class_tab_inactive, id: "graph_tab_daily" }, "\uC77C")), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart((data || {}).list_monthly || {}, "graph_tab_monthly") }, /* @__PURE__ */ React.createElement("div", { className: class_tab_active, id: "graph_tab_monthly" }, "\uC6D4")), /* @__PURE__ */ React.createElement("li", { className: "me-2", onClick: () => draw_chart((data || {}).list_yearly || {}, "graph_tab_yearly") }, /* @__PURE__ */ React.createElement("div", { className: class_tab_inactive, id: "graph_tab_yearly" }, "\uB144"))), /* @__PURE__ */ React.createElement("div", { id: "div_statistics_graph", className: "h-[500px] w-full p-8" })))), /* @__PURE__ */ React.createElement("div", { className: "w-full rounded-lg border border-gray-200 bg-white shadow" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg bg-white p-4 md:p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between" }, /* @__PURE__ */ React.createElement(Div_sub_title, { title: "\uD68C\uC6D0 \uBAA9\uB85D" }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-end gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-500" }, "\uCD1D ", adminMemberFormatNumber(filteredMembers.length), "\uBA85 \uC911 ", pagedMembers.length > 0 ? `${adminMemberFormatNumber(startIdx + 1)}-${adminMemberFormatNumber(startIdx + pagedMembers.length)}` : 0, "\uBA85 \uD45C\uC2DC"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700",
      onClick: () => createOpen ? setCreateOpen(false) : beginCreate()
    },
    createOpen ? "\uCD94\uAC00 \uB2EB\uAE30" : "\uD68C\uC6D0 \uCD94\uAC00"
  ))), renderCreatePanel(), /* @__PURE__ */ React.createElement("div", { className: "mb-4 flex flex-col gap-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      className: "w-full max-w-[390px] rounded-md border border-gray-300 px-3 py-2 text-sm",
      placeholder: "\uC774\uBA54\uC77C / \uB2C9\uB124\uC784 / \uC774\uB984 \uAC80\uC0C9",
      value: search,
      onChange: (event) => setSearch(event.target.value)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "mr-1 text-xs font-semibold text-slate-600" }, "\uB4F1\uAE09"), /* @__PURE__ */ React.createElement("label", { className: "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", className: "rounded border-slate-300", checked: roleFilters.length === 0, onChange: () => setRoleFilters([]) }), /* @__PURE__ */ React.createElement("span", null, "\uC804\uCCB4")), editableRoles.map((role) => /* @__PURE__ */ React.createElement("label", { key: role, className: "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", className: "rounded border-slate-300", checked: roleFilters.includes(role), onChange: () => toggleRoleFilter(role) }), /* @__PURE__ */ React.createElement("span", null, role)))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "mr-1 text-xs font-semibold text-slate-600" }, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("label", { className: "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", className: "rounded border-slate-300", checked: statusFilters.length === 0, onChange: () => setStatusFilters([]) }), /* @__PURE__ */ React.createElement("span", null, "\uC804\uCCB4")), statusFilterOptions.map((status) => /* @__PURE__ */ React.createElement("label", { key: status.value, className: "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", className: "rounded border-slate-300", checked: statusFilters.includes(status.value), onChange: () => toggleStatusFilter(status.value) }), /* @__PURE__ */ React.createElement("span", null, status.label))))), message ? /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-blue-700" }, message) : null), /* @__PURE__ */ React.createElement("div", { className: "w-full overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "min-w-full text-left text-xs text-gray-600 md:text-sm" }, /* @__PURE__ */ React.createElement("thead", { className: "border-b bg-gray-50" }, /* @__PURE__ */ React.createElement("tr", null, renderSortHeader("No", "no"), renderSortHeader("\uAC00\uC785\uC77C", "date_joined"), renderSortHeader("\uC774\uBA54\uC77C", "email"), renderSortHeader("\uB2C9\uB124\uC784", "nickname"), renderSortHeader("\uC774\uB984", "realname"), renderSortHeader("\uB4F1\uAE09", "role"), renderSortHeader("\uB9CC\uB8CC\uC77C", "expired_at"), renderSortHeader("\uC0C1\uD0DC", "status"), renderSortHeader("\uBA54\uC77C\uC218\uC2E0", "email_subscription"), renderSortHeader("\uC131\uBCC4", "gender"), /* @__PURE__ */ React.createElement("th", { className: "px-3 py-2 text-right whitespace-nowrap" }, "\uAD00\uB9AC"))), /* @__PURE__ */ React.createElement("tbody", null, pagedMembers.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "11", className: "px-3 py-6 text-center text-gray-400" }, "\uC870\uAC74\uC5D0 \uD574\uB2F9\uD558\uB294 \uD68C\uC6D0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.")) : null, pagedMembers.map((member, idx) => {
    const rowUUID = adminMemberText(member.uuid);
    const deletedBot = adminMemberIsBot(member) && adminMemberNumber(member.is_active) === 0 && adminMemberNumber(member.blocked) === 1;
    const canDeleteBot = adminMemberIsBot(member) && !deletedBot && adminMemberNumber(member.is_staff) !== 1 && adminMemberNumber(member.is_superuser) !== 1;
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: member.uuid || member.email || idx }, /* @__PURE__ */ React.createElement("tr", { className: "border-b hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2" }, startIdx + idx + 1), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, member.date_joined), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, member.email), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, member.nickname), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, member.realname), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold " + adminMemberRoleBadgeClass(member.role) }, member.role || "-")), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, adminMemberDateOnly(member.expired_at) || "-"), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold " + adminMemberStatusBadgeClass(member) }, adminMemberStatusText(member))), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, adminMemberNumber(member.email_subscription) === 1 ? "Y" : "N"), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 whitespace-nowrap" }, member.gender || "-"), /* @__PURE__ */ React.createElement("td", { className: "px-3 py-2 text-right whitespace-nowrap" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50", disabled: deletingUUID === rowUUID, onClick: () => editingUUID === rowUUID ? setEditingUUID("") : beginEdit(member) }, editingUUID === rowUUID ? "\uB2EB\uAE30" : "\uD3B8\uC9D1"), canDeleteBot ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "ml-2 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50", disabled: deletingUUID === rowUUID, onClick: () => deleteMember(member) }, deletingUUID === rowUUID ? "\uC0AD\uC81C \uC911" : "\uC0AD\uC81C") : null, deletedBot ? /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-xs font-semibold text-slate-400" }, "\uC0AD\uC81C\uB428") : null)), renderEditor(member));
  })))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex items-center justify-between text-xs md:text-sm" }, /* @__PURE__ */ React.createElement("div", null, "\uD398\uC774\uC9C0 ", currentPage, " / ", totalPages), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { className: "rounded border px-3 py-1 disabled:opacity-50", onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: currentPage <= 1 }, "\uC774\uC804"), /* @__PURE__ */ React.createElement("button", { className: "rounded border px-3 py-1 disabled:opacity-50", onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage >= totalPages }, "\uB2E4\uC74C")))))));
}
get_main = async function() {
  const data = await fetch("/admin/ajax_get_admin_members/", { method: "POST", credentials: "same-origin" }).then((res) => res.json());
  ReactDOM.render(/* @__PURE__ */ React.createElement(AdminMembersManageMain, { data }), document.getElementById("div_main"));
};
