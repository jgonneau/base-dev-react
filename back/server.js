const	express			= require('express'),
		app				= express(),
		session			= require('express-session'),
		MongoStore		= require('connect-mongo')(session),
		path			= require('path'),
		engine			= require('ejs-mate'),
		cookieParser	= require('cookie-parser'),
		bodyParser		= require('body-parser'),
		server			= require('http').createServer(app),
		s3cr3t			= "0987654321",
        lport = process.env.PORT || 9999;

//Creation de routes
app.get('/', function(req, res) {
    res.send('home');
})
.use(function(req, res, next) {
    res.send('<p>404</p>');
});


//Demarrage de serveur:
server.listen(lport, function() {
    console.log('Server starting... on '+lport+'.\n');
});
