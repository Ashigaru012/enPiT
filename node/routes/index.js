const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../my_modules/mydb');
const logger = require('../my_modules/mylog');
const common_links = require("../my_modules/common_links");


/*  */
router.get("/", function(req, res, next) 
{
    res.render("index", {footer_links: common_links});
});

module.exports = router;
