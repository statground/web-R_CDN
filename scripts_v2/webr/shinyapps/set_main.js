function Div_page_header(props) {
    return (
        <div className="flex flex-row w-full justify-start items-end text-start mb-8">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
                <span className="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
            </h1>
            {
                props.subtitle
                ?   <p className="text-lg font-normal text-gray-500 sm:text-md pb-2">{props.subtitle}</p>
                :   null
            }
        </div>
    );
}

function getCookieValue(name) {
    if (typeof document === "undefined" || !document.cookie) {
        return "";
    }

    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }

    return "";
}

function buildPostInit(body) {
    const csrfToken = getCookieValue("csrftoken");
    const headers = {};

    if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
    }

    return {
        method: "post",
        headers,
        body,
    };
}

function normalizeWebrUrl(rawUrl) {
    if (rawUrl === undefined || rawUrl === null || rawUrl === "" || rawUrl === "None") {
        return "None";
    }
    return String(rawUrl);
}

function getCurrentWebrUrl() {
    try {
        if (typeof url !== "undefined") {
            return normalizeWebrUrl(url);
        }
    } catch (e) {
        // ignore global lexical lookup failure
    }

    if (typeof window !== "undefined" && window.WEBR_URL !== undefined) {
        return normalizeWebrUrl(window.WEBR_URL);
    }

    return "None";
}

function resolveWebrSubtitle(currentUrl) {
    if (currentUrl === "member") {
        return "정회원 서버 접속";
    }
    if (currentUrl === "None" || currentUrl === "free") {
        return "무료 서버 접속";
    }
    return "Web-R 접속";
}

function resolveWebrAccessTag(currentUrl) {
    if (currentUrl === "member") {
        return "Advance";
    }
    return "Free";
}

function getCurrentUsername() {
    try {
        if (typeof gv_username !== "undefined" && gv_username !== null) {
            return String(gv_username);
        }
    } catch (e) {
        // ignore global lexical lookup failure
    }

    if (typeof window !== "undefined" && window.gv_username !== undefined && window.gv_username !== null) {
        return String(window.gv_username);
    }

    return "";
}

function set_main() {
    const currentUrl = getCurrentWebrUrl();

    async function connectApp(appName, appTag) {
        try {
            const requestData = new FormData();
            requestData.append("name", appName || "");
            requestData.append("tag", appTag || "");

            const response = await fetch("/webr/ajax_connect_shinyapp/", buildPostInit(requestData));
            if (!response.ok) {
                throw new Error("server_error");
            }

            const data = await response.json();
            if (!data || !data.url) {
                throw new Error("invalid_response");
            }

            window.open(data.url, appName || "Web-R");
        } catch (e) {
            alert("앱 접속에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
    }

    function AppSkeletonCard() {
        return (
            <div className="flex flex-col justify-center items-center bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-2">
                <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96">
                    <svg className="w-10 h-10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
            </div>
        );
    }

    function AppGrid(props) {
        const username = getCurrentUsername();
        const rows = Object.keys(props.data || {});

        if (rows.length === 0) {
            return (
                <div className="w-full rounded-lg border border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
                    표시할 Web-R 앱이 없습니다.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1">
                {
                    rows.map((rowKey) => {
                        const app = props.data[rowKey] || {};
                        const authFlag = String(app.auth || "").toUpperCase();
                        const showLoginNotice = username === "";
                        const showMembershipNotice = username !== "" && authFlag === "NO";
                        const showConnectButton = username !== "" && authFlag === "YES";

                        return (
                            <div key={rowKey} className="flex flex-col justify-center items-center bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-2">
                                {
                                    app.url_image
                                    ?   <img className="w-full rounded-lg" src={app.url_image} alt={app.name || rowKey} />
                                    :   <div className="flex items-center justify-center w-full h-48 rounded-lg bg-slate-100 text-slate-400 text-sm">No image</div>
                                }
                                <h3 className="text-xl font-bold tracking-tight text-gray-900 text-center break-words w-full">
                                    {app.name || rowKey}
                                </h3>

                                {
                                    showLoginNotice
                                    ?   <p className="text-sm text-red-500">로그인이 필요합니다.</p>
                                    :   null
                                }

                                {
                                    showMembershipNotice
                                    ?   <p className="text-sm text-red-500">정회원 이상만 접속할 수 있습니다.</p>
                                    :   null
                                }

                                {
                                    showConnectButton
                                    ?   <button
                                            type="button"
                                            onClick={() => connectApp(app.name, app.tag)}
                                            className="text-gray-900 font-extrabold bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 rounded-lg text-sm px-5 py-1.5 text-center hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300"
                                        >
                                            접속하기
                                        </button>
                                    :   null
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    function WebrLandingPage() {
        const [appData, setAppData] = React.useState(null);
        const [errorMsg, setErrorMsg] = React.useState("");

        React.useEffect(() => {
            let alive = true;

            async function loadAppList() {
                setErrorMsg("");

                try {
                    const requestData = new FormData();
                    requestData.append("tag", resolveWebrAccessTag(currentUrl));

                    const response = await fetch("/webr/ajax_get_shinyapp_list/", buildPostInit(requestData));
                    if (!response.ok) {
                        throw new Error("server_error");
                    }

                    const data = await response.json();
                    if (!alive) {
                        return;
                    }

                    setAppData(data || {});
                } catch (e) {
                    if (!alive) {
                        return;
                    }

                    setAppData({});
                    setErrorMsg("앱 목록을 불러오지 못했습니다.");
                }
            }

            loadAppList();

            return () => {
                alive = false;
            };
        }, [currentUrl]);

        return (
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-8">
                <Div_page_header title={resolveWebrSubtitle(currentUrl)} subtitle="Web-R 접속" />

                <div id="div_app_list" className="w-full">
                    {
                        appData === null
                        ?   <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1 animate-pulse">
                                <AppSkeletonCard />
                                <AppSkeletonCard />
                                <AppSkeletonCard />
                                <AppSkeletonCard />
                                <AppSkeletonCard />
                                <AppSkeletonCard />
                            </div>
                        :   errorMsg
                            ?   <div className="w-full rounded-lg border border-rose-200 bg-rose-50 px-6 py-8 text-center text-sm text-rose-600">
                                    {errorMsg}
                                </div>
                            :   <AppGrid data={appData} />
                    }
                </div>
            </div>
        );
    }

    ReactDOM.render(<WebrLandingPage />, document.getElementById("div_main"));
}
