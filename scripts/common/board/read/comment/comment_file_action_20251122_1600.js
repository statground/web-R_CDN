function comment_file_action(action, uuid_comment) {
  if (action === "delete") {
    const idx = data_file.findIndex(
      (item) => item.uuid_comment === uuid_comment
    );
    if (idx !== -1) data_file.splice(idx, 1);

    const inputEl = document.getElementById(
      "id_file_upload_" + uuid_comment
    );
    if (inputEl) inputEl.value = "";

    const nameEl = document.getElementById(
      "txt_filename_" + uuid_comment
    );
    if (nameEl) nameEl.innerHTML = "";

    const delEl = document.getElementById(
      "txt_file_delete_" + uuid_comment
    );
    if (delEl) delEl.className = "hidden";

    return;
  }

  if (action === "upload") {
    const inputEl = document.getElementById(
      "id_file_upload_" + uuid_comment
    );
    if (!inputEl || !inputEl.files || !inputEl.files[0]) return;

    const formData = new FormData();
    formData.append("file_input", inputEl.files[0]);
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
      timeout: 600000,
      success: function (filedata) {
        filedata["uuid_comment"] = uuid_comment;

        const existingIndex = data_file.findIndex(
          (item) => item.uuid_comment === uuid_comment
        );
        if (existingIndex !== -1) {
          data_file[existingIndex] = filedata;
        } else {
          data_file.push(filedata);
        }

        const nameEl = document.getElementById(
          "txt_filename_" + uuid_comment
        );
        if (nameEl)
          nameEl.innerHTML = filedata.origin_file_name;

        const delEl = document.getElementById(
          "txt_file_delete_" + uuid_comment
        );
        if (delEl) delEl.className = class_txt_file_delete;
      },
      error: function (e) {
        console.error("File upload error:", e);
      },
    });
  }
}
