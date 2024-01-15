const connectToMongo = require("./db");
const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors middleware
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectToMongo();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Your routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
