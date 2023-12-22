// 등급별 멤버 수 Skeleton
function Div_statistics_group_skeleton() {
	return (
		<div class="p-4 bg-white rounded-lg text-center md:p-8 animate-pulse">
			<Div_sub_title title={"등급별 멤버 수"} />
		
			<div class="w-full bg-white rounded-lg shadow">
				<div class="p-4 bg-white rounded-lg text-center md:p-8">
					<dl class="grid grid-cols-4 w-full gap-8 p-4 mx-auto text-gray-900 md:grid-cols-1 md:p-8 animate-pulse">
						<Div_sub_card_skeleton title={"기관회원"} />
						<Div_sub_card_skeleton title={"VIP회원"} />
						<Div_sub_card_skeleton title={"정회원"} />
						<Div_sub_card_skeleton title={"준회원"} />
					</dl>
				</div>
			</div>
		</div>
	)
}