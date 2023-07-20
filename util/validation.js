function isEmpty(value) {
  return !value && value.trim() === "";
}

function userCredentialsAreValid(username, email, password) {
  return (
    email &&
    email.includes("@") &&
    password &&
    password.trim().length >= 6 &&
    username &&
    username.trim().length >= 4
  );
}

function userDetailsAreValid(username, fullname, email, password) {
  return userCredentialsAreValid(username, email, password) && !isEmpty(fullname);
}

function passwordIsConfirmed(password, confirmPassword) {
  return password === confirmPassword;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  passwordIsConfirmed: passwordIsConfirmed,
};
