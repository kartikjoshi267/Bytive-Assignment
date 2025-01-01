const jwt = require("jsonwebtoken");
const CustomError = require("./error/custom-error.js");

const generateAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            {},
            process.env.JWT_SECRET,
            {
                audience: String(userId),
            },
            (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            }
        );
    });
};

module.exports = generateAccessToken;
