require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");

module.exports = {
    init(app, express) {
        app.use(logger('dev'));
    }
}