function Div_article_read_file(props) {
  const data = data_article;
  if (!data)
    return null;
  const isRblogger = data.category_url === "rblogger";
  const hasUrl = !!data.url;
  const hasFile = !!data.file_url;
  if (data.is_secret === 1 && data.check_reader !== "admin" && data.check_reader !== "writer") {
    return null;
  }
  if (isRblogger && !hasUrl) {
    return null;
  }
  if (!isRblogger && !hasFile) {
    return null;
  }
  if (isRblogger) {
    return /* @__PURE__ */ React.createElement("section", { class: "bg-white py-8 lg:py-16 antialiased" }, /* @__PURE__ */ React.createElement("div", { class: "w-full mx-auto px-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h2", { class: "text-md lg:text-lg font-bold text-gray-900" }, "\uC6D0\uBB38 \uB9C1\uD06C")), /* @__PURE__ */ React.createElement("form", { class: "mb-3" }, /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-50 rounded-lg border border-gray-200" })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-start items-start w-full" }, /* @__PURE__ */ React.createElement(
      "a",
      {
        href: data.url,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "text-blue-600 underline break-all text-md cursor-pointer hover:text-blue-800 hover:bg-gray-50 px-1 py-0.5 rounded"
      },
      data.url
    ))));
  }
  return /* @__PURE__ */ React.createElement("section", { class: "bg-white py-8 lg:py-16 antialiased" }, /* @__PURE__ */ React.createElement("div", { class: "w-full mx-auto px-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("h2", { class: "text-md lg:text-lg font-bold text-gray-900" }, "\uCCA8\uBD80\uD30C\uC77C")), /* @__PURE__ */ React.createElement("form", { class: "mb-3" }, /* @__PURE__ */ React.createElement("div", { class: "w-full bg-gray-50 rounded-lg border border-gray-200" })), /* @__PURE__ */ React.createElement("div", { class: "flex flex-row justify-center items-start w-full" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "/" + data.file_url,
      target: "_blank",
      class: "flex flex-row justify-end items-center text-md font-normal w-fit space-x-2 cursor-pointer hover:bg-gray-100"
    },
    data.file_name
  ))));
}
