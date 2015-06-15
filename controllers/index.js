module.exports.set = function(app) {


var consolidate = require('consolidate');
var swig = require('swig');
app.engine('.html', consolidate.swig);

var show_lists = require('./show_lists.js');
app.get('/von/:theUser',show_lists.showAll);
app.get('/von/:theUser/:theList',show_lists.showOne);


var forgot = require('./forgot.js');
app.get('/vergessen',forgot.showForgot);
app.post('/vergessen',forgot.createTicket);
app.get('/reset/:ticket',forgot.showNewPwd);
app.post('/newpwd',forgot.newPwd);

var  settings = require('./settings.js');
app.get('/einstellungen',checkUserGet,settings.showSettings);
app.post('/changemail',checkUser,settings.changeMail);
app.post('/changepwd',checkUser,settings.changepwd);
app.post('/deleteaccount',checkUser, settings.deleteaccount);
app.post('/sendmail',checkUser,settings.sendMail);
app.get('/feedback',checkUserGet,settings.showFeedback);
app.post('/sendfeedback',settings.sendFeedback);

var main = require('./main.js');
app.get('/', main.showMain);
app.get('/neuigkeiten',checkUserGet,main.showNews);

var user = require('./user.js');
app.post('/new', user.new);
app.post('/login',user.login);
app.post('/logout',user.logout);
app.get('/logout',user.logout);

var list = require('./list.js')
app.post('/newlist',checkUser,list.create);
app.post('/bearbeiten',checkUser,list.show_edit);
app.post('/editlist',checkUser,list.edit);
app.post('/deletelist',checkUser,list.delete); 
app.post('/visitlist',list.redirect);
app.get('/bearbeiten',checkUser,function(req,res){res.redirect("/");});
  

app.get('/impressum',function(req,res){res.render('impressum');});
app.all("*", function (req, res, next) {res.render('404');});



//////////////////////MIDDLEWARE/////////////////////////////
function checkUser(req, res, next) {
    var name = req.param("theName");
    if(req.session.sid==name) {
    next();
  }
  if((!req.session.sid)&&(req.session.sid!=name)) {
    res.redirect('/');
  }
}
function checkUserGet(req,res,next) {
  var name = req.session.sid;
   if((!name)||(name==null)) {
       res.redirect('/');
    }
  else {
    next();
  }
}
///////////////////////////////////////////////////////////////
}