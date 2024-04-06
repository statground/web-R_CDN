function Div_main_Error(props) {
	return (
		<div class="flex flex-col justify-center items-center w-full">
			<div class="flex flex-col justify-start items-center w-[500px] p-[40px] space-y-[24px]
						sm:w-[380px] sm:p-[16px]">
	
				<Div_main_header />
	
				<div class="flex flex-col justify-center items-center text-start w-full">
					{props.text}
				</div>

				<div id="btn_submit" class="w-full">
					<Div_btn_submit class={class_btn_enabled} function={() => location.href="/account/change_password/"} text={"재시도"} />
				</div>
	
				<div class="flex justify-center items-center w-full">
					<svg width="420" height="2" viewBox="0 0 420 2" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 1H420" stroke="#262626"/>
					</svg>
				</div>
			</div>
		</div>
	)
}