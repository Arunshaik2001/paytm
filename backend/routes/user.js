const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db/db");
const { JWT_SECRET_KEY } = require("../config");

userRouter = express.Router();

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
    const existingUser = await User.findOne({
      userName: req.body.userName,
    });

    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken/Incorrect inputs",
      });
    }
    const user = await User.create(req.body);
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);

    await Account.create({
      userId: user,
      balance: Math.floor(Math.random() * 10000) + 1,
    });

    res
      .json({
        message: "User created successfully",
        token: token,
        currentUser: user._id,
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
    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (!existingUser) {
      return res.status(411).json({
        message: "Error while logging in",
      });
    }

    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET_KEY);

    res
      .json({
        token: token,
        currentUser: existingUser._id,
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
      const user = await User.findOneAndUpdate(
        {
          _id: userId,
        },
        req.body
      );

      res.status(200).json({
        message: "Updated profile" + userId + user.userName,
      });
    }
  } catch (error) {
    res.status(411).json({ message: "Error while updating information" });
  }
});

userRouter.get("/userDetail/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId,
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

    const users = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Exclude user with the provided id
        {
          $or: [
            { firstName: { $regex: filter, $options: "i" } }, // Case-insensitive search
            { lastName: { $regex: filter, $options: "i" } },
          ],
        },
      ],
    });

    res.status(200).json({
      users: users,
    });
  } catch (error) {
    res.status(411).json({ message: "Error while fetching users" });
  }
});

module.exports = userRouter;
