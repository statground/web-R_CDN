function click_btn_reply_comment(uuid_comment) {
	document.getElementById("div_community_read_comment_new_" + uuid_comment).className = "w-full"

	Object.keys(data.comment_upper).map(function(i){
		if (uuid_comment != data.comment_upper[i].uuid) {
			document.getElementById("div_community_read_comment_new_" + data.comment_upper[i].uuid).className = "hidden"
		}
		
	})
}