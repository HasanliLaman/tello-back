const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const errorHandler = require("./error/errorHandler");
const GlobalError = require("./error/GlobalError");

const app = express();
app.use(express.json());

// Checking environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Apply some modules for security
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, try again after an hour.",
});

app.use(limiter);
app.use(helmet());
// app.use(mongoSanitize());

// Cors
app.use(cors());

// Routers
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const userRouter = require("./routers/userRouter");
const cartRouter = require("./routers/cartRouter");

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRouter);

// Catch nonexist routes
app.use((req, res, next) => {
  next(new GlobalError(`${req.originalUrl} does not exist!`, 404));
});

// Error handling
app.use(errorHandler);

module.exports = app;
