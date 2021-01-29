const express = require('express');
const router = express.Router();
const tr = require('../my_modules/transaction');
const common = require("../my_modules/common");



router.get('/me', async function(req, res, next) 
{
    const user_id = req.cookies.user_id;

    const user = await tr.query('select * from user where id=?', [user_id]);
    const icon = await tr.query('select * from sample_icon where id=?', [user[0].icon_id]);

    res.render("users/me", {common: common, user_id: user_id, icon_img: icon[0].img});
});

router.get('/:id/', function(req, res, next) 
{
//   const user_id = req.params.user_id;
//   const target_id = req.params.id;

//   db.query('select * from users_icon where user_id=?', target_id, (error, results) => 
//   {
//     if(error) throw error;
      
//     res.render("test/user", {footer_links: make_hf_links(user_id), user_id: user_id, target_id: target_id, icon_img: results[0].img});
//   });
});


module.exports = router;
