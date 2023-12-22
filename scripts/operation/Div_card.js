function Div_card(props) {
	return (
		<div class="flex flex-col align-top">
			<dt class="mb-2 text-3xl font-extrabold">{props.value}{props.unit}</dt>
			<dd class="font-light text-gray-700 font-extrabold">{props.title}</dd>
			{
				props.sub != null
				?   <dd class="font-light text-sm text-gray-500">({props.sub}: {props.value_last}{props.unit})</dd>
				:   ""
			}
		</div>    
	)
}