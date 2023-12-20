function Div_calendar() {
	return (
		<div class="relative py-8 px-4 mx-auto max-w-screen-xl lg:py-16 z-1 space-y-6 md:space-y-12">
			<Div_calendar_grid />

			<div class="relative overflow-x-auto">
				<table class="w-full text-sm text-left rtl:text-right">
					<thead class="text-xs text-gray-700 uppercase">
						<tr>
							<th scope="col" class="px-6 py-3 text-lg font-bold">
								강의 내용
							</th>
						</tr>
					</thead>
					<tbody>
						<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
							<th scope="row" class="flex flex-col px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								<p>13:00 ~ 15:00 / 백영민 교수</p>
								<p class="text-lg font-bold">성향점수 분석의 개념</p>
							</th>
						</tr>
						<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
							<th scope="row" class="flex flex-col px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								<p>15:00 ~ 15:40 / 문건웅 교수</p>
								<p class="text-lg font-bold">R을 이용한 성향점수 분석</p>
							</th>
						</tr>
						<tr class="bg-white dark:bg-gray-800">
							<th scope="row" class="flex flex-col px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								<p>15:40 ~ 16:20 / 문건웅 교수</p>
								<p class="text-lg font-bold">웹R을 이용한 성향점수분석 실습</p>
							</th>
						</tr>
						<tr class="bg-white dark:bg-gray-800">
							<th scope="row" class="flex flex-col px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								<p>16:20 ~ 17:00 / 문건웅 교수</p>
								<p class="text-lg font-bold">성향점수 분석의 확장 - 세 군 이상의 범주형 변수, 연속형 변수 대상</p>
							</th>
						</tr>
					</tbody>
				</table>
			</div>
			
		</div>
	)
}