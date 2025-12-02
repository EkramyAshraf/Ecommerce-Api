const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const { xss } = require("express-xss-sanitizer");
const expressMongoSanitize = require("@exortek/express-mongo-sanitize");

const dbConnection = require("./config/database");
const mountRoutes = require("./routes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/errorMiddleware");
const { webhookCheckout } = require("./controllers/orderController");

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

//connect with db
dbConnection();

//express app
const app = express();

//enable other domains to access the application
app.use(cors());

//compress all responses
app.use(compression());
// app.options("*", cors());

//middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Data sanitization
app.use(expressMongoSanitize());
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["sold", "quantity", "price", "ratingsAvg", "ratingsQuantity"],
  })
);

const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

//Apply the rate limiting middleware to all requests
app.use("/api", limiter);

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//Mount Routes
mountRoutes(app);

//Error Handling
app.use((req, res, next) => {
  next(new AppError(`can’t find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
