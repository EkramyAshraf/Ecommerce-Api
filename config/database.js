const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.DATABASE_URI).then((conn) => {
    console.log(`Database connected: ${conn.connection.host}`);
  });
};
module.exports = dbConnection;
