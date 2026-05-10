const WorkshopCatalogPage = (() => {
  const globals = window.__webr_globals__ || {};
  const query = new URLSearchParams(window.location.search || "");
  function emptyDraft() {
    return {
      uuid: "",
      slug: "",
      title: "",
      subtitle: "",
      summary: "",
      description: "",
      cover_image_url: "",
      venue: "",
      starts_at: "",
      ends_at: "",
      capacity: "",
      status: "published",
      registration_mode: "admin",
      member_product_uuid: "",
      nonmember_product_uuid: "",
      active: "1",
      sort_order: "0"
    };
  }
  function normalizeMode(value) {
    value = String(value || "list").trim();
    if (value === "write" || value === "edit")
      return value;
    return "list";
  }
  function initialEditTarget() {
    return String(query.get("uuid") || query.get("slug") || globals.workshop_uuid || globals.orderID || "").trim();
  }
  let state = {
    loading: true,
    saving: false,
    uploadingImage: false,
    deletingUUID: "",
    error: "",
    isAdmin: false,
    workshops: [],
    draft: emptyDraft(),
    mode: normalizeMode(globals.mode),
    editTarget: initialEditTarget(),
    search: "",
    statusFilter: "",
    costFilter: "",
    periodFilter: "",
    lifecycleFilter: "all"
  };
  const money = (value) => (Number(value) || 0).toLocaleString("ko-KR");
  const inputClass = () => "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const buttonClass = (kind) => {
    if (kind === "secondary")
      return "rounded bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50";
    if (kind === "ghost")
      return "rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50";
    return "rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50";
  };
  function toDateInput(value) {
    if (!value)
      return "";
    return String(value).replace(" ", "T").slice(0, 16);
  }
  function fromWorkshop(item) {
    return {
      uuid: item.uuid || "",
      slug: item.slug || "",
      title: item.title || "",
      subtitle: item.subtitle || "",
      summary: item.summary || "",
      description: item.description || "",
      cover_image_url: item.cover_image_url || "",
      venue: item.venue || "",
      starts_at: toDateInput(item.starts_at),
      ends_at: toDateInput(item.ends_at),
      capacity: item.capacity ? String(item.capacity) : "",
      status: item.status || "published",
      registration_mode: item.registration_mode || "admin",
      member_product_uuid: item.member_product_uuid || "",
      nonmember_product_uuid: item.nonmember_product_uuid || "",
      active: item.active ? "1" : "0",
      sort_order: String(item.sort_order || 0)
    };
  }
  function findWorkshop(items, target) {
    const normalized = String(target || "").trim().toLowerCase();
    if (!normalized)
      return null;
    return (items || []).find((item) => {
      return String(item.uuid || "").toLowerCase() === normalized || String(item.slug || "").toLowerCase() === normalized;
    }) || null;
  }
  function setState(patch) {
    state = Object.assign({}, state, patch);
    render();
  }
  function updateDraft(name, value) {
    state.draft = Object.assign({}, state.draft, { [name]: value });
    render();
  }
  function updateFilter(name, value) {
    state = Object.assign({}, state, { [name]: value });
    render();
  }
  async function load() {
    setState({ loading: true, error: "" });
    try {
      const data = await fetch("/workshop/ajax_list/", { method: "POST" }).then((res) => res.json());
      if (!data.ok) {
        setState({ loading: false, error: data.error || "\uC6CC\uD06C\uC0F5 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", workshops: [], isAdmin: !!data.is_admin });
        return;
      }
      const workshops = data.workshops || [];
      const patch = { loading: false, workshops, isAdmin: !!data.is_admin, error: "" };
      if (state.mode === "write") {
        patch.draft = emptyDraft();
      }
      if (state.mode === "edit" && state.editTarget) {
        const item = findWorkshop(workshops, state.editTarget);
        if (item) {
          patch.draft = fromWorkshop(item);
        } else {
          patch.draft = emptyDraft();
          patch.error = "\uC218\uC815\uD560 \uC6CC\uD06C\uC0F5\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.";
        }
      }
      setState(patch);
    } catch (error) {
      setState({ loading: false, error: error.message || "\uC6CC\uD06C\uC0F5 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", workshops: [] });
    }
  }
  async function saveWorkshop() {
    if (state.saving)
      return;
    if (!String(state.draft.title || "").trim()) {
      setState({ error: "\uC6CC\uD06C\uC0F5 \uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694." });
      return;
    }
    setState({ saving: true, error: "" });
    try {
      const form = new URLSearchParams();
      Object.keys(state.draft).forEach((key) => form.append(key, state.draft[key] || ""));
      const data = await fetch("/workshop/ajax_admin_save/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: form.toString()
      }).then((res) => res.json());
      if (!data.ok) {
        setState({ saving: false, error: data.error || "\uC800\uC7A5\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." });
        return;
      }
      window.location.href = "/workshop/";
    } catch (error) {
      setState({ saving: false, error: error.message || "\uC800\uC7A5\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." });
    }
  }
  async function deleteWorkshop(item) {
    const uuid = String(item && item.uuid || "").trim();
    if (!uuid || state.deletingUUID)
      return;
    if (!window.confirm(`"${item.title}" \uC6CC\uD06C\uC0F5\uC744 \uBAA9\uB85D\uC5D0\uC11C \uC228\uAE40 \uCC98\uB9AC\uD560\uAE4C\uC694?`))
      return;
    setState({ deletingUUID: uuid, error: "" });
    try {
      const form = new URLSearchParams();
      form.append("uuid", uuid);
      const data = await fetch("/workshop/ajax_admin_delete/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: form.toString()
      }).then((res) => res.json());
      if (!data.ok) {
        setState({ deletingUUID: "", error: data.error || "\uC0AD\uC81C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." });
        return;
      }
      await load();
      setState({ deletingUUID: "" });
    } catch (error) {
      setState({ deletingUUID: "", error: error.message || "\uC0AD\uC81C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." });
    }
  }
  function displayImageURL(value) {
    value = String(value || "").trim();
    if (!value)
      return "";
    if (/^https?:\/\//i.test(value) || value.startsWith("/"))
      return value;
    return `/${value}`;
  }
  async function uploadCoverImage(file) {
    if (!file || state.uploadingImage)
      return;
    if (!file.type || !file.type.startsWith("image/")) {
      setState({ error: "\uB300\uD45C \uC774\uBBF8\uC9C0\uB294 \uC774\uBBF8\uC9C0 \uD30C\uC77C\uB9CC \uC5C5\uB85C\uB4DC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." });
      return;
    }
    setState({ uploadingImage: true, error: "" });
    try {
      const form = new FormData();
      form.append("file_input", file);
      form.append("host", window.location.href);
      form.append("note", "workshop_cover_image");
      form.append("active", "1");
      const data = await fetch("/blank/ajax_file_upload/", {
        method: "POST",
        body: form
      }).then((res) => res.json());
      if (data.error) {
        setState({ uploadingImage: false, error: data.error || "\uB300\uD45C \uC774\uBBF8\uC9C0\uB97C \uC5C5\uB85C\uB4DC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." });
        return;
      }
      const uploadedURL = data.url_file || data.file_url || "";
      if (!uploadedURL) {
        setState({ uploadingImage: false, error: "\uC5C5\uB85C\uB4DC\uB41C \uC774\uBBF8\uC9C0 URL\uC744 \uD655\uC778\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." });
        return;
      }
      state.draft = Object.assign({}, state.draft, { cover_image_url: uploadedURL });
      setState({ uploadingImage: false, error: "" });
    } catch (error) {
      setState({ uploadingImage: false, error: error.message || "\uB300\uD45C \uC774\uBBF8\uC9C0\uB97C \uC5C5\uB85C\uB4DC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." });
    }
  }
  function PageHeader() {
    const title = state.mode === "write" ? "\uC6CC\uD06C\uC0F5 \uB4F1\uB85D" : state.mode === "edit" ? "\uC6CC\uD06C\uC0F5 \uC218\uC815" : "\uC6CC\uD06C\uC0F5";
    const subtitle = state.mode === "list" ? "\uC6CC\uD06C\uC0F5" : "\uAD00\uB9AC\uC790";
    return /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-screen-xl flex-col items-start justify-start px-6 pt-10 text-start md:flex-row md:items-end" }, /* @__PURE__ */ React.createElement("h1", { className: "mb-4 mr-4 text-4xl font-extrabold leading-none tracking-normal text-gray-900 sm:text-3xl" }, /* @__PURE__ */ React.createElement("span", { className: "underline underline-offset-3 decoration-8 decoration-blue-400" }, title)), /* @__PURE__ */ React.createElement("p", { className: "pb-2 text-lg font-normal text-gray-500 sm:text-base" }, subtitle));
  }
  function editHref(item) {
    return `/workshop/edit/${encodeURIComponent(item.uuid || "")}/`;
  }
  function displayDateTime(value) {
    if (!value)
      return "\uC77C\uC815 \uBBF8\uC815";
    const text = String(value).slice(0, 16);
    if (text.endsWith(" 00:00"))
      return text.slice(0, 10);
    return text;
  }
  function displayDateRange(item) {
    const start = displayDateTime(item.starts_at);
    const end = displayDateTime(item.ends_at);
    if (!item.ends_at || start === end || end === "\uC77C\uC815 \uBBF8\uC815")
      return start;
    return `${start} ~ ${end}`;
  }
  function statusLabel(value) {
    return { draft: "\uCD08\uC548", published: "\uC811\uC218", closed: "\uB9C8\uAC10", archived: "\uC885\uB8CC" }[value] || value || "\uC811\uC218";
  }
  function priceKind(item) {
    const member = Number(item.member_price) || 0;
    const nonmember = Number(item.nonmember_price) || 0;
    if (member > 0 || nonmember > 0)
      return "paid";
    return "free";
  }
  function priceLabel(item) {
    if (priceKind(item) === "free")
      return "\uBB34\uB8CC";
    const prices = [Number(item.member_price) || 0, Number(item.nonmember_price) || 0].filter((value) => value > 0);
    const minPrice = prices.length ? Math.min.apply(null, prices) : 0;
    return minPrice > 0 ? `${money(minPrice)}\uC6D0` : "\uC720\uB8CC";
  }
  function cardText(item) {
    return String([item.title, item.subtitle, item.summary, item.description, item.venue].join(" ")).toLowerCase();
  }
  function filteredWorkshops() {
    const search = String(state.search || "").trim().toLowerCase();
    const now = /* @__PURE__ */ new Date();
    return (state.workshops || []).filter((item) => {
      const ended = item.status === "archived" || item.status === "closed";
      if (state.lifecycleFilter === "open" && ended)
        return false;
      if (state.lifecycleFilter === "ended" && !ended)
        return false;
      if (search && !cardText(item).includes(search))
        return false;
      if (state.statusFilter && item.status !== state.statusFilter)
        return false;
      if (state.costFilter && priceKind(item) !== state.costFilter)
        return false;
      if (state.periodFilter) {
        const startsAt = item.starts_at ? new Date(String(item.starts_at).replace(" ", "T")) : null;
        const isValidDate = startsAt && !Number.isNaN(startsAt.getTime());
        if (state.periodFilter === "upcoming" && (!isValidDate || startsAt < now))
          return false;
        if (state.periodFilter === "past" && (!isValidDate || startsAt >= now))
          return false;
        if (state.periodFilter === "unscheduled" && isValidDate)
          return false;
      }
      return true;
    });
  }
  function WorkshopVisual({ item }) {
    const imageURL = displayImageURL(item.cover_image_url);
    return /* @__PURE__ */ React.createElement("div", { className: "relative flex h-72 w-full items-center justify-center overflow-hidden bg-gray-100" }, imageURL ? /* @__PURE__ */ React.createElement(
      "img",
      {
        className: "h-full w-full object-cover",
        src: imageURL,
        alt: item.title,
        loading: "lazy"
      }
    ) : /* @__PURE__ */ React.createElement("div", { className: "flex h-full w-full flex-col items-center justify-center bg-gray-50 text-center" }, /* @__PURE__ */ React.createElement("img", { className: "mb-4 h-20 w-20 opacity-80", src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/R_logo.svg", alt: "", loading: "lazy" }), /* @__PURE__ */ React.createElement("p", { className: "px-6 text-xl font-extrabold text-gray-900" }, "Web-R Workshop")), /* @__PURE__ */ React.createElement("div", { className: "absolute left-0 top-0 flex flex-row gap-1 p-3" }, /* @__PURE__ */ React.createElement("span", { className: "bg-blue-600 px-2 py-1 text-xs font-semibold text-white" }, statusLabel(item.status)), !item.active && /* @__PURE__ */ React.createElement("span", { className: "bg-gray-900 px-2 py-1 text-xs font-semibold text-white" }, "\uC228\uAE40")));
  }
  function WorkshopCard({ item }) {
    const deleting = state.deletingUUID === item.uuid;
    return /* @__PURE__ */ React.createElement("article", { className: "group flex min-h-[470px] w-full flex-col border border-gray-200 bg-white transition hover:border-blue-500" }, /* @__PURE__ */ React.createElement(WorkshopVisual, { item }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-1 flex-col px-5 py-5" }, /* @__PURE__ */ React.createElement("h2", { className: "min-h-[3.25rem] text-lg font-normal leading-7 text-gray-900" }, item.title), item.subtitle && /* @__PURE__ */ React.createElement("p", { className: "mt-2 min-h-[1.25rem] truncate text-sm text-gray-600" }, item.subtitle), !item.subtitle && /* @__PURE__ */ React.createElement("p", { className: "mt-2 min-h-[1.25rem] text-sm text-gray-400" }, item.venue || "Web-R"), /* @__PURE__ */ React.createElement("div", { className: "mt-auto flex flex-row items-end justify-between gap-3 pt-6 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: priceKind(item) === "free" ? "font-semibold text-green-600" : "font-semibold text-red-600" }, priceLabel(item)), /* @__PURE__ */ React.createElement("span", { className: "text-right text-gray-500" }, displayDateRange(item))), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex flex-row items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500" }, /* @__PURE__ */ React.createElement("span", null, item.paid_count ? `${money(item.paid_count)}\uBA85 \uC2E0\uCCAD` : "\uC2E0\uCCAD \uB300\uAE30"), /* @__PURE__ */ React.createElement("span", null, item.venue || "\uC628\uB77C\uC778/\uBCC4\uB3C4 \uC548\uB0B4")), state.isAdmin && /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex flex-row justify-end gap-2 border-t border-gray-100 pt-4" }, /* @__PURE__ */ React.createElement("a", { className: buttonClass("ghost"), href: editHref(item) }, "\uC218\uC815"), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: deleting, className: "rounded border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50", onClick: () => deleteWorkshop(item) }, deleting ? "\uCC98\uB9AC \uC911..." : "\uC0AD\uC81C"))));
  }
  function Field({ label, name, children }) {
    return /* @__PURE__ */ React.createElement("label", { className: "flex flex-col gap-1 text-sm font-semibold text-gray-700" }, label, children || /* @__PURE__ */ React.createElement("input", { className: inputClass(), value: state.draft[name] || "", onChange: (event) => updateDraft(name, event.target.value) }));
  }
  function Select({ name, options }) {
    return /* @__PURE__ */ React.createElement("select", { className: inputClass(), value: state.draft[name], onChange: (event) => updateDraft(name, event.target.value) }, options.map(([value, label]) => /* @__PURE__ */ React.createElement("option", { key: value, value }, label)));
  }
  function CoverImageField() {
    const previewURL = displayImageURL(state.draft.cover_image_url);
    return /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2 flex flex-col gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-gray-700" }, "\uB300\uD45C \uC774\uBBF8\uC9C0"), previewURL && /* @__PURE__ */ React.createElement("img", { className: "h-44 w-full max-w-md rounded border border-gray-200 object-cover", src: previewURL, alt: "\uB300\uD45C \uC774\uBBF8\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30" }), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "file",
        accept: "image/*",
        className: inputClass(),
        disabled: state.uploadingImage,
        onChange: (event) => {
          const file = event.target.files && event.target.files[0];
          uploadCoverImage(file);
          event.target.value = "";
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: inputClass(),
        placeholder: "\uB300\uD45C \uC774\uBBF8\uC9C0 URL",
        value: state.draft.cover_image_url || "",
        onChange: (event) => updateDraft("cover_image_url", event.target.value)
      }
    ), state.uploadingImage && /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-blue-700" }, "\uC5C5\uB85C\uB4DC \uC911..."));
  }
  function WorkshopForm() {
    return /* @__PURE__ */ React.createElement("section", { className: "mx-auto mt-8 w-full max-w-screen-lg border-y border-gray-200 px-6 py-8" }, state.error && /* @__PURE__ */ React.createElement("p", { className: "mb-4 rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" }, state.error), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2" }, /* @__PURE__ */ React.createElement(CoverImageField, null), /* @__PURE__ */ React.createElement(Field, { label: "\uC81C\uBAA9", name: "title" }), /* @__PURE__ */ React.createElement(Field, { label: "slug", name: "slug" }), /* @__PURE__ */ React.createElement(Field, { label: "\uBD80\uC81C", name: "subtitle" }), /* @__PURE__ */ React.createElement(Field, { label: "\uC694\uC57D", name: "summary" }), /* @__PURE__ */ React.createElement(Field, { label: "\uC7A5\uC18C", name: "venue" }), /* @__PURE__ */ React.createElement(Field, { label: "\uC2DC\uC791 \uC77C\uC2DC", name: "starts_at" }, /* @__PURE__ */ React.createElement("input", { type: "datetime-local", className: inputClass(), value: state.draft.starts_at || "", onChange: (event) => updateDraft("starts_at", event.target.value) })), /* @__PURE__ */ React.createElement(Field, { label: "\uC885\uB8CC \uC77C\uC2DC", name: "ends_at" }, /* @__PURE__ */ React.createElement("input", { type: "datetime-local", className: inputClass(), value: state.draft.ends_at || "", onChange: (event) => updateDraft("ends_at", event.target.value) })), /* @__PURE__ */ React.createElement(Field, { label: "\uC815\uC6D0", name: "capacity" }, /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", className: inputClass(), value: state.draft.capacity || "", onChange: (event) => updateDraft("capacity", event.target.value) })), /* @__PURE__ */ React.createElement(Field, { label: "\uC0C1\uD0DC", name: "status" }, /* @__PURE__ */ React.createElement(Select, { name: "status", options: [["published", "\uC811\uC218"], ["draft", "\uCD08\uC548"], ["closed", "\uB9C8\uAC10"], ["archived", "\uC885\uB8CC"]] })), /* @__PURE__ */ React.createElement(Field, { label: "\uB4F1\uB85D \uBC29\uC2DD", name: "registration_mode" }, /* @__PURE__ */ React.createElement(Select, { name: "registration_mode", options: [["admin", "\uAD00\uB9AC\uC790 \uB4F1\uB85D"], ["payment", "\uACB0\uC81C \uC5F0\uB3D9"], ["closed", "\uB2EB\uD798"]] })), /* @__PURE__ */ React.createElement(Field, { label: "\uD68C\uC6D0 \uC0C1\uD488 UUID", name: "member_product_uuid" }), /* @__PURE__ */ React.createElement(Field, { label: "\uBE44\uD68C\uC6D0 \uC0C1\uD488 UUID", name: "nonmember_product_uuid" }), /* @__PURE__ */ React.createElement(Field, { label: "\uC815\uB82C", name: "sort_order" }, /* @__PURE__ */ React.createElement("input", { type: "number", className: inputClass(), value: state.draft.sort_order || "0", onChange: (event) => updateDraft("sort_order", event.target.value) })), /* @__PURE__ */ React.createElement(Field, { label: "\uB178\uCD9C", name: "active" }, /* @__PURE__ */ React.createElement(Select, { name: "active", options: [["1", "\uB178\uCD9C"], ["0", "\uC228\uAE40"]] })), /* @__PURE__ */ React.createElement("label", { className: "md:col-span-2 flex flex-col gap-1 text-sm font-semibold text-gray-700" }, "\uC0C1\uC138 \uC124\uBA85", /* @__PURE__ */ React.createElement("textarea", { className: inputClass() + " min-h-[130px]", value: state.draft.description || "", onChange: (event) => updateDraft("description", event.target.value) }))), /* @__PURE__ */ React.createElement("div", { className: "mt-5 flex flex-row justify-end gap-3" }, /* @__PURE__ */ React.createElement("a", { className: buttonClass("ghost"), href: state.mode === "edit" ? "/workshop/edit/" : "/workshop/" }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: state.saving || state.uploadingImage, className: buttonClass(), onClick: saveWorkshop }, state.saving ? "\uC800\uC7A5 \uC911..." : "\uC800\uC7A5")));
  }
  function EditChooser() {
    return /* @__PURE__ */ React.createElement("section", { className: "mx-auto w-full max-w-screen-lg px-6 py-8" }, state.error && /* @__PURE__ */ React.createElement("div", { className: "mb-5 border-y border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" }, state.error), state.workshops.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "border-y border-gray-200 py-12 text-center text-gray-500" }, "\uC218\uC815\uD560 \uC6CC\uD06C\uC0F5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : state.workshops.map((item) => /* @__PURE__ */ React.createElement("article", { className: "flex flex-col items-start gap-4 border-b border-gray-200 py-5 md:flex-row md:items-center md:justify-between", key: item.uuid }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-extrabold text-gray-900" }, item.title), /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-sm text-gray-500" }, item.slug || item.uuid)), /* @__PURE__ */ React.createElement("a", { className: buttonClass("ghost"), href: editHref(item) }, "\uC218\uC815"))));
  }
  function AdminToolbar() {
    if (!state.isAdmin)
      return null;
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-row items-center gap-2 md:w-full md:justify-start" }, /* @__PURE__ */ React.createElement("span", { className: "border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700" }, "\uAD00\uB9AC \uBAA8\uB4DC"), /* @__PURE__ */ React.createElement("a", { className: buttonClass(), href: "/workshop/write/" }, "\uC6CC\uD06C\uC0F5 \uB4F1\uB85D"));
  }
  function SearchFilters() {
    const lifecycleOptions = [
      ["all", "\uC804\uCCB4"],
      ["open", "\uC9C4\uD589\uC911/\uC608\uC815"],
      ["ended", "\uC885\uB8CC"]
    ];
    return /* @__PURE__ */ React.createElement("section", { className: "mx-auto mt-6 w-full max-w-screen-xl px-6" }, /* @__PURE__ */ React.createElement("div", { className: "border border-gray-200 bg-gray-50 px-8 py-7 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "mb-5 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between" }, /* @__PURE__ */ React.createElement("h2", { className: "text-base font-semibold text-gray-800" }, "\uC0C1\uC138\uAC80\uC0C9"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-row flex-wrap items-center gap-2 text-sm text-gray-700" }, lifecycleOptions.map(([value, label]) => /* @__PURE__ */ React.createElement("label", { key: value, className: (state.lifecycleFilter === value ? "border-blue-500 bg-white text-blue-700" : "border-gray-200 bg-white text-gray-600") + " flex cursor-pointer flex-row items-center gap-2 border px-3 py-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "radio",
        name: "workshop_lifecycle_filter",
        value,
        checked: state.lifecycleFilter === value,
        onChange: (event) => updateFilter("lifecycleFilter", event.target.value)
      }
    ), label)))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: inputClass(),
        placeholder: "\uAC80\uC0C9\uC5B4",
        value: state.search,
        onChange: (event) => updateFilter("search", event.target.value)
      }
    ), /* @__PURE__ */ React.createElement("select", { className: inputClass(), value: state.statusFilter, onChange: (event) => updateFilter("statusFilter", event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("option", { value: "published" }, "\uC811\uC218"), /* @__PURE__ */ React.createElement("option", { value: "closed" }, "\uB9C8\uAC10"), /* @__PURE__ */ React.createElement("option", { value: "archived" }, "\uC885\uB8CC"), /* @__PURE__ */ React.createElement("option", { value: "draft" }, "\uCD08\uC548")), /* @__PURE__ */ React.createElement("select", { className: inputClass(), value: state.costFilter, onChange: (event) => updateFilter("costFilter", event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\uC2DC\uAC04/\uBE44\uC6A9"), /* @__PURE__ */ React.createElement("option", { value: "free" }, "\uBB34\uB8CC"), /* @__PURE__ */ React.createElement("option", { value: "paid" }, "\uC720\uB8CC")), /* @__PURE__ */ React.createElement("select", { className: inputClass(), value: state.periodFilter, onChange: (event) => updateFilter("periodFilter", event.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\uC774\uBCA4\uD2B8\uAE30\uAC04"), /* @__PURE__ */ React.createElement("option", { value: "upcoming" }, "\uC608\uC815"), /* @__PURE__ */ React.createElement("option", { value: "past" }, "\uC9C0\uB09C \uC77C\uC815"), /* @__PURE__ */ React.createElement("option", { value: "unscheduled" }, "\uC77C\uC815 \uBBF8\uC815")))));
  }
  function ListPage() {
    const items = filteredWorkshops();
    return /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement(PageHeader, null), /* @__PURE__ */ React.createElement("section", { className: "mx-auto flex w-full max-w-screen-xl flex-col items-start gap-4 px-6 pt-8 md:flex-row md:items-center md:justify-between" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl font-normal text-gray-900" }, items.length, "\uAC1C\uC758 \uC6CC\uD06C\uC0F5\uC774 \uAC80\uC0C9\uB418\uC5C8\uC2B5\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement(AdminToolbar, null)), /* @__PURE__ */ React.createElement(SearchFilters, null), /* @__PURE__ */ React.createElement("section", { className: "mx-auto w-full max-w-screen-xl px-6 py-8" }, state.error && /* @__PURE__ */ React.createElement("div", { className: "mb-5 border-y border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" }, state.error), items.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "border-y border-gray-200 py-12 text-center text-gray-500" }, "\uB4F1\uB85D\uB41C \uC6CC\uD06C\uC0F5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" }, items.map((item) => /* @__PURE__ */ React.createElement(WorkshopCard, { key: item.uuid, item })))));
  }
  function FormPage() {
    const missingEditTarget = state.mode === "edit" && !state.editTarget;
    const failedEditTarget = state.mode === "edit" && state.editTarget && !state.draft.uuid;
    return /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement(PageHeader, null), missingEditTarget || failedEditTarget ? /* @__PURE__ */ React.createElement(EditChooser, null) : /* @__PURE__ */ React.createElement(WorkshopForm, null));
  }
  function Main() {
    if (state.loading) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PageHeader, null), /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-screen-lg justify-center px-6 py-16 text-gray-500" }, "\uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4."));
    }
    if (state.mode === "write" || state.mode === "edit")
      return /* @__PURE__ */ React.createElement(FormPage, null);
    return /* @__PURE__ */ React.createElement(ListPage, null);
  }
  function render() {
    const root = document.getElementById("div_main");
    if (root)
      ReactDOM.render(/* @__PURE__ */ React.createElement(Main, null), root);
  }
  return { load };
})();
function set_main() {
  WorkshopCatalogPage.load();
}
