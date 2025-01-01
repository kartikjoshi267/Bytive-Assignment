import { STATUS_CODES } from "../../constants/index.js";
import CustomError from "./custom-error.js";

export default class NotFoundError extends CustomError {
  constructor(message) {
    super(message, STATUS_CODES.NOT_FOUND);
  }
}