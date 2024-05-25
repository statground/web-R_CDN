// 프로필 사진 - 새 이미지 업로드
function check_file_upload() {
	var formData = new FormData();
	formData.append('file_input', document.getElementById('id_file_upload').files[0]);
	formData.append('host', window.location.href.toString());
	formData.append('note', "Article");
	formData.append('active', 1);

	$.ajax({
		type: "POST",
		enctype: 'multipart/form-data',
		url: "/blank/ajax_file_upload/",
		data: formData,
		processData: false,
		contentType: false,
		cache: false,
		timeout: 600000,
		success: function (filedata) {
			data_file = filedata
			document.getElementById("txt_filename").innerHTML = data_file.origin_file_name
			document.getElementById("txt_file_delete").className = "rounded-lg hover:bg-red-100 cursor-pointer"
		},
		error: function (e) {}
	});
}