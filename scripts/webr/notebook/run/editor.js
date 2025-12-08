// webr-notebook-editor.js
// ---------------------------------------------------------------------------
// RCodeEditor 컴포넌트
//  - CodeMirror 를 이용해 R / Markdown 코드를 편집하는 영역을 만든다.
//  - Notebook 컴포넌트에서 재사용 가능한 순수 UI/입력 컴포넌트.
// ---------------------------------------------------------------------------

// React 훅 가져오기 (파일별로 한 번씩 선언해도 무방)
const { useState, useEffect, useRef } = React;

/**
 * RCodeEditor
 *
 * props:
 *  - value:      현재 코드 문자열
 *  - onChange:   코드 변경 콜백
 *  - darkMode:   다크 모드 여부 (CodeMirror 테마 변경용)
 *  - cellId:     셀 ID (디버깅 / data-attribute 용)
 *  - onRun:      현재 셀 실행 (Shift+Enter, Ctrl+Enter, Cmd+Enter)
 *  - onRunInsertBelow: 현재 셀 실행 후 아래에 새 셀 추가 (Alt+Enter)
 *  - onHelp:     도움말 열기 (Ctrl/Cmd/Alt + H)
 *  - onFocus:    에디터가 focus 되었을 때 콜백 (현재 활성 셀 추적용)
 *  - mode:       "r" 또는 "markdown" (CodeMirror 모드 선택)
 */
function RCodeEditor({
  value,
  onChange,
  darkMode,
  cellId,
  onRun,
  onRunInsertBelow,
  onHelp,
  onFocus,
  mode = "r",
  hidden = false // 현재는 사용하지 않지만 API 확장을 대비해 유지
}) {
  const textareaRef = useRef(null); // 원본 <textarea> DOM
  const editorRef = useRef(null);   // CodeMirror 인스턴스

  // 최초 마운트 시 CodeMirror 인스턴스를 생성
  useEffect(() => {
    if (!textareaRef.current || !window.CodeMirror) return;

    const editor = window.CodeMirror.fromTextArea(textareaRef.current, {
      mode: mode === "markdown" ? "markdown" : "r",
      lineNumbers: true,
      theme: darkMode ? "material" : "eclipse",
      viewportMargin: Infinity, // 셀 전체 높이에 맞게
      lineWrapping: true        // 긴 줄 자동 줄바꿈
    });

    editorRef.current = editor;
    editor.setValue(value || "");

    // CodeMirror 내용이 바뀔 때 상위 상태에 반영
    editor.on("change", function (cm) {
      const v = cm.getValue();
      if (v !== value && onChange) {
        onChange(v);
      }
    });

    // focus 시 현재 셀을 활성 셀로 표시하기 위해 콜백 호출
    editor.on("focus", function () {
      if (onFocus) onFocus();
    });

    // 단축키 매핑
    editor.addKeyMap({
      "Shift-Enter": function () {
        if (onRun) onRun();
      },
      "Ctrl-Enter": function () {
        if (onRun) onRun();
      },
      "Cmd-Enter": function () {
        if (onRun) onRun();
      },
      "Alt-Enter": function () {
        if (onRunInsertBelow) {
          onRunInsertBelow();
        } else if (onRun) {
          onRun();
        }
      },
      "Ctrl-H": function () {
        if (onHelp) onHelp();
      },
      "Cmd-H": function () {
        if (onHelp) onHelp();
      },
      "Alt-H": function () {
        if (onHelp) onHelp();
      }
    });

    // 언마운트 시 CodeMirror DOM 정리
    return () => {
      try {
        if (editorRef.current) {
          const wrapper =
            editorRef.current.getWrapperElement &&
            editorRef.current.getWrapperElement();
          if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
          }
        }
      } catch (e) {
        console.error("CodeMirror cleanup error", e);
      } finally {
        editorRef.current = null;
      }
    };
  }, []); // 최초 1회만 실행

  // 다크 모드 변경 시 CodeMirror 테마만 교체
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption(
        "theme",
        darkMode ? "material" : "eclipse"
      );
    }
  }, [darkMode]);

  // mode 변경 시 R / Markdown 모드 전환
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption(
        "mode",
        mode === "markdown" ? "markdown" : "r"
      );
    }
  }, [mode]);

  // 외부에서 value가 변경된 경우 에디터 내용 동기화
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value || "");
    }
  }, [value]);

  // 원본 <textarea> 는 숨기고, CodeMirror 가 대신 렌더링한다.
  return (
    <textarea
      ref={textareaRef}
      data-cell-id={cellId}
      defaultValue={value}
      style={{ display: "none" }}
      spellCheck="false"
    />
  );
}
