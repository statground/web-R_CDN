function Div_main() {
  return (
    <div className="flex flex-col justify-center items-center py-12 px-6 max-w-screen-md mx-auto space-y-4">
      <Div_page_header title={header_title} subtitle={header_subtitle} />
      <div className="w-full bg-white border border-gray-200 rounded-xl p-8 space-y-4 shadow-sm">
        <p className="text-base leading-7 text-gray-700">
          Web-R은 웹 브라우저에서 R을 실행하고, 통계 분석 자료와 커뮤니티를 함께 제공하는 확장형 플랫폼입니다.
        </p>
        <p className="text-base leading-7 text-gray-700">
          현재 Go 백엔드와 외부 TiDB/ClickHouse 인프라를 기준으로 구조를 재구현하고 있으며, 기존 Django 홈페이지의 URL·화면 흐름·메뉴 체계를 최대한 보존하는 방향으로 개편 중입니다.
        </p>
      </div>
    </div>
  );
}
