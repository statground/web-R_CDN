function Div_sidelist_skeleton(props) {
	return (
		<div id={props.id} class="w-full">
			 <div class="flex flex-col justify-center items-center w-full space-y-2 border border-gray-200 p-4 rounded-xl">
				<Div_box_header title={props.title} />

				<div class="flex flex-col justify-center items-center w-full space-y-2 animate-pulse">
					<div class="h-2.5 bg-gray-200 rounded-full w-full"></div>
					<div class="h-2.5 bg-gray-200 rounded-full w-full"></div>
					<div class="h-2.5 bg-gray-200 rounded-full w-full"></div>
				</div>
			</div>
		</div>
	)
}