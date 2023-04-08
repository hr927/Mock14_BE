const { TransactionModel } = require("../Model/transaction.model");

const ledger = async (req, res, next) => {
  const { type, amount, toName, toEmail, toPan, from } = req.body;
  const userID = req.body.userID;
  try {
    const transaction = new TransactionModel({
      type,
      amount,
      toName,
      toEmail,
      toPan,
      userID,
      from,
    });
    await transaction.save();
    next();
  } catch (error) {}
};

module.exports = { ledger };
