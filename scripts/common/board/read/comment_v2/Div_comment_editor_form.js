// Component: Form for editing an existing comment (replaces the comment content area when editing)
function Div_comment_editor_form(props) {
    return (
        <div class="w-full">
            <div class="w-full" id={"div_comment_editor_main_" + props.uuid_comment}></div>
            <Div_comment_editor_footer uuid_comment={props.uuid_comment} onSubmit={() => click_btn_submit_edit_comment(props.uuid_comment)} />
        </div>
    );
}
