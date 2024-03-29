const mongoose = require("mongoose");
const mongoUrl = process.env.REACT_APP_MONGOURL;

const connectToMongo = async () => {
  try {
    if (!mongoUrl) {
      throw new Error("MongoDB URI is undefined. Check your environment variables.");
    }

    await mongoose.connect(mongoUrl, {
    });

    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectToMongo;
