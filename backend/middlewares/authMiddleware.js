const { JWT_SECRET_KEY } = require("../config");

const jwt = require("jsonwebtoken");

const authMiddleware = function (req, res, next) {
  try {
    const token = req.headers.authorization;
    const tokenToVerify = token?.split(" ")[1];

    const payload = jwt.verify(tokenToVerify, JWT_SECRET_KEY);

    if (payload) {
      const userId = payload.userId;
      res.locals.userId = userId;
      next();
    }
  } catch (error) {
    res.status(403).json({
      message: "Please provide valid token",
    });
  }
};

module.exports = authMiddleware;
