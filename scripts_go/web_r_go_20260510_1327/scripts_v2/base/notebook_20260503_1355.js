(function() {
  const page = document.getElementById("notebookPage");
  if (!page) {
    return;
  }
  const notebookMode = page.dataset.mode || "";
  const notebookID = page.dataset.notebookId || "";
  const shareID = page.dataset.shareId || "";
  async function loadNotebookList() {
    const form = new FormData();
    form.append("limit", "20");
    form.append("offset", "0");
    const res = await fetch("/webr/ajax_get_notebook_list/", { method: "POST", body: form });
    const data = await res.json();
    const mount = document.getElementById("notebookList");
    if (!mount) {
      return;
    }
    if (!data.ok) {
      mount.innerHTML = '<div class="rounded-2xl border bg-white p-6 text-sm text-rose-600">\uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.</div>';
      return;
    }
    mount.innerHTML = data.items.map((item) => `
      <div class="rounded-2xl border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-lg font-semibold">${item.title || "Untitled"}</div>
            <div class="mt-2 text-sm text-slate-600">${item.description || "\uC124\uBA85\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}</div>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs">${item.share === 1 ? "\uACF5\uAC1C" : item.share === 2 ? "\uACF5\uAC1C(\uD655\uC7A5)" : "\uBE44\uACF5\uAC1C"}</span>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <a href="/webr/notebook/run/${item.uuid}/" class="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50">\uC5F4\uAE30</a>
          <a href="/webr/notebook/view/${item.uuid_share}/" class="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50">\uACF5\uC720 \uBCF4\uAE30</a>
        </div>
      </div>
    `).join("");
  }
  async function loadNotebookData() {
    var _a;
    const target = document.getElementById("notebookData");
    if (!target) {
      return;
    }
    const form = new FormData();
    if (notebookMode === "view") {
      form.append("mode", "view");
      form.append("uuid_share", shareID);
    } else {
      form.append("mode", "run");
      form.append("notebook_uuid", notebookID);
    }
    const res = await fetch("/webr/ajax_get_notebook_data/", { method: "POST", body: form });
    const data = await res.json();
    target.textContent = JSON.stringify(data, null, 2);
    if (data.ok && data.item && document.getElementById("title")) {
      document.getElementById("title").value = data.item.title || "";
      document.getElementById("data_markdown").value = JSON.stringify((_a = data.item.data_markdown) != null ? _a : [], null, 2);
    }
  }
  async function saveNotebook() {
    const form = new FormData();
    form.append("notebook_uuid", notebookID);
    form.append("title", document.getElementById("title").value);
    form.append("data_markdown", document.getElementById("data_markdown").value || "[]");
    form.append("data_rcode", "[]");
    form.append("data_rcode_result", "[]");
    form.append("data_data", "[]");
    form.append("data_rpackage", "[]");
    form.append("data_meta", "{}");
    const res = await fetch("/webr/ajax_save_notebook_data/", { method: "POST", body: form });
    const data = await res.json();
    alert(data.ok ? "\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4." : "\uC800\uC7A5 \uC2E4\uD328");
    await loadNotebookData();
  }
  const reloadButton = document.getElementById("btnReloadNotebookList");
  if (reloadButton) {
    reloadButton.addEventListener("click", loadNotebookList);
    loadNotebookList();
  }
  if (document.getElementById("btnSaveNotebook")) {
    document.getElementById("btnSaveNotebook").addEventListener("click", saveNotebook);
    loadNotebookData();
  }
  if (document.getElementById("notebookData") && notebookMode === "view") {
    loadNotebookData();
  }
})();
