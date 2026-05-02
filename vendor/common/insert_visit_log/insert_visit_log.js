(async function insert_visit_log(){
  try {
    const payload = {
      host: window.location.host,
      path: window.location.pathname,
      search: window.location.search,
      navigator: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
      }
    };
    await fetch('/ajax_insert_visit_log/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': (typeof getCookie === 'function' ? getCookie('csrftoken') : '')
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
  } catch (e) {}
})();
