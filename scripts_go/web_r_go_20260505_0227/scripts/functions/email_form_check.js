function email_form_check(id = "txt_email") {
  let email = document.getElementById(id).value.trim();
  let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  if (email == "" || email == null) {
    return "NOT EXIST";
  } else if (!regExp.test(email)) {
    return "FAILED";
  } else {
    return "SUCCESS";
  }
}
