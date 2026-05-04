let class_span_btn_default = "flex flex-row justify-center items-center w-fit h-[20px] px-1.5 rounded-xl";
function Span_btn_user(props) {
  const roles = {
    "\uAD00\uB9AC\uC790": "yellow",
    "\uAE30\uC5C5\uD68C\uC6D0": "red",
    "VIP\uD68C\uC6D0": "blue",
    "\uC815\uD68C\uC6D0": "green",
    "\uC900\uD68C\uC6D0": "gray"
  };
  const role = roles[props.role] || "gray";
  return /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-${role}-100 text-${role}-800` }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/board_user.svg", class: "w-3 h-3 mr-1" }), props.user_nickname);
}
function Span_btn_date(props) {
  return /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-blue-100 text-blue-800` }, /* @__PURE__ */ React.createElement("img", { src: `https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/calendar_${Number(props.date.split("-")[2].substr(0, 2))}.svg`, class: "w-3 h-3 mr-1" }), props.date);
}
function Span_btn_article_read(props) {
  return props.cnt_read > 0 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-gray-100 text-blue-800` }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/eye.svg", class: "w-3 h-3 mr-1" }), props.cnt_read.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
}
function Span_btn_article_comment(props) {
  return props.cnt_comment > 0 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-purple-100 text-blue-800` }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/comment.svg", class: "w-3 h-3 mr-1" }), props.cnt_comment.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
}
function Span_btn_category(props) {
  return /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-cyan-100 text-cyan-800` }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/category.svg", class: "w-3 h-3 mr-1" }), props.category);
}
function Span_btn_article_new(props) {
  return props.toggle === 1 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-red-500 text-white animate-pulse` }, "NEW");
}
function Span_btn_article_secret(props) {
  return props.toggle === 1 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse` }, "SECRET");
}
function Span_btn_comment_secret(props) {
  return props.toggle === 1 && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-gray-500 text-white animate-pulse` }, "SECRET");
}
function Span_btn_my_article(props) {
  return props.toggle === "writer" && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse` }, "MY");
}
function Span_btn_my_comment(props) {
  return props.toggle === "writer" && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-[10px] bg-blue-500 text-white animate-pulse` }, "MY");
}
function Span_btn_book(props) {
  return props.title && /* @__PURE__ */ React.createElement("span", { class: `${class_span_btn_default} text-xs bg-green-100 text-green-800` }, /* @__PURE__ */ React.createElement("img", { src: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/svg/book.svg", class: "w-3 h-3 mr-1" }), props.title);
}
