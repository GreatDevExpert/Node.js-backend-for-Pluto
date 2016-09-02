'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _configDatabase = require('./config/database');

var _configDatabase2 = _interopRequireDefault(_configDatabase);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _apiCommonLog = require('./api/common/log');

var _apiCommonLog2 = _interopRequireDefault(_apiCommonLog);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var env = process.env.NODE_ENV || 'development';
console.log("Environment: ", env);

var config = require('./config/config')[env];
var app = (0, _express2['default'])();

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err);
    console.dir(err);
});

process.on('uncaughtRejection', function (err) {
    console.log('uncaughtRejection', err);
});

app.set('superSecret', config.secret);
app.use((0, _morgan2['default'])('short', { stream: _apiCommonLog2['default'].asStream('info') }));

app.use(_express2['default']['static']('./public'));
app.use('/uploads', _express2['default']['static'](__dirname + '/uploads'));

app.use((0, _cors2['default'])());

app.use(_bodyParser2['default'].urlencoded({ extended: false }));
app.use(_bodyParser2['default'].json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Acncess-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

require('./config/passport')(_passport2['default']);

app.use(_passport2['default'].initialize());
app.use(_passport2['default'].session());
app.use(function (req, res, next) {
    res.set('X-Powered-By', 'Pluto');
    next();
});

require('./config/routes')(app, _passport2['default']);

app.use(function (err, req, res, next) {
    if (err) {
        console.log(err);
        if (typeof err.status != "undefined") res.status(err.status);
        res.send(err);
    }
});

app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});

app.listen(process.env.PORT || 3300);

if (process.env.PORT === undefined) {
    console.log("Server Started at port : " + 3300);
} else {
    console.log("Server Started at port : " + process.env.PORT);
}