function check_file_upload(uuid_comment) {
  var temp_data_file = null;
  var formData = new FormData();
  formData.append("file_input", document.getElementById("id_file_upload_" + uuid_comment).files[0]);
  formData.append("host", window.location.href.toString());
  formData.append("note", "Comment");
  formData.append("active", 1);
  $.ajax({
    type: "POST",
    enctype: "multipart/form-data",
    url: "/blank/ajax_file_upload/",
    data: formData,
    processData: false,
    contentType: false,
    cache: false,
    timeout: 6e5,
    success: function(filedata) {
      filedata["uuid_comment"] = uuid_comment;
      const existingIndex = data_file.findIndex((item) => item.uuid_comment === uuid_comment);
      if (existingIndex !== -1) {
        data_file.splice(existingIndex, 1);
        data_file[existingIndex] = filedata;
      } else {
        data_file.push(filedata);
      }
      document.getElementById("txt_filename_" + uuid_comment).innerHTML = filedata.origin_file_name;
      document.getElementById("txt_file_delete_" + uuid_comment).className = class_txt_file_delete;
    },
    error: function(e) {
      console.error("File upload error:", e);
    }
  });
}
