// Handle file selection for attachment
function check_file_upload(uuid_comment) {
    const fileInput = document.getElementById("id_file_upload_" + uuid_comment);
    if (!fileInput || !fileInput.files.length) return;
    const formData = new FormData();
    formData.append('file_input', fileInput.files[0]);
    formData.append('host', window.location.href.toString());
    formData.append('note', "Comment");
    formData.append('active', 1);
    // Upload the file via AJAX
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/blank/ajax_file_upload/",
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function(filedata) {
            // Tag the file data with the corresponding comment (use "new" for new comment)
            filedata.uuid_comment = (uuid_comment === null || uuid_comment === "new") ? "new" : uuid_comment;
            const existingIndex = data_file.findIndex(item => item.uuid_comment === filedata.uuid_comment);
            if (existingIndex !== -1) {
                data_file[existingIndex] = filedata;
            } else {
                data_file.push(filedata);
            }
            // Update UI: show file name and reveal delete option
            document.getElementById("txt_filename_" + filedata.uuid_comment).innerText = filedata.original_filename;
            document.getElementById("txt_file_delete_" + filedata.uuid_comment).className = "";
        }
    });
}
