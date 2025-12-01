const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");
const express = require("express");

const morgan = require("morgan");
const dbConnection = require("./config/database");
const mountRoutes = require("./routes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/errorMiddleware");

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
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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
