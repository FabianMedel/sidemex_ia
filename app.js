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
	let username = req.body.username;
	let password = req.body.password;
	req.session.logged = false;

	if (username && password) {
		dcConnection = await utils.createConnection(utils.sia_local);
		splashResponse = await utils.login(dcConnection,username,password,req);
		res.json(splashResponse)
		res.end();
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});


app.post('/signin', async function(req, res){
	let userName = req.body.username;
	let lastName = req.body.last_name;
	let email = req.body.mail;
	let password = req.body.password;
	
	if (userName && password && lastName && email) {
		dcConnection = await utils.createConnection(utils.sia_local);
		splashResponse = await utils.signin(dcConnection,userName,lastName,email,password);
		res.json(splashResponse)
		res.end();
	}
});

app.get('/home',async function(req, res) {
	sess=req.session;
	console.log(sess)
	if(sess.logged){
		res.render('home.ejs');
	}else{
		res.send('Please login to view this page!');
	}
});

app.get('/antecedentes-sidemexia',async function(req, res) {
	res.render('antecedentes-sidemexia.ejs');
});

app.get('/como-funciona',async function(req, res) {
	res.render('como-funciona.ejs');
});

app.get('/admin-user',async function(req, res) {
	res.render('admin-user.ejs');
});


app.get('/logout',async function(req,res){
	req.session.destroy(async function(err){
		if(err){
			console.log(err);
		} else {
			console.log("aui perro")
			res.redirect('/');
		}
	});
});

var server = app.listen(process.env.PORT, function(){
	console.log('server running on ' + process.env.PORT);
});

/*app.get('/index', (req, res) => {
 res.render("index")
})*/