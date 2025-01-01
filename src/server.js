import process from "process";
import logger from "./utils/logger.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

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

export default (req, res) => {
    app(req, res);
};
