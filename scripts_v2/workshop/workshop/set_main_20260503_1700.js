const WorkshopCatalogPage = (() => {
  let state = {
    loading: true,
    saving: false,
    error: "",
    isAdmin: false,
    workshops: [],
    draft: emptyDraft(),
  };

  const money = (value) => (Number(value) || 0).toLocaleString("ko-KR");

  function emptyDraft() {
    return {
      uuid: "",
      slug: "",
      title: "",
      subtitle: "",
      summary: "",
      description: "",
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

  function setState(patch) {
    state = Object.assign({}, state, patch);
    render();
  }

  function inputClass() {
    return "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  }

  function buttonClass(kind) {
    if (kind === "secondary") return "rounded bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50";
    if (kind === "ghost") return "rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50";
    return "rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50";
  }

  function PageHeader() {
    return (
      <div className="mx-auto flex w-full max-w-screen-lg flex-col px-6 pt-10">
        <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">워크샵</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
          Web-R에서 진행한 워크샵과 등록 현황을 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  function Loading() {
    return (
      <div className="mx-auto flex w-full max-w-screen-lg justify-center px-6 py-16 text-gray-500">
        불러오는 중입니다.
      </div>
    );
  }

  function PriceLine({ label, title, price }) {
    if (!title && !price) return null;
    return (
      <div className="flex flex-row justify-between gap-4 border-t border-gray-100 py-2 text-sm">
        <span className="font-semibold text-gray-600">{label}</span>
        <span className="text-right text-gray-900">{title || "-"} {price ? `· ${money(price)}원` : ""}</span>
      </div>
    );
  }

  function WorkshopCard({ item }) {
    const dateText = item.starts_at ? item.starts_at.slice(0, 16) : "일정 미정";
    const statusMap = { draft: "초안", published: "접수", closed: "마감", archived: "종료" };
    return (
      <article className="flex w-full flex-col border-b border-gray-200 py-8">
        <div className="flex flex-row items-start justify-between gap-6 md:flex-col">
          <div className="min-w-0">
            <div className="mb-3 flex flex-row flex-wrap items-center gap-2">
              <span className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{statusMap[item.status] || item.status}</span>
              {!item.active && <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">숨김</span>}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 md:text-xl">{item.title}</h2>
            {item.subtitle && <p className="mt-2 text-base font-semibold text-gray-700">{item.subtitle}</p>}
            {item.summary && <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600">{item.summary}</p>}
            {item.description && <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-gray-600">{item.description}</p>}
          </div>
          {state.isAdmin && (
            <button type="button" className={buttonClass("ghost")} onClick={() => setState({ draft: fromWorkshop(item) })}>
              수정
            </button>
          )}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm md:grid-cols-1">
          <div>
            <p className="font-semibold text-gray-500">일시</p>
            <p className="mt-1 text-gray-900">{dateText}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">장소</p>
            <p className="mt-1 text-gray-900">{item.venue || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">등록</p>
            <p className="mt-1 text-gray-900">{money(item.paid_count)}명 / {money(item.paid_amount)}원</p>
          </div>
        </div>
        <div className="mt-5 max-w-3xl">
          <PriceLine label="회원" title={item.member_product_title} price={item.member_price} />
          <PriceLine label="비회원" title={item.nonmember_product_title} price={item.nonmember_price} />
        </div>
      </article>
    );
  }

  function AdminField({ label, name, children }) {
    return (
      <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
        {label}
        {children || <input className={inputClass()} value={state.draft[name] || ""} onChange={(event) => updateDraft(name, event.target.value)} />}
      </label>
    );
  }

  function updateDraft(name, value) {
    state.draft = Object.assign({}, state.draft, { [name]: value });
    render();
  }

  async function saveWorkshop() {
    if (state.saving) return;
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
      await load();
      setState({ saving: false, draft: emptyDraft() });
    } catch (error) {
      setState({ saving: false, error: error.message || "저장할 수 없습니다." });
    }
  }

  function AdminForm() {
    if (!state.isAdmin) return null;
    return (
      <section className="mx-auto mt-8 w-full max-w-screen-lg border-y border-gray-200 px-6 py-8">
        <div className="mb-5 flex flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-gray-900">워크샵 등록</h2>
          <button type="button" className={buttonClass("ghost")} onClick={() => setState({ draft: emptyDraft(), error: "" })}>새 워크샵</button>
        </div>
        {state.error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{state.error}</p>}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <AdminField label="제목" name="title" />
          <AdminField label="slug" name="slug" />
          <AdminField label="부제" name="subtitle" />
          <AdminField label="요약" name="summary" />
          <AdminField label="장소" name="venue" />
          <AdminField label="시작 일시" name="starts_at">
            <input type="datetime-local" className={inputClass()} value={state.draft.starts_at || ""} onChange={(event) => updateDraft("starts_at", event.target.value)} />
          </AdminField>
          <AdminField label="종료 일시" name="ends_at">
            <input type="datetime-local" className={inputClass()} value={state.draft.ends_at || ""} onChange={(event) => updateDraft("ends_at", event.target.value)} />
          </AdminField>
          <AdminField label="정원" name="capacity">
            <input type="number" min="0" className={inputClass()} value={state.draft.capacity || ""} onChange={(event) => updateDraft("capacity", event.target.value)} />
          </AdminField>
          <AdminField label="상태" name="status">
            <select className={inputClass()} value={state.draft.status} onChange={(event) => updateDraft("status", event.target.value)}>
              <option value="published">접수</option>
              <option value="draft">초안</option>
              <option value="closed">마감</option>
              <option value="archived">종료</option>
            </select>
          </AdminField>
          <AdminField label="등록 방식" name="registration_mode">
            <select className={inputClass()} value={state.draft.registration_mode} onChange={(event) => updateDraft("registration_mode", event.target.value)}>
              <option value="admin">관리자 등록</option>
              <option value="payment">결제 연동</option>
              <option value="closed">닫힘</option>
            </select>
          </AdminField>
          <AdminField label="회원 상품 UUID" name="member_product_uuid" />
          <AdminField label="비회원 상품 UUID" name="nonmember_product_uuid" />
          <AdminField label="정렬" name="sort_order">
            <input type="number" className={inputClass()} value={state.draft.sort_order || "0"} onChange={(event) => updateDraft("sort_order", event.target.value)} />
          </AdminField>
          <AdminField label="노출" name="active">
            <select className={inputClass()} value={state.draft.active} onChange={(event) => updateDraft("active", event.target.value)}>
              <option value="1">노출</option>
              <option value="0">숨김</option>
            </select>
          </AdminField>
          <label className="col-span-2 flex flex-col gap-1 text-sm font-semibold text-gray-700 md:col-span-1">
            상세 설명
            <textarea className={inputClass() + " min-h-[130px]"} value={state.draft.description || ""} onChange={(event) => updateDraft("description", event.target.value)} />
          </label>
        </div>
        <div className="mt-5 flex flex-row justify-end gap-3">
          <button type="button" disabled={state.saving} className={buttonClass("secondary")} onClick={() => setState({ draft: emptyDraft(), error: "" })}>취소</button>
          <button type="button" disabled={state.saving} className={buttonClass()} onClick={saveWorkshop}>
            {state.saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </section>
    );
  }

  function Main() {
    if (state.loading) return <><PageHeader /><Loading /></>;
    return (
      <div className="w-full">
        <PageHeader />
        <AdminForm />
        <section className="mx-auto w-full max-w-screen-lg px-6 py-8">
          {state.error && !state.isAdmin && (
            <div className="mb-5 border-y border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</div>
          )}
          {state.workshops.length === 0 ? (
            <div className="border-y border-gray-200 py-12 text-center text-gray-500">등록된 워크샵이 없습니다.</div>
          ) : (
            state.workshops.map((item) => <WorkshopCard key={item.uuid} item={item} />)
          )}
        </section>
      </div>
    );
  }

  function render() {
    const root = document.getElementById("div_main");
    if (root) ReactDOM.render(<Main />, root);
  }

  async function load() {
    setState({ loading: true, error: "" });
    try {
      const data = await fetch("/workshop/ajax_list/").then((res) => res.json());
      if (!data.ok) {
        setState({ loading: false, error: data.error || "워크샵 목록을 불러올 수 없습니다.", workshops: [], isAdmin: !!data.is_admin });
        return;
      }
      setState({ loading: false, workshops: data.workshops || [], isAdmin: !!data.is_admin, error: "" });
    } catch (error) {
      setState({ loading: false, error: error.message || "워크샵 목록을 불러올 수 없습니다.", workshops: [] });
    }
  }

  return { load };
})();

function set_main() {
  WorkshopCatalogPage.load();
}
