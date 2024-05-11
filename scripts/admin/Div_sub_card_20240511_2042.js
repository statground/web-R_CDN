function Div_sub_card(props) {
	return (
		<div class="flex flex-col items-center justify-center p-4">
			<dt class="text-3xl font-extrabold">
				{props.value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",") }{props.unit}
			</dt>
			<dd class="font-light text-gray-500">
				{props.title}
			</dd>
			{
				props.subvalue != null
				?   <dd class="font-light text-gray-500">
						({props.subtitle}: {props.subvalue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,",")}
						{
							props.subunit == null
							?   props.unit
							:   props.subunit
						})
					</dd>
				:   null
			}

		</div>
	)
}