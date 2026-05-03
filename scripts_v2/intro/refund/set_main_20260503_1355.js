function set_main() {
  function Div_main() {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
          <div className="mx-auto mb-10 max-w-screen-lg text-center">
            <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900">환불 정책</h2>
            <p className="text-gray-600">정회원 결제와 관련한 환불 기준 안내입니다.</p>
          </div>
          <div className="mx-auto max-w-screen-lg space-y-4 rounded-2xl border border-gray-200 p-8 text-left leading-7 text-gray-700">
            <p>서비스 결제 후 환불이 필요한 경우 운영자에게 문의해 주세요.</p>
            <p>실제 승인·정산 상태와 주문 로그를 기준으로 처리되며, 웹사이트/카드사/가상계좌 상태를 함께 확인합니다.</p>
            <p>중복 결제, 승인 실패, 웹훅 반영 지연 같은 예외 상황은 서버 로그와 결제사 응답을 기준으로 보정합니다.</p>
            <p>문의는 공지사항 또는 운영 채널을 통해 접수해 주세요.</p>
          </div>
        </div>
      </section>
    );
  }

  ReactDOM.render(<Div_main />, document.getElementById("div_main"));
}
