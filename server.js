const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const flash=require('connect-flash');
const session=require('express-session');
const bodyParser = require('body-parser');
const passport=require('passport');
const methodOverride = require('method-override')
var paginate = require('handlebars-paginate');



app.use('',express.static(path.join(__dirname, '/static/')));
app.use('',express.static(path.join(__dirname, '/node_modules/')));
app.use('',express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-free/')));
app.use('',express.static(path.join(__dirname, '/node_modules/jquery/dist/')));

require('./config/passport')(passport);

const {if_equal, for_loop, incr} = require('./helpers/helpers');


// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    if_equal: if_equal,
    for_loop: for_loop,
    paginate: paginate,
    incr: incr,
  },
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

const index = require('./routes/index.route');
const users = require('./routes/userslogin.route');
const roles = require('./routes/roles.route');
const members = require('./routes/members.route');
const countries = require('./routes/countries.route');

const locations = require('./routes/locations.route');

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10mb'
}));
app.use(bodyParser.json());
// Method override middleware
app.use(methodOverride('_method'));

app.use('/', index);
app.use('/users', users);
app.use('/', roles);
app.use('/', members);
app.use('/', countries);
app.use('/', locations);

app.use(function(req, res, next){
  res.status(404).render('index/404', {layout: false, error:" Page not found", title: "Sorry, page not found"});
});

// const http=require('http');
// const server=http.createServer((req, res)=>{
	
//   if (req.url==="/iclock/cdata?SN=AAML185260024&options=all&pushver=2.32&language=69"){
// 		console.log(res.statusCode);
//     res.end();
//   }
// }).listen(5000);


const port = 5000;
app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});