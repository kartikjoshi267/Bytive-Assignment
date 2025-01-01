const { STATUS_CODES } = require("../constants/index.js");

module.exports = class ApiResponseBuilder {
    #statusCode = STATUS_CODES.OK;
    #message;
    #data;

    statusCode(statusCode) {
        this.#statusCode = statusCode;
        return this;
    }

    message(message) {
        this.#message = message;
        return this;
    }

    data(data) {
        this.#data = data;
        return this;
    }

    build() {
        return {
            statusCode: this.#statusCode,
            message: this.#message,
            data: this.#data,
        };
    }
}
