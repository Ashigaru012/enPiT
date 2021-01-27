const Log4js = require("log4js");
Log4js.configure("./log-config.json");

module.exports = Log4js.getLogger();