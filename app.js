const express = require("express");
const morgan = require("morgan");
const errorHandler = require("./error/errorHandler");
const GlobalError = require("./error/GlobalError");

const app = express();
app.use(express.json());

// Routers
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);

app.use((req, res, next) => {
  next(new GlobalError(`${req.originalUrl} does not exist!`, 404));
});

// Error handling
app.use(errorHandler);

module.exports = app;
