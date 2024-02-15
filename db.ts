import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGODB_URI_2!;

import { Express } from "express";
import mongoose from "mongoose";

export default async function startDB(app: Express, callback: () => void) {
  try {
    await mongoose.connect(mongoURI);
    console.log("Database connected");

    app.locals.db = mongoose.connection;
    callback();
  } catch (err) {
    console.error("Error connecting to the database: ", err);
    process.exit(1);
  }
}
