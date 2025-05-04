// Remove selected file attachment
function click_delete_file(uuid_comment) {
    const key = (uuid_comment === null || uuid_comment === "new") ? "new" : uuid_comment;
    // Remove file entry from data_file list
    const index = data_file.findIndex(item => item.uuid_comment === key);
    if (index !== -1) data_file.splice(index, 1);
    // Reset file input and hide file name display
    const fileInput = document.getElementById("id_file_upload_" + uuid_comment);
    if (fileInput) fileInput.value = "";
    document.getElementById("txt_filename_" + uuid_comment).innerText = "";
    document.getElementById("txt_file_delete_" + uuid_comment).className = "hidden";
}
