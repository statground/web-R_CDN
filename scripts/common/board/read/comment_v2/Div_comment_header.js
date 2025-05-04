// Component: Header for each comment (user, date, secret marker, "my comment" marker)
function Div_comment_header(props) {
    return (
        <div class="flex flex-row justify-start items-center space-x-2">
            <Span_btn_user user_nickname={props.data.user_nickname} role={props.data.user_role} />
            <Span_btn_date date={props.data.created_at} />
            <Span_btn_comment_secret toggle={props.data.is_secret} />
            <Span_btn_my_comment toggle={props.data.check_comment_reader} />
        </div>
    );
}
