var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) 
{
  res.send('respond with a resource');
});


router.get('/:id', function(req, res, next) 
{
  const user_id = req.params.id;

  res.render("test/user", {user_id: user_id});
});

module.exports = router;
