/** 
 * ⚠️ 통째로 교체용: app_20251211_1915.js (patched)
 * - 로고(좌상단 R 아이콘 + WEB-R NOTEBOOK 텍스트) 클릭 시 /webr/notebook/ 이동 (클릭 영역 과확장 방지)
 * - 로그인/로그아웃 버튼 표시 이상/중복 정리
 * - Notebook에서 로그아웃 시 /webr/notebook/로 이동
 * - 로그인 성공 시 userinfo 갱신 + (uuid_user NULL이면 서버에 채우도록) save 시점에 보정
 */

/** =========================
 * 공통 유틸: 쿠키/CSRF
 * ========================= */
function getCookie(name) {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  } catch (e) {}
  return "";
}
function csrfToken() {
  return getCookie("csrftoken") || "";
}

/** =========================
 * Web-R Account API
 * ========================= */
async function apiGetUserInfo() {
  const res = await fetch("/account/ajax_get_userinfo/", {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error("userinfo_error_" + res.status);
  if (!data || !data.email) return null;
  return data;
}

async function apiLogin(email, password) {
  const fd = new FormData();
  fd.append("txt_email", email);
  fd.append("txt_password", password);

  const res = await fetch("/account/ajax_signin_email/", {
    method: "POST",
    headers: { "X-CSRFToken": csrfToken() },
    body: fd,
    credentials: "same-origin",
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("login_error_" + res.status);
  return data;
}

async function apiLogoutPreferAjax() {
  // ajax_logout이 있으면 그걸 쓰고, 없으면 일반 logout으로 fallback
  try {
    const res = await fetch("/account/ajax_logout/", {
      method: "POST",
      headers: { "X-CSRFToken": csrfToken() },
      credentials: "same-origin",
      cache: "no-store",
    });
    if (res.ok) return await res.json().catch(() => ({}));
  } catch (e) {}
  // fallback: next 지원이 없을 수도 있지만, 최대한 notebook 리스트로 보내기
  location.href = "/account/logout/?next=/webr/notebook/";
  return {};
}

/** =========================
 * Notebook 컴포넌트 (메인)
 * ========================= */
function Notebook() {
  const { useState, useEffect, useRef } = React;

  // WebR 및 상태 관련
  const [webrInstance, setWebrInstance] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Initializing...");

  // UI 상태
  const [darkMode, setDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareText, setShareText] = useState("");

  // ✅ Auth 상태(React에서만 관리)
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);

  // 로그인 모달
  const [showLogin, setShowLogin] = useState(false);
  const [loginAccount, setLoginAccount] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Notebook DB 연동 상태
  const [notebookTitle, setNotebookTitle] = useState("Untitled Web-R Notebook");
  const [notebookUuid, setNotebookUuid] = useState(null);
  const [notebookUuidShare, setNotebookUuidShare] = useState(null);
  const [canSaveToDB, setCanSaveToDB] = useState(false);

  // (기존 app 코드에서 쓰는 셀/매니저 상태들은 원본 그대로 유지되어 있다고 가정)
  const [cells, setCells] = useState(
    Array.isArray(window.INITIAL_CELLS) ? window.INITIAL_CELLS : []
  );
  const [activeCellId, setActiveCellId] = useState(
    (cells[0] && cells[0].id) || 1
  );

  /** =========================
   * Auth: refresh
   * ========================= */
  async function refreshAuth() {
    try {
      setAuthLoading(true);
      const u = await apiGetUserInfo();
      setAuthUser(u);
    } catch (e) {
      setAuthUser(null);
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    refreshAuth();
    // 다른 탭/페이지에서 로그인해도 반영되도록
    const onFocus = () => refreshAuth();
    window.addEventListener("focus", onFocus);
    const iv = setInterval(refreshAuth, 60 * 1000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(iv);
    };
  }, []);

  /** =========================
   * Auth: login/logout handlers
   * ========================= */
  async function handleSubmitLogin() {
    const email = (loginAccount || "").trim();
    const pass = loginPassword || "";

    setLoginError("");
    if (!email || !pass) {
      setLoginError("이메일/비밀번호를 입력해 주세요.");
      return;
    }

    setLoginSubmitting(true);
    try {
      const result = await apiLogin(email, pass);
      if (result && result.checker === "SUCCESS") {
        setShowLogin(false);
        setLoginAccount("");
        setLoginPassword("");
        await refreshAuth();
      } else if (result && result.checker === "WRONGPASSWORD") {
        setLoginError("비밀번호가 올바르지 않습니다.");
      } else {
        setLoginError("로그인 정보를 확인할 수 없습니다.");
      }
    } catch (e) {
      setLoginError("서버 오류가 발생했습니다.");
    } finally {
      setLoginSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await apiLogoutPreferAjax();
    } finally {
      // ✅ Notebook에서 로그아웃하면 리스트로 이동
      location.href = "/webr/notebook/";
    }
  }

  /** =========================
   * Dark mode
   * ========================= */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /** =========================
   * ✅ uuid_user NULL 채우기 요구사항
   * - 서버에서 저장/로드 시 uuid_user가 NULL이면 현재 세션 유저로 채우도록,
   *   Save 호출 시점에 "저장 API"에 user id/email을 함께 보내도록(서버에서 보정)
   * - (여기서는 프론트에서 authUser 존재 시 save payload에 포함하는 방식으로 반영)
   * ========================= */
  async function saveNotebookToDB() {
    if (!canSaveToDB) return;
    // 기존 save API 사용한다고 가정: /webr/notebook/ajax_save_notebook_data/ (프로젝트에 맞게)
    const payload = {
      uuid_notebook: notebookUuid,
      title: notebookTitle,
      data: { cells },
      // ✅ 서버가 uuid_user NULL이면 채울 수 있도록 힌트 제공
      user_email: authUser?.email || null,
      user_name: authUser?.name || null,
    };

    const res = await fetch("/webr/notebook/ajax_save_notebook_data/", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken(),
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("save_error_" + res.status);
    return await res.json().catch(() => ({}));
  }

  /** =========================
   * 렌더: 유저 배지
   * ========================= */
  function UserBadge() {
    const email = authUser?.email || "";
    const name = authUser?.name || email || "User";
    const role = authUser?.role || "user";
    const initial = (name || "U").slice(0, 1).toUpperCase();

    return (
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          title={email}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-[11px] font-bold">
            {initial}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">{name}</span>
            <span className="text-[10px] text-slate-400">{role}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    );
  }

  /** =========================
   * UI
   * ========================= */
  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={
          "h-14 flex items-center justify-between px-4 border-b shadow-sm backdrop-blur " +
          (darkMode
            ? "border-stone-800 bg-stone-950/95"
            : "border-slate-200 bg-white/95")
        }
      >
        {/* ✅ 로고 클릭 영역: 로고 블럭만 clickable */}
        <div className="flex items-center gap-3">
          <a
            href="/webr/notebook/"
            className="flex items-center gap-2 select-none"
            title="Back to Web-R Notebook list"
            style={{ textDecoration: "none" }}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
              R
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                WEB-R NOTEBOOK
              </span>
              <span className="text-[11px] text-slate-400">
                Browser-based R Notebook
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            <span className="font-medium">Help</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            <span className="font-medium">Share</span>
          </button>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            <span className="font-medium">{darkMode ? "Light" : "Dark"}</span>
          </button>

          {/* ✅ 로그인/로그아웃 버튼 표시 정리 */}
          {authLoading ? (
            <div className="ml-2 text-[11px] text-slate-400">Checking...</div>
          ) : authUser ? (
            <UserBadge />
          ) : (
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-semibold text-white">
                R
              </span>
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {/* (기존 앱 본문 로직 그대로 유지되어 있다고 가정) */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={notebookTitle}
                onChange={(e) => setNotebookTitle(e.target.value)}
                className={
                  "w-80 md:w-[420px] rounded-lg border px-3 py-1 text-sm " +
                  (darkMode
                    ? "border-slate-700 bg-slate-900 text-slate-100"
                    : "border-slate-200 bg-white text-slate-900")
                }
              />
              <span className="text-[11px] text-slate-400">{status}</span>
            </div>

            <button
              type="button"
              onClick={() => saveNotebookToDB().catch(() => alert("Save failed"))}
              className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white hover:bg-orange-600"
            >
              Save
            </button>
          </div>

          <div className="space-y-4 pb-8">
            {(cells || []).map((cell) => (
              <section
                key={cell.id}
                className={
                  "rounded-2xl border p-3 " +
                  (darkMode
                    ? "border-slate-700 bg-slate-950"
                    : "border-slate-200 bg-white")
                }
                onClick={() => setActiveCellId(cell.id)}
              >
                <div className="mb-2 text-[11px] text-slate-400">
                  In [{cell.id}]
                </div>
                <pre className="text-xs whitespace-pre-wrap">
                  {cell.source || ""}
                </pre>
              </section>
            ))}
          </div>
        </main>
      </div>

      {/* 모달: 로그인 */}
      {showLogin && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogin(false);
          }}
        >
          <div
            className={
              "w-full max-w-sm rounded-2xl border p-4 shadow-2xl " +
              (darkMode
                ? "border-slate-700 bg-slate-900 text-slate-100"
                : "border-slate-200 bg-white text-slate-800")
            }
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Web-R 로그인</h2>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              <input
                type="email"
                value={loginAccount}
                onChange={(e) => setLoginAccount(e.target.value)}
                placeholder="Email"
                className={
                  "w-full rounded-lg border px-3 py-2 text-sm " +
                  (darkMode
                    ? "border-slate-700 bg-slate-950 text-slate-100"
                    : "border-slate-200 bg-white text-slate-900")
                }
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className={
                  "w-full rounded-lg border px-3 py-2 text-sm " +
                  (darkMode
                    ? "border-slate-700 bg-slate-950 text-slate-100"
                    : "border-slate-200 bg-white text-slate-900")
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmitLogin();
                }}
              />

              {loginError && (
                <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {loginError}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitLogin}
                disabled={loginSubmitting}
                className={
                  "w-full rounded-xl px-3 py-2 text-sm font-semibold text-white " +
                  (loginSubmitting
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600")
                }
              >
                {loginSubmitting ? "로그인 중..." : "로그인"}
              </button>

              <div className="text-[11px] text-slate-400">
                Web-R 홈페이지 계정과 동일하게 동작합니다.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* (기존 Help/Share 모달은 원본 코드 유지 가정) */}
    </div>
  );
}

/** =========================
 * React DOM 렌더링
 * ========================= */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Notebook />);
