// 가입자 수 Skeleton
function Div_statistics_count_skeleton() {
	return (
		<div class="p-4 bg-white rounded-lg text-center md:p-8 animate-pulse">
			<Div_sub_title title={"가입자 수"} />
		
			<div class="w-full bg-white rounded-lg shadow">
				<div class="p-4 bg-white rounded-lg text-center md:p-8">
					<dl class="grid grid-cols-4 w-full gap-8 p-4 mx-auto text-gray-900 md:grid-cols-1 md:p-8 animate-pulse">
						<Div_sub_card_skeleton title={"총 가입자 수"} />
						<Div_sub_card_skeleton title={"올해 가입자 수"} />
						<Div_sub_card_skeleton title={"이번 달 가입자 수"} />
						<Div_sub_card_skeleton title={"오늘 가입자 수"} />
					</dl>
				</div>
			</div>
		</div>
	)
}