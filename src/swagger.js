const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "ToDo List Application API",
        version: "1.0.0",
        description: "API documentation for ToDo List Application (Create a user before creating a task).",
    },
};

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: [`${__dirname}/routes/*.js`],
});
module.exports = swaggerSpec;
