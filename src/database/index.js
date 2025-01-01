const mongoose = require("mongoose");
const { STATUS_CODES } = require("../constants/index.js");
const CustomError = require("../utils/error/custom-error.js");
const logger = require("../utils/logger.js");

const connectToDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "bytive",
        });
        logger.info(`Connected to database ${connection.connection.host}`);
    } catch (error) {
        throw new CustomError(
            "Error connecting to database",
            STATUS_CODES.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = connectToDatabase;
