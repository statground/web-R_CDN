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
      sort_order: "0",
    };
  }

  function normalizeMode(value) {
    value = String(value || "list").trim();
    if (value === "write" || value === "edit") return value;
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
    lifecycleFilter: "all",
  };

  const money = (value) => (Number(value) || 0).toLocaleString("ko-KR");
  const inputClass = () => "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const buttonClass = (kind) => {
    if (kind === "secondary") return "rounded bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50";
    if (kind === "ghost") return "rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50";
    return "rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50";
  };

  function toDateInput(value) {
    if (!value) return "";
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
      sort_order: String(item.sort_order || 0),
    };
  }

  function findWorkshop(items, target) {
    const normalized = String(target || "").trim().toLowerCase();
    if (!normalized) return null;
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
      const data = await fetch("/workshop/ajax_list/").then((res) => res.json());
      if (!data.ok) {
        setState({ loading: false, error: data.error || "워크샵 목록을 불러올 수 없습니다.", workshops: [], isAdmin: !!data.is_admin });
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
          patch.error = "수정할 워크샵을 찾을 수 없습니다.";
        }
      }
      setState(patch);
    } catch (error) {
      setState({ loading: false, error: error.message || "워크샵 목록을 불러올 수 없습니다.", workshops: [] });
    }
  }

  async function saveWorkshop() {
    if (state.saving) return;
    if (!String(state.draft.title || "").trim()) {
      setState({ error: "워크샵 제목을 입력해주세요." });
      return;
    }
    setState({ saving: true, error: "" });
    try {
      const form = new URLSearchParams();
      Object.keys(state.draft).forEach((key) => form.append(key, state.draft[key] || ""));
      const data = await fetch("/workshop/ajax_admin_save/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: form.toString(),
      }).then((res) => res.json());
      if (!data.ok) {
        setState({ saving: false, error: data.error || "저장할 수 없습니다." });
        return;
      }
      window.location.href = "/workshop/";
    } catch (error) {
      setState({ saving: false, error: error.message || "저장할 수 없습니다." });
    }
  }

  async function deleteWorkshop(item) {
    const uuid = String(item && item.uuid || "").trim();
    if (!uuid || state.deletingUUID) return;
    if (!window.confirm(`"${item.title}" 워크샵을 목록에서 숨김 처리할까요?`)) return;
    setState({ deletingUUID: uuid, error: "" });
    try {
      const form = new URLSearchParams();
      form.append("uuid", uuid);
      const data = await fetch("/workshop/ajax_admin_delete/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: form.toString(),
      }).then((res) => res.json());
      if (!data.ok) {
        setState({ deletingUUID: "", error: data.error || "삭제할 수 없습니다." });
        return;
      }
      await load();
      setState({ deletingUUID: "" });
    } catch (error) {
      setState({ deletingUUID: "", error: error.message || "삭제할 수 없습니다." });
    }
  }

  function displayImageURL(value) {
    value = String(value || "").trim();
    if (!value) return "";
    if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
    return `/${value}`;
  }

  async function uploadCoverImage(file) {
    if (!file || state.uploadingImage) return;
    if (!file.type || !file.type.startsWith("image/")) {
      setState({ error: "대표 이미지는 이미지 파일만 업로드할 수 있습니다." });
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
        body: form,
      }).then((res) => res.json());
      if (data.error) {
        setState({ uploadingImage: false, error: data.error || "대표 이미지를 업로드할 수 없습니다." });
        return;
      }
      const uploadedURL = data.url_file || data.file_url || "";
      if (!uploadedURL) {
        setState({ uploadingImage: false, error: "업로드된 이미지 URL을 확인할 수 없습니다." });
        return;
      }
      state.draft = Object.assign({}, state.draft, { cover_image_url: uploadedURL });
      setState({ uploadingImage: false, error: "" });
    } catch (error) {
      setState({ uploadingImage: false, error: error.message || "대표 이미지를 업로드할 수 없습니다." });
    }
  }

  function PageHeader() {
    const title = state.mode === "write" ? "워크샵 등록" : state.mode === "edit" ? "워크샵 수정" : "워크샵";
    const subtitle = state.mode === "list" ? "워크샵" : "관리자";
    return (
      <div className="mx-auto flex w-full max-w-screen-xl flex-row items-end justify-start px-6 pt-10 text-start md:flex-col md:items-start">
        <h1 className="mb-4 mr-4 text-4xl font-extrabold leading-none tracking-normal text-gray-900 sm:text-3xl">
          <span className="underline underline-offset-3 decoration-8 decoration-blue-400">{title}</span>
        </h1>
        <p className="pb-2 text-lg font-normal text-gray-500 sm:text-base">{subtitle}</p>
      </div>
    );
  }

  function editHref(item) {
    return `/workshop/edit/?uuid=${encodeURIComponent(item.uuid || "")}`;
  }

  function displayDateTime(value) {
    if (!value) return "일정 미정";
    const text = String(value).slice(0, 16);
    if (text.endsWith(" 00:00")) return text.slice(0, 10);
    return text;
  }

  function displayDateRange(item) {
    const start = displayDateTime(item.starts_at);
    const end = displayDateTime(item.ends_at);
    if (!item.ends_at || start === end || end === "일정 미정") return start;
    return `${start} ~ ${end}`;
  }

  function statusLabel(value) {
    return ({ draft: "초안", published: "접수", closed: "마감", archived: "종료" })[value] || value || "접수";
  }

  function priceKind(item) {
    const member = Number(item.member_price) || 0;
    const nonmember = Number(item.nonmember_price) || 0;
    if (member > 0 || nonmember > 0) return "paid";
    return "free";
  }

  function priceLabel(item) {
    if (priceKind(item) === "free") return "무료";
    const prices = [Number(item.member_price) || 0, Number(item.nonmember_price) || 0].filter((value) => value > 0);
    const minPrice = prices.length ? Math.min.apply(null, prices) : 0;
    return minPrice > 0 ? `${money(minPrice)}원` : "유료";
  }

  function cardText(item) {
    return String([item.title, item.subtitle, item.summary, item.description, item.venue].join(" ")).toLowerCase();
  }

  function filteredWorkshops() {
    const search = String(state.search || "").trim().toLowerCase();
    const now = new Date();
    return (state.workshops || []).filter((item) => {
      const ended = item.status === "archived" || item.status === "closed";
      if (state.lifecycleFilter === "open" && ended) return false;
      if (state.lifecycleFilter === "ended" && !ended) return false;
      if (search && !cardText(item).includes(search)) return false;
      if (state.statusFilter && item.status !== state.statusFilter) return false;
      if (state.costFilter && priceKind(item) !== state.costFilter) return false;
      if (state.periodFilter) {
        const startsAt = item.starts_at ? new Date(String(item.starts_at).replace(" ", "T")) : null;
        const isValidDate = startsAt && !Number.isNaN(startsAt.getTime());
        if (state.periodFilter === "upcoming" && (!isValidDate || startsAt < now)) return false;
        if (state.periodFilter === "past" && (!isValidDate || startsAt >= now)) return false;
        if (state.periodFilter === "unscheduled" && isValidDate) return false;
      }
      return true;
    });
  }

  function WorkshopVisual({ item }) {
    const imageURL = displayImageURL(item.cover_image_url);
    return (
      <div className="relative flex h-72 w-full items-center justify-center overflow-hidden bg-gray-100">
        {imageURL ? (
          <img
            className="h-full w-full object-cover"
            src={imageURL}
            alt={item.title}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-center">
            <img className="mb-4 h-20 w-20 opacity-80" src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo.svg" alt="" loading="lazy" />
            <p className="px-6 text-xl font-extrabold text-gray-900">Web-R Workshop</p>
          </div>
        )}
        <div className="absolute left-0 top-0 flex flex-row gap-1 p-3">
          <span className="bg-blue-600 px-2 py-1 text-xs font-semibold text-white">{statusLabel(item.status)}</span>
          {!item.active && <span className="bg-gray-900 px-2 py-1 text-xs font-semibold text-white">숨김</span>}
        </div>
      </div>
    );
  }

  function WorkshopCard({ item }) {
    const deleting = state.deletingUUID === item.uuid;
    return (
      <article className="group flex min-h-[470px] w-full flex-col border border-gray-200 bg-white transition hover:border-blue-500">
        <WorkshopVisual item={item} />
        <div className="flex flex-1 flex-col px-5 py-5">
          <h2 className="min-h-[3.25rem] text-lg font-normal leading-7 text-gray-900">{item.title}</h2>
          {item.subtitle && <p className="mt-2 min-h-[1.25rem] truncate text-sm text-gray-600">{item.subtitle}</p>}
          {!item.subtitle && <p className="mt-2 min-h-[1.25rem] text-sm text-gray-400">{item.venue || "Web-R"}</p>}
          <div className="mt-auto flex flex-row items-end justify-between gap-3 pt-6 text-sm">
            <span className={priceKind(item) === "free" ? "font-semibold text-green-600" : "font-semibold text-red-600"}>{priceLabel(item)}</span>
            <span className="text-right text-gray-500">{displayDateRange(item)}</span>
          </div>
          <div className="mt-3 flex flex-row items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>{item.paid_count ? `${money(item.paid_count)}명 신청` : "신청 대기"}</span>
            <span>{item.venue || "온라인/별도 안내"}</span>
          </div>
          {state.isAdmin && (
            <div className="mt-4 flex flex-row justify-end gap-2 border-t border-gray-100 pt-4">
              <a className={buttonClass("ghost")} href={editHref(item)}>수정</a>
              <button type="button" disabled={deleting} className="rounded border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50" onClick={() => deleteWorkshop(item)}>
                {deleting ? "처리 중..." : "삭제"}
              </button>
            </div>
          )}
        </div>
      </article>
    );
  }

  function Field({ label, name, children }) {
    return (
      <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
        {label}
        {children || <input className={inputClass()} value={state.draft[name] || ""} onChange={(event) => updateDraft(name, event.target.value)} />}
      </label>
    );
  }

  function Select({ name, options }) {
    return (
      <select className={inputClass()} value={state.draft[name]} onChange={(event) => updateDraft(name, event.target.value)}>
        {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    );
  }

  function CoverImageField() {
    const previewURL = displayImageURL(state.draft.cover_image_url);
    return (
      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <span className="text-sm font-semibold text-gray-700">대표 이미지</span>
        {previewURL && <img className="h-44 w-full max-w-md rounded border border-gray-200 object-cover" src={previewURL} alt="대표 이미지 미리보기" />}
        <input
          type="file"
          accept="image/*"
          className={inputClass()}
          disabled={state.uploadingImage}
          onChange={(event) => {
            const file = event.target.files && event.target.files[0];
            uploadCoverImage(file);
            event.target.value = "";
          }}
        />
        <input
          className={inputClass()}
          placeholder="대표 이미지 URL"
          value={state.draft.cover_image_url || ""}
          onChange={(event) => updateDraft("cover_image_url", event.target.value)}
        />
        {state.uploadingImage && <span className="text-sm font-semibold text-blue-700">업로드 중...</span>}
      </div>
    );
  }

  function WorkshopForm() {
    return (
      <section className="mx-auto mt-8 w-full max-w-screen-lg border-y border-gray-200 px-6 py-8">
        {state.error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{state.error}</p>}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <CoverImageField />
          <Field label="제목" name="title" />
          <Field label="slug" name="slug" />
          <Field label="부제" name="subtitle" />
          <Field label="요약" name="summary" />
          <Field label="장소" name="venue" />
          <Field label="시작 일시" name="starts_at"><input type="datetime-local" className={inputClass()} value={state.draft.starts_at || ""} onChange={(event) => updateDraft("starts_at", event.target.value)} /></Field>
          <Field label="종료 일시" name="ends_at"><input type="datetime-local" className={inputClass()} value={state.draft.ends_at || ""} onChange={(event) => updateDraft("ends_at", event.target.value)} /></Field>
          <Field label="정원" name="capacity"><input type="number" min="0" className={inputClass()} value={state.draft.capacity || ""} onChange={(event) => updateDraft("capacity", event.target.value)} /></Field>
          <Field label="상태" name="status"><Select name="status" options={[["published", "접수"], ["draft", "초안"], ["closed", "마감"], ["archived", "종료"]]} /></Field>
          <Field label="등록 방식" name="registration_mode"><Select name="registration_mode" options={[["admin", "관리자 등록"], ["payment", "결제 연동"], ["closed", "닫힘"]]} /></Field>
          <Field label="회원 상품 UUID" name="member_product_uuid" />
          <Field label="비회원 상품 UUID" name="nonmember_product_uuid" />
          <Field label="정렬" name="sort_order"><input type="number" className={inputClass()} value={state.draft.sort_order || "0"} onChange={(event) => updateDraft("sort_order", event.target.value)} /></Field>
          <Field label="노출" name="active"><Select name="active" options={[["1", "노출"], ["0", "숨김"]]} /></Field>
          <label className="col-span-2 flex flex-col gap-1 text-sm font-semibold text-gray-700 md:col-span-1">
            상세 설명
            <textarea className={inputClass() + " min-h-[130px]"} value={state.draft.description || ""} onChange={(event) => updateDraft("description", event.target.value)} />
          </label>
        </div>
        <div className="mt-5 flex flex-row justify-end gap-3">
          <a className={buttonClass("ghost")} href={state.mode === "edit" ? "/workshop/edit/" : "/workshop/"}>취소</a>
          <button type="button" disabled={state.saving || state.uploadingImage} className={buttonClass()} onClick={saveWorkshop}>{state.saving ? "저장 중..." : "저장"}</button>
        </div>
      </section>
    );
  }

  function EditChooser() {
    return (
      <section className="mx-auto w-full max-w-screen-lg px-6 py-8">
        {state.error && <div className="mb-5 border-y border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</div>}
        {state.workshops.length === 0 ? (
          <div className="border-y border-gray-200 py-12 text-center text-gray-500">수정할 워크샵이 없습니다.</div>
        ) : (
          state.workshops.map((item) => (
            <article className="flex flex-row items-center justify-between gap-4 border-b border-gray-200 py-5 md:flex-col md:items-start" key={item.uuid}>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">{item.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{item.slug || item.uuid}</p>
              </div>
              <a className={buttonClass("ghost")} href={editHref(item)}>수정</a>
            </article>
          ))
        )}
      </section>
    );
  }

  function AdminToolbar() {
    if (!state.isAdmin) return null;
    return (
      <div className="flex flex-row items-center gap-2 md:w-full md:justify-start">
        <span className="border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">관리 모드</span>
        <a className={buttonClass()} href="/workshop/write/">워크샵 등록</a>
      </div>
    );
  }

  function SearchFilters() {
    const lifecycleOptions = [
      ["all", "전체"],
      ["open", "진행중/예정"],
      ["ended", "종료"],
    ];
    return (
      <section className="mx-auto mt-6 w-full max-w-screen-xl px-6">
        <div className="border border-gray-200 bg-gray-50 px-8 py-7 md:px-4">
          <div className="mb-5 flex flex-row items-center justify-between gap-4 md:flex-col md:items-start">
            <h2 className="text-base font-semibold text-gray-800">상세검색</h2>
            <div className="flex flex-row flex-wrap items-center gap-2 text-sm text-gray-700">
              {lifecycleOptions.map(([value, label]) => (
                <label key={value} className={(state.lifecycleFilter === value ? "border-blue-500 bg-white text-blue-700" : "border-gray-200 bg-white text-gray-600") + " flex cursor-pointer flex-row items-center gap-2 border px-3 py-2"}>
                  <input
                    type="radio"
                    name="workshop_lifecycle_filter"
                    value={value}
                    checked={state.lifecycleFilter === value}
                    onChange={(event) => updateFilter("lifecycleFilter", event.target.value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 md:grid-cols-1">
            <input
              className={inputClass()}
              placeholder="검색어"
              value={state.search}
              onChange={(event) => updateFilter("search", event.target.value)}
            />
            <select className={inputClass()} value={state.statusFilter} onChange={(event) => updateFilter("statusFilter", event.target.value)}>
              <option value="">상태</option>
              <option value="published">접수</option>
              <option value="closed">마감</option>
              <option value="archived">종료</option>
              <option value="draft">초안</option>
            </select>
            <select className={inputClass()} value={state.costFilter} onChange={(event) => updateFilter("costFilter", event.target.value)}>
              <option value="">시간/비용</option>
              <option value="free">무료</option>
              <option value="paid">유료</option>
            </select>
            <select className={inputClass()} value={state.periodFilter} onChange={(event) => updateFilter("periodFilter", event.target.value)}>
              <option value="">이벤트기간</option>
              <option value="upcoming">예정</option>
              <option value="past">지난 일정</option>
              <option value="unscheduled">일정 미정</option>
            </select>
          </div>
        </div>
      </section>
    );
  }

  function ListPage() {
    const items = filteredWorkshops();
    return (
      <div className="w-full">
        <PageHeader />
        <section className="mx-auto flex w-full max-w-screen-xl flex-row items-center justify-between gap-4 px-6 pt-8 md:flex-col md:items-start">
          <p className="text-xl font-normal text-gray-900">{items.length}개의 워크샵이 검색되었습니다.</p>
          <AdminToolbar />
        </section>
        <SearchFilters />
        <section className="mx-auto w-full max-w-screen-xl px-6 py-8">
          {state.error && <div className="mb-5 border-y border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</div>}
          {items.length === 0 ? (
            <div className="border-y border-gray-200 py-12 text-center text-gray-500">등록된 워크샵이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-4 gap-x-6 gap-y-8 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
              {items.map((item) => <WorkshopCard key={item.uuid} item={item} />)}
            </div>
          )}
        </section>
      </div>
    );
  }

  function FormPage() {
    const missingEditTarget = state.mode === "edit" && !state.editTarget;
    const failedEditTarget = state.mode === "edit" && state.editTarget && !state.draft.uuid;
    return (
      <div className="w-full">
        <PageHeader />
        {missingEditTarget || failedEditTarget ? <EditChooser /> : <WorkshopForm />}
      </div>
    );
  }

  function Main() {
    if (state.loading) {
      return <><PageHeader /><div className="mx-auto flex w-full max-w-screen-lg justify-center px-6 py-16 text-gray-500">불러오는 중입니다.</div></>;
    }
    if (state.mode === "write" || state.mode === "edit") return <FormPage />;
    return <ListPage />;
  }

  function render() {
    const root = document.getElementById("div_main");
    if (root) ReactDOM.render(<Main />, root);
  }

  return { load };
})();

function set_main() {
  WorkshopCatalogPage.load();
}
