function Div_textbox(props) {
  return /* @__PURE__ */ React.createElement("div", { class: "w-full space-y-[8px]" }, /* @__PURE__ */ React.createElement("span", { class: "font-[500] text-[14px] w-full text-start" }, props.title), props.type == "text" ? /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      id: "txt_" + props.id,
      class: "bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full\n								focus:ring-gray-200 focus:border-gray-200",
      placeholder: "",
      onkeydown: props.function,
      onKeyUp: props.function,
      required: true
    }
  ) : /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      id: "txt_" + props.id,
      class: "bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full\n								focus:ring-gray-200 focus:border-gray-200",
      placeholder: "",
      onkeydown: props.function,
      onKeyUp: props.function,
      required: true
    }
  ), /* @__PURE__ */ React.createElement("div", { id: "desc_" + props.id + "_msg", class: "hidden" }));
}
