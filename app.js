var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// Setup
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', apiRouter);
app.use('/', indexRouter);

app.listen(3000, () => console.log('Server started'));