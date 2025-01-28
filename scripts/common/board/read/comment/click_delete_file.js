function click_delete_file(uuid_comment) {
	data_file.splice(data_file.findIndex(item => item.uuid_comment === uuid_comment), 1);

	document.getElementById("id_file_upload_" + uuid_comment).value = "";
	document.getElementById("txt_filename_" + uuid_comment).innerHTML = null;
	document.getElementById("txt_file_delete_" + uuid_comment).className = "hidden";
}