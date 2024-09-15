function Div_comment_depth1_button_list_loading(props) {
	return (
		<div class="flex items-center space-x-4">
			{
				check_agree_comment(props.is_secret, props.check_reader)
				&&   <Div_btn_comment_footer_loading text={"대댓글"} />
			}
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