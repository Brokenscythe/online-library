const path = require("path");
const express = require("express");
const csrf = require("csurf");
const session = require("express-session");
const methodOverride = require("method-override");

//ROUTES
const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
const bookRoutes = require("./routes/book.routes");

//SESSION CONFIG
const createSessionConfig = require("./config/session");

//MIDDLEWARES
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect.routes");

const app = express();
app.use(methodOverride("_method"));

//VIEW ENGINE SETUP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//SERVING STATIC FILES
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();

app.use(session(sessionConfig));
app.use(csrf());
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);

app.use(protectRoutesMiddleware);
app.use(bookRoutes);

app.use(errorHandlerMiddleware);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
