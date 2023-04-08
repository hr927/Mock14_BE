const express = require("express");
const { UserModel } = require("../Model/user.model");
const { TransactionModel } = require("../Model/transaction.model");
const { authenticate } = require("../Middleware/authenticate.middleware");
const { ledger } = require("../Middleware/transaction.middleware");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/open", async (req, res) => {
  const { Name, Gender, DOB, Email, Mobile, InitialBalance, AdharNo, PanNo } =
    req.body;
  try {
    if (
      Name === "" ||
      Gender === "" ||
      DOB === "" ||
      Email === "" ||
      Mobile === "" ||
      InitialBalance === "" ||
      AdharNo === "" ||
      PanNo === ""
    ) {
      res.send({ msg: "Please enter all the details" });
    } else {
      const user = await UserModel.find({ Email, PanNo });
      const token = jwt.sign({ userID: PanNo }, "masai");
      if (user.length > 0) {
        res.send({ msg: "Login Successful", token: token, user: user[0] });
      } else {
        const newUser = new UserModel({
          Name,
          Email,
          Gender,
          DOB,
          Mobile,
          InitialBalance,
          AdharNo,
          PanNo,
        });
        await newUser.save();
        res.send({ msg: "New User Registered", token: token, user: newUser });
      }
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

userRouter.patch("/update", authenticate, async (req, res) => {
  const { Name, Email, DOB, Mobile, AdharNo, PanNo } = req.body;
  const userID = req.body.userID;
  try {
    const user = await UserModel.find({ PanNo: userID });
    if (user.length > 0) {
      const id = user[0]._id;
      const payload = {
        Name,
        Email,
        DOB,
        Mobile,
        AdharNo,
        PanNo,
      };
      await UserModel.findByIdAndUpdate({ _id: id }, payload);
      res.send({ msg: "Details Updated", user: payload });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

userRouter.delete("/close", authenticate, async (req, res) => {
  const userID = req.body.userID;
  try {
    const user = await UserModel.find({ PanNo: userID });
    if (user.length > 0) {
      const id = user[0]._id;
      await UserModel.findByIdAndDelete({ _id: id });
      res.send({ msg: "Account Closed" });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

userRouter.patch("/deposit", authenticate, ledger, async (req, res) => {
  const { amount } = req.body;
  const from = req.body.userID;
  try {
    const user = await UserModel.find({ PanNo: from });
    if (user.length > 0) {
      const id = user[0]._id;
      user[0].InitialBalance += Number(amount);
      const payload = user[0];
      await UserModel.findByIdAndUpdate({ _id: id }, payload);
      res.send({ msg: "Amount Deposited" });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});
userRouter.patch("/withdraw", authenticate, ledger, async (req, res) => {
  const { amount } = req.body;
  const from = req.body.userID;
  try {
    const user = await UserModel.find({ PanNo: from });
    if (user.length > 0) {
      const id = user[0]._id;
      user[0].InitialBalance -= Number(amount);
      const payload = user[0];
      await UserModel.findByIdAndUpdate({ _id: id }, payload);
      res.send({ msg: "Amount Withdrawn" });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

userRouter.patch("/transfer", authenticate, ledger, async (req, res) => {
  const { amount, toPan } = req.body;
  const from = req.body.userID;
  try {
    const user = await UserModel.find({ PanNo: from });
    const user2 = await UserModel.find({ PanNo: toPan });
    if (user.length > 0 && user2.length > 0) {
      const id = user[0]._id;
      const toId = user2[0]._id;
      user[0].InitialBalance -= Number(amount);
      user2[0].InitialBalance += Number(amount);
      const payload2 = user2[0];
      const payload = user[0];
      await UserModel.findByIdAndUpdate({ _id: id }, payload);
      await UserModel.findByIdAndUpdate({ _id: toId }, payload2);
      res.send({ msg: "Amount Transfered" });
    } else {
      res.send({ msg: "Something went wrong", error: error.message });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

userRouter.get("/ledger", authenticate, async (req, res) => {
  const userID = req.body.userID;
  try {
    const transactions = await TransactionModel.find({ userID: userID });
    if (transactions.length > 0) {
      res.send(transactions);
    } else {
      res.send({ msg: "No Transactions found" });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

module.exports = { userRouter };
