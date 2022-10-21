const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DB.replace("<password>", process.env.DB_PASSWORD);

mongoose.connect(DB, (err) => {
  if (err) return console.log(err);

  console.log("MongoDB Connected!");

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
  });
});
