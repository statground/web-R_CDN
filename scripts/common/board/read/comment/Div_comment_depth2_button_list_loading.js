function Div_comment_depth2_button_list_loading(props) {
	return (
		<div class="flex items-center space-x-4">
			{
				props.data.check_comment_reader != "user" && props.data.active == 1
				&&   <Div_btn_comment_footer_loading text={"수정"} />
			}
			{
				props.data.check_comment_reader != "user" && props.data.active == 1
				&&  <Div_btn_comment_footer_loading text={"삭제"} />
			}
		</div>
	)
}