const connectToMongo = require("./db");
const express = require("express");
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

connectToMongo();
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
