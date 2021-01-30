const express = require('express');
const router = express.Router();
const tr = require('../my_modules/transaction');
const common = require("../my_modules/common");



router.get('/me', async function(req, res, next) 
{
    const user_id = req.cookies.user_id;

    const user = await tr.query('select * from user where id=?', [user_id]);
    const icon = await tr.query('select * from sample_icon where id=?', [user[0].icon_id]);

    res.render("users/me", {common: common, user_id: user_id, icon_img: icon[0].img, user: user[0]});
});

router.get('/:id/', async function(req, res, next) 
{
    const user_id = req.cookies.user_id;
    const target_id = req.params.id;

    const target = (await tr.query('select * from user where id=?', [target_id]))[0];
    const icon = (await tr.query('select * from sample_icon where id=?', [target.icon_id]))[0];

    res.render("users/user", {common: common, user_id: user_id, icon_img: icon.img, user: target[0]});
});


module.exports = router;
