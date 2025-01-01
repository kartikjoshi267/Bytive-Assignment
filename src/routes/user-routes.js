import { Router } from "express";
import bcrypt from "bcryptjs";
import BadRequestError from "../utils/error/bad-request-error.js";
import User from "../models/user-model.js";
import ApiResponseBuilder from "../utils/api-response-builder.js";
import generateAccessToken from "../utils/access-token-generator.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { eraseCookie, setCookie } from "../utils/cookies.js";

const router = Router();

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        throw new BadRequestError("Email is required");
    }
    if (!password) {
        throw new BadRequestError("Password is required");
    }

    let user = await User.findOne({ email });
    if (user) {
        throw new BadRequestError("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();

    return res.json(
        new ApiResponseBuilder().message("User created successfully").build()
    );
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        throw new BadRequestError("Email is required");
    }
    if (!password) {
        throw new BadRequestError("Password is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new BadRequestError("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new BadRequestError("Invalid password");
    }

    const accessToken = await generateAccessToken(user._id);

    setCookie(res, "token", accessToken);

    return res.json(
        new ApiResponseBuilder().message("User logged in successfully").build()
    );
});

router.get("/", authMiddleware, async (req, res) => {
    const { userId } = req.headers;
    const user = await User.findById(userId).select("-password -_id");
    if (!user) {
        throw new BadRequestError("User not found");
    }

    return res.json(new ApiResponseBuilder().data(user).build());
});

router.post("/logout", async (req, res) => {
    eraseCookie(res, "token");
    return res.json(
        new ApiResponseBuilder().message("User logged out successfully").build()
    );
});

export default router;
