function Div_btn_submit(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: props.function,
      class: props.class
    },
    props.text
  );
}
