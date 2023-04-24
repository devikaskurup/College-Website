var createError = require("http-errors");
var express = require("express");
var path = require("path");
const hbs = require("hbs");
var logger = require("morgan");
const db = require("./config/connection");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser"); //to get req.body in post method
const session = require("express-session");

const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials/");
app.all("*", (req, res, next) => {
  req.app.locals.layout = "layout"; // set your layout here
  next(); // pass control to the next handler
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fileUpload());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);

db.connect((err) => {
  if (err) console.log(err);
  else console.log("DB Connected");
});

app.use("/", indexRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;