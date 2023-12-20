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
			
			<Div_calendar_grid />
			
		</div>
	)
}