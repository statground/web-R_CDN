function click_delete_file() {
	data_file = null
	document.getElementById('id_file_upload').value = "";
	document.getElementById("txt_filename").innerHTML = null
	document.getElementById("txt_file_delete").className = "hidden"
}