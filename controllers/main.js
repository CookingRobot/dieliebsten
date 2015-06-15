
var helpers = require('../helpers/helpers.js');
var dbModule = require('../helpers/db.js');





exports.showMain = function(req, res){
    var name = req.session.sid;
    if(!req.session.sid) {
      res.render('main');
    }
    else  {
      dbModule.getUser(name,function(err,result){
        if(result.length==1) {
          var mail = (result[0].mail);
          var id = (result[0].id);
          var sqlString = 'SELECT * FROM `lists` WHERE `userid`="'+id+"\"";
          dbModule.query(sqlString, function(err, result) {
            var ranks = new Array();
            for (var i = 0; i < result.length; i++) {
              var rank = new Array(decodeURIComponent(result[i].title),helpers.decomprise(result[i].content));
              ranks.push(rank);
            }
            res.render('loginarea',{name:name,mail:mail,url:"/von/"+name,ranks:ranks});
          });
        }
        else {
          res.send('what???', 404);
        }
    });
  }
}

//TODO::::



exports.showNews = function(req,res){  
  var name = req.session.sid;
  dbModule.getUser(name,function(err,result){
    if(result.length==1) {
      var id = result[0].id;
      var sqlString = "SELECT * FROM (SELECT name, null, created FROM user WHERE `id` <> "+id+" UNION SELECT username, title, created FROM lists WHERE `userid` <> "+id+") entries ORDER BY created DESC LIMIT 0, 20";
      dbModule.query(sqlString, function(err, result) {
      if(result.length>0) {
        var result_items = new Array();
        for (var i = 0; i < result.length; i++) {
          if(result[i].NULL ==null){
            //Type = New User
            var url = "/von/"+result[i].name;
            var result_array = new Array("person",result[i].name,url);
            result_items.push(result_array);
          }
          else {
            //Type = New List
            var url = "/von/"+result[i].name+"/"+result[i].NULL;
            var urlUser = "/von/"+result[i].name+"/";
            var result_array = new Array("list",decodeURIComponent(result[i].NULL),result[i].name,url,urlUser);
            result_items.push(result_array);
          }
        }
        if(result_items.length>0) {
          res.render('dash',{items:result_items,name:name});
        }
        else {
          res.render('dash');
        }
      }
      });
    }
    else {
      res.redirect('/');
    }
  });
}
