var express = require('express');
var router = express.Router();
const db = require('../../my_modules/mydb');
const make_hf_links = require('../../my_modules/test/hf_link');

/* GET users listing. */
router.get('/:id/:user_id', function(req, res, next) 
{
  const user_id = req.params.user_id;
  const target_id = req.params.id;

  db.query('select * from users_icon where user_id=?', target_id, (error, results) => 
  {
    if(error) throw error;
      
    res.render("test/user", {footer_links: make_hf_links(user_id), user_id: user_id, target_id: target_id, icon_img: results[0].img});
  });
});

module.exports = router;
