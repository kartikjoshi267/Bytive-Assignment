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

router.get("/", async (req, res) => {
    const tasks = await Task.find();
    return res.json(
        new ApiResponseBuilder()
            .message("Tasks fetched successfully")
            .data(tasks)
            .build()
    );
});

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
    
    let task = await Task.findById(id);
    if (!task || (task && task.user != userId)) {
        throw new CustomError("Not Allowed Action", STATUS_CODES.FORBIDDEN);        
    }

    task = await Task.findByIdAndDelete({
        _id: id,
        user: userId,
    });

    return res.json(    
        new ApiResponseBuilder()
            .message("Task deleted successfully")
            .data(task)
            .build()
    );
});

module.exports = router;
