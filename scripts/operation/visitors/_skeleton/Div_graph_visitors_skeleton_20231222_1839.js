// 방문 추이 Skeleton
function Div_graph_visitors_skeleton() {
	return (
		<div class="p-4 bg-white rounded-lg md:p-8 text-center animate-pulse" id="div_graph_visitors_container">
			<Div_sub_title title={"방문 추이 그래프"} />
		
			<div class="mb-4 border-b border-gray-200">
				<ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="tab_list_graph">
					<li class="mr-2">
						<button class={class_tab_enabled} id="tab_graph_monthly" type="button" 
								onClick={() => get_graph_visitors('monthly')}>
							월
						</button>
					</li>
					<li class="mr-2">
						<button class={class_tab_disabled} id="tab_graph_yearly" type="button"
								onClick={() => get_graph_visitors('yearly')}>
							년
						</button>
					</li>
				</ul>
			</div>
			<div id="tab_content_graph">
				<div class="p-4 rounded-lg bg-gray-50 w-full" id="graph_monthly">
					<Div_graph_skeleton />
				</div>
				<div class="hidden" id="graph_yearly">
					<Div_graph_skeleton />
				</div>
			</div>
		</div>
	)
}