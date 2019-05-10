require("dotenv").config();
const bodyParser = require("body-parser");
const logger = require("morgan");

module.exports = {
    init() {
        app.use(logger('dev'));
    }
}