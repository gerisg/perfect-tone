var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var colorRouter = require('./routes/color');
var resultRouter = require('./routes/result');
var rulesRouter = require('./routes/rules');
var feedbackRouter = require('./routes/feedback');

var app = express();

// Setup
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/options', colorRouter);
app.use('/result', resultRouter);
app.use('/rules', rulesRouter);
app.use('/feedback', feedbackRouter);

app.listen(3000, () => console.log('Server started'));