function password_form_check(id = "txt_password", max_len = 8) {
  let passwd = document.getElementById(id).value.trim();
  if (passwd == "" || passwd == null) {
    return "NOT EXIST";
  } else if (passwd.length < max_len) {
    return "FAILED";
  } else {
    return "SUCCESS";
  }
}
