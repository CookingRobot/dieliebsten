var express = require('express');
var app = express();

 app.configure(function () {
    app.set('port', process.env.PORT || 3238);
    app.use(express.urlencoded())
    app.use(express.json())
    app.use( express.cookieParser() );
    app.use( express.session( { secret: 'whateverhd' } ) );
    app.use("/public", express.static(__dirname + '/public'));
    app.set('view engine', 'html');
    app.set('views', __dirname + '/templates');
});


var http = require('http');
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log("Our project, live on port " + app.get('port'));
});




var controllers = require('./controllers');
controllers.set(app);

