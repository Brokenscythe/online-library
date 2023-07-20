const { Prisma } = require("@prisma/client");
const User = require("../models/user.model");

const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignUp(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      username: "",
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      JMBG: "",
    };
  }
  res.render("user/auth/signup", { inputData: sessionData });
}
async function signUp(req, res, next) {
  const enteredData = {
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body["confirm_password"],
    JMBG: req.body.jmbg,
  };

  const user = new User({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    JMBG: req.body.jmbg,
  });

  try {
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage:
            "User already exists! Please check your username and email!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }

    if (
      !validation.userDetailsAreValid(
        req.body.username,
        req.body.fullname,
        req.body.email,
        req.body.password
      ) ||
      !validation.passwordIsConfirmed(
        req.body.password,
        req.body["confirm_password"]
      )
    ) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage:
            "Please check your input. Password must be at least 6 characters and JMBG must be 13 characters long!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
}
function getLogIn(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      username: "",
      password: "",
    };
  }
  res.render("user/auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  let existingUser;
  try {
    existingUser = await user.hasMatchingUsername();
  } catch (error) {
    return next(error);
  }

  const sessionErrorData = {
    errorMessage:
      "Invalid credentials, please check your username and password!",
    username: user.username,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }
  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );
  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res, next) {
  authUtil.destroyUserSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignUp: getSignUp,
  getLogIn: getLogIn,
  signUp: signUp,
  login: login,
  logout: logout,
};
