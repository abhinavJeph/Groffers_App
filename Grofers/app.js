const path = require('path')
const express = require('express')
const session = require('express-session');
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');

// Load config
dotenv.config({ path: './config/config.env' })

const PORT = process.env.PORT || 3000

connectDB()

const app = express()

// Passport Config
require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, './assets')));

// EJS
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/users.js'));

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)