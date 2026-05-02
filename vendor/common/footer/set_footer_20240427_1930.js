function set_footer() {
  const operatorText = (data_footer && data_footer.administrator) || "Web-R 운영자: 문건웅";

  function FooterLinks() {
    return (
      <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 text-sm text-gray-700 md:justify-end">
        <a href="/intro/notice/" className="hover:text-blue-700 hover:underline">공지사항</a>
        <a href="/intro/" className="hover:text-blue-700 hover:underline">회사 소개</a>
        <a href="/intro/terms/" className="hover:text-blue-700 hover:underline">서비스 이용약관</a>
        <a href="/intro/privates/" className="hover:text-blue-700 hover:underline">개인정보 보호 방침</a>
      </div>
    );
  }

  function SocialLinks() {
    const links = [
      { title: "통계마당", url: "https://www.statground.net" },
      { title: "Facebook Group", url: "https://www.facebook.com/groups/statground" },
      { title: "Biometrika", url: "https://cafe.daum.net/biometrika" },
      { title: "Futuredu", url: "https://www.futuredu.kr" },
      { title: "문의 메일", url: "mailto:cs@statground.net" },
    ];

    return (
      <div className="flex flex-wrap items-center justify-center gap-4 pt-6 text-sm text-gray-700">
        {links.map((item) => (
          <a
            key={item.title}
            href={item.url}
            target={item.url.startsWith("mailto:") ? undefined : "_blank"}
            rel={item.url.startsWith("mailto:") ? undefined : "noreferrer"}
            className="hover:text-blue-700 hover:underline"
          >
            {item.title}
          </a>
        ))}
      </div>
    );
  }

  function Div_footer() {
    return (
      <div className="mx-auto w-full max-w-screen-2xl rounded-none border-0 bg-white px-4 py-8 text-gray-700 shadow-none sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 text-sm leading-7 text-gray-700">
            <p className="font-semibold text-gray-900">통계마당의 모든 컨텐츠는 저작권법에 의거 보호받고 있습니다.</p>
            <div className="pt-2">
              <p className="font-semibold text-gray-900">주식회사 통계마당</p>
              <p>대표, 개인정보보호책임자: 유재성 &nbsp;&nbsp;|&nbsp;&nbsp; {operatorText}</p>
              <p>사업자등록번호: 795-88-02574 &nbsp;&nbsp;|&nbsp;&nbsp; 통신판매업신고번호: 2024-서울강남-06145</p>
              <p>서울특별시 강남구 테헤란로70길 12, 402-106A호</p>
              <p>대표전화: 0507-1300-9704 &nbsp;&nbsp;|&nbsp;&nbsp; 문의: cs@statground.net</p>
            </div>
          </div>
          <FooterLinks />
        </div>
        <div className="mt-6 border-t border-gray-200"></div>
        <SocialLinks />
      </div>
    );
  }

  ReactDOM.render(<Div_footer />, document.getElementById("div_footer"));
}
