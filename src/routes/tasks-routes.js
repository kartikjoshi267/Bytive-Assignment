const { Router } = require("express");
const BadRequestError = require("../utils/error/bad-request-error.js");
const Task = require("../models/tasks-model.js");
const User = require("../models/user-model.js");
const ApiResponseBuilder = require("../utils/api-response-builder.js");
const authMiddleware = require("../middleware/auth-middleware.js");
const UnauthorizedError = require("../utils/error/unauthorized-error.js");
const CustomError = require("../utils/error/custom-error.js");
const { STATUS_CODES } = require("../constants/index.js");

const router = Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: cookie
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token stored in cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task
 *                 example: "Finish documentation"
 *               description:
 *                 type: string
 *                 description: A detailed description of the task
 *                 example: "Complete the documentation for the API"
 *     responses:
 *       200:
 *         description: Task created successfully
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
 *                   example: "Task created successfully"
 *                 data:
 *                   type: object
 *                   description: The created task data
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier of the task
 *                       example: "60d7b8f8f0f0f0f0f0f0f0f0"
 *                     title:
 *                       type: string
 *                       description: Title of the task
 *                       example: "Finish documentation"
 *                     description:
 *                       type: string
 *                       description: Task description
 *                       example: "Complete the documentation for the API"
 *                     status:
 *                       type: string
 *                       description: Status of the task
 *                       example: "pending"
 *                     user:
 *                       type: string
 *                       description: ID of the user who created the task
 *                       example: "60d7b8f8f0f0f0f0f0f0f0f0"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of task creation
 *                       example: "2025-01-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of the last update
 *                       example: "2025-01-01T12:00:00Z"
 */
router.post("/", authMiddleware, async (req, res) => {
    const { userId } = req.headers;
    if (!userId) {
        throw new UnauthorizedError("Unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new BadRequestError("User not found");
    }

    const { title, description } = req.body;
    if (!title) {
        throw new BadRequestError("Title is required");
    }

    const task = new Task({ title, description, user: userId });
    await task.save();

    return res.json(
        new ApiResponseBuilder()
            .message("Task created successfully")
            .data(task)
            .build()
    );
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Fetch all tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
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
 *                   example: "Tasks fetched successfully"
 *                 data:
 *                   type: array
 *                   description: List of all tasks
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the task
 *                         example: "60d7b8f8f0f0f0f0f0f0f0f0"
 *                       title:
 *                         type: string
 *                         description: Title of the task
 *                         example: "Finish documentation"
 *                       description:
 *                         type: string
 *                         description: Task description
 *                         example: "Complete the documentation for the API"
 *                       status:
 *                         type: string
 *                         description: Status of the task
 *                         example: "pending"
 *                       user:
 *                         type: string
 *                         description: ID of the user who created the task
 *                         example: "60d7b8f8f0f0f0f0f0f0f0f0"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of task creation
 *                         example: "2025-01-01T12:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of the last update
 *                         example: "2025-01-01T12:00:00Z"
 */
router.get("/", async (req, res) => {
    const tasks = await Task.find();
    return res.json(
        new ApiResponseBuilder()
            .message("Tasks fetched successfully")
            .data(tasks)
            .build()
    );
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Fetch a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to fetch
 *     responses:
 *       200:
 *         description: Task fetched successfully
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
 *                   example: "Task fetched successfully"
 *                 data:
 *                   type: object
 *                   description: The requested task data
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier of the task
 *                       example: "60d7b8f8f0f0f0f0f0f0f0f0"
 *                     title:
 *                       type: string
 *                       description: Title of the task
 *                       example: "Finish documentation"
 *                     description:
 *                       type: string
 *                       description: Task description
 *                       example: "Complete the documentation for the API"
 *                     status:
 *                       type: string
 *                       description: Status of the task
 *                       example: "pending"
 *                     user:
 *                       type: string
 *                       description: ID of the user who created the task
 *                       example: "60d7b8f8f0f0f0f0f0f0f0f0"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of task creation
 *                       example: "2025-01-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of the last update
 *                       example: "2025-01-01T12:00:00Z"
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
        throw new BadRequestError("Task not found");
    }

    return res.json(
        new ApiResponseBuilder()
            .message("Task fetched successfully")
            .data(task)
            .build()
    );
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update the status of a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update
 *       - in: cookie
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token stored in cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the task
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Task updated successfully
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
 *                   example: "Task updated successfully"
 *                 data:
 *                   type: object
 *                   description: The updated task data
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier of the task
 *                       example: "60d7b8f8f0f0f0f0f0f0f0f0"
 *                     title:
 *                       type: string
 *                       description: Title of the task
 *                       example: "Finish documentation"
 *                     description:
 *                       type: string
 *                       description: Task description
 *                       example: "Complete the documentation for the API"
 *                     status:
 *                       type: string
 *                       description: Status of the task
 *                       example: "completed"
 *                     user:
 *                       type: string
 *                       description: ID of the user who created the task
 *                       example: "60d7b8f8f0f0f0f0f0f0f0f0"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of task creation
 *                       example: "2025-01-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of the last update
 *                       example: "2025-01-01T12:00:00Z"
 */
router.put("/:id", authMiddleware, async (req, res) => {
    const { userId } = req.headers;
    if (!userId) {
        throw new UnauthorizedError("Unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new BadRequestError("User not found");
    }

    const { id } = req.params;

    let task = await Task.findById(id);
    if (!task || (task && task.user != userId)) {
        throw new CustomError("Not Allowed Action", STATUS_CODES.FORBIDDEN);
    }

    const { status } = req.body;
    task = await Task.findByIdAndUpdate(
        {
            _id: id,
            user: userId,
        },
        {
            $set: {
                status,
            },
        },
        { new: true }
    );

    return res.json(
        new ApiResponseBuilder()
            .message("Task updated successfully")
            .data(task)
            .build()
    );
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete
 *       - in: cookie
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token stored in cookies
 *     responses:
 *       200:
 *         description: Task deleted successfully
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
 *                   example: "Task deleted successfully"
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    const { userId } = req.headers;
    if (!userId) {
        throw new UnauthorizedError("Unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new BadRequestError("User not found");
    }

    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task || (task && task.user != userId)) {
        throw new CustomError("Not Allowed Action", STATUS_CODES.FORBIDDEN);
    }

    await Task.findByIdAndDelete({
        _id: id,
        user: userId,
    });

    return res.json(
        new ApiResponseBuilder()
            .message("Task deleted successfully")
            .build()
    );
});

module.exports = router;
