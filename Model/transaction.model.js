const mongoose = require("mongoose");
const transactionSchema = mongoose.Schema({
  userID: String,
  type: String,
  amount: Number,
  from: String,
  toName: String,
  toEmail: String,
  toPan: String,
});

const TransactionModel = mongoose.model("transaction", transactionSchema);

module.exports = { TransactionModel };
