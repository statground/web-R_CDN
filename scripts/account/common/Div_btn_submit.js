function Div_btn_submit(props) {
	return (
		<button type="button" onClick={props.function}
				class={props.class}>
		{props.text}
	</button>
	)
}