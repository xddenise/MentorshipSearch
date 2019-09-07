const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const oneHour = 1000*60*60;
const passport = require('passport');
const mongoose = require('mongoose');
const configFunc = require('./config/passport');
const flash = require('connect-flash');

//configure passport
configFunc(passport);

//mongoose connection
mongoose.connect('mongodb://localhost/bbDB', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoose connected!');
});

//listen on port
app.listen(port, function(){
  console.log('Express app listening on port ' + port);
});

//cookieParser
app.use(cookieParser());

//express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

//cookie parser
app.use(cookieParser());

//passport
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//set EJS
app.set('view engine', 'ejs');

//static files
app.use(express.static(path.join(__dirname, '/public')));

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/search', require('./routes/search'));
app.use('/profile', require('./routes/profile'));
