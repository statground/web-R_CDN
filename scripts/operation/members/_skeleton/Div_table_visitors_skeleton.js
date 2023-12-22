// 방문 추이 표
function Div_table_visitors_skeleton() {
	return (
		<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" id="div_table_visitors_container">
			<Div_sub_title title={"방문 추이 표"} />
		
			<div class="mb-4 border-b border-gray-200">
				<ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="tab_list_table">
					<li class="mr-2">
						<button class={class_tab_enabled} id="tab_table_daily" type="button"
								onClick={() => get_table_visitors('daily')}>
							일
						</button>
					</li>
					<li class="mr-2">
						<button class={class_tab_disabled} id="tab_table_monthly" type="button"
								onClick={() => get_table_visitors('monthly')}>
							월
						</button>
					</li>
					<li class="mr-2">
						<button class={class_tab_disabled} id="tab_table_yearly" type="button"
								onClick={() => get_table_visitors('yearly')}>
							년
						</button>
					</li>
				</ul>
			</div>
			<div id="tab_content_table">
				<div class="p-4 rounded-lg bg-gray-50 w-full" id="table_daily">
					<Div_table_skeleton />
				</div>
				<div class="hidden p-4 rounded-lg bg-gray-50 w-full" id="table_monthly">
					<Div_table_skeleton />
				</div>
				<div class="hidden p-4 rounded-lg bg-gray-50 w-full" id="table_yearly">
					<Div_table_skeleton />
				</div>
			</div>
		</div>
	)
}