const express = require("express");
require("express-async-errors");
const dotenv = require("dotenv");
const cors = require("cors");
const process = require("process");

const PORT = process.env.PORT || 3000;

const logger = require("./utils/logger.js");
const connectToDatabase = require("./database/index.js");
const NotFoundError = require("./utils/error/not-found-error.js");
const CustomError = require("./utils/error/custom-error.js");
const { STATUS_CODES } = require("./constants/index.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectToDatabase();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/users", require("./routes/user-routes.js"));
app.use("/tasks", require("./routes/tasks-routes.js"));

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
