function set_main() {
  const services = [
    {
      key: "pubmed-wordcloud",
      title: "PubMed wordcloud",
      description: "PubMed 초록을 가져와 WebAssembly R에서 단어 빈도를 계산하고 wordcloud로 표시합니다.",
      href: "/webr/pubmed-wordcloud/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/webr/advanced_pubmed.png",
      tags: ["PubMed", "wordcloud", "WebAssembly"],
    },
    {
      key: "meta-analysis",
      title: "메타분석",
      description: "연속형, 이분형, 효과크기 데이터를 WebAssembly R에서 고정효과와 랜덤효과 모델로 분석합니다.",
      href: "/webr/meta-analysis/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/webr/advanced_meta.png",
      tags: ["Meta-analysis", "forest plot", "WebAssembly"],
    },
    {
      key: "roc-analysis",
      title: "ROC 분석",
      description: "이분형 결과와 예측 점수를 이용해 AUC, 최적 절단값, 민감도와 특이도를 계산합니다.",
      href: "/webr/roc-analysis/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_006.jpg",
      tags: ["ROC", "AUC", "cutoff"],
    },
    {
      key: "survival-psm",
      title: "생존분석과 PSM",
      description: "Kaplan-Meier 생존곡선, log-rank 검정, propensity score matching 균형표를 만듭니다.",
      href: "/webr/survival-psm/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/webr/advanced_survival.png",
      tags: ["Survival", "PSM", "WebAssembly"],
    },
    {
      key: "conditional-process",
      title: "조건부 과정 분석",
      description: "매개, 조절, 조절된 매개 모형의 회귀계수와 부트스트랩 간접효과를 계산합니다.",
      href: "/webr/conditional-process/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/webr/advanced_processR.png",
      tags: ["Mediation", "Moderation", "processR"],
    },
    {
      key: "propensity-score-matching",
      title: "Propensity Score Matching",
      description: "성향점수를 추정하고 최근접 매칭 전후 공변량 균형과 결과 차이를 확인합니다.",
      href: "/webr/propensity-score-matching/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/webr/propensity_score_matching.png",
      tags: ["PSM", "balance", "matching"],
    },
    {
      key: "ggplot2",
      title: "웹에서 하는 ggplot2",
      description: "CSV 데이터를 WebR에서 요약하고 산점도, 막대그래프, 상자그림을 브라우저에서 그립니다.",
      href: "/webr/ggplot2/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/webr/ggplot2new.png",
      tags: ["ggplot2", "plot", "WebAssembly"],
    },
    {
      key: "sample-size",
      title: "샘플 수의 계산",
      description: "평균, 비율, 두 군 비교의 표본 수와 검정력을 WebR로 계산합니다.",
      href: "/webr/sample-size/",
      image: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/webr/sampleSize.png",
      tags: ["sample size", "power", "clinical trial"],
    },
  ];

  function WebR2ServicesApp() {
    return (
      <div className="min-h-[calc(100vh-130px)] bg-slate-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
          <header className="border-b border-slate-200 pb-5">
            <h1 className="text-3xl font-bold text-slate-950 sm:text-2xl">Web-R 2.0</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              브라우저에서 R을 실행하는 WebAssembly 기반 서비스 목록입니다.
            </p>
          </header>

          <main className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {services.map((service) => (
              <a
                key={service.key}
                href={service.href}
                className="group grid grid-cols-[108px_minmax(0,1fr)] gap-4 rounded border border-slate-200 bg-white p-4 transition hover:border-teal-500 hover:shadow-sm sm:grid-cols-1"
              >
                <div className="flex aspect-square items-center justify-center rounded bg-slate-50">
                  <img src={service.image} alt="" className="max-h-20 max-w-20 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-slate-950 group-hover:text-teal-700">{service.title}</h2>
                    <span className="text-sm font-semibold text-teal-700">열기</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </main>
        </div>
      </div>
    );
  }

  ReactDOM.render(<WebR2ServicesApp />, document.getElementById("div_main"));
}
