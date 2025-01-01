const jwt = require("jsonwebtoken");

const { getCookie } = require("../utils/cookies.js");
const UnauthorizedError = require("../utils/error/unauthorized-error.js");

const authMiddleware = (req, res, next) => {
  const token = getCookie(req, "token");
  if (!token) {
    throw new UnauthorizedError("Unauthorized");
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      throw new UnauthorizedError("Unauthorized");
    }

    req.headers.userId = payload.aud;
    next();
  })
}

module.exports = authMiddleware