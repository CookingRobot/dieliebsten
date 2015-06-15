var mysql  = require('mysql');
var bcrypt = require('bcrypt');

var connection= mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'liebsten_ranks'
});

exports.updatePWD = function(pwd,name,callback) {
  bcrypt.hash(pwd, 10, function(err, hash) {
      var sqlString = 'UPDATE `user` SET  `pwd`="'+hash+'", `created`=`created` WHERE `name`="'+name+'"';
      query(sqlString,function(err, result){
        return callback(err, result);
      })
   });
}

exports.checkPWD = function(pwd,name,callback) {
  getUser(name,function(err,result){
      if(result.length==1) {
        var thePwd = result[0].pwd;
        bcrypt.compare(pwd, thePwd, function(err, result) {
            if(result===true) {
              callback(err,true);
            }
            else {
              callback("Das eingegebene Passwort ist falsch.",false);
            }
      }); 
     }
     else {
      return callback("Der Nutzer existiert nicht.",result);
     }
  });
}



var query = function(queryString,callback) {
  connection.query(queryString, function(err, rows, fields) {
    if(err){ 
      console.log(err);
      callback("Datenbankfehler, wir kümmern uns.");
          }
        else {
            callback(err, rows);
        }
  });
}
exports.query = query;

var getUser = function(username, callback) {
  var sqlString = 'SELECT * FROM `user` WHERE `name`="'+username+"\"";
  query(sqlString,function(err, result){
    return callback(err,result);
  });
}
exports.getUser = getUser;  

