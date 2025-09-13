/* global React, ReactDOM */
(function () {
  "use strict";

  var API_URL = "/book/ajax_get_book_list/";
  var MOUNT_ID = "div_book_list";

  var ICONS = {
    kyobo: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/kyobobook2.png",
    yes24: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/yes24.png",
    ypbooks: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/ypbooks.png",
    coupang: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/coupang.png",
    leanpub: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/LeanPub.png",
    bookdown: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/bookdown.png",
    board: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/menu_free.svg",
    default_vendor: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/icon_default.png",
    default_cover: "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/book/default_book.png"
  };

  function iconForSource(source) {
    var s = (source || "").toLowerCase();
    if (s.indexOf("교보") > -1) return ICONS.kyobo;
    if (s.indexOf("yes24") > -1) return ICONS.yes24;
    if (s.indexOf("영풍") > -1) return ICONS.ypbooks;
    if (s.indexOf("쿠팡") > -1) return ICONS.coupang;
    if (s.indexOf("leanpub") > -1) return ICONS.leanpub;
    if (s.indexOf("bookdown") > -1) return ICONS.bookdown;
    return ICONS.default_vendor;
  }
  function pad3(v) { return (v == null ? "000" : String(v)).padStart(3, "0"); }

  // 화살표 SVG (흰색)
  function ChevronLeftSVG(){return React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24","aria-hidden":"true"},
    React.createElement("path",{d:"M15 6l-6 6 6 6",fill:"none",stroke:"white",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"}));}
  function ChevronRightSVG(){return React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24","aria-hidden":"true"},
    React.createElement("path",{d:"M9 6l6 6-6 6",fill:"none",stroke:"white",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"}));}

  var cls = {
    wrap:"w-full",
    navWrap:"relative",
    navBtnBase:"absolute z-10 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black text-white shadow",
    navBtnL:"left-2",
    navBtnR:"right-2",
    slider:"flex gap-3 overflow-x-auto scroll-smooth pb-2",
    card:"flex flex-col justify-start w-64 min-w-64 h-48 p-3 rounded-xl shadow bg-white border hover:border-gray-900",
    img:"w-full object-contain rounded-md border bg-white", // 높이는 계산해서 inline style로 설정
    title:"font-semibold leading-snug text-center",
    meta:"text-xs text-gray-500 text-center",
    vendors:"w-full justify-center gap-2 flex-wrap items-center" // 가운데 정렬
  };

  // 데이터 가공
  function groupRows(raw){
    var rows = Array.isArray(raw) ? raw : Object.entries(raw).filter(function(kv){return kv[0]!=="0";}).map(function(kv){return kv[1];});
    var byBook=new Map();
    rows.forEach(function(r){
      var key=r.uuid||r.title||("rnd-"+Math.random().toString(16).slice(2));
      if(!byBook.has(key)){
        byBook.set(key,{uuid:r.uuid,uuid_board_category:r.uuid_board_category,title:r.title,publisher:r.publisher,published_at:r.published_at,url_image:r.url_image,randnum:r.randnum==null?Math.random():r.randnum,sources:{}});
      }
      if(r.source&&r.url){
        var s=String(r.source).trim();
        if(!byBook.get(key).sources[s]) byBook.get(key).sources[s]=[];
        byBook.get(key).sources[s].push(r.url);
      }
    });
    return Array.from(byBook.values()).map(function(b){
      return Object.assign({},b,{vendors:Object.entries(b.sources).map(function(_ref){var source=_ref[0],urls=_ref[1];return {source:source,url:urls[Math.floor(Math.random()*urls.length)]};})});
    }).sort(function(a,b){return (a.randnum||0)-(b.randnum||0);});
  }

  // 카드
  function CardComp(props){
    var b=props.b, idx=props.idx, activeIdx=props.activeIdx, setActiveIdx=props.setActiveIdx;

    var GAP_PX = 8;            // 섹션 간 고정 간격
    var MIN_IMG = 60;          // 표지 최소 높이 하한

    var hasVendors = Array.isArray(b.vendors) && b.vendors.length>0;
    var isOpen = activeIdx===idx && hasVendors;

    var cardRef = React.useRef(null);
    var titleRef = React.useRef(null);
    var metaRef  = React.useRef(null);
    var vendorsRef = React.useRef(null);
    var [imgH,setImgH]=React.useState(100); // 기본 이미지 높이

    function recalc(){
        if(!cardRef.current) return;
        var innerH = cardRef.current.clientHeight - 24; // padding 보정
        var titleH = (titleRef.current ? titleRef.current.offsetHeight : 0);
        var metaH  = (metaRef.current  ? metaRef.current.offsetHeight  : 0);

        var vH = 0;
        if(isOpen && vendorsRef.current){
            var prev = vendorsRef.current.style.display;
            vendorsRef.current.style.display = "flex";
            vH = vendorsRef.current.offsetHeight || 0;
            vendorsRef.current.style.display = prev;
        }

        var gaps = 2 + (isOpen ? 1 : 0);
        var leftover = innerH - (titleH + metaH + vH + gaps*GAP_PX);

        // 아이콘 열림 여부에 따라 조정
        if (isOpen) {
            // 아이콘이 열리면 이미지가 더 줄어들어 공간 확보
            setImgH(Math.max(MIN_IMG, leftover - 10));
        } else {
            // 닫힌 상태에서는 남는 공간을 다 이미지로 채움 (여백 최소화)
            setImgH(Math.max(MIN_IMG, leftover));
        }
    }

    React.useLayoutEffect(recalc, [isOpen]);
    React.useEffect(function(){
      function onResize(){ recalc(); }
      window.addEventListener("resize", onResize);
      var t=setTimeout(recalc,0);
      return function(){ window.removeEventListener("resize", onResize); clearTimeout(t); };
    }, []);

    function onToggle(){ setActiveIdx(function(p){return p===idx?null:idx;}); }
    function onKey(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); onToggle(); } }
    function goBoard(e){ e.stopPropagation(); window.open("/book/?sub="+pad3(b.uuid_board_category), "_self"); }

    return React.createElement("div",
      { ref:cardRef, className:cls.card, role:"button", tabIndex:0, onClick:onToggle, onKeyDown:onKey },
      React.createElement("img",{ className:cls.img, style:{height:imgH+"px"}, src:b.url_image||ICONS.default_cover, alt:b.title||"book", loading:"lazy" }),
      React.createElement("div",{ style:{height:GAP_PX+"px"} }),
      React.createElement("div",{ ref:titleRef, className:cls.title }, b.title||""),
      React.createElement("div",{ style:{height:GAP_PX+"px"} }),
      React.createElement("div",{ ref:metaRef, className:cls.meta },
        (b.publisher? b.publisher : " "), (b.published_at? " · "+b.published_at : "")
      ),
      (isOpen ? React.createElement("div",{ style:{height:GAP_PX+"px"} }) : null),
      React.createElement("div",{
          ref:vendorsRef,
          className:"purchase-buttons "+cls.vendors,
          style:{ display:isOpen?"flex":"none" },
          onClick:function(e){ e.stopPropagation(); }
        },
        (b.vendors||[]).map(function(v,i){
          return React.createElement("a",{ key:i, href:v.url, target:"_blank", rel:"noopener", title:v.source },
            React.createElement("img",{ className:"h-6 w-auto", src:iconForSource(v.source), alt:v.source, loading:"lazy" })
          );
        }),
        React.createElement("button",{ onClick:goBoard, title:"게시판", type:"button" },
          React.createElement("img",{ className:"h-6 w-auto", src:ICONS.board, alt:"게시판", loading:"lazy" })
        )
      )
    );
  }

  function DivBookList(){
    var [books,setBooks]=React.useState([]);
    var [activeIdx,setActiveIdx]=React.useState(null);

    React.useEffect(function(){
      fetch(API_URL).then(function(r){return r.json();})
        .then(function(raw){setBooks(groupRows(raw));})
        .catch(function(){setBooks([]);});
    },[]);

    React.useEffect(function(){
      var slider=document.getElementById("div_book_list_slider");
      if(!slider) return;
      function scrollByPage(d){ slider.scrollBy({left:d*slider.offsetWidth,behavior:"smooth"}); }
      var n=document.getElementById("div_book_list_next");
      var p=document.getElementById("div_book_list_prev");
      n&&n.addEventListener("click",function(){scrollByPage(+1);});
      p&&p.addEventListener("click",function(){scrollByPage(-1);});
      function wheel(e){ if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){ slider.scrollBy({left:e.deltaY}); e.preventDefault(); } }
      slider.addEventListener("wheel",wheel,{passive:false});
      return function(){ n&&n.removeEventListener("click",function(){scrollByPage(+1);}); p&&p.removeEventListener("click",function(){scrollByPage(-1);}); slider.removeEventListener("wheel",wheel); };
    },[books.length]);

    return React.createElement("div",{className:cls.wrap},
      React.createElement("div",{className:cls.navWrap},
        React.createElement("button",{id:"div_book_list_prev",className:cls.navBtnBase+" "+cls.navBtnL},React.createElement(ChevronLeftSVG)),
        React.createElement("button",{id:"div_book_list_next",className:cls.navBtnBase+" "+cls.navBtnR},React.createElement(ChevronRightSVG)),
        React.createElement("div",{id:"div_book_list_slider",className:cls.slider},
          books.map(function(b,idx){return React.createElement(CardComp,{key:b.uuid||idx,b:b,idx:idx,activeIdx:activeIdx,setActiveIdx:setActiveIdx});})
        )
      )
    );
  }

  window.get_book_list = function(){
    var mount=document.getElementById(MOUNT_ID);
    if(!mount) return;
    mount.innerHTML="";
    ReactDOM.render(React.createElement(DivBookList), mount);
  };
})();