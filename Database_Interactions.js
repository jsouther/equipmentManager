/***********************************************************
** Author:  Jacob Souther and Felicia Ottley
** Date: 3/9/19
************************************************************/
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

var mysql = require('./dbcon.js');
app.set('mysql', mysql);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 28944);
app.use('/static', express.static('public'));
app.use('/laptops', require('./laptops.js'));
app.use('/laptop_docs', require('./laptop_docs.js'));
app.use('/location', require('./location.js'));
app.use('/peripherals', require('./peripherals.js'));
app.use('/users', require('./users.js'));
app.use('/laptop_laptopdocs', require('./laptop_laptopdocs.js'));


app.listen(app.post('port'), function(){
	console.log("I'm listening");
});


//render the home (index) page
app.get('/index',function(req,res,next){

res.render('home');

		
});




app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') +'; press Ctrl-C to terminate.');
});
