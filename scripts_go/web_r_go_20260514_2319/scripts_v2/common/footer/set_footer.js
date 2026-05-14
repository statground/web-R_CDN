let data_footer = {
  "company": "주식회사 통계마당",
  "representative": "대표, 개인정보보호책임자: 유재성",
  "registration_no": "사업자등록번호: 795-88-02574",
  "mail_order_no": "통신판매업신고번호: 2024-서울동작-0216",
  "address": "서울특별시 동작구 동작대로7길 48, 새한빌딩 502호",
  "phone": "대표전화: 0507-1300-9704",
  "email": "문의: cs@statground.net"
};

function set_footer(service) {
  const h = React.createElement;

  function FooterAddress() {
    return h("div", { className: "flex flex-col space-y-4 text-sm text-gray-600" },
      h("p", null, "통계마당의 모든 컨텐츠는 저작권법에 의거 보호받고 있습니다."),
      h("div", { className: "flex flex-col gap-1" },
        h("p", null, data_footer.company),
        h("p", null, data_footer.representative),
        data_footer.administrator != null ? h("p", null, data_footer.administrator) : null,
        h("p", null, data_footer.registration_no),
        h("p", null, data_footer.mail_order_no),
        h("p", null, data_footer.address),
        h("p", null, data_footer.phone + "　|　" + data_footer.email)
      )
    );
  }

  function FooterLink(props) {
    return h("li", null,
      h("a", {
        href: props.href,
        target: props.target || undefined,
        rel: props.target ? "noopener noreferrer" : undefined,
        className: "text-sm text-gray-600 hover:text-blue-700 hover:underline"
      }, props.children)
    );
  }

  function FooterMenu() {
    const links = service === "webr"
      ? [
          ["https://web-r.org/notice", "공지사항", "_blank"],
          ["/intro", "회사 소개", ""],
          ["https://web-r.org/foot_info", "서비스 이용약관", "_blank"],
          ["https://web-r.org/privates", "개인정보 보호 방침", "_blank"]
        ]
      : [
          ["/intro/notice/", "공지사항", ""],
          ["/intro/", "회사 소개", ""],
          ["/intro/terms/", "서비스 이용약관", ""],
          ["/intro/privates/", "개인정보 보호 방침", ""]
        ];
    return h("ul", { className: "flex flex-col items-start gap-3 text-left md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-x-6 md:gap-y-2 md:text-right" },
      links.map(function(link) {
        return h(FooterLink, { key: link[0], href: link[0], target: link[2] || undefined }, link[1]);
      })
    );
  }

  function Div_footer() {
    return h("div", { className: "w-full bg-white py-10" },
      h("div", { className: "mx-auto flex max-w-screen-xl flex-col gap-8 px-6 md:flex-row md:items-start md:justify-between md:px-4" },
        h(FooterAddress, null),
        h("div", { className: "pt-2" }, h(FooterMenu, null))
      )
    );
  }

  ReactDOM.render(h(Div_footer, null), document.getElementById("div_footer"));
}
