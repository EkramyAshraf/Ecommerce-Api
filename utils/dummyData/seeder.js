const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Product = require("../../models/productModel");
const dbConnection = require("../../config/database");
require("colors");

dotenv.config({ path: "./config.env" });
//connect with DB
dbConnection();

//read data from file
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));

//import data into DB
const importData = async () => {
  try {
    await Product.create(products);
    console.log("Data Successfully Loaded!".green.inverse);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Successfully deleted!".red.inverse);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
