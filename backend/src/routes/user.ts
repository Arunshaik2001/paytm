import authMiddleware from "../middlewares/authMiddleware";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import { Router } from "express";
import { config } from "../../config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET_KEY = config.JWT_SECRET_KEY;
let userRouter = Router();

const signUpValidation = z.object({
  userName: z.string().email(),
  firstName: z.string().max(50),
  lastName: z.string().max(50).trim(),
  password: z.string().min(6),
});

const signInValidation = z.object({
  userName: z.string().email(),
  password: z.string().min(6),
});

const updateValidation = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).trim().optional(),
  password: z.string().min(6).optional(),
});

userRouter.post("/signUp", async (req, res, next) => {
  const result = signUpValidation.safeParse(req.body);
  if (result.success) {
    console.log("/signup");
    const existingUser = await prisma.user.findFirst({
      where: {
        userName: req.body.userName,
      },
    });
    console.log(existingUser);
    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken/Incorrect inputs",
      });
    }
    const user = await prisma.user.create({
      data: req.body,
    });
    console.log(user);
    const token = sign({ userId: user.id }, JWT_SECRET_KEY);

    await prisma.account.create({
      data: {
        balance: Math.floor(Math.random() * 10000) + 1,
        userId: user.id,
      },
    });

    res
      .json({
        message: "User created successfully",
        token: token,
        currentUser: user.id,
      })
      .status(201);
  } else {
    console.log("Validation Failed" + result);
    res
      .json({
        message: result,
      })
      .status(411);
  }
});

userRouter.post("/signIn", async (req, res, next) => {
  const result = signInValidation.safeParse(req.body);
  if (result.success) {
    const existingUser = await prisma.user.findFirst({
      where: {
        userName: req.body.userName,
      },
    });

    if (!existingUser) {
      return res.status(411).json({
        message: "Error while logging in",
      });
    }

    const token = sign({ userId: existingUser.id }, JWT_SECRET_KEY);

    res
      .json({
        token: token,
        currentUser: existingUser.id,
      })
      .status(200);
  } else {
    console.log("Validation Failed" + result);
    res
      .json({
        message: "Error while logging in",
      })
      .status(411);
  }
});

userRouter.put("/update", authMiddleware, async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const result = updateValidation.safeParse(req.body);

    if (result.success) {
      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: req.body,
      });

      res.status(200).json({
        message: "Updated profile" + userId + user!.userName,
      });
    }
  } catch (error) {
    res.status(411).json({ message: "Error while updating information" });
  }
});

userRouter.get("/userDetail/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(req.params.userId),
      },
    });

    res.status(200).json({
      user: user,
    });
  } catch (error) {
    res.status(411).json({ message: "Error while fetching information" });
  }
});

userRouter.get("/bulk", authMiddleware, async (req, res, next) => {
  try {
    const filter = req.query.filter ?? "";
    const userId = res.locals.userId;

    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId, 
        },
        OR: [
          {
            firstName: {
              contains: filter as string,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: filter as string,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    res.status(200).json({
      users: users,
    });
  } catch (error) {
    res.status(411).json({ message: "Error while fetching users" });
  }
});

export default userRouter;
