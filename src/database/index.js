import mongoose from "mongoose";
import { STATUS_CODES } from "../constants/index.js";
import CustomError from "../utils/error/custom-error.js";
import logger from "../utils/logger.js";

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

export default connectToDatabase;
