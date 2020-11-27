const express = require('express');
const router = express.Router();

let data = [
    {name: 'Taro', age: '35', mail: 'taro@yamada'},
    {name: 'Hanako', age: '29', mail: 'kanako@flower'},
    {name: 'Sachiko', age: '41', mail: 'sachiko@happy'},
];

/* GET home page. */
router.get('/', function(req, res, next) {
  let msg = "0~2番の数字を入力してください。";
  let data = {
    title: 'Ajax!',
    content: msg
  };
  res.render('ajax', data);
});

router.get('/:id', function(req, res, next) {
    var n = req.params.id;
    res.json(data[n]);
  });


router.post('/', function(req, res, next) {
    console.log(req.body);
    data.push(req.body);
    res.json(JSON.stringify(req.body));
  });



module.exports = router;