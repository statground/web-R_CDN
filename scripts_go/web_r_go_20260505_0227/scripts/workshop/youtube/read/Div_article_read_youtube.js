function Div_article_read_youtube(props) {
  return /* @__PURE__ */ React.createElement("section", { class: "bg-white py-8 lg:py-16 antialiased" }, /* @__PURE__ */ React.createElement("div", { class: "w-full mx-auto px-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { class: "flex flex-col justify-center items-center w-full space-y-2 text-md lg:text-lg" }, /* @__PURE__ */ React.createElement(
    "iframe",
    {
      width: "560",
      height: "315",
      src: props.data.youtube_url.replace("watch?v=", "embed/"),
      title: "YouTube video player",
      frameborder: "0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      referrerpolicy: "strict-origin-when-cross-origin",
      allowfullscreen: true
    }
  ))));
}
