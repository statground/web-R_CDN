function Div_main_event() {
	function Div_section(props) {
		return (
			<div class="flex flex-row justify-center text-center content-center">
				<div class="w-full p-8 mx-8 bg-white border border-gray-200 rounded-lg shadow">
					<h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900">
						{props.title}
					</h5>
					<p class="mb-3 font-normal text-gray-700">
						{props.subtitle}
					</p>
					<br/>
					<a href={props.url} class={props.class_btn}>
						바로가기
					</a>
				</div>
			</div>                    
		)
	}

	return (
		<div class="flex flex-row justify-center items-center w-full">
			<Div_section title={"정회원 등록/연장"} subtitle={"회원 등급 업그레이드가 편리해졌습니다."}
						 url="/membership/"
						 class_btn={"text-white bg-gradient-to-r from-purple-500 to-pink-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 cursor-pointer"} />
		</div>
	)
}