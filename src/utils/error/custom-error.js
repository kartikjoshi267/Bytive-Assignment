const { STATUS_CODES } = require("../../constants/index.js");

module.exports = class CustomError extends Error {
  statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
  error = "Internal Server Error";

  constructor(message, statusCode) {
    super(message);
    this.error = message || "We are having some server issues. Please try again later.";
    this.statusCode = statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      error: this.error,
    };
  }

  build() {
    return {
      statusCode: this.statusCode,
      error: this.error,
    };
  }
}