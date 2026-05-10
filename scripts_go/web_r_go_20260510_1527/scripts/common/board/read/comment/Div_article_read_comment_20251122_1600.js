function Div_article_read_comment(props) {
  function Div_comment_header(propsHeader) {
    return /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-2" }, /* @__PURE__ */ React.createElement(
      Span_btn_user,
      {
        user_nickname: propsHeader.data.user_nickname,
        role: propsHeader.data.user_role
      }
    ), /* @__PURE__ */ React.createElement(Span_btn_date, { date: propsHeader.data.created_at }), /* @__PURE__ */ React.createElement(Span_btn_comment_secret, { toggle: propsHeader.data.is_secret }), /* @__PURE__ */ React.createElement(Span_btn_my_comment, { toggle: propsHeader.data.check_comment_reader }));
  }
  function Div_comment(propsComment) {
    const isDepth2 = propsComment.depth === 2;
    const depthValue = isDepth2 ? 2 : 1;
    const bgColorClass = propsComment.data.user_writer == 1 ? isDepth2 ? "bg-blue-100 border border-blue-700" : "bg-blue-50" : isDepth2 ? "bg-gray-50" : "bg-white";
    const comment_depth2_list = !isDepth2 && Object.keys(propsComment.data.rereply || {}).map((key) => /* @__PURE__ */ React.createElement(
      Div_comment,
      {
        key: propsComment.data.rereply[key].uuid,
        data: propsComment.data.rereply[key],
        depth: 2
      }
    ));
    let fileHref = "";
    if (propsComment.data.file_url) {
      const raw = propsComment.data.file_url;
      if (raw.startsWith("http://") || raw.startsWith("https://")) {
        fileHref = raw;
      } else {
        const normalizedPath = raw.startsWith("/") ? raw : "/" + raw;
        fileHref = window.location.protocol + "//" + window.location.host + normalizedPath;
      }
    }
    return /* @__PURE__ */ React.createElement(
      "article",
      {
        class: "px-6 py-3 " + (isDepth2 ? "ml-4 " : "") + "text-base " + bgColorClass + " rounded-xl w-full space-y-2"
      },
      /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center space-x-2" }, /* @__PURE__ */ React.createElement(Div_comment_header, { data: propsComment.data })),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          class: "text-gray-500",
          id: "div_comment_" + propsComment.data.uuid
        }
      ),
      propsComment.data.file_url != null && /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-center space-x-2 text-sm" }, /* @__PURE__ */ React.createElement(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.8",
          stroke: "currentColor",
          class: "w-4 h-4 text-gray-600"
        },
        /* @__PURE__ */ React.createElement(
          "path",
          {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v12a2 2 0 01-2 2z"
          }
        )
      ), /* @__PURE__ */ React.createElement(
        "a",
        {
          href: fileHref,
          target: "_blank",
          class: "hover:underline"
        },
        propsComment.data.file_name
      )),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          class: "w-full",
          id: "div_comment_footer_" + propsComment.data.uuid
        },
        /* @__PURE__ */ React.createElement(
          Div_comment_button_list,
          {
            data: propsComment.data,
            depth: depthValue,
            loading: false
          }
        )
      ),
      comment_depth2_list,
      !isDepth2 && /* @__PURE__ */ React.createElement(
        "div",
        {
          id: "div_community_read_comment_new_" + propsComment.data.uuid,
          class: "hidden"
        },
        /* @__PURE__ */ React.createElement(
          Div_comment_form,
          {
            title: "\uB300\uB313\uAE00 \uC4F0\uAE30",
            class: "mt-4 p-4 bg-white rounded-lg w-full space-y-2",
            uuid_comment: propsComment.data.uuid
          }
        )
      )
    );
  }
  const comment_list = Object.keys(props.data).map((key) => /* @__PURE__ */ React.createElement(
    Div_comment,
    {
      key: props.data[key].uuid,
      data: props.data[key],
      depth: 1,
      is_secret: props.is_secret,
      check_reader: props.check_reader
    }
  ));
  return /* @__PURE__ */ React.createElement("section", { class: "bg-white py-8 lg:py-16 antialiased" }, /* @__PURE__ */ React.createElement("div", { class: "w-full mx-auto px-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h2", { class: "text-lg lg:text-2xl font-bold text-gray-900" }, "\uB313\uAE00 (", props.data.length, ")")), /* @__PURE__ */ React.createElement("form", { class: "mb-6" }, /* @__PURE__ */ React.createElement("div", { class: "mb-4 w-full bg-gray-50 rounded-lg border border-gray-200" }, /* @__PURE__ */ React.createElement("div", { id: "div_comment_new", class: "w-full" }))), /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-end w-full space-y-0" }, comment_list), gv_username !== "" && /* @__PURE__ */ React.createElement(
    "div",
    {
      class: "flex flex-row justify-center items-center p-6 text-base bg-gray-100 rounded-xl w-full",
      id: "div_community_read_comment_new"
    },
    /* @__PURE__ */ React.createElement(
      Div_comment_form,
      {
        title: "\uB313\uAE00 \uC4F0\uAE30",
        class: "w-full space-y-2",
        uuid_comment: null
      }
    )
  )));
}
