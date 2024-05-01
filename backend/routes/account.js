const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db/db");

accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const user = req.body.userId ?? userId;
    const account = await Account.findOne({
      userId: user,
    });

    if (account) {
      res.status(200).json({
        balance: account.balance,
      });
    }
  } catch (error) {
    res.status(411).json({
      message: "No account found",
    });
  }
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const { amount, to } = req.body;
    const userId = res.locals.userId;
    console.log(userId);

    const account = await Account.findOne({
      userId: userId,
    });

    if (account.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({
      userId: to,
    });

    if (!toAccount) {
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    await Account.updateOne(
      {
        userId: to,
      },
      {
        $inc: {
          balance: amount,
        },
      }
    );

    await Account.updateOne(
      {
        userId: userId,
      },
      {
        $inc: {
          balance: -amount,
        },
      }
    );

    res.json({
      message: "Transfer successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Transfer Failed",
    });
  }
});
module.exports = accountRouter;
