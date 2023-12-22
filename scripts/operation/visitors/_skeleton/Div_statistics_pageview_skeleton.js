// 페이지 뷰 Skeleton
function Div_statistics_pageview_skeleton() {
	return (
		<div class="p-4 bg-white rounded-lg text-center md:p-8 animate-pulse">
			<Div_sub_title title={"페이지 뷰"} />
		
			<div class="w-full bg-white border border-gray-200 rounded-lg shadow">
				<div class="p-4 bg-white rounded-lg text-center md:p-8">
					<dl class="grid grid-cols-4 w-full gap-8 p-4 mx-auto text-gray-900 md:grid-cols-1 md:p-8 animate-pulse">
						<Div_sub_card_skeleton title={"총 페이지 뷰"} />
						<Div_sub_card_skeleton title={"올해 총 페이지 뷰"} />
						<Div_sub_card_skeleton title={"이번 달 페이지 뷰"} />
						<Div_sub_card_skeleton title={"오늘 페이지 뷰"} />
					</dl>
				</div>
			</div>
		</div>
	)
}