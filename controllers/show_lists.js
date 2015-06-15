
var helpers = require('../helpers/helpers.js');
var dbModule = require('../helpers/db.js');

exports.showAll = function(req,res){
  var name = req.params.theUser;
  dbModule.getUser(name,function(err,result){
      if(result.length==1) {
        var id = (result[0].id);
        var sqlString = 'SELECT * FROM `lists` WHERE `userid`="'+id+"\" ORDER BY `created` DESC;";
        dbModule.query(sqlString,function(err,result){
            var ranks = new Array();
            for (var i = 0; i < result.length; i++) {
              var urlString = "/von/"+name+"/"+result[i].title;
              var rank = new Array(decodeURIComponent(result[i].title),helpers.decomprise(result[i].content),urlString);
              ranks.push(rank);
            }
            res.render('show',{name:name,ranks:ranks,sid:req.session.sid});
        });
      }
      else {
        res.redirect('/404');
      }
  });
}



exports.showOne = function(req,res){
  var name = req.params.theUser;
  var listTitle = req.params.theList;
  listTitle = encodeURIComponent(listTitle);
  dbModule.getUser(name,function(err,result){
      if(result.length==1) {
        var id = (result[0].id);
        var sqlString = 'SELECT * FROM `lists` WHERE `userid`="'+id+'\" AND `title`=\"'+listTitle+'\"';
        dbModule.query(sqlString,function(err,result){
          if(result.length==1) {
            var myRanks = helpers.decomprise(result[0].content);
            var rank = new Array(decodeURIComponent(result[0].title),myRanks);
            var url = "/von/"+name+"/"
            res.render('showOne',{name:name,rank:rank,url:url,sid:req.session.sid});
          }
          else {
            res.redirect('/404');
          }
        });
      }
      else {
       res.redirect('/404');
      }
  });
}