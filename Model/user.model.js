const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  Name: String,
  Gender: String,
  DOB: String,
  Email: { type: String, unique: true },
  Mobile: String,
  InitialBalance: Number,
  AdharNo: { type: String, unique: true },
  PanNo: { type: String, unique: true },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
