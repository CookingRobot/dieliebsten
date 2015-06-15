
var helpers = require('../helpers/helpers.js');
var dbModule = require('../helpers/db.js');
var mailModule = require('../helpers/mail.js');


exports.showSettings = function(req,res){
  	var name = req.session.sid;
  	dbModule.getUser(name,function(err,result){
		if(result.length==1) {
    	    var mail = result[0].mail;
   	     	res.render("settings",{name:name,mail:mail});
    	}
  	});
}


exports.changeMail = function(req,res) {
    var name = req.param("theName");
    var mail = req.param("theMail");
    var pwd  = req.param("thePwd");
    if(helpers.checkMail(mail)==false) {
        res.send({error: 'Die Mail Adresse ist nicht gültig.'});
    }
    else {
      dbModule.checkPWD(pwd,name,function(err,result){
        if(err){res.send({error:err})}
        else {
          if(result==true){
            var sqlString = 'UPDATE `user` SET `mail`="'+mail+'", `created`=`created` WHERE `name`="'+name+'"';
            dbModule.query(sqlString, function(err, result) {
                        if(err) {res.send({error: err});}
                        res.send({error: ''});
            });
          }
          else{
            res.send({error:err})
          }
        }
      })
    }
}


exports.changepwd = function(req,res) {
      var pwd = req.param("pwd");
      var pwd1 = req.param("pwd1");
      var pwd2  = req.param("pwd2");
      var name  = req.param("theName");
      var change=true;
      if(helpers.checkPWD(pwd1)==false){ res.send({error: 'Das neue Passwort muss länger als 6 Zeichen sein.'});change=false}
      else if (pwd1!==pwd2){res.send({error: 'Die Passwörter stimmen nicht überein.'});change=false}
      if(change==true) {
        dbModule.checkPWD(pwd,name,function(err,result){
          if(result==true) {
            dbModule.updatePWD(pwd,name,function(err,result){
                res.send({error: ''});
            });
          }
          else {
            res.send({error:err})
          }
        });
      }
      else {
        res.send('what???', 404);
      }

}

exports.deleteaccount = function(req,res) {
    var name = req.param("theName");
    var pwd  = req.param("thePwd");
    dbModule.checkPWD(pwd,name,function(err,result){
      console.log(result);
          if(result==true) {
              var sqlString = 'DELETE FROM `user` WHERE `name`="'+name+'"';
              dbModule.query(sqlString, function(err, result) {
                      console.log(result);
                res.send({error: ''});
            });
          }
          else {
            res.send({error:err})
          }
        });
}

exports.showFeedback = function(req,res){
  var name = req.session.sid;
  res.render("feedback",{name:name});
}

exports.sendFeedback = function(req,res){
  var name = req.session.sid;
  var content = req.param("content");
  dbModule.getUser(name,function(err,result){
  if(result.length==1) {
      var mail = result[0].mail;
      var emailText = "<h2>New Feedback from "+name+"</h2>"
                +"<h3>Sender Mail: "+mail+"</h3><hr>"
                +"<p><u>Content: </u><br>"+content+"</p>";
      var mailOptions = {
          from: "DieLiebsten Team <hallo@dieliebsten.de>", // sender address
          to: "hallo@dieliebsten.de", // list of receivers
          subject: "New feedback Message", // Subject line
          text: "New Feedback", // plaintext body
          html:  emailText
      }
      mailModule.sendMail(mailOptions,function(err){
        res.send({error:err});
      });
  }
  else {
  res.send('what???', 404);
  }
  })
}



exports.sendMail = function(req,res){
      var name = req.param("theName");
      dbModule.getUser(name,function(err,result){
        if(result.length==1) {
          var adress = result[0].mail;
          var emailText =  "Echt, du bist <b>super</b>. Vielen Dank, dass du DieLiebsten nutzt.<br> Wenn du Fragen hast, kannst du uns gerne kontaktieren.<br><br> Viele Grüße <br> Das DieLiebsten Team";
          var mailOptions = {
            from: "DieLiebsten Team <hallo@dieliebsten.de>", // sender address
            to: adress, // list of receivers
            subject: "Hallo!", // Subject line
            text: "Du bist super", // plaintext body
            html:  emailText
          }
          mailModule.sendMail(mailOptions,function(err){
            res.send({error:err});
          })
        }
        else {
          res.send('what???', 404);
        }
      });
}
