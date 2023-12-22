// 방문자 수 Skeleton
function Div_statistics_visitors_skeleton() {
	return (
		<div class="p-4 bg-white rounded-lg text-center md:p-8 animate-pulse">
			<Div_sub_title title={"방문자 수"} />
		
			<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
				<div class="p-4 bg-white rounded-lg text-center md:p-8">
					<dl class="grid grid-cols-4 w-full gap-8 p-4 mx-auto text-gray-900 md:grid-cols-1 md:p-8 animate-pulse">
						<Div_sub_card_skeleton title={"방문자 수/일"} />
						<Div_sub_card_skeleton title={"올해 방문자 수/일"} />
						<Div_sub_card_skeleton title={"이번 달 방문자 수/일"} />
						<Div_sub_card_skeleton title={"오늘 방문자 수"} />
					</dl>
				</div>
			</div>
		</div>
	)
}