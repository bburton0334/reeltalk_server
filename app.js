var express = require("express");
var app = express();

const cors = require("cors");


const corsOptions = {
  origin: "https://sparkling-quokka-c027ba.netlify.app",
  methods: ["GET", "POST"],
  credentials: true,
};

// const corsOptions = {
//   origin: "http://localhost:3000",
//   methods: ["GET", "POST"],
//   credentials: true,
// };

app.use(cors(corsOptions));

var createError = require("http-errors");

const { OAuth2Client } = require("google-auth-library");
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testAPIRouter = require("./routes/testAPI");

var googleLogin = require("./routes/login");
var googleSignup = require("./routes/signup");

let userUpdate = require("./routes/update");
let movie = require("./routes/movie");
let port = 9000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);
// app.use("/login", googleLogin);
// app.use("/signup", googleSignup);

app.route("/login").post(jsonParser, googleLogin.login);
app.route("/signup").post(jsonParser, googleSignup.signup);
app.route("/movie/:id/details").get(jsonParser, movie.getMovieInfo);
app.route("/movie/:searchTerm").get(jsonParser, movie.getSearchTerm);
app.route("/update/:bioVal/:email").get(jsonParser, userUpdate.updateBio);

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

// google
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}


app.listen(process.env.PORT || port)
console.log("Backend has started on port " + port);

module.exports = app;
