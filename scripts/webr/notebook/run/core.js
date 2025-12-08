// webr-notebook-core.js
// ---------------------------------------------------------------------------
// Web-R Notebook 공통 상수 / 유틸 함수 모음
//  - WebR 로딩 대기
//  - 셀 ID 생성기
//  - 초기 Markdown/R 코드
//  - 자주 쓰는 패키지 목록
// ---------------------------------------------------------------------------

// React 훅 꺼내오기 (모든 파일에서 동일하게 사용)
const { useState, useEffect, useRef } = React;

// WebR(Runtime)이 window.WebR에 올라올 때까지 기다리는 헬퍼 함수
// - webr.mjs 를 모듈로 로드한 뒤, 실제 WebR 클래스가 준비되기까지
//   약간의 시간이 걸리기 때문에 polling 으로 확인한다.
// - timeoutMs 안에 준비되지 않으면 에러를 던진다.
function waitForWebR(timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    function check() {
      // 모듈에서 export 한 WebR 클래스를 전역에 올려둔다.
      if (window.WebR) return resolve(window.WebR);
      if (performance.now() - start > timeoutMs) {
        return reject(new Error("Timed out waiting for WebR."));
      }
      requestAnimationFrame(check);
    }
    check();
  });
}

// ---------------------------------------------------------------------------
// 셀 ID 생성기
//  - React key 중복을 막기 위해, 숫자 ID를 계속 증가시키며 사용한다.
//  - 초기 Notebook에는 이미 1, 2번 셀이 존재하므로 2에서 시작한다.
// ---------------------------------------------------------------------------
let _cellIdCounter = 2;

// 다음 셀 ID를 리턴하는 함수
function nextCellId() {
  _cellIdCounter += 1;
  return _cellIdCounter;
}

// Notebook 전체를 초기화할 때 ID 카운터도 함께 리셋하기 위한 헬퍼
function resetCellIdCounter() {
  _cellIdCounter = 2;
}

// ---------------------------------------------------------------------------
// 초기 셀 내용 (환영 메시지 / 예제 코드)
//  - 원본 webr-notebook.js 에서 사용하던 문자열을 그대로 분리했다.
// ---------------------------------------------------------------------------
const INITIAL_MARKDOWN = [
  "# Welcome to Web-R Notebook",
  "",
  "Try running the R example code in the next cell with **Shift+Enter** or **Ctrl+Enter**.",
  "",
  "```r",
  "library(ggplot2)",
  "",
  "ggplot(mpg, aes(displ, hwy, colour = class)) +",
  "  geom_point() +",
  "  geom_smooth(se = FALSE) +",
  "  theme_minimal()",
  "```"
].join("\n");

const INITIAL_R_CODE = [
  "library(ggplot2)",
  "",
  "ggplot(mpg, aes(displ, hwy, colour = class)) +",
  "  geom_point() +",
  "  geom_smooth(se = FALSE) +",
  "  theme_minimal()"
].join("\n");

// Markdown 문자열을 HTML로 변환하는 헬퍼
// - window.marked 가 없으면 원본 텍스트를 그대로 보여준다.
function renderMarkdownToHtml(src) {
  if (!src) return "";
  try {
    if (window.marked && typeof window.marked.parse === "function") {
      return window.marked.parse(src);
    }
  } catch (err) {
    return "<pre>" + (err.message || "Markdown render error") + "</pre>";
  }
  return src;
}

// ---------------------------------------------------------------------------
// 패키지 매니저에서 보여줄 인기 패키지 목록
// ---------------------------------------------------------------------------
const POPULAR_PACKAGES = [
  "ggplot2",
  "dplyr",
  "tidyr",
  "jsonlite",
  "stringr",
  "lubridate"
];
