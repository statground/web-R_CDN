(function () {
  const STORAGE_THEME = "webr_theme";
  const STORAGE_LANG = "webr_lang";
  const THEMES = ["light", "dark", "system"];
  const LANGS = ["ko", "en", "ja"];
  const EVENT_CHANGE = "webr:preferences-change";

  const LOCALES = {
    ko: "ko-KR",
    en: "en-US",
    ja: "ja-JP",
  };

  const ROLE_LABELS = {
    ko: {
      "관리자": "관리자",
      "기업회원": "기업회원",
      "VIP회원": "VIP회원",
      "정회원": "정회원",
      "준회원": "준회원",
      "회원": "회원",
      "": "",
    },
    en: {
      "관리자": "Admin",
      "기업회원": "Corporate",
      "VIP회원": "VIP",
      "정회원": "Member",
      "준회원": "Basic",
      "회원": "Member",
      "": "",
    },
    ja: {
      "관리자": "管理者",
      "기업회원": "法人会員",
      "VIP회원": "VIP会員",
      "정회원": "正会員",
      "준회원": "準会員",
      "회원": "会員",
      "": "",
    },
  };

  const DICT = {
    ko: {
      common: {
        siteName: "Web-R",
        language: "언어",
        theme: "테마",
        light: "라이트",
        dark: "다크",
        system: "시스템",
        login: "로그인",
        signup: "회원 가입",
        logout: "로그아웃",
        adminPage: "관리자",
        emptyBooks: "표시할 책이 없습니다.",
        emptyArticles: "표시할 글이 없습니다.",
        board: "게시판",
        openBookLinks: "클릭하여 구매/보기 링크 펼치기",
        openBoard: "관련 게시판 보기",
        peopleUnit: "명",
        pageviewUnit: "건",
        all: "전체보기",
        newArticle: "새 글",
        secret: "비밀",
        myArticle: "내 글",
        member: "회원",
      },
      header: {
        access: "Web-R 접속",
        community: "커뮤니티",
        books: "도서",
        workshop: "워크샵",
        about: "Web-R 소개",
        freeServer: "무료 서버 접속",
        memberServer: "정회원 서버 접속",
        notebook: "Web-R Notebook",
        youtube: "유튜브",
        notice: "공지사항",
        membership: "정회원 가입",
        terms: "이용 약관",
        privacy: "개인정보 보호 방침",
        refund: "환불 규정",
        biometrika: "다음 카페 Biometrika",
        statground: "통계마당",
        facebookGroup: "통계마당 페이스북 그룹",
        futuredu: "Futuredu",
        upgradeRegular: "정회원 가입하기",
      },
      footer: {
        copyright: "통계마당의 모든 컨텐츠는 저작권법에 의거 보호받고 있습니다.",
        company: "주식회사 통계마당",
        representative: "대표, 개인정보보호책임자",
        administrator: "Web-R 운영자",
        registrationNo: "사업자등록번호",
        mailOrderNo: "통신판매업신고번호",
        address: "주소",
        phone: "대표전화",
        email: "문의",
        notice: "공지사항",
        companyIntro: "회사 소개",
        terms: "서비스 이용약관",
        privacy: "개인정보 보호 방침",
      },
      home: {
        heroTitlePrefix: "웹에서 하는",
        heroTitleSuffix: "통계",
        heroDesc1:
          '"웹에서 하는 R통계"는, 통계에는 관심이 있으나 R을 어려워하는 여러 연구자들을 위한 프로젝트입니다.',
        heroDesc2:
          "R 설치 없이 클릭만으로 웹 서버를 이용하여 통계분석을 하고, 보다 쉽게 R을 사용하기 위한 패키지 및 앱 공동개발을 목표로 하고 있습니다.",
        totalMembers: "총 가입자 수",
        todayVisitors: "오늘의 방문자 수",
        todayPageviews: "오늘의 페이지 뷰",
        community: "커뮤니티",
        freeBoard: "자유게시판",
        recentActivity: "최근 활동",
        notices: "공지사항",
        youtube: "유튜브",
        newVideoUploaded: "유튜브에 새로운 영상이 업로드 되었습니다.",
        newNoticeAdded: "새로운 공지사항이 등록되었습니다.",
        someoneJoined: "{nickname}님이 가입하였습니다.",
        someoneOnline: "{nickname}님이 접속중입니다.",
        someoneCommented: "{nickname}님이 게시물에 댓글을 달았습니다.",
        someonePosted: "{nickname}님이 커뮤니티에 새 글을 게시하였습니다.",
        someoneRanApp: "{nickname}님이 {appName}을(를) 실행하고 있습니다.",
        someoneActive: "{nickname}님의 활동이 있습니다.",
      },
    },
    en: {
      common: {
        siteName: "Web-R",
        language: "Language",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
        login: "Sign in",
        signup: "Create account",
        logout: "Sign out",
        adminPage: "Admin",
        emptyBooks: "No books to display.",
        emptyArticles: "No posts to display.",
        board: "Board",
        openBookLinks: "Click to expand buy/view links",
        openBoard: "Open related board",
        peopleUnit: " people",
        pageviewUnit: " views",
        all: "All",
        newArticle: "NEW",
        secret: "SECRET",
        myArticle: "MY",
        member: "member",
      },
      header: {
        access: "Access Web-R",
        community: "Community",
        books: "Books",
        workshop: "Workshop",
        about: "About Web-R",
        freeServer: "Free server",
        memberServer: "Member server",
        notebook: "Web-R Notebook",
        youtube: "YouTube",
        notice: "Notices",
        membership: "Membership",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        refund: "Refund Policy",
        biometrika: "Biometrika Cafe",
        statground: "Statground",
        facebookGroup: "Statground Facebook Group",
        futuredu: "Futuredu",
        upgradeRegular: "Upgrade membership",
      },
      footer: {
        copyright: "All content provided by Statground is protected by copyright law.",
        company: "Company",
        representative: "Representative / Privacy Officer",
        administrator: "Web-R Operator",
        registrationNo: "Business Registration No.",
        mailOrderNo: "Mail-order Business Registration No.",
        address: "Address",
        phone: "Phone",
        email: "Contact",
        notice: "Notices",
        companyIntro: "Company",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
      },
      home: {
        heroTitlePrefix: "R statistics",
        heroTitleSuffix: "on the web",
        heroDesc1:
          '"R Statistics on the Web" is a project for researchers who are interested in statistics but still find R difficult to approach.',
        heroDesc2:
          "Our goal is to make statistical analysis possible without local R installation and to co-develop packages and apps that make R easier to use.",
        totalMembers: "Total members",
        todayVisitors: "Today's visitors",
        todayPageviews: "Today's page views",
        community: "Community",
        freeBoard: "Free board",
        recentActivity: "Recent activity",
        notices: "Notices",
        youtube: "YouTube",
        newVideoUploaded: "A new video has been uploaded to YouTube.",
        newNoticeAdded: "A new notice has been posted.",
        someoneJoined: "{nickname} joined the site.",
        someoneOnline: "{nickname} is online now.",
        someoneCommented: "{nickname} left a comment on a post.",
        someonePosted: "{nickname} published a new post in the community.",
        someoneRanApp: "{nickname} is running {appName}.",
        someoneActive: "There is new activity from {nickname}.",
      },
    },
    ja: {
      common: {
        siteName: "Web-R",
        language: "言語",
        theme: "テーマ",
        light: "ライト",
        dark: "ダーク",
        system: "システム",
        login: "ログイン",
        signup: "会員登録",
        logout: "ログアウト",
        adminPage: "管理",
        emptyBooks: "表示できる書籍がありません。",
        emptyArticles: "表示できる投稿がありません。",
        board: "掲示板",
        openBookLinks: "クリックして購入・閲覧リンクを表示",
        openBoard: "関連掲示板を開く",
        peopleUnit: "名",
        pageviewUnit: "件",
        all: "すべて",
        newArticle: "NEW",
        secret: "SECRET",
        myArticle: "MY",
        member: "会員",
      },
      header: {
        access: "Web-R 接続",
        community: "コミュニティ",
        books: "書籍",
        workshop: "ワークショップ",
        about: "Web-R 紹介",
        freeServer: "無料サーバー",
        memberServer: "正会員サーバー",
        notebook: "Web-R Notebook",
        youtube: "YouTube",
        notice: "お知らせ",
        membership: "正会員登録",
        terms: "利用規約",
        privacy: "個人情報保護方針",
        refund: "返金規定",
        biometrika: "Biometrika カフェ",
        statground: "Statground",
        facebookGroup: "Statground Facebook グループ",
        futuredu: "Futuredu",
        upgradeRegular: "正会員にアップグレード",
      },
      footer: {
        copyright: "Statground のすべてのコンテンツは著作権法により保護されています。",
        company: "会社名",
        representative: "代表者 / 個人情報保護責任者",
        administrator: "Web-R 運営者",
        registrationNo: "事業者登録番号",
        mailOrderNo: "通信販売業届出番号",
        address: "住所",
        phone: "代表電話",
        email: "お問い合わせ",
        notice: "お知らせ",
        companyIntro: "会社紹介",
        terms: "利用規約",
        privacy: "個人情報保護方針",
      },
      home: {
        heroTitlePrefix: "Web 上で行う",
        heroTitleSuffix: "統計",
        heroDesc1:
          '「Web で行う R 統計」は、統計に関心はあるものの R を難しく感じる研究者のためのプロジェクトです。',
        heroDesc2:
          "R をインストールせずに Web サーバー上で統計解析を行い、R をより簡単に活用するためのパッケージやアプリを共同開発することを目標としています。",
        totalMembers: "総会員数",
        todayVisitors: "本日の訪問者数",
        todayPageviews: "本日のページビュー",
        community: "コミュニティ",
        freeBoard: "自由掲示板",
        recentActivity: "最近の活動",
        notices: "お知らせ",
        youtube: "YouTube",
        newVideoUploaded: "YouTube に新しい動画がアップロードされました。",
        newNoticeAdded: "新しいお知らせが登録されました。",
        someoneJoined: "{nickname} さんが登録しました。",
        someoneOnline: "{nickname} さんが現在アクセス中です。",
        someoneCommented: "{nickname} さんが投稿にコメントしました。",
        someonePosted: "{nickname} さんがコミュニティに新しい投稿を作成しました。",
        someoneRanApp: "{nickname} さんが {appName} を実行しています。",
        someoneActive: "{nickname} さんの新しい活動があります。",
      },
    },
  };

  function safeLocalStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeLocalStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      return;
    }
  }

  function normalizeLang(value) {
    return LANGS.indexOf(value) > -1 ? value : "ko";
  }

  function normalizeTheme(value) {
    return THEMES.indexOf(value) > -1 ? value : "system";
  }

  function getLang() {
    const lang = normalizeLang(safeLocalStorageGet(STORAGE_LANG) || document.documentElement.getAttribute("data-lang") || "ko");
    return lang;
  }

  function getThemePreference() {
    const theme = normalizeTheme(
      safeLocalStorageGet(STORAGE_THEME) || document.documentElement.getAttribute("data-theme-preference") || "system"
    );
    return theme;
  }

  function getSystemTheme() {
    try {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function resolveTheme(themePreference) {
    const pref = normalizeTheme(themePreference || getThemePreference());
    return pref === "system" ? getSystemTheme() : pref;
  }

  function applyTheme(themePreference) {
    const pref = normalizeTheme(themePreference || getThemePreference());
    const resolved = resolveTheme(pref);
    document.documentElement.setAttribute("data-theme-preference", pref);
    document.documentElement.setAttribute("data-theme", resolved);
    if (document.body) {
      document.body.classList.add("webr-body");
      document.body.classList.toggle("webr-theme-dark", resolved === "dark");
      document.body.classList.toggle("webr-theme-light", resolved !== "dark");
    }
    return resolved;
  }

  function applyLang(langValue) {
    const lang = normalizeLang(langValue || getLang());
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-lang", lang);
    return lang;
  }

  function deepGet(obj, path) {
    return String(path || "")
      .split(".")
      .reduce(function (acc, key) {
        if (acc && Object.prototype.hasOwnProperty.call(acc, key)) return acc[key];
        return undefined;
      }, obj);
  }

  function formatText(template, params) {
    if (typeof template !== "string") return template;
    const data = params || {};
    return template.replace(/\{(.*?)\}/g, function (_, key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? String(data[key]) : "";
    });
  }

  function t(path, params, langValue) {
    const lang = normalizeLang(langValue || getLang());
    const candidate = deepGet(DICT[lang], path);
    if (candidate != null) return formatText(candidate, params);
    const fallback = deepGet(DICT.ko, path);
    if (fallback != null) return formatText(fallback, params);
    return path;
  }

  function roleLabel(role, langValue) {
    const lang = normalizeLang(langValue || getLang());
    const roles = ROLE_LABELS[lang] || ROLE_LABELS.ko;
    return roles[role] != null ? roles[role] : role;
  }

  function locale(langValue) {
    const lang = normalizeLang(langValue || getLang());
    return LOCALES[lang] || LOCALES.ko;
  }

  function formatNumber(value, langValue) {
    try {
      return new Intl.NumberFormat(locale(langValue)).format(Number(value || 0));
    } catch (e) {
      return String(value || 0);
    }
  }

  function snapshot() {
    const lang = getLang();
    const themePreference = getThemePreference();
    return {
      lang: lang,
      themePreference: themePreference,
      themeResolved: resolveTheme(themePreference),
      locale: locale(lang),
    };
  }

  function dispatchChange() {
    const detail = snapshot();
    document.dispatchEvent(new CustomEvent(EVENT_CHANGE, { detail: detail }));
  }

  function setThemePreference(themeValue) {
    const pref = normalizeTheme(themeValue);
    safeLocalStorageSet(STORAGE_THEME, pref);
    applyTheme(pref);
    dispatchChange();
  }

  function setLang(langValue) {
    const lang = normalizeLang(langValue);
    safeLocalStorageSet(STORAGE_LANG, lang);
    applyLang(lang);
    dispatchChange();
  }

  function usePreferences() {
    const [state, setState] = React.useState(snapshot());

    React.useEffect(function () {
      function onChange(e) {
        setState(e && e.detail ? e.detail : snapshot());
      }

      document.addEventListener(EVENT_CHANGE, onChange);
      return function () {
        document.removeEventListener(EVENT_CHANGE, onChange);
      };
    }, []);

    return state;
  }

  function listenSystemTheme() {
    if (!window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange() {
      if (getThemePreference() === "system") {
        applyTheme("system");
        dispatchChange();
      }
    }
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
    } else if (typeof mql.addListener === "function") {
      mql.addListener(onChange);
    }
  }

  applyLang(getLang());
  applyTheme(getThemePreference());
  listenSystemTheme();

  window.WEBR_PREFS = {
    EVENT_CHANGE: EVENT_CHANGE,
    LANGS: LANGS,
    THEMES: THEMES,
    snapshot: snapshot,
    getLang: getLang,
    setLang: setLang,
    getThemePreference: getThemePreference,
    setThemePreference: setThemePreference,
    resolveTheme: resolveTheme,
    t: t,
    roleLabel: roleLabel,
    locale: locale,
    formatNumber: formatNumber,
    usePreferences: usePreferences,
  };
})();
