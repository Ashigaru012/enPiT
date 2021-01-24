const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');
const make_hf_links = require('../../my_modules/test/hf_link');

/*  */
router.get('/weekly/:id', function(req, res, next) 
{
    const user_id = req.params.id;

    res.render("test/ranking/weekly", {footer_links: make_hf_links(user_id)});
});



module.exports = router;
