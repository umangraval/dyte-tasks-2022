const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/../.env") });

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
};
