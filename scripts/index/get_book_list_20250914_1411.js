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
        if (s.indexOf("교보") > -1 || s.indexOf("kyobo") > -1) return ICONS.kyobo;
        if (s.indexOf("yes24") > -1) return ICONS.yes24;
        if (s.indexOf("영풍") > -1 || s.indexOf("ypbooks") > -1) return ICONS.ypbooks;
        if (s.indexOf("쿠팡") > -1 || s.indexOf("coupang") > -1) return ICONS.coupang;
        if (s.indexOf("leanpub") > -1) return ICONS.leanpub;
        if (s.indexOf("bookdown") > -1) return ICONS.bookdown;
        return ICONS.default_vendor;
    }
    function pad3(v) { return (v == null ? "000" : String(v)).padStart(3, "0"); }

    // 유틸: 응답을 안전하게 배열로 평탄화
    function normalizeRows(raw){
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw.data)) return raw.data;
        if (Array.isArray(raw.results)) return raw.results;
        if (Array.isArray(raw.rows)) return raw.rows;
        // 객체 맵 형태도 허용 (모든 키 포함)
        var arr = Object.keys(raw).map(function(k){ return raw[k]; });
        // 값들 중 배열 하나만 오는 케이스 (예: {items:[...]})
        var nestedArr = arr.find(Array.isArray);
        return Array.isArray(nestedArr) ? nestedArr : arr;
    }

    var cls = {
        wrap:"w-full pt-4",
        navWrap:"relative",
        navBtnBase:"absolute z-10 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-black text-white shadow",
        navBtnL:"left-2",
        navBtnR:"right-2",
        slider:"flex gap-3 overflow-x-scroll scroll-smooth pb-2 scrollbar-hide",
        card:"flex flex-col justify-start w-64 min-w-64 h-48 p-3 rounded-xl shadow bg-white border hover:border-gray-900",
        img:"w-full object-contain rounded-md border bg-white",
        title:"font-semibold leading-snug text-center",
        meta:"text-xs text-gray-500 text-center",
        vendors:"w-full justify-center gap-2 flex-wrap items-center"
    };

    // 데이터 가공 (marketplace 폴백 포함)
    function groupRows(raw){
        var rows = normalizeRows(raw);
        var byBook=new Map();

        rows.forEach(function(r){
        if (!r) return;
        var key=r.uuid||r.title||("rnd-"+Math.random().toString(16).slice(2));
        if(!byBook.has(key)){
            byBook.set(key,{
            uuid:r.uuid,
            uuid_board_category:r.uuid_board_category,
            title:r.title,
            publisher:r.publisher,
            published_at:r.published_at,
            url_image:r.url_image,
            randnum:r.randnum==null?Math.random():r.randnum,
            sources:{}
            });
        }
        var vendorName = (r.marketplace!=null && r.marketplace!=="") ? r.marketplace : r.source;
        if(vendorName && r.url){
            var s=String(vendorName).trim();
            if(!byBook.get(key).sources[s]) byBook.get(key).sources[s]=[];
            byBook.get(key).sources[s].push(r.url);
        }
        });

        return Array.from(byBook.values()).map(function(b){
        var vendors=Object.entries(b.sources).map(function(_ref){
            var source=_ref[0], urls=_ref[1];
            return {source:source, url:urls[Math.floor(Math.random()*urls.length)]};
        });
        return Object.assign({},b,{vendors:vendors});
        }).sort(function(a,b){return (a.randnum||0)-(b.randnum||0);});
    }

    // 화살표 SVG
    function ChevronLeftSVG(){return React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24","aria-hidden":"true"},
        React.createElement("path",{d:"M15 6l-6 6 6 6",fill:"none",stroke:"white",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"}));}
    function ChevronRightSVG(){return React.createElement("svg",{width:18,height:18,viewBox:"0 0 24 24","aria-hidden":"true"},
        React.createElement("path",{d:"M9 6l6 6-6 6",fill:"none",stroke:"white",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"}));}

    // 카드
    function CardComp(props){
        var b=props.b, idx=props.idx, activeIdx=props.activeIdx, setActiveIdx=props.setActiveIdx;

        var GAP_PX = 8, MIN_IMG = 60;
        var hasVendors = Array.isArray(b.vendors) && b.vendors.length>0;
        var isOpen = activeIdx===idx && hasVendors;

        var cardRef = React.useRef(null);
        var titleRef = React.useRef(null);
        var metaRef  = React.useRef(null);
        var vendorsRef = React.useRef(null);
        var [imgH,setImgH]=React.useState(100);

        function recalc(){
        if(!cardRef.current) return;
        var innerH = cardRef.current.clientHeight - 24;
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
        setImgH(Math.max(MIN_IMG, leftover - (isOpen?10:0)));
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
        fetch(API_URL)
            .then(function(r){ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
            .then(function(raw){
            var grouped = groupRows(raw);
            setBooks(grouped);
            })
            .catch(function(err){
            console.warn("book list fetch error:", err);
            setBooks([]);
            });
        },[]);

        React.useEffect(function(){
        var slider=document.getElementById("div_book_list_slider");
        if(!slider) return;
        function scrollByPage(d){ slider.scrollBy({left:d*slider.offsetWidth,behavior:"smooth"}); }
        var n=document.getElementById("div_book_list_next");
        var p=document.getElementById("div_book_list_prev");
        function next(){scrollByPage(+1);}
        function prev(){scrollByPage(-1);}
        n&&n.addEventListener("click",next);
        p&&p.addEventListener("click",prev);
        function wheel(e){ if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){ slider.scrollBy({left:e.deltaY}); e.preventDefault(); } }
        slider.addEventListener("wheel",wheel,{passive:false});
        return function(){ n&&n.removeEventListener("click",next); p&&p.removeEventListener("click",prev); slider.removeEventListener("wheel",wheel); };
        },[books.length]);

        return React.createElement("div",{className:cls.wrap},
        React.createElement("div",{className:cls.navWrap},
            React.createElement("button",{id:"div_book_list_prev",className:cls.navBtnBase+" "+cls.navBtnL},React.createElement(ChevronLeftSVG)),
            React.createElement("button",{id:"div_book_list_next",className:cls.navBtnBase+" "+cls.navBtnR},React.createElement(ChevronRightSVG)),
            React.createElement("div",{id:"div_book_list_slider",className:cls.slider},
            books.map(function(b,idx){return React.createElement(CardComp,{key:b.uuid||idx,b:b,idx:idx,activeIdx:activeIdx,setActiveIdx:setActiveIdx});})
            )
        ),
        (books.length===0 ? React.createElement("div",{className:"text-center text-sm text-gray-500 pt-2"}, "표시할 책이 없습니다.") : null)
        );
    }

    // 마운트 함수 (React 18/17 겸용)
    function mount(){
        var mountEl=document.getElementById(MOUNT_ID);
        if(!mountEl) return;
        mountEl.innerHTML="";
        if (ReactDOM.createRoot){
        ReactDOM.createRoot(mountEl).render(React.createElement(DivBookList));
        } else {
        ReactDOM.render(React.createElement(DivBookList), mountEl);
        }
    }

    // 전역 핸들러(수동 호출용)
    window.get_book_list = mount;

    // 자동 마운트: DOM 로드 후 대상 엘리먼트가 있으면 바로 렌더
    if (document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", function(){ if(document.getElementById(MOUNT_ID)) mount(); });
    } else {
        if(document.getElementById(MOUNT_ID)) mount();
    }
    })();
