function Div_main_skeleton(props) {    
	return (
		<div class="grid grid-cols-12 md:grid-cols-1 justify-center item-center w-full px-[100px] py-[20px] md:px-[10px] md:grid-cols-1">
			<Div_operation_menu />

		  <div className="col-span-10 flex flex-col space-y-8">
			{Array.from({ length: 4 }).map((_, idx) => (
			  <div
				key={idx}
				className="w-full bg-white border border-gray-200 rounded-lg shadow animate-pulse"
			  >
				<div className="p-6">
				  <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
				  <div className="h-[350px] w-full bg-gray-100 rounded"></div>
				</div>
			  </div>
			))}
		  </div>
		</div>
	)
}