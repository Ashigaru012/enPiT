const express = require('express');
const router = express.Router();
const config = require('config');
const tr = require('../my_modules/transaction');
const common = require("../my_modules/common");
const logger = require('../my_modules/mylog');

/*  */
router.get('/weekly', function(req, res, next) 
{
    res.render("ranking/weekly", {common: common});
});



module.exports = router;
