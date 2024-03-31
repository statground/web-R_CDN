function Div_page_header(props) {
	return (
		<div class="flex flex-row w-full justify-start items-end text-start mb-8">
			<h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 mr-4 sm:text-3xl">
				<span class="underline underline-offset-3 decoration-8 decoration-blue-400">{props.title}</span>
			</h1>
			<p class="text-lg font-normal text-gray-500 sm:text-md pb-2">
				{props.subtitle}
			</p>
		</div> 
	)
}