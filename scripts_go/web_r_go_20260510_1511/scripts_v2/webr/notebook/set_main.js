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
    body
  };
}
async function copyTextSafely(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "readonly");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch (e) {
    return false;
  }
}
function set_main() {
  const api = typeof window !== "undefined" && window.WEBR_NOTEBOOK_API ? window.WEBR_NOTEBOOK_API : null;
  if (!api || !api.list || !api.toggle_favoriate || !api.delete) {
    ReactDOM.render(
      /* @__PURE__ */ React.createElement("div", { className: "max-w-screen-sm mx-auto px-4 py-10 text-sm text-rose-600" }, /* @__PURE__ */ React.createElement("div", { className: "font-semibold mb-2" }, "\uC124\uC815 \uC624\uB958"), /* @__PURE__ */ React.createElement("div", { className: "text-slate-600 text-xs leading-5" }, "Notebook \uBAA9\uB85D API URL\uC774 \uC8FC\uC785\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.", /* @__PURE__ */ React.createElement("br", null), "index.html\uC5D0\uC11C ", /* @__PURE__ */ React.createElement("code", null, "window.WEBR_NOTEBOOK_API"), "\uB97C \uBA3C\uC800 \uC120\uC5B8\uD55C \uB4A4 set_main.js\uB97C \uB85C\uB4DC\uD574\uC57C \uD569\uB2C8\uB2E4.")),
      document.getElementById("div_main")
    );
    return;
  }
  function pad2(value) {
    return String(value).padStart(2, "0");
  }
  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }
    return [
      date.getFullYear(),
      "-",
      pad2(date.getMonth() + 1),
      "-",
      pad2(date.getDate()),
      " ",
      pad2(date.getHours()),
      ":",
      pad2(date.getMinutes())
    ].join("");
  }
  function FilterChip(props) {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: props.onClick,
        className: "px-2.5 py-1 rounded-full border text-[11px] transition " + (props.active ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-300 text-slate-600 hover:border-slate-400")
      },
      props.label
    );
  }
  function NotebookSkeletonRow() {
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col w-full py-3 border-b border-slate-100 px-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-2 w-full" }, /* @__PURE__ */ React.createElement("div", { className: "w-4 h-4 rounded-full bg-slate-200 animate-pulse mt-1" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "h-3 w-44 bg-slate-200 rounded animate-pulse" }), /* @__PURE__ */ React.createElement("div", { className: "h-3 w-36 bg-slate-200 rounded animate-pulse" }))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "h-6 w-16 bg-slate-200 rounded-full animate-pulse" }), /* @__PURE__ */ React.createElement("div", { className: "h-6 w-16 bg-slate-200 rounded-full animate-pulse" }), /* @__PURE__ */ React.createElement("div", { className: "h-6 w-16 bg-slate-200 rounded-full animate-pulse" })));
  }
  function NotebookRow(props) {
    const notebook = props.nb;
    const badgeClass = notebook.shareMode === 1 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : notebook.shareMode === 2 ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-slate-100 text-slate-700 border-slate-300";
    const badgeLabel = notebook.shareMode === 1 ? "\uCEE4\uBBA4\uB2C8\uD2F0 \uACF5\uAC1C" : notebook.shareMode === 2 ? "\uB9C1\uD06C \uACF5\uAC1C" : "\uBE44\uACF5\uAC1C";
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col w-full py-3 border-b border-slate-100 px-2 hover:bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-2 w-full" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "mt-0.5 text-sm " + (notebook.favorite ? "text-yellow-400" : "text-slate-300 hover:text-slate-500"),
        onClick: () => props.onToggleFavorite(notebook.id),
        title: "\uC990\uACA8\uCC3E\uAE30"
      },
      "\u2605"
    ), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement(
      "a",
      {
        href: `/webr/notebook/run/${notebook.id}/`,
        className: "text-sm text-slate-900 font-medium hover:underline break-words"
      },
      notebook.title
    ), notebook.description ? /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "mt-1 text-[11px] text-slate-600 leading-4",
        style: {
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }
      },
      notebook.description
    ) : null, /* @__PURE__ */ React.createElement("div", { className: "mt-2 flex flex-row flex-nowrap gap-4 text-[11px] text-slate-600 whitespace-nowrap overflow-x-auto" }, /* @__PURE__ */ React.createElement("span", null, "\uC0DD\uC131\uC77C\uC790: ", notebook.createdAt), notebook.updatedAt ? /* @__PURE__ */ React.createElement("span", null, "\uC218\uC815\uC77C\uC790: ", notebook.updatedAt) : null))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mt-3 flex-wrap" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center px-2 py-0.5 text-[10px] rounded-full border " + badgeClass }, badgeLabel), notebook.shareMode !== 0 ? /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "text-[10px] px-2 py-0.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 shrink-0",
        onClick: () => props.onCopyUrl(notebook.id)
      },
      props.copied ? "\uBCF5\uC0AC\uB428" : "URL \uBCF5\uC0AC"
    ) : null, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "text-[10px] px-2 py-0.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 shrink-0",
        onClick: () => props.onDelete(notebook.id),
        title: "\uC0AD\uC81C"
      },
      "\uC0AD\uC81C"
    )));
  }
  function NotebookListPage() {
    const PAGE_SIZE = 20;
    const [notebooks, setNotebooks] = React.useState([]);
    const [myLoading, setMyLoading] = React.useState(true);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [myQuery, setMyQuery] = React.useState("");
    const [visibilityFilter, setVisibilityFilter] = React.useState("all");
    const [copiedId, setCopiedId] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState("");
    const reqSeqRef = React.useRef(0);
    const handleCreateNotebook = () => {
      window.location.href = "/webr/notebook/new/";
    };
    async function fetchNotebookList(options) {
      const reqId = reqSeqRef.current + 1;
      reqSeqRef.current = reqId;
      if (!options.append) {
        setMyLoading(true);
        setErrorMsg("");
      } else {
        setIsLoadingMore(true);
      }
      try {
        const form = new FormData();
        form.append("q", myQuery);
        const visibilityValue = visibilityFilter === "private" ? "private" : visibilityFilter === "all" ? "all" : "public";
        form.append("visibility", visibilityValue);
        if (visibilityFilter === "community") {
          form.append("share", "1");
        }
        if (visibilityFilter === "link") {
          form.append("share", "2");
        }
        form.append("limit", String(PAGE_SIZE));
        form.append("offset", String(options.nextOffset));
        const response = await fetch(api.list, buildPostInit(form));
        if (!response.ok) {
          throw new Error("server_error");
        }
        const data = await response.json();
        if (reqId !== reqSeqRef.current) {
          return;
        }
        if (data && data.auth === false) {
          setNotebooks([]);
          setHasMore(false);
          setErrorMsg("\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.");
          setMyLoading(false);
          setIsLoadingMore(false);
          return;
        }
        const items = data && Array.isArray(data.items) ? data.items : [];
        const mapped = items.map((row) => {
          const shareMode = row && row.share !== void 0 && row.share !== null ? parseInt(row.share, 10) : 0;
          return {
            id: row.uuid || "",
            uuidShare: row.uuid_share || "",
            title: row.title || "Untitled Web-R Notebook",
            description: row.description ? String(row.description).trim() : "",
            createdAt: formatDate(row.created_at),
            updatedAt: row.updated_at ? formatDate(row.updated_at) : null,
            shareMode: shareMode === 1 || shareMode === 2 ? shareMode : 0,
            favorite: row.favoriate === 1 || row.favoriate === true
          };
        });
        if (!options.append) {
          setNotebooks(mapped);
        } else {
          setNotebooks((prev) => prev.concat(mapped));
        }
        setHasMore(mapped.length === PAGE_SIZE);
        setMyLoading(false);
        setIsLoadingMore(false);
      } catch (e) {
        if (reqId !== reqSeqRef.current) {
          return;
        }
        if (!options.append) {
          setNotebooks([]);
          setHasMore(false);
          setErrorMsg("\uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
          setMyLoading(false);
        }
        setIsLoadingMore(false);
      }
    }
    React.useEffect(() => {
      fetchNotebookList({ nextOffset: 0, append: false });
    }, []);
    React.useEffect(() => {
      const timer = setTimeout(() => {
        fetchNotebookList({ nextOffset: 0, append: false });
        window.scrollTo({ top: 0, behavior: "auto" });
      }, 250);
      return () => clearTimeout(timer);
    }, [myQuery, visibilityFilter]);
    React.useEffect(() => {
      function handleScroll() {
        if (myLoading || isLoadingMore || !hasMore) {
          return;
        }
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const clientHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        if (scrollHeight - (scrollTop + clientHeight) < 200) {
          fetchNotebookList({ nextOffset: notebooks.length, append: true });
        }
      }
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [myLoading, isLoadingMore, hasMore, notebooks.length, myQuery, visibilityFilter]);
    const toggleFavorite = async (id) => {
      try {
        const form = new FormData();
        form.append("notebook_uuid", id);
        const response = await fetch(api.toggle_favoriate, buildPostInit(form));
        if (!response.ok) {
          throw new Error("server_error");
        }
        const data = await response.json();
        if (!data.ok) {
          if (data.auth === false) {
            alert("\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.");
          } else {
            alert("\uC990\uACA8\uCC3E\uAE30 \uBCC0\uACBD\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
          }
          return;
        }
        fetchNotebookList({ nextOffset: 0, append: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        alert("\uC990\uACA8\uCC3E\uAE30 \uBCC0\uACBD\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. (\uB124\uD2B8\uC6CC\uD06C/\uC11C\uBC84 \uC624\uB958)");
      }
    };
    const copyPublicUrl = async (id) => {
      const target = notebooks.find((item) => item.id === id);
      if (!target || !target.uuidShare) {
        alert("\uACF5\uAC1C URL\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
        return;
      }
      const origin = window.location && window.location.origin ? window.location.origin : "";
      const notebookUrl = `${origin}/webr/notebook/view/${target.uuidShare}/`;
      const ok = await copyTextSafely(notebookUrl);
      if (ok) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
      } else {
        window.prompt("\uC544\uB798 URL\uC744 \uBCF5\uC0AC\uD574\uC11C \uC0AC\uC6A9\uD558\uC138\uC694.", notebookUrl);
      }
    };
    const deleteNotebook = async (id) => {
      const ok = window.confirm("\uC774 \uB178\uD2B8\uBD81\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694? (\uBCF5\uAD6C \uBD88\uAC00)");
      if (!ok) {
        return;
      }
      try {
        const form = new FormData();
        form.append("notebook_uuid", id);
        const response = await fetch(api.delete, buildPostInit(form));
        if (!response.ok) {
          throw new Error("server_error");
        }
        const data = await response.json();
        if (!data.ok) {
          if (data.auth === false) {
            alert("\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.");
          } else {
            alert("\uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
          }
          return;
        }
        fetchNotebookList({ nextOffset: 0, append: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        alert("\uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. (\uB124\uD2B8\uC6CC\uD06C/\uC11C\uBC84 \uC624\uB958)");
      }
    };
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-sm mx-auto md:px-8" }, /* @__PURE__ */ React.createElement(Div_page_header, { title: "Web-R Notebook" }), /* @__PURE__ */ React.createElement("div", { id: "div_notebook_list", className: "flex flex-col justify-center items-center w-full mt-4" }, /* @__PURE__ */ React.createElement("div", { id: "div_notebook_main", className: "w-full" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center items-center border border-gray-300 rounded-xl space-y-4 w-full p-6 md:p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-row justify-between items-center w-full gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("h2", { className: "text-sm font-semibold text-slate-900" }, "\uB0B4 \uB178\uD2B8\uBD81"), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600" }, notebooks.length, "\uAC1C")), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: handleCreateNotebook,
        className: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-full text-xs px-4 py-1.5 text-center hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
      },
      "\uC0C8 Notebook \uB9CC\uB4E4\uAE30"
    )), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-2 sm:items-center w-full" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1 sm:flex-none" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "bg-white border border-slate-300 rounded-full px-3 py-1.5 text-xs text-slate-900 w-full sm:w-56 focus:outline-none focus:ring-1 focus:ring-sky-500",
        placeholder: "\uB0B4 \uB178\uD2B8\uBD81 \uC81C\uBAA9 \uAC80\uC0C9\u2026",
        value: myQuery,
        onChange: (event) => setMyQuery(event.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 text-[11px] flex-wrap" }, /* @__PURE__ */ React.createElement(FilterChip, { label: "\uC804\uCCB4", active: visibilityFilter === "all", onClick: () => setVisibilityFilter("all") }), /* @__PURE__ */ React.createElement(FilterChip, { label: "\uCEE4\uBBA4\uB2C8\uD2F0 \uACF5\uAC1C", active: visibilityFilter === "community", onClick: () => setVisibilityFilter("community") }), /* @__PURE__ */ React.createElement(FilterChip, { label: "\uB9C1\uD06C \uACF5\uAC1C", active: visibilityFilter === "link", onClick: () => setVisibilityFilter("link") }), /* @__PURE__ */ React.createElement(FilterChip, { label: "\uBE44\uACF5\uAC1C", active: visibilityFilter === "private", onClick: () => setVisibilityFilter("private") }))), !myLoading && errorMsg ? /* @__PURE__ */ React.createElement("div", { className: "w-full py-8 text-center text-slate-500 text-xs" }, errorMsg) : null, !errorMsg ? /* @__PURE__ */ React.createElement("div", { className: "w-full text-xs" }, myLoading ? Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ React.createElement(NotebookSkeletonRow, { key: index })) : notebooks.map((notebook) => /* @__PURE__ */ React.createElement(
      NotebookRow,
      {
        key: notebook.id,
        nb: notebook,
        onToggleFavorite: toggleFavorite,
        onCopyUrl: copyPublicUrl,
        copied: copiedId === notebook.id,
        onDelete: deleteNotebook
      }
    )), !myLoading && notebooks.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "py-8 text-center text-slate-500 text-xs" }, "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uB178\uD2B8\uBD81\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.") : null) : null, !myLoading && !errorMsg && hasMore ? /* @__PURE__ */ React.createElement("div", { className: "pt-1 text-center text-[11px] text-slate-500 w-full" }, "\uC2A4\uD06C\uB864\uC744 \uB0B4\uB9AC\uBA74 \uB354 \uB9CE\uC740 \uB178\uD2B8\uBD81\uC774 \uB85C\uB4DC\uB429\uB2C8\uB2E4\u2026") : null, isLoadingMore ? /* @__PURE__ */ React.createElement("div", { className: "pt-1 text-center text-[11px] text-slate-500 w-full" }, "\uB354 \uBD88\uB7EC\uC624\uB294 \uC911\u2026") : null))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(NotebookListPage, null), document.getElementById("div_main"));
}
