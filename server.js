
/**
 * Module dependencies.
 */

var express = require('express'),
	swig = require('swig'),
    app = module.exports = express.createServer();

// Configuration
app.configure(function(){
	swig.init({
		root: __dirname + '/views',
		allowErrors: true
	});
	app.set('views', __dirname + '/views');
	app.register('.html', swig);
	app.set('view engine', 'html');
	app.set('view options', {
		layout: false,
	});
	app.set('view cache', false);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes
var controller = require('./controllers/index.js');
app.get('/', controller.index);
app.get('/search/', controller.search);

app.listen(process.env.C9_PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
