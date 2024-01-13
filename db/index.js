import mongoose from "mongoose";
import { DB_URL } from "../config/index.js";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(DB_URL + "/PizzaDB");
    console.log("\n Database connected on host : ", res.connection.host);
  } catch (error) {
    console.log("Error connecting to database", error.message);
  }
};

export default connectDB;
