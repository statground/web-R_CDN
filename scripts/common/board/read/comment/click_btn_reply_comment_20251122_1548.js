function click_btn_reply_comment(uuid_comment) {
  data_comment_upper.forEach((c) => {
    const el = document.getElementById(
      "div_community_read_comment_new_" + c.uuid
    );
    if (!el) return;
    if (c.uuid === uuid_comment) {
      el.className = "mt-4 p-4 bg-white rounded-lg w-full space-y-2";
    } else {
      el.className = "hidden";
    }
  });
}