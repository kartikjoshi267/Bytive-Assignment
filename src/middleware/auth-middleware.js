import jwt from "jsonwebtoken";

import { getCookie } from "../utils/cookies.js"
import UnauthorizedError from "../utils/error/unauthorized-error.js";

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

export default authMiddleware