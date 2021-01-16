const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');

/*  */
router.get('/weekly/:id', function(req, res, next) 
{
    const user_id = req.params.id;
    const footer_links = 
    {
        map_link: `http://localhost:3000/test/map3/${user_id}`,
        chat_link: `http://localhost:3000/test/rooms/${user_id}`,
        ranking_link: `http://localhost:3000/test/ranking/weekly/${user_id}`,
        mypage_link: "#"
    };

    res.render("test/ranking/weekly", {footer_links: footer_links});
});



module.exports = router;
