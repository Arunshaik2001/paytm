import authMiddleware from "../middlewares/authMiddleware";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const accountRouter = Router();
const prisma = new PrismaClient();

accountRouter.get("/balance", authMiddleware, async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const user = req.body.userId ?? userId;
    const account = await prisma.account.findFirst({
      where: {
        userId: user,
      },
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
    const {
      amount,
      to,
    }: {
      amount: number;
      to: number;
    } = req.body;
    const userId = res.locals.userId;
    console.log(userId);

    const account = await prisma.account.findFirst({
      where: {
        userId: userId,
      },
    });

    if (account!.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await prisma.account.findFirst({
      where: {
        userId: to,
      },
    });

    if (!toAccount) {
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    await prisma.account.update({
      where: {
        userId: to,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    await prisma.account.update({
      where: {
        userId: userId,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    res.json({
      message: "Transfer successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Transfer Failed",
    });
  }
});

export default accountRouter;
