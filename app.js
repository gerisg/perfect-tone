var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');
var colorRouter = require('./routes/color');
var resultRouter = require('./routes/result');

var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/options', colorRouter);
app.use('/result', resultRouter);

app.listen(3000, () => console.log('Server started'));