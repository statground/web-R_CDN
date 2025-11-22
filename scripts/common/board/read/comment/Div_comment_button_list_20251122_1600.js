function Div_comment_button_list(props) {
  const { data, depth, loading } = props;
  const isDepth1 = depth === 1;

  const ButtonComp = loading
    ? Div_btn_comment_footer_loading
    : Div_btn_comment_footer;

  return (
    <div class="flex items-center space-x-4">
      {/* depth1: 대댓글 버튼 */}
      {isDepth1 &&
        !loading &&
        gv_username !== "" && (
          <ButtonComp
            text={"대댓글"}
            function={() => click_btn_reply_comment(data.uuid)}
            url_image="https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_re_reply.svg"
          />
        )}

      {/* 수정 버튼 */}
      {data &&
        data.check_comment_reader !== "user" &&
        data.active === 1 && (
          <ButtonComp
            text={"수정"}
            function={
              !loading
                ? () => click_btn_edit_comment(data.uuid)
                : undefined
            }
            url_image={
              !loading
                ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_modify.svg"
                : null
            }
          />
        )}

      {/* 삭제 버튼 */}
      {data &&
        data.check_comment_reader !== "user" &&
        data.active === 1 && (
          <ButtonComp
            text={"삭제"}
            function={
              !loading
                ? () => comment_action("delete", data.uuid)
                : undefined
            }
            url_image={
              !loading
                ? "https://cdn.jsdelivr.net/gh/statground/web-r_CDN/images/svg/comment_delete.svg"
                : null
            }
          />
        )}
    </div>
  );
}
