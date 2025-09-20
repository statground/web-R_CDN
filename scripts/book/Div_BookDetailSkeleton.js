/* 공통 스켈레톤 파츠 */
const SkelLine = ({w='100%', h=12, r=8, style={}}) =>
  <div className="bg-gray-200 animate-pulse" style={{width:w, height:h, borderRadius:r, ...style}} />;
const SkelBox  = ({w='100%', h=120, r=12, style={}}) =>
  <div className="bg-gray-200 animate-pulse" style={{width:w, height:h, borderRadius:r, ...style}} />;

/* ─────────────────────────────
   모바일 전용 스켈레톤 (세로 스택)
   ───────────────────────────── */
function SkeletonMobile(){
  return (
	<main id="page-books-skeleton" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
	  <Div_page_header title={header_title} subtitle={header_subtitle} />
	  <section id="book-detail-skeleton" className="w-full">
		<div className="flex flex-col gap-4 items-stretch">

		  {/* 표지 */}
		  <aside id="skel-cover" className="w-full">
			<div className="rounded-lg overflow-hidden">
			  <div className="w-full h-0 pb-[150%] bg-gray-200 animate-pulse"></div>
			</div>
		  </aside>

		  {/* 메타 */}
		  <div id="skel-meta" className="rounded-lg p-4 border border-gray-100">
			<SkelLine w="65%" h={26} style={{marginBottom:10}}/>
			<SkelLine w="92%" h={14}/>
		  </div>

		  {/* 가격 비교 (2열) */}
		  <div id="skel-price" className="rounded-lg p-4 border border-gray-100">
			<SkelLine w="120px" h={18} style={{marginBottom:14}}/>
			<div className="grid grid-cols-2 gap-3">
			  {[0,1,2].map(i=>(
				<div key={i} className="border border-gray-200 rounded-lg p-3">
				  <SkelLine w="55%" h={14}/>
				  <SkelLine w="100%" h={36} style={{marginTop:14,borderRadius:10}}/>
				</div>
			  ))}
			</div>
			<SkelLine w="75%" h={12} style={{marginTop:14}}/>
		  </div>

		  {/* 탭 & 본문 */}
		  <div id="skel-tabs" className="rounded-lg p-4 border border-gray-100">
			<div className="flex gap-2 flex-wrap mb-3">
			  <SkelLine w="90px"  h={30}/>
			  <SkelLine w="98px"  h={30}/>
			  <SkelLine w="106px" h={30}/>
			  <SkelLine w="92px"  h={30}/>
			</div>
			<div>
			  <SkelLine w="60%" h={16} style={{marginBottom:10}}/>
			  <SkelLine w="100%" h={12} style={{marginBottom:8}}/>
			  <SkelLine w="92%"  h={12} style={{marginBottom:8}}/>
			  <SkelLine w="80%"  h={12}/>
			</div>
		  </div>

		  {/* 추천 도서 (2→3열은 모바일에선 2열만) */}
		  <div id="skel-reco" className="rounded-lg p-4 border border-gray-100">
			<SkelLine w="190px" h={18} style={{marginBottom:14}}/>
			<div className="grid grid-cols-2 gap-3">
			  {[0,1,2,3].map(i=>(
				<div key={i}>
				  <div className="w-full h-0 pb-[133%] bg-gray-200 rounded-lg animate-pulse"></div>
				  <SkelLine w="95%" h={14} style={{marginTop:8,marginBottom:6}}/>
				  <SkelLine w="70%" h={12}/>
				</div>
			  ))}
			</div>
		  </div>

		</div>
	  </section>
	</main>
  );
}

/* ─────────────────────────────
   PC 전용 스켈레톤 (가로 2열: 좌 320px 고정, 우 가변)
   ───────────────────────────── */
function SkeletonDesktop(){
  return (
	<main id="page-books-skeleton" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
	  <Div_page_header title={header_title} subtitle={header_subtitle} />
	  <section id="book-detail-skeleton" className="w-full">
		{/* Tailwind 브레이크포인트 사용 안 함. flex로 강제 2열 */}
		<div className="flex gap-6 items-start">

		  {/* 좌측: 320px 고정 폭 */}
		  <aside id="skel-cover" className="shrink-0" style={{width:'320px'}}>
			<div className="rounded-lg overflow-hidden">
			  <SkelBox h={520}/>
			</div>
		  </aside>

		  {/* 우측: 가변 폭 */}
		  <section id="skel-right" className="flex-1 flex flex-col gap-4">

			{/* 메타 */}
			<div id="skel-meta" className="rounded-lg p-4 border border-gray-100">
			  <SkelLine w="60%" h={26} style={{marginBottom:10}}/>
			  <SkelLine w="85%" h={14}/>
			</div>

			{/* 가격 비교 (3열) */}
			<div id="skel-price" className="rounded-lg p-4 border border-gray-100">
			  <SkelLine w="120px" h={18} style={{marginBottom:14}}/>
			  <div className="grid grid-cols-3 gap-3">
				{[0,1,2].map(i=>(
				  <div key={i} className="border border-gray-200 rounded-lg p-3">
					<SkelLine w="45%" h={14}/>
					<SkelLine w="100%" h={36} style={{marginTop:14,borderRadius:10}}/>
				  </div>
				))}
			  </div>
			  <SkelLine w="60%" h={12} style={{marginTop:14}}/>
			</div>

			{/* 탭 & 본문 */}
			<div id="skel-tabs" className="rounded-lg p-4 border border-gray-100">
			  <div className="flex gap-2 flex-wrap mb-3">
				<SkelLine w="84px"  h={30}/>
				<SkelLine w="92px"  h={30}/>
				<SkelLine w="102px" h={30}/>
				<SkelLine w="86px"  h={30}/>
			  </div>
			  <div>
				<SkelLine w="45%" h={16} style={{marginBottom:10}}/>
				<SkelLine w="95%" h={12} style={{marginBottom:8}}/>
				<SkelLine w="88%" h={12} style={{marginBottom:8}}/>
				<SkelLine w="70%" h={12}/>
			  </div>
			</div>

			{/* 추천 도서 (4열) */}
			<div id="skel-reco" className="rounded-lg p-4 border border-gray-100">
			  <SkelLine w="180px" h={18} style={{marginBottom:14}}/>
			  <div className="grid grid-cols-4 gap-3">
				{[0,1,2,3].map(i=>(
				  <div key={i}>
					<div className="w-full h-0 pb-[133%] bg-gray-200 rounded-lg animate-pulse"></div>
					<SkelLine w="90%" h={14} style={{marginTop:8,marginBottom:6}}/>
					<SkelLine w="65%" h={12}/>
				  </div>
				))}
			  </div>
			</div>

		  </section>
		</div>
	  </section>
	</main>
  );
}

/* ─────────────────────────────
   화면 폭 감지해 스위칭 (Tailwind 의존 X)
   ───────────────────────────── */
function Div_BookDetailSkeleton(){
  const [isDesktop, setIsDesktop] = React.useState(
	typeof window !== 'undefined' ? window.innerWidth >= 1024 : true // 1024px 기준
  );

  React.useEffect(()=>{
	let rafId = null;
	const onResize = () => {
	  if (rafId) cancelAnimationFrame(rafId);
	  rafId = requestAnimationFrame(()=>{
		const next = window.innerWidth >= 1024; // PC 기준 폭
		setIsDesktop(next);
	  });
	};
	window.addEventListener('resize', onResize, { passive:true });
	return () => {
	  if (rafId) cancelAnimationFrame(rafId);
	  window.removeEventListener('resize', onResize);
	};
  }, []);

  return isDesktop ? <SkeletonDesktop/> : <SkeletonMobile/>;
}