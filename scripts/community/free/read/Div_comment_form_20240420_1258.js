function Div_comment_form(props) {
	return (
		<div class={props.class}>
			<p class="flex flex-row underline">
				{props.title}
			</p>
			<div id={
						props.uuid_comment == null
						?   "div_community_read_comment_new_form"
						:   "div_community_read_comment_new_" + props.uuid_comment + "_form"
					}
				 class="w-full"></div>
			<div class="w-full" id={
										props.uuid_comment == null
										? "div_comment_editor_footer_button_new"
										: "div_comment_editor_footer_button_" + props.uuid_comment
								   }>
				<Div_comment_editor_footer text={"등록"} uuid_comment={props.uuid_comment}
										   function={() => click_btn_submit_comment(props.uuid_comment)} />
			</div>
		</div>
	)
}