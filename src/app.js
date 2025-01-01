import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/user-routes.js";
import tasksRoutes from "./routes/tasks-routes.js";
import logger from "./utils/logger.js";
import connectToDatabase from "./database/index.js";
import NotFoundError from "./utils/error/bad-request-error.js";
import CustomError from "./utils/error/custom-error.js";
import { STATUS_CODES } from "./constants/index.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectToDatabase();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/users", userRoutes);
app.use("/tasks", tasksRoutes);


app.use("*", (req, res) => {
    throw new NotFoundError("Route not found");
});

app.use((err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json(err.build());
    }

    logger.error(err);
    console.log(err);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: "We are having some server issues. Please try again later.",
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    });
});

export default app;
