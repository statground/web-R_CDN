function Div_textbox(props) {
	return (
		<div class="w-full space-y-[8px]">
			<span class="font-[500] text-[14px] w-full text-start">
				{props.title}
			</span>

			{
				props.type == "text"
				?   <input type="text" id={"txt_" + props.id}
						class="bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full
								focus:ring-gray-200 focus:border-gray-200" placeholder=""
								onkeydown={props.function} onKeyUp={props.function} required />
				:   <input type="password" id={"txt_" + props.id}
						class="bg-white border border-gray-900 text-gray-900 text-sm rounded-xl w-full
								focus:ring-gray-200 focus:border-gray-200" placeholder=""
								onkeydown={props.function} onKeyUp={props.function} required />
			}

			<div id={"desc_" + props.id + "_msg"} class="hidden"></div>
		</div>   
	)
}