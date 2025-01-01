const { Router } = require("express");
const bcrypt = require("bcryptjs");
const BadRequestError = require("../utils/error/bad-request-error.js");
const User = require("../models/user-model.js");
const ApiResponseBuilder = require("../utils/api-response-builder.js");
const generateAccessToken = require("../utils/access-token-generator.js");
const authMiddleware = require("../middleware/auth-middleware.js");
const { eraseCookie, setCookie } = require("../utils/cookies.js");

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Response message
 *                   example: "User created successfully"
 */
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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Response message
 *                   example: "User logged in successfully"
 *                 data:
 *                   type: object
 *                   description: Contains the authentication token
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Authentication token for the user
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
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
        new ApiResponseBuilder()
            .message("User logged in successfully")
            .data({
                token: accessToken,
            })
            .build()
    );
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get current user
 *     tags:
 *       - User
 *     parameters:
 *       - in: cookie
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token stored as a cookie
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Response message
 *                   example: "User fetched successfully"
 *                 data:
 *                   type: object
 *                   description: The actual user data
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: User's email address
 *                       example: johndoe@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Account creation date and time
 *                       example: "2025-01-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Last account update date and time
 *                       example: "2025-01-02T12:00:00Z"
 */
router.get("/", authMiddleware, async (req, res) => {
    const { userId } = req.headers;
    const user = await User.findById(userId).select("-password -_id");
    if (!user) {
        throw new BadRequestError("User not found");
    }

    return res.json(new ApiResponseBuilder().data(user).build());
});

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Response message
 *                   example: "User logged out successfully"
 */
router.post("/logout", async (req, res) => {
    eraseCookie(res, "token");
    return res.json(
        new ApiResponseBuilder().message("User logged out successfully").build()
    );
});

module.exports = router;
