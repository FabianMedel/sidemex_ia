require('dotenv').config()
var utils = require('./utils/utils');
var Response = require('./utils/classes');
var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const { json } = require('express');
var router = express.Router();
var app = express();
var sess;
let response;

// view engine setup
app.set('views', __dirname+ '/www');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('www'));
app.use(session({secret: 'sia_prueba',saveUninitialized: true,resave: true}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

function handleDisconnect(myconnection) {
  	myconnection.on('error', function(err) {
    	console.log('Re-connecting lost connection');
    	dcConnection.destroy();
   		dcConnection = utils.createConnection(utils.sia_local);
    	handleDisconnect(dcConnection);
    	dcConnection.connect();
  	});
}


app.get('/', async function(req,res){
	sess=req.session;
	console.log(sess);
	if(sess.logged){
		console.log("session´iniciada");
		handleDisconnect(dcConnection);
		res.redirect('/home');
	}else{
		console.log("index");
		res.render('sidemexia.ejs');
	}
});

app.post('/auth',async function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	req.session.logged = false;

	if (username && password) {
		dcConnection = await utils.createConnection(utils.sia_local);
		splashResponse = await utils.signin(dcConnection,username,password,req);
		res.json(splashResponse)
		res.end();
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.get('/home', function(req, res) {
	sess=req.session;
	if(sess.logged){
		res.render('home.ejs');
	}else{
		res.send('Please login to view this page!');
	}
});



app.get('/logout',function(req,res){
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

var server = app.listen(process.env.PORT, function(){
	console.log('server running on ' + process.env.PORT);
});

app.get('/index', (req, res) => {
 res.render("index")
})