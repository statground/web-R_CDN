function click_delete_file() {
	data_file = null
	data.file_url = null
	data.file_name = null
	document.getElementById('id_file_upload').value = "";
	document.getElementById("txt_filename").innerHTML = null
	document.getElementById("txt_file_delete").className = "hidden"
}