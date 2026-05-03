function recordWebR2ServiceConnect() {
  function getService() {
    try {
      if (typeof WEBR2_SERVICE !== "undefined" && WEBR2_SERVICE) {
        return WEBR2_SERVICE;
      }
    } catch (e) {
      // Ignore lexical lookup errors from older cached shells.
    }
    if (typeof window !== "undefined" && window.WEBR2_SERVICE) {
      return window.WEBR2_SERVICE;
    }
    return null;
  }

  const service = getService();
  const name = String((service && service.title) || document.title || "").trim();
  if (!name) return;

  const data = new FormData();
  data.append("name", name);
  data.append("tag", "Web-R 2.0");
  data.append("url", window.location.href);
  if (service && service.key) {
    data.append("key", String(service.key));
  }

  fetch("/webr/ajax_record_service_connect/", {
    method: "POST",
    body: data,
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => {});
}

recordWebR2ServiceConnect();
