var express = require('express');
var mysql = require('mysql');
var router =express.Router();
var connection = mysql.createConnection({
        'host' : '', 
		'user' : 'user', 'password' : '', 'database' : 'appjamdb',
});


router.post('/', function(req, res, next) {
        connection.query('select count(*) cnt from people where user_id=? and pw=?',
                                                [req.body.user_id, req.body.pw], function(error, cursor) {
        if(error==null) {
                  if (cursor[0].cnt == '0') {
                          res.status(503).json({ result : false, reason : "login-Fail" });
                  }
                  else {
                   connection.query('update people set reg_id=? where user_id=?',[req.body.reg_id, req.body.user_id] , function(error,cursor){
                        if(error==null){
                                connection.query('select * from people where user_id=?', [req.body.user_id], function(error, cursor){
                                        if(error==null){ res.json(cursor);}
                                });
                        }
                         else
                                { res.status(503).json({result:false, reason:"reg_id upadate fail"}); }

                        });
                }
         }
         else
           res.status(503).json(error);
 });
});

module.exports = router;
