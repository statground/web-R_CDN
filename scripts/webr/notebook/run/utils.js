/**
 * WebR 로딩을 기다리는 헬퍼 함수
 */
function waitForWebR(timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
	const start = performance.now();
	function check() {
	  if (window.WebR) return resolve(window.WebR);
	  if (performance.now() - start > timeoutMs) {
		return reject(new Error("Timed out waiting for WebR."));
	  }
	  requestAnimationFrame(check);
	}
	check();
  });
}

// 셀 ID 카운터
let _cellIdCounter = 2;
function nextCellId() {
  _cellIdCounter += 1;
  return _cellIdCounter;
}

/**
 * Markdown 문자열을 HTML로 변환하는 함수
 */
function renderMarkdown(md) {
  if (!md) return "";
  if (window.marked && !window.__WEBR_MARKED_CONFIGURED) {
	window.marked.setOptions({ breaks: true });
	window.__WEBR_MARKED_CONFIGURED = true;
  }
  const processed = md.replace(/\n{3,}/g, "\n\n&nbsp;\n\n");
  return marked.parse(processed);
}