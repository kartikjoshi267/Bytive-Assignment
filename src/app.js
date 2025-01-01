import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import process from "process";

const PORT = process.env.PORT || 3000;

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

process
    .on("unhandledRejection", (reason, promise) => {
        console.error(reason, "Unhandled Promise Rejection in application");
        logger.error(reason, "Unhandled Promise Rejection in application");
    })
    .on("uncaughtException", (err) => {
        console.error(reason, "Unhandled Promise Rejection in application");
        logger.error(err, "Uncaught Exception thrown in application");
        process.exit(1);
    });

app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
        logger.error(error);
        return;
    }
    logger.info(`Server running on port ${PORT}`);
});

export default app;
