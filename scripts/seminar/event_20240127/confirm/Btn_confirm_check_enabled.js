function Btn_confirm_check_enabled(props) {
	return(
		<button type="button" id="btn_confirm_check" class={class_btn_enabled}
				onClick={() => click_btn_confirm_check()}>
			수강신청 확인
		</button>
	)
}