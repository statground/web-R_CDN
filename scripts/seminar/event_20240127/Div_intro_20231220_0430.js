function Div_intro() {
	return (
		<div class="relative bg-[#CDE6E1] bg-no-repeat bg-cover bg-center py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-1">
			<div class="mb-6 max-w-screen-lg lg:mb-0 space-y-8">
				<div class="flex flex-col font-light text-xl md:text-md">
					<p>
						<mark class="px-2 text-white bg-blue-600 rounded">성향점수분석기법</mark>은 무작위임상연구(randomized clinical trial, RCT) 데이터가 아닌 관측연구(observational study) 데이터를 기반으로 인과관계를 추정할 때 사용할 수 있는 분석기법입니다.
					</p>
					<p>
						이 기법은 통상적 방법의 회귀분석 기법의 문제점을 극복하고 보다 타당한 인과관계를 추정하는 분석기법으로 윤리적 문제나 현실적 한계로 RCT를 실시하기 어려운 경우 선택할 수 있는 매우 유용한 기법입니다.
					</p>

					<br/>

					<p>
						Web of Science 데이터베이스에서 propensity score를 키워드로 논문을 찾아보면 2000년에는 65편에 불과하였으나 2012년에는 1,000편이 넘었고(1,073편) 이후 기하급수적으로 증가하여 2022년에는 7,732편의 논문에서 propensity score 키워드를 찾을 수 있습니다.
					</p>
					<p>
						<span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-700">웹에서 하는 R통계</span>에서는 성향점수분석 기법을 사용하여 데이터를 분석하고자 하는 연구자들이 성향점수분석기법을 이해하고 보다 쉽게 자신의 데이터를 분석할 수 있도록 필요한 R 패키지 및 샤이니 앱을 개발하였으며 이를 기반으로 <span class="underline underline-offset-1 decoration-8 decoration-blue-400">R을 이용한 성향점수 분석</span> 워크샵을 개최합니다.
					</p>

					<div class="flex flex-row justify-center items-center w-full mt-4">
						<img src="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/banner/event_20240127_graph.png" class="w-1/2 md:w-full" />
					</div>

					<br/>

					<p>
						이번 워크샵에는 <span class="underline underline-offset-1 decoration-8 decoration-blue-400">R기반 성향점수분석</span>(한나래, 2021)의 저자이신 백영민 교수의 강의와 웹에서 하는 R통계를 운영하고 있는 문건웅 교수의 강의가 준비되어 있습니다.
					</p>
					<p>
						<span class="underline underline-offset-1 decoration-8 decoration-green-400">2024년 1월 27일 토요일</span> 4시간 동안 진행되는 이번 워크샵은 나의 데이터를 성향점수 분석기법을 사용하여 분석할 수 있는 좋은 기회가 될 것입니다.
					</p>
				</div>
			</div> 
			<div class="grid grid-cols-4 gap-8 pt-8 lg:pt-12 mt-8 lg:mt-12 border-t border-gray-600 md:grid-cols-2">
				<div clsss="flex flex-col justify-center items-center text-center w-full">
					<h2 class="mb-1 text-lg font-bold text-center">일시</h2>
					<p class="mb-1 text-md text-center">
						2024년 1월 27일(토요일)
						<br/>
						오후 1시 ~ 5시
					</p>
				</div>
				<div clsss="flex flex-col justify-center items-center text-center w-full">
					<h2 class="mb-1 text-lg font-bold text-center">장소</h2>
					<p class="mb-1 text-md text-center">
						위플레이스 강남2호점
						<br/>
						(서울시 서초구 서초대로73길 타임빌딩 B1)
					</p>
					<p onClick={() => window.open("https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EC%84%9C%EC%B4%88%EA%B5%AC%20%EC%84%9C%EC%B4%88%EB%8C%80%EB%A1%9C73%EA%B8%B8%209/address/14140384.0996096,4508794.9366587,%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EC%84%9C%EC%B4%88%EA%B5%AC%20%EC%84%9C%EC%B4%88%EB%8C%80%EB%A1%9C73%EA%B8%B8%209,new?c=18.14,0,0,0,dh&isCorrectAnswer=true")}
					   class="flex flex-row justify-center items-center text-center w-full text-md font-semibold text-blue-500 hover:underline cursor-pointer">
						위치 자세히 보기
						<svg class="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
					</p>
				</div>
				<div clsss="flex flex-col justify-center items-center text-center w-full">
					<h2 class="mb-1 text-lg font-bold text-center">강의 교재</h2>
					<p class="mb-1 text-md text-center">
						R 기반 성향점수분석
						<br/>
						(백영민, 한나래, 2021)
					</p>
					<p onClick={() => window.open("https://search.shopping.naver.com/book/catalog/32503408989?query=R%20%EA%B8%B0%EB%B0%98%20%EC%84%B1%ED%96%A5%EC%A0%90%EC%88%98%EB%B6%84%EC%84%9D&NaPm=ct%3Dlqcpcym8%7Cci%3D5c5cb49f56f7ef360a46c33a1d1c84c625e6f03b%7Ctr%3Dboksl%7Csn%3D95694%7Chk%3Dec37ebef3387104c5a921ccfa9c46a4bbcedeb4a")}
					   class="flex flex-row justify-center items-center text-center w-full text-md font-semibold text-blue-500 hover:underline cursor-pointer">
						교재 자세히 보기
						<svg class="ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
					</p>
				</div>
				<div clsss="flex flex-col justify-center items-center text-center w-full">
					<h2 class="mb-1 text-lg font-bold text-center">수강료</h2>
					<p class="mb-1 text-md text-center">
						일반: 20만원
						<br/>
						Web-R 회원: 15만원
					</p>
				</div>
			</div>
		</div>
	)
}