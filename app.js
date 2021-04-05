//path
const path = require('path');
//express framework
const express = require('express');
//mongoose 
const mongoose  = require('mongoose');
//environment configuration
const dotenv= require('dotenv');
//logging requests
const morgan = require('morgan');
//template engine
const exphbs = require('express-handlebars')

const methodOverride = require('method-override');
const passport = require('passport');
const connectDB = require('./config/db'); 
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//path to  file containing environment variables
dotenv.config({
    path: './config/config.env'
});


require('./config/passport')(passport);

//DAtabase connection
connectDB();

//application port
const Port  = process.env.PORT || 5000; 

//using express framework
const app = express();

//helper functions
const {formatDate,stripTags,truncate, editIcon, select} = require('./helpers/hbs');


// Handlebars configuration
app.engine('.hbs', exphbs({helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
}, defaultLayout: 'main', extname: '.hbs'}));
// Setting view engine 
app.set('view engine', '.hbs');



app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());

// method override middleware
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

// Express session
app.use(session({
    secret: 'mystorybooks',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
  }))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res, next) {
    res.locals.user = req.user || null;
    next();
})
// to serve files from Static folder 
app.use(express.static(path.join(__dirname, 'public')))

// Routes 
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Listening requests on application port 
app.listen(Port, console.log(`Server running in ${process.env.NODE_ENV} mode
on port ${Port}...`));