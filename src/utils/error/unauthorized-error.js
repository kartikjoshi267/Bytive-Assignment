const { STATUS_CODES } = require("../../constants/index.js");
const CustomError = require("./custom-error.js");

module.exports = class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message, STATUS_CODES.UNAUTHORIZED);
  }
}