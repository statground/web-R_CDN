function Btn_submit_check_enabled(props) {
	return(
		<button type="button" id="btn_submit_check" class={class_btn_disabled}
				onClick={() => click_btn_submit_check()}>
			수강신청
		</button>
	)
}