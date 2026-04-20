// scripts/intro/intro/set_main.js
// Common_CDN 의 기존 intro/Div_main.js 가 업로드본에 없어서,
// 현재 intro IA/menu 구조를 기준으로 self-contained landing page 로 재구성한 버전

function Div_page_header(props) {
    return (
        <div class="flex flex-row w-full justify-start items-end text-start mb-8">
            <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
                <span class="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
            </h1>
            <p class="text-lg font-normal text-gray-500 sm:text-md pb-2">
                {props.subtitle}
            </p>
        </div>
    )
}

function set_main() {
    const QuickCard = ({ title, desc, href, icon }) => (
        <a
            href={href}
            class="flex flex-col justify-between items-start w-full h-full p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-blue-300 transition"
        >
            <div class="flex flex-row justify-start items-center w-full space-x-3 mb-4">
                <img src={icon} class="w-6 h-6 object-cover rounded" />
                <h3 class="text-lg font-extrabold text-gray-900">{title}</h3>
            </div>
            <p class="text-sm text-gray-600">{desc}</p>
        </a>
    );

    const ExternalLink = ({ title, href }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-700 hover:underline"
        >
            {title}
        </a>
    );

    function Div_main() {
        return (
            <div class="flex flex-col justify-center items-center py-8 px-20 w-full max-w-screen-xl mx-auto md:px-8 space-y-8">
                <div class="w-full max-w-screen-sm">
                    <Div_page_header title={"Web-R 소개"} subtitle={"서비스 안내"} />
                    <p class="text-gray-600 leading-7">
                        현재 Web-R 소개 영역의 정보구조를 기준으로, 자주 이동하는 경로를 한 화면에서 바로 접근할 수 있도록 정리했습니다.
                    </p>
                </div>

                <section class="w-full max-w-screen-sm space-y-4">
                    <h2 class="text-2xl font-extrabold text-gray-900">Web-R 접속</h2>
                    <div class="grid grid-cols-3 gap-4 md:grid-cols-1">
                        <QuickCard
                            title={"무료 서버 접속"}
                            desc={"기본 Web-R 서버에 접속합니다."}
                            href={"/webr/"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo.svg"}
                        />
                        <QuickCard
                            title={"정회원 서버 접속"}
                            desc={"정회원 전용 서버로 이동합니다."}
                            href={"/webr/member/"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo.svg"}
                        />
                        <QuickCard
                            title={"Web-R Notebook"}
                            desc={"브라우저 기반 Notebook 환경으로 이동합니다."}
                            href={"/webr/notebook/"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo.svg"}
                        />
                    </div>
                </section>

                <section class="w-full max-w-screen-sm space-y-4">
                    <h2 class="text-2xl font-extrabold text-gray-900">안내 및 정책</h2>
                    <div class="grid grid-cols-2 gap-4 md:grid-cols-1">
                        <QuickCard
                            title={"공지사항"}
                            desc={"서비스 공지와 운영 안내를 확인합니다."}
                            href={"/intro/notice/"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_notice.svg"}
                        />
                        <QuickCard
                            title={"정회원 가입"}
                            desc={"정회원 / VIP / 기관회원 가입 안내 및 결제를 진행합니다."}
                            href={"/intro/membership/"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_notice.svg"}
                        />
                        <QuickCard
                            title={"서비스 이용약관"}
                            desc={"서비스 이용약관을 확인합니다."}
                            href={"/intro/terms/"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_notice.svg"}
                        />
                        <QuickCard
                            title={"개인정보 보호 방침"}
                            desc={"개인정보 보호 방침을 확인합니다."}
                            href={"/intro/privates/"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_notice.svg"}
                        />
                    </div>
                </section>

                <section class="w-full max-w-screen-sm space-y-4">
                    <h2 class="text-2xl font-extrabold text-gray-900">함께 보기</h2>
                    <div class="grid grid-cols-3 gap-4 md:grid-cols-1">
                        <QuickCard
                            title={"커뮤니티"}
                            desc={"자유 게시판 / 묻고 답하기와 R-Blogger 글을 확인합니다."}
                            href={"/community/"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_free.svg"}
                        />
                        <QuickCard
                            title={"의학논문 작성을 위한 R통계와 그래프"}
                            desc={"대표 도서 소개 페이지로 이동합니다."}
                            href={"/book/?sub=001"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_001.jpg"}
                        />
                        <QuickCard
                            title={"R을 이용한 조건부과정분석"}
                            desc={"대표 도서 소개 페이지로 이동합니다."}
                            href={"/book/?sub=002"}
                            icon={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_002.jpg"}
                        />
                    </div>
                </section>

                <section class="w-full max-w-screen-sm border border-gray-200 rounded-xl p-6 bg-white space-y-3">
                    <h2 class="text-xl font-extrabold text-gray-900">외부 링크</h2>
                    <div class="flex flex-col justify-center items-start space-y-2 text-sm">
                        <ExternalLink title={"다음 카페 Biometrika"} href={"https://cafe.daum.net/biometrika"} />
                        <ExternalLink title={"통계마당"} href={"https://www.statground.net"} />
                        <ExternalLink title={"통계마당 페이스북 그룹"} href={"https://www.facebook.com/groups/statground"} />
                        <ExternalLink title={"Futuredu"} href={"https://www.futuredu.kr"} />
                    </div>
                </section>
            </div>
        );
    }

    ReactDOM.render(<Div_main />, document.getElementById("div_main"));
}

window.set_main = set_main;
