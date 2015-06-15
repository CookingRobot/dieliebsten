
var helpers = require('../helpers/helpers.js');
var dbModule = require('../helpers/db.js');


exports.create = function(req,res) {
  var name = req.param("theName");
  var listTitle  = req.param("title");
  var listTitle = encodeURIComponent(listTitle);
  var places=new Array(req.param("placeOne"),req.param("placeTwo"),req.param("placeThree"),req.param("placeFour"),req.param("placeFive"));
  var content = helpers.comprise(places); 
   var createList = true;
   if(listTitle.length>100) {res.send({error: 'Der Titel ist zu lang.'});createList = false; }
   else if(helpers.checkArray(places)==false) {res.send({error: 'Bitte überprüfe deine Einträge.'});createList = false;}
   if(createList==true) {
     dbModule.getUser(name,function(err,result){
       if(result.length==1) {
         var id = result[0].id;
         var sqlString = 'SELECT * FROM `lists` WHERE `userid`="'+id+'\" AND `title`=\"'+listTitle+'\"';
         dbModule.query(sqlString, function(err, result) {
           if(result.length==0) {
             sqlString = 'INSERT INTO `lists`(`userid`,`content`,`title`,`username`) VALUES ("'+id+'","'+content+'","'+listTitle+'","'+name+'")';
             dbModule.query(sqlString, function(err,result) {
                 if(err) res.send({error:err})
                 else res.send({error: ''});
             });
           }
           else {
             res.send({error: 'Diese Liste existiert bereits'});
           }
         });
       }
     });
   }
}


exports.show_edit = function(req,res){
  var name = req.param("theName");
  var listTitle = req.param("theTitle");
  listTitle = encodeURIComponent(listTitle);
  dbModule.getUser(name,function(err,result){
    if(result.length==1) {
      var id = (result[0].id);
      var sqlString = 'SELECT * FROM `lists` WHERE `userid`="'+id+'\" AND `title`=\"'+listTitle+'\"';
      dbModule.query(sqlString, function(err, result) {
        if(result.length==1) {
          res.render('edit',{name:name,title:decodeURIComponent(result[0].title),data:helpers.decomprise(result[0].content)})
        }
        else {
          res.send({error:error});
        }
      });
    }
    else {
      res.send("Fehler! Ein Techniker ist auf dem Weg zu ihnen");
    }
  });
}

exports.edit =   function(req,res){
  var name = req.param("theName");
  var listTitle  = encodeURIComponent(req.param("theTitle"));
  var places=new Array(req.param("placeOne"),req.param("placeTwo"),req.param("placeThree"),req.param("placeFour"),req.param("placeFive"));
  var content = helpers.comprise(places);
  var createList = true;
  if(helpers.checkArray(places)==false) {res.send({error: 'Bitte überprüfe deine Einträge.'});createList = false;}
            
  if(createList==true) {
    dbModule.getUser(name,function(err,result){
      if(result.length==1) {
        var id = result[0].id
        var sqlString = 'SELECT * FROM `lists` WHERE `userid`="'+id+'\" AND `title`=\"'+listTitle+'\"';
        dbModule.query(sqlString, function(err,result) {
          if(result.length==1) {
            sqlString = 'UPDATE `lists` SET `content`="'+content+'", `created`=`created`  WHERE `title`="'+listTitle+'"';
            dbModule.query(sqlString, function(err,result) {
              res.send({error: ''});
            });
          }
          else {
            res.send({error: 'Fehler! Wir kümmern uns.'});
          }
        });
      }
    });
  }
}

exports.delete = function(req,res){
  var name = req.param("theName");
  var listTitle = encodeURIComponent(req.param("theTitle"));
  dbModule.getUser(name,function(err,result){
    if(result.length==1) {
      var id = (result[0].id);
      var sqlString = 'DELETE FROM `lists` WHERE `userid`="'+id+'\" AND `title`=\"'+listTitle+'\"';
      dbModule.query(sqlString, function(err,result) {
        if(err) console.log(err);
        res.redirect('/');
      });
    }
  });  
}

exports.redirect = function(req,res){
      var name = req.param("theName");
      var listTitle = req.param("theTitle");
      listTitle = encodeURIComponent(listTitle);
      res.redirect('/von/'+name+"/"+listTitle);
  }