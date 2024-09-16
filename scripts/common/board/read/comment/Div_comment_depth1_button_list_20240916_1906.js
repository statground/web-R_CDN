function Div_comment_depth1_button_list(props) {
	return (
		<div class="flex items-center space-x-4">
			{
				gv_username != ''
				&&   <Div_btn_comment_footer text={"대댓글"} function={() => click_btn_reply_comment(props.data.uuid)} url_image={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_re_reply.svg"} />
			}
			{
				props.data.check_comment_reader != "user" && props.data.active == 1
				&&   <Div_btn_comment_footer text={"수정"} function={() => click_btn_edit_comment(props.data.uuid)} url_image={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg"} />
			}
			{
				props.data.check_comment_reader != "user" && props.data.active == 1
				&&  <Div_btn_comment_footer text={"삭제"} function={() => click_btn_delete_comment(props.data.uuid)} url_image={"https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg"} />
			}
		</div>
	)
}