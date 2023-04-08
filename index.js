const express = require("express");
const cors = require("cors");
const { connection } = require("./configs/db");
const { userRouter } = require("./Routes/user.routes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Home Page Masai Bank");
});

app.use("/user", userRouter);

app.listen(process.env.port, async (req, res) => {
  try {
    await connection;
    console.log("Connected to DB");
    console.log(`Server running on port ${process.env.port}`);
  } catch (error) {
    console.log(error);
  }
});
