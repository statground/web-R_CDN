function Div_calendar_grid() {
	return (
		<div class="grid grid-cols-4 gap-8 md:grid-cols-2">
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
					Web-R 정회원: 15만원
				</p>
			</div>
		</div>
	)
}