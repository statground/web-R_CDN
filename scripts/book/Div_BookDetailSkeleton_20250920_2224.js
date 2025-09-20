// Common skeleton parts
const SkelLine = ({ w = '100%', h = 12, r = 8, style = {} }) => (
  <div className="bg-gray-200 animate-pulse" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

const SkelBox = ({ w = '100%', h = 120, r = 12, style = {} }) => (
  <div className="bg-gray-200 animate-pulse" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

function Div_BookDetailSkeleton() {
  const [isDesktop, setIsDesktop] = React.useState(
	typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  React.useEffect(() => {
	let rafId = null;
	const onResize = () => {
	  if (rafId) cancelAnimationFrame(rafId);
	  rafId = requestAnimationFrame(() => {
		const next = window.innerWidth >= 1024;
		setIsDesktop(next);
	  });
	};
	window.addEventListener('resize', onResize, { passive: true });
	return () => {
	  if (rafId) cancelAnimationFrame(rafId);
	  window.removeEventListener('resize', onResize);
	};
  }, []);

  // Dynamic layout values based on isDesktop
  const coverWidth = isDesktop ? '320px' : '100%';
  const coverHeight = isDesktop ? 520 : '0';
  const coverPaddingBottom = isDesktop ? '0' : '150%';
  const priceGridCols = isDesktop ? 'grid-cols-3' : 'grid-cols-2';
  const recoGridCols = isDesktop ? 'grid-cols-4' : 'grid-cols-2';
  const metaWidth1 = isDesktop ? '60%' : '65%';
  const metaWidth2 = isDesktop ? '85%' : '92%';
  const tabWidths = isDesktop ? ['84px', '92px', '102px', '86px'] : ['90px', '98px', '106px', '92px'];
  const contentWidth1 = isDesktop ? '45%' : '60%';
  const contentWidth2 = isDesktop ? '95%' : '100%';
  const contentWidth3 = isDesktop ? '88%' : '92%';
  const contentWidth4 = isDesktop ? '70%' : '80%';
  const priceLineWidth = isDesktop ? '45%' : '55%';
  const recoLineWidth1 = isDesktop ? '90%' : '95%';
  const recoLineWidth2 = isDesktop ? '65%' : '70%';

  return (
	<main id="page-books-skeleton" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
	  <Div_page_header title={header_title} subtitle={header_subtitle} />
	  <section id="book-detail-skeleton" className="w-full">
		<div className={isDesktop ? 'flex gap-6 items-start' : 'flex flex-col gap-4 items-stretch'}>
		  {/* Cover */}
		  <aside id="skel-cover" className={isDesktop ? 'shrink-0' : 'w-full'} style={{ width: coverWidth }}>
			<div className="rounded-lg overflow-hidden">
			  <SkelBox h={coverHeight} style={{ paddingBottom: coverPaddingBottom }} />
			</div>
		  </aside>
		  {/* Right section (meta, price, tabs, recommendations) */}
		  <section id="skel-right" className={isDesktop ? 'flex-1 flex flex-col gap-4' : 'w-full'}>
			{/* Meta */}
			<div id="skel-meta" className="rounded-lg p-4 border border-gray-100">
			  <SkelLine w={metaWidth1} h={26} style={{ marginBottom: 10 }} />
			  <SkelLine w={metaWidth2} h={14} />
			</div>
			{/* Price comparison */}
			<div id="skel-price" className="rounded-lg p-4 border border-gray-100">
			  <SkelLine w="120px" h={18} style={{ marginBottom: 14 }} />
			  <div className={`grid ${priceGridCols} gap-3`}>
				{[0, 1, 2].map((i) => (
				  <div key={i} className="border border-gray-200 rounded-lg p-3">
					<SkelLine w={priceLineWidth} h={14} />
					<SkelLine w="100%" h={36} style={{ marginTop: 14, borderRadius: 10 }} />
				  </div>
				))}
			  </div>
			  <SkelLine w={isDesktop ? '60%' : '75%'} h={12} style={{ marginTop: 14 }} />
			</div>
			{/* Tabs & content */}
			<div id="skel-tabs" className="rounded-lg p-4 border border-gray-100">
			  <div className="flex gap-2 flex-wrap mb-3">
				{tabWidths.map((width, i) => (
				  <SkelLine key={i} w={width} h={30} />
				))}
			  </div>
			  <div>
				<SkelLine w={contentWidth1} h={16} style={{ marginBottom: 10 }} />
				<SkelLine w={contentWidth2} h={12} style={{ marginBottom: 8 }} />
				<SkelLine w={contentWidth3} h={12} style={{ marginBottom: 8 }} />
				<SkelLine w={contentWidth4} h={12} />
			  </div>
			</div>
			{/* Recommendations */}
			<div id="skel-reco" className="rounded-lg p-4 border border-gray-100">
			  <SkelLine w={isDesktop ? '180px' : '190px'} h={18} style={{ marginBottom: 14 }} />
			  <div className={`grid ${recoGridCols} gap-3`}>
				{[0, 1, 2, 3].map((i) => (
				  <div key={i}>
					<div className="w-full h-0 pb-[133%] bg-gray-200 rounded-lg animate-pulse"></div>
					<SkelLine w={recoLineWidth1} h={14} style={{ marginTop: 8, marginBottom: 6 }} />
					<SkelLine w={recoLineWidth2} h={12} />
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