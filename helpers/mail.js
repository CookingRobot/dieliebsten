var nodemailer   = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP", {
    host: "TODO", // hostname
    secureConnection: false, // use SSL
    port: 587, // port for secure SMTP
    auth: {
        user: "TODO",
        pass: "TODO"
    },
    tls: {
        ciphers:'SSLv3'
    }
});

exports.sendMail = function(mailOptions,callback) {
    smtpTransport.sendMail(mailOptions, function(error, response){
                      if(error){
                        console.log(error);
                        return callback("Etwas ist schiefgelaufen, wir kümmern uns.");
                      }else{
                       return callback("")
                      }
                    smtpTransport.close(); // shut down the connection pool, no more messages
    });
}