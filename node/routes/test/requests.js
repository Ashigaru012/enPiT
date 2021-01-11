const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');

/*  */
router.get('/', function(req, res, next) 
{
    db.query('SELECT * FROM requests_test where is_waiting=true', (error, results) => 
    {
        if(error) throw error;

        console.log(results);

        res.render('test/requests/index', {requests: results});
    });
});

/*  */
router.get('/create', function(req, res, next) 
{
    res.render('test/requests/create', {});
});

/*  */
router.post('/', function(req, res, next) 
{
    console.log(req.body);

    db.query('insert into requests_test set ?', req.body, (error, results) => 
    {
        if(error) throw error;

        res.json({
            "url": "http://localhost:3000/test/requests"
        });
    });
});

/*  */
router.get('/:id/apply', function(req, res, next) 
{
    console.log(req.params.id);
    db.query('SELECT * FROM requests_test where id=?', req.params.id, (error, results) => 
    {
        if(error) throw error;

        const request = results[0];

        db.query('SELECT * FROM applicants_test where request_id=?', req.params.id, (error, results) => 
        {
            if(error) throw error;

            request.num_applicants = results.length;

            res.render('test/requests/apply', {request: request});
        });

    });
});

/*  */
router.post('/:id/applicants', function(req, res, next) 
{
    console.log(req.body);

    db.query('insert into applicants_test set ?', req.body, (error, results) => 
    {
        if(error) throw error;

        db.query('SELECT * FROM requests_test where id=?', req.params.id, (error, results) => 
        {
            if(error) throw error;
            
            const request = results[0]
            const max_applicants = request.max_applicants;

            db.query('select count(*) as count from applicants_test where request_id=?', req.params.id, (error, results) => 
            {
                if(error) throw error;

                const count = results[0].count;

                if(count >= max_applicants)
                {
                    console.log("募集人数に到達");
                    request.is_waiting = false;
                    db.query('update requests_test set ? where id=?', [request, req.params.id], (error, results) =>
                    {
                        if(error) throw error;

                        console.log("依頼の募集を終了します");
                        res.json({
                            "url": "http://localhost:3000/test/requests"
                        });
                    });
                }
                else
                {
                    res.json({
                        "url": "http://localhost:3000/test/requests"
                    });
                }
            });
        });
    });
});



module.exports = router;
