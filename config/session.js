const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
};

const sessionStore = new MySQLStore(options);

function createSessionConfig() {
  return {
    key: process.env.SESS_NAME,
    secret: process.env.SESS_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
