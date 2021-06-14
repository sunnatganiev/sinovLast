const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const reklamaRouter = require("./routes/reklamaRoutes");
const liveRouter = require("./routes/liveRoutes");
const teamRouter = require("./routes/teamRoutes");
const newsRouter = require("./routes/newsRoutes");
const viewRouter = require("./routes/viewRoutes");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development login
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, please try again in an hour!`,
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization agains XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 2) ROUTES

app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reklama", reklamaRouter);
app.use("/api/v1/live", liveRouter);
app.use("/api/v1/team", teamRouter);
app.use("/api/v1/news", newsRouter);

app.get("/check", (req, res) => {
  res.send("api is working");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
