
var helpers = require('../helpers/helpers.js');
var dbModule = require('../helpers/db.js');
var bcrypt = require('bcrypt');
var URLSafeBase64 = require('urlsafe-base64');


exports.new = function(req,res) {
  var name = req.param("name");
  var mail = req.param("mail");
  var pwd1 = req.param("pwd1");
  var pwd2 = req.param("pwd2");
  var createUser = true;
  var urlsafe = URLSafeBase64.validate(name);

  if(helpers.checkMail(mail)==false) { res.send({error: 'Das ist keine E-Mail Adresse!'}); createUser = false;}
  else if(helpers.checkName(name)==false){res.send({error: 'Der Nutzername ist nicht  gültig. Bitte verwende nur ein Wort mit mehr als 2 Buchstaben.'});createUser = false;}
  else if(helpers.checkPWD(pwd1)==false){res.send({error: 'Das Passwort muss länger als 6 Zeichen sein.'});createUser = false;}
  else if(pwd2!==pwd1) {res.send({error: 'Die Passwörter stimmen nicht überein.'});createUser = false;}
  else if(urlsafe==false) {res.send({error: 'Der Benutzername darf keine Sonderzeichen und Leerzeichen enthalten.'});createUser = false;}

  if(createUser==true) {
  	dbModule.getUser(name,function(err,result){
    	if(result.length==0) {
        	bcrypt.hash(pwd1, 10, function(err, hash) {
        		var sqlString = 'INSERT INTO `user`(`name`,`mail`,`pwd`) VALUES ("'+name+'","'+mail+'","'+hash+'")';
            	dbModule.query(sqlString, function(err,result) {
            		if(err) res.send({error: ''});
            		else {
              			req.session.sid=name;
              			res.send({error: ''});
              		}
            	});
          });
      	}
      	else {
      		res.send({error: 'Der Nutzername ist leider schon vergeben.'});
      	}
  	});
  }
}


exports.login = function(req,res){
  var name = req.param("name");
  var pwd = req.param("thePwd");
  dbModule.checkPWD(pwd,name,function(err,result){
    if(err){res.send({error:err})}
    else {
      if(result==true){
        req.session.sid=name; 
        res.send({error:""});
      }
      else {
        res.send({error: 'Das Passwort ist falsch.'});
      }
    }
});
}


exports.logout = function(req,res) {
    delete req.session.sid;
    res.redirect("/");
}
