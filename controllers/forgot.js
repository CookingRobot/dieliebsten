
var helpers = require('../helpers/helpers.js');
var dbModule = require('../helpers/db.js');
var mailModule = require('../helpers/mail.js');


exports.showForgot = function(req,res){
  res.render('forgot');  
}



exports.createTicket = function(req,res){
  var name = req.param("theName");
  var mail = req.param("theMail");

  checkUserAndTicket(res,name,mail);
}

function checkUserAndTicket(res,name,mail) {
  dbModule.getUser(name,function(err,result){
       if(err) {res.send({error:err})}
       if(result.length==1) {
         var dbmail = result[0].mail;
         if(mail==dbmail) {
            sqlString = 'SELECT * FROM `reset_tickets` WHERE name=\''+name+'\';';
            dbModule.query(sqlString,function(err,result){
                if(result.length>0) {
                  console.log("More than one entry; going to delte");
                  sqlString = 'DELETE FROM `reset_tickets` WHERE name=\''+name+'\';';
                  dbModule.query(sqlString,function(result){
                      addTicket(res,name,mail);
                  })
                }
                else {
                  addTicket(res,name,mail);
              }
            });           
         }
         else {
            res.send({error: 'Die Mail Adresse ist falsch'});
         }
      }
     else {
       res.send({error: 'Der Benutzer existiert nicht'});
     }
  });
} 


function addTicket(res,name,mail) {
    var ticketKey = helpers.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    var mailText = "Hallo,<br>Mit dem folgenden Link kannst du dir ein neues Passwort erstellen. Bitte beachte, dass der Link nur 30 Minuten gültig ist.<br><br><a href=\"http://www.dieliebsten.de/reset/"+ticketKey+"/\">www.dieliebsten/reset/"+ticketKey+"/</a><br><br>Viel Spaß<br>Das DieLiebsten Team";
    var sqlString = 'INSERT INTO `reset_tickets`(`ticketID`, `name`) VALUES (\''+ticketKey+'\',\''+name+'\');';
    dbModule.query(sqlString,function(err, result){
         if (result.length>0) console.log(ŕesult);  
          var mailOptions = {
              from: "DieLiebsten Team <hallo@dieliebsten.de>", // sender address
              to: mail, // list of receivers
              subject: "Passwort vergessen?", // Subject line
              html:  mailText
          }
          var result = mailModule.sendMail(mailOptions,function(theError){
          res.send({error: theError});
      });

    });
}

exports.showNewPwd = function(req,res){
  var ticket = req.params.ticket;
  res.render("newpwd",{ticket:ticket});
  //Render Page for entering new pwd; ticket inside hidden input type; will post /newpwd
}

exports.newPwd = function(req,res){
  var name = req.param("theName");
  var pwd1 = req.param("pwd1");
  var pwd2 = req.param("pwd2");
  var ticket = req.param("theTicket");

  var createPWD = true;
  if(helpers.checkPWD(pwd1)==false){
    res.send({error: 'Das Passwort muss länger als 6 Zeichen sein.'});
    createPWD = false;}
  else if(pwd2!==pwd1) {
    res.send({error: 'Die Passwörter stimmen nicht überein.'});
    createPWD = false;}

  if(createPWD==true) {
    checkValidTicket(res,name,pwd1,ticket);
    //Will Call updatePWD, when valid
  }
}

function checkValidTicket (res,name,pwd,ticket) {
  var sqlString = 'SELECT `ticketID`, UNIX_TIMESTAMP(`created`) AS `created`  FROM `reset_tickets` WHERE name=\''+name+'\';';
  dbModule.query(sqlString,function(err, result){
      console.log(result);
        if(result.length==1) {
         var dbTicket = result[0].ticketID;
         console.log("db: "+dbTicket+"--- URL:"+ticket);
          if(dbTicket==ticket) {
              var created = new Date(result[0].created*1000);
              var now = new Date();
              var timeDiff = Math.abs(now.getTime() - created.getTime());
              var minutesDiff =Math.ceil(timeDiff / (1000 * 60));
              if(minutesDiff<=45) {
                  dbModule.updatePWD(pwd,name,function(err,result){
                    if(!err) res.send({error: ""});
                  });
              }
              else {
                res.send({error: 'Dein Rücksetzungslink ist ungültig. Bitte fordere unter: <a href="http://www.dieliebsten.de/vergessen">dieliebsten.de/vergessen</a> einen neuen an.'});
              }
             }
          else {
             res.send({error: 'Bitte fordere zuerst deinen Rücksetzungslink an. Besuche dazu www.dieliebsten/vergessen'});
          }
      }
      else {
        res.send({error: 'Bitte fordere zuerst deinen Rücksetzungslink an. Besuche dazu www.dieliebsten/vergessen'});
      }
  });
}

