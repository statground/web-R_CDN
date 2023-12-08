function Div_main_statistics_skeleton() {
	function Div_Sub(props) {
		return (
			<div class="flex items-center w-full w-max-md p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow" role="alert">
			<img src={props.svg} class="w-6 h-6" />
					<div class="pl-4 text-sm font-normal animate-pulse">
						<div class="h-2.5 bg-gray-300 rounded-full w-full mb-2.5"></div>
						<div class="w-32 h-2 bg-gray-200 rounded-full"></div>
					</div>
			</div>
		)
	}

	return (
		<div class="grid lg:grid-cols-3 md:grid-cols-1 mx-auto">
			<Div_Sub svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/member.svg" />
			<br/>
			<Div_Sub svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/visitors.svg" />
			<br/>
			<Div_Sub svg="https://cdn.jsdelivr.net/gh/statground/Statground_CDN/assets3/images/svg/pageview.svg" />
		</div>
	)
}