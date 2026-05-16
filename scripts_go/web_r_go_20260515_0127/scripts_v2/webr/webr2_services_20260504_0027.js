function set_main() {
  const services = [
    {
      key: "pubmed-wordcloud",
      title: "PubMed wordcloud",
      description: "PubMed \uCD08\uB85D\uC744 \uAC00\uC838\uC640 WebAssembly R\uC5D0\uC11C \uB2E8\uC5B4 \uBE48\uB3C4\uB97C \uACC4\uC0B0\uD558\uACE0 wordcloud\uB85C \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
      href: "/webr/pubmed-wordcloud/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/webr/advanced_pubmed.png",
      tags: ["PubMed", "wordcloud", "WebAssembly"]
    },
    {
      key: "meta-analysis",
      title: "\uBA54\uD0C0\uBD84\uC11D",
      description: "\uC5F0\uC18D\uD615, \uC774\uBD84\uD615, \uD6A8\uACFC\uD06C\uAE30 \uB370\uC774\uD130\uB97C WebAssembly R\uC5D0\uC11C \uACE0\uC815\uD6A8\uACFC\uC640 \uB79C\uB364\uD6A8\uACFC \uBAA8\uB378\uB85C \uBD84\uC11D\uD569\uB2C8\uB2E4.",
      href: "/webr/meta-analysis/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/webr/advanced_meta.png",
      tags: ["Meta-analysis", "forest plot", "WebAssembly"]
    },
    {
      key: "roc-analysis",
      title: "ROC \uBD84\uC11D",
      description: "\uC774\uBD84\uD615 \uACB0\uACFC\uC640 \uC608\uCE21 \uC810\uC218\uB97C \uC774\uC6A9\uD574 AUC, \uCD5C\uC801 \uC808\uB2E8\uAC12, \uBBFC\uAC10\uB3C4\uC640 \uD2B9\uC774\uB3C4\uB97C \uACC4\uC0B0\uD569\uB2C8\uB2E4.",
      href: "/webr/roc-analysis/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/book/book_006.jpg",
      tags: ["ROC", "AUC", "cutoff"]
    },
    {
      key: "survival-psm",
      title: "\uC0DD\uC874\uBD84\uC11D\uACFC PSM",
      description: "Kaplan-Meier \uC0DD\uC874\uACE1\uC120, log-rank \uAC80\uC815, propensity score matching \uADE0\uD615\uD45C\uB97C \uB9CC\uB4ED\uB2C8\uB2E4.",
      href: "/webr/survival-psm/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/webr/advanced_survival.png",
      tags: ["Survival", "PSM", "WebAssembly"]
    },
    {
      key: "conditional-process",
      title: "\uC870\uAC74\uBD80 \uACFC\uC815 \uBD84\uC11D",
      description: "\uB9E4\uAC1C, \uC870\uC808, \uC870\uC808\uB41C \uB9E4\uAC1C \uBAA8\uD615\uC758 \uD68C\uADC0\uACC4\uC218\uC640 \uBD80\uD2B8\uC2A4\uD2B8\uB7A9 \uAC04\uC811\uD6A8\uACFC\uB97C \uACC4\uC0B0\uD569\uB2C8\uB2E4.",
      href: "/webr/conditional-process/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/webr/advanced_processR.png",
      tags: ["Mediation", "Moderation", "processR"]
    },
    {
      key: "propensity-score-matching",
      title: "Propensity Score Matching",
      description: "\uC131\uD5A5\uC810\uC218\uB97C \uCD94\uC815\uD558\uACE0 \uCD5C\uADFC\uC811 \uB9E4\uCE6D \uC804\uD6C4 \uACF5\uBCC0\uB7C9 \uADE0\uD615\uACFC \uACB0\uACFC \uCC28\uC774\uB97C \uD655\uC778\uD569\uB2C8\uB2E4.",
      href: "/webr/propensity-score-matching/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/webr/propensity_score_matching.png",
      tags: ["PSM", "balance", "matching"]
    },
    {
      key: "ggplot2",
      title: "\uC6F9\uC5D0\uC11C \uD558\uB294 ggplot2",
      description: "CSV \uB370\uC774\uD130\uB97C WebR\uC5D0\uC11C \uC694\uC57D\uD558\uACE0 \uC0B0\uC810\uB3C4, \uB9C9\uB300\uADF8\uB798\uD504, \uC0C1\uC790\uADF8\uB9BC\uC744 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uADF8\uB9BD\uB2C8\uB2E4.",
      href: "/webr/ggplot2/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/webr/ggplot2new.png",
      tags: ["ggplot2", "plot", "WebAssembly"]
    },
    {
      key: "sample-size",
      title: "\uC0D8\uD50C \uC218\uC758 \uACC4\uC0B0",
      description: "\uD3C9\uADE0, \uBE44\uC728, \uB450 \uAD70 \uBE44\uAD50\uC758 \uD45C\uBCF8 \uC218\uC640 \uAC80\uC815\uB825\uC744 WebR\uB85C \uACC4\uC0B0\uD569\uB2C8\uB2E4.",
      href: "/webr/sample-size/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-R_CDN@f3e464e95616fa13712baa6adbbb0b6cda7ee821/images/webr/sampleSize.png",
      tags: ["sample size", "power", "clinical trial"]
    }
  ];
  function WebR2ServicesApp() {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-[calc(100vh-130px)] bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8" }, /* @__PURE__ */ React.createElement(Div_page_header, { title: "Web-R 2.0", subtitle: "\uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C R\uC744 \uC2E4\uD589\uD558\uB294 WebAssembly \uAE30\uBC18 \uC11C\uBE44\uC2A4 \uBAA9\uB85D\uC785\uB2C8\uB2E4." }), /* @__PURE__ */ React.createElement("main", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2" }, services.map((service) => /* @__PURE__ */ React.createElement(
      "a",
      {
        key: service.key,
        href: service.href,
        className: "group grid grid-cols-[108px_minmax(0,1fr)] gap-4 rounded border border-slate-200 bg-white p-4 transition hover:border-teal-500 hover:shadow-sm sm:grid-cols-1"
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex aspect-square items-center justify-center rounded bg-slate-50" }, /* @__PURE__ */ React.createElement("img", { src: service.image, alt: "", className: "max-h-20 max-w-20 object-contain" })),
      /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold text-slate-950 group-hover:text-teal-700" }, service.title), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-teal-700" }, "\uC5F4\uAE30")), /* @__PURE__ */ React.createElement("p", { className: "mt-2 text-sm leading-6 text-slate-600" }, service.description), /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex flex-wrap gap-2" }, service.tags.map((tag) => /* @__PURE__ */ React.createElement("span", { key: tag, className: "rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600" }, tag))))
    )))));
  }
  ReactDOM.render(/* @__PURE__ */ React.createElement(WebR2ServicesApp, null), document.getElementById("div_main"));
}
