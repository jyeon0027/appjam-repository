var gcm=require('node-gcm');
var fs=require('fs');
var express=require('express');
var mysql=require('mysql');
var router=express.Router();
var connection=mysql.createConnection({
        'host':'',
        'user':'user',
        'password':'',
        'database':'appjamdb',
});

router.get('/', function(req, res, next) {
         connection.query('select s_id, date from schedule where p_id=?, year=?, month=?',
                        [req.body.p_id,req.body.year,req.body.month], function (error, cursor) {
                                res.json(cursor);
        });
});

router.get('/:s_id',function(req,res,next){
        connection.query('select * from schedule,friend,people  where schedule.p_id=?, schedule.s_id=? and schedule.s_id=friend.s_id and friend.f_p_id=people.p_id',
                        [req.body.p_id,req.param.s_id], function (error, cursor) {
                                res.json(cursor);
        });
});

router.post('/', function(req,res,next){
        connection.query('insert into schedule(p_id,title,place,latitude,longitude,year,month,day) values (?,?,?,?,?,?,?,?)',
                [req.body.p_id, req.body.title,req.body.place,req.body.latitude,req.body.longitude,req.body.year,req.body.month,req.body.day], function (error, info) {

                if(error==null){ 
                        connection.query('insert into friend(s_id,f_p_id) values(?,?)', [info.insertId,req.body.p_id]);
                        var cnt=[req.body.friend.length];
                        for(var i=0; i<cnt; i++){
                                connection.query('select p_id from peole where phone=?', [req.body.friend(i).phone], function(error,cursor){
                                        if(cursor[0].p_id==null){
                                                connection.query('insert into people(name, phone,check values(?,?,0) where s_id=?',
                                                         [req.body.friend(i).name,req.body.friend(i).phone,info.insertId]);
                                        }
                                        else{
                                                connection.query('update friend set f_p_id=? where s_id=?',[cursor[0].p_id, info.insertId]);
                                        }
                                });
                        }
                connection.query('select schedule.s_id, schedule.p_id, title, place, latitude, longitude, year, month, day, friend.f_p_id, people.name, people.phone' +
                                'from schedule, friend,people where schedule.p_id=?, schedule.s_id=? and schedule.s_id=friend.s_id and friend.f_p_id=people.p_id',
                        [req.body.p_id,info.insertId],function(error,cursor){
                                res.json(cursor);
                        });
                }
        });

});

module.exports=router;

