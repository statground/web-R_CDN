// ===== State & Constants =====
const MenuState = {
  hamburger: false,
  sections: {
    webr: false,
    community: false,
    book: false,
    workshop: false,
    intro: false,
  },
};

const MENUS = ["webr", "book", "workshop", "intro"];

// Tailwind class presets
const CLASS_PC_OPEN =
  "mt-1 bg-white border-gray-200 shadow-sm border-y block md:hidden";
const CLASS_MOBILE_OPEN =
  "flex flex-col w-full justify-center items-start px-[30px] pt-[10px] pb-[20px] space-y-4 border-b-4";
const CLASS_HIDDEN = "hidden";

// ===== Utilities =====
function closeAllMenus() {
  MENUS.forEach((menu) => {
    MenuState.sections[menu] = false;
    const pc = document.getElementById(`div_megamenu_${menu}`);
    const mobile = document.getElementById(`div_menu_mobile_${menu}`);
    if (pc) pc.className = CLASS_HIDDEN;
    if (mobile) mobile.className = CLASS_HIDDEN;
  });
}

function click_dropdown(id) {
  // If no id, just close all (used on backdrop/header clicks)
  if (!id) {
    closeAllMenus();
    return;
  }

  MENUS.forEach((menu) => {
    const isTarget = id === menu;
    const willOpen = isTarget && !MenuState.sections[menu];

    MenuState.sections[menu] = willOpen;

    const pc_element = document.getElementById(`div_megamenu_${menu}`);
    const mobile_element = document.getElementById(`div_menu_mobile_${menu}`);

    if (pc_element) pc_element.className = willOpen ? CLASS_PC_OPEN : CLASS_HIDDEN;
    if (mobile_element)
      mobile_element.className = willOpen ? CLASS_MOBILE_OPEN : CLASS_HIDDEN;
  });
}

function click_hamburger() {
  const menuMobile = document.getElementById("div_menu_mobile");
  MenuState.hamburger = !MenuState.hamburger;
  if (menuMobile) {
    menuMobile.className = MenuState.hamburger
      ? "hidden md:flex md:flex-col md:visible md:mt-[20px]"
      : "hidden";
  }
}

// ===== Header (AJAX + Render) =====
async function get_menu_header() {
  // Small safe-guard to ensure container exists
  const mount = document.getElementById("div_menu_sub_header");
  if (!mount) return;

  const data = await fetch("/ajax_get_menu_header/")
    .then((res) => res.json())
    .catch(() => ({ role: "", name: "" }));

  window.gv_role = data["role"] || "";
  console.log("*** role:", window.gv_role);

  function Div_sub_menu_header(props) {
    function Div_sub(props) {
      return (
        <a href={props.url} class="flex flex-row justify-center items-center hover:underline">
          {props.url_image != null && (
            <img src={props.url_image} class="size-4 mr-2" />
          )}
          {props.name}
        </a>
      );
    }

    const isLoggedIn = (window.gv_username || "") !== "";

    return (
      <div onClick={() => click_dropdown()} id="div_menu_sub_header"
           class="flex justify-center items-center w-full h-[35px]">
        {!isLoggedIn ? (
          <div class="flex flex-row justify-end items-center text-end text-sm space-x-4 w-full h-full px-[35px]">
            <Div_sub url={"/account/"} name={"로그인"} />
            <span>|</span>
            <Div_sub url={"/account/signup/"} name={"회원 가입"} />
          </div>
        ) : (
          <div class="flex flex-row justify-end items-center text-end text-sm space-x-4 w-full h-full px-[35px]">
            <Div_sub
              url={"/account/myinfo/"}
              name={props.data.name}
              url_image={
                "https://cdn.jsdelivr.net/gh/statground/statkiss_CDN/images/svg/header_user.svg"
              }
            />
            <span>|</span>

            <a
              href="/intro/membership/"
              class="flex flex-row justify-center items-center font-extrabold hover:underline"
            >
              {props.data.role}
              {props.data.role == "준회원" && (
                <div class="ml-2 animate-pulse">
                  <span class="font-extrabold text-red-500">(정회원 가입하기)</span>
                </div>
              )}
            </a>
            <span>|</span>

            {props.data.role == "관리자" && <Div_sub url={"/admin/"} name={"Admin Page"} />}
            {props.data.role == "관리자" && <span>|</span>}

            <Div_sub url={"/account/logout/"} name={"로그아웃"} />
          </div>
        )}
      </div>
    );
  }

  ReactDOM.render(<Div_sub_menu_header data={data} />, mount);
}

// ===== Menu Component =====
function Div_menu() {
  // Sub-components
  function Div_sub_hamburger() {
    return (
      <div
        class="flex items-center hidden md:flex md:visible"
        onClick={() => click_hamburger()}
      >
        <button
          type="button"
          class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg 
                 hover:bg-gray-100 
                 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Open main menu"
          aria-controls="div_menu_mobile"
          aria-expanded={MenuState.hamburger ? "true" : "false"}
        >
          <img
            src="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/menu_hamburger.svg"
            class="w-8 h-8"
            alt="Menu"
          />
        </button>
      </div>
    );
  }

  function Div_sub_menu_pc() {
    function Item(props) {
      return (
        <span
          class="flex flex-row justify-center items-center w-fit px-[24px] h-4/6 text-sm rounded-lg cursor-pointer hover:bg-blue-100"
          onClick={props.onClick}
          role="button"
          tabindex="0"
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && props.onClick()}
        >
          {props.name}
        </span>
      );
    }
    return (
      <div class="flex flex-row justify-cetner items-center visible md:hidden">
        <Item name={"Web-R 접속"} onClick={() => click_dropdown("webr")} />
        <Item name={"커뮤니티"} onClick={() => (location.href = "/community/")} />
        <Item name={"도서"} onClick={() => click_dropdown("book")} />
        <Item name={"워크샵"} onClick={() => click_dropdown("workshop")} />
        <Item name={"Web-R 소개"} onClick={() => click_dropdown("intro")} />
      </div>
    );
  }

  function Div_sub_menu_pc_title(props) {
    return (
      <div class="flex flex-row justify-center items-center bg-gray-100 border-b border-gray-300 shadow">
        <p class="text-xs text-gray-700">{props.title}</p>
      </div>
    );
  }

  function Div_sub_menu_pc_li(props) {
    return (
      <li class="flex flex-row justify-center items-center w-full">
        <a href={props.url} target={props.target} class="px-4 py-2 hover:bg-blue-100">
          {props.title}
        </a>
      </li>
    );
  }

  function Div_sub_menu_pc_li_img(props) {
    return (
      <li>
        <a
          href={props.url}
          class="flex flex-col justify-center items-center px-4 py-2 w-full hover:border hover:border-blue-300 hover:bg-blue-100"
        >
          <img src={props.img_url} class={"object-scale-down h-[80px] mb-2"} />
          {props.title}
        </a>
      </li>
    );
  }

  function Div_sub_menu_mobile_title(props) {
    return (
      <div
        class="flex flex-col justify-center items-start w-full h-[50px] px-[20px] cursor-pointer hover:bg-blue-200"
        onClick={props.onClick}
      >
        <span class="flex flex-row justify-center items-center">
          <img src={props.img_url} class="w-4 h-4 mr-2" />
          {props.title}
        </span>
      </div>
    );
  }

  function Div_sub_menu_mobile_li(props) {
    return (
      <div
        class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
        onClick={() => (location.href = props.url)}
      >
        <span class="flex flex-row w-full">- {props.title}</span>
      </div>
    );
  }

  function Div_sub_menu_mobile_li_img(props) {
    return (
      <div
        class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
        onClick={() => (location.href = props.url)}
      >
        <span class="flex flex-row w-full">
          <img src={props.img_url} class="w-4 h-4 mr-2" />
          {props.title}
        </span>
      </div>
    );
  }

  // Render
  return (
    <div class="flex flex-col">
      {/* clickable backdrop/header area to close menus */}
      <div onClick={() => click_dropdown()} id="div_menu_sub_header" class="w-full"></div>

      <nav class="flex flex-row justify-between bg-white border-gray-200 h-[50px] px-[200px] sm:px-[50px]">
        <a href="/" class="flex items-center text-xl font-bold">
          <img
            src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/logo/logo.png"
            class="object-scale-down h-10"
            alt="Statground Logo"
          />
        </a>
        <Div_sub_hamburger />
        <Div_sub_menu_pc />
      </nav>

		{/* PC megamenu: Web-R */}
		<div id="div_megamenu_webr" class="hidden">
		  <div class="flex justify-center max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600 space-x-12">
			<ul class="my-4 space-y-4">
			  <Div_sub_menu_pc_li_img
				url={"/webr/"}
				img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo_black.svg"}
				title={"무료 서버 접속"}
			  />
			</ul>

			<ul class="my-4 space-y-4">
			  <Div_sub_menu_pc_li_img
				url={"/webr/member/"}
				img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo.svg"}
				title={"정회원 서버 접속"}
			  />
			</ul>

			<ul class="my-4 space-y-4">
			  <Div_sub_menu_pc_li_img
				url={"/webr/notebook/"}
				img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_webr_notebook.svg"}
				title={"Web-R Notebook"}
			  />
			</ul>
		  </div>
		  <Div_sub_menu_pc_title title={"Web-R 접속"} />
		</div>


      {/* PC megamenu: Book */}
      <div id="div_megamenu_book" class="hidden">
        <div class="grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600">
          <ul class="my-4 space-y-4">
            <Div_sub_menu_pc_li_img
              url={"/book/?sub=001"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_001.jpg"}
              title={"의학논문 작성을 위한 R통계와 그래프"}
            />
            <Div_sub_menu_pc_li_img
              url={"/book/?sub=005"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_005.jpg"}
              title={"일반화가법모형 소개"}
            />
          </ul>
          <ul class="my-4 space-y-4">
            <Div_sub_menu_pc_li_img
              url={"/book/?sub=002"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_002.jpg"}
              title={"R을 이용한 조건부과정분석"}
            />
            <Div_sub_menu_pc_li_img
              url={"/book/?sub=006"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_006.jpg"}
              title={"밑바닥부터 시작하는 ROC 커브 분석"}
            />
          </ul>
          <ul class="my-4 space-y-4">
            <Div_sub_menu_pc_li_img
              url={"/book/?sub=003"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_003.jpg"}
              title={"웹에서 클릭만으로 하는 R통계분석"}
            />
            <Div_sub_menu_pc_li_img
              url={"/book/?sub=007"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_007.jpg"}
              title={"웹R을 이용한 통계분석"}
            />
          </ul>
          <ul class="my-4 space-y-4">
            <Div_sub_menu_pc_li_img
              url={"/book/?sub=004"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_004.jpg"}
              title={"Learning ggplot2 Using Shiny App"}
            />
            <Div_sub_menu_pc_li_img
              url={"/book/?sub=008"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_008.jpg"}
              title={"의료인을 위한 R 생존분석"}
            />
          </ul>
        </div>
        <Div_sub_menu_pc_title title={"도서"} />
      </div>


		{/* PC megamenu: Workshop */}
		<div id="div_megamenu_workshop" class="hidden">
		  <div class="flex justify-center max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600">
			<ul class="my-4 space-y-4">
			  <Div_sub_menu_pc_li_img
				url={"/workshop/youtube/"}
				img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_youtube.svg"}
				title={"유튜브"}
			  />
			</ul>
		  </div>
		</div>


      {/* PC megamenu: Intro */}
      <div id="div_megamenu_intro" class="hidden">
        <div class="grid grid-cols-4 max-w-full px-[200px] py-1 mx-auto text-sm text-gray-600">
          <ul class="my-4 space-y-4">
            <Div_sub_menu_pc_li_img
              url={"/intro/notice/"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_notice.svg"}
              title={"공지사항"}
            />
          </ul>
          <ul class="my-4 space-y-4">
            <Div_sub_menu_pc_li_img
              url={"/intro/membership/"}
              img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_membership.svg"}
              title={"정회원 가입"}
            />
          </ul>
          <ul class="my-4">
            <Div_sub_menu_pc_li title={"이용 약관"} url={"/intro/terms/"} target={"_self"} />
            <Div_sub_menu_pc_li title={"개인정보 보호 방침"} url={"/intro/privates/"} target={"_self"} />
            <Div_sub_menu_pc_li title={"환불 규정"} url={"/intro/refund/"} target={"_self"} />
          </ul>
          <ul class="my-4">
            <Div_sub_menu_pc_li title={"다음 카페 Biometrika"} url={"https://cafe.daum.net/biometrika"} target={"_blank"} />
            <Div_sub_menu_pc_li title={"통계마당"} url={"https://www.statground.net"} target={"_blank"} />
            <Div_sub_menu_pc_li title={"통계마당 페이스북 그룹"} url={"https://www.facebook.com/groups/statground"} target={"_blank"} />
            <Div_sub_menu_pc_li title={"Futuredu"} url={"https://www.futuredu.kr"} target={"_blank"} />
          </ul>
        </div>
        <Div_sub_menu_pc_title title={"Web-R 소개"} />
      </div>

      {/* Mobile menu (hidden by default; toggled by hamburger) */}
      <div id="div_menu_mobile" class="hidden">
        <Div_sub_menu_mobile_title
          title={"Web-R 접속"}
          onClick={() => click_dropdown("webr")}
          img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/R_logo.svg"}
        />
        <div id="div_menu_mobile_webr" class="hidden">
          <Div_sub_menu_mobile_li title={"무료 서버 접속"} url={"/webr/"} />
          <Div_sub_menu_mobile_li title={"정회원 서버 접속"} url={"/webr/member/"} />
          {/* Web-R Notebook (MOBILE NEW) */}
          <Div_sub_menu_mobile_li title={"Web-R Notebook"} url={"/webr/notebook/"} />
        </div>

        <a class="flex flex-col justify-center items-start w-full h-[50px] px-[20px] hover:bg-blue-200"
           href="/community/">
          <span class="flex flex-row justify-center items-center">
            <img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_free.svg" class="w-4 h-4 mr-2" />
            커뮤니티
          </span>
        </a>

        <Div_sub_menu_mobile_title
          title={"도서"}
          onClick={() => click_dropdown("book")}
          img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_book.svg"}
        />
        <div id="div_menu_mobile_book" class="hidden">
          <Div_sub_menu_mobile_li_img
            title={"의학논문 작성을 위한 R통계와 그래프"}
            url={"/book/?sub=001"}
            img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_001.jpg"}
          />
          <Div_sub_menu_mobile_li_img
            title={"R을 이용한 조건부과정분석"}
            url={"/book/?sub=002"}
            img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_002.jpg"}
          />
          <Div_sub_menu_mobile_li_img
            title={"웹에서 클릭만으로 하는 R통계분석"}
            url={"/book/?sub=003"}
            img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_003.jpg"}
          />
          <Div_sub_menu_mobile_li_img
            title={"Learning ggplot2 Using Shiny App"}
            url={"/book/?sub=004"}
            img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_004.jpg"}
          />
          <Div_sub_menu_mobile_li_img
            title={"일반화가법모형 소개"}
            url={"/book/?sub=005"}
            img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_005.jpg"}
          />
          <Div_sub_menu_mobile_li_img
            title={"밑바닥부터 시작하는 ROC 커브 분석"}
            url={"/book/?sub=006"}
            img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_006.jpg"}
          />
          <Div_sub_menu_mobile_li_img
            title={"웹R을 이용한 통계분석"}
            url={"/book/?sub=007"}
            img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_007.jpg"}
          />
          <Div_sub_menu_mobile_li_img
            title={"의료인을 위한 R 생존분석"}
            url={"/book/?sub=008"}
            img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/book_008.jpg"}
          />
        </div>

        <Div_sub_menu_mobile_title
          title={"워크샵"}
          onClick={() => click_dropdown("workshop")}
          img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_workshop.svg"}
        />
        <div id="div_menu_mobile_workshop" class="hidden">
          {/* <Div_sub_menu_mobile_li title={"워크샵"} url={"/workshop/"} /> */}
          <Div_sub_menu_mobile_li title={"유튜브"} url={"/workshop/youtube/"} />
        </div>

        <Div_sub_menu_mobile_title
          title={"Web-R 소개"}
          onClick={() => click_dropdown("intro")}
          img_url={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_notice.svg"}
        />
        <div id="div_menu_mobile_intro" class="hidden">
          <Div_sub_menu_mobile_li title={"공지사항"} url={"/intro/notice/"} />
          <Div_sub_menu_mobile_li title={"정회원 가입"} url={"/intro/membership/"} />

          <br />

          <Div_sub_menu_mobile_li title={"이용 약관"} url={"/intro/terms/"} />
          <Div_sub_menu_mobile_li title={"개인정보 보호 방침"} url={"/intro/privates/"} />
          <Div_sub_menu_mobile_li title={"환불 규정"} url={"/intro/refund/"} />

          <br />
          <div
            class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
            onClick={() => window.open("https://cafe.daum.net/biometrika")}
          >
            <span class="flex flex-row w-full">- 다음 카페 Biometrika</span>
          </div>
          <div
            class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
            onClick={() => window.open("https://www.statground.net")}
          >
            <span class="flex flex-row w-full">- 통계마당</span>
          </div>
          <div
            class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
            onClick={() => window.open("https://www.facebook.com/groups/statground")}
          >
            <span class="flex flex-row w-full">- 통계마당 페이스북 그룹</span>
          </div>
          <div
            class="flex justify-center items-start w-full h-[20px] cursor-pointer hover:bg-blue-100"
            onClick={() => window.open("https://www.futuredu.kr")}
          >
            <span class="flex flex-row w-full">- Futuredu</span>
          </div>
        </div>
      </div>
    </div>
  );
}


window.WebRMenu = {
  Div_menu,
  get_menu_header,
  click_dropdown, // if you need manual control elsewhere
};
